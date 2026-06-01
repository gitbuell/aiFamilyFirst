-- aiFamilyFirst Phase 2 — gated PHI schema.
-- Isolated database (aff_phi), separate from the shared enterprise-postgres.
-- HIPAA controls: per-user accounts, server-side RBAC, append-only audit, encrypted PHI.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---- Users: unique per-user accounts; identity verified, role NOT self-selected ----
-- HIPAA §164.312(a)(1) access control, §164.312(d) person/entity authentication.
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL,
  role          VARCHAR(20) NOT NULL CHECK (role IN ('patient','parent','np','admin')),
  full_name     TEXT NOT NULL,
  password_hash TEXT NOT NULL,                         -- scrypt: N$r$p$salt$hash (no plaintext)
  disabled      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ
);
-- case-insensitive unique email without requiring the citext extension
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_uniq ON users (lower(email));

-- ---- Sessions: opaque server-side tokens (revocable) + idle/absolute timeout ----
-- HIPAA §164.312(a)(2)(iii) automatic logoff.
CREATE TABLE IF NOT EXISTS sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash    TEXT NOT NULL UNIQUE,                  -- sha256 of bearer token; raw token never stored
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at    TIMESTAMPTZ NOT NULL,                  -- absolute timeout
  revoked_at    TIMESTAMPTZ,
  ip            INET,
  user_agent    TEXT
);
CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);

-- ---- Patients + care team: server-side RBAC scoping ----
-- HIPAA §164.308(a)(4): who may access which patient is enforced in the API via this table.
CREATE TABLE IF NOT EXISTS patients (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name  TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS care_team (
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  patient_id    UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  relation      VARCHAR(20) NOT NULL CHECK (relation IN ('self','parent','np')),
  PRIMARY KEY (user_id, patient_id)
);

-- ---- PHI intake: payload stored ENCRYPTED (AES-256-GCM), never plaintext ----
-- HIPAA §164.312(a)(2)(iv) encryption at rest. Media (photo/audio) bytes live in a
-- private encrypted object store, NOT here and NOT the public aibuell-media/CDN —
-- this row holds an encrypted payload/reference + metadata only.
CREATE TABLE IF NOT EXISTS phi_intake (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  source        VARCHAR(20) NOT NULL CHECK (source IN ('audio','email','notes','photo','manual')),
  ciphertext    TEXT NOT NULL,                         -- base64(iv || authTag || ciphertext)
  status        VARCHAR(20) NOT NULL DEFAULT 'received'
                  CHECK (status IN ('received','extracted','synthesized','approved','distributed','halted')),
  created_by    UUID NOT NULL REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS phi_intake_patient_idx ON phi_intake(patient_id);

-- ---- Append-only audit log: every PHI access/change is attributable ----
-- HIPAA §164.312(b) audit controls. Enforced append-only by trigger.
CREATE TABLE IF NOT EXISTS audit_log (
  id            BIGSERIAL PRIMARY KEY,
  actor_user_id UUID,
  actor_role    VARCHAR(20),
  action        VARCHAR(40) NOT NULL,                  -- login, phi.read, phi.create, phi.distribute, ...
  resource_type VARCHAR(40),
  resource_id   UUID,
  patient_id    UUID,
  ip            INET,
  user_agent    TEXT,
  detail        JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_log_created_idx ON audit_log(created_at);
CREATE INDEX IF NOT EXISTS audit_log_patient_idx ON audit_log(patient_id);

CREATE OR REPLACE FUNCTION audit_log_no_mutate() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only; % is not permitted', TG_OP;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS audit_log_no_update ON audit_log;
CREATE TRIGGER audit_log_no_update BEFORE UPDATE OR DELETE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION audit_log_no_mutate();

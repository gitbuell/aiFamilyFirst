-- aiFamilyFirst Phase 2 — ICM pipeline stage artifacts on phi_intake.
-- Each stage output is stored ENCRYPTED (same AES-256-GCM envelope as the raw payload).
-- The human-approval gate and emergency escalation are tracked here.

ALTER TABLE phi_intake
  ADD COLUMN IF NOT EXISTS extracted_ciphertext    TEXT,        -- stage 2 output (encrypted)
  ADD COLUMN IF NOT EXISTS synthesized_ciphertext  TEXT,        -- stage 3 draft (encrypted)
  ADD COLUMN IF NOT EXISTS alerts                  JSONB,       -- emergency-escalation flags (non-PHI markers)
  ADD COLUMN IF NOT EXISTS reviewer_note           TEXT,        -- NP note on approve/reject
  ADD COLUMN IF NOT EXISTS reviewed_by             UUID REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS reviewed_at             TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS distributed_at          TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS model_used              VARCHAR(60); -- provenance: which LLM/model produced the draft

// Authentication, session timeout, and server-side RBAC.
// HIPAA §164.312(a)(1) access control, (a)(2)(iii) automatic logoff,
//       (d) entity authentication, §164.308(a)(4) role-based access.
import type { Request, Response, NextFunction } from 'express';
import { pool } from '../db';
import { sha256 } from '../lib/crypto';
import type { AuthUser } from '../types';

const IDLE_MIN = Number(process.env.SESSION_IDLE_TIMEOUT_MIN) || 15;

// Verifies the bearer token, enforces idle + absolute timeout, attaches req.user.
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.get('authorization') || '';
  const m = header.match(/^Bearer\s+(.+)$/i);
  if (!m) return res.status(401).json({ error: 'missing bearer token' });

  const tokenHash = sha256(m[1]);
  const { rows } = await pool.query(
    `SELECT s.id AS session_id, s.last_seen_at, s.expires_at, s.revoked_at,
            u.id, u.role, u.email, u.disabled
       FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = $1`,
    [tokenHash]
  );
  const row = rows[0];
  if (!row || row.revoked_at) return res.status(401).json({ error: 'invalid session' });
  if (row.disabled) return res.status(403).json({ error: 'account disabled' });

  const now = Date.now();
  if (new Date(row.expires_at).getTime() < now) {
    return res.status(401).json({ error: 'session expired (absolute timeout)' });
  }
  const idleMs = now - new Date(row.last_seen_at).getTime();
  if (idleMs > IDLE_MIN * 60_000) {
    await pool.query(`UPDATE sessions SET revoked_at = now() WHERE id = $1`, [row.session_id]);
    return res.status(401).json({ error: 'session expired (idle timeout)' });
  }

  // Sliding idle window.
  await pool.query(`UPDATE sessions SET last_seen_at = now() WHERE id = $1`, [row.session_id]);

  const user: AuthUser = { id: row.id, role: row.role, email: row.email, sessionId: row.session_id };
  req.user = user;
  next();
}

// Role gate. Use AFTER requireAuth.
export function requireRole(...roles: AuthUser['role'][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'unauthenticated' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'forbidden' });
    next();
  };
}

// Patient-scoping: the user must be on the patient's care team (or admin).
// Prevents one family/NP from reading another patient's PHI.
export async function requirePatientAccess(req: Request, res: Response, next: NextFunction) {
  const patientId = req.params.patientId || req.body?.patientId;
  if (!req.user) return res.status(401).json({ error: 'unauthenticated' });
  if (!patientId) return res.status(400).json({ error: 'patientId required' });
  if (req.user.role === 'admin') return next();

  const { rowCount } = await pool.query(
    `SELECT 1 FROM care_team WHERE user_id = $1 AND patient_id = $2`,
    [req.user.id, patientId]
  );
  if (!rowCount) return res.status(403).json({ error: 'not on this patient care team' });
  next();
}

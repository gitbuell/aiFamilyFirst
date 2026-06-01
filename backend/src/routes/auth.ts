// Auth routes: register (admin-provisioned), login, logout.
// Roles are assigned by an admin — never self-selected (no demo role buttons).
import { Router } from 'express';
import { pool } from '../db';
import { hashPassword, verifyPassword, newSessionToken } from '../lib/crypto';
import { requireAuth, requireRole } from '../middleware/auth';
import { audit } from '../lib/audit';

const router = Router();
const ABS_HOURS = Number(process.env.SESSION_ABSOLUTE_TIMEOUT_HOURS) || 12;

// Admin provisions accounts. (Open self-registration is intentionally NOT offered for a PHI system.)
router.post('/register', requireAuth, requireRole('admin'), async (req, res) => {
  const { email, password, role, fullName } = req.body || {};
  if (!email || !password || !role || !fullName) {
    return res.status(400).json({ error: 'email, password, role, fullName required' });
  }
  if (!['patient', 'parent', 'np', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'invalid role' });
  }
  if (String(password).length < 12) {
    return res.status(400).json({ error: 'password must be at least 12 characters' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, role, full_name)
       VALUES ($1,$2,$3,$4) RETURNING id`,
      [email, hashPassword(password), role, fullName]
    );
    await audit(req, { action: 'user.create', resourceType: 'user', resourceId: rows[0].id, detail: { role } });
    res.status(201).json({ id: rows[0].id });
  } catch (err: any) {
    if (err.code === '23505') return res.status(409).json({ error: 'email already exists' });
    throw err;
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const { rows } = await pool.query(
    `SELECT id, role, email, password_hash, disabled FROM users WHERE lower(email) = lower($1)`,
    [email]
  );
  const u = rows[0];
  // Constant-ish path: verify even when user missing is acceptable here; avoid leaking which failed.
  if (!u || u.disabled || !verifyPassword(password, u.password_hash)) {
    await audit(req, { action: 'login.fail', detail: { email } });
    return res.status(401).json({ error: 'invalid credentials' });
  }

  const { token, tokenHash } = newSessionToken();
  const { rows: srows } = await pool.query(
    `INSERT INTO sessions (user_id, token_hash, expires_at, ip, user_agent)
     VALUES ($1,$2, now() + ($3 || ' hours')::interval, $4, $5) RETURNING id`,
    [u.id, tokenHash, String(ABS_HOURS), req.ip ?? null, req.get('user-agent') ?? null]
  );
  await pool.query(`UPDATE users SET last_login_at = now() WHERE id = $1`, [u.id]);

  req.user = { id: u.id, role: u.role, email: u.email, sessionId: srows[0].id };
  await audit(req, { action: 'login', detail: { sessionId: srows[0].id } });

  res.json({ token, role: u.role, expiresInHours: ABS_HOURS });
});

router.post('/logout', requireAuth, async (req, res) => {
  await pool.query(`UPDATE sessions SET revoked_at = now() WHERE id = $1`, [req.user!.sessionId]);
  await audit(req, { action: 'logout' });
  res.json({ ok: true });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ id: req.user!.id, role: req.user!.role, email: req.user!.email });
});

export default router;

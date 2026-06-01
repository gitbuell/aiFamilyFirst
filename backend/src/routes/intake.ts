// Gated PHI intake — demonstrates the compliant pattern every PHI route must follow:
//   phiGate -> requireAuth -> requireRole/requirePatientAccess -> encrypt -> audit.
// This is the secure replacement for the demo's localStorage submission queue.
import { Router } from 'express';
import { pool } from '../db';
import { encryptPHI, decryptPHI } from '../lib/crypto';
import { phiGate } from '../middleware/phiGate';
import { requireAuth, requireRole, requirePatientAccess } from '../middleware/auth';
import { audit } from '../lib/audit';

const router = Router();

// Every route here is gated, authenticated, and patient-scoped.
router.use(phiGate, requireAuth);

// Create an intake record (audio/email/notes/photo/manual). Payload encrypted at rest.
router.post('/:patientId', requirePatientAccess, async (req, res) => {
  const { patientId } = req.params;
  const { source, payload } = req.body || {};
  if (!['audio', 'email', 'notes', 'photo', 'manual'].includes(source)) {
    return res.status(400).json({ error: 'invalid source' });
  }
  if (typeof payload !== 'string' || !payload) {
    return res.status(400).json({ error: 'payload (string) required' });
  }
  const { rows } = await pool.query(
    `INSERT INTO phi_intake (patient_id, source, ciphertext, created_by)
     VALUES ($1,$2,$3,$4) RETURNING id, status, created_at`,
    [patientId, source, encryptPHI(payload), req.user!.id]
  );
  await audit(req, { action: 'phi.create', resourceType: 'phi_intake', resourceId: rows[0].id, patientId, detail: { source } });
  res.status(201).json(rows[0]);
});

// List intake metadata for a patient (no decryption — metadata only).
router.get('/:patientId', requirePatientAccess, async (req, res) => {
  const { patientId } = req.params;
  const { rows } = await pool.query(
    `SELECT id, source, status, created_at FROM phi_intake WHERE patient_id = $1 ORDER BY created_at DESC`,
    [patientId]
  );
  await audit(req, { action: 'phi.list', resourceType: 'phi_intake', patientId, detail: { count: rows.length } });
  res.json(rows);
});

// Read + decrypt a single record. NP/admin only — every read is audited.
router.get('/:patientId/:id', requirePatientAccess, requireRole('np', 'admin'), async (req, res) => {
  const { patientId, id } = req.params;
  const { rows } = await pool.query(
    `SELECT id, source, status, ciphertext, created_at FROM phi_intake WHERE id = $1 AND patient_id = $2`,
    [id, patientId]
  );
  if (!rows[0]) return res.status(404).json({ error: 'not found' });
  await audit(req, { action: 'phi.read', resourceType: 'phi_intake', resourceId: id, patientId });
  const { ciphertext, ...meta } = rows[0];
  res.json({ ...meta, payload: decryptPHI(ciphertext) });
});

export default router;

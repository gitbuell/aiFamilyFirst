// ICM pipeline routes — NP-driven, gated, audited.
// process: run extraction+synthesis; draft: review; approve/reject: the human gate.
import { Router } from 'express';
import { phiGate } from '../middleware/phiGate';
import { requireAuth, requireRole, requirePatientAccess } from '../middleware/auth';
import { audit } from '../lib/audit';
import { processIntake, getDraft, approve, reject } from '../lib/pipeline';

const router = Router();

// All pipeline ops are gated, authenticated, patient-scoped, and NP/admin-only.
router.use(phiGate, requireAuth);

// Run extraction -> synthesis. Halts at 'synthesized' (or 'halted' on escalation) for review.
router.post('/:patientId/:id/process', requirePatientAccess, requireRole('np', 'admin'), async (req, res) => {
  const { patientId, id } = req.params;
  const result = await processIntake(id);
  await audit(req, {
    action: result.status === 'halted' ? 'pipeline.escalated' : 'pipeline.process',
    resourceType: 'phi_intake', resourceId: id, patientId, detail: { status: result.status, alerts: result.alerts },
  });
  res.json(result);
});

// NP reads the decrypted synthesis draft for review.
router.get('/:patientId/:id/draft', requirePatientAccess, requireRole('np', 'admin'), async (req, res) => {
  const { patientId, id } = req.params;
  const draft = await getDraft(id);
  await audit(req, { action: 'pipeline.draft.read', resourceType: 'phi_intake', resourceId: id, patientId });
  res.json(draft);
});

// Human-approval gate: approve -> distribute.
router.post('/:patientId/:id/approve', requirePatientAccess, requireRole('np', 'admin'), async (req, res) => {
  const { patientId, id } = req.params;
  await approve(id, req.user!.id, req.body?.note);
  await audit(req, { action: 'pipeline.approve', resourceType: 'phi_intake', resourceId: id, patientId });
  res.json({ status: 'distributed' });
});

router.post('/:patientId/:id/reject', requirePatientAccess, requireRole('np', 'admin'), async (req, res) => {
  const { patientId, id } = req.params;
  await reject(id, req.user!.id, req.body?.note);
  await audit(req, { action: 'pipeline.reject', resourceType: 'phi_intake', resourceId: id, patientId, detail: { note: req.body?.note ?? null } });
  res.json({ status: 'halted' });
});

export default router;

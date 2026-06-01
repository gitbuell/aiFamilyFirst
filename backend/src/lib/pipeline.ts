// ICM pipeline engine — the DB-driven replacement for icm_watcher.py's folder watcher.
// Stages advance the phi_intake.status column; every stage output is encrypted at rest.
// The human-approval gate (NP) lives in routes/pipeline.ts; emergency escalation halts here.
import { pool } from '../db';
import { encryptPHI, decryptPHI } from './crypto';
import { getProvider } from './llm';
import { contracts } from './contracts';

export interface StageResult {
  status: string;
  alerts: string[];
}

// Detect emergency-escalation markers in synthesis output (HIPAA-adjacent safety gate from
// ROUTING.md: allergy conflict / drug interaction / suspicious dosage / missing critical info).
function detectAlerts(synthesis: string): string[] {
  const alerts: string[] = [];
  if (/⛔|SYSTEM ALERT|HALT/i.test(synthesis)) alerts.push('synthesis_flagged');
  if (/interaction/i.test(synthesis)) alerts.push('drug_interaction');
  if (/allerg/i.test(synthesis)) alerts.push('allergy_conflict');
  return [...new Set(alerts)];
}

// Stage 2 (extraction, temp 0.0) -> Stage 3 (synthesis, temp 0.2). Chained, mirroring the
// original watcher, but halting at 'synthesized' (or 'halted') for NP review — never auto-distribute.
export async function processIntake(intakeId: string): Promise<StageResult> {
  const { rows } = await pool.query(
    `SELECT id, ciphertext, status FROM phi_intake WHERE id = $1`,
    [intakeId]
  );
  const intake = rows[0];
  if (!intake) throw new Error('intake not found');
  if (!['received', 'extracted'].includes(intake.status)) {
    throw new Error(`intake is '${intake.status}'; can only process from received/extracted`);
  }

  const provider = getProvider();
  const c = contracts();
  const rawText = decryptPHI(intake.ciphertext);

  // ---- Stage 2: Extraction (deterministic) ----
  const extracted = await provider.generate({
    stage: 'extraction',
    systemInstruction: c.extraction,
    prompt: rawText,
    temperature: 0.0,
  });
  await pool.query(
    `UPDATE phi_intake SET extracted_ciphertext = $2, status = 'extracted', model_used = $3 WHERE id = $1`,
    [intakeId, encryptPHI(extracted), provider.name]
  );

  // ---- Stage 3: Synthesis (slight variance) + family-profile cross-reference ----
  const synthesized = await provider.generate({
    stage: 'synthesis',
    systemInstruction: c.synthesis,
    prompt: `FACTORY CONFIG:\n${c.familyProfiles}\n\nEXTRACTED DATA:\n${extracted}`,
    temperature: 0.2,
  });
  const alerts = detectAlerts(synthesized);
  const nextStatus = alerts.length ? 'halted' : 'synthesized';

  await pool.query(
    `UPDATE phi_intake SET synthesized_ciphertext = $2, alerts = $3, status = $4 WHERE id = $1`,
    [intakeId, encryptPHI(synthesized), JSON.stringify(alerts), nextStatus]
  );

  return { status: nextStatus, alerts };
}

// NP reads the decrypted draft for review (status must be synthesized or halted).
export async function getDraft(intakeId: string): Promise<{ draft: string; alerts: string[]; status: string }> {
  const { rows } = await pool.query(
    `SELECT status, synthesized_ciphertext, alerts FROM phi_intake WHERE id = $1`,
    [intakeId]
  );
  const r = rows[0];
  if (!r || !r.synthesized_ciphertext) throw new Error('no draft available');
  return { draft: decryptPHI(r.synthesized_ciphertext), alerts: r.alerts || [], status: r.status };
}

// NP approval -> distribution. Distribution here = mark approved+distributed and expose the
// message via API (no external push yet — that's a later integration).
export async function approve(intakeId: string, reviewerId: string, note?: string): Promise<void> {
  const { rowCount } = await pool.query(
    `UPDATE phi_intake
        SET status = 'distributed', reviewed_by = $2, reviewer_note = $3,
            reviewed_at = now(), distributed_at = now()
      WHERE id = $1 AND status IN ('synthesized','halted')`,
    [intakeId, reviewerId, note ?? null]
  );
  if (!rowCount) throw new Error('intake not in a reviewable state');
}

export async function reject(intakeId: string, reviewerId: string, note?: string): Promise<void> {
  const { rowCount } = await pool.query(
    `UPDATE phi_intake
        SET status = 'halted', reviewed_by = $2, reviewer_note = $3, reviewed_at = now()
      WHERE id = $1 AND status IN ('synthesized','halted')`,
    [intakeId, reviewerId, note ?? null]
  );
  if (!rowCount) throw new Error('intake not in a reviewable state');
}

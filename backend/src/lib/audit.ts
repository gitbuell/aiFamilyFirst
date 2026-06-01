// Append-only audit writer. Every PHI access/change must call this.
// HIPAA §164.312(b). The audit_log table also blocks UPDATE/DELETE at the DB level.
import type { Request } from 'express';
import { pool } from '../db';

export interface AuditEntry {
  action: string;                 // login, login.fail, phi.read, phi.create, phi.distribute, ...
  resourceType?: string;
  resourceId?: string;
  patientId?: string;
  detail?: Record<string, unknown>;
}

export async function audit(req: Request, entry: AuditEntry): Promise<void> {
  const actor = req.user; // set by requireAuth; may be undefined for pre-auth events (e.g. login.fail)
  try {
    await pool.query(
      `INSERT INTO audit_log
         (actor_user_id, actor_role, action, resource_type, resource_id, patient_id, ip, user_agent, detail)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        actor?.id ?? null,
        actor?.role ?? null,
        entry.action,
        entry.resourceType ?? null,
        entry.resourceId ?? null,
        entry.patientId ?? null,
        req.ip ?? null,
        req.get('user-agent') ?? null,
        entry.detail ? JSON.stringify(entry.detail) : null,
      ]
    );
  } catch (err) {
    // Audit failures must be visible but must not silently drop the trail.
    console.error('[audit] failed to write entry', entry.action, err);
  }
}

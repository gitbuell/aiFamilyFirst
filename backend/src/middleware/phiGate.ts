// HARD COMPLIANCE GATE.
// Real PHI endpoints refuse to operate unless PHI_ENABLED === 'true'.
// This is the code-level enforcement of HIPAA-GAP.md: no real patient data flows
// until the Phase 2 entry checklist is cleared (BAAs signed, Privacy Officer sign-off).
import type { Request, Response, NextFunction } from 'express';

export const PHI_ENABLED = process.env.PHI_ENABLED === 'true';

export function phiGate(_req: Request, res: Response, next: NextFunction) {
  if (!PHI_ENABLED) {
    return res.status(503).json({
      error: 'phi_disabled',
      message:
        'PHI endpoints are gated off. Clear the HIPAA-GAP.md Phase 2 entry checklist ' +
        '(auth, encryption, BAAs, Privacy Officer sign-off) and set PHI_ENABLED=true to enable.',
    });
  }
  next();
}

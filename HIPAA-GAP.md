# aiFamilyFirst — HIPAA Gap Analysis & Phase 2 Compliance Gate

**Status as of 2026-05-31:** Phase 1 is a public **demo with hardcoded sample data only**.
There is **no real Protected Health Information (PHI)** in the system, so HIPAA does not yet
apply. This document is the **gate that must be cleared before any real patient data is
introduced** (Phase 2). See `content-studio/projects/aifamilyfirst/brief.md` (jake-system)
for project context.

> ⚠️ This is an engineering checklist, not a legal opinion. A real HIPAA posture requires
> sign-off from a qualified compliance professional / the covered entity's Privacy Officer
> before going live with patient data.

---

## Current state vs. HIPAA Security Rule

| Requirement | Cite | Current state | Required for Phase 2 |
|---|---|---|---|
| Unique user authentication / access control | §164.312(a)(1) | ❌ Login is a stub `alert()`; demo buttons grant any role | Real auth (per-user accounts, hashed creds / SSO) |
| Encryption at rest | §164.312(a)(2)(iv) | ❌ All data in browser **localStorage**, plaintext | Encrypted DB on the backend; no PHI in the browser store |
| Automatic logoff | §164.312(a)(2)(iii) | ❌ None | Session timeout |
| Audit controls / logging | §164.312(b) | ❌ No access/change logging | Append-only audit log of who viewed/edited what |
| Person/entity authentication | §164.312(d) | ❌ Role is chosen, not verified | Verify identity before granting role |
| Transmission security (TLS) | §164.312(e)(1) | ⚠️ HTTPS via Caddy in transit; no backend yet | Keep TLS; enforce on all API traffic |
| Role-based access enforcement | §164.308(a)(4) | ❌ Role separation is cosmetic (UI only) | Enforce RBAC server-side |
| Integrity controls | §164.312(c)(1) | ❌ None | Prevent/detect improper PHI alteration |
| Business Associate Agreements | §164.502(e) | ❌ None with DigitalOcean or Google | BAA with each vendor that touches PHI |
| Risk analysis / policies / workforce training | §164.308(a) | ❌ None documented | Documented risk assessment + policies |
| Breach notification process | §164.400–414 | ❌ None | Defined process |

---

## Critical risks when Phase 2 lands

1. **localStorage is disqualifying for PHI.** The demo persists everything (profile, meds,
   submissions, chat messages) to browser `localStorage` in plaintext. Real patient data must
   never use this path — it has to move to the planned backend (port 4003) with an encrypted
   database. No PHI in the browser persistence model.
2. **Gemini + Google Calendar integrations** (Phase 2 roadmap) send data to Google. This
   requires a **BAA with Google** (available under Google Workspace / Google Cloud HIPAA terms)
   AND disabling any data-retention / model-training use of the submitted content.
3. **The public demo must never accept real data.** Keep `aifamilyfirst.aibuell.com`
   strictly sample-only. Real PHI goes behind authenticated, gated infrastructure — a separate
   deployment, not the public demo.
4. **Audit + human-approval gate.** Preserve the ROUTING.md human-approval gate and add audit
   logging so every PHI access/distribution is attributable.

---

## Phase 2 entry checklist (all must be ✅ before first real patient record)

- [ ] Real authentication with unique per-user accounts (no role-switch demo buttons)
- [ ] Server-side RBAC enforcement (patient / parent / NP boundaries enforced in the API)
- [ ] Encrypted database; **zero PHI in browser localStorage**
- [ ] TLS enforced on all API endpoints (already have Caddy HTTPS for the frontend)
- [ ] Append-only audit logging of PHI access and changes
- [ ] Session timeout / automatic logoff
- [ ] Signed BAAs: DigitalOcean (hosting) + Google (Gemini / Calendar) + any other PHI vendor
- [ ] Documented risk analysis, security policies, breach-notification process
- [ ] Compliance professional / Privacy Officer sign-off
- [ ] Public demo confirmed sample-data-only and isolated from the PHI deployment

---

## Intake media (photos / audio) — handling rules

**Current state:** the demo does not capture or upload any intake media. The "Choose photo"
button is a no-op boolean and the result is a hardcoded sample; nothing leaves the browser
(text-only, in localStorage). So there is no PHI media exposure today. (See `FEATURE-STATUS.md`
"Intake media flow" for the code-level detail.)

**Phase 2 requirements — an uploaded intake photo/audio IS PHI. It must:**
- [ ] Upload only over an **authenticated** session to the **gated backend (port 4003)**, never
      from the public demo.
- [ ] Be stored in an **encrypted, private** store — **NOT** the public `aibuell-media` bucket and
      **NOT** the public CDN. `aibuell-media` is for public website/dashboard assets only; routing
      PHI there would be a breach. (Media architecture: jake-system
      `engineering-division/projects/media-and-reimage-architecture/`.)
- [ ] Be transmitted over TLS end-to-end; access enforced by server-side RBAC (only the patient's
      own care team / NP).
- [ ] Be covered by a **BAA** for any processor that touches it — Google (Gemini OCR/transcription),
      DigitalOcean (storage/hosting).
- [ ] Be written to the audit log on every access; retained/deleted per a defined retention policy.
- [ ] In the reimage backup, exist **only encrypted** (g14 backup mirror), never plaintext.
- [ ] Strip/avoid unnecessary EXIF/location metadata on upload where feasible.

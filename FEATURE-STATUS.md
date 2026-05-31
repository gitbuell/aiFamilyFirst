# aiFamilyFirst — Clinical Feature Status & Phase 2 Roadmap

**As of 2026-05-31.** This tracks the five clinician-facing capabilities against what the
codebase actually does. Phase 1 is a **demo SPA with no backend** (by design — see
`content-studio/projects/aifamilyfirst/brief.md`), so several features are UI mockups awaiting
the Phase 2 backend. Compliance gating for any of this with real data lives in `HIPAA-GAP.md`.

Legend: ✅ functional (as a demo) · ⚠️ partial · ❌ mockup / not present.

| Feature | What it should capture | Why the NP needs it | Status | Reality in code |
|---|---|---|---|---|
| **Vital Signs** | Temp, BP, HR, RR, SpO₂ | Severity, med safety, dosing | ⚠️ Partial | Patient profile captures **BP + HR** as first-class fields; Temp via free-text "extra vital". **RR and SpO₂ are not patient-entered** — they appear only in NP sample charts (`NPPatients.jsx`). |
| **SOAP Notes** | Structured clinical documentation | Legal record, continuity, patterns | ⚠️ Partial | Free-text "Clinical notes" box on the NP chart + a SOAP-formatted sample in Doctor-Notes intake. **Not discrete S/O/A/P fields; not persisted as a durable record.** |
| **Handwriting / OCR** | Doctor/patient written notes | Alternative capture, accessibility | ❌ Mockup | Photo intake UI exists but **no OCR engine**. `extractFor('photo')` returns a hardcoded sample Rx every time. UI now tagged "Demo". |
| **EHR Integration** | Complete medical history | Full context, prior meds, safety checks | ❌ Not present | **Zero** EHR/FHIR/HL7 code. NP "history" is hardcoded sample patients. Biggest gap. |
| **Lab Reports** | Blood tests, pathology | Kidney safety (ACE-I), diabetes monitoring | ❌ Sample only | NP chart **displays** labs (Cr, K+, LDL, A1C, glucose) but all values hardcoded; no ingestion, no patient entry, **no safety-check engine**. UI tagged "Sample data". |

---

## Phase 2 build roadmap (what makes each real)

1. **Vitals (complete the set):** add structured Temp / RR / SpO₂ fields to the patient intake;
   persist to the backend; show trends from real history.
2. **SOAP notes (structured + durable):** discrete Subjective/Objective/Assessment/Plan fields;
   save as an append-only clinical record (ties to HIPAA audit-log requirement).
3. **Handwriting / OCR:** wire a real vision/OCR service — this is the natural home for the
   planned **Gemini** integration (image → extracted text → ICM Extraction stage). Requires a
   Google BAA (see `HIPAA-GAP.md`).
4. **EHR integration:** a FHIR/HL7 interface to pull medical history; requires backend, auth,
   and a BAA with the EHR vendor. Largest single effort.
5. **Lab reports + safety engine:** lab ingestion (upload/parse or EHR feed) **plus** a
   drug-safety rules engine — e.g. the Lisinopril (ACE-I) + NSAID → check K⁺/Cr scenario the
   demo only illustrates statically. This is the highest clinical-value item after EHR.

## Honesty in the current demo
The OCR and Labs surfaces are now labeled (**"Demo"** / **"Sample data"**) so the prototype
doesn't overstate capability. Everything else remains clearly demo/sample-data per the global
footer ("demo build · sample data only").

## Intake media flow (photo/audio upload) — current vs. Phase 2

**Current (Phase 1 demo) — the picture goes NOWHERE.**
In `frontend/src/components/FamilyHealthApp.jsx` (`IntakeTab`):
- The "Choose photo" button only sets a boolean (`setPhotoChosen(true)`) — there is **no
  `<input type="file">`, no camera access, no `FileReader`**. No image is selected or read.
- "Extract & submit to NP" calls `extractFor('photo')`, which **returns a hardcoded sample Rx**
  every time, ignoring any "chosen" file.
- That fake text summary is appended to the submissions list and persisted to **browser
  localStorage** (`aiff-submissions`). Audio intake is the same pattern (no real recording/upload).
- **No file is uploaded anywhere** — no server, no bucket, no disk; nothing leaves the device.

**Phase 2 (NOT built) — where real intake media MUST go:**
- An intake photo/audio is **PHI**. It must upload to the **gated, authenticated backend
  (port 4003) + encrypted store** — NOT the public `aibuell-media` bucket (that bucket is only for
  public website/dashboard media; see the media architecture brief in jake-system
  `engineering-division/projects/media-and-reimage-architecture/`). PHI never touches the public
  demo or the public CDN.
- Flow: authenticated upload → encrypted at rest → ICM Extraction (Gemini OCR/transcription,
  requires a Google BAA) → NP assessment queue with the human-approval gate → encrypted reimage
  backup (g14) only. The public demo at aifamilyfirst.aibuell.com stays sample-data-only.
- See `HIPAA-GAP.md` for the controls that gate this.

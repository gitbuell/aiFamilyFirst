# ICM ROUTING: File Movement & Lifecycle

## STAGE TRANSITIONS

### 01_Ingestion → 02_Extraction
**Trigger:** File created in `01_Ingestion/` matching pattern `YYYY-MM-DD_*_Raw.md`
**Action:** Watcher detects new raw file and invokes extraction pipeline.
**Output:** File is routed to `02_Extraction/` as `YYYY-MM-DD_[Source]_Extracted.md`
**Original:** Archived to `00_Archive/`

### 02_Extraction → 03_Synthesis
**Trigger:** File created in `02_Extraction/` matching pattern `YYYY-MM-DD_*_Extracted.md`
**Action:** Watcher detects extracted file and invokes synthesis pipeline.
**Output:** File is created in `03_Synthesis/` as `YYYY-MM-DD_[Source]_Draft.md`
**Status:** HALTS and awaits human review. No automatic progression.

### 03_Synthesis → 04_Distribution (MANUAL APPROVAL REQUIRED)
**Trigger:** Human renames `YYYY-MM-DD_[Source]_Draft.md` to `YYYY-MM-DD_[Source]_Draft_APPROVED.md`
**Action:** Watcher detects approval and invokes distribution pipeline.
**Output:** Push notification or dashboard update sent to recipients.
**Archive:** Processed file moved to `00_Archive/` with delivery log.

---

## FILE NAMING CONVENTIONS

| Stage | Pattern | Example | Purpose |
|-------|---------|---------|---------|
| Ingestion | `YYYY-MM-DD_[Source]_Raw.md` | `2026-05-30_DrSmith_Raw.md` | Raw input from doctor visit, pharmacy, app entry |
| Extraction | `YYYY-MM-DD_[Source]_Extracted.md` | `2026-05-30_DrSmith_Extracted.md` | Structured clinical data |
| Synthesis | `YYYY-MM-DD_[Source]_Draft.md` | `2026-05-30_DrSmith_Draft.md` | Age-appropriate family messages (awaiting review) |
| Synthesis (Approved) | `YYYY-MM-DD_[Source]_Draft_APPROVED.md` | `2026-05-30_DrSmith_Draft_APPROVED.md` | Human-approved message ready for distribution |
| Archive | `YYYY-MM-DD_[Source]_[Status].md` | `2026-05-30_DrSmith_Distributed.md` | Historical record with completion status |

---

## APPROVAL WORKFLOW

1. **AI generates draft** → `03_Synthesis/2026-05-30_DrSmith_Draft.md`
2. **Human reviews draft** → Opens file in editor, reads SYSTEM ALERTS, reads messages
3. **Human approves** → Renames file to `...Draft_APPROVED.md`
4. **Watcher detects rename** → Triggers distribution stage
5. **Distribution completes** → File archived with delivery log

---

## EMERGENCY ESCALATION

**If any of these conditions are detected, immediately halt and notify parents:**
- ⛔ Allergy conflict detected
- ⛔ Drug interaction flagged
- ⛔ Dosage looks suspicious (e.g., 100x normal dose)
- ⛔ Missing critical information

**Action:** Create a special file `03_Synthesis/ALERT_[Timestamp]_[Type].md` with red warning banner. Do not route to distribution.

---

## ARCHIVAL

All processed files are moved to `00_Archive/` with the following structure:
- `Archive/2026-05/` (organized by year-month)
- `Archive/2026-05/2026-05-30_DrSmith_Distributed.md`

This ensures the full audit trail remains queryable.

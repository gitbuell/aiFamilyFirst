# Clinical Refinements: Family Profiles & Stage Contracts for NP-Led Health Management

## What Changed & Why

You're a nurse practitioner specializing in clinical care, not hospital administration. The original template was too generic. Here's what I refined to match your expertise and workflow:

---

## 1. FAMILY PROFILES: Now a Real Clinical Reference

### What Was Missing
The original template had placeholder fields. For an NP managing family health, you need:
- Detailed medication tracking (indication, why on each drug)
- Structured allergy/contraindication documentation (reaction type, severity)
- Drug-drug interaction alerts (specific, actionable)
- Recent lab values for dosing/monitoring decisions
- Chronic condition context (so new meds make sense)

### What's New

**Active Medications Table** (instead of a simple list)
```
| Medication | Dosage | Frequency | Route | Indication | Notes |
```
Now you capture:
- **Why each drug** is prescribed (Lisinopril = HTN management)
- **Clinical context** in Notes (e.g., "Monitor K+/renal function given NSAID history")
- **Route explicitly** (PO, IV, etc.) so extraction doesn't miss it

**Allergies & Contraindications Table** (structured severity)
```
| Allergen | Reaction Type | Severity | Notes |
```
Examples you'd use:
- Penicillin | Rash, possible Stevens-Johnson history | Moderate-Severe | Avoid all beta-lactams; use macrolides/fluoroquinolones
- NSAIDs | GI bleeding history | Moderate | Use acetaminophen preferred; if NSAID needed, PPI cover

This structure tells the LLM: "Don't just flag a penicillin allergy. Flag all beta-lactams. And explain why (Stevens-Johnson risk)."

**Drug-Drug Interaction Alerts** (specific section)
Instead of hiding interactions in notes, they're explicit:
- Lisinopril + NSAIDs → Risk of hyperkalemia and acute kidney injury. Monitor renal function.
- Atorvastatin + [new drug] → Check for CYP3A4 interactions.

The LLM in the Synthesis stage uses these as a checklist.

**Recent Labs Table** (tracking trend)
```
| Test | Date | Result | Reference Range | Trend |
```
Derrick's baseline:
- BP: 128/82 (controlled)
- K+: 4.2 (normal; critical for ACE inhibitor monitoring)
- Creatinine: 0.95 (normal; critical for NSAID/ACE inhibitor interaction risk)

This lets the LLM say: "New NSAID prescribed. Derrick's baseline renal function is normal, so lower risk, but recommend K+ recheck in 1 week."

**Chronic Conditions Summary** (for clinical context)
Instead of just listing conditions, you document:
- Hypertension (controlled) — tells LLM the BP management is working
- Hyperlipidemia (controlled on statin) — tells LLM why the atorvastatin is on baseline
- History of NSAID-induced GI bleeding (2015) — THIS IS KEY. New NSAID? Flag it for NP review.

### Why This Matters
If someone prescribes an NSAID without seeing the "GI bleeding history," the old system wouldn't catch it. The new structure makes it explicit, and the Synthesis contract is trained to flag it.

---

## 2. EXTRACTION STAGE: Now Clinically Precise

### What Was Missing
The original extraction was too loose. It could miss critical details:
- "Take as needed" without max frequency
- Route not captured (PO vs. IV totally different!)
- Indication omitted
- Dosing flags not surfaced

### What's New

**Explicit Dosage Extraction Rules**
```
- Dosages: Extract EXACTLY as stated (include units: mg, mcg, mL, %, etc.)
- If dosage is ambiguous, flag it with [UNCLEAR: reason]
```

For example, if audio transcription says "the doctor said take some of the antibiotic," the extraction flags:
```
[UNCLEAR: Antibiotic dosage not stated in source. Verify prescription with pharmacy.]
```

Not: "Oh, probably the standard dose is 500 mg, I'll assume that."

**Route Always Captured**
```
Routes: Always capture (PO, IV, IM, SC, inhaled, topical, etc.). If not stated, mark as [NOT SPECIFIED].
```

Example:
- Amoxicillin 500 mg **PO** TID (oral pill form)
- vs.
- Ceftriaxone 1g **IV** Q12H (needs hospital or home IV)

These are completely different medications for the NP's decision-making.

**Indication Always Captured**
```
| Medication | Dosage | Route | Frequency | Indication | Special Instructions |
| Amoxicillin | 500 mg | PO | TID | Acute otitis media | Complete full course; take with or without food |
```

Not just: "Amoxicillin 500 mg PO TID" — but **why**. This helps the Synthesis stage decide who needs to know.

**Dosing Appropriateness Flagged**
```
- If a dosage seems potentially dangerous or unusual (e.g., 500 mg of an antibiotic for a child), flag it 
  with [ALERT: possible dosing error - verify].
```

Example: Child is 8 years old, 50 lbs. Doctor prescribes Amoxicillin 500 mg TID.
- Standard pediatric: 25 mg/kg/dose × 3 = ~375-425 mg/dose for this child.
- Extraction flags: **[ALERT: Verify Amoxicillin 500 mg dosage for 8-year-old. Standard range is 375-425 mg/dose. Dose is slightly high; confirm intended.]**

**Patient Demographics Captured (if mentioned)**
```
Age/Weight: [Info or null]
```

Why? Because "dosing is appropriate for a 48-year-old adult" is different from "appropriate for an 8-year-old." The Synthesis stage needs this info to do interaction/dosing analysis.

---

## 3. SYNTHESIS STAGE: Now the NP's Safety Filter

### What Was Missing
The original Synthesis stage didn't actually do clinical analysis. It just flagged allergies superficially.

### What's New: The 5-Step Clinical Review

**Step 1: Identify the Patient**
```
Match the patient name/demographics from Extraction to the appropriate profile in Family_Profiles.md.
If patient cannot be matched, flag immediately: [ALERT: PATIENT IDENTITY UNCLEAR]
```

Why? If the raw note says "Derrick" but it's actually about the wife, the entire synthesis is wrong.

**Step 2A: Allergy Check (with chemical family logic)**
```
Does this medication appear in the patient's Known Allergies table?
Does it have a similar chemical structure to any listed allergen? 
(e.g., if allergic to penicillin, all beta-lactams are contraindicated)
```

Example from your profiles:
- Patient allergic to **Penicillin** (severe)
- Doctor prescribes **Amoxicillin** (a beta-lactam, same family as penicillin)
- Old system: "Checks allergy list for 'Amoxicillin.' Not found. Clear."
- New system: "Checks allergy list for 'Penicillin.' Found. Amoxicillin is a beta-lactam (penicillin family). **FLAG: ALLERGY CONFLICT.** Do NOT distribute. NP review required."

**Step 2B: Drug-Drug Interaction Check**
```
Does this medication interact with ANY medication in Active Medications?
Check the Drug-Drug Interaction Alerts section for known issues.
```

Example from your profiles:
- Patient on **Lisinopril 10 mg daily** (ACE inhibitor for HTN)
- Doctor prescribes **Ibuprofen 400 mg QID** (NSAID for pain)
- **Interaction:** Lisinopril + NSAIDs = risk of hyperkalemia and acute kidney injury
- Synthesis output: **"MODERATE INTERACTION DETECTED. Lisinopril + NSAID combination increases risk of hyperkalemia and acute renal injury. Derrick's baseline K+ is 4.2 (normal) and creatinine is 0.95 (normal), so baseline risk is lower, but recommend K+ and creatinine recheck in 1 week. Recommend acetaminophen as first-line pain management per Family_Profiles notes. NP review required."**

This is way more sophisticated than "flag allergy conflicts."

**Step 2C: Dosing Appropriateness Check**
```
If patient age/weight/renal function was captured in extraction, compare dosage to age-appropriate norms.
If dosing seems off, flag: [DOSING ALERT: Verify [medication] dosage [extracted dose] is appropriate for [age/weight/renal status]. Standard range is [typical range].]
```

Example:
- Extraction says: "Amoxicillin 500 mg prescribed for 8-year-old (48 lbs)"
- Synthesis calculates: Standard pediatric dose = 25 mg/kg/dose = 540 mg/dose for this child
- Synthesis flags: **"[DOSING ALERT: Amoxicillin 500 mg TID prescribed for 8-year-old (48 lbs). Standard pediatric dose is 25 mg/kg/dose = 540 mg/dose. Extracted dose is slightly low. Verify if intentional (e.g., lower dose for renal clearance reasons) or prescriber error.]"**

**Step 2D: Medication Duplication Check**
```
Does this medication already exist in the patient's Active Medications?
If yes: [DUPLICATION ALERT: [Medication] is already prescribed as [baseline dose/frequency]. Is this a dose increase, replacement, or error?]
```

Example:
- Baseline medications: Cetirizine 10 mg daily for seasonal allergies
- New prescription: Cetirizine 10 mg daily
- Synthesis flags: **"[DUPLICATION ALERT: Cetirizine 10 mg daily is already on baseline. Is this a continuation order, dose change, or prescriber error? If continuation, no action needed.]"**

**Step 2E: Chronic Condition Relevance Check**
```
Is this medication appropriate for the patient's stated chronic conditions?
If concern: [CLINICAL ALERT: [Medication] prescribed for patient with history of [condition]. NP review recommended.]
```

Example:
- Derrick's history: NSAID-induced GI bleeding (2015)
- New prescription: Ibuprofen for muscle strain
- Synthesis flags: **"[CLINICAL ALERT: NSAID (Ibuprofen) prescribed for patient with documented NSAID-induced GI bleeding history. Recommend PPI cover if truly necessary, or use acetaminophen as first-line per baseline profile. NP review required.]"**

---

## 4. MESSAGE TAILORING: Clinically & Age-Appropriate

### For Derrick (NP)
**Communication Style:** Full clinical picture, technical details, all system alerts, raw data appended.

The Synthesis output to you includes:
- Full medication table (name, dosage, route, frequency, indication, special instructions)
- All interaction/allergy/dosing alerts with reasoning
- Relevant patient data (age, weight, baseline medications, labs)
- "What to monitor" (e.g., "K+ recheck in 1 week")
- Action items with dates
- Your approval/sign-off section: **[PENDING APPROVAL / APPROVED / APPROVED WITH CONDITIONS]**

You see everything. You decide what goes to the family.

### For Co-Parent/Spouse
**Communication Style:** Comprehensive summary, clear action items, flagged alerts. Does not require raw extraction data unless requested.

Example message:
```
## MESSAGE TO: [Wife's Name]

**What happened:** Dr. Smith saw [child's name] for an ear infection today.

**New medication:**
- Name: Amoxicillin (antibiotic)
- Give: One pill
- Timing: Three times a day (breakfast, lunch, dinner)
- Duration: 10 days (finish the whole bottle)
- Important: With or without food; complete the full course even if child feels better

**How you'll know it's working:**
Ear pain should improve in 2-3 days.

**Watch for (side effects):**
- Rash
- Vomiting
- Diarrhea
If any of these happen, contact Derrick immediately.

**Questions?** Contact Derrick at [NP number].
```

Plain English. Actionable. No jargon.

### For Child (8th Grade)
**Communication Style:** Highly simplified, actionable instructions only. No clinical jargon. Focus on exactly what they need to do.

Example message:
```
## MESSAGE TO: [Child's Name]

**Your ear has an infection.** This medicine helps your body fight it.

**Your job:**
☐ Take one allergy pill after breakfast
☐ Take one allergy pill after lunch
☐ Take one allergy pill after dinner
☐ Swallow with water
☐ Do this for 10 days
☐ Tell Mom if you forget

**You'll feel better in a few days.**

**Tell a parent immediately if:**
- You get a rash
- You throw up
- Your stomach hurts
```

No "dosage," no "TID," no "oral route," no "renal clearance." Just: Take it. When. Why. What might go wrong.

---

## 5. WORKFLOW: NP APPROVAL GATES

This is critical for clinical safety.

### The Halt Points

**MAJOR ALERTS HALT DISTRIBUTION**
If Synthesis detects:
- Allergy conflict
- Moderate-severe drug interaction
- Dosing concern
- Medication duplication

Then: **File halts in 03_Synthesis folder. Does NOT move to Distribution. Awaits Derrick's sign-off.**

Example output header:
```
# ⚠️ CLINICAL REVIEW REQUIRED — NP SIGN-OFF MANDATORY
```

You (Derrick) must:
1. Read the alert
2. Verify with prescriber if needed
3. Decide: Approve / Approve with conditions / Reject
4. Sign off on the file
5. Only then does it move to 04_Distribution

**MINOR ALERTS: Informational**
If Synthesis detects a minor concern (e.g., "separate dosing times recommended to maximize absorption"), it flags it in the output but doesn't halt distribution. You can still override it.

---

## 6. CLINICAL GOVERNANCE: NP-LED

### Approval Workflow
1. **Extraction → Synthesis:** Automatic routing (LLM processes)
2. **Synthesis → Distribution:** **MANUAL NP REVIEW AND SIGN-OFF REQUIRED**
3. Distribution to family members only after Derrick approves

### Medication Review Schedule
- **Annual:** Comprehensive medication review for each family member
- **Quarterly:** Allergy & contraindication check
- **As-needed:** Post-visit review when new medications prescribed

### Lab Monitoring
For **Derrick specifically:**
- **ACE inhibitor baseline (Lisinopril):** Monitor K+ and creatinine annually
- **Statin baseline (Atorvastatin):** Monitor LFTs annually
- **NSAID history:** If new NSAID prescribed, urgent K+/creatinine recheck in 1 week

For **Wife/Child:** You'll populate as you gather baseline health data.

### Escalation Criteria (Always Route to Derrick First)
- New medication with moderate-severe drug interaction
- Allergy conflict detected
- Dosing error caught in synthesis
- Side effect report from family member
- Pediatric medication adjustment

---

## How to Use These Templates

### In 03_Synthesis folder:
1. Copy the Synthesis Stage Contract into `03_Synthesis/CONTEXT.md`
2. Paste the Family Profiles into `Reference_Material/Family_Profiles.md`
3. Paste the Extraction Contract into `02_Extraction/CONTEXT.md`

### When a new raw file appears:
1. **01_Ingestion** → `2026-05-30_DrSmith_Raw.md` (audio transcription of visit)
2. **Python watcher detects it** → Runs Extraction
3. **02_Extraction** → `2026-05-30_DrSmith_Extracted.md` (structured, clinical data)
4. **Python watcher detects it** → Runs Synthesis
5. **03_Synthesis** → `2026-05-30_DrSmith_Draft.md` (ready for your review)
6. **You (Derrick) review the Draft** → Approve or request changes
7. **04_Distribution** → Tailored messages sent to family via push notification/app

### Critical: The Halt Point
Between Synthesis and Distribution is **YOU**. No alerts bypass you. This is what makes the system safe for health data.

---

## Next Steps

1. **Populate Family Profiles** with your actual family data:
   - Your baseline meds (Lisinopril, Atorvastatin, any others?)
   - Your wife's baseline meds and allergies
   - Your child's baseline meds, allergies (tree nuts = EpiPen situation?)
   - Recent labs for you (K+, creatinine especially important given your meds)

2. **Tune the Stage Contracts** based on your specific workflows:
   - Do you want alerts for every minor interaction, or only major ones?
   - How frequently do you want lab reminders?
   - Any family-specific concerns to add to the "Escalation Criteria"?

3. **Test the Python Watcher** with a fake doctor's note to make sure the routing works

4. **Plan Distribution** (04_Distribution folder):
   - How do approved drafts trigger push notifications?
   - Who is the delivery system calling? (Firebase? APNs? Your mobile app backend?)

---

## Final Note: You're the Clinical Lead

This entire system works because **you're a nurse practitioner**. The LLM is a sophisticated note-taker and formatter. You make the clinical decisions. The system just surfaces the right information at the right time so you can decide safely and confidently.

The family profiles, stage contracts, and alerts are all tools for *you* to apply your clinical judgment. Use them as guardrails, not as absolutes.

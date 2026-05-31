# FACTORY CONFIG: FAMILY PROFILES
**Last Updated:** 2026-05-30
**Purpose:** Baseline health data and routing parameters for the `03_Synthesis` stage conflict checks.
**Managed By:** Derrick (NP, Clinical Oversight)

---

## PROFILE: Derrick
**Role:** Parent / Nurse Practitioner / System Admin
**DOB/Age:** 1977-09-05 (48)
**Clinical Notes:** NP-led clinical governance. All synthesis outputs routed to Derrick first.
**Communication Style:** Full clinical picture, drug interaction analysis, contraindication warnings, dosing rationale, and recommendations. Include raw clinical data when relevant. Flag any deviations from baseline.

### Active Medications
| Medication | Dosage | Frequency | Route | Indication | Notes |
|---|---|---|---|---|---|
| Lisinopril | 10 mg | Daily | PO | Hypertension | ACE inhibitor; monitor BP/K+ |
| Atorvastatin | 20 mg | Daily | PO | Hyperlipidemia | Statin; monitor LFTs annually |
| [Medication] | [Dosage] | [Frequency] | [Route] | [Indication] | [Notes] |

### Known Allergies & Contraindications
| Allergen/Drug | Reaction Type | Severity | Notes |
|---|---|---|---|
| Penicillin | Rash, possible Stevens-Johnson history | Moderate-Severe | Avoid all beta-lactams; use macrolides/fluoroquinolones |
| NSAIDs | GI bleeding history | Moderate | Use acetaminophen preferred; if NSAID needed, PPI cover |
| [Allergen] | [Reaction] | [Severity] | [Notes] |

### Drug-Drug Interaction Alerts
- **Lisinopril + NSAIDs:** Risk of hyperkalemia and acute kidney injury. Monitor renal function.
- **Atorvastatin + [any new drug]:** Check for CYP3A4 interactions.

### Recent Labs (Last 6 months)
| Test | Date | Result | Reference Range | Trend |
|---|---|---|---|---|
| BP | 2026-05-15 | 128/82 | <130/80 | Stable |
| K+ | 2026-04-20 | 4.2 | 3.5-5.0 | Normal |
| Creatinine | 2026-04-20 | 0.95 | 0.7-1.3 | Normal |
| LDL | 2026-04-20 | 98 | <100 (goal) | At goal |

### Chronic Conditions Summary
- Hypertension (controlled)
- Hyperlipidemia (controlled on statin)
- History of NSAID-induced GI bleeding (2015)

---

## PROFILE: [Wife's Name]
**Role:** Parent / Co-Admin
**DOB/Age:** [YYYY-MM-DD] ([Age])
**Clinical Notes:** Co-decision maker on family health. Receives comprehensive summaries with flagged alerts.
**Communication Style:** Clear action items, clinical summary in plain language, all system alerts prominently flagged. Include "what to watch for" and contact instructions if escalation needed. Does not require raw extraction data unless specifically requested.

### Active Medications
| Medication | Dosage | Frequency | Route | Indication | Notes |
|---|---|---|---|---|---|
| [Medication] | [Dosage] | [Frequency] | [Route] | [Indication] | [Notes] |
| None | — | — | — | — | — |

### Known Allergies & Contraindications
| Allergen/Drug | Reaction Type | Severity | Notes |
|---|---|---|---|
| [Allergen] | [Reaction] | [Severity] | [Notes] |
| None | — | — | — |

### Drug-Drug Interaction Alerts
- None documented

### Recent Labs (Last 6 months)
| Test | Date | Result | Reference Range | Trend |
|---|---|---|---|---|
| [Test] | [Date] | [Result] | [Reference] | [Trend] |

### Chronic Conditions Summary
- [Condition] or "No active chronic conditions"

---

## PROFILE: [Child's Name]
**Role:** Dependent (8th Grade)
**DOB/Age:** [YYYY-MM-DD] ([Age])
**Clinical Notes:** Pediatric messaging. Derrick approves all health communications to minor. Include developmental considerations.
**Communication Style:** Highly simplified, action-focused instructions. NO medical jargon. Explain "why" in simple terms (e.g., "This medicine helps your body fight the infection"). Focus on exactly what they need to do and when. Include reassurance when appropriate.

### Active Medications
| Medication | Dosage | Frequency | Route | Indication | Kid-Friendly Name |
|---|---|---|---|---|---|
| [Medication] | [Dosage] | [Frequency] | [Route] | [Indication] | [Simple name/description] |
| Allergy pill (Cetirizine) | 10 mg | Once daily | PO | Seasonal allergies | "The allergy pill" |

### Known Allergies & Contraindications
| Allergen/Drug | Reaction Type | Severity | Notes |
|---|---|---|---|
| [Allergen] | [Reaction] | [Severity] | [Notes] |
| Tree nuts (Walnut, Cashew) | Anaphylaxis | SEVERE | EpiPen at school; medical alert bracelet |

### Developmental Considerations
- Age-appropriate responsibility level for medication adherence
- Can manage once-daily dosing with parental oversight
- Understands basic body concepts; explain using analogies (e.g., "Like a shield for your body")
- School nurse coordination needed for [medication/condition]

### Medication Administration Checklist (for Child)
```
ALLERGY PILL (Cetirizine)
☐ Take 1 pill with breakfast
☐ Swallow with water
☐ Tell Mom or Dad if you forget
☐ Tell us if you feel funny or itchy

NUT ALLERGY PROTOCOL
☐ Check ingredients before eating snacks at school
☐ Wear medical alert bracelet
☐ Keep EpiPen in backpack
☐ Tell a teacher if you accidentally eat nuts
```

### Emergency Contacts & School Coordination
- School Nurse: [Name], [Phone]
- Pediatrician: [Name], [Phone]
- Derrick (Parent/NP): [Phone] — Primary medical decision-maker

---

## CLINICAL GOVERNANCE NOTES

### Approval Workflow for New Medications
1. **Extraction Stage:** Raw prescription/note captured
2. **Synthesis Stage (Draft):** Derrick reviews for:
   - Drug interactions with existing medications (all family members)
   - Dosing appropriateness for age/weight/renal function (if applicable)
   - Allergy conflicts
   - Indication appropriateness
3. **Derrick's Approval:** Sign-off required before distribution to family members
4. **Distribution:** Tailored messages sent to each family member

### Medication Review Schedule
- **Annual:** Comprehensive medication review (each family member)
- **Quarterly:** Allergy & contraindication check
- **As-needed:** Post-visit review when new medications prescribed

### Lab Ordering & Monitoring
- **Derrick (BP/K+/Renal):** Monitor annually given ACE inhibitor + NSAID history
- **Wife (if on any medications):** [Specify monitoring frequency]
- **Child:** Baseline labs if any chronic condition; otherwise as age-appropriate

### Escalation Criteria (Route to Derrick Immediately)
- New medication with moderate-severe drug interaction
- Allergy conflict detected
- Dosing error caught in synthesis
- Side effect report from family member
- Any pediatric medication adjustment

---

## METADATA & VERSION CONTROL
| Field | Value |
|---|---|
| Created | 2026-05-30 |
| Last Reviewed | [Date] |
| Last Updated | [Date] |
| Version | 1.0 |
| Next Review Date | [Date + 3 months] |
| Reviewer Initials | [Derrick's initials] |

---

## TEMPLATE INSTRUCTIONS FOR YOU

### When to Update This File
- **Immediately:** New medication prescribed, new allergy identified, dosing change
- **Monthly:** Review all active meds for accuracy
- **Quarterly:** Full contraindication & interaction review
- **Annually:** Comprehensive health profile update (labs, chronic conditions, medication efficacy)

### Critical Fields That Trigger System Alerts
The AI in `03_Synthesis` will ALWAYS flag if:
1. New medication conflicts with ANY known allergy
2. New medication interacts with ANY active baseline medication
3. Dosing seems inappropriate for age/weight/renal function
4. New medication duplicates a current baseline medication

### For Your NP Practice
- **Drug interactions:** Use your standard reference (UpToDate, Lexi-Comp). Document rationale in "Notes" column.
- **Dosing:** Include age/weight/renal considerations in the "Notes" field so the LLM understands the clinical logic.
- **Contraindications:** Be explicit. Don't assume the LLM knows your past medical history context.

# Patient Audio Intake & NP Assessment Workflow

## Overview

The **Audio Intake feature** allows patients (and their family members) to:
1. Record or upload audio from doctor visits
2. Get automatic AI transcription
3. Send to NP for clinical review and safety verification
4. Receive tailored health updates

This is the **bridge between real-world doctor encounters and NP clinical decision-making** in your ICM system.

---

## The Complete Process: 5 Stages

### **STAGE 1: PATIENT CAPTURES AUDIO (Patient View)**

**Location:** Patient app → "🎤 Doctor Visit Audio Intake" section

**Two Capture Methods:**

#### **Method A: Record Right Now 📱**

**What Patient Does:**
1. Open patient app
2. Tap "📱 Record Right Now"
3. Allow microphone permission
4. Tap "▶️ Start Recording"
5. Hold phone during appointment (or record doctor speaking)
6. Tap "⏹️ Stop Recording"
7. Review playback
8. Tap "✅ Confirm & Submit for Transcription"

**Recording Details:**
- Max duration: 5 minutes per recording
- Can do multiple recordings for longer visits
- Audio quality: Device's native microphone (MP4/M4A on iPhone, MP3 on Android)
- Live timer visible during recording

**Example Scenario:**
- Patient (child) in ear pain, sees Dr. Smith
- Parent holds phone, records doctor's explanation
- "Patient has acute otitis media... prescribing Amoxicillin 500 mg..."
- Records for 2 minutes 45 seconds
- Submits immediately

---

#### **Method B: Upload Existing File 📁**

**What Patient Does:**
1. Go to "📁 Upload Existing File"
2. Select audio from device (camera roll, voice memos, downloads)
3. Tap upload
4. Review file details (name, size, duration)
5. Tap "✅ Confirm & Submit for Transcription"

**Supported Formats:**
- MP3 (universal standard)
- M4A (iPhone Voice Memos)
- WAV (high quality, larger files)
- OGG (compressed)
- FLAC (lossless, less common)

**Max File Size:** 50 MB

**Example Scenario:**
- Wife records appointment on her own phone
- Has saved as "Dr_Johnson_appointment_May30.m4a"
- Uploads to family health app
- Submits for transcription

---

### **STAGE 2: AI TRANSCRIPTION (Automatic, Backend)**

**What Happens:** Audio → Text conversion

**Timing:** < 1 minute for most recordings

**Technology:**
- Cloud transcription service (Google Speech-to-Text, AWS Transcribe, or similar)
- Language: English (default), can support other languages
- Speaker identification: Simple (doctor vs. patient, if stereo)
- Punctuation: Auto-corrected
- Medical terminology: Enhanced accuracy if using medical dictionary

**Output Format:**

```
INPUT:
Audio file (2 min 45 sec) of Dr. Smith with child

OUTPUT (Transcript):
"Patient presents with ear pain in right ear, started yesterday morning. 
Complains of slight fever, 99.2 degrees. On examination, right ear shows 
signs of inflammation. Diagnosis: Acute otitis media. Prescribed Amoxicillin 
500 milligrams, three times daily for 10 days. Follow up in 10 days if not 
improving. Patient education on completing full course of antibiotics provided."
```

**Accuracy Issues Handled:**

| Issue | How It's Handled |
|-------|------------------|
| Background noise | AI tries to filter; NP reviews for accuracy |
| Medical terms mispronounced | Medical dictionary helps; NP catches errors |
| Multiple speakers | AI attempts speaker tags; NP reviews context |
| Unclear audio | Flagged for NP review ("Could not hear clearly at 1:23") |

---

### **STAGE 3: ROUTING TO NP (Patient App → NP Dashboard)**

**System Flow:**

```
Patient submits → Audio file + Transcript
                        ↓
                   Stored in database
                        ↓
                   Notification sent to NP
                        ↓
              Appears in NP Dashboard
           (Approvals tab or new "Pending Transcriptions" tab)
                        ↓
                   Derrick (NP) reviews
```

**What Patient Sees:**
- Status badge changes to "⏳ Processing" while transcribing
- Once complete: "✅ Sent to NP for Review"
- Timeline shows:
  - ✅ Just now: Recording submitted
  - ✅ Within 1 minute: AI transcribes audio
  - ⏳ Within 2 hours: Derrick reviews & approves
  - ⏳ Within 3 hours: You receive clinical summary & new instructions

**Notification to NP:**
- Push notification: "New audio transcription from [Patient] - Dr. [Doctor's Name]"
- Appears in NP Dashboard with new section: "📋 Pending Transcriptions"

---

### **STAGE 4: NP ASSESSMENT & EXTRACTION (NP Dashboard)**

**Location:** NP view → New tab "📋 Pending Transcriptions"

**What Derrick (NP) Does:**

#### **Step 1: Review Transcription**
- Read full transcript
- Listen to audio if accuracy seems off
- Verify key details

#### **Step 2: Extract Clinical Data**
Using the **Extraction Stage Contract** (from your ICM system):

```
Extract the following EXACTLY:

☐ Patient Name: [Child]
☐ Visit Date: 2026-05-30
☐ Doctor: Dr. Smith
☐ Clinic: Family Medicine Clinic

CHIEF COMPLAINT:
"Ear pain in right ear, started yesterday morning, slight fever (99.2°F)"

EXAMINATION FINDINGS:
"Right ear shows signs of inflammation"

DIAGNOSIS:
"Acute otitis media"

MEDICATIONS PRESCRIBED:
  - Drug: Amoxicillin
  - Dose: 500 mg
  - Route: PO (assumed, not stated)
  - Frequency: Three times daily
  - Duration: 10 days
  - Indication: Acute otitis media

INSTRUCTIONS FROM DOCTOR:
  - Complete full course of antibiotics
  - Follow up in 10 days if not improving

FLAGS/NOTES:
  - [NONE] — straightforward case
```

#### **Step 3: Safety Checks (Synthesis Stage)**

```
✅ Patient Identity: [Child], age 13M (8th grader)
  ✓ Match found in Family_Profiles

✅ Allergy Check:
  ✓ Amoxicillin = BETA-LACTAM ANTIBIOTIC
  ✓ Family profile: Tree nut allergy (SEVERE, EpiPen)
  ✓ No penicillin allergy documented
  ✓ SAFE TO GIVE

✅ Drug-Drug Interactions:
  ✓ Current baseline: Cetirizine (allergy med)
  ✓ No significant interactions with Amoxicillin
  ✓ SAFE COMBINATION

✅ Dosing Appropriateness:
  ✓ Child weight: 48 lbs (21.8 kg)
  ✓ Amoxicillin 500 mg TID = 1500 mg/day
  ✓ Standard pediatric dose: 25-45 mg/kg/day
  ✓ This child: 1500/21.8 = 68.8 mg/kg/day
  ✓ ⚠️ ALERT: Dose is HIGHER than standard
  ✓ CHECK: Is this for severe infection?
  ✓ Standard dose would be: 500-1000 mg/day
  ✓ RECOMMEND: Contact Dr. Smith to verify dosing
    OR accept as appropriate for acute otitis media severity

✅ Chronic Condition Relevance:
  ✓ No contraindications
  ✓ No baseline conditions that affect antibiotic use

OVERALL SAFETY: ✅ APPROVE
(With note: Dosing slightly high, but may be appropriate for severity)
```

#### **Step 4: Create Three-Version Clinical Summary**

**Version 1: For NP (Derrick - Himself)**

```
CLINICAL SUMMARY: Child Audio Visit with Dr. Smith

Date: 2026-05-30
Duration: 2 min 45 sec
Doctor: Dr. Smith, Family Medicine Clinic
Diagnosis: Acute otitis media (ear infection)

Key Findings:
- Chief Complaint: Ear pain (right), started yesterday morning
- Vital Sign: Slight fever (99.2°F)
- Exam: Right ear inflammation visible
- Diagnosis: Acute otitis media

NEW MEDICATION:
- Amoxicillin 500 mg PO TID × 10 days

Safety Verification:
✅ Allergy check: PASS (No penicillin allergy)
✅ Drug interactions: PASS (Safe with cetirizine)
⚠️ Dosing: HIGH but acceptable for acute otitis
   (68.8 mg/kg/day vs. standard 25-45; warrants verification)
✅ Chronic condition check: PASS

Recommendation: APPROVE
Note: Dosing slightly elevated; verify with Dr. Smith if high severity case.

Follow-up: 10 days if not improving per doctor's instruction
```

**Version 2: For Spouse (Child's Mother - Plain English)**

```
📋 Update from Child's Doctor Visit - May 30, 2026

Your child saw Dr. Smith for an ear infection.

What the Doctor Found:
- Right ear is inflamed and causing pain
- Slight fever (99.2°F)
- Diagnosis: Acute otitis media (middle ear infection, very common)

New Medication:
💊 Amoxicillin (antibiotic)
   • Dose: 500 mg
   • How: By mouth (with food is fine)
   • When: Three times a day
   • How long: 10 days (complete all pills!)

What to Watch For:
- Take ALL pills even if child feels better
- If rash appears, stop and call doctor immediately
- If fever doesn't improve in 2 days, call doctor
- Follow-up appointment needed if not better in 10 days

Side Effects Possible (Usually Mild):
- Stomach upset → take with food
- Loose stools → normal with antibiotics
- Rare rash → STOP and call doctor

Questions? Ask Derrick (NP) or call Dr. Smith's office.
```

**Version 3: For Child (Age 13, 8th Grade - Fun & Clear)**

```
🎤 What Happened at Your Doctor Visit - May 30

👂 Why Your Ear Hurt:
You have something called "acute otitis media" (fancy word for ear infection). 
It's super common, especially in spring/summer. Your ear got a bit inflamed 
(that means puffy and sore). Dr. Smith said the fever helped confirm it.

💊 Your New Medicine:
Amoxicillin (an-tee-by-AH-tick)

What it does: Kills the bacteria causing your ear infection

How to take it:
✓ 500 mg (one pill)
✓ Take THREE times a day
✓ Try to take it with meals (less stomach upset)
✓ Take ALL 10 days of pills—don't stop early!

⚠️ Watch for these (call parents if they happen):
- Rash anywhere on body → STOP pills, tell parent immediately
- Really upset stomach → take with more food
- Still hurts after 2 days → tell parent to call doctor

Cool facts:
🎯 Amoxicillin is the #1 antibiotic for ear infections
✅ You'll probably feel better in 2-3 days
👍 Come back in 10 days if not fully better

You've got this! 💪
```

---

### **STAGE 5: DISTRIBUTION TO FAMILY (NP Approval → Tailored Messages)**

**After Derrick Approves:**

```
                    NP Reviews & Approves
                            ↓
        Generates 3 versions of clinical summary
                            ↓
        ┌─────────────────┬──────────────┬─────────────────┐
        ↓                 ↓              ↓                 ↓
    NP Sees         Spouse Sees      Child Sees      System Logs
  (Full Clinical) (Plain English)  (Fun & Clear)   (Audit Trail)
```

**What Each Person Receives:**

**Derrick (NP) — In Dashboard:**
- Full clinical summary with dosage verification
- Drug interaction analysis
- Safety flags
- Approval confirmation: "✅ Approved and Distributed — May 30, 2026 10:15 AM"

**Spouse (Child's Mother) — In Patient App:**
- Tab: "💬 Messages from NP"
- Title: "Update from Child's Doctor Visit - May 30"
- Plain language version
- Action items: Watch for rash, take all pills
- When to call doctor
- **Notification:** "New health update for [Child] from Dr. Smith visit"

**Child — In Patient App:**
- Tab: "💬 Messages from Parents & NP"
- Title: "🎤 What Happened at Your Doctor Visit - May 30"
- Fun, clear version with emojis
- Action items for kid
- Cool facts and encouragement
- **Notification:** "Your doctor visit summary is ready!"

---

## Data Flow Through ICM System

### **From Patient Audio → NP Dashboard → Family Distribution**

```
STAGE 1: PATIENT CAPTURE
┌────────────────────────────────────────┐
│ Patient App                            │
│ 🎤 Record or Upload Audio              │
│ Audio file + Patient metadata          │
└────────────────────────────┬───────────┘
                             │
                             ↓
        ┌─────────────────────────────────┐
        │ 01_Ingestion Folder (ICM)       │
        │ Audio file stored                │
        │ Metadata: Date, Patient, Doctor │
        └─────────────────────┬───────────┘
                              │
                              ↓
STAGE 2: TRANSCRIPTION (Backend AI)
        ┌─────────────────────────────────┐
        │ AI Transcription Service        │
        │ Audio → Text conversion         │
        │ < 1 minute                      │
        └─────────────────────┬───────────┘
                              │
                              ↓
        ┌──────────────────────────────────┐
        │ 02_Extraction Folder (ICM)       │
        │ YYYY-MM-DD_DrSmith_Extracted.md │
        │ Structured clinical data        │
        │ Chief complaint, diagnosis,     │
        │ medications (with exact doses)  │
        └─────────────────────┬────────────┘
                              │
                              ↓
STAGE 3: NP REVIEW (Derrick's Gate)
        ┌──────────────────────────────────┐
        │ NP Dashboard                     │
        │ 📋 Pending Transcriptions        │
        │ Derrick reviews & extracts data  │
        │ Runs safety checks               │
        └─────────────────────┬────────────┘
                              │
                              ↓
STAGE 4: SYNTHESIS (Generate 3 Versions)
        ┌──────────────────────────────────┐
        │ 03_Synthesis Folder (ICM)        │
        │ YYYY-MM-DD_DrSmith_Synthesis.md │
        │ 3 versions created:              │
        │ • NP version (clinical detail)   │
        │ • Spouse version (plain English) │
        │ • Child version (fun & clear)    │
        │                                  │
        │ HALTS HERE FOR NP APPROVAL ✋    │
        └─────────────────────┬────────────┘
                              │
                    NP clicks "APPROVE"
                              │
                              ↓
STAGE 5: DISTRIBUTION
        ┌──────────────────────────────────┐
        │ 04_Distribution Folder (ICM)     │
        │ Messages routed to:              │
        │ • Spouse app (plain version)     │
        │ • Child app (fun version)        │
        │ • NP dashboard (full version)    │
        │                                  │
        │ Push notifications sent          │
        └──────────────────────────────────┘
```

---

## UI/UX: Patient Audio Intake Component

### **Home Screen - Two Main Options**

```
┌─────────────────────────────────────────────────┐
│ 🎤 Doctor Visit Audio Intake                    │
│                                                 │
│ Record or upload audio from your doctor's      │
│ appointment. We'll transcribe it and send it    │
│ to your NP for review.                         │
└─────────────────────────────────────────────────┘

┌─────────────────────┐    ┌─────────────────────┐
│ 📱 Record Right Now │    │ 📁 Upload File      │
│                     │    │                     │
│ Use phone's mic     │    │ Upload existing     │
│ to record doctor    │    │ audio file          │
│ during visit        │    │                     │
└─────────────────────┘    └─────────────────────┘

┌─────────────────────────────────────────────────┐
│ 📋 Your Recent Doctor Visits                    │
│                                                 │
│ ✅ Dr. Smith (May 30) - Sent to NP              │
│    Acute otitis media, Amoxicillin prescribed  │
│    2 min 45 sec                                │
│                                                 │
│ ⏳ Dr. Johnson (May 15) - Processing            │
│    Seasonal allergies, Cetirizine prescribed   │
│    8 min                                       │
└─────────────────────────────────────────────────┘
```

### **Recording Screen**

```
┌─────────────────────────────────────────────────┐
│ 🎤 Recording Doctor Visit                       │
│                                                 │
│         🎙️ (animated pulsing)                   │
│                                                 │
│         1:23                                    │
│                                                 │
│    🔴 Recording in progress...                  │
│                                                 │
│    [⏹️ Stop Recording]                          │
│                                                 │
│    ⏱️ Maximum recording length: 5 minutes       │
└─────────────────────────────────────────────────┘
```

### **Upload Screen**

```
┌─────────────────────────────────────────────────┐
│ 📁 Upload Audio File                            │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Click to upload or drag and drop         │  │
│  │                                          │  │
│  │ MP3, M4A, WAV, OGG (Max 50MB)           │  │
│  │ [Choose File...]                        │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│ Supported Audio Formats:                       │
│ MP3, M4A (iPhone), WAV, OGG, FLAC             │
└─────────────────────────────────────────────────┘
```

### **Playback Review Screen**

```
┌─────────────────────────────────────────────────┐
│ 🎵 Review Your Recording                        │
│                                                 │
│ 📄 doctor_visit_may30.m4a                       │
│    2.5 MB • Just now                           │
│                                                 │
│ ▶️ [─────────●─────] 0:00 / 2:45               │
│                                                 │
│ ✨ What Happens Next                            │
│ 1️⃣ You confirm and submit the recording        │
│ 2️⃣ Our AI transcribes the audio (1 min)        │
│ 3️⃣ Sent to your NP (Derrick) for review       │
│ 4️⃣ Derrick extracts key information           │
│ 5️⃣ You get notifications about new meds       │
│                                                 │
│ [✅ Confirm & Submit for Transcription]        │
└─────────────────────────────────────────────────┘
```

### **Transcript Complete Screen**

```
┌─────────────────────────────────────────────────┐
│ 📝 Transcription Complete                       │
│                                                 │
│ ✅ Sent to NP for Review                        │
│                                                 │
│ 🎤 What the Doctor Said:                       │
│ ┌─────────────────────────────────────────┐   │
│ │ "Patient presents with ear pain in      │   │
│ │  right ear, started yesterday morning.  │   │
│ │  Complains of slight fever (99.2°F).    │   │
│ │  On examination, right ear shows signs  │   │
│ │  of inflammation. Diagnosis: Acute      │   │
│ │  otitis media. Prescribed Amoxicillin   │   │
│ │  500 mg, three times daily for 10 days. │   │
│ │  Follow up in 10 days if not improving."│   │
│ └─────────────────────────────────────────┘   │
│                                                 │
│ 👨‍⚕️ What Derrick (Your NP) Will Do:             │
│ ✓ Review the transcription for accuracy        │
│ ✓ Extract: diagnoses, medications, dosages    │
│ ✓ Check for drug interactions                 │
│ ✓ Verify dosages for age/weight               │
│ ✓ Check allergies & contraindications         │
│ ✓ Create tailored messages for family         │
│ ✓ Approve and distribute updates              │
│                                                 │
│ 📅 Timeline:                                    │
│ ✅ Just now: Recording submitted               │
│ ✅ < 1 min: AI transcribes audio              │
│ ⏳ < 2 hrs: Derrick reviews & approves        │
│ ⏳ < 3 hrs: You get clinical summary          │
└─────────────────────────────────────────────────┘
```

---

## Production Considerations

### **Backend Requirements**

**Services Needed:**
1. **Audio Storage** — Cloud storage (AWS S3, GCP)
2. **Transcription API** — Google Speech-to-Text, AWS Transcribe
3. **Database** — Store audio files, transcripts, metadata
4. **Notification Service** — Push notifications to NP when new transcript
5. **File Processing Queue** — Handle transcription asynchronously

### **Security**

✅ **HIPAA Compliance:**
- Encrypt audio files at rest
- HTTPS for all uploads/downloads
- Log all access to audio/transcripts
- Retain logs for 6+ years
- De-identify data for testing

✅ **Patient Privacy:**
- Only authenticated users can upload/view
- Family members see only their own/family data
- NP sees all family member data

✅ **Data Retention:**
- Audio files: Keep for 6+ years (legal requirement)
- Transcripts: Keep permanently (part of medical record)
- Logs: Keep for 6+ years (HIPAA audit trail)

### **Costs**

| Service | Cost | Example |
|---------|------|---------|
| Audio transcription | $0.006-0.024 per minute | 2 min audio = $0.015 |
| Cloud storage | $0.023 per GB/month | 100 visits = ~1GB = $0.023/month |
| Notification service | $0.0075-0.05 per notification | Scales with family |

**Total Monthly for Family of 3 with 20 visits/month:**
- Transcription: ~20 × 3 min × $0.015 = ~$9
- Storage: ~$0.50
- Notifications: ~$2
- **Total: ~$12/month**

---

## Future Enhancements

**Phase 2:**
- Multi-language support (Spanish, Mandarin, etc.)
- Speaker identification ("Dr. Smith: ...", "Patient: ...")
- Automatic medical keyword extraction
- Real-time transcript while recording

**Phase 3:**
- Handwriting recognition (scan written notes)
- Lab report OCR (read lab results from image)
- Integration with EHR systems (auto-pull from hospital records)

**Phase 4:**
- AI-powered clinical note generation (auto-create SOAP notes)
- Vital signs capture (BP, temp, etc. extracted from transcript)
- Medication interaction warnings in real-time
- Appointment reminder with pre-visit recording prompts

---

## Summary

**Patient Audio Intake = Bridge from Real World to NP Oversight**

```
Family member                Doctor           Patient App           NP Dashboard
at appointment                ↓                    ↓                    ↓
                         Doctor speaks      Patient/Family    Audio intake section
                         appointment         records or         "Pending
                         details             uploads audio      Transcriptions"
                                                ↓                    ↓
                                            AI transcribes      NP reviews
                                            within 1 minute      transcript
                                                ↓                    ↓
                                            Status: "Sent      NP extracts:
                                            to NP"          • Diagnosis
                                                ↓           • Medications
                                                           • Dosages
                                                           • Drug checks
                                                                ↓
                                                            Generates 3 versions
                                                            (NP, Spouse, Child)
                                                                ↓
                                                            ✅ APPROVES
                                                                ↓
                                                    Distributes tailored
                                                    messages to family
```

This ensures **real-world clinical encounters** are safely integrated into your **NP-controlled family health system**.

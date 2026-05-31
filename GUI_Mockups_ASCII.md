# GUI Visual Mockups: ASCII Layouts

## Screen 1: Role Switcher (Top of App)

```
╔════════════════════════════════════════════════════════════════════╗
║                    Family Health Architect                         ║
║         NP-led health information dashboard • ICM framework        ║
╚════════════════════════════════════════════════════════════════════╝

┌──────────────┬──────────────┬──────────────┐
│ 👨‍⚕️ Derrick   │ 👩 Spouse    │ 👧 Child     │
│   (NP)       │              │ (8th Grade)  │
│ [ACTIVE]     │              │              │
└──────────────┴──────────────┴──────────────┘

────────────────────────────────────────────────────────────────────
  [Rest of content changes based on which tab is active]
────────────────────────────────────────────────────────────────────
```

---

## Screen 2: Derrick (NP) View - Full Clinical Dashboard

```
╔═══════════════════════════════════════════════════════════════════╗
║  Child's Name (8 years old, 48 lbs)                               ║
║  Dr. Smith, Family Medicine Clinic • 2026-05-30                   ║
║                                      [In-person office visit]     ║
╚═══════════════════════════════════════════════════════════════════╝

┌─ ⚠️ CLINICAL REVIEW POINTS ──────────────────────────────────────┐
│ ⚠️ DOSING VERIFICATION                                   [▼ expand]│
│    Amoxicillin 500 mg TID prescribed for 8-year-old (48 lbs).   │
│    Standard pediatric dose is 25 mg/kg/dose = 540 mg/dose.      │
│    Extracted dose is slightly low. Verify if intentional.        │
└─────────────────────────────────────────────────────────────────┘

┌─ DIAGNOSIS ──────────────────────────────────────────────────────┐
│ Acute otitis media (right ear) with mild fever                   │
└─────────────────────────────────────────────────────────────────┘

┌─ 💊 MEDICATIONS PRESCRIBED ──────────────────────────────────────┐
│                                                                   │
│ Medication  │ Dosage  │ Route │ Frequency │ Indication  │ Notes │
│─────────────┼─────────┼───────┼───────────┼─────────────┼────── │
│ Amoxicillin │ 500 mg  │ PO    │ TID       │ Acute otitis│ Take  │
│             │         │       │ (3x day)  │ media       │ w/o   │
│             │         │       │           │             │ food  │
│             │         │       │           │             │ 10 d  │
└─────────────┴─────────┴───────┴───────────┴─────────────┴────── ┘

┌─ PATIENT BASELINE CONTEXT (from Family_Profiles.md) ──────────────┐
│                                                                   │
│ Current Medications:                                             │
│   • Cetirizine 10 mg daily (seasonal allergies)                 │
│                                                                   │
│ Known Allergies:                                                 │
│   • Tree nuts (Walnut, Cashew) - SEVERE - EpiPen                │
│                                                                   │
│ Drug Interactions:                                               │
│   ✅ CLEAR. Amoxicillin compatible with baseline cetirizine.    │
│      No interactions detected.                                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─ ACTIONS ITEMS ──────────────────────────────────────────────────┐
│ ☐ Verify amoxicillin dosage with prescriber        [pending]     │
│ ☐ Schedule follow-up exam in 10 days               [pending]     │
│ ☐ Monitor for fever persistence beyond 48 hours    [pending]     │
└─────────────────────────────────────────────────────────────────┘

┌─ NP APPROVAL GATE ───────────────────────────────────────────────┐
│                                                                   │
│  Status: [⏳ Pending Your Approval ▼]  [Save & Route]           │
│                                                                   │
│  Options:                                                        │
│   • ⏳ Pending Your Approval (default - no dispatch)            │
│   • ✅ Approved for Distribution (send to family)              │
│   • ✅ Approved with Conditions (add notes)                    │
│   • ❌ Requires Clarification (reject, ask prescriber)         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Key Points:**
- Everything a clinical professional needs at a glance
- Tables for precise data comparison
- Alerts highlighted prominently
- Baseline context integrated (not hidden)
- Approval gate is explicit and intentional—nothing goes out without your sign-off

---

## Screen 3: Spouse View - Action-Oriented Summary

```
╔═══════════════════════════════════════════════════════════════════╗
║  Health Update for Child's Name                                   ║
║  From: Dr. Smith • 2026-05-30                                    ║
╚═══════════════════════════════════════════════════════════════════╝

┌─ WHAT HAPPENED ──────────────────────────────────────────────────┐
│                                                                   │
│ Child has an ear infection. Doctor prescribed an antibiotic      │
│ to help the body fight it off.                                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─ 💊 HOW TO GIVE THE MEDICINE ────────────────────────────────────┐
│                                                                   │
│ ┌─ Amoxicillin (antibiotic) ───────────────────────────────────┐ │
│ │                                                               │ │
│ │ Amount:   One pill                                           │ │
│ │ When:     Three times a day (breakfast, lunch, dinner)      │ │
│ │ How long: 10 days                                            │ │
│ │                                                               │ │
│ │ ⚠️  Complete the full 10 days even if child feels better     │ │
│ │     after a few days                                         │ │
│ │                                                               │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─ ⚠️ WATCH FOR THESE (SIDE EFFECTS) ──────────────────────────────┐
│                                                                   │
│ ⚠️  Rash or hives                                               │
│ ⚠️  Vomiting or severe stomach pain                              │
│ ⚠️  Diarrhea (mild diarrhea is normal)                           │
│ ⚠️  Persistent fever after 48 hours                              │
│                                                                   │
│ If ANY of these happen, CONTACT DERRICK IMMEDIATELY             │
│ Phone: 555-0123                                                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─ ✅ YOU'RE DOING GREAT ───────────────────────────────────────────┐
│                                                                   │
│ You're following the doctor's plan perfectly. Complete the      │
│ full course of medicine, watch for the symptoms above, and      │
│ contact Derrick if anything seems off.                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Key Points:**
- Plain English, no medical jargon
- Clear medication instructions (amount, timing, duration)
- Observable side effects (not clinical terminology)
- Reassuring tone throughout
- Emergency contact prominent
- One page, easy to reference while administering medicine

---

## Screen 4: Child (8th Grade) View - Playful & Empowering

```
╔═══════════════════════════════════════════════════════════════════╗
║                          Hi! 👋                                   ║
║              Dr. Smith saw you today.                             ║
╚═══════════════════════════════════════════════════════════════════╝

╔───────────────────────────────────────────────────────────────────╗
║  Your ear has an infection.                                       ║
║  This medicine helps your body fight it off.                      ║
║  You'll feel better in a few days! 💪                             ║
╚───────────────────────────────────────────────────────────────────╝

┌─ 🎯 YOUR JOB ───────────────────────────────────────────────────┐
│                                                                  │
│ ┌─────────────┐                                                 │
│ │      1      │  Take one pill with breakfast                  │
│ │  (blue)     │                                                 │
│ └─────────────┘                                                 │
│                                                                  │
│ ┌─────────────┐                                                 │
│ │      2      │  Take one pill with lunch                      │
│ │  (blue)     │                                                 │
│ └─────────────┘                                                 │
│                                                                  │
│ ┌─────────────┐                                                 │
│ │      3      │  Take one pill with dinner                     │
│ │  (blue)     │                                                 │
│ └─────────────┘                                                 │
│                                                                  │
│ ┌─────────────┐                                                 │
│ │      4      │  Swallow with water                            │
│ │  (blue)     │                                                 │
│ └─────────────┘                                                 │
│                                                                  │
│ ┌─────────────┐                                                 │
│ │      5      │  Do this for 10 days                           │
│ │  (blue)     │                                                 │
│ └─────────────┘                                                 │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌─ 📝 IMPORTANT ─────────────────────────────────────────────────┐
│                                                                 │
│ Tell Mom or Dad if you forget a dose or feel funny            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─ 🚨 IF YOU FEEL BAD ────────────────────────────────────────────┐
│                                                                  │
│ Call Derrick immediately if:                                   │
│  • You get a rash                                              │
│  • You throw up                                                │
│  • You feel really bad                                         │
│                                                                 │
│ Phone: 555-0123                                                │
│                                                                 │
└──────────────────────────────────────────────────────────────────┘
```

**Key Points:**
- Bright, colorful, playful aesthetic
- Each instruction is a separate card (psychological win: completing tasks)
- Emojis provide context without complex language
- Extremely simple vocabulary (pill = pill, not "medication")
- Reassuring explanation ("You'll feel better in a few days")
- Clear emergency path (big red section)
- Numbered steps feel like a mission/game (increases compliance)

---

## Flow Diagram: How Messages Route to Family

```
┌─────────────────────────────────┐
│  01_Ingestion                   │
│  Audio: Doctor's Visit Notes    │
│  "The patient has otitis media" │
└────────────┬────────────────────┘
             │ (watcher detects)
             ↓
┌─────────────────────────────────┐
│  02_Extraction (automatic)      │
│  Converts to structured data    │
│  Medication: Amoxicillin        │
│  Dosage: 500 mg                 │
│  Frequency: TID                 │
└────────────┬────────────────────┘
             │ (watcher detects)
             ↓
┌─────────────────────────────────┐
│  03_Synthesis (automatic)       │
│  Generates THREE messages       │
│  1. Clinical (for Derrick)      │
│  2. Plain English (for Spouse)  │
│  3. Simple (for Child)          │
└────────────┬────────────────────┘
             │ (waits for approval)
             ↓
     ┌───────────────┐
     │  DERRICK      │
     │  REVIEW GATE  │
     │  [Approve]    │
     │  [Reject]     │
     │  [Modify]     │
     └───────┬───────┘
             │ (if approved)
             ↓
┌─────────────────────────────────┐
│  04_Distribution (manual)       │
│  Routes messages to family      │
│  • Derrick: archive record      │
│  • Spouse: push notification    │
│  • Child: app notification      │
└─────────────────────────────────┘
```

---

## Data Flow Example: One Input, Three Outputs

### INPUT
```
[Audio transcription from doctor's office]
"The patient has acute otitis media in the right ear with mild fever.
I'm prescribing Amoxicillin 500 mg, three times daily for 10 days.
Follow up in 10 days. Watch for rash or persistent fever."
```

### OUTPUT 1: Derrick's Clinical Message
```
PATIENT: Child's Name (8 years, 48 lbs)
SOURCE: Dr. Smith

⚠️ DOSING ALERT: Standard pediatric dose = 540 mg/dose
                 Prescribed dose = 500 mg (slightly low)
                 Verify if intentional

MEDICATION TABLE:
  Amoxicillin | 500 mg | PO | TID | Acute otitis | Complete full course | 10d

BASELINE CHECK:
  ✅ No allergy conflicts (tree nuts don't cross-react)
  ✅ No drug interactions (compatible with baseline cetirizine)

APPROVAL GATE: [⏳ Pending] [✅ Approve] [❌ Reject]
```

### OUTPUT 2: Spouse's Simple Message
```
WHAT HAPPENED:
Child has an ear infection.
Doctor prescribed an antibiotic.

HOW TO GIVE:
  • Name: Amoxicillin pill
  • Amount: One pill
  • When: Breakfast, lunch, dinner
  • How long: 10 days

WATCH FOR:
  ⚠️ Rash
  ⚠️ Vomiting
  ⚠️ Fever after 48 hours

Contact Derrick: 555-0123
```

### OUTPUT 3: Child's Fun Message
```
Hi! Dr. Smith saw you today.

You have an ear infection.
This medicine helps your body fight it off.
You'll feel better in a few days! 💪

YOUR JOB:
  1️⃣  Take one pill with breakfast
  2️⃣  Take one pill with lunch
  3️⃣  Take one pill with dinner
  4️⃣  Swallow with water
  5️⃣  Do this for 10 days

Tell Mom or Dad if you forget.

If you feel bad (rash, throwing up, feel awful):
Tell an adult RIGHT NOW. Call Derrick: 555-0123
```

---

## Mobile Responsiveness

All three views work on mobile (which is how your child will access their instructions during the day at school):

### Mobile: Derrick's Clinical View
```
┌──────────────────────┐
│ Child's Name (8 yrs) │
│ Dr. Smith • 2026-05 │
├──────────────────────┤
│                      │
│ ⚠️ DOSING ALERT      │
│ [Verify...]          │
│                      │
│ DIAGNOSIS            │
│ Otitis media        │
│                      │
│ MEDICATIONS          │
│ [Swipe table →]      │
│                      │
│ BASELINE CONTEXT     │
│ [Scrollable]         │
│                      │
│ ACTION ITEMS         │
│ ☐ Task 1            │
│ ☐ Task 2            │
│                      │
│ [Approve ▼]          │
└──────────────────────┘
```

### Mobile: Child's View
```
┌──────────────────────┐
│       Hi! 👋          │
│                      │
│ You have an infection│
│ Medicine helps fight │
│ You'll feel better!💪 │
│                      │
│ YOUR JOB:            │
│                      │
│ ┌──────────────────┐ │
│ │    1️⃣              │ │
│ │ Breakfast pill   │ │
│ └──────────────────┘ │
│                      │
│ ┌──────────────────┐ │
│ │    2️⃣              │ │
│ │ Lunch pill       │ │
│ └──────────────────┘ │
│                      │
│ [Scroll for more...] │
└──────────────────────┘
```

---

## Design Decisions Explained

| Decision | Why |
|----------|-----|
| **Three separate views** | Different people have different needs. NP needs full clinical data. Spouse needs simple actions. Child needs empowerment. |
| **Approval gate for Derrick** | Safety. No automated dispatch of health messages without NP oversight. |
| **Color coding** | Indigo/slate for clinical (serious). Blue for spouse (reassuring). Purple/pink/blue for child (playful). |
| **Tables for NP, paragraphs for spouse, cards for child** | Information density matches cognitive load. |
| **Emoji in child view, clinical symbols in NP view** | Age-appropriate communication style. |
| **"Tell Mom/Dad" language for child** | Empowers them to take action (tell adult) rather than scary (call emergency). |
| **Baseline context in NP view** | You have everything you need at a glance to make clinical decisions. |
| **No medical jargon for spouse/child** | Plain language increases understanding and compliance. |

---

## Testing the GUI Locally

The React code (`Family_Health_App_GUI.jsx`) is fully functional. To test:

1. **Copy the code** into a React environment (Create React App, Next.js, etc.)
2. **Install Lucide icons:** `npm install lucide-react`
3. **Run the component** and click the role tabs to see each view
4. **Test interactivity:**
   - Click alerts in NP view to expand them
   - Click checkboxes in action items
   - Try dropdown approval options
   - View different color schemes across roles

5. **Customize:**
   - Change medication data in the objects at the top
   - Modify colors in Tailwind classes (currently indigo/blue theme)
   - Update text to match your family's context

This GUI can stand alone as a web app, or integrate with your mobile app as a web view component.

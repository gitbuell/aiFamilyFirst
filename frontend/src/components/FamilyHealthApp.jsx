import React, { useState, useEffect } from 'react';
import {
  Lock, Eye, EyeOff, ChevronRight, User, Stethoscope, Users,
  Moon, Sun, LogOut, Home, Pill, Mic, Upload, FileText,
  AlertCircle, CheckCircle2, Clock, Send, Save, ClipboardList, ArrowLeft,
  Activity, Mail, Camera, Plus, X, ShieldAlert, MessageCircle,
} from 'lucide-react';
import { PatientsTab, profileToPatient } from './NPPatients.jsx';

/* ----------------------------------------------------------------
   aiFamilyFirst — restyled to match the aiSafePlate design system:
   flat teal cards, sticky header, bottom tab bar, [data-theme] light/dark.
   Demo only — built-in sample data, no backend.
   ---------------------------------------------------------------- */

const getInitialTheme = () => {
  try {
    return localStorage.getItem('aiff-theme') || 'light';
  } catch {
    return 'light';
  }
};

const nowLabel = () => {
  try {
    return new Date().toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  } catch {
    return 'Just now';
  }
};

// Medications are a structured list: { name, dose, usage }. Quick-pick presets
// for the most common meds so the guardian can add one in a tap, then tweak.
const COMMON_MEDS = [
  { name: 'Cetirizine', dose: '10 mg', usage: 'Once daily for allergies' },
  { name: 'Acetaminophen', dose: '500 mg', usage: 'Every 6 h as needed for pain/fever' },
  { name: 'Ibuprofen', dose: '200 mg', usage: 'Every 6–8 h with food, as needed for pain' },
  { name: 'Amoxicillin', dose: '500 mg', usage: 'Three times daily until finished' },
  { name: 'Albuterol', dose: '2 puffs', usage: 'As needed for wheezing/shortness of breath' },
  { name: 'Lisinopril', dose: '10 mg', usage: 'Once daily for blood pressure' },
];

// Backward-compat: older saved profiles stored medications as a freeform string.
// Normalize any value to a list of { name, dose, usage }.
const toMedList = (meds) => {
  if (Array.isArray(meds)) return meds;
  if (typeof meds === 'string' && meds.trim()) {
    return meds
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => ({ name: line, dose: '', usage: '' }));
  }
  return [];
};

// One-line label for a med, used in summaries / the NP roster.
const medLabel = (m) =>
  [m.name, m.dose].filter(Boolean).join(' ') + (m.usage ? ` — ${m.usage}` : '');

const medsToText = (meds) => toMedList(meds).map(medLabel).join('; ');

// Recommended-action items derived from the meds list, so the home screen's
// reminders track each medication's actual dosage schedule from the profile.
const medScheduleActions = (meds) =>
  toMedList(meds)
    .filter((m) => m.name)
    .map((m, i) => ({
      key: `${m.name}-${i}`,
      name: m.name,
      dose: m.dose,
      usage: m.usage,
    }));

// Allergies: the most common allergens are yes/no toggle chips; anything else
// goes in a freeform "other" field. Selected chips are stored as a string array.
const COMMON_ALLERGENS = [
  'Penicillin', 'Pollen', 'Peanuts', 'Tree nuts', 'Shellfish',
  'Eggs', 'Milk / Dairy', 'Soy', 'Latex', 'Dust mites',
  'Bee stings', 'Aspirin / NSAIDs',
];

const toAllergenList = (a) => (Array.isArray(a) ? a : []);

// Combine selected allergen chips + freeform "other" into one display string.
const allergiesToText = (allergens, other) => {
  const list = [...toAllergenList(allergens)];
  if (other && other.trim()) list.push(other.trim());
  return list.join('; ') || 'None reported';
};

// Patient intake profile — what the guardian fills in for the NP's assessment.
const DEFAULT_PROFILE = {
  patientName: 'Jordan Lee',
  age: '34',
  weightLbs: '170',
  heightIn: '69',
  bp: '118/76',
  hr: '72',
  extraVitals: [{ label: 'Temperature', value: '98.6°F' }],
  allergens: ['Penicillin', 'Pollen'],
  allergies: '', // freeform "other" allergens / details beyond the chips
  medications: [{ name: 'Cetirizine', dose: '10 mg', usage: 'Once daily for seasonal allergies' }],
  conditions: 'Seasonal allergic rhinitis',
  familyHistory: 'Mother: asthma. Father: hypertension.',
  concerns: 'Frequent morning congestion; occasional mild wheeze.',
  notesForNP: '',
};

const getInitialProfile = () => {
  try {
    const s = localStorage.getItem('aiff-profile');
    const merged = s ? { ...DEFAULT_PROFILE, ...JSON.parse(s) } : DEFAULT_PROFILE;
    return { ...merged, medications: toMedList(merged.medications), allergens: toAllergenList(merged.allergens) };
  } catch {
    return DEFAULT_PROFILE;
  }
};

const getInitialSubmitted = () => {
  try {
    return localStorage.getItem('aiff-intake-submitted') === '1';
  } catch {
    return false;
  }
};

// NP (practitioner) profile — who the clinician is, not a patient record.
const DEFAULT_NP_PROFILE = {
  name: 'MalToy Lewis',
  credentials: 'MSN, FNP-BC',
  organization: 'Aibuell Health Clinic',
  npi: '1234567890',
  email: 'maltoy@aibuell-health.org',
  phone: '(555) 200-3040',
};

const getInitialNpProfile = () => {
  try {
    const s = localStorage.getItem('aiff-np-profile');
    return s ? { ...DEFAULT_NP_PROFILE, ...JSON.parse(s) } : DEFAULT_NP_PROFILE;
  } catch {
    return DEFAULT_NP_PROFILE;
  }
};

// Reference tools/materials surfaced on the NP profile page.
const NP_REFERENCES = [
  { label: 'Pediatric dosing reference', detail: 'Weight-based mg/kg dosing tables', url: 'https://www.merckmanuals.com/professional/pediatrics' },
  { label: 'Drug interaction checker', detail: 'Check multi-med interactions', url: 'https://www.drugs.com/drug_interactions.html' },
  { label: 'CDC immunization schedules', detail: 'Child & adult schedules', url: 'https://www.cdc.gov/vaccines/schedules/' },
  { label: 'Lab reference ranges', detail: 'Normal values by age', url: 'https://www.merckmanuals.com/professional/resources/normal-laboratory-values' },
];

// Intake submissions (any source) queued for NP assessment. Seeded with a
// sample doctor email so the NP view demonstrates the assessment queue.
const SEED_SUBMISSIONS = [
  {
    id: 'seed-email-1',
    type: 'email',
    title: 'Visit summary — Alex Rivera',
    from: 'Dr. Johnson <jjohnson@clinic.org>',
    patient: 'Alex Rivera',
    date: 'Today',
    status: 'pending',
    summary: [
      ['Diagnosis', 'Acute otitis media (right ear)'],
      ['Prescribed', 'Amoxicillin 500 mg TID × 10 days'],
      ['Follow-up', '10 days if not improving'],
      ['Flag', 'Dosing: verify (std ≈ 540 mg/dose)'],
    ],
  },
];

const getInitialSubmissions = () => {
  try {
    const s = localStorage.getItem('aiff-submissions');
    return s ? JSON.parse(s) : SEED_SUBMISSIONS;
  } catch {
    return SEED_SUBMISSIONS;
  }
};

// Care-team chat thread (family ↔ NP). Demo persists to localStorage so the
// conversation is shared across role views — send as the family, switch to the
// NP view, and reply to the same thread.
const SEED_MESSAGES = [
  { id: 'seed-msg-1', side: 'np', text: 'Hi Jordan — your allergy plan looks good. Keep taking cetirizine once daily and let us know if the morning symptoms continue. See you on the 14th.', date: 'Jun 12, 9:10 AM' },
];

const getInitialMessages = () => {
  try {
    const s = localStorage.getItem('aiff-messages');
    return s ? JSON.parse(s) : SEED_MESSAGES;
  } catch {
    return SEED_MESSAGES;
  }
};

const ROLES = {
  self: { greeting: 'Signed in as Jordan Lee (age 34)', emoji: '🧑' },
  np: { greeting: 'Signed in as MalToy (Practitioner)', emoji: '👨‍⚕️' },
  child: { greeting: 'Signed in as Alex (age 8)', emoji: '👧' },
  parent: { greeting: 'Signed in as Sarah (Parent)', emoji: '👨‍👩‍👧' },
};

const DEFAULT_TABS = [
  { key: 'home', label: 'Home', Icon: Home },
  { key: 'meds', label: 'Meds', Icon: Pill },
  { key: 'family', label: 'Family', Icon: Users },
  { key: 'intake', label: 'Intake', Icon: Mic },
];

const NP_TABS = [
  { key: 'home', label: 'Home', Icon: Home },
  { key: 'patients', label: 'Patients', Icon: Users },
  { key: 'messages', label: 'Messages', Icon: MessageCircle },
  { key: 'intake', label: 'Intake', Icon: Mic },
];

const tabsForRole = (role) => (role === 'np' ? NP_TABS : DEFAULT_TABS);

// Header greeting. For the patient ('self') role it reflects the live profile's
// patient name + age so editing the profile updates the signed-in name.
const headerGreeting = (role, profile, npProfile) => {
  if (role === 'self' && profile?.patientName) {
    return `Signed in as ${profile.patientName}${profile.age ? ` (age ${profile.age})` : ''}`;
  }
  if (role === 'np' && npProfile?.name) {
    return `Signed in as ${npProfile.name} (Practitioner)`;
  }
  return ROLES[role]?.greeting;
};

const FamilyHealthApp = () => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [screen, setScreen] = useState('login'); // 'login' | 'app'
  const [role, setRole] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState(getInitialProfile);
  const [submitted, setSubmitted] = useState(getInitialSubmitted);
  const [submissions, setSubmissions] = useState(getInitialSubmissions);
  const [messages, setMessages] = useState(getInitialMessages);
  const [npProfile, setNpProfile] = useState(getInitialNpProfile);

  // login form (stub)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('aiff-theme', theme); } catch { /* ignore */ }
  }, [theme]);

  useEffect(() => {
    try { localStorage.setItem('aiff-profile', JSON.stringify(profile)); } catch { /* ignore */ }
  }, [profile]);

  useEffect(() => {
    try { localStorage.setItem('aiff-intake-submitted', submitted ? '1' : '0'); } catch { /* ignore */ }
  }, [submitted]);

  useEffect(() => {
    try { localStorage.setItem('aiff-submissions', JSON.stringify(submissions)); } catch { /* ignore */ }
  }, [submissions]);

  useEffect(() => {
    try { localStorage.setItem('aiff-messages', JSON.stringify(messages)); } catch { /* ignore */ }
  }, [messages]);

  useEffect(() => {
    try { localStorage.setItem('aiff-np-profile', JSON.stringify(npProfile)); } catch { /* ignore */ }
  }, [npProfile]);

  const sendMessage = (side, text) =>
    setMessages((list) => [...list, { id: `msg-${Date.now()}`, side, text, date: nowLabel() }]);

  const addSubmission = (sub) =>
    setSubmissions((list) => [{ id: `sub-${Date.now()}`, status: 'pending', date: nowLabel(), mine: true, ...sub }, ...list]);
  const assessSubmission = (id, status, note) =>
    setSubmissions((list) => list.map((s) => (s.id === id ? { ...s, status, ...(note !== undefined ? { npNote: note } : {}) } : s)));

  // Submitting the profile intake also drops an item in the assessment queue
  // (so it confirms on the patient's Home and reaches the NP).
  const submitProfileIntake = (form) => {
    setSubmitted(true);
    addSubmission({
      type: 'intake',
      title: `Profile intake — ${form.patientName}`,
      patient: form.patientName,
      summary: [
        ['Allergies', allergiesToText(form.allergens, form.allergies)],
        ['Medications', medsToText(form.medications)],
        ['Conditions', form.conditions],
        ['Concerns', form.concerns],
      ],
    });
  };

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const enterDemo = (r) => {
    setRole(r);
    setActiveTab('home');
    setScreen('app');
  };

  const ThemeToggle = ({ className = '' }) => (
    <button className={`icon-btn ${className}`} onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );

  /* ----------------------------- LOGIN ----------------------------- */
  if (screen === 'login') {
    return (
      <div className="auth-container">
        <ThemeToggle className="auth-theme-toggle" />
        <div className="auth-card">
          <h1 className="auth-title">aiFamilyFirst</h1>
          <p className="auth-subtitle">Family Health, Made Clear</p>

          <form
            className="auth-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (email && password) alert('Login would go here. This is a demo.');
            }}
          >
            <div>
              <label className="input-label">Email Address</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="input-label">Password</label>
              <div className="input-wrap">
                <input
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="input-eye"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label="Show password"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg">
              <Lock size={18} /> Sign In
            </button>
          </form>

          <div className="auth-divider"><span>OR TRY DEMO</span></div>

          <div className="demo-list">
            <button className="demo-btn" onClick={() => enterDemo('self')}>
              <span className="demo-btn-icon"><User size={18} /> 🧑 Patient View</span>
              <ChevronRight size={18} className="demo-btn-chevron" />
            </button>
            <button className="demo-btn" onClick={() => enterDemo('np')}>
              <span className="demo-btn-icon"><Stethoscope size={18} /> 👨‍⚕️ Practitioner View</span>
              <ChevronRight size={18} className="demo-btn-chevron" />
            </button>
          </div>

          <p className="auth-demo-hint">Demo credentials: demo@example.com / demo123</p>
          <div className="auth-dedication">
            <span className="footer-credit">Hinton &amp; Macklin Farm aiConsulting</span>
            <span className="footer-note">Translating clinical data into safe, age-appropriate family guidance.</span>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------ APP ------------------------------ */
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-header-brand">
          <span className="app-header-title">aiFamilyFirst</span>
          <span className="app-header-greeting">{headerGreeting(role, profile, npProfile)}</span>
        </div>
        <div className="app-header-actions">
          <button
            className="icon-btn"
            onClick={() => setShowProfile(true)}
            aria-label="Profile"
          >
            <User size={20} />
          </button>
          <ThemeToggle />
          <button
            className="icon-btn"
            onClick={() => { setScreen('login'); setRole(null); setShowProfile(false); }}
            aria-label="Sign out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="main-content">
        {showProfile ? (
          role === 'np' ? (
            <NPProfilePage
              profile={npProfile}
              onChange={setNpProfile}
              onClose={() => setShowProfile(false)}
            />
          ) : (
            <ProfilePage
              profile={profile}
              onChange={setProfile}
              submitted={submitted}
              onSubmit={submitProfileIntake}
              onClose={() => setShowProfile(false)}
            />
          )
        ) : (
          <>
            {activeTab === 'home' && <HomeTab role={role} profile={profile} submitted={submitted} submissions={submissions} onAssess={assessSubmission} onOpenProfile={() => setShowProfile(true)} onNavigate={setActiveTab} />}
            {activeTab === 'meds' && <MedsTab role={role} profile={profile} />}
            {activeTab === 'family' && <FamilyTab role={role} messages={messages} onSend={sendMessage} />}
            {activeTab === 'patients' && <PatientsTab live={profileToPatient(profile, submitted)} />}
            {activeTab === 'messages' && <MessagesTab messages={messages} onSend={sendMessage} />}
            {activeTab === 'intake' && <IntakeTab addSubmission={addSubmission} />}
          </>
        )}

        <footer className="app-footer">
          <span className="footer-credit">Hinton &amp; Macklin Farm aiConsulting</span>
          <span className="footer-note">aiFamilyFirst · demo build · sample data only</span>
        </footer>
      </main>

      <nav className="tab-bar">
        {tabsForRole(role).map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`tab-item ${!showProfile && activeTab === key ? 'tab-item-active' : ''}`}
            onClick={() => { setShowProfile(false); setActiveTab(key); }}
          >
            <Icon size={22} />
            <span className="tab-label">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

/* ------------------------------ TABS ------------------------------ */

const SOURCE_META = {
  audio: { label: 'Audio', Icon: Mic },
  email: { label: 'Email', Icon: Mail },
  notes: { label: 'Notes', Icon: ClipboardList },
  photo: { label: 'Photo', Icon: Camera },
  intake: { label: 'Intake', Icon: ClipboardList },
};

const STATUS_BADGE = {
  pending: ['badge-warning', 'Awaiting NP review'],
  assessed: ['badge-success', 'Reviewed by NP'],
  flagged: ['badge-warning', 'Needs clarification'],
};

// Patient-facing confirmation of what they've recently submitted for review.
const RecentUpdates = ({ submissions = [] }) => {
  const recent = submissions.filter((s) => s.mine).slice(0, 3);
  if (recent.length === 0) return null;
  return (
    <div className="card">
      <h3 className="card-title"><CheckCircle2 size={18} /> Recent Updates</h3>
      <p className="card-lead">Confirmation of what you've sent to your care team.</p>
      <ul className="list">
        {recent.map((s) => {
          const M = SOURCE_META[s.type] || SOURCE_META.notes;
          const [cls, text] = STATUS_BADGE[s.status] || STATUS_BADGE.pending;
          return (
            <li className="list-row" key={s.id}>
              <M.Icon size={18} className="list-row-icon" />
              <span style={{ flex: 1 }}>
                {s.title}<br />
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>{s.date}</span>
                {s.status === 'flagged' && s.npNote && (
                  <span style={{ display: 'block', fontSize: '0.8rem', marginTop: 4 }}>
                    <strong>NP asks:</strong> {s.npNote}
                  </span>
                )}
              </span>
              <span className={`badge ${cls}`}>{text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const HomeTab = ({ role, profile, submitted, submissions = [], onAssess, onOpenProfile, onNavigate }) => {
  if (role === 'child') {
    return (
      <>
        <h1 className="page-title">Home</h1>
        <div className="hero-card">
          <h2 className="hero-title">Hi Alex! 👋</h2>
          <p className="hero-text">Your health info is organized and easy to understand. Here's what's up today.</p>
        </div>
        <div className="alert alert-success">
          <CheckCircle2 size={20} />
          <div>
            <p className="alert-title">You're doing great! ✨</p>
            <p className="alert-body">You've taken your medicine as directed. Keep it up!</p>
          </div>
        </div>
        <div className="card">
          <h3 className="card-title"><Clock size={18} /> Next Appointment</h3>
          <p className="card-lead">Dr. Johnson (Pediatrician)</p>
          <p className="text-muted">📍 Children's Medical Clinic<br />📆 Fri, June 14, 2026 · 2:30 PM<br />⏱️ Check in 15 min early</p>
        </div>
      </>
    );
  }

  if (role === 'self') {
    return (
      <>
        <h1 className="page-title">Home</h1>
        <div className="hero-card">
          <h2 className="hero-title">Your Health Summary</h2>
          <p className="hero-text">Your latest AI-reviewed update, in plain language. You're in control of what's shared with your care team.</p>
          <p className="hero-meta">Last reviewed June 12, 2026</p>
        </div>
        <RecentUpdates submissions={submissions} />
        <div className="alert alert-info">
          <AlertCircle size={20} />
          <div>
            <p className="alert-title">Medication review</p>
            <p className="alert-body">Cetirizine 10 mg once daily for seasonal allergies. No interactions flagged with your current medications.</p>
          </div>
        </div>
        <div className="card">
          <h3 className="card-title"><Clock size={18} /> Next Appointment</h3>
          <p className="card-lead">Dr. Patel (Allergy &amp; Immunology)</p>
          <p className="text-muted">📍 Aibuell Health Clinic<br />📆 Fri, June 14, 2026 · 2:30 PM<br />⏱️ Check in 15 min early</p>
        </div>
        <div className="card">
          <h3 className="card-title"><CheckCircle2 size={18} /> Recommended Actions</h3>
          <ul className="list">
            {medScheduleActions(profile?.medications).map((a) => (
              <li className="list-row" key={a.key}>
                <Pill size={18} className="list-row-icon" />
                <span>
                  Take <strong>{a.name}{a.dose ? ` ${a.dose}` : ''}</strong>
                  {a.usage ? <> — <span className="text-muted">{a.usage}</span></> : null}
                </span>
              </li>
            ))}
            <li className="list-row">
              <Clock size={18} className="list-row-icon" />
              <span>Allergy follow-up: Friday, June 14, 2026 at 2:30 PM.</span>
            </li>
          </ul>
        </div>
      </>
    );
  }

  if (role === 'np') {
    const activePatients = submitted ? 3 : 2;
    const awaitingAssessment = submissions.filter((s) => s.status === 'pending').length;
    return (
      <>
        <h1 className="page-title">Dashboard</h1>
        <div className="stat-grid">
          <div className="stat-item">
            <Users size={22} className="stat-icon" />
            <div><p className="stat-value">{activePatients}</p><p className="stat-label">Active patients</p></div>
          </div>
          <div className="stat-item">
            <AlertCircle size={22} className="stat-icon" />
            <div><p className="stat-value">2</p><p className="stat-label">Pending approvals</p></div>
          </div>
          <div className="stat-item">
            <ClipboardList size={22} className="stat-icon" />
            <div><p className="stat-value">{awaitingAssessment}</p><p className="stat-label">Awaiting assessment</p></div>
          </div>
        </div>

        <p className="section-label">Pending Approvals</p>
        <div className="alert alert-warning">
          <AlertCircle size={20} />
          <div>
            <p className="alert-title">Alex · Cetirizine 10 mg refill <span className="badge badge-warning">Minor</span></p>
            <p className="alert-body">Dose 0.2 mg/kg — within range. No conflicts. Confirm continuation vs. change.</p>
            <div className="action-row">
              <button className="btn btn-success" onClick={() => alert('Approved. (Demo)')}><CheckCircle2 size={16} /> Approve</button>
              <button className="btn btn-secondary" onClick={() => alert('Opening details… (Demo)')}>Review details</button>
            </div>
          </div>
        </div>
        <div className="alert alert-danger">
          <AlertCircle size={20} />
          <div>
            <p className="alert-title">MalToy · Ibuprofen 400 mg <span className="badge badge-danger">Critical</span></p>
            <p className="alert-body">NSAID + Lisinopril (ACE-I) → hyperkalemia / acute kidney injury risk; also additive GI-bleed with aspirin. Recommend acetaminophen first-line.</p>
            <div className="action-row">
              <button className="btn btn-secondary" onClick={() => alert('Rejected — prescriber notified. (Demo)')}>Reject — call prescriber</button>
              <button className="btn btn-success" onClick={() => alert('Approved with conditions. (Demo)')}>Approve w/ conditions</button>
            </div>
          </div>
        </div>

        <IncomingAssessments submissions={submissions} onAssess={onAssess} />

        <button className="btn btn-ghost btn-full" onClick={() => onNavigate && onNavigate('patients')}>
          <Users size={16} /> View all patients
        </button>
      </>
    );
  }

  return (
    <>
      <h1 className="page-title">Home</h1>
      <div className="hero-card">
        <h2 className="hero-title">Family Health Summary</h2>
        <p className="hero-text">Latest AI-reviewed update, in plain language. Nothing reaches your child until you approve it.</p>
        <p className="hero-meta">Source: Dr. Johnson (Pediatrician) · Reviewed June 12, 2026</p>
      </div>
      <RecentUpdates submissions={submissions} />
      <div className="alert alert-warning">
        <AlertCircle size={20} />
        <div>
          <p className="alert-title">⚠ Needs Review — Dosing Verification</p>
          <p className="alert-body">Cetirizine 5 mg once daily recorded for an 8-year-old (48 lbs). Within the normal pediatric range, but flagged for a parent to confirm before the reminder is shared.</p>
        </div>
      </div>
      <div className="card">
        <h3 className="card-title"><CheckCircle2 size={18} /> Recommended Actions</h3>
        <ul className="list">
          {medScheduleActions(profile?.medications).map((a) => (
            <li className="list-row" key={a.key}>
              <Pill size={18} className="list-row-icon" />
              <span>
                Give <strong>{a.name}{a.dose ? ` ${a.dose}` : ''}</strong>
                {a.usage ? <> — <span className="text-muted">{a.usage}</span></> : null}
              </span>
            </li>
          ))}
          <li className="list-row">
            <Clock size={18} className="list-row-icon" />
            <span>Pediatrician follow-up: Friday, June 14, 2026 at 2:30 PM.</span>
          </li>
        </ul>
      </div>

      {role === 'parent' && (
        <div className="card">
          <h3 className="card-title"><ClipboardList size={18} /> Intake for the NP</h3>
          {submitted ? (
            <p className="card-lead" style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
              <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
              Submitted for NP assessment in your Profile.
            </p>
          ) : (
            <p className="card-lead" style={{ margin: 0 }}>
              Not yet submitted — submit the intake from your Profile.
            </p>
          )}
        </div>
      )}
    </>
  );
};

const IntakeRow = ({ label, value }) => (
  <li className="list-row">
    <span style={{ minWidth: 92, color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
    <span>{value || '—'}</span>
  </li>
);

const AssessmentCard = ({ submission: s, onAssess }) => {
  const M = SOURCE_META[s.type] || SOURCE_META.notes;
  const [flagging, setFlagging] = useState(false);
  const [note, setNote] = useState('');

  const sendFlag = () => {
    onAssess && onAssess(s.id, 'flagged', note.trim() || undefined);
    setFlagging(false);
    setNote('');
  };

  return (
    <div className="card card-accent">
      <h3 className="card-title">
        <M.Icon size={18} /> {s.title} <span className="badge badge-primary">{M.label}</span>
      </h3>
      <p className="card-lead">
        {s.from ? `${s.from} · ` : ''}{s.patient ? `Patient: ${s.patient} · ` : ''}{s.date}
      </p>
      {s.summary?.length > 0 && (
        <ul className="list">
          {s.summary.map(([k, v]) => <IntakeRow key={k} label={k} value={v} />)}
        </ul>
      )}

      {flagging ? (
        <div style={{ marginTop: 8 }}>
          <label className="input-label" htmlFor={`flag-${s.id}`}>Why does this need clarification?</label>
          <textarea
            id={`flag-${s.id}`}
            className="textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tell the family what to clarify (e.g. confirm the dose, missing weight, illegible date)…"
          />
          <div className="action-row">
            <button className="btn btn-secondary" onClick={sendFlag}>
              <Send size={16} /> Send back for clarification
            </button>
            <button className="btn btn-ghost" onClick={() => { setFlagging(false); setNote(''); }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="action-row">
          <button className="btn btn-success" onClick={() => onAssess && onAssess(s.id, 'assessed')}>
            <CheckCircle2 size={16} /> Approve &amp; Route
          </button>
          <button className="btn btn-secondary" onClick={() => setFlagging(true)}>
            Flag for clarification
          </button>
        </div>
      )}
    </div>
  );
};

const IncomingAssessments = ({ submissions = [], onAssess }) => {
  const pending = submissions.filter((s) => s.status === 'pending');
  return (
    <>
      <p className="section-label">Incoming for Assessment{pending.length ? ` (${pending.length})` : ''}</p>
      {pending.length === 0 ? (
        <div className="card"><p className="card-lead" style={{ margin: 0 }}>Nothing waiting — new intakes (email, notes, photo, audio) will appear here.</p></div>
      ) : (
        pending.map((s) => <AssessmentCard key={s.id} submission={s} onAssess={onAssess} />)
      )}
    </>
  );
};

const MedsTab = ({ role, profile }) => {
  const meds = toMedList(profile?.medications);
  return (
    <>
      <h1 className="page-title">Medications</h1>
      <p className="page-sub">
        {meds.length
          ? 'Your current medications, kept in sync with your Profile.'
          : 'No medications yet — add them in your Profile and they’ll show up here.'}
      </p>

      {meds.length === 0 ? (
        <div className="card">
          <p className="card-lead" style={{ margin: 0 }}>Nothing to show. Open your Profile to add a medication.</p>
        </div>
      ) : (
        meds.map((m, i) => (
          <div className="card card-accent" key={`${m.name}-${i}`}>
            <h3 className="card-title">
              <Pill size={18} /> {m.name || 'Medication'}
            </h3>
            {m.usage && <p className="card-lead">{m.usage}</p>}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {m.dose && <span className="badge badge-primary">💊 {m.dose}</span>}
              <span className="badge badge-success">On track</span>
            </div>
          </div>
        ))
      )}

      {role !== 'child' && meds.length > 0 && (
        <div className="alert alert-info">
          <AlertCircle size={20} />
          <div>
            <p className="alert-title">Adherence</p>
            <p className="alert-body">7 of 7 doses logged this week. No missed doses.</p>
          </div>
        </div>
      )}
    </>
  );
};

// Shared care-team chat bubble thread. mySide is 'family' or 'np'; the other
// side's messages render left-aligned, yours right-aligned.
const ChatThread = ({ messages = [], mySide, onSend, peerLabel }) => {
  const [draft, setDraft] = useState('');
  const send = () => {
    const t = draft.trim();
    if (!t) return;
    onSend(mySide, t);
    setDraft('');
  };
  return (
    <div className="card card-accent">
      <h3 className="card-title"><MessageCircle size={18} /> Chat with {peerLabel}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 340, overflowY: 'auto', padding: '4px 0 12px' }}>
        {messages.length === 0 ? (
          <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>No messages yet — say hello 👋</p>
        ) : (
          messages.map((m) => {
            const mine = m.side === mySide;
            return (
              <div key={m.id} style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '82%' }}>
                <div style={{
                  background: mine ? 'var(--primary)' : 'var(--surface-2)',
                  color: mine ? '#fff' : 'var(--text)',
                  padding: '8px 12px',
                  borderRadius: 14,
                  borderBottomRightRadius: mine ? 4 : 14,
                  borderBottomLeftRadius: mine ? 14 : 4,
                }}>
                  {m.text}
                </div>
                <span className="text-muted" style={{ fontSize: '0.7rem', display: 'block', textAlign: mine ? 'right' : 'left', marginTop: 2 }}>
                  {m.side === 'np' ? 'Care team (NP)' : 'Family'} · {m.date}
                </span>
              </div>
            );
          })
        )}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="input"
          style={{ flex: 1 }}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
          placeholder="Type a message…"
        />
        <button className="btn btn-primary" onClick={send} aria-label="Send message"><Send size={16} /></button>
      </div>
    </div>
  );
};

// NP-side chat surface (the "Messages" tab in the NP view).
const MessagesTab = ({ messages, onSend }) => (
  <>
    <h1 className="page-title">Messages</h1>
    <p className="page-sub">Chat with the family about their care. Your replies appear in their Care Team view.</p>
    <ChatThread messages={messages} mySide="np" onSend={onSend} peerLabel="the family" />
  </>
);

const FamilyTab = ({ role, messages, onSend }) => {
  const [approved, setApproved] = useState(false);

  if (role === 'self') {
    return (
      <>
        <h1 className="page-title">Care Team</h1>
        <div className="card">
          <h3 className="card-title"><Users size={18} /> Your Care Team</h3>
          <div>
            <div className="member-row">
              <span className="member-avatar">🩺</span>
              <div>
                <div className="member-name">MalToy</div>
                <div className="member-sub">Nurse Practitioner</div>
              </div>
            </div>
            <div className="member-row">
              <span className="member-avatar">👩‍⚕️</span>
              <div>
                <div className="member-name">Dr. Patel</div>
                <div className="member-sub">Allergy &amp; Immunology</div>
              </div>
            </div>
          </div>
        </div>
        <ChatThread messages={messages} mySide="family" onSend={onSend} peerLabel="your care team" />
      </>
    );
  }

  return (
    <>
      <h1 className="page-title">Family</h1>
      <div className="card">
        <h3 className="card-title"><Users size={18} /> Family Members</h3>
        <div>
          <div className="member-row">
            <span className="member-avatar">👧</span>
            <div>
              <div className="member-name">Alex</div>
              <div className="member-sub">Child · age 8</div>
            </div>
          </div>
          <div className="member-row">
            <span className="member-avatar">👩</span>
            <div>
              <div className="member-name">Sarah</div>
              <div className="member-sub">Parent / Guardian</div>
            </div>
          </div>
          <div className="member-row">
            <span className="member-avatar">🩺</span>
            <div>
              <div className="member-name">MalToy</div>
              <div className="member-sub">Nurse Practitioner</div>
            </div>
          </div>
        </div>
      </div>

      {role === 'child' ? (
        <div className="card card-accent">
          <h3 className="card-title">💬 Message from Mom</h3>
          <p style={{ fontStyle: 'italic' }}>"Hey sweetie! Don't forget your allergy pill with breakfast tomorrow. We're going to the park — have fun without sneezing! Love you ❤️"</p>
          <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: 8 }}>June 12, 2026 · 7:45 AM</p>
        </div>
      ) : (
        <div className="card card-accent">
          <h3 className="card-title">Draft message to your child</h3>
          <p className="card-lead">{approved ? 'Approved — released to Alex.' : 'Awaiting your approval'}</p>
          <p style={{ fontStyle: 'italic' }}>"Hey sweetie! Don't forget your allergy pill with breakfast tomorrow. We're going to the park — have fun without sneezing! Love you ❤️"</p>
          {approved ? (
            <div className="alert alert-success" style={{ marginTop: 14, marginBottom: 0 }}>
              <CheckCircle2 size={20} />
              <div><p className="alert-body">Message approved and sent to Alex.</p></div>
            </div>
          ) : (
            <div className="action-row">
              <button className="btn btn-success" onClick={() => setApproved(true)}>
                <Send size={16} /> Approve &amp; Send
              </button>
              <button className="btn btn-secondary" onClick={() => alert('Sent back for edits. (Demo)')}>
                Request Changes
              </button>
            </div>
          )}
        </div>
      )}

      {role !== 'child' && (
        <ChatThread messages={messages} mySide="family" onSend={onSend} peerLabel="your care team" />
      )}
    </>
  );
};

const INTAKE_SOURCES = [
  { key: 'audio', label: 'Audio', Icon: Mic },
  { key: 'email', label: 'Email', Icon: Mail },
  { key: 'notes', label: 'Doctor Notes', Icon: ClipboardList },
  { key: 'photo', label: 'Photo', Icon: Camera },
];

const SAMPLE_EMAIL = {
  from: 'Dr. Johnson <jjohnson@clinic.org>',
  subject: 'Visit summary — Alex Rivera',
  body: 'Saw Alex today for right ear pain. Exam consistent with acute otitis media. Started amoxicillin 500 mg TID for 10 days. RTC in 10 days if not improving.',
};

const SAMPLE_NOTE = 'S: Morning congestion, mild wheeze x2 wks.\nO: Lungs clear, no distress.\nA: Seasonal allergic rhinitis, well controlled.\nP: Continue cetirizine 10 mg daily; saline rinse; f/u PRN.';

// Demo "extraction" per source — what the Family Architect pulls out.
const extractFor = (source, email) => {
  switch (source) {
    case 'audio':
      return { title: 'Audio — visit recording', summary: [['Diagnosis', 'Seasonal allergic rhinitis'], ['Medication', 'Cetirizine 10 mg daily'], ['Follow-up', 'June 14, 2026'], ['Flags', 'None']] };
    case 'email':
      return { title: email.subject || 'Doctor email', from: email.from, summary: [['Diagnosis', 'Acute otitis media (R ear)'], ['Prescribed', 'Amoxicillin 500 mg TID × 10 days'], ['Follow-up', '10 days if not improving'], ['Flag', 'Dosing: verify (std ≈ 540 mg/dose)']] };
    case 'notes':
      return { title: 'Doctor notes', summary: [['Assessment', 'Allergic rhinitis, well controlled'], ['Plan', 'Continue cetirizine; saline rinse'], ['Medication', 'Cetirizine 10 mg daily'], ['Follow-up', 'PRN']] };
    case 'photo':
    default:
      return { title: 'Photo — handwritten Rx', summary: [['Medication', 'Amoxicillin'], ['Dose', '500 mg'], ['Sig', '1 cap TID × 10 days'], ['Prescriber', 'Dr. Johnson'], ['Confidence', 'Low — verify (OCR)']] };
  }
};

const IntakeTab = ({ addSubmission }) => {
  const [source, setSource] = useState('audio');
  const [phase, setPhase] = useState('idle'); // idle | recording | processing | done
  const [email, setEmail] = useState(SAMPLE_EMAIL);
  const [note, setNote] = useState(SAMPLE_NOTE);
  const [photoChosen, setPhotoChosen] = useState(false);
  const [result, setResult] = useState(null);

  const reset = () => { setPhase('idle'); setResult(null); setPhotoChosen(false); };
  const pick = (key) => { setSource(key); reset(); };

  const submit = () => {
    const ex = extractFor(source, email);
    addSubmission && addSubmission({ type: source, title: ex.title, from: ex.from || null, summary: ex.summary });
    setResult(ex);
    setPhase('processing');
    setTimeout(() => setPhase('done'), 1300);
  };

  return (
    <>
      <h1 className="page-title">Intake</h1>
      <p className="page-sub">Add a visit from any source. The Family Architect extracts the details and sends them to the NP for assessment.</p>

      <div className="seg">
        {INTAKE_SOURCES.map(({ key, label, Icon }) => (
          <button key={key} className={`seg-btn ${source === key ? 'seg-btn-active' : ''}`} onClick={() => pick(key)}>
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {phase === 'idle' && source === 'audio' && (
        <div className="card">
          <div className="intake-recorder">
            <button className="mic-btn" onClick={() => setPhase('recording')} aria-label="Start recording"><Mic size={36} /></button>
            <p className="text-muted">Tap to record a visit summary</p>
          </div>
          <button className="btn btn-secondary btn-full" onClick={submit}><Upload size={16} /> Upload audio file</button>
        </div>
      )}

      {phase === 'recording' && (
        <div className="card">
          <div className="intake-recorder">
            <button className="mic-btn mic-btn-recording" onClick={submit} aria-label="Stop recording"><Mic size={36} /></button>
            <p style={{ color: 'var(--danger)', fontWeight: 600 }}>Recording… tap to stop</p>
          </div>
        </div>
      )}

      {phase === 'idle' && source === 'email' && (
        <div className="card">
          <h3 className="card-title"><Mail size={18} /> Doctor email</h3>
          <label className="input-label">From</label>
          <input className="input" value={email.from} onChange={(e) => setEmail({ ...email, from: e.target.value })} />
          <label className="input-label" style={{ marginTop: 12 }}>Subject</label>
          <input className="input" value={email.subject} onChange={(e) => setEmail({ ...email, subject: e.target.value })} />
          <label className="input-label" style={{ marginTop: 12 }}>Body</label>
          <textarea className="textarea" value={email.body} onChange={(e) => setEmail({ ...email, body: e.target.value })} />
          <button className="btn btn-primary btn-full" style={{ marginTop: 12 }} onClick={submit}><Send size={16} /> Extract &amp; submit to NP</button>
        </div>
      )}

      {phase === 'idle' && source === 'notes' && (
        <div className="card">
          <h3 className="card-title"><ClipboardList size={18} /> Doctor notes</h3>
          <p className="profile-section-note">Paste or type the clinician's notes. SOAP format (Subjective / Objective / Assessment / Plan) is supported.</p>
          <textarea className="textarea" style={{ minHeight: 140 }} value={note} onChange={(e) => setNote(e.target.value)} placeholder={'S: …\nO: …\nA: …\nP: …'} />
          <button className="btn btn-primary btn-full" style={{ marginTop: 12 }} onClick={submit}><Send size={16} /> Extract &amp; submit to NP</button>
        </div>
      )}

      {phase === 'idle' && source === 'photo' && (
        <div className="card">
          <h3 className="card-title"><Camera size={18} /> Photo / picture intake <span className="badge badge-warning">Demo</span></h3>
          <p className="profile-section-note">Snap a prescription, lab result, or handwritten note — text would be read automatically (OCR). <strong>Demo:</strong> OCR is not wired up yet; a sample result is shown.</p>
          <div className="photo-drop">
            <Camera size={32} />
            {photoChosen ? <p style={{ margin: 0, color: 'var(--text)' }}>📄 prescription.jpg selected</p> : <p style={{ margin: 0 }}>No image selected</p>}
            <button className="btn btn-secondary" onClick={() => setPhotoChosen(true)}><Upload size={16} /> Choose photo</button>
          </div>
          <button className="btn btn-primary btn-full" style={{ marginTop: 12 }} disabled={!photoChosen} onClick={submit}><Send size={16} /> Extract &amp; submit to NP</button>
        </div>
      )}

      {phase === 'processing' && (
        <div className="card">
          <div className="empty-state">
            <div className="loading-spinner" />
            <p>Extracting clinical details…</p>
          </div>
        </div>
      )}

      {phase === 'done' && result && (
        <>
          <div className="alert alert-success">
            <CheckCircle2 size={20} />
            <div>
              <p className="alert-title">Submitted to the NP for assessment</p>
              <p className="alert-body">Extraction complete — it now appears in the NP's assessment queue.</p>
            </div>
          </div>
          <div className="card card-accent">
            <h3 className="card-title"><FileText size={18} /> {result.title}</h3>
            <ul className="list">
              {result.summary.map(([k, v]) => (
                <li className="list-row" key={k}>
                  <span style={{ minWidth: 96, color: 'var(--text-muted)', fontWeight: 600 }}>{k}</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
          <button className="btn btn-ghost btn-full" onClick={reset}>New intake</button>
        </>
      )}
    </>
  );
};

/* ----------------------------- PROFILE ----------------------------- */

const ProfilePage = ({ profile, onChange, submitted, onSubmit, onClose }) => {
  const [form, setForm] = useState(() => ({ ...profile, medications: toMedList(profile.medications), allergens: toAllergenList(profile.allergens) }));
  const [saved, setSaved] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const set = (k, v) => { setSaved(false); setForm((f) => ({ ...f, [k]: v })); };

  const addVital = () => set('extraVitals', [...(form.extraVitals || []), { label: '', value: '' }]);
  const updateVital = (i, key, val) =>
    set('extraVitals', (form.extraVitals || []).map((v, idx) => (idx === i ? { ...v, [key]: val } : v)));
  const removeVital = (i) => set('extraVitals', (form.extraVitals || []).filter((_, idx) => idx !== i));

  const meds = form.medications || [];
  const addMed = (preset) => set('medications', [...meds, preset || { name: '', dose: '', usage: '' }]);
  const updateMed = (i, key, val) =>
    set('medications', meds.map((m, idx) => (idx === i ? { ...m, [key]: val } : m)));
  const removeMed = (i) => set('medications', meds.filter((_, idx) => idx !== i));

  const allergens = form.allergens || [];
  const toggleAllergen = (name) =>
    set('allergens', allergens.includes(name) ? allergens.filter((a) => a !== name) : [...allergens, name]);

  // The blue "submitted" confirmation auto-dismisses after 10 seconds.
  useEffect(() => {
    if (!justSubmitted) return undefined;
    const t = setTimeout(() => setJustSubmitted(false), 10000);
    return () => clearTimeout(t);
  }, [justSubmitted]);

  const handleSave = (e) => {
    e.preventDefault();
    onChange(form);
    setSaved(true);
  };

  const handleSubmit = () => {
    onChange(form);
    onSubmit(form);
    setSaved(false);
    setJustSubmitted(true);
  };

  return (
    <div className="page-container">
      <div className="profile-head">
        <button className="icon-btn" onClick={onClose} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="page-title profile-title">Profile</h1>
      </div>
      <p className="page-sub">The details here are submitted to the Nurse Practitioner for assessment. Nothing is shared until you submit.</p>

      {justSubmitted && (
        <div className="alert alert-info">
          <ClipboardList size={20} />
          <div><p className="alert-body">Submitted for NP assessment — it now appears in the NP's view.</p></div>
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="card profile-card">
          <h3 className="card-title">Patient</h3>
          <label className="input-label" htmlFor="pf-name">Name</label>
          <input id="pf-name" className="input" value={form.patientName} onChange={(e) => set('patientName', e.target.value)} placeholder="Full name" />
          <label className="input-label" htmlFor="pf-age">Age</label>
          <input id="pf-age" className="input" value={form.age} onChange={(e) => set('age', e.target.value)} placeholder="Age in years" inputMode="numeric" />
          <label className="input-label" htmlFor="pf-wt">Weight (lbs)</label>
          <input id="pf-wt" className="input" value={form.weightLbs} onChange={(e) => set('weightLbs', e.target.value)} placeholder="e.g. 48" inputMode="numeric" />
          <label className="input-label" htmlFor="pf-ht">Height (in)</label>
          <input id="pf-ht" className="input" value={form.heightIn} onChange={(e) => set('heightIn', e.target.value)} placeholder="e.g. 50" inputMode="numeric" />
        </div>

        <div className="card profile-card">
          <h3 className="card-title">Vitals</h3>
          <p className="profile-section-note">Most recent readings, if you have them.</p>
          <label className="input-label" htmlFor="pf-bp">Blood pressure</label>
          <input id="pf-bp" className="input" value={form.bp} onChange={(e) => set('bp', e.target.value)} placeholder="e.g. 110/70" />
          <label className="input-label" htmlFor="pf-hr">Heart rate (bpm)</label>
          <input id="pf-hr" className="input" value={form.hr} onChange={(e) => set('hr', e.target.value)} placeholder="e.g. 88" inputMode="numeric" />

          {(form.extraVitals || []).map((v, i) => (
            <div className="vital-row" key={i}>
              <input className="input" value={v.label} onChange={(e) => updateVital(i, 'label', e.target.value)} placeholder="Vital (e.g. O₂ sat)" />
              <input className="input" value={v.value} onChange={(e) => updateVital(i, 'value', e.target.value)} placeholder="Value" />
              <button type="button" className="icon-btn" onClick={() => removeVital(i)} aria-label="Remove vital"><X size={18} /></button>
            </div>
          ))}
          <button type="button" className="btn btn-ghost" style={{ marginTop: 10 }} onClick={addVital}>
            <Plus size={16} /> Add vital
          </button>
        </div>

        <div className="card profile-card">
          <h3 className="card-title"><ShieldAlert size={18} /> Allergies</h3>
          <p className="profile-section-note">Tap any that apply (Yes). Tap again to turn off (No).</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {COMMON_ALLERGENS.map((name) => {
              const on = allergens.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  className={`badge ${on ? 'badge-danger' : 'badge-default'}`}
                  style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 10px', fontSize: '0.85rem' }}
                  aria-pressed={on}
                  onClick={() => toggleAllergen(name)}
                >
                  {on ? <CheckCircle2 size={14} /> : <Plus size={14} />} {name}
                </button>
              );
            })}
          </div>
          <label className="input-label" htmlFor="pf-allergies" style={{ marginTop: 14 }}>Other allergies / details</label>
          <textarea id="pf-allergies" className="textarea" value={form.allergies} onChange={(e) => set('allergies', e.target.value)} placeholder="Anything not listed above, plus reactions (e.g. rash, anaphylaxis)" />
        </div>

        <div className="card profile-card">
          <h3 className="card-title">Conditions</h3>
          <label className="input-label" htmlFor="pf-cond">Conditions / diagnoses</label>
          <textarea id="pf-cond" className="textarea" value={form.conditions} onChange={(e) => set('conditions', e.target.value)} placeholder="Ongoing conditions" />
        </div>

        <div className="card profile-card">
          <h3 className="card-title"><Pill size={18} /> Current medications</h3>
          <p className="profile-section-note">Add each medication with its dose and how it's taken. This list drives your Meds tab.</p>

          {meds.length === 0 && (
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>No medications added yet.</p>
          )}

          {meds.map((m, i) => (
            <div className="card" key={i} style={{ padding: 12, marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <input
                  className="input"
                  style={{ flex: 1, fontWeight: 600 }}
                  value={m.name}
                  onChange={(e) => updateMed(i, 'name', e.target.value)}
                  placeholder="Medication name"
                />
                <button type="button" className="icon-btn" onClick={() => removeMed(i)} aria-label="Remove medication"><X size={18} /></button>
              </div>
              <label className="input-label">Dose</label>
              <input className="input" value={m.dose} onChange={(e) => updateMed(i, 'dose', e.target.value)} placeholder="e.g. 10 mg" />
              <label className="input-label" style={{ marginTop: 8 }}>Usage</label>
              <input className="input" value={m.usage} onChange={(e) => updateMed(i, 'usage', e.target.value)} placeholder="e.g. Once daily with breakfast" />
            </div>
          ))}

          <button type="button" className="btn btn-ghost" style={{ marginTop: 4 }} onClick={() => addMed()}>
            <Plus size={16} /> Add medication
          </button>

          <p className="profile-section-note" style={{ marginTop: 14 }}>Quick add a common one:</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {COMMON_MEDS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                className="btn btn-secondary"
                style={{ flex: '0 0 auto' }}
                onClick={() => addMed({ ...preset })}
              >
                <Plus size={14} /> {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="card profile-card">
          <h3 className="card-title">Family history</h3>
          <textarea id="pf-fam" className="textarea" value={form.familyHistory} onChange={(e) => set('familyHistory', e.target.value)} placeholder="Relevant family medical history" />
        </div>

        <div className="card profile-card">
          <h3 className="card-title">For the NP</h3>
          <p className="profile-section-note">Reason for assessment and anything you want the NP to know.</p>
          <label className="input-label" htmlFor="pf-concerns">Current concerns</label>
          <textarea id="pf-concerns" className="textarea" value={form.concerns} onChange={(e) => set('concerns', e.target.value)} placeholder="What's prompting this assessment?" />
          <label className="input-label" htmlFor="pf-notes">Notes</label>
          <textarea id="pf-notes" className="textarea" value={form.notesForNP} onChange={(e) => set('notesForNP', e.target.value)} placeholder="Anything else for the NP" />
        </div>

        {saved && (
          <div className="alert alert-success">
            <CheckCircle2 size={20} />
            <div><p className="alert-body">Saved.</p></div>
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-full">
          <Save size={18} /> Save changes
        </button>
        <button type="button" className="btn btn-success btn-full" style={{ marginTop: 10 }} onClick={handleSubmit}>
          <Send size={18} /> Submit for NP assessment
        </button>
      </form>
    </div>
  );
};

/* --------------------------- NP PROFILE --------------------------- */
// The practitioner's own profile: identity, organization, and reference tools.
// This is NOT a patient record — the NP reviews patient charts under Patients.
const NPProfilePage = ({ profile, onChange, onClose }) => {
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);
  const set = (k, v) => { setSaved(false); setForm((f) => ({ ...f, [k]: v })); };
  const handleSave = (e) => { e.preventDefault(); onChange(form); setSaved(true); };

  return (
    <div className="page-container">
      <div className="profile-head">
        <button className="icon-btn" onClick={onClose} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="page-title profile-title">My Profile</h1>
      </div>
      <p className="page-sub">Your practitioner details and quick reference tools.</p>

      <form onSubmit={handleSave}>
        <div className="card profile-card">
          <h3 className="card-title"><Stethoscope size={18} /> Practitioner</h3>
          <label className="input-label" htmlFor="np-name">Name</label>
          <input id="np-name" className="input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name" />
          <label className="input-label" htmlFor="np-cred">Credentials</label>
          <input id="np-cred" className="input" value={form.credentials} onChange={(e) => set('credentials', e.target.value)} placeholder="e.g. MSN, FNP-BC" />
          <label className="input-label" htmlFor="np-npi">NPI number</label>
          <input id="np-npi" className="input" value={form.npi} onChange={(e) => set('npi', e.target.value)} placeholder="10-digit NPI" inputMode="numeric" />
        </div>

        <div className="card profile-card">
          <h3 className="card-title"><Users size={18} /> Organization</h3>
          <label className="input-label" htmlFor="np-org">Practice / organization</label>
          <input id="np-org" className="input" value={form.organization} onChange={(e) => set('organization', e.target.value)} placeholder="Clinic or practice name" />
          <label className="input-label" htmlFor="np-email">Work email</label>
          <input id="np-email" className="input" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@clinic.org" />
          <label className="input-label" htmlFor="np-phone">Phone</label>
          <input id="np-phone" className="input" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="(555) 555-5555" />
        </div>

        {saved && (
          <div className="alert alert-success">
            <CheckCircle2 size={20} />
            <div><p className="alert-body">Saved.</p></div>
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-full">
          <Save size={18} /> Save changes
        </button>
      </form>

      <div className="card profile-card">
        <h3 className="card-title"><ClipboardList size={18} /> Reference Tools</h3>
        <p className="profile-section-note">Quick links to clinical reference material.</p>
        <ul className="list">
          {NP_REFERENCES.map((r) => (
            <li className="list-row" key={r.label}>
              <FileText size={18} className="list-row-icon" />
              <span style={{ flex: 1 }}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>{r.label}</a>
                <br /><span className="text-muted" style={{ fontSize: '0.8rem' }}>{r.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FamilyHealthApp;

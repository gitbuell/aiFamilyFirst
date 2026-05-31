import React, { useState, useEffect } from 'react';
import {
  Lock, Eye, EyeOff, ChevronRight, User, Stethoscope, Users,
  Moon, Sun, LogOut, Home, Pill, Mic, Upload, FileText,
  AlertCircle, CheckCircle2, Clock, Send, Save, ClipboardList, ArrowLeft,
} from 'lucide-react';

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

// Patient intake profile — what the guardian fills in for the NP's assessment.
const DEFAULT_PROFILE = {
  patientName: 'Alex Rivera',
  age: '8',
  weightLbs: '48',
  allergies: 'Pollen, dust mites',
  medications: 'Cetirizine 5 mg, once daily',
  conditions: 'Seasonal allergic rhinitis',
  familyHistory: 'Mother: asthma. Father: seasonal allergies.',
  concerns: 'Frequent morning sneezing; occasional mild wheeze after recess.',
  notesForNP: '',
};

const getInitialProfile = () => {
  try {
    const s = localStorage.getItem('aiff-profile');
    return s ? { ...DEFAULT_PROFILE, ...JSON.parse(s) } : DEFAULT_PROFILE;
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

const ROLES = {
  child: { greeting: 'Signed in as Alex (age 8)', emoji: '👧' },
  np: { greeting: 'Signed in as Derrick (NP)', emoji: '👨‍⚕️' },
  parent: { greeting: 'Signed in as Sarah (Parent)', emoji: '👨‍👩‍👧' },
};

const TABS = [
  { key: 'home', label: 'Home', Icon: Home },
  { key: 'meds', label: 'Meds', Icon: Pill },
  { key: 'family', label: 'Family', Icon: Users },
  { key: 'intake', label: 'Intake', Icon: Mic },
];

const FamilyHealthApp = () => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [screen, setScreen] = useState('login'); // 'login' | 'app'
  const [role, setRole] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState(getInitialProfile);
  const [submitted, setSubmitted] = useState(getInitialSubmitted);

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
            <button className="demo-btn" onClick={() => enterDemo('child')}>
              <span className="demo-btn-icon"><User size={18} /> 👧 Patient Demo (Child)</span>
              <ChevronRight size={18} className="demo-btn-chevron" />
            </button>
            <button className="demo-btn" onClick={() => enterDemo('parent')}>
              <span className="demo-btn-icon"><Users size={18} /> 👨‍👩‍👧 Parent Demo (Guardian)</span>
              <ChevronRight size={18} className="demo-btn-chevron" />
            </button>
            <button className="demo-btn" onClick={() => enterDemo('np')}>
              <span className="demo-btn-icon"><Stethoscope size={18} /> 👨‍⚕️ NP Demo (Derrick)</span>
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
          <span className="app-header-greeting">{ROLES[role]?.greeting}</span>
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
          <ProfilePage
            profile={profile}
            onChange={setProfile}
            submitted={submitted}
            onSubmit={() => setSubmitted(true)}
            onClose={() => setShowProfile(false)}
          />
        ) : (
          <>
            {activeTab === 'home' && <HomeTab role={role} profile={profile} submitted={submitted} onOpenProfile={() => setShowProfile(true)} />}
            {activeTab === 'meds' && <MedsTab role={role} />}
            {activeTab === 'family' && <FamilyTab role={role} />}
            {activeTab === 'intake' && <IntakeTab />}
          </>
        )}

        <footer className="app-footer">
          <span className="footer-credit">Hinton &amp; Macklin Farm aiConsulting</span>
          <span className="footer-note">aiFamilyFirst · demo build · sample data only</span>
        </footer>
      </main>

      <nav className="tab-bar">
        {TABS.map(({ key, label, Icon }) => (
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

const HomeTab = ({ role, profile, submitted, onOpenProfile }) => {
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
  return (
    <>
      <h1 className="page-title">Home</h1>
      <div className="hero-card">
        <h2 className="hero-title">Family Health Summary</h2>
        <p className="hero-text">Latest AI-reviewed update, in plain language. Nothing reaches your child until you approve it.</p>
        <p className="hero-meta">Source: Dr. Johnson (Pediatrician) · Reviewed June 12, 2026</p>
      </div>
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
          <li className="list-row">
            <CheckCircle2 size={18} className="list-row-icon" />
            <span>Confirm the cetirizine dose, then approve the reminder for your child.</span>
          </li>
          <li className="list-row">
            <Clock size={18} className="list-row-icon" />
            <span>Pediatrician follow-up: Friday, June 14, 2026 at 2:30 PM.</span>
          </li>
        </ul>
      </div>

      {role === 'np' && (
        <div className="card card-accent">
          <h3 className="card-title"><ClipboardList size={18} /> Patient Intake for Assessment</h3>
          {submitted ? (
            <>
              <p className="card-lead">
                Submitted by guardian — awaiting your review.{' '}
                <span className="badge badge-warning">Awaiting NP review</span>
              </p>
              <ul className="list">
                <IntakeRow label="Patient" value={`${profile.patientName}, age ${profile.age} (${profile.weightLbs} lbs)`} />
                <IntakeRow label="Allergies" value={profile.allergies} />
                <IntakeRow label="Medications" value={profile.medications} />
                <IntakeRow label="Conditions" value={profile.conditions} />
                <IntakeRow label="Family hx" value={profile.familyHistory} />
                <IntakeRow label="Concerns" value={profile.concerns} />
                {profile.notesForNP && <IntakeRow label="Notes" value={profile.notesForNP} />}
              </ul>
            </>
          ) : (
            <p className="card-lead">No intake has been submitted by the guardian yet.</p>
          )}
        </div>
      )}

      {role === 'parent' && (
        <div className="card">
          <h3 className="card-title"><ClipboardList size={18} /> Intake for the NP</h3>
          <p className="card-lead">
            {submitted
              ? 'Your intake has been submitted for the NP to assess.'
              : 'Add your child’s health details so the NP can assess them.'}
          </p>
          <button className="btn btn-ghost" onClick={onOpenProfile}>
            <User size={16} /> {submitted ? 'Update intake' : 'Complete intake'}
          </button>
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

const MedsTab = ({ role }) => {
  const lead = role === 'child'
    ? 'One pill with breakfast every day. It helps with itching and sneezing from allergies.'
    : '5 mg by mouth, once daily with breakfast. Antihistamine for allergic rhinitis.';
  return (
    <>
      <h1 className="page-title">Medications</h1>
      <div className="card card-accent">
        <h3 className="card-title"><Pill size={18} /> Cetirizine (Allergy)</h3>
        <p className="card-lead">{lead}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className="badge badge-primary">💊 Once daily</span>
          <span className="badge badge-default">With breakfast</span>
          <span className="badge badge-success">On track</span>
        </div>
      </div>
      {role !== 'child' && (
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

const FamilyTab = ({ role }) => {
  const [approved, setApproved] = useState(false);
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
              <div className="member-name">Derrick</div>
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
    </>
  );
};

const SAMPLE_EXTRACTION = {
  source: 'Dr. Johnson — well-child visit',
  fields: [
    ['Diagnosis', 'Seasonal allergic rhinitis'],
    ['Medication', 'Cetirizine 5 mg, once daily'],
    ['Follow-up', 'June 14, 2026 · 2:30 PM'],
    ['Flags', '1 dosing item for parent review'],
  ],
};

const IntakeTab = () => {
  const [state, setState] = useState('idle'); // idle | recording | processing | done

  const stopAndProcess = () => {
    setState('processing');
    setTimeout(() => setState('done'), 1500);
  };

  return (
    <>
      <h1 className="page-title">Audio Intake</h1>
      <p className="page-sub">Record or upload a visit. The Family Architect extracts the details for review.</p>

      {state === 'idle' && (
        <div className="card">
          <div className="intake-recorder">
            <button className="mic-btn" onClick={() => setState('recording')} aria-label="Start recording">
              <Mic size={36} />
            </button>
            <p className="text-muted">Tap to record a visit summary</p>
          </div>
          <button className="btn btn-secondary btn-full" onClick={stopAndProcess}>
            <Upload size={16} /> Upload audio file
          </button>
        </div>
      )}

      {state === 'recording' && (
        <div className="card">
          <div className="intake-recorder">
            <button className="mic-btn mic-btn-recording" onClick={stopAndProcess} aria-label="Stop recording">
              <Mic size={36} />
            </button>
            <p style={{ color: 'var(--danger)', fontWeight: 600 }}>Recording… tap to stop</p>
          </div>
        </div>
      )}

      {state === 'processing' && (
        <div className="card">
          <div className="empty-state">
            <div className="loading-spinner" />
            <p>Extracting clinical details…</p>
          </div>
        </div>
      )}

      {state === 'done' && (
        <>
          <div className="alert alert-success">
            <CheckCircle2 size={20} />
            <div>
              <p className="alert-title">Extraction complete</p>
              <p className="alert-body">Structured data ready for synthesis &amp; parent review.</p>
            </div>
          </div>
          <div className="card card-accent">
            <h3 className="card-title"><FileText size={18} /> Extracted Summary</h3>
            <p className="card-lead">{SAMPLE_EXTRACTION.source}</p>
            <ul className="list">
              {SAMPLE_EXTRACTION.fields.map(([k, v]) => (
                <li className="list-row" key={k}>
                  <span style={{ minWidth: 96, color: 'var(--text-muted)', fontWeight: 600 }}>{k}</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
          <button className="btn btn-ghost btn-full" onClick={() => setState('idle')}>
            New intake
          </button>
        </>
      )}
    </>
  );
};

/* ----------------------------- PROFILE ----------------------------- */

const ProfilePage = ({ profile, onChange, submitted, onSubmit, onClose }) => {
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const set = (k, v) => { setSaved(false); setForm((f) => ({ ...f, [k]: v })); };

  const handleSave = (e) => {
    e.preventDefault();
    onChange(form);
    setSaved(true);
  };

  const handleSubmit = () => {
    onChange(form);
    onSubmit();
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

      <form onSubmit={handleSave}>
        <div className="card profile-card">
          <h3 className="card-title">Patient</h3>
          <label className="input-label" htmlFor="pf-name">Name</label>
          <input id="pf-name" className="input" value={form.patientName} onChange={(e) => set('patientName', e.target.value)} placeholder="Full name" />
          <label className="input-label" htmlFor="pf-age">Age</label>
          <input id="pf-age" className="input" value={form.age} onChange={(e) => set('age', e.target.value)} placeholder="Age in years" inputMode="numeric" />
          <label className="input-label" htmlFor="pf-wt">Weight (lbs)</label>
          <input id="pf-wt" className="input" value={form.weightLbs} onChange={(e) => set('weightLbs', e.target.value)} placeholder="e.g. 48" inputMode="numeric" />
        </div>

        <div className="card profile-card">
          <h3 className="card-title">Health</h3>
          <label className="input-label" htmlFor="pf-allergies">Allergies</label>
          <textarea id="pf-allergies" className="textarea" value={form.allergies} onChange={(e) => set('allergies', e.target.value)} placeholder="Known allergies" />
          <label className="input-label" htmlFor="pf-meds">Current medications</label>
          <textarea id="pf-meds" className="textarea" value={form.medications} onChange={(e) => set('medications', e.target.value)} placeholder="Name, dose, frequency" />
          <label className="input-label" htmlFor="pf-cond">Conditions / diagnoses</label>
          <textarea id="pf-cond" className="textarea" value={form.conditions} onChange={(e) => set('conditions', e.target.value)} placeholder="Ongoing conditions" />
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
        {(submitted || justSubmitted) && (
          <div className="alert alert-info">
            <ClipboardList size={20} />
            <div><p className="alert-body">Submitted for NP assessment — it now appears in the NP's view.</p></div>
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-full">
          <Save size={18} /> Save changes
        </button>
        <button type="button" className="btn btn-ghost btn-full" style={{ marginTop: 10 }} onClick={handleSubmit}>
          <Send size={18} /> Submit for NP assessment
        </button>
      </form>
    </div>
  );
};

export default FamilyHealthApp;

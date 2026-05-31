import React, { useState, useEffect } from 'react';
import {
  Lock, Eye, EyeOff, ChevronRight, User, Stethoscope, Users,
  Moon, Sun, LogOut, Home, Pill, Mic, Upload, FileText,
  AlertCircle, CheckCircle2, Clock, Send,
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

  // login form (stub)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('aiff-theme', theme); } catch { /* ignore */ }
  }, [theme]);

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
            <button className="demo-btn" onClick={() => enterDemo('np')}>
              <span className="demo-btn-icon"><Stethoscope size={18} /> 👨‍⚕️ NP Demo (Derrick)</span>
              <ChevronRight size={18} className="demo-btn-chevron" />
            </button>
            <button className="demo-btn" onClick={() => enterDemo('parent')}>
              <span className="demo-btn-icon"><Users size={18} /> 👨‍👩‍👧 Parent Demo (Guardian)</span>
              <ChevronRight size={18} className="demo-btn-chevron" />
            </button>
          </div>

          <p className="auth-demo-hint">Demo credentials: demo@example.com / demo123</p>
          <p className="auth-dedication">Translating clinical data into safe, age-appropriate family guidance.</p>
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
          <ThemeToggle />
          <button
            className="icon-btn"
            onClick={() => { setScreen('login'); setRole(null); }}
            aria-label="Sign out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="main-content">
        {activeTab === 'home' && <HomeTab role={role} />}
        {activeTab === 'meds' && <MedsTab role={role} />}
        {activeTab === 'family' && <FamilyTab role={role} />}
        {activeTab === 'intake' && <IntakeTab />}

        <p className="app-footer">aiFamilyFirst · demo build · sample data only</p>
      </main>

      <nav className="tab-bar">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`tab-item ${activeTab === key ? 'tab-item-active' : ''}`}
            onClick={() => setActiveTab(key)}
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

const HomeTab = ({ role }) => {
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
    </>
  );
};

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

export default FamilyHealthApp;

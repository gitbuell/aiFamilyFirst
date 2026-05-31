import React, { useState } from 'react';
import {
  ChevronRight, ArrowLeft, AlertCircle, Pill, ClipboardList, Activity,
  Users, CheckCircle2, Clock, FlaskConical, ShieldAlert, Save, Send,
} from 'lucide-react';

/* ----------------------------------------------------------------
   NP Patients — roster + rich per-patient clinical chart.
   Sample data harvested from the original prototypes/specs.
   ---------------------------------------------------------------- */

// A submitted medication can be the structured { name, dose, usage } shape
// (current) or a plain string (older saved profiles). Render either to text.
const medLabel = (m) =>
  typeof m === 'string'
    ? m
    : [m.name, m.dose].filter(Boolean).join(' ') + (m.usage ? ` — ${m.usage}` : '');

const medsToText = (medications) =>
  Array.isArray(medications)
    ? medications.map(medLabel).filter(Boolean).join('; ')
    : (medications || '');

// Allergies = selected common-allergen chips (array) + freeform "other" string.
const allergiesToText = (allergens, other) => {
  const list = Array.isArray(allergens) ? [...allergens] : [];
  if (other && String(other).trim()) list.push(String(other).trim());
  return list.join('; ');
};

export const SAMPLE_PATIENTS = [
  {
    id: 'derrick',
    name: 'MalToy Lewis',
    age: 48,
    sex: 'Male',
    relationship: 'Self / NP',
    status: 'Active',
    lastUpdated: '2 hours ago',
    flags: ['Echo overdue', 'Colonoscopy due'],
    demographics: { dob: '1977-09-05', occupation: 'Nurse Practitioner', living: 'Married, 2 children' },
    vitals: { bp: '128/82', hr: '74', temp: '98.6°F', rr: '16', o2: '98%', weight: '185 lbs', bmi: '25.8', date: '2026-05-30' },
    vitalsTrend: [
      { date: '2026-05-30', bp: '128/82', weight: '185 lbs' },
      { date: '2026-05-09', bp: '130/84', weight: '186 lbs' },
    ],
    conditions: [
      { name: 'Hypertension', status: 'Active, controlled', since: '2010 (age 36)' },
      { name: 'Hyperlipidemia', status: 'Controlled', since: '2008 (age 34)' },
      { name: 'Prediabetes', status: 'Emerging', since: '2026' },
      { name: 'NSAID-induced GI bleed', status: 'Resolved — contraindication', since: '2015' },
    ],
    medications: [
      { name: 'Lisinopril', dose: '10 mg', freq: 'Daily', route: 'PO', indication: 'Hypertension', flags: ['Avoid NSAIDs', 'Monitor K+/Cr'] },
      { name: 'Atorvastatin', dose: '20 mg', freq: 'Daily', route: 'PO', indication: 'Hyperlipidemia', flags: ['Monitor LFTs'] },
      { name: 'Aspirin', dose: '81 mg', freq: 'Daily', route: 'PO', indication: 'CV protection', flags: ['GI bleed risk with NSAIDs'] },
    ],
    allergies: [
      { allergen: 'Penicillin', reaction: 'Rash, possible Stevens-Johnson', severity: 'Severe', alternatives: 'Macrolides, fluoroquinolones' },
      { allergen: 'NSAIDs', reaction: 'GI bleeding, ulcer', severity: 'Severe', alternatives: 'Acetaminophen (± PPI)' },
      { allergen: 'Codeine', reaction: 'Severe nausea / vomiting', severity: 'Moderate', alternatives: 'Other opioids; non-opioid preferred' },
    ],
    familyHistory: [
      { condition: 'MI / cardiovascular disease', detail: 'Father: MI @ 55', risk: 'High' },
      { condition: 'Hypertension', detail: 'Both parents; sister @ 40', risk: 'Moderate-High' },
      { condition: 'Type 2 diabetes', detail: 'Mother @ 65', risk: 'Standard' },
    ],
    labs: [
      { name: 'Creatinine', value: '0.95 mg/dL', status: 'Normal' },
      { name: 'Potassium (K+)', value: '4.2 mEq/L', status: 'Normal' },
      { name: 'LDL', value: '98 mg/dL', status: 'At goal' },
      { name: 'A1C', value: '5.9%', status: 'Prediabetic' },
      { name: 'Fasting glucose', value: '102 mg/dL', status: 'High' },
      { name: 'TSH', value: '2.1 mIU/L', status: 'Normal' },
    ],
    screenings: [
      { name: 'Lipid panel', last: '2026-05-15', due: '2027-05', status: 'Current' },
      { name: 'A1C / glucose', last: '2026-05-15', due: '2026-11', status: 'Due soon' },
      { name: 'Echocardiogram', last: '2015', due: '2020', status: 'Overdue' },
      { name: 'Colonoscopy', last: 'Never', due: 'by age 50', status: 'Overdue' },
    ],
    interactions: [
      { combo: 'Lisinopril + NSAIDs', severity: 'High', action: 'Avoid NSAIDs; use acetaminophen; monitor K+/Cr.' },
      { combo: 'Aspirin + NSAIDs', severity: 'Very high', action: 'Contraindicated — additive GI-bleed risk.' },
    ],
    concerns: 'Occasional stress headaches 2–3×/week; mild end-of-shift fatigue.',
  },
  {
    id: 'alex',
    name: 'Alex Rivera',
    age: 8,
    sex: 'Male',
    relationship: 'Child',
    status: 'Active',
    lastUpdated: 'Today',
    flags: ['Tree-nut allergy (EpiPen)'],
    demographics: { dob: '2017', occupation: '3rd grade', living: 'With parents' },
    vitals: { bp: '—', hr: '78', temp: '99.2°F', rr: '16', o2: '98%', weight: '48 lbs', bmi: '—', date: '2026-05-30' },
    vitalsTrend: [],
    conditions: [
      { name: 'Seasonal allergic rhinitis', status: 'Active', since: '2024' },
      { name: 'Acute otitis media (R ear)', status: 'Active', since: '2026-05-30' },
    ],
    medications: [
      { name: 'Cetirizine', dose: '5 mg', freq: 'Once daily', route: 'PO', indication: 'Allergies', flags: [] },
      { name: 'Amoxicillin', dose: '500 mg', freq: 'TID × 10 days', route: 'PO', indication: 'Otitis media', flags: ['Dosing: verify (std ≈ 540 mg/dose)'] },
    ],
    allergies: [
      { allergen: 'Tree nuts (walnut, cashew)', reaction: 'Anaphylaxis', severity: 'Severe', alternatives: 'EpiPen on hand; strict avoidance' },
    ],
    familyHistory: [
      { condition: 'Asthma', detail: 'Mother', risk: 'Moderate' },
      { condition: 'Seasonal allergies', detail: 'Father', risk: 'Standard' },
    ],
    labs: [],
    screenings: [
      { name: 'Well-child visit', last: '2026-05-30', due: '2027-05', status: 'Current' },
    ],
    interactions: [],
    concerns: 'Ear pain (right) since yesterday; low-grade fever.',
  },
];

// Build a chart record from the guardian/self-submitted intake profile.
export function profileToPatient(profile, submitted) {
  return {
    id: 'live',
    name: profile.patientName || 'New patient',
    age: profile.age || '—',
    sex: '—',
    relationship: 'Submitted intake',
    status: submitted ? 'New — awaiting review' : 'Draft (not submitted)',
    lastUpdated: submitted ? 'Just now' : '—',
    flags: submitted ? ['New intake'] : [],
    freeText: true,
    demographics: { weight: profile.weightLbs ? `${profile.weightLbs} lbs` : '—' },
    vitals: {
      bp: profile.bp || '—', hr: profile.hr || '—', temp: '—', rr: '—', o2: '—',
      weight: profile.weightLbs ? `${profile.weightLbs} lbs` : '—',
      bmi: '—', date: 'from intake',
    },
    extraVitals: (profile.extraVitals || []).filter((v) => v.label || v.value),
    text: {
      allergies: allergiesToText(profile.allergens, profile.allergies),
      medications: medsToText(profile.medications),
      conditions: profile.conditions,
      familyHistory: profile.familyHistory,
      concerns: profile.concerns,
      notes: profile.notesForNP,
    },
  };
}

const sevBadge = (sev) => {
  const s = (sev || '').toLowerCase();
  if (s.includes('very') || s.includes('severe') || s.includes('high') || s.includes('overdue')) return 'badge-danger';
  if (s.includes('moderate') || s.includes('due') || s.includes('prediab')) return 'badge-warning';
  return 'badge-default';
};

const Row = ({ label, value }) => (
  <li className="list-row">
    <span style={{ minWidth: 104, color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
    <span>{value || '—'}</span>
  </li>
);

/* ------------------------------- ROSTER ------------------------------- */

export function PatientsTab({ live }) {
  const [selectedId, setSelectedId] = useState(null);
  const roster = [];
  if (live && live.status !== 'Draft (not submitted)') roster.push(live);
  roster.push(...SAMPLE_PATIENTS);

  const selected = roster.find((p) => p.id === selectedId);
  if (selected) return <PatientChart patient={selected} onBack={() => setSelectedId(null)} />;

  return (
    <>
      <h1 className="page-title">Patients</h1>
      <p className="page-sub">{roster.length} patient{roster.length === 1 ? '' : 's'} in your panel. New intakes appear here for assessment.</p>
      <div className="demo-list">
        {roster.map((p) => (
          <button key={p.id} className="patient-item" onClick={() => setSelectedId(p.id)}>
            <span className="patient-item-main">
              <span className="patient-item-name">{p.name}</span>
              <span className="patient-item-sub">
                {p.age === '—' ? '' : `Age ${p.age} · `}{p.relationship} · {p.status}
              </span>
              {p.flags?.length > 0 && (
                <span className="patient-item-flags">
                  {p.flags.map((f) => (
                    <span key={f} className={`badge ${sevBadge(f)}`}>{f}</span>
                  ))}
                </span>
              )}
            </span>
            <ChevronRight size={18} className="demo-btn-chevron" />
          </button>
        ))}
      </div>
      {live && live.status === 'Draft (not submitted)' && (
        <p className="page-sub" style={{ marginTop: 4 }}>A draft intake exists but hasn’t been submitted yet.</p>
      )}
    </>
  );
}

/* -------------------------------- CHART -------------------------------- */

function PatientChart({ patient: p, onBack }) {
  const [approval, setApproval] = useState('pending'); // pending | approved | clarify
  const [notes, setNotes] = useState('');

  return (
    <div className="page-container">
      <div className="profile-head">
        <button className="icon-btn" onClick={onBack} aria-label="Back to patients">
          <ArrowLeft size={20} />
        </button>
        <h1 className="page-title profile-title">{p.name}</h1>
      </div>
      <p className="page-sub">
        {p.age === '—' ? '' : `Age ${p.age}`}{p.sex && p.sex !== '—' ? ` · ${p.sex}` : ''} · {p.relationship}
        {'  '}<span className={`badge ${p.status.includes('await') ? 'badge-warning' : 'badge-success'}`}>{p.status}</span>
      </p>

      {p.flags?.length > 0 && (
        <div className="alert alert-warning">
          <AlertCircle size={20} />
          <div><p className="alert-body">{p.flags.join(' · ')}</p></div>
        </div>
      )}

      {/* Vitals */}
      <div className="card">
        <h3 className="card-title"><Activity size={18} /> Vital Signs <span className="text-muted" style={{ fontWeight: 400, fontSize: '0.8rem' }}>({p.vitals.date})</span></h3>
        <ul className="list">
          <Row label="Blood pressure" value={p.vitals.bp} />
          <Row label="Heart rate" value={p.vitals.hr && p.vitals.hr !== '—' ? `${p.vitals.hr} bpm` : '—'} />
          <Row label="Temp / RR / O₂" value={`${p.vitals.temp} · ${p.vitals.rr} · ${p.vitals.o2}`} />
          <Row label="Weight / BMI" value={`${p.vitals.weight} · BMI ${p.vitals.bmi}`} />
          {(p.extraVitals || []).map((v, i) => (
            <Row key={i} label={v.label || 'Vital'} value={v.value} />
          ))}
        </ul>
        {p.vitalsTrend?.length > 0 && (
          <>
            <p className="section-label">Trend</p>
            <ul className="list">
              {p.vitalsTrend.map((t) => (
                <Row key={t.date} label={t.date} value={`BP ${t.bp} · ${t.weight}`} />
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Free-text (live intake) vs structured (sample) */}
      {p.freeText ? (
        <div className="card card-accent">
          <h3 className="card-title"><ClipboardList size={18} /> Submitted Intake</h3>
          <ul className="list">
            <Row label="Allergies" value={p.text.allergies} />
            <Row label="Medications" value={p.text.medications} />
            <Row label="Conditions" value={p.text.conditions} />
            <Row label="Family hx" value={p.text.familyHistory} />
            <Row label="Concerns" value={p.text.concerns} />
            {p.text.notes && <Row label="Notes" value={p.text.notes} />}
          </ul>
        </div>
      ) : (
        <>
          {/* Conditions */}
          <div className="card">
            <h3 className="card-title"><ClipboardList size={18} /> Conditions / Past Medical History</h3>
            <ul className="list">
              {p.conditions.map((c) => (
                <li className="list-row" key={c.name}>
                  <span style={{ flex: 1 }}><strong>{c.name}</strong><br /><span className="text-muted" style={{ fontSize: '0.85rem' }}>{c.status} · since {c.since}</span></span>
                </li>
              ))}
            </ul>
          </div>

          {/* Medications */}
          <div className="card">
            <h3 className="card-title"><Pill size={18} /> Medications</h3>
            <ul className="list">
              {p.medications.map((m) => (
                <li className="list-row" key={m.name}>
                  <span style={{ flex: 1 }}>
                    <strong>{m.name}</strong> {m.dose} · {m.freq} ({m.route})<br />
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>{m.indication}</span>
                    {m.flags?.length > 0 && (
                      <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                        {m.flags.map((f) => <span key={f} className="badge badge-warning">{f}</span>)}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Allergies */}
          <div className="card">
            <h3 className="card-title"><ShieldAlert size={18} /> Allergies &amp; Adverse Reactions</h3>
            <ul className="list">
              {p.allergies.map((a) => (
                <li className="list-row" key={a.allergen}>
                  <span style={{ flex: 1 }}>
                    <strong>{a.allergen}</strong> <span className={`badge ${sevBadge(a.severity)}`}>{a.severity}</span><br />
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>{a.reaction} · Safe: {a.alternatives}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Family history */}
          <div className="card">
            <h3 className="card-title"><Users size={18} /> Family History</h3>
            <ul className="list">
              {p.familyHistory.map((f) => (
                <li className="list-row" key={f.condition}>
                  <span style={{ flex: 1 }}><strong>{f.condition}</strong> <span className={`badge ${sevBadge(f.risk)}`}>{f.risk} risk</span><br /><span className="text-muted" style={{ fontSize: '0.85rem' }}>{f.detail}</span></span>
                </li>
              ))}
            </ul>
          </div>

          {/* Labs */}
          {p.labs.length > 0 && (
            <div className="card">
              <h3 className="card-title"><FlaskConical size={18} /> Recent Labs <span className="badge badge-warning">Sample data</span></h3>
              <ul className="list">
                {p.labs.map((l) => (
                  <li className="list-row" key={l.name}>
                    <span style={{ flex: 1 }}>{l.name}</span>
                    <span>{l.value}</span>
                    <span className={`badge ${sevBadge(l.status)}`}>{l.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Preventive screenings */}
          <div className="card">
            <h3 className="card-title"><Clock size={18} /> Preventive Care &amp; Screenings</h3>
            <ul className="list">
              {p.screenings.map((s) => (
                <li className="list-row" key={s.name}>
                  <span style={{ flex: 1 }}>{s.name}<br /><span className="text-muted" style={{ fontSize: '0.85rem' }}>Last {s.last} · due {s.due}</span></span>
                  <span className={`badge ${sevBadge(s.status)}`}>{s.status}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interaction alerts */}
          {p.interactions.length > 0 && (
            <div className="card card-accent">
              <h3 className="card-title"><AlertCircle size={18} /> Drug-Interaction Alerts</h3>
              {p.interactions.map((i) => (
                <div className={`alert ${sevBadge(i.severity) === 'badge-danger' ? 'alert-danger' : 'alert-warning'}`} key={i.combo}>
                  <AlertCircle size={20} />
                  <div>
                    <p className="alert-title">{i.combo} <span className={`badge ${sevBadge(i.severity)}`}>{i.severity}</span></p>
                    <p className="alert-body">{i.action}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {p.concerns && (
            <div className="card">
              <h3 className="card-title">Current Concerns</h3>
              <p className="card-lead" style={{ margin: 0 }}>{p.concerns}</p>
            </div>
          )}
        </>
      )}

      {/* NP notes + approval gate */}
      <div className="card card-accent">
        <h3 className="card-title"><ClipboardList size={18} /> NP Review</h3>
        <label className="input-label">Clinical notes</label>
        <textarea className="textarea" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Document your assessment, prescriber communications, follow-up…" />
        {approval === 'approved' ? (
          <div className="alert alert-success" style={{ marginTop: 14, marginBottom: 0 }}>
            <CheckCircle2 size={20} />
            <div><p className="alert-body">Reviewed &amp; approved — released to the family.</p></div>
          </div>
        ) : approval === 'clarify' ? (
          <div className="alert alert-warning" style={{ marginTop: 14, marginBottom: 0 }}>
            <AlertCircle size={20} />
            <div><p className="alert-body">Flagged for clarification — held from distribution.</p></div>
          </div>
        ) : (
          <div className="action-row">
            <button className="btn btn-success" onClick={() => setApproval('approved')}>
              <CheckCircle2 size={16} /> Approve &amp; Route
            </button>
            <button className="btn btn-secondary" onClick={() => setApproval('clarify')}>
              <Send size={16} /> Request Clarification
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

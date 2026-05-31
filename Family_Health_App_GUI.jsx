import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Pill, Clock, AlertCircle, ChevronDown, Eye, EyeOff, Moon, Sun } from 'lucide-react';

const FamilyHealthApp = () => {
  const [activeTab, setActiveTab] = useState('np'); // 'np', 'spouse', 'child'
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [showRawData, setShowRawData] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [npNotes, setNpNotes] = useState('');

  // Sample synthesized message for NP/Derrick
  const npMessage = {
    id: 'msg_001',
    date: '2026-05-30',
    source: 'Dr. Smith, Family Medicine Clinic',
    patient: 'Child\'s Name (8 years old, 48 lbs)',
    encounter: 'In-person office visit',
    diagnosis: 'Acute otitis media (right ear) with mild fever',
    alerts: [
      {
        type: 'MINOR',
        title: 'Dosing Verification',
        content: 'Amoxicillin 500 mg TID prescribed for 8-year-old (48 lbs). Standard pediatric dose is 25 mg/kg/dose = 540 mg/dose. Extracted dose is slightly low. Verify if intentional (e.g., lower dose for sensitivity reasons) or contact prescriber.',
      },
    ],
    medications: [
      {
        name: 'Amoxicillin',
        dosage: '500 mg',
        route: 'PO',
        frequency: 'TID (three times daily)',
        indication: 'Acute otitis media',
        instructions: 'Take with or without food; complete full 10-day course',
        duration: '10 days',
      },
    ],
    actions: [
      { task: 'Verify amoxicillin dosage with prescriber', status: 'pending' },
      { task: 'Schedule follow-up exam in 10 days', status: 'pending' },
      { task: 'Monitor for fever persistence beyond 48 hours', status: 'pending' },
    ],
    baseline: {
      medications: ['Cetirizine 10 mg daily (seasonal allergies)'],
      allergies: ['Tree nuts (Walnut, Cashew) - SEVERE - EpiPen'],
      interactions: 'None detected. Amoxicillin compatible with baseline cetirizine.',
    },
  };

  // Sample synthesized message for spouse
  const spouseMessage = {
    id: 'msg_001_spouse',
    date: '2026-05-30',
    source: 'Dr. Smith',
    patient: 'Child\'s Name',
    encounter: 'Doctor visit',
    summary: 'Child has an ear infection. Doctor prescribed an antibiotic to help the body fight it off.',
    medications: [
      {
        name: 'Amoxicillin (antibiotic)',
        amount: 'One pill',
        timing: 'Three times a day (breakfast, lunch, dinner)',
        duration: '10 days',
        instructions: 'Complete the full course even if child feels better after a few days',
      },
    ],
    watchFor: [
      'Rash or hives',
      'Vomiting or severe stomach pain',
      'Diarrhea (mild diarrhea is normal)',
      'Persistent fever after 48 hours',
    ],
    contact: 'Contact Derrick (NP) if any of these happen: [555-0123]',
  };

  // Sample synthesized message for child
  const childMessage = {
    id: 'msg_001_child',
    date: '2026-05-30',
    source: 'Dr. Smith',
    patient: 'Child\'s Name',
    encounter: 'Doctor visit today',
    explanation: 'Your ear has an infection. This medicine helps your body fight it off. You\'ll feel better in a few days!',
    instructions: [
      { step: 1, text: 'Take one pill with breakfast' },
      { step: 2, text: 'Take one pill with lunch' },
      { step: 3, text: 'Take one pill with dinner' },
      { step: 4, text: 'Swallow with water' },
      { step: 5, text: 'Do this for 10 days' },
    ],
    tellAdult: 'Tell Mom or Dad if you forget a dose or feel funny',
    emergencyCall: 'Call Derrick immediately if: you get a rash, you throw up, or you feel really bad',
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      {/* Header */}
      <div className={`border-b transition-colors duration-200 ${
        darkMode 
          ? 'border-slate-700 bg-slate-800/80 backdrop-blur' 
          : 'border-slate-200 bg-white/80 backdrop-blur'
      } sticky top-0 z-50`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${
              darkMode 
                ? 'bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent'
            }`}>
              Family Health Architect
            </h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              NP-led health information dashboard • ICM framework
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-lg transition-colors duration-200 ${
              darkMode
                ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
            title="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Role Switcher */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab('np')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'np'
                ? 'bg-indigo-600 text-white shadow-lg'
                : darkMode
                  ? 'bg-slate-700 text-slate-200 border border-slate-600 hover:border-indigo-400'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'
            }`}
          >
            👨‍⚕️ Derrick (NP)
          </button>
          <button
            onClick={() => setActiveTab('spouse')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'spouse'
                ? 'bg-indigo-600 text-white shadow-lg'
                : darkMode
                  ? 'bg-slate-700 text-slate-200 border border-slate-600 hover:border-indigo-400'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'
            }`}
          >
            👩 Spouse
          </button>
          <button
            onClick={() => setActiveTab('child')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'child'
                ? 'bg-indigo-600 text-white shadow-lg'
                : darkMode
                  ? 'bg-slate-700 text-slate-200 border border-slate-600 hover:border-indigo-400'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'
            }`}
          >
            👧 Child (8th Grade)
          </button>
        </div>

        {/* NP VIEW */}
        {activeTab === 'np' && (
          <div className="space-y-6">
            <div className={`rounded-xl shadow-lg border transition-colors duration-200 p-8 ${
              darkMode
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    {npMessage.patient}
                  </h2>
                  <p className={`mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {npMessage.source} • {npMessage.date}
                  </p>
                </div>
                <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${
                  darkMode
                    ? 'bg-blue-900 text-blue-200'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {npMessage.encounter}
                </span>
              </div>

              {/* Alerts Section */}
              {npMessage.alerts.length > 0 && (
                <div className="mb-8 space-y-3">
                  <h3 className={`text-lg font-semibold flex items-center gap-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    Clinical Review Points
                  </h3>
                  {npMessage.alerts.map((alert, idx) => (
                    <div
                      key={idx}
                      className={`border-l-4 border-amber-400 p-4 rounded-r-lg cursor-pointer transition ${
                        darkMode
                          ? 'bg-amber-900/30 hover:bg-amber-900/50'
                          : 'bg-amber-50 hover:bg-amber-100'
                      }`}
                      onClick={() => setExpandedAlert(expandedAlert === idx ? null : idx)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className={`font-semibold ${darkMode ? 'text-amber-200' : 'text-amber-900'}`}>
                            {alert.title}
                          </h4>
                          {expandedAlert === idx && (
                            <p className={`text-sm mt-2 ${darkMode ? 'text-amber-300' : 'text-amber-800'}`}>
                              {alert.content}
                            </p>
                          )}
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-amber-600 transition-transform ${
                            expandedAlert === idx ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Diagnosis */}
              <div className={`p-4 rounded-lg mb-6 border transition-colors duration-200 ${
                darkMode
                  ? 'bg-slate-700 border-slate-600'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className={`text-sm font-semibold uppercase tracking-wide mb-2 ${
                  darkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>Diagnosis</h3>
                <p className={`font-medium ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  {npMessage.diagnosis}
                </p>
              </div>

              {/* Medications Table */}
              <div className="mb-8">
                <h3 className={`text-lg font-semibold flex items-center gap-2 mb-4 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  <Pill className="w-5 h-5 text-indigo-600" />
                  Medications Prescribed
                </h3>
                <div className="overflow-x-auto">
                  <table className={`w-full text-sm ${darkMode ? 'text-slate-300' : ''}`}>
                    <thead>
                      <tr className={`border-b-2 ${darkMode ? 'border-slate-600' : 'border-slate-300'}`}>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                          Medication
                        </th>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                          Dosage
                        </th>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                          Route
                        </th>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                          Frequency
                        </th>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                          Indication
                        </th>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                          Instructions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {npMessage.medications.map((med, idx) => (
                        <tr key={idx} className={`border-b transition-colors duration-200 ${
                          darkMode
                            ? 'border-slate-700 hover:bg-slate-700/50'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}>
                          <td className={`py-3 px-4 font-medium ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                            {med.name}
                          </td>
                          <td className={`py-3 px-4 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            {med.dosage}
                          </td>
                          <td className={`py-3 px-4 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            {med.route}
                          </td>
                          <td className={`py-3 px-4 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            {med.frequency}
                          </td>
                          <td className={`py-3 px-4 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            {med.indication}
                          </td>
                          <td className={`py-3 px-4 text-xs ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            {med.instructions}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Baseline Context */}
              <div className={`border rounded-lg p-6 mb-8 transition-colors duration-200 ${
                darkMode
                  ? 'bg-indigo-900/30 border-indigo-700'
                  : 'bg-indigo-50 border-indigo-200'
              }`}>
                <h3 className={`text-sm font-semibold uppercase tracking-wide mb-4 ${
                  darkMode ? 'text-indigo-200' : 'text-indigo-900'
                }`}>
                  Patient Baseline Context
                </h3>
                <div className={`space-y-3 text-sm ${darkMode ? 'text-indigo-300' : ''}`}>
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-indigo-200' : 'text-indigo-900'}`}>
                      Current Medications:
                    </p>
                    <p className={darkMode ? 'text-indigo-400' : 'text-indigo-800'}>
                      {npMessage.baseline.medications.join(', ')}
                    </p>
                  </div>
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-indigo-200' : 'text-indigo-900'}`}>
                      Known Allergies:
                    </p>
                    <p className={darkMode ? 'text-indigo-400' : 'text-indigo-800'}>
                      {npMessage.baseline.allergies.join(', ')}
                    </p>
                  </div>
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-indigo-200' : 'text-indigo-900'}`}>
                      Drug Interactions:
                    </p>
                    <p className={darkMode ? 'text-indigo-400' : 'text-indigo-800'}>
                      {npMessage.baseline.interactions}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Items */}
              <div className="mb-8">
                <h3 className={`text-lg font-semibold flex items-center gap-2 mb-4 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  <Clock className="w-5 h-5 text-indigo-600" />
                  Action Items
                </h3>
                <div className="space-y-2">
                  {npMessage.actions.map((action, idx) => (
                    <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors duration-200 ${
                      darkMode
                        ? 'bg-slate-700 border-slate-600'
                        : 'bg-slate-50 border-slate-200'
                    }`}>
                      <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
                      <span className={`flex-1 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        {action.task}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        darkMode
                          ? 'bg-slate-600 text-slate-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {action.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* NP Notes Section */}
              <div className={`border-t-2 pt-6 mb-8 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  📝 NP Clinical Notes
                </h3>
                <textarea
                  value={npNotes}
                  onChange={(e) => setNpNotes(e.target.value)}
                  placeholder="Add your clinical observations, prescriber communications, follow-up notes, or any concerns to document..."
                  className={`w-full h-32 p-4 rounded-lg border-2 font-mono text-sm transition-colors duration-200 ${
                    darkMode
                      ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-indigo-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:border-indigo-400'
                  } focus:outline-none`}
                />
                <p className={`text-xs mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  These notes will be saved with the patient record for your reference and audit trail.
                </p>
              </div>

              {/* Approval Gate */}
              <div className={`border-t-2 pt-6 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  NP Approval Gate
                </h3>
                <div className="flex items-center gap-4">
                  <select className={`px-4 py-2 border rounded-lg font-semibold transition-colors duration-200 ${
                    darkMode
                      ? 'bg-slate-700 border-slate-600 text-slate-100'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}>
                    <option value="pending">⏳ Pending Your Approval</option>
                    <option value="approved">✅ Approved for Distribution</option>
                    <option value="approved-conditions">✅ Approved with Conditions</option>
                    <option value="rejected">❌ Requires Clarification</option>
                  </select>
                  <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
                    Save & Route
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SPOUSE VIEW */}
        {activeTab === 'spouse' && (
          <div className="space-y-6">
            <div className={`rounded-xl shadow-lg border transition-colors duration-200 p-8 ${
              darkMode
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    Health Update for {spouseMessage.patient}
                  </h2>
                  <p className={`mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    From: {spouseMessage.source} • {spouseMessage.date}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className={`border-l-4 border-blue-500 p-6 rounded-r-lg mb-8 transition-colors duration-200 ${
                darkMode
                  ? 'bg-blue-900/30'
                  : 'bg-blue-50'
              }`}>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                  What You Need to Know
                </h3>
                <p className={`text-lg ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                  {spouseMessage.summary}
                </p>
              </div>

              {/* Medications */}
              <div className="mb-8">
                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  💊 How to Give the Medicine
                </h3>
                <div className="space-y-4">
                  {spouseMessage.medications.map((med, idx) => (
                    <div key={idx} className={`border-2 rounded-lg p-6 transition-colors duration-200 ${
                      darkMode
                        ? 'border-indigo-600 bg-indigo-900/30'
                        : 'border-indigo-200 bg-indigo-50'
                    }`}>
                      <h4 className={`text-lg font-bold mb-3 ${darkMode ? 'text-indigo-200' : 'text-indigo-900'}`}>
                        {med.name}
                      </h4>
                      <div className={`space-y-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-800'}`}>
                        <p>
                          <span className="font-semibold">Amount:</span> {med.amount}
                        </p>
                        <p>
                          <span className="font-semibold">When:</span> {med.timing}
                        </p>
                        <p>
                          <span className="font-semibold">How long:</span> {med.duration}
                        </p>
                        <p className="text-sm italic pt-2">
                          ⚠️ {med.instructions}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Watch For */}
              <div className="mb-8">
                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  ⚠️ Watch For These (Side Effects)
                </h3>
                <div className="space-y-2">
                  {spouseMessage.watchFor.map((symptom, idx) => (
                    <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg border transition-colors duration-200 ${
                      darkMode
                        ? 'bg-red-900/30 border-red-700'
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${darkMode ? 'text-red-500' : 'text-red-600'}`} />
                      <span className={`font-medium ${darkMode ? 'text-red-200' : 'text-red-900'}`}>
                        {symptom}
                      </span>
                    </div>
                  ))}
                </div>
                <p className={`font-semibold mt-4 p-4 rounded-lg ${
                  darkMode
                    ? 'bg-red-900/40 text-red-200'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {spouseMessage.contact}
                </p>
              </div>

              {/* Reassurance */}
              <div className={`border-l-4 border-green-500 p-6 rounded-r-lg transition-colors duration-200 ${
                darkMode
                  ? 'bg-green-900/30'
                  : 'bg-green-50'
              }`}>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-green-200' : 'text-green-900'}`}>
                  ✅ You're Doing Great
                </h3>
                <p className={darkMode ? 'text-green-300' : 'text-green-800'}>
                  You're following the doctor's plan perfectly. Complete the full course of medicine, watch for the symptoms above, and contact Derrick if anything seems off.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CHILD VIEW */}
        {activeTab === 'child' && (
          <div className="space-y-6">
            <div className={`rounded-xl shadow-lg border-2 transition-colors duration-200 p-8 ${
              darkMode
                ? 'bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border-indigo-700'
                : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-purple-200'
            }`}>
              <div className="mb-8 text-center">
                <h2 className={`text-4xl font-bold mb-2 ${
                  darkMode
                    ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent'
                }`}>
                  Hi! 👋
                </h2>
                <p className={`text-lg ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Dr. {childMessage.source.split(' ')[1]} saw you today.
                </p>
              </div>

              {/* Friendly Explanation */}
              <div className={`rounded-xl p-8 mb-8 border-2 shadow-md transition-colors duration-200 ${
                darkMode
                  ? 'bg-slate-700 border-indigo-600 text-slate-100'
                  : 'bg-white border-purple-200 text-slate-900'
              }`}>
                <p className="text-2xl text-center font-bold leading-relaxed">
                  {childMessage.explanation}
                </p>
              </div>

              {/* Instructions with Emojis */}
              <div className="mb-8">
                <h3 className={`text-2xl font-bold mb-4 text-center ${darkMode ? 'text-indigo-300' : 'text-slate-900'}`}>
                  🎯 Your Job
                </h3>
                <div className="space-y-3">
                  {childMessage.instructions.map((inst, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xl p-6 border-2 shadow-md hover:shadow-lg transition transform hover:scale-105 ${
                        darkMode
                          ? 'bg-slate-700 border-indigo-500 text-slate-100'
                          : 'bg-white border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl text-white ${
                          darkMode
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                            : 'bg-gradient-to-br from-indigo-500 to-purple-500'
                        }`}>
                          {inst.step}
                        </div>
                        <p className={`text-xl font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                          {inst.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Reminder */}
              <div className={`border-2 rounded-xl p-6 mb-8 transition-colors duration-200 ${
                darkMode
                  ? 'bg-yellow-900/30 border-yellow-600 text-yellow-200'
                  : 'bg-yellow-50 border-yellow-300 text-yellow-900'
              }`}>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-yellow-300' : 'text-yellow-900'}`}>
                  📝 Important
                </h3>
                <p className={`text-lg font-semibold ${darkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                  {childMessage.tellAdult}
                </p>
              </div>

              {/* Emergency */}
              <div className={`border-2 rounded-xl p-6 transition-colors duration-200 ${
                darkMode
                  ? 'bg-red-900/30 border-red-600 text-red-200'
                  : 'bg-red-50 border-red-300 text-red-900'
              }`}>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-red-300' : 'text-red-900'}`}>
                  🚨 If You Feel Bad
                </h3>
                <p className={`text-lg font-semibold ${darkMode ? 'text-red-200' : 'text-red-800'}`}>
                  {childMessage.emergencyCall}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyHealthApp;

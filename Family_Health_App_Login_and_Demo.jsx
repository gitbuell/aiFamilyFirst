import React, { useState } from 'react';
import { Lock, User, Stethoscope, ChevronRight, AlertCircle, CheckCircle2, Pill, Clock, Eye, EyeOff, Moon, Sun } from 'lucide-react';

const FamilyHealthApp = () => {
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login', 'patient-demo', 'np-demo'
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('np'); // For NP demo: 'np', 'approvals', 'history'
  const [activePatientTab, setActivePatientTab] = useState('medications'); // For patient demo

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      alert('Login functionality would go here. This is a demo.');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900'
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
    }`}>
      {/* Dark Mode Toggle (Top Right) */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-6 right-6 p-3 rounded-full transition-colors duration-200 z-50 ${
          darkMode
            ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400'
            : 'bg-white hover:bg-slate-100 text-slate-700 shadow-lg'
        }`}
      >
        {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>

      {/* ============================================================
          SCREEN 1: LOGIN SCREEN
          ============================================================ */}
      {currentScreen === 'login' && (
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transition-colors duration-200 ${
            darkMode
              ? 'bg-slate-800 border border-slate-700'
              : 'bg-white border border-slate-200'
          }`}>
            {/* Header */}
            <div className={`px-8 py-10 text-center ${
              darkMode
                ? 'bg-gradient-to-br from-indigo-600 to-blue-600'
                : 'bg-gradient-to-br from-indigo-600 to-blue-600'
            }`}>
              <h1 className="text-3xl font-bold text-white mb-2">
                Family Health Architect
              </h1>
              <p className="text-indigo-100">Secure Health Management</p>
            </div>

            {/* Login Form */}
            <div className="px-8 py-10">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    darkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 ${
                      darkMode
                        ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-indigo-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-400'
                    } focus:outline-none`}
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    darkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full px-4 py-3 pr-12 rounded-lg border-2 transition-colors duration-200 ${
                        darkMode
                          ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-indigo-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-400'
                      } focus:outline-none`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-4 top-3 ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Lock className="inline-block w-5 h-5 mr-2 mb-0.5" />
                  Sign In
                </button>
              </form>

              {/* Divider */}
              <div className={`my-8 flex items-center gap-4 ${darkMode ? 'opacity-50' : ''}`}>
                <div className={`flex-1 h-px ${darkMode ? 'bg-slate-600' : 'bg-slate-300'}`}></div>
                <span className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  OR TRY DEMO
                </span>
                <div className={`flex-1 h-px ${darkMode ? 'bg-slate-600' : 'bg-slate-300'}`}></div>
              </div>

              {/* Demo Buttons */}
              <div className="space-y-3">
                {/* Patient Demo Button */}
                <button
                  onClick={() => setCurrentScreen('patient-demo')}
                  className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-200 border-2 flex items-center justify-between ${
                    darkMode
                      ? 'bg-slate-700 border-emerald-500 text-emerald-300 hover:bg-slate-600 hover:border-emerald-400'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-400'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    👧 Patient Demo (Child)
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* NP Demo Button */}
                <button
                  onClick={() => setCurrentScreen('np-demo')}
                  className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-200 border-2 flex items-center justify-between ${
                    darkMode
                      ? 'bg-slate-700 border-purple-500 text-purple-300 hover:bg-slate-600 hover:border-purple-400'
                      : 'bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5" />
                    👨‍⚕️ NP Demo (Derrick)
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Footer Text */}
              <p className={`text-xs text-center mt-8 ${
                darkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Demo credentials: demo@example.com / demo123
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          SCREEN 2: PATIENT DEMO VIEW (Child)
          ============================================================ */}
      {currentScreen === 'patient-demo' && (
        <div className="min-h-screen">
          {/* Header with Back Button */}
          <div className={`sticky top-0 z-40 border-b transition-colors duration-200 ${
            darkMode
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
          } shadow-sm`}>
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentScreen('login')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    darkMode
                      ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  ← Back
                </button>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  👧 Patient View (Child)
                </h1>
              </div>
              <span className={`text-sm px-3 py-1 rounded-full ${
                darkMode
                  ? 'bg-emerald-900 text-emerald-200'
                  : 'bg-emerald-100 text-emerald-700'
              }`}>
                Logged in as: Child (8th Grade)
              </span>
            </div>
          </div>

          {/* Patient Content */}
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Welcome Section */}
            <div className={`rounded-2xl shadow-lg p-8 mb-8 transition-colors duration-200 ${
              darkMode
                ? 'bg-gradient-to-br from-emerald-900 to-teal-900'
                : 'bg-gradient-to-br from-emerald-50 to-teal-50'
            }`}>
              <h2 className={`text-3xl font-bold mb-3 ${darkMode ? 'text-emerald-200' : 'text-emerald-900'}`}>
                Hi! 👋 Welcome Back
              </h2>
              <p className={`text-lg ${darkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
                Your health information is organized and easy to understand. Here's what you need to know today.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-300">
              {['medications', 'appointments', 'messages'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActivePatientTab(tab)}
                  className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                    activePatientTab === tab
                      ? 'border-emerald-500 text-emerald-600'
                      : `border-transparent ${darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-800'}`
                  }`}
                >
                  {tab === 'medications' && '💊 Your Medications'}
                  {tab === 'appointments' && '📅 Your Appointments'}
                  {tab === 'messages' && '💬 Messages from Parents'}
                </button>
              ))}
            </div>

            {/* Medications Tab */}
            {activePatientTab === 'medications' && (
              <div className="space-y-4">
                <div className={`rounded-xl p-6 border-l-4 border-blue-500 transition-colors ${
                  darkMode
                    ? 'bg-slate-700'
                    : 'bg-blue-50'
                }`}>
                  <div className="flex items-start gap-4">
                    <Pill className={`w-6 h-6 flex-shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                        Allergy Pill (Cetirizine)
                      </h3>
                      <p className={`mb-3 ${darkMode ? 'text-blue-100' : 'text-blue-800'}`}>
                        Take one pill with breakfast every day. It helps your body fight itching and sneezing from allergies.
                      </p>
                      <div className={`text-sm font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                        ✅ Take with breakfast • Every day
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`rounded-xl p-6 border-l-4 border-green-500 transition-colors ${
                  darkMode
                    ? 'bg-slate-700'
                    : 'bg-green-50'
                }`}>
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className={`w-6 h-6 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-green-200' : 'text-green-900'}`}>
                        You're Doing Great! ✨
                      </h3>
                      <p className={darkMode ? 'text-green-100' : 'text-green-800'}>
                        You've been taking your medicine as directed. Keep it up! Your parents are proud of you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activePatientTab === 'appointments' && (
              <div className="space-y-4">
                <div className={`rounded-xl p-6 border-l-4 border-orange-500 transition-colors ${
                  darkMode
                    ? 'bg-slate-700'
                    : 'bg-orange-50'
                }`}>
                  <div className="flex items-start gap-4">
                    <Clock className={`w-6 h-6 flex-shrink-0 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-orange-200' : 'text-orange-900'}`}>
                        📅 Next Appointment
                      </h3>
                      <p className={`mb-2 ${darkMode ? 'text-orange-100' : 'text-orange-800'}`}>
                        <strong>Dr. Johnson (Pediatrician)</strong>
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-orange-200' : 'text-orange-700'}`}>
                        📍 Children's Medical Clinic<br/>
                        📆 Friday, June 14, 2026 at 2:30 PM<br/>
                        ⏱️ Check-in 15 minutes early
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`rounded-xl p-6 transition-colors ${
                  darkMode
                    ? 'bg-slate-700'
                    : 'bg-yellow-50'
                } border-l-4 border-yellow-500`}>
                  <p className={`font-semibold ${darkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                    💡 Tip: Bring your insurance card and any questions you want to ask the doctor!
                  </p>
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activePatientTab === 'messages' && (
              <div className="space-y-4">
                <div className={`rounded-xl p-6 border-l-4 border-indigo-500 transition-colors ${
                  darkMode
                    ? 'bg-slate-700'
                    : 'bg-indigo-50'
                }`}>
                  <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-indigo-200' : 'text-indigo-900'}`}>
                    Message from Mom
                  </h3>
                  <p className={darkMode ? 'text-indigo-100' : 'text-indigo-800'}>
                    "Hey sweetie! Don't forget to take your allergy pill with breakfast tomorrow. We're going to the park and want you to have fun without sneezing! Love you ❤️"
                  </p>
                  <p className={`text-xs mt-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    June 12, 2026 • 7:45 AM
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          SCREEN 3: NP DEMO VIEW (Derrick)
          ============================================================ */}
      {currentScreen === 'np-demo' && (
        <div className="min-h-screen">
          {/* Header with Back Button */}
          <div className={`sticky top-0 z-40 border-b transition-colors duration-200 ${
            darkMode
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
          } shadow-sm`}>
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentScreen('login')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    darkMode
                      ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  ← Back
                </button>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  👨‍⚕️ NP Dashboard (Derrick)
                </h1>
              </div>
              <span className={`text-sm px-3 py-1 rounded-full ${
                darkMode
                  ? 'bg-purple-900 text-purple-200'
                  : 'bg-purple-100 text-purple-700'
              }`}>
                Logged in as: Derrick (NP)
              </span>
            </div>
          </div>

          {/* NP Content */}
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-300 pb-4 overflow-x-auto">
              {['dashboard', 'approvals', 'family-health', 'account-management'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-purple-500 text-purple-600'
                      : `border-transparent ${darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-800'}`
                  }`}
                >
                  {tab === 'dashboard' && '📊 Dashboard'}
                  {tab === 'approvals' && '⚠️ Pending Approvals (2)'}
                  {tab === 'family-health' && '👨‍👩‍👧‍👦 Family Health'}
                  {tab === 'account-management' && '🔐 Account Management'}
                </button>
              ))}
            </div>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`rounded-xl p-6 transition-colors ${
                    darkMode
                      ? 'bg-slate-700'
                      : 'bg-slate-50'
                  } border-l-4 border-blue-500`}>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Active Patients
                    </p>
                    <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                      3
                    </p>
                    <p className={`text-xs mt-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      You (1), Wife (1), Child (1)
                    </p>
                  </div>

                  <div className={`rounded-xl p-6 transition-colors ${
                    darkMode
                      ? 'bg-slate-700'
                      : 'bg-slate-50'
                  } border-l-4 border-orange-500`}>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Pending Approvals
                    </p>
                    <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>
                      2
                    </p>
                    <p className={`text-xs mt-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Await your review
                    </p>
                  </div>

                  <div className={`rounded-xl p-6 transition-colors ${
                    darkMode
                      ? 'bg-slate-700'
                      : 'bg-slate-50'
                  } border-l-4 border-green-500`}>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Last Sync
                    </p>
                    <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
                      2 hrs
                    </p>
                    <p className={`text-xs mt-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Latest: Child's visit summary
                    </p>
                  </div>
                </div>

                {/* Quick Access */}
                <div className={`rounded-xl p-6 transition-colors ${
                  darkMode
                    ? 'bg-slate-700'
                    : 'bg-slate-50'
                }`}>
                  <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button className="p-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                      📋 Review Pending Approvals
                    </button>
                    <button className="p-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                      📊 View Family Health Summary
                    </button>
                    <button className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                      📝 Update Family Profiles
                    </button>
                    <button className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                      🔔 Configure Alerts
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Approvals Tab */}
            {activeTab === 'approvals' && (
              <div className="space-y-4">
                {/* Pending Approval #1 */}
                <div className={`rounded-xl p-6 border-l-4 border-amber-500 transition-colors ${
                  darkMode
                    ? 'bg-slate-700'
                    : 'bg-amber-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <AlertCircle className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                        <h3 className={`text-lg font-bold ${darkMode ? 'text-amber-200' : 'text-amber-900'}`}>
                          Child: Possible Allergy Medication
                        </h3>
                      </div>
                      <p className={`mb-3 ${darkMode ? 'text-amber-100' : 'text-amber-800'}`}>
                        New prescription from Dr. Johnson for cetirizine 10 mg daily. No known allergies, compatible with baseline medications.
                      </p>
                      <div className={`text-sm ${darkMode ? 'text-amber-200' : 'text-amber-700'}`}>
                        <strong>Dosage Check:</strong> 10 mg for 8-year-old (48 lbs) = 0.2 mg/kg ✓ Within range<br/>
                        <strong>Interactions:</strong> None detected with baseline cetirizine (but this IS the baseline med—might be refill)
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors">
                      ✅ Approve
                    </button>
                    <button className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors">
                      🔍 Review Details
                    </button>
                  </div>
                </div>

                {/* Pending Approval #2 */}
                <div className={`rounded-xl p-6 border-l-4 border-red-500 transition-colors ${
                  darkMode
                    ? 'bg-slate-700'
                    : 'bg-red-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <AlertCircle className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                        <h3 className={`text-lg font-bold ${darkMode ? 'text-red-200' : 'text-red-900'}`}>
                          🚨 YOU: DRUG INTERACTION ALERT
                        </h3>
                      </div>
                      <p className={`mb-3 font-semibold ${darkMode ? 'text-red-100' : 'text-red-800'}`}>
                        NSAID + ACE Inhibitor = HIGH RISK
                      </p>
                      <p className={`mb-3 ${darkMode ? 'text-red-100' : 'text-red-800'}`}>
                        New prescription: Ibuprofen 400 mg QID for back pain. You are currently on Lisinopril 10 mg daily (ACE inhibitor).
                      </p>
                      <div className={`text-sm mb-3 p-3 rounded ${
                        darkMode
                          ? 'bg-red-900/30'
                          : 'bg-red-100'
                      }`}>
                        <strong>Risk:</strong> This combination significantly increases risk of hyperkalemia and acute kidney injury.<br/>
                        <strong>Your baseline:</strong> K+ = 4.2 (normal), Creatinine = 0.95 (normal)<br/>
                        <strong>Recommendation:</strong> Use acetaminophen first-line. If NSAID truly necessary, add PPI and recheck labs in 1 week.
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
                      ❌ Reject - Call Prescriber
                    </button>
                    <button className="flex-1 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors">
                      ⚠️ Approve with Conditions
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Family Health Tab */}
            {activeTab === 'family-health' && (
              <div className="space-y-4">
                <div className={`rounded-xl p-6 transition-colors ${
                  darkMode
                    ? 'bg-slate-700'
                    : 'bg-slate-50'
                }`}>
                  <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    Family Overview
                  </h3>
                  
                  {/* You (Derrick) */}
                  <div className="mb-4 pb-4 border-b border-slate-300">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className={`font-bold text-lg ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                          Derrick (You) - 48M
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Active: HTN (controlled), Hyperlipidemia (at goal), Prediabetic
                        </p>
                      </div>
                      <button className={`px-4 py-2 rounded-lg font-semibold ${
                        darkMode
                          ? 'bg-indigo-900 text-indigo-200'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        View Profile
                      </button>
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Last updated: 2 hours ago | Labs: Current | Overdue: Echo (2020), Colonoscopy
                    </div>
                  </div>

                  {/* Wife */}
                  <div className="mb-4 pb-4 border-b border-slate-300">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className={`font-bold text-lg ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                          [Wife's Name] - 46F
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Active: [Conditions if any] | Generally healthy
                        </p>
                      </div>
                      <button className={`px-4 py-2 rounded-lg font-semibold ${
                        darkMode
                          ? 'bg-purple-900 text-purple-200'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        View Profile
                      </button>
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Last updated: 3 months ago | Labs: Last checked Jan 2026
                    </div>
                  </div>

                  {/* Child */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className={`font-bold text-lg ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                          [Child's Name] - 13M (8th Grade)
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Active: Seasonal allergies, Tree nut allergy (SEVERE - EpiPen)
                        </p>
                      </div>
                      <button className={`px-4 py-2 rounded-lg font-semibold ${
                        darkMode
                          ? 'bg-emerald-900 text-emerald-200'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        View Profile
                      </button>
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Last updated: Today | Medications: Current | Status: Healthy
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Account Management Tab */}
            {activeTab === 'account-management' && (
              <div className="space-y-6">
                {/* Password Reset Section */}
                <div className={`rounded-xl p-8 transition-colors ${
                  darkMode
                    ? 'bg-slate-700'
                    : 'bg-slate-50'
                } border-l-4 border-blue-500`}>
                  <div className="flex items-start gap-4 mb-6">
                    <Lock className={`w-8 h-8 flex-shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <div>
                      <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                        Password Reset Management
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Reset passwords for family members if they forget their credentials.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Derrick (Self) - Cannot Reset Own */}
                    <div className={`p-6 rounded-lg border-2 transition-colors ${
                      darkMode
                        ? 'border-slate-600 bg-slate-600/30'
                        : 'border-slate-300 bg-slate-100/50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`text-lg font-bold ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                            👨‍⚕️ Derrick (You)
                          </h4>
                          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            Last password change: May 20, 2026
                          </p>
                        </div>
                        <button
                          disabled
                          className={`px-6 py-2 rounded-lg font-semibold transition-colors opacity-50 cursor-not-allowed ${
                            darkMode
                              ? 'bg-slate-500 text-slate-300'
                              : 'bg-slate-300 text-slate-600'
                          }`}
                        >
                          🔒 Cannot Reset Self
                        </button>
                      </div>
                    </div>

                    {/* Wife - Can Reset */}
                    <div className={`p-6 rounded-lg border-2 border-purple-500 transition-colors ${
                      darkMode
                        ? 'bg-purple-900/20'
                        : 'bg-purple-50'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className={`text-lg font-bold ${darkMode ? 'text-purple-200' : 'text-purple-900'}`}>
                            👩 [Wife's Name]
                          </h4>
                          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            Email: wife@example.com | Last login: May 28, 2026
                          </p>
                        </div>
                        <button className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                          darkMode
                            ? 'bg-purple-600 hover:bg-purple-500 text-white'
                            : 'bg-purple-500 hover:bg-purple-600 text-white'
                        }`}
                        onClick={() => alert('Password reset link sent to wife@example.com\n\nIn production, this would:\n1. Generate a secure reset token\n2. Send reset link via email\n3. Log the reset action with timestamp\n4. Expire link after 24 hours')}>
                          🔑 Send Reset Link
                        </button>
                      </div>
                      <p className={`text-xs italic ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Clicking "Send Reset Link" will email a secure password reset link. The recipient can create a new password within 24 hours.
                      </p>
                    </div>

                    {/* Child - Can Reset */}
                    <div className={`p-6 rounded-lg border-2 border-emerald-500 transition-colors ${
                      darkMode
                        ? 'bg-emerald-900/20'
                        : 'bg-emerald-50'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className={`text-lg font-bold ${darkMode ? 'text-emerald-200' : 'text-emerald-900'}`}>
                            👧 [Child's Name]
                          </h4>
                          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            Email: child@example.com | Last login: Today at 2:15 PM
                          </p>
                        </div>
                        <button className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                          darkMode
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        }`}
                        onClick={() => alert('Password reset link sent to child@example.com\n\nIn production, this would:\n1. Generate a secure reset token\n2. Send reset link via email\n3. Log the reset action with timestamp\n4. Expire link after 24 hours')}>
                          🔑 Send Reset Link
                        </button>
                      </div>
                      <p className={`text-xs italic ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Clicking "Send Reset Link" will email a secure password reset link. The recipient can create a new password within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reset History */}
                <div className={`rounded-xl p-8 transition-colors ${
                  darkMode
                    ? 'bg-slate-700'
                    : 'bg-slate-50'
                }`}>
                  <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    Recent Password Reset Activity
                  </h3>
                  <div className={`space-y-3 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-300">
                      <span>Reset link sent to wife@example.com</span>
                      <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>May 25, 2026 • 10:30 AM</span>
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-300">
                      <span>Reset link sent to child@example.com</span>
                      <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>May 15, 2026 • 3:45 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Password reset by child@example.com (successfully)</span>
                      <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>May 15, 2026 • 4:20 PM</span>
                    </div>
                  </div>
                </div>

                {/* Security Best Practices */}
                <div className={`rounded-xl p-6 border-l-4 border-yellow-500 transition-colors ${
                  darkMode
                    ? 'bg-yellow-900/20'
                    : 'bg-yellow-50'
                }`}>
                  <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-yellow-200' : 'text-yellow-900'}`}>
                    🔒 Security Best Practices
                  </h3>
                  <ul className={`space-y-2 text-sm ${darkMode ? 'text-yellow-100' : 'text-yellow-800'}`}>
                    <li>✓ Reset links expire after 24 hours for security</li>
                    <li>✓ All password reset actions are logged with timestamp</li>
                    <li>✓ Family members receive email confirmation of reset request</li>
                    <li>✓ You (NP) cannot reset your own password through this interface</li>
                    <li>✓ Two-factor authentication recommended for NP accounts</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyHealthApp;

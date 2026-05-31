import React, { useState } from 'react';
import { Mic, Upload, Clock, CheckCircle2, AlertCircle, FileText, Play, Pause, X, Send } from 'lucide-react';

const PatientAudioIntake = ({ darkMode = false }) => {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'recording', 'upload', 'playback', 'transcript'
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [visits, setVisits] = useState([
    {
      id: 1,
      date: '2026-05-30',
      doctor: 'Dr. Smith',
      clinic: 'Family Medicine Clinic',
      status: 'Sent to NP',
      recordingType: 'Doctor recorded visit',
      duration: '15 min',
      transcript: 'Patient presents with ear pain in right ear, started yesterday morning. Complains of slight fever (99.2°F). On examination, right ear shows signs of inflammation. Diagnosis: Acute otitis media. Prescribed Amoxicillin 500 mg, three times daily for 10 days. Follow up in 10 days if not improving. Patient education on completing full course of antibiotics provided.',
      audioFile: 'visit-20260530-drsmith.m4a'
    },
    {
      id: 2,
      date: '2026-05-15',
      doctor: 'Dr. Johnson',
      clinic: 'Pediatrics Clinic',
      status: 'Processing',
      recordingType: 'Patient memo',
      duration: '8 min',
      transcript: 'Doctor said I have seasonal allergies. Prescribed cetirizine 10 mg daily. Said to take with breakfast. Should help with sneezing and itchy eyes. Asked me to come back in 3 months if symptoms not better. Gave me a handout about allergy season.',
      audioFile: 'memo-20260515-johnsons.m4a'
    }
  ]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2),
        type: file.type,
        uploadedAt: new Date().toLocaleString()
      });
      setCurrentView('playback');
    }
  };

  const handleRecordingStart = () => {
    setIsRecording(true);
    setRecordingTime(0);
    const interval = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 300) {
          clearInterval(interval);
          setIsRecording(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleRecordingStop = () => {
    setIsRecording(false);
    setUploadedFile({
      name: `visit-${new Date().toISOString().slice(0, 10)}.m4a`,
      size: '2.5',
      type: 'audio/mp4',
      uploadedAt: new Date().toLocaleString(),
      duration: recordingTime
    });
    setCurrentView('playback');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900'
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
    }`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 border-b transition-colors duration-200 ${
        darkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-200'
      } shadow-sm`}>
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            🎤 Doctor Visit Audio Intake
          </h1>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Record or upload audio from your doctor's appointment. We'll transcribe it and send it to your NP for review.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Home View - Options */}
        {currentView === 'home' && (
          <div className="space-y-6">
            {/* Two Main Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Option 1: Record Live */}
              <button
                onClick={() => setCurrentView('recording')}
                className={`p-8 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                  darkMode
                    ? 'bg-slate-700 border-blue-500 hover:bg-slate-600'
                    : 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                }`}
              >
                <Mic className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                  📱 Record Right Now
                </h3>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                  Use your phone's microphone to record your doctor's voice or make a voice memo
                </p>
              </button>

              {/* Option 2: Upload File */}
              <button
                onClick={() => setCurrentView('upload')}
                className={`p-8 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                  darkMode
                    ? 'bg-slate-700 border-emerald-500 hover:bg-slate-600'
                    : 'bg-emerald-50 border-emerald-300 hover:bg-emerald-100'
                }`}
              >
                <Upload className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-emerald-200' : 'text-emerald-900'}`}>
                  📁 Upload Existing File
                </h3>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                  Upload audio you already have from a doctor's office or your own recording
                </p>
              </button>
            </div>

            {/* Past Visits Section */}
            <div className={`rounded-2xl p-8 transition-colors ${
              darkMode
                ? 'bg-slate-700'
                : 'bg-slate-50'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                📋 Your Recent Doctor Visits
              </h2>

              <div className="space-y-4">
                {visits.map((visit) => (
                  <div
                    key={visit.id}
                    className={`p-6 rounded-xl border-l-4 transition-colors cursor-pointer hover:shadow-lg ${
                      visit.status === 'Sent to NP'
                        ? darkMode
                          ? 'bg-emerald-900/20 border-emerald-500'
                          : 'bg-emerald-50 border-emerald-500'
                        : darkMode
                          ? 'bg-yellow-900/20 border-yellow-500'
                          : 'bg-yellow-50 border-yellow-500'
                    }`}
                    onClick={() => {
                      setUploadedFile({
                        name: visit.audioFile,
                        status: visit.status
                      });
                      setTranscript(visit.transcript);
                      setCurrentView('transcript');
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className={`text-lg font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                          {visit.doctor} - {visit.clinic}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          📅 {visit.date} • ⏱️ {visit.duration}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        visit.status === 'Sent to NP'
                          ? darkMode
                            ? 'bg-emerald-900 text-emerald-200'
                            : 'bg-emerald-100 text-emerald-700'
                          : darkMode
                            ? 'bg-yellow-900 text-yellow-200'
                            : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {visit.status === 'Sent to NP' ? '✅ Sent to NP' : '⏳ Processing'}
                      </div>
                    </div>
                    <p className={`text-xs font-semibold mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {visit.recordingType}
                    </p>
                    <p className={`text-sm line-clamp-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {visit.transcript}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recording View */}
        {currentView === 'recording' && (
          <div className={`rounded-2xl p-12 text-center transition-colors ${
            darkMode
              ? 'bg-slate-700'
              : 'bg-blue-50'
          }`}>
            <button
              onClick={() => setCurrentView('home')}
              className={`mb-8 px-4 py-2 rounded-lg font-semibold ${
                darkMode
                  ? 'bg-slate-600 text-slate-200 hover:bg-slate-500'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              ← Back
            </button>

            <h2 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              🎤 Recording Doctor Visit
            </h2>

            {/* Large Microphone Icon */}
            <div className={`w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center ${
              isRecording
                ? darkMode
                  ? 'bg-red-900/30 animate-pulse'
                  : 'bg-red-100 animate-pulse'
                : darkMode
                  ? 'bg-blue-900/30'
                  : 'bg-blue-100'
            }`}>
              <Mic className={`w-12 h-12 ${
                isRecording
                  ? 'text-red-500'
                  : darkMode
                    ? 'text-blue-400'
                    : 'text-blue-600'
              }`} />
            </div>

            {/* Recording Timer */}
            <div className={`text-6xl font-bold mb-8 font-mono ${
              isRecording
                ? 'text-red-500'
                : darkMode
                  ? 'text-slate-300'
                  : 'text-slate-700'
            }`}>
              {formatTime(recordingTime)}
            </div>

            {/* Status Text */}
            <p className={`text-lg mb-8 ${
              isRecording
                ? darkMode
                  ? 'text-red-300'
                  : 'text-red-600'
                : darkMode
                  ? 'text-slate-400'
                  : 'text-slate-600'
            }`}>
              {isRecording ? '🔴 Recording in progress...' : 'Ready to record'}
            </p>

            {/* Control Button */}
            <button
              onClick={isRecording ? handleRecordingStop : handleRecordingStart}
              className={`px-12 py-4 rounded-xl text-white font-bold text-lg transition-all transform hover:scale-105 ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isRecording ? '⏹️ Stop Recording' : '▶️ Start Recording'}
            </button>

            {/* Max Duration Info */}
            <p className={`text-xs mt-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              ⏱️ Maximum recording length: 5 minutes
            </p>
          </div>
        )}

        {/* Upload View */}
        {currentView === 'upload' && (
          <div className={`rounded-2xl p-12 text-center transition-colors ${
            darkMode
              ? 'bg-slate-700'
              : 'bg-emerald-50'
          }`}>
            <button
              onClick={() => setCurrentView('home')}
              className={`mb-8 px-4 py-2 rounded-lg font-semibold ${
                darkMode
                  ? 'bg-slate-600 text-slate-200 hover:bg-slate-500'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              ← Back
            </button>

            <h2 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              📁 Upload Audio File
            </h2>

            {/* Upload Area */}
            <label className={`block p-12 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
              darkMode
                ? 'border-emerald-500 hover:bg-slate-600/50'
                : 'border-emerald-300 hover:bg-emerald-100/50'
            }`}>
              <Upload className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <p className={`text-lg font-bold mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                Click to upload or drag and drop
              </p>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                MP3, M4A, WAV, OGG (Max 50MB)
              </p>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Supported Formats */}
            <div className={`mt-8 p-6 rounded-lg ${
              darkMode
                ? 'bg-slate-600/50'
                : 'bg-emerald-100/50'
            }`}>
              <h3 className={`font-bold mb-3 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                Supported Audio Formats:
              </h3>
              <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                MP3, M4A (iPhone voice memos), WAV, OGG, FLAC
              </p>
            </div>
          </div>
        )}

        {/* Playback View */}
        {currentView === 'playback' && uploadedFile && (
          <div className={`rounded-2xl p-8 transition-colors ${
            darkMode
              ? 'bg-slate-700'
              : 'bg-slate-50'
          }`}>
            <button
              onClick={() => setCurrentView('home')}
              className={`mb-6 px-4 py-2 rounded-lg font-semibold ${
                darkMode
                  ? 'bg-slate-600 text-slate-200 hover:bg-slate-500'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              ← Back
            </button>

            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              🎵 Review Your Recording
            </h2>

            {/* Audio Player Card */}
            <div className={`p-8 rounded-xl border-2 mb-6 transition-colors ${
              darkMode
                ? 'bg-slate-600 border-slate-500'
                : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-4 mb-4">
                <FileText className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <div>
                  <p className={`font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    {uploadedFile.name}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {uploadedFile.size} MB • Uploaded {uploadedFile.uploadedAt}
                  </p>
                </div>
              </div>

              {/* Audio Player */}
              <div className={`flex items-center gap-4 p-4 rounded-lg ${
                darkMode
                  ? 'bg-slate-700'
                  : 'bg-slate-100'
              }`}>
                <button className={`p-3 rounded-full ${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-500'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}>
                  <Play className="w-6 h-6" />
                </button>
                <div className={`flex-1 h-2 rounded-full ${
                  darkMode
                    ? 'bg-slate-600'
                    : 'bg-slate-300'
                }`}></div>
                <span className={`text-sm font-mono ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  0:00 / 2:45
                </span>
              </div>
            </div>

            {/* Next Steps */}
            <div className={`p-6 rounded-xl mb-6 border-l-4 border-blue-500 transition-colors ${
              darkMode
                ? 'bg-blue-900/20'
                : 'bg-blue-50'
            }`}>
              <h3 className={`font-bold mb-2 ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                ✨ What Happens Next
              </h3>
              <ol className={`space-y-2 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <li>1️⃣ You confirm and submit the recording</li>
                <li>2️⃣ Our AI transcribes the audio to text (usually within 1 minute)</li>
                <li>3️⃣ Transcription is reviewed and sent to your NP (Derrick)</li>
                <li>4️⃣ Derrick reviews, extracts key information, and creates a clinical summary</li>
                <li>5️⃣ You'll receive notifications about any new medications or instructions</li>
              </ol>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => {
                setTranscript('Patient presents with ear pain in right ear, started yesterday morning. Complains of slight fever (99.2°F). On examination, right ear shows signs of inflammation. Diagnosis: Acute otitis media. Prescribed Amoxicillin 500 mg, three times daily for 10 days. Follow up in 10 days if not improving.');
                setCurrentView('transcript');
              }}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
            >
              ✅ Confirm & Submit for Transcription
            </button>
          </div>
        )}

        {/* Transcript View */}
        {currentView === 'transcript' && transcript && (
          <div className={`rounded-2xl p-8 transition-colors ${
            darkMode
              ? 'bg-slate-700'
              : 'bg-slate-50'
          }`}>
            <button
              onClick={() => setCurrentView('home')}
              className={`mb-6 px-4 py-2 rounded-lg font-semibold ${
                darkMode
                  ? 'bg-slate-600 text-slate-200 hover:bg-slate-500'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              ← Back
            </button>

            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              📝 Transcription Complete
            </h2>

            {/* Status Badge */}
            <div className="mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <span className={`font-semibold ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                ✅ Sent to NP for Review
              </span>
            </div>

            {/* Transcript Text */}
            <div className={`p-8 rounded-xl mb-6 border-l-4 border-slate-400 transition-colors ${
              darkMode
                ? 'bg-slate-600'
                : 'bg-white'
            }`}>
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                🎤 What the Doctor Said:
              </h3>
              <p className={`whitespace-pre-wrap leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                {transcript}
              </p>
            </div>

            {/* What NP Will Do */}
            <div className={`p-6 rounded-xl border-l-4 border-purple-500 transition-colors ${
              darkMode
                ? 'bg-purple-900/20'
                : 'bg-purple-50'
            }`}>
              <h3 className={`font-bold mb-3 ${darkMode ? 'text-purple-200' : 'text-purple-900'}`}>
                👨‍⚕️ What Derrick (Your NP) Will Do:
              </h3>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <li>✓ Review the transcription for accuracy</li>
                <li>✓ Extract key information: diagnoses, medications, dosages</li>
                <li>✓ Check for drug interactions with your baseline medications</li>
                <li>✓ Verify dosages are appropriate for age/weight/conditions</li>
                <li>✓ Cross-check allergies and contraindications</li>
                <li>✓ Create tailored messages for family members</li>
                <li>✓ Approve and distribute health updates</li>
              </ul>
            </div>

            {/* Timeline */}
            <div className={`mt-8 p-6 rounded-xl ${
              darkMode
                ? 'bg-slate-600/50'
                : 'bg-slate-100/50'
            }`}>
              <h3 className={`font-bold mb-4 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                📅 Timeline:
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className={`font-semibold text-sm ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                      Just now
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      ✅ Recording submitted
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className={`font-semibold text-sm ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                      Within 1 minute
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      AI transcribes audio
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className={`font-semibold text-sm ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                      Within 2 hours
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Derrick reviews & approves
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className={`font-semibold text-sm ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                      Within 3 hours
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      You receive clinical summary & new instructions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientAudioIntake;

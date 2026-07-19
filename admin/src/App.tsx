import { useState, useEffect, type FormEvent } from 'react';
import type { ResumeData } from './types';
import ResumeEditor from './components/ResumeEditor';
import { resumeApi } from './api';
import {
  Lock,
  Unlock,
  LogOut,
  Save,
  AlertTriangle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Sensible fallback initial state
const defaultState: ResumeData = {
  name: "Ar-jay C. Dayanan",
  title: "Full-Stack Developer",
  profileSummary: "",
  avatarUrl: "",
  contact: { email: "", phone: "", location: "" },
  experiences: [],
  projects: [],
  skills: [],
  education: [],
  certifications: []
};

export default function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultState);
  const [originalData, setOriginalData] = useState<ResumeData>(defaultState);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Status Toast helper
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Check auth and fetch data on load
  useEffect(() => {
    // 1. Fetch current data
    resumeApi.getResume()
      .then(data => {
        if (data && data.name) {
          setResumeData(data);
          setOriginalData(data);
        }
      })
      .catch(err => {
        console.warn("Backend server not detected.", err);
      });

    // 2. Validate token
    const token = localStorage.getItem("admin_token");
    if (token) {
      resumeApi.verifyAuth()
        .then(res => {
          if (res.ok) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("admin_token");
            setIsAuthenticated(false);
          }
        })
        .catch(() => {
          setIsAuthenticated(false);
        });
    }
  }, []);

  // Track draft state changes locally
  const handleDataChange = (newData: ResumeData) => {
    setResumeData(newData);
    setIsDirty(true);
  };

  const handleAvatarUploadSuccess = (newAvatarUrl: string) => {
    setOriginalData(prev => ({
      ...prev,
      avatarUrl: newAvatarUrl
    }));
    setResumeData(prev => ({
      ...prev,
      avatarUrl: newAvatarUrl
    }));
  };

  // Save changes to PostgreSQL database
  const handleSaveToBackend = async () => {
    setShowSaveModal(false);

    // Calculate diff to send only what changed
    const diff: Partial<ResumeData> = {};
    if (originalData.name !== resumeData.name) diff.name = resumeData.name;
    if (originalData.title !== resumeData.title) diff.title = resumeData.title;
    if (originalData.profileSummary !== resumeData.profileSummary) diff.profileSummary = resumeData.profileSummary;
    if (originalData.avatarUrl !== resumeData.avatarUrl) diff.avatarUrl = resumeData.avatarUrl;

    if (JSON.stringify(originalData.contact) !== JSON.stringify(resumeData.contact)) {
      diff.contact = resumeData.contact;
    }
    if (JSON.stringify(originalData.experiences) !== JSON.stringify(resumeData.experiences)) {
      diff.experiences = resumeData.experiences;
    }
    if (JSON.stringify(originalData.projects) !== JSON.stringify(resumeData.projects)) {
      diff.projects = resumeData.projects;
    }
    if (JSON.stringify(originalData.skills) !== JSON.stringify(resumeData.skills)) {
      diff.skills = resumeData.skills;
    }
    if (JSON.stringify(originalData.education) !== JSON.stringify(resumeData.education)) {
      diff.education = resumeData.education;
    }
    if (JSON.stringify(originalData.certifications) !== JSON.stringify(resumeData.certifications)) {
      diff.certifications = resumeData.certifications;
    }

    if (Object.keys(diff).length === 0) {
      showToast("No changes detected.");
      setIsDirty(false);
      return;
    }

    try {
      const res = await resumeApi.patchResume(diff);

      if (res.status === 401) {
        showToast("Session expired. Please log in again.", "error");
        localStorage.removeItem("admin_token");
        setIsAuthenticated(false);
      } else if (!res.ok) {
        throw new Error("Failed to write to database");
      } else {
        setOriginalData(resumeData);
        setIsDirty(false);
        showToast("Changes saved successfully!");
      }
    } catch (e) {
      console.error("Save error", e);
      showToast("Error saving changes.", "error");
    }
  };

  // Reset editor draft back to template details locally
  const handleReset = () => {
    setResumeData(defaultState);
    setIsDirty(true);
    setShowResetModal(false);
    showToast("Draft reset to default fallback.");
  };

  // Handle Login form submit
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await resumeApi.login(password);

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("admin_token", data.token);
        setIsAuthenticated(true);
        setPassword("");

        // Fetch fresh data from backend
        try {
          const freshData = await resumeApi.getResume();
          setResumeData(freshData);
          setOriginalData(freshData);
        } catch (e) {
          console.error("Fetch fresh data error", e);
        }
      } else {
        setLoginError("Invalid password.");
      }
    } catch (err) {
      console.error(err);
      setLoginError("Error connecting to login service.");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
  };

  // Render Login Card if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-[#F3F4F6] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#161B2B] border border-white/10 p-8 rounded-2xl shadow-2xl space-y-6">
          <div className="flex items-center gap-3 justify-center">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold uppercase tracking-wider font-mono">Admin Portal</h1>
          </div>

          <p className="text-xs text-gray-400 text-center leading-relaxed font-light">
            Authenticate using owner password credentials to access database and configuration fields.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                placeholder="Enter password"
                required
              />
            </div>

            {loginError && (
              <p className="text-xs text-rose-400 font-semibold text-center">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono uppercase tracking-wider py-3 rounded-lg text-xs font-bold cursor-pointer transition-colors"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render main editor dashboard
  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F3F4F6] flex flex-col font-sans">
      {/* Header bar */}
      <header className="bg-[#0B0F19]/90 border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
            <Unlock className="w-4 h-4" />
          </div>
          <span className="font-bold text-xs sm:text-sm tracking-widest text-white uppercase font-mono">
            Owner Dashboard Console
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Save Button, pulsing if changes are made */}
          {isDirty && (
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all animate-pulse shadow-lg shadow-indigo-600/30"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/20 hover:bg-rose-600 border border-rose-900/50 hover:border-rose-600 text-rose-400 hover:text-white rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Console Canvas */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col">
        <div className="flex-1">
          <ResumeEditor
            data={resumeData}
            onChange={handleDataChange}
            onReset={() => setShowResetModal(true)}
            onAvatarUploadSuccess={handleAvatarUploadSuccess}
          />
        </div>
      </main>

      {/* Custom Save Modal Overlay */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-[#161B2B] border border-white/10 p-6 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
                <Save className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">Save Changes</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-light">
              Are you sure you want to write all current modifications to the live PostgreSQL database? This will update the public website portfolio instantly.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 bg-slate-900 border border-white/10 hover:bg-slate-800 text-gray-300 rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveToBackend}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-md shadow-indigo-600/20"
              >
                Save Edits
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Reset Modal Overlay */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-[#161B2B] border border-white/10 p-6 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-rose-500/10 text-rose-400 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">Reset Defaults</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-light">
              Are you sure you want to restore the editor inputs back to the default fallback template? You will need to click 'Save Changes' to apply this to the database.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 bg-slate-900 border border-white/10 hover:bg-slate-800 text-gray-300 rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-md shadow-rose-600/20"
              >
                Reset Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Status Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-xl border shadow-2xl transition-all duration-300 transform translate-y-0 ${
          toast.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300'
            : 'bg-rose-950/90 border-rose-500/30 text-rose-300'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span className="text-xs font-mono uppercase tracking-wider font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

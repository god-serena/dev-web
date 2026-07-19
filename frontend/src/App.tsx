import { useState, useEffect } from 'react';
import type { ResumeData } from './types';
import PortfolioView from './components/PortfolioView';
import { apiFetch } from './api';

export default function App() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResumeData = () => {
    setLoading(true);
    setError(null);
    apiFetch("/api/resume")
      .then(res => {
        if (!res.ok) throw new Error("Connection failed: Server returned non-200 code");
        return res.json();
      })
      .then(data => {
        if (data && data.name) {
          setResumeData(data);
        } else {
          throw new Error("Invalid resume data received from server");
        }
      })
      .catch(err => {
        console.error(err);
        setError(err.message || "An error occurred while loading application workspace");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchResumeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-[#F3F4F6] flex flex-col items-center justify-center font-sans relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-[100px] pointer-events-none"></div>
        <div className="relative flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 rounded-full animate-spin [animation-duration:1.5s]"></div>
            <div className="absolute inset-1.5 bg-[#0B0F19] rounded-full"></div>
          </div>
          <div className="space-y-1.5 text-center">
            <h2 className="text-xs font-mono uppercase tracking-widest text-indigo-400 animate-pulse font-semibold">
              Initializing Core Engine
            </h2>
            <p className="text-[10px] text-gray-500 font-mono tracking-wide uppercase animate-pulse">
              Fetching Portfolio data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !resumeData) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-[#F3F4F6] flex flex-col items-center justify-center font-sans relative overflow-hidden p-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-500/5 rounded-full filter blur-[100px] pointer-events-none"></div>
        <div className="w-full max-w-md bg-[#111625]/60 backdrop-blur-md border border-rose-500/20 rounded-2xl p-6 text-center space-y-4 shadow-2xl relative z-10">
          <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="space-y-1.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-rose-400 font-mono">
              Connection Failure
            </h2>
          </div>
          <button
            onClick={fetchResumeData}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-indigo-700 bg-indigo-600 border border-indigo-500/20 px-4.5 py-2.5 rounded-lg cursor-pointer transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] bg-grid-mesh text-[#F3F4F6] flex flex-col font-sans selection:bg-indigo-600 selection:text-white relative overflow-x-hidden">
      
      {/* Background glow graphics */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-indigo-500/10 rounded-full filter blur-[120px] pointer-events-none z-0 print:hidden"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full filter blur-[120px] pointer-events-none z-0 print:hidden"></div>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col print:p-0 print:m-0 print:max-w-none relative z-10">
        <div className="w-full max-w-5xl mx-auto py-2 sm:py-4 print:py-0">
          <PortfolioView
            data={resumeData}
          />
        </div>
      </main>

      {/* Status Bar Footer */}
      <footer className="bg-slate-950/40 border-t border-white/5 py-5 text-center text-[10px] text-gray-500 font-mono mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-2 uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Built with React &bull; FastAPI &bull; PostgreSQL &bull; Docker
          </span>
          <span className="text-[9px] text-gray-600">
            Built alongside Antigravity by Google DeepMind
          </span>
        </div>
      </footer>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { initialResumeData } from './data';
import type { ResumeData } from './types';
import PortfolioView from './components/PortfolioView';
import { apiFetch } from './api';

export default function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);

  // Load from backend on mount
  useEffect(() => {
    apiFetch("/api/resume")
      .then(res => {
        if (!res.ok) throw new Error("API load failure");
        return res.json();
      })
      .then(data => {
        if (data && data.name) {
          setResumeData(data);
        }
      })
      .catch(err => {
        console.warn("Backend API not detected, displaying local fallback template.", err);
      });
  }, []);

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

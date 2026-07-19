import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Globe,
  Briefcase,
  Award,
  Terminal,
  Layers,
  Cpu,
  Sparkles,
  UserCheck,
  Check,
  Copy
} from 'lucide-react';
import type { ResumeData } from '../types';
import { apiFetch, resolveApiUrl } from '../api';

import CareerTimeline from './tabs/CareerTimeline';
import ProjectsDeck from './tabs/ProjectsDeck';
import TechRadar from './tabs/TechRadar';
import Credentials from './tabs/Credentials';

interface PortfolioViewProps {
  data: ResumeData;
}

export default function PortfolioView({ data }: PortfolioViewProps) {
  const [activeTab, setActiveTab] = useState<'experience' | 'projects' | 'skills' | 'credentials'>('experience');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [avatarValid, setAvatarValid] = useState<boolean | null>(null);

  const calculateExperienceYears = () => {
    const startDate = new Date(2023, 1); // Feb 2023 (0-indexed: 1 is Feb)
    const currentDate = new Date();
    let years = currentDate.getFullYear() - startDate.getFullYear();
    const months = currentDate.getMonth() - startDate.getMonth();
    if (months < 0 || (months === 0 && currentDate.getDate() < startDate.getDate())) {
      years--;
    }
    return years;
  };

  const getUniqueSkillsCount = () => {
    const uniqueSkills = new Set<string>();
    data.skills.forEach(category => {
      category.skills.forEach(skill => {
        const cleanSkill = skill.trim().toLowerCase();
        if (cleanSkill) {
          uniqueSkills.add(cleanSkill);
        }
      });
    });
    return uniqueSkills.size;
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getAvatarSrc = () => {
    if (!data.avatarUrl) return '';
    return resolveApiUrl(data.avatarUrl);
  };

  useEffect(() => {
    if (!data.avatarUrl) {
      setAvatarValid(false);
      return;
    }
    apiFetch(data.avatarUrl, { method: 'HEAD' })
      .then(res => {
        if (res.ok) {
          setAvatarValid(true);
        } else {
          setAvatarValid(false);
        }
      })
      .catch(() => {
        setAvatarValid(false);
      });
  }, [data.avatarUrl]);

  // SVG Tech Avatar fallback since image gen is unavailable or url invalid
  const renderSvgAvatar = () => (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24">
      {/* Glow border ring */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 rounded-full animate-spin [animation-duration:8s] opacity-75 blur-[2px]"></div>
      {/* Inside circle */}
      <div className="absolute inset-1 bg-[#0F1322] rounded-full flex items-center justify-center border border-white/10">
        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 bg-emerald-500 w-4 h-4 rounded-full border-2 border-[#0B0F19] flex items-center justify-center" title="Active Core Status">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      </div>
    </div>
  );

  const renderAvatar = () => {
    if (avatarValid && data.avatarUrl) {
      return (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-white/10 bg-slate-900 flex-shrink-0 flex items-center justify-center">
          <img
            src={getAvatarSrc()}
            alt="Profile Avatar"
            className="w-full h-full object-cover"
            onError={() => setAvatarValid(false)}
          />
          <div className="absolute bottom-0 right-0 bg-emerald-500 w-4 h-4 rounded-full border-2 border-[#0B0F19] flex items-center justify-center" title="Active Core Status">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          </div>
        </div>
      );
    }
    return renderSvgAvatar();
  };

  return (
    <div id="resume-document" className="w-full text-[#F3F4F6] font-sans antialiased space-y-8 print:text-black print:bg-white print:space-y-6">

      {/* Hero HUD Info (Non-resume-like visual card) */}
      <header className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden print:border-none print:p-0 print:bg-white">
        {/* Glow effect background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-[80px] pointer-events-none print:hidden"></div>
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-purple-500/10 rounded-full filter blur-[60px] pointer-events-none print:hidden"></div>

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 sm:gap-8 relative z-10">

          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="print:hidden">
              {renderAvatar()}
            </div>

            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <motion.h1
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl sm:text-4xl font-bold tracking-tight text-white print:text-black font-sans"
                >
                  {data.name || "Your Name"}
                </motion.h1>

                <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full print:hidden">
                  <UserCheck className="w-3 h-3" />
                  Active Workspace
                </span>
              </div>

              <motion.p
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 font-semibold tracking-wide text-base sm:text-lg font-mono print:text-[#444444]"
              >
                {data.title || "Professional Title"}
              </motion.p>

              {/* Location Badge */}
              {data.contact.location && (
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-gray-400 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{data.contact.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Contact & Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs w-full md:w-auto min-w-[280px]">
            {data.contact.email && (
              <div className="flex items-center justify-between gap-3 p-2.5 bg-slate-900/60 border border-white/5 rounded-lg hover:border-indigo-500/30 group transition-all">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                  <a href={`mailto:${data.contact.email}`} className="hover:underline text-gray-300 hover:text-white truncate">{data.contact.email}</a>
                </div>
                <button
                  onClick={() => handleCopy(data.contact.email, 'email')}
                  className="opacity-60 group-hover:opacity-100 p-1 rounded hover:bg-white/5 transition-all cursor-pointer print:hidden"
                  title="Copy Email"
                >
                  {copiedText === 'email' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
                </button>
              </div>
            )}

            {data.contact.phone && (
              <div className="flex items-center gap-2 p-2.5 bg-slate-900/60 border border-white/5 rounded-lg hover:border-indigo-500/30 transition-all">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-gray-300 font-mono truncate">{data.contact.phone}</span>
              </div>
            )}

            {data.contact.github && (
              <div className="flex items-center gap-2 p-2.5 bg-slate-900/60 border border-white/5 rounded-lg hover:border-indigo-500/30 transition-all">
                <Github className="w-4 h-4 text-indigo-400 shrink-0" />
                <a href={`https://${data.contact.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-300 hover:text-white truncate">
                  {data.contact.github.replace('github.com/', '')}
                </a>
              </div>
            )}

            {data.contact.linkedin && (
              <div className="flex items-center gap-2 p-2.5 bg-slate-900/60 border border-white/5 rounded-lg hover:border-indigo-500/30 transition-all">
                <Linkedin className="w-4 h-4 text-indigo-400 shrink-0" />
                <a href={`https://${data.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-300 hover:text-white truncate">
                  {data.contact.linkedin.replace('linkedin.com/in/', '')}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Performance Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5 text-center print:hidden">
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
            <span className="block text-2xl font-bold text-white font-mono">{calculateExperienceYears()}+</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Years Exp</span>
          </div>
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
            <span className="block text-2xl font-bold text-white font-mono">{getUniqueSkillsCount()}+</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Core Stack</span>
          </div>
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
            <span className="block text-2xl font-bold text-white font-mono">{data.projects.length}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Live Projects</span>
          </div>
        </div>
      </header>

      {/* Core Summary right after HUD info */}
      <div className="glass-panel rounded-2xl p-6 mt-6 space-y-3 print:border-none print:p-0">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Core Summary</span>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed font-light print:text-black">
          {data.profileSummary || "Highly experienced developer specialized in building web architecture."}
        </p>
      </div>

      {/* Main Grid Section (Hidden when printing - print displays a fully structured report) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 print:hidden">

        {/* Navigation Sidebar Drawer */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-panel rounded-2xl p-4 space-y-2">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Workspace HUD</span>
            </div>

            <button
              onClick={() => setActiveTab('experience')}
              className={`w-full flex items-center justify-between text-xs font-semibold px-3 py-2.5 rounded-xl transition-all cursor-pointer ${activeTab === 'experience'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>Career Timeline</span>
              </div>
              <ChevronIndicator active={activeTab === 'experience'} />
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between text-xs font-semibold px-3 py-2.5 rounded-xl transition-all cursor-pointer ${activeTab === 'projects'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Featured Projects</span>
              </div>
              <ChevronIndicator active={activeTab === 'projects'} />
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`w-full flex items-center justify-between text-xs font-semibold px-3 py-2.5 rounded-xl transition-all cursor-pointer ${activeTab === 'skills'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                <span>Tech Stack Radar</span>
              </div>
              <ChevronIndicator active={activeTab === 'skills'} />
            </button>

            <button
              onClick={() => setActiveTab('credentials')}
              className={`w-full flex items-center justify-between text-xs font-semibold px-3 py-2.5 rounded-xl transition-all cursor-pointer ${activeTab === 'credentials'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Credentials</span>
              </div>
              <ChevronIndicator active={activeTab === 'credentials'} />
            </button>
          </div>
        </div>

        {/* Dynamic Display Panels */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'experience' && (
                <CareerTimeline experiences={data.experiences} />
              )}

              {activeTab === 'projects' && (
                <ProjectsDeck projects={data.projects} />
              )}

              {activeTab === 'skills' && (
                <TechRadar skills={data.skills} />
              )}

              {activeTab === 'credentials' && (
                <Credentials
                  education={data.education}
                  certifications={data.certifications}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* PRINT VIEW ONLY: Standard A4 report structured page layout. Displays clean lists instead of tabs */}
      <div className="hidden print:block space-y-8 text-black bg-white">
        {/* Profile Summary */}
        {data.profileSummary && (
          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1">Profile Summary</h2>
            <p className="text-xs text-gray-700 leading-relaxed font-light">{data.profileSummary}</p>
          </section>
        )}

        {/* Experience */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1">Experience</h2>
          <div className="space-y-4">
            {data.experiences.map((exp) => (
              <div key={exp.id} className="space-y-1.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold">{exp.role}</h3>
                    <p className="text-[11px] text-gray-600">{exp.company} • {exp.location}</p>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <ul className="text-[11px] text-gray-700 space-y-1 list-disc pl-4">
                  {exp.description.map((b, idx) => <li key={idx}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((proj) => (
              <div key={proj.id} className="space-y-1">
                <h3 className="text-xs font-bold">{proj.name}</h3>
                <p className="text-[11px] text-gray-600">{proj.role}</p>
                <p className="text-[11px] text-gray-700 leading-relaxed">{proj.description}</p>
                {proj.highlights && (
                  <ul className="text-[11px] text-gray-700 space-y-0.5 list-disc pl-4">
                    {proj.highlights.map((h, idx) => <li key={idx}>{h}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1">Skills</h2>
          <div className="grid grid-cols-2 gap-4">
            {data.skills.map((cat) => (
              <div key={cat.id} className="text-[11px]">
                <h4 className="font-bold text-gray-800">{cat.categoryName}</h4>
                <p className="text-gray-600 mt-0.5">{cat.skills.join(', ')}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Certs */}
        <div className="grid grid-cols-2 gap-6">
          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1">Education</h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="text-[11px]">
                <h4 className="font-bold">{edu.degree} in {edu.fieldOfStudy}</h4>
                <p className="text-gray-600">{edu.school} • {edu.startDate.split('-')[0]} – {edu.endDate.split('-')[0]}</p>
              </div>
            ))}
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1">Certifications</h2>
            {data.certifications.map((cert) => (
              <div key={cert.id} className="text-[11px] flex justify-between">
                <div>
                  <h4 className="font-bold">{cert.name}</h4>
                  <p className="text-gray-600">{cert.issuer}</p>
                </div>
                <span className="text-gray-500 font-mono text-[10px]">{cert.date}</span>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}

// Chevron sub-indicator helper
function ChevronIndicator({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 transition-transform ${active ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  );
}

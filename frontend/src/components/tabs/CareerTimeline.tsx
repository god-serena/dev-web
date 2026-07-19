import { Briefcase } from 'lucide-react';
import type { Experience } from '../../types';

interface CareerTimelineProps {
  experiences: Experience[];
}

export default function CareerTimeline({ experiences }: CareerTimelineProps) {
  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-60 h-60 bg-purple-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
        
        <div className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-indigo-400" />
          Professional Experience Timeline
        </div>

        <div className="relative border-l border-indigo-900/60 ml-4 space-y-8">
          {experiences.map((exp) => {
            const formatYear = (d: string) => d ? d.split('-')[0] : '';
            const startYear = formatYear(exp.startDate);
            const endYear = exp.current ? 'Present' : formatYear(exp.endDate);
            const yearDisplay = startYear && endYear ? `${startYear} — ${endYear}` : (startYear || '—');

            return (
              <div key={exp.id} className="relative pl-8">
                {/* Timeline bullet dot */}
                <div className="absolute -left-1.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-[#0B0F19] border-indigo-500"></div>

                <div className="p-5 rounded-xl border bg-slate-900/40 border-white/5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h4 className="text-base font-bold text-white leading-tight">
                        {exp.role} <span className="font-light text-gray-400">at</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-semibold">{exp.company}</span>
                      </h4>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block sm:inline mt-1">{exp.location}</span>
                    </div>
                    <span className="text-xs font-mono font-medium px-2.5 py-1 rounded bg-slate-950 border border-white/5 text-indigo-400 shrink-0 text-center">
                      {yearDisplay}
                    </span>
                  </div>

                  <ul className="text-xs text-gray-300 leading-relaxed space-y-2 list-none pl-0">
                    {exp.description.map((bullet, idx) => (
                      <li key={idx} className="relative pl-4 font-light">
                        <span className="absolute left-0 top-2 w-1.5 h-1 bg-indigo-500 rounded-full"></span>
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  {/* Experience Tech Badges */}
                  {exp.techStack && exp.techStack.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                      {exp.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-white/5 text-gray-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

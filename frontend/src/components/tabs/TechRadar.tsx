import { Cpu } from 'lucide-react';
import type { SkillCategory } from '../../types';

interface TechRadarProps {
  skills: SkillCategory[];
}

export default function TechRadar({ skills }: TechRadarProps) {
  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 space-y-6">
        <div>
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            Skills Matrix Console
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Technologies, programming languages, and frameworks used in professional workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((cat) => (
            <div 
              key={cat.id} 
              className="p-4 rounded-xl border bg-slate-900/40 border-white/5"
            >
              <h4 className="font-bold text-xs text-indigo-400 tracking-widest uppercase mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                {cat.categoryName}
              </h4>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-mono px-3 py-1 rounded-lg border bg-slate-950/50 border-white/5 text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

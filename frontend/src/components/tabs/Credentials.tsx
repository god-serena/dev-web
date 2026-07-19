import { GraduationCap, Award, ExternalLink } from 'lucide-react';
import type { Education, Certification } from '../../types';

interface CredentialsProps {
  education: Education[];
  certifications: Certification[];
}

export default function Credentials({ education, certifications }: CredentialsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Education Card */}
        <div className="glass-panel rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            Education
          </h3>

          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id} className="space-y-2.5">
                <div>
                  <h4 className="font-bold text-base text-white">
                    {edu.degree}
                  </h4>
                  <p className="text-xs text-indigo-400 font-semibold font-mono">{edu.fieldOfStudy}</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{edu.school}</p>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
                  <span>{edu.startDate.split('-')[0]} – {edu.current ? 'Present' : edu.endDate.split('-')[0]}</span>
                  <span>•</span>
                  <span>{edu.location}</span>
                </div>

                {edu.bulletPoints && edu.bulletPoints.length > 0 && (
                  <ul className="text-xs text-gray-400 leading-relaxed space-y-1.5 list-none pl-0">
                    {edu.bulletPoints.map((bp, idx) => (
                      <li key={idx} className="relative pl-4 font-light">
                        <span className="absolute left-0 top-1.5 w-1.5 h-0.5 bg-indigo-500 rounded-full"></span>
                        {bp}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Certifications Card */}
        {certifications && certifications.length > 0 && (
          <div className="glass-panel rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
              <Award className="w-5 h-5 text-indigo-400" />
              Certifications
            </h3>

            <div className="space-y-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="p-3.5 bg-slate-900/40 border border-white/5 rounded-xl flex items-start justify-between gap-4">
                  <div className="space-y-1.5 truncate">
                    <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                      {cert.url ? (
                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-indigo-400 flex items-center gap-1 cursor-pointer">
                          {cert.name} <ExternalLink className="w-3 h-3 text-gray-500" />
                        </a>
                      ) : (
                        cert.name
                      )}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-medium">{cert.issuer}</p>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-400 bg-slate-950 px-2.5 py-0.5 rounded border border-white/5 font-semibold shrink-0">
                    {cert.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

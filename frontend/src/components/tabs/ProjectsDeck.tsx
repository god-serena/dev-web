import { useState } from 'react';
import { Globe, Github } from 'lucide-react';
import type { Project } from '../../types';

const HANDS_ON_DESCRIPTION = "Projects in this section demonstrate my foundational software engineering capabilities, architectural design, and deep technical discipline. While I leverage AI tools as an advanced sounding board for syntax reference, minor refactoring, and quick debugging, the core logic, database schemas, and system integrations are manually written and optimized from scratch";

const AI_ASSISTED_DESCRIPTION = "Projects in this section highlight my ability to develop and deploy feature-rich applications at high velocity using modern AI tools. In this workflow, my role shifts from line-by-line coding to overseeing the overall system design and feature planning. I handle the high-level logic, structurally review AI-generated code for quality, and deliberately decide exactly how and where changes are implemented.";

interface ProjectsDeckProps {
  projects: Project[];
}

export default function ProjectsDeck({ projects }: ProjectsDeckProps) {
  const [projectSubTab, setProjectSubTab] = useState<'hands-on' | 'ai-prototype'>('hands-on');

  return (
    <div className="space-y-6">
      {/* Category sub-navigation */}
      <div className="flex border-b border-white/5 gap-6">
        <button
          onClick={() => setProjectSubTab('hands-on')}
          className={`pb-2.5 text-xs font-semibold uppercase tracking-wider transition-all relative cursor-pointer ${
            projectSubTab === 'hands-on' ? 'text-indigo-400 font-bold' : 'text-gray-400 hover:text-white'
          }`}
        >
          Hands-On Development
          {projectSubTab === 'hands-on' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full"></span>
          )}
        </button>
        <button
          onClick={() => setProjectSubTab('ai-prototype')}
          className={`pb-2.5 text-xs font-semibold uppercase tracking-wider transition-all relative cursor-pointer ${
            projectSubTab === 'ai-prototype' ? 'text-indigo-400 font-bold' : 'text-gray-400 hover:text-white'
          }`}
        >
          AI-Assisted Prototyping
          {projectSubTab === 'ai-prototype' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full"></span>
          )}
        </button>
      </div>

      {/* Category Description */}
      <p className="text-xs text-gray-400 italic leading-relaxed">
        {projectSubTab === 'hands-on' ? HANDS_ON_DESCRIPTION : AI_ASSISTED_DESCRIPTION}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects
          .filter((project) => {
            const type = project.projectType;
            if (projectSubTab === 'hands-on') {
              return type === 1 || type === undefined;
            } else {
              return type === 0;
            }
          })
          .map((project) => (
            <div 
              key={project.id} 
              className="glass-panel rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 border border-indigo-500/20 rounded uppercase font-semibold">
                    {project.role || "Creator"}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {project.url && (
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-1.5 rounded-lg bg-slate-900 border border-white/5 hover:border-indigo-500/30 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        title="Live Demo"
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-1.5 rounded-lg bg-slate-900 border border-white/5 hover:border-indigo-500/30 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        title="GitHub Code"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-base font-bold text-white leading-tight">
                    {project.name}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">
                    {project.description}
                  </p>
                </div>

                {project.highlights && project.highlights.length > 0 && (
                  <ul className="text-xs text-gray-400 leading-relaxed space-y-2 pl-4 list-disc">
                    {project.highlights.map((highlight, idx) => (
                      <li key={idx} className="marker:text-indigo-400 font-light">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Project Stack footer */}
              <div className="p-4 bg-slate-950/40 border-t border-white/5 flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span 
                    key={tech} 
                    className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/5 text-gray-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

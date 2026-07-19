import { useState } from 'react';
import type { ResumeData, Project } from '../../types';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface ProjectsTabProps {
  data: ResumeData;
  addProject: () => void;
  removeProject: (id: string) => void;
  updateProject: (id: string, field: keyof Project, value: any) => void;
  updateField: (section: keyof ResumeData | 'contact', field: string, value: any) => void;
}

export default function ProjectsTab({
  data,
  addProject,
  removeProject,
  updateProject,
  updateField
}: ProjectsTabProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const updated = [...data.projects];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, draggedItem);

    updateField('projects', 'projects', updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Projects Showcase</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">Drag and drop cards to reorder projects.</p>
        </div>
        <button
          type="button"
          onClick={addProject}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-indigo-700 bg-indigo-600 border border-indigo-500/20 px-3.5 py-2 rounded-lg cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Project
        </button>
      </div>

      <div className="space-y-6">
        {data.projects.map((project, index) => (
          <div
            key={project.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={() => handleDrop(index)}
            onDragEnd={handleDragEnd}
            className={`border rounded-xl p-4 relative group transition-all duration-200 cursor-grab active:cursor-grabbing ${
              draggedIndex === index
                ? 'opacity-30 border-dashed border-indigo-500 bg-indigo-950/20'
                : dragOverIndex === index
                ? 'border-indigo-400 bg-slate-800/80 scale-[1.01]'
                : 'border-white/5 bg-slate-900/60 hover:border-white/10'
            }`}
          >
            {/* Left Drag Handle & Project Number */}
            <div className="absolute top-4 left-4 flex items-center gap-2 text-gray-400">
              <GripVertical className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors shrink-0" />
              <span className="text-[10px] font-mono text-gray-500 font-semibold select-none">Project #{index + 1}</span>
            </div>

            {/* Right Action buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => removeProject(project.id)}
                className="text-gray-400 hover:text-rose-400 p-1 rounded hover:bg-white/5 cursor-pointer transition-colors"
                title="Delete project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Project Type</label>
                <select
                  value={project.projectType !== undefined ? project.projectType : 1}
                  onChange={(e) => updateProject(project.id, 'projectType', parseInt(e.target.value))}
                  className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={1}>Hands-On Development</option>
                  <option value={0}>AI-Assisted Prototyping</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Project Name</label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                  placeholder="e.g. PulseEngine Platform"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Your Role / Scope</label>
                <input
                  type="text"
                  value={project.role}
                  onChange={(e) => updateProject(project.id, 'role', e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                  placeholder="e.g. Lead Architect"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Live Demo URL</label>
                <input
                  type="text"
                  value={project.url || ''}
                  onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">GitHub Link</label>
                <input
                  type="text"
                  value={project.githubUrl || ''}
                  onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-gray-300 mb-1">Description</label>
              <textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                rows={2}
                className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                placeholder="Briefly state what the project accomplishes..."
              />
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-gray-300 mb-1">Project Accomplishments (One per line)</label>
              <textarea
                value={project.highlights?.join('\n') || ''}
                onChange={(e) => updateProject(project.id, 'highlights', e.target.value.split('\n'))}
                rows={2.5}
                className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none leading-relaxed font-sans"
                placeholder="• Built a customized dashboard..."
              />
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-gray-300 mb-1">Technologies Used (Comma-separated)</label>
              <input
                type="text"
                value={project.techStack.join(', ')}
                onChange={(e) => updateProject(project.id, 'techStack', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                placeholder="React, Express, Tailwind"
              />
            </div>
          </div>
        ))}
        {data.projects.length === 0 && (
          <div className="text-center py-6 text-gray-400 text-xs italic border border-dashed border-white/10 rounded-xl">
            No projects listed. Click "Add Project" to begin.
          </div>
        )}
      </div>
    </div>
  );
}

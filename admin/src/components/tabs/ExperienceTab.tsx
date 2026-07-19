import { useState } from 'react';
import type { ResumeData, Experience } from '../../types';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface ExperienceTabProps {
  data: ResumeData;
  addExperience: () => void;
  removeExperience: (id: string) => void;
  updateExperience: (id: string, field: keyof Experience, value: any) => void;
  updateField: (section: keyof ResumeData | 'contact', field: string, value: any) => void;
}

export default function ExperienceTab({
  data,
  addExperience,
  removeExperience,
  updateExperience,
  updateField
}: ExperienceTabProps) {
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

    const updated = [...data.experiences];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, draggedItem);

    updateField('experiences', 'experiences', updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Positions</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">Drag and drop cards to reorder roles.</p>
        </div>
        <button
          type="button"
          onClick={addExperience}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-indigo-700 bg-indigo-600 border border-indigo-500/20 px-3.5 py-2 rounded-lg cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Role
        </button>
      </div>

      <div className="space-y-6">
        {data.experiences.map((exp, index) => (
          <div
            key={exp.id}
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
            {/* Left Drag Handle & Role Title */}
            <div className="absolute top-4 left-4 flex items-center gap-2 text-gray-400">
              <GripVertical className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors shrink-0" />
              <span className="text-[10px] font-mono text-gray-500 font-semibold select-none">Position #{index + 1}</span>
            </div>

            {/* Right Action buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => removeExperience(exp.id)}
                className="text-gray-400 hover:text-rose-400 p-1 rounded hover:bg-white/5 cursor-pointer transition-colors"
                title="Delete experience"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. TechNova"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Job Role</label>
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Lead Engineer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Office Location</label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. San Francisco (Hybrid)"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. 2023-03"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">End Date</label>
                  <input
                    type="text"
                    value={exp.endDate}
                    disabled={exp.current}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    className={`w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500 ${exp.current ? 'opacity-40 cursor-not-allowed' : ''}`}
                    placeholder="e.g. 2024-05"
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="checkbox"
                id={`curr-${exp.id}`}
                checked={exp.current}
                onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                className="rounded border-white/10 bg-slate-950 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <label htmlFor={`curr-${exp.id}`} className="text-xs font-semibold text-gray-300 select-none cursor-pointer">
                I currently work in this position
              </label>
            </div>

            {/* Bullet Points */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-300 mb-1">Job Highlights / Bullets (One per line)</label>
              <textarea
                value={exp.description.join('\n')}
                onChange={(e) => updateExperience(exp.id, 'description', e.target.value.split('\n'))}
                rows={3}
                className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
                placeholder="• Architected analytics dashboard..."
              />
            </div>

            {/* Tech Stack */}
            <div className="mt-3">
              <label className="block text-xs font-semibold text-gray-300 mb-1">Technologies Used (Comma-separated)</label>
              <input
                type="text"
                value={exp.techStack.join(', ')}
                onChange={(e) => updateExperience(exp.id, 'techStack', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                placeholder="React, TypeScript, Node.js"
              />
            </div>
          </div>
        ))}
        {data.experiences.length === 0 && (
          <div className="text-center py-6 text-gray-400 text-xs italic border border-dashed border-white/10 rounded-xl">
            No experience items listed. Click "Add Role" to begin.
          </div>
        )}
      </div>
    </div>
  );
}

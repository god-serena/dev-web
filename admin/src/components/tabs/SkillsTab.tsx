import type { ResumeData, SkillCategory } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface SkillsTabProps {
  data: ResumeData;
  addSkillCategory: () => void;
  removeSkillCategory: (id: string) => void;
  updateSkillCategory: (id: string, field: keyof SkillCategory, value: any) => void;
}

export default function SkillsTab({
  data,
  addSkillCategory,
  removeSkillCategory,
  updateSkillCategory
}: SkillsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Skill Categories</h3>
        <button
          type="button"
          onClick={addSkillCategory}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-indigo-700 bg-indigo-600 border border-indigo-500/20 px-3.5 py-2 rounded-lg cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Category
        </button>
      </div>

      <div className="space-y-4">
        {data.skills.map((cat, index) => (
          <div key={cat.id} className="border border-white/5 rounded-xl p-4 bg-slate-900/60 flex flex-col gap-3 relative group">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-500 font-semibold">Category #{index + 1}</span>
              <button
                type="button"
                onClick={() => removeSkillCategory(cat.id)}
                className="text-gray-400 hover:text-rose-400 p-1 rounded hover:bg-white/5 cursor-pointer transition-colors"
                title="Delete Category"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="w-2/3">
              <label className="block text-xs font-semibold text-gray-300 mb-1">Category Name</label>
              <input
                type="text"
                value={cat.categoryName}
                onChange={(e) => updateSkillCategory(cat.id, 'categoryName', e.target.value)}
                className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                placeholder="e.g. Frontend Frameworks"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Skill Tags (Comma-separated)</label>
              <textarea
                value={cat.skills.join(', ')}
                onChange={(e) => updateSkillCategory(cat.id, 'skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                rows={2}
                className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                placeholder="React, Next.js, WebRTC"
              />
            </div>
          </div>
        ))}
        {data.skills.length === 0 && (
          <div className="text-center py-6 text-gray-400 text-xs italic border border-dashed border-white/10 rounded-xl">
            No skills categories listed. Click "Add Category" to begin.
          </div>
        )}
      </div>
    </div>
  );
}

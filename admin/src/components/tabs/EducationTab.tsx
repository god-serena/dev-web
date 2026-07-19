import type { ResumeData, Education, Certification } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface EducationTabProps {
  data: ResumeData;
  addEducation: () => void;
  removeEducation: (id: string) => void;
  updateEducation: (id: string, field: keyof Education, value: any) => void;
  updateField: (section: keyof ResumeData | 'contact', field: string, value: any) => void;
}

export default function EducationTab({
  data,
  addEducation,
  removeEducation,
  updateEducation,
  updateField
}: EducationTabProps) {
  return (
    <div className="space-y-6">
      {/* Education Sub-Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Degrees</h3>
          <button
            type="button"
            onClick={addEducation}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-indigo-700 bg-indigo-600 border border-indigo-500/20 px-3.5 py-2 rounded-lg cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Degree
          </button>
        </div>

        <div className="space-y-4">
          {data.education.map((edu, index) => (
            <div key={edu.id} className="border border-white/5 rounded-xl p-4 bg-slate-900/60 relative group">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="text-[10px] font-mono text-gray-500 font-semibold">Education #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeEducation(edu.id)}
                  className="text-gray-400 hover:text-rose-400 p-1 rounded hover:bg-white/5 cursor-pointer transition-colors"
                  title="Delete education"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">School / University</label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                    placeholder="e.g. UC Berkeley"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Degree & Major</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                    placeholder="e.g. B.S. in Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">School Location</label>
                  <input
                    type="text"
                    value={edu.location}
                    onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                    placeholder="e.g. Berkeley, CA"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Start Date</label>
                    <input
                      type="text"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                      className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                      placeholder="e.g. 2014-09"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">End Date</label>
                    <input
                      type="text"
                      value={edu.endDate}
                      disabled={edu.current}
                      onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                      className={`w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none ${edu.current ? 'opacity-40 cursor-not-allowed' : ''}`}
                      placeholder="e.g. 2018-05"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`curr-edu-${edu.id}`}
                  checked={edu.current}
                  onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                  className="rounded border-white/10 bg-slate-950 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <label htmlFor={`curr-edu-${edu.id}`} className="text-xs font-semibold text-gray-300 select-none cursor-pointer">
                  I am currently studying here
                </label>
              </div>

              <div className="mt-3">
                <label className="block text-xs font-semibold text-gray-300 mb-1">Highlights / Academic Bullets (One per line)</label>
                <textarea
                  value={edu.bulletPoints.join('\n')}
                  onChange={(e) => updateEducation(edu.id, 'bulletPoints', e.target.value.split('\n'))}
                  rows={2}
                  className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none"
                  placeholder="• Graduated with honors..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Sub-Section */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Certifications</h3>
          <button
            type="button"
            onClick={() => {
              const newCert: Certification = {
                id: `cert-${Date.now()}`,
                name: '',
                issuer: '',
                date: ''
              };
              updateField('certifications', 'certifications', [...data.certifications, newCert]);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-indigo-700 bg-indigo-600 border border-indigo-500/20 px-3.5 py-2 rounded-lg cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Cert
          </button>
        </div>

        <div className="space-y-4">
          {data.certifications.map((cert, index) => (
            <div key={cert.id} className="border border-white/5 rounded-xl p-4 bg-slate-900/60 relative group">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="text-[10px] font-mono text-gray-500 font-semibold">Cert #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => updateField('certifications', 'certifications', data.certifications.filter(c => c.id !== cert.id))}
                  className="text-gray-400 hover:text-rose-400 p-1 rounded hover:bg-white/5 cursor-pointer transition-colors"
                  title="Delete certification"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Certification Name</label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => {
                      const updated = data.certifications.map(c => c.id === cert.id ? { ...c, name: e.target.value } : c);
                      updateField('certifications', 'certifications', updated);
                    }}
                    className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                    placeholder="e.g. AWS Solutions Architect"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Issuer</label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => {
                      const updated = data.certifications.map(c => c.id === cert.id ? { ...c, issuer: e.target.value } : c);
                      updateField('certifications', 'certifications', updated);
                    }}
                    className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                    placeholder="e.g. Amazon Web Services"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Issue Date</label>
                  <input
                    type="text"
                    value={cert.date}
                    onChange={(e) => {
                      const updated = data.certifications.map(c => c.id === cert.id ? { ...c, date: e.target.value } : c);
                      updateField('certifications', 'certifications', updated);
                    }}
                    className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                    placeholder="e.g. 2024-05"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Verification URL</label>
                  <input
                    type="text"
                    value={cert.url || ''}
                    onChange={(e) => {
                      const updated = data.certifications.map(c => c.id === cert.id ? { ...c, url: e.target.value } : c);
                      updateField('certifications', 'certifications', updated);
                    }}
                    className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState, type ChangeEvent } from 'react';
import { 
  User, 
  Briefcase, 
  FileText, 
  Search, 
  GraduationCap, 
  RotateCcw, 
  Download, 
  Upload, 
  Settings
} from 'lucide-react';
import type { ResumeData, Experience, Project, SkillCategory, Education } from '../types';

import ProfileTab from './tabs/ProfileTab';
import ExperienceTab from './tabs/ExperienceTab';
import ProjectsTab from './tabs/ProjectsTab';
import SkillsTab from './tabs/SkillsTab';
import EducationTab from './tabs/EducationTab';

interface ResumeEditorProps {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
  onReset: () => void;
  onAvatarUploadSuccess: (newAvatarUrl: string) => void;
}

export default function ResumeEditor({ data, onChange, onReset, onAvatarUploadSuccess }: ResumeEditorProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'experience' | 'projects' | 'skills' | 'education'>('profile');

  // Unified updater
  const updateField = (section: keyof ResumeData | 'contact', field: string, value: any) => {
    if (section === 'contact') {
      onChange({
        ...data,
        contact: {
          ...data.contact,
          [field]: value
        }
      });
    } else {
      onChange({
        ...data,
        [section]: value
      });
    }
  };

  // Helper to trigger JSON export
  const exportToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${data.name.toLowerCase().replace(/\s+/g, '_')}_resume_config.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Helper to trigger JSON import
  const handleJsonImport = (e: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.name && parsed.contact) {
            onChange(parsed);
          } else {
            alert("Invalid JSON format. Please ensure it contains 'name' and 'contact' fields.");
          }
        } catch {
          alert("Error parsing file. Please check that it is a valid JSON file.");
        }
      };
    }
  };

  // --- Dynamic array operations ---

  // Experience
  const addExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ['Accomplished X, measured by Y, by doing Z.'],
      techStack: []
    };
    updateField('experiences', 'experiences', [...data.experiences, newExp]);
  };

  const removeExperience = (id: string) => {
    updateField('experiences', 'experiences', data.experiences.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    const updated = data.experiences.map(exp => {
      if (exp.id === id) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    updateField('experiences', 'experiences', updated);
  };

  // Projects
  const addProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: '',
      role: '',
      description: '',
      highlights: [],
      techStack: [],
      projectType: 1
    };
    updateField('projects', 'projects', [...data.projects, newProj]);
  };

  const removeProject = (id: string) => {
    updateField('projects', 'projects', data.projects.filter(p => p.id !== id));
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    const updated = data.projects.map(p => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    });
    updateField('projects', 'projects', updated);
  };

  // Skills
  const addSkillCategory = () => {
    const newCat: SkillCategory = {
      id: `skill-${Date.now()}`,
      categoryName: 'New Category',
      skills: []
    };
    updateField('skills', 'skills', [...data.skills, newCat]);
  };

  const removeSkillCategory = (id: string) => {
    updateField('skills', 'skills', data.skills.filter(s => s.id !== id));
  };

  const updateSkillCategory = (id: string, field: keyof SkillCategory, value: any) => {
    const updated = data.skills.map(s => {
      if (s.id === id) {
        return { ...s, [field]: value };
      }
      return s;
    });
    updateField('skills', 'skills', updated);
  };

  // Education
  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      school: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bulletPoints: []
    };
    updateField('education', 'education', [...data.education, newEdu]);
  };

  const removeEducation = (id: string) => {
    updateField('education', 'education', data.education.filter(e => e.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    const updated = data.education.map(e => {
      if (e.id === id) {
        return { ...e, [field]: value };
      }
      return e;
    });
    updateField('education', 'education', updated);
  };

  return (
    <div className="bg-[#0F1322] p-6 flex flex-col h-full text-white rounded-2xl border border-white/10">
      
      {/* Editor Header / Save-Load Actions */}
      <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-4 flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <h2 className="text-base font-bold text-white flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-indigo-400 animate-spin [animation-duration:15s]" />
            Portfolio Data Configuration Console
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5 font-light">Updates save directly to PostgreSQL database.</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Export JSON Button */}
          <button
            onClick={exportToJson}
            title="Export config file"
            className="p-2 text-gray-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-lg text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Export Backup</span>
          </button>

          {/* Import JSON Input */}
          <label
            title="Import config file"
            className="p-2 text-gray-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-lg text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Import Restore</span>
            <input 
              type="file" 
              accept=".json" 
              onChange={handleJsonImport} 
              className="hidden" 
            />
          </label>

          {/* Reset button */}
          <button
            onClick={onReset}
            title="Reset to template"
            className="p-2 text-rose-400 hover:text-white bg-rose-950/20 hover:bg-rose-600 border border-rose-900/50 hover:border-rose-600 rounded-lg text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Secondary Category Tabs */}
      <div className="flex border-b border-white/10 overflow-x-auto gap-1 pb-1 scrollbar-none mb-4">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-1.5 text-xs px-3.5 py-2.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'profile'
              ? 'bg-indigo-600/30 text-white font-bold border-b-2 border-indigo-500'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          General Info
        </button>

        <button
          onClick={() => setActiveTab('experience')}
          className={`flex items-center gap-1.5 text-xs px-3.5 py-2.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'experience'
              ? 'bg-indigo-600/30 text-white font-bold border-b-2 border-indigo-500'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Experience ({data.experiences.length})
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-1.5 text-xs px-3.5 py-2.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'projects'
              ? 'bg-indigo-600/30 text-white font-bold border-b-2 border-indigo-500'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Projects ({data.projects.length})
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-1.5 text-xs px-3.5 py-2.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'skills'
              ? 'bg-indigo-600/30 text-white font-bold border-b-2 border-indigo-500'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          Skills ({data.skills.length})
        </button>

        <button
          onClick={() => setActiveTab('education')}
          className={`flex items-center gap-1.5 text-xs px-3.5 py-2.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'education'
              ? 'bg-indigo-600/30 text-white font-bold border-b-2 border-indigo-500'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          Education
        </button>
      </div>

      {/* Editor Panels Container (Scrollable) */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scroll-smooth">
        {activeTab === 'profile' && (
          <ProfileTab 
            data={data} 
            updateField={updateField} 
            onAvatarUploadSuccess={onAvatarUploadSuccess} 
          />
        )}

        {activeTab === 'experience' && (
          <ExperienceTab 
            data={data} 
            addExperience={addExperience} 
            removeExperience={removeExperience} 
            updateExperience={updateExperience} 
            updateField={updateField}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsTab 
            data={data} 
            addProject={addProject} 
            removeProject={removeProject} 
            updateProject={updateProject} 
            updateField={updateField}
          />
        )}

        {activeTab === 'skills' && (
          <SkillsTab 
            data={data} 
            addSkillCategory={addSkillCategory} 
            removeSkillCategory={removeSkillCategory} 
            updateSkillCategory={updateSkillCategory} 
          />
        )}

        {activeTab === 'education' && (
          <EducationTab 
            data={data} 
            addEducation={addEducation} 
            removeEducation={removeEducation} 
            updateEducation={updateEducation} 
            updateField={updateField} 
          />
        )}
      </div>
    </div>
  );
}

import { useState, useRef, type ChangeEvent } from 'react';
import type { ResumeData } from '../../types';
import { resumeApi, resolveApiUrl } from '../../api';
import { Upload, Check } from 'lucide-react';

interface ProfileTabProps {
  data: ResumeData;
  updateField: (section: keyof ResumeData | 'contact', field: string, value: any) => void;
  onAvatarUploadSuccess: (newAvatarUrl: string) => void;
}

export default function ProfileTab({ data, updateField, onAvatarUploadSuccess }: ProfileTabProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadSuccess(false);
    }
  };

  const handleUploadClick = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadSuccess(false);

    try {
      const res = await resumeApi.uploadAvatar(selectedFile);
      if (res.ok) {
        const result = await res.json();
        onAvatarUploadSuccess(result.avatarUrl);
        setCacheBuster(Date.now());
        setUploadSuccess(true);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        alert("Failed to upload avatar image. Ensure backend is running.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend for image upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Primary Info Headers</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => updateField('name', 'name', e.target.value)}
            className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Arjay Dayanan"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Professional Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => updateField('title', 'title', e.target.value)}
            className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Senior Full Stack Engineer"
          />
        </div>
      </div>

      {/* Avatar Photo upload */}
      <div className="pt-2">
        <label className="block text-xs font-semibold text-gray-300 mb-1">Profile Photo Upload</label>
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950 p-4 rounded-xl border border-white/10">
          {/* Avatar preview */}
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/10 bg-slate-900 flex-shrink-0 flex items-center justify-center">
            {data.avatarUrl ? (
              <img src={`${resolveApiUrl(data.avatarUrl)}?t=${cacheBuster}`} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-gray-500 font-mono">No Image</span>
            )}
          </div>

          <div className="flex-1 space-y-2 w-full">
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
                id="avatar-file-input"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold uppercase tracking-widest text-white hover:bg-slate-800 bg-slate-900 border border-white/10 px-3.5 py-2.5 rounded-lg cursor-pointer transition-colors"
              >
                Select Image
              </button>
              <button
                type="button"
                disabled={!selectedFile || uploading}
                onClick={handleUploadClick}
                className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white px-3.5 py-2.5 rounded-lg cursor-pointer transition-colors ${selectedFile
                    ? 'bg-indigo-600 hover:bg-indigo-700 border border-indigo-500/20'
                    : 'bg-indigo-900/30 text-indigo-400 border border-indigo-500/5 cursor-not-allowed'
                  }`}
              >
                <Upload className="w-3.5 h-3.5" />
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>

            <div className="text-[10px] font-mono leading-relaxed text-gray-500">
              {selectedFile ? (
                <span className="text-indigo-400 font-semibold">Selected: {selectedFile.name}</span>
              ) : uploadSuccess ? (
                <span className="text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Uploaded successfully! URL stored in database.</span>
              ) : data.avatarUrl ? (
                <span className="text-gray-400 truncate block max-w-md">Database URL: {data.avatarUrl}</span>
              ) : (
                "Please select an image file to upload as your profile photo."
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-300 mb-1">Profile Summary</label>
        <textarea
          value={data.profileSummary}
          onChange={(e) => updateField('profileSummary', 'profileSummary', e.target.value)}
          rows={4}
          className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed"
          placeholder="A short professional statement describing your focus and qualifications..."
        />
      </div>

      <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest pt-4 border-t border-white/10">Contact & Social Links</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
          <input
            type="email"
            value={data.contact.email}
            onChange={(e) => updateField('contact', 'email', e.target.value)}
            className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="arjaydayanan@gmail.com"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Phone Number</label>
          <input
            type="text"
            value={data.contact.phone}
            onChange={(e) => updateField('contact', 'phone', e.target.value)}
            className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Location</label>
          <input
            type="text"
            value={data.contact.location}
            onChange={(e) => updateField('contact', 'location', e.target.value)}
            className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="San Francisco, CA"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Personal Portfolio URL (optional)</label>
          <input
            type="text"
            value={data.contact.website || ''}
            onChange={(e) => updateField('contact', 'website', e.target.value)}
            className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
            placeholder="arjaydayanan.dev"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">GitHub Username/URL</label>
          <input
            type="text"
            value={data.contact.github || ''}
            onChange={(e) => updateField('contact', 'github', e.target.value)}
            className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
            placeholder="github.com/arjaydayanan"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">LinkedIn URL</label>
          <input
            type="text"
            value={data.contact.linkedin || ''}
            onChange={(e) => updateField('contact', 'linkedin', e.target.value)}
            className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
            placeholder="linkedin.com/in/arjaydayanan"
          />
        </div>
      </div>
    </div>
  );
}

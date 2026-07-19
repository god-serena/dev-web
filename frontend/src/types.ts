export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  github?: string;
  linkedin?: string;
  website?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
  techStack: string[];
  order?: number;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  description: string;
  highlights: string[];
  techStack: string[];
  url?: string;
  githubUrl?: string;
  projectType?: number;
  order?: number;
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  skills: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bulletPoints: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface ResumeData {
  name: string;
  title: string;
  profileSummary: string;
  avatarUrl?: string;
  contact: ContactInfo;
  experiences: Experience[];
  projects: Project[];
  skills: SkillCategory[];
  education: Education[];
  certifications: Certification[];
}

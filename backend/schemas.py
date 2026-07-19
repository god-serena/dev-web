from pydantic import BaseModel
from typing import List, Optional

class ContactInfo(BaseModel):
    email: str
    phone: str
    location: str
    github: Optional[str] = None
    linkedin: Optional[str] = None
    website: Optional[str] = None

class Experience(BaseModel):
    id: str
    company: str
    role: str
    location: str
    startDate: str
    endDate: str
    current: bool
    description: List[str]
    techStack: List[str]
    order: Optional[int] = None

class Project(BaseModel):
    id: str
    name: str
    role: str
    description: str
    highlights: List[str]
    techStack: List[str]
    url: Optional[str] = None
    githubUrl: Optional[str] = None
    projectType: int = 1
    order: Optional[int] = None

class SkillCategory(BaseModel):
    id: str
    categoryName: str
    skills: List[str]

class Education(BaseModel):
    id: str
    school: str
    degree: str
    fieldOfStudy: str
    location: str
    startDate: str
    endDate: str
    current: bool
    bulletPoints: List[str]

class Certification(BaseModel):
    id: str
    name: str
    issuer: str
    date: str
    url: Optional[str] = None

class ResumeData(BaseModel):
    name: str
    title: str
    profileSummary: str
    avatarUrl: Optional[str] = ""
    contact: ContactInfo
    experiences: List[Experience]
    projects: List[Project]
    skills: List[SkillCategory]
    education: List[Education]
    certifications: List[Certification]

class LoginRequest(BaseModel):
    password: str

class LoginResponse(BaseModel):
    token: str

class ResumeDataPatch(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    profileSummary: Optional[str] = None
    avatarUrl: Optional[str] = None
    contact: Optional[dict] = None
    experiences: Optional[List[dict]] = None
    projects: Optional[List[dict]] = None
    skills: Optional[List[dict]] = None
    education: Optional[List[dict]] = None
    certifications: Optional[List[dict]] = None


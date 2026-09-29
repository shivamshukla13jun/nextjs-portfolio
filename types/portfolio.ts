// Portfolio Types

export type SkillCategory =
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'DevOps'
  | 'Cloud'
  | 'Messaging'
  | 'Tools'
  | 'Messaging & Caching'
  | 'DevOps & Cloud'
  | 'Tools & Architecture';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number; // 1-100
  yearsOfExperience?: number;
  iconName?: string;
  featured?: boolean;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  companyLogo?: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Remote';
  achievements?: string[];
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  detailedDescription: string;
  problem?: string;
  solution?: string;
  features: string[];
  responsibilities: string[];
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  images: string[];
  architectureDiagram?: string;
  architectureTree?: string;
  flow?: string[];
  challenges?: string[];
  results?: string[];
  startDate?: string;
  endDate?: string;
  featured: boolean;
  category?: string;
}

export interface Education {
  id: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate: string;
  grade?: string;
  description?: string;
  activities?: string | string[];
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization?: string;
  issuer?: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  deliverables?: string[];
  features?: string[];
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  category?: string;
  coverImage?: string;
  published: boolean;
  publishedAt: string;
  readTimeMinutes?: number;
  readingTime?: string;
}

export interface Profile {
  name: string;
  professionalTitle: string;
  email: string;
  phone?: string;
  location: string;
  profileImage?: string;
  shortBio: string;
  longBio: string;
  github: string;
  linkedin: string;
  twitter?: string;
  website?: string;
  yearsOfExperience: number;
  availability: 'Available' | 'Open to Offers' | 'Busy' | 'Available for Hire';
  headlineTags?: string[];
  resumeFileId?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface SiteSettings {
  siteTitle: string;
  metaDescription: string;
  primaryColor?: string;
  analyticsEnabled?: boolean;
  allowPublicResumeDownload?: boolean;
  enableBlog?: boolean;
  enableServices?: boolean;
  enableCertifications?: boolean;
  heroHeadline?: string;
  heroSubheadline?: string;
}

export interface FileRecord {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  category: 'profile' | 'project' | 'resume' | 'certificate' | 'logo' | 'general' | 'other';
  ownerId?: string;
  relatedEntity?: string;
  relatedEntityId?: string;
  uploadedAt: string;
  url?: string;
}

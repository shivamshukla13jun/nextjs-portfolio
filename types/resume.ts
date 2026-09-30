// Comprehensive Resume types for DevFolio & Resume Architect Pro

export type ResumeTemplateId =
  | 'modern'
  | 'ats'
  | 'minimal'
  | 'two-column'
  | 'executive'
  | 'creative'
  | 'compact'
  | 'classic';

export interface ResumeSettings {
  template: ResumeTemplateId;
  fontFamily?: 'Inter' | 'Roboto' | 'Merriweather' | 'JetBrains Mono' | 'Georgia';
  fontSize?: 'sm' | 'base' | 'lg' | 'normal' | 'compact' | 'large';
  accentColor?: string;
  spacing?: 'compact' | 'normal' | 'spacious' | 'tight' | 'relaxed';
  pageSize?: 'A4' | 'Letter';
  margins?: string | 'narrow' | 'normal' | 'wide';
}

export interface ResumeWorkItem {
  id?: string;
  /** ObjectId of the source Experience model this item was imported from. */
  sourceId?: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  bulletPoints: string[];
  technologies?: string[];
}

export interface ResumeProjectItem {
  id?: string;
  /** ObjectId of the source Project model this item was imported from. */
  sourceId?: string;
  name: string;
  description?: string;
  technologies: string[];
  link?: string;
  bulletPoints: string[];
  role?: string;
  startDate?: string;
  endDate?: string;
}

export interface ResumeEducationItem {
  id?: string;
  /** ObjectId of the source Education model this item was imported from. */
  sourceId?: string;
  degree: string;
  institution: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  year?: string;
  grade?: string;
  details?: string[];
  fieldOfStudy?: string;
  honors?: string;
}

export interface ResumeCertificationItem {
  id?: string;
  /** ObjectId of the source Certification model this item was imported from. */
  sourceId?: string;
  name: string;
  issuer: string;
  year?: string;
}

export interface ResumeSkillGroup {
  category: string;
  skills: string[];
  /** ObjectIds of the Skill models backing this group (when imported from portfolio data). */
  sourceIds?: string[];
}

export interface Resume {
  id: string;
  title: string;
  slug?: string;
  targetRole?: string;
  isDefault?: boolean;
  personalInfo: {
    fullName: string;
    professionalTitle: string;
    email: string;
    phone?: string;
    location: string;
    website?: string;
    github?: string;
    linkedin?: string;
    summary: string;
  };
  skills?: ResumeSkillGroup[];
  technicalSkills?: ResumeSkillGroup[];
  workExperiences: ResumeWorkItem[];
  projects: ResumeProjectItem[];
  education: ResumeEducationItem[];
  certifications?: ResumeCertificationItem[];
  languages?: any[];
  customSections?: any[];
  sectionOrder?: any[];
  settings: ResumeSettings;
  createdAt?: string;
  updatedAt?: string;
}

export interface ATSAnalysisResult {
  score: number; // 0-100
  targetRole?: string;
  summaryFeedback?: string;
  strengths?: string[];
  missingKeywords?: string[];
  formattingSuggestions?: string[];
  impactRecommendations?: string[];
  matchingKeywords?: string[];
  improvements?: string[];
  verdict?: string;
}

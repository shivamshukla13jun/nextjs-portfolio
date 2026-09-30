import type { Resume, ResumeWorkItem, ResumeProjectItem, ResumeEducationItem, ResumeSkillGroup, ResumeCertificationItem } from '@/types/resume';
import type { Experience, Project, Education, Skill, Certification, Profile } from '@/types/portfolio';

/** Get a value from an object by dot path ("workExperiences.0.position"). */
export function getAtPath(obj: any, path: string): any {
  return path.split('.').reduce((cur, key) => (cur == null ? cur : cur[key]), obj);
}

/** Immutably set a value by dot path (numeric segments index into arrays). */
export function setAtPath<T>(obj: T, path: string, value: any): T {
  const clone: any = structuredClone(obj);
  const keys = path.split('.');
  let cur = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
  return clone;
}

// ---- Portfolio model -> Resume item converters ----

export function experienceToResume(e: Experience): ResumeWorkItem {
  return {
    id: e.id,
    sourceId: e.id,
    company: e.company,
    position: e.position,
    location: e.location,
    startDate: e.startDate,
    endDate: e.endDate,
    current: e.current,
    // Responsibilities + measured achievements; description only when neither exists
    bulletPoints: (() => {
      const pts = [...(e.responsibilities || []), ...(e.achievements || [])].filter(Boolean);
      return pts.length > 0 ? pts : e.description ? [e.description] : [];
    })(),
    technologies: e.technologies || [],
  };
}

export function projectToResume(p: Project): ResumeProjectItem {
  return {
    id: p.id,
    sourceId: p.id,
    name: p.name,
    description: p.shortDescription,
    technologies: p.technologies || [],
    link: p.liveUrl || p.githubUrl,
    bulletPoints:
      p.features && p.features.length > 0 ? p.features.slice(0, 5) : p.shortDescription ? [p.shortDescription] : [],
  };
}

export function educationToResume(e: Education): ResumeEducationItem {
  return {
    id: e.id,
    sourceId: e.id,
    degree: e.degree,
    institution: e.institution,
    fieldOfStudy: e.fieldOfStudy,
    location: e.location,
    startDate: e.startDate,
    endDate: e.endDate,
    grade: e.grade,
  };
}

export function skillsToResumeGroups(skills: Skill[]): ResumeSkillGroup[] {
  const groups = new Map<string, { names: string[]; ids: string[] }>();
  for (const s of skills) {
    const cat = s.category || 'General';
    if (!groups.has(cat)) groups.set(cat, { names: [], ids: [] });
    const g = groups.get(cat)!;
    g.names.push(s.name);
    if (s.id) g.ids.push(s.id);
  }
  return Array.from(groups.entries()).map(([category, g]) => ({
    category,
    skills: g.names,
    sourceIds: g.ids.length === g.names.length ? g.ids : undefined,
  }));
}

export function certificationToResume(c: Certification): ResumeCertificationItem {
  return {
    id: c.id,
    sourceId: c.id,
    name: c.name,
    issuer: c.issuer || c.issuingOrganization || '',
    year: c.issueDate,
  };
}

/** Convert a Profile document into a resume personalInfo block. */
export function profileToPersonalInfo(p: Profile) {
  return {
    fullName: p.name || '',
    professionalTitle: p.professionalTitle || '',
    email: p.email || '',
    phone: p.phone,
    location: p.location || '',
    website: p.website,
    github: p.github,
    linkedin: p.linkedin,
    summary: p.longBio || p.shortBio || '',
  };
}

/** Build a fresh Resume populated entirely from the portfolio data models. */
export function buildResumeFromPortfolio(input: {
  profile?: Profile | null;
  experiences: Experience[];
  projects: Project[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  title?: string;
}): Resume {
  const p = input.profile;
  return {
    id: '',
    title: input.title || `${p?.name || 'My'} — Resume`,
    isDefault: false,
    personalInfo: p
      ? profileToPersonalInfo(p)
      : { fullName: '', professionalTitle: '', email: '', location: '', summary: '' },
    workExperiences: input.experiences.map(experienceToResume),
    projects: input.projects.slice(0, 6).map(projectToResume),
    education: input.education.map(educationToResume),
    certifications: input.certifications.map(certificationToResume),
    skills: skillsToResumeGroups(input.skills),
    settings: { template: 'modern', accentColor: '#2563eb', fontFamily: 'Inter', fontSize: 'base', spacing: 'normal' },
  };
}

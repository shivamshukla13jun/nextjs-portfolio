import {
  SEED_PROFILE,
  SEED_SKILLS,
  SEED_EXPERIENCES,
  SEED_PROJECTS,
  SEED_EDUCATION,
  SEED_CERTIFICATIONS,
  SEED_SERVICES,
  SEED_BLOGS,
  SEED_SETTINGS,
} from './seed-data.ts';
import bcrypt from 'bcryptjs';
import type {
  Profile,
  Skill,
  Experience,
  Project,
  Education,
  Certification,
  Service,
  Blog,
  ContactMessage,
  SiteSettings,
  FileRecord,
} from '../../types/portfolio.ts';
import type { AIGenerationRecord } from '../../types/ai.ts';

export interface StoredFile extends FileRecord {
  buffer: Buffer;
}

export class MemoryStore {
  profile: Profile = { ...SEED_PROFILE };
  skills: Skill[] = [...SEED_SKILLS];
  experiences: Experience[] = [...SEED_EXPERIENCES];
  projects: Project[] = [...SEED_PROJECTS];
  education: Education[] = [...SEED_EDUCATION];
  certifications: Certification[] = [...SEED_CERTIFICATIONS];
  services: Service[] = [...SEED_SERVICES];
  blogs: Blog[] = [...SEED_BLOGS];
  settings: SiteSettings = { ...SEED_SETTINGS };
  contactMessages: ContactMessage[] = [
    {
      id: 'msg-1',
      name: 'Sarah Jenkins',
      email: 's.jenkins@techrecruiter.io',
      subject: 'Staff Architect role at Series D FinTech',
      message:
        'Hi Shivam, loved your article on GridFS streaming and distributed backpressure. Would love to discuss a Staff Architecture position leading our real-time core platform.',
      read: false,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
  ];
  files = new Map<string, { id: string; meta: FileRecord; buffer: Buffer }>();
  aiGenerations: AIGenerationRecord[] = [];
  adminUser = {
    id: 'usr-admin-1',
    email: process.env.ADMIN_EMAIL || 'shivamshukla13jun@gmail.com',
    name: process.env.ADMIN_NAME || 'Shivam Shukla (Admin)',
    passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin12345', 10),
    role: 'ADMIN',
  };
  analytics = {
    pageViews: 1248,
    resumeDownloads: 342,
    projectClicks: 890,
  };
}

export const memoryStore = new MemoryStore();

export const MemoryRepository = {
  // Profile
  async getProfile(): Promise<Profile> {
    return memoryStore.profile;
  },
  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    memoryStore.profile = { ...memoryStore.profile, ...data };
    return memoryStore.profile;
  },

  // Skills
  async getSkills(): Promise<Skill[]> {
    return memoryStore.skills;
  },
  async addSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
    const newSkill: Skill = { ...skill, id: `sk-${Date.now()}` };
    memoryStore.skills.unshift(newSkill);
    return newSkill;
  },
  async updateSkill(id: string, data: Partial<Skill>): Promise<Skill | null> {
    const idx = memoryStore.skills.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    memoryStore.skills[idx] = { ...memoryStore.skills[idx], ...data };
    return memoryStore.skills[idx];
  },
  async deleteSkill(id: string): Promise<boolean> {
    const len = memoryStore.skills.length;
    memoryStore.skills = memoryStore.skills.filter((s) => s.id !== id);
    return memoryStore.skills.length < len;
  },

  // Experiences
  async getExperiences(): Promise<Experience[]> {
    return memoryStore.experiences;
  },
  async addExperience(exp: Omit<Experience, 'id'>): Promise<Experience> {
    const newExp: Experience = { ...exp, id: `exp-${Date.now()}` };
    memoryStore.experiences.unshift(newExp);
    return newExp;
  },
  async updateExperience(id: string, data: Partial<Experience>): Promise<Experience | null> {
    const idx = memoryStore.experiences.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    memoryStore.experiences[idx] = { ...memoryStore.experiences[idx], ...data };
    return memoryStore.experiences[idx];
  },
  async deleteExperience(id: string): Promise<boolean> {
    const len = memoryStore.experiences.length;
    memoryStore.experiences = memoryStore.experiences.filter((e) => e.id !== id);
    return memoryStore.experiences.length < len;
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    return memoryStore.projects;
  },
  async getProjectBySlug(slug: string): Promise<Project | null> {
    return memoryStore.projects.find((p) => p.slug === slug || p.id === slug) || null;
  },
  async addProject(proj: Omit<Project, 'id'>): Promise<Project> {
    const newProj: Project = { ...proj, id: `proj-${Date.now()}` };
    memoryStore.projects.unshift(newProj);
    return newProj;
  },
  async updateProject(idOrSlug: string, data: Partial<Project>): Promise<Project | null> {
    const idx = memoryStore.projects.findIndex((p) => p.id === idOrSlug || p.slug === idOrSlug);
    if (idx === -1) return null;
    memoryStore.projects[idx] = { ...memoryStore.projects[idx], ...data };
    return memoryStore.projects[idx];
  },
  async deleteProject(idOrSlug: string): Promise<boolean> {
    const len = memoryStore.projects.length;
    memoryStore.projects = memoryStore.projects.filter((p) => p.id !== idOrSlug && p.slug !== idOrSlug);
    return memoryStore.projects.length < len;
  },

  // Education
  async getEducation(): Promise<Education[]> {
    return memoryStore.education;
  },
  async addEducation(edu: Omit<Education, 'id'>): Promise<Education> {
    const newEdu: Education = { ...edu, id: `edu-${Date.now()}` };
    memoryStore.education.unshift(newEdu);
    return newEdu;
  },
  async updateEducation(id: string, data: Partial<Education>): Promise<Education | null> {
    const idx = memoryStore.education.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    memoryStore.education[idx] = { ...memoryStore.education[idx], ...data };
    return memoryStore.education[idx];
  },
  async deleteEducation(id: string): Promise<boolean> {
    const len = memoryStore.education.length;
    memoryStore.education = memoryStore.education.filter((e) => e.id !== id);
    return memoryStore.education.length < len;
  },

  // Certifications
  async getCertifications(): Promise<Certification[]> {
    return memoryStore.certifications;
  },
  async addCertification(cert: Omit<Certification, 'id'>): Promise<Certification> {
    const newCert: Certification = { ...cert, id: `cert-${Date.now()}` };
    memoryStore.certifications.unshift(newCert);
    return newCert;
  },
  async updateCertification(id: string, data: Partial<Certification>): Promise<Certification | null> {
    const idx = memoryStore.certifications.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    memoryStore.certifications[idx] = { ...memoryStore.certifications[idx], ...data };
    return memoryStore.certifications[idx];
  },
  async deleteCertification(id: string): Promise<boolean> {
    const len = memoryStore.certifications.length;
    memoryStore.certifications = memoryStore.certifications.filter((c) => c.id !== id);
    return memoryStore.certifications.length < len;
  },

  // Services
  async getServices(): Promise<Service[]> {
    return memoryStore.services;
  },
  async addService(service: Omit<Service, 'id'>): Promise<Service> {
    const newSrv: Service = { ...service, id: `srv-${Date.now()}` };
    memoryStore.services.push(newSrv);
    return newSrv;
  },
  async updateService(id: string, data: Partial<Service>): Promise<Service | null> {
    const idx = memoryStore.services.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    memoryStore.services[idx] = { ...memoryStore.services[idx], ...data };
    return memoryStore.services[idx];
  },
  async deleteService(id: string): Promise<boolean> {
    const len = memoryStore.services.length;
    memoryStore.services = memoryStore.services.filter((s) => s.id !== id);
    return memoryStore.services.length < len;
  },

  // Blogs
  async getBlogs(publishedOnly = true): Promise<Blog[]> {
    if (!publishedOnly) return memoryStore.blogs;
    return memoryStore.blogs.filter((b) => b.published);
  },
  async getBlogBySlug(slug: string): Promise<Blog | null> {
    return memoryStore.blogs.find((b) => b.slug === slug || b.id === slug) || null;
  },
  async addBlog(blog: Omit<Blog, 'id'>): Promise<Blog> {
    const newBlog: Blog = { ...blog, id: `blg-${Date.now()}` };
    memoryStore.blogs.unshift(newBlog);
    return newBlog;
  },
  async updateBlog(idOrSlug: string, data: Partial<Blog>): Promise<Blog | null> {
    const idx = memoryStore.blogs.findIndex((b) => b.id === idOrSlug || b.slug === idOrSlug);
    if (idx === -1) return null;
    memoryStore.blogs[idx] = { ...memoryStore.blogs[idx], ...data };
    return memoryStore.blogs[idx];
  },
  async deleteBlog(idOrSlug: string): Promise<boolean> {
    const len = memoryStore.blogs.length;
    memoryStore.blogs = memoryStore.blogs.filter((b) => b.id !== idOrSlug && b.slug !== idOrSlug);
    return memoryStore.blogs.length < len;
  },

  // Settings
  async getSettings(): Promise<SiteSettings> {
    return memoryStore.settings;
  },
  async updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    memoryStore.settings = { ...memoryStore.settings, ...data };
    return memoryStore.settings;
  },

  // Contact Messages
  async getContactMessages(): Promise<ContactMessage[]> {
    return memoryStore.contactMessages;
  },
  async addContactMessage(msg: Omit<ContactMessage, 'id' | 'read' | 'createdAt'>): Promise<ContactMessage> {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    memoryStore.contactMessages.unshift(newMsg);
    return newMsg;
  },
  async markMessageRead(id: string, read = true): Promise<boolean> {
    const msg = memoryStore.contactMessages.find((m) => m.id === id);
    if (!msg) return false;
    msg.read = read;
    return true;
  },
  async deleteContactMessage(id: string): Promise<boolean> {
    const len = memoryStore.contactMessages.length;
    memoryStore.contactMessages = memoryStore.contactMessages.filter((m) => m.id !== id);
    return memoryStore.contactMessages.length < len;
  },

  // Files
  async getFiles(): Promise<FileRecord[]> {
    return Array.from(memoryStore.files.values()).map((f) => f.meta);
  },

  // AI Generations
  async recordAIGeneration(gen: Omit<AIGenerationRecord, 'id' | 'createdAt'>): Promise<AIGenerationRecord> {
    const record: AIGenerationRecord = {
      ...gen,
      id: `ai-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    memoryStore.aiGenerations.unshift(record);
    return record;
  },
  async getAIGenerations(): Promise<AIGenerationRecord[]> {
    return memoryStore.aiGenerations;
  },
  async updateAIGenerationStatus(id: string, status: 'applied' | 'discarded'): Promise<boolean> {
    const rec = memoryStore.aiGenerations.find((g) => g.id === id);
    if (!rec) return false;
    rec.status = status;
    return true;
  },

  // Analytics
  async recordAnalytics(type: 'pageview' | 'resume_download' | 'project_click', path?: string): Promise<void> {
    if (type === 'pageview') memoryStore.analytics.pageViews++;
    if (type === 'resume_download') memoryStore.analytics.resumeDownloads++;
    if (type === 'project_click') memoryStore.analytics.projectClicks++;
  },
  async getAnalyticsSummary() {
    return {
      ...memoryStore.analytics,
      totalProjects: memoryStore.projects.length,
      totalSkills: memoryStore.skills.length,
      totalExperiences: memoryStore.experiences.length,
      totalBlogs: memoryStore.blogs.length,
      unreadMessages: memoryStore.contactMessages.filter((m) => !m.read).length,
    };
  },
};

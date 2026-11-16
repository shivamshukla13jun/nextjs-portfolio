import mongoose from 'mongoose';
import { connectToDatabase, isDatabaseConnected } from '../../lib/db/mongodb.ts';
import { MemoryRepository, memoryStore } from '../../lib/db/memory-fallback.ts';
import {
  ProfileModel,
  SkillModel,
  ExperienceModel,
  ProjectModel,
  EducationModel,
  CertificationModel,
  ServiceModel,
  BlogModel,
  ContactMessageModel,
  SiteSettingsModel,
  FileRecordModel,
  AIGenerationModel,
  AnalyticsCounterModel,
} from '../models/all-models.ts';
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
} from '../../lib/db/seed-data.ts';
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

// Match by slug always, by _id only when the value is a valid ObjectId (avoids Mongoose CastError)
function slugOrIdFilter(idOrSlug: string) {
  const or: Record<string, string>[] = [{ slug: idOrSlug }];
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) or.push({ _id: idOrSlug });
  return { $or: or };
}

function isObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Convert a lean Mongoose document into the API shape: `_id` -> `id`, ISO timestamps, no `__v`
function toPlain<T>(doc: any): T {
  const { _id, __v, createdAt, updatedAt, ...rest } = doc;
  return {
    ...rest,
    id: _id.toString(),
    ...(createdAt && { createdAt: new Date(createdAt).toISOString() }),
    ...(updatedAt && { updatedAt: new Date(updatedAt).toISOString() }),
  } as T;
}

function stripId<T extends { id?: string }>(data: T): Omit<T, 'id'> {
  const { id, ...rest } = data;
  return rest;
}

// Run against MongoDB when connected; otherwise (or on a DB error) use the in-memory store
async function withDb<T>(label: string, dbFn: () => Promise<T>, memFn: () => Promise<T>): Promise<T> {
  await connectToDatabase();
  if (isDatabaseConnected()) {
    try {
      return await dbFn();
    } catch (err) {
      console.warn(`Mongoose ${label} failed, fallback to memory`, err);
    }
  }
  return memFn();
}

// Populate an empty collection with the seed content once, so the DB becomes the source of truth
const seeded = new Map<string, Promise<void>>();
function seedOnce(model: any, docs: any[]): Promise<void> {
  const name = model.modelName as string;
  if (!seeded.has(name)) {
    const p = (async () => {
      if ((await model.estimatedDocumentCount()) === 0 && docs.length > 0) {
        await model.insertMany(docs.map((d) => stripId(d)));
      }
    })().catch((err) => {
      seeded.delete(name);
      throw err;
    });
    seeded.set(name, p);
  }
  return seeded.get(name)!;
}

// Generic CRUD for collections that use plain ObjectId ids
function crud<T extends { id: string }>(model: any, seed: T[], sort: Record<string, 1 | -1> = { createdAt: 1 }) {
  return {
    async list(): Promise<T[]> {
      await seedOnce(model, seed);
      const docs = await model.find().sort(sort).lean();
      return docs.map((d: any) => toPlain<T>(d));
    },
    async add(data: Omit<T, 'id'>): Promise<T> {
      const created = await model.create(stripId(data as any));
      return toPlain<T>(created.toObject());
    },
    async update(id: string, data: Partial<T>): Promise<T | null> {
      if (!isObjectId(id)) return null;
      const updated = await model.findByIdAndUpdate(id, { $set: stripId(data as any) }, { new: true }).lean();
      return updated ? toPlain<T>(updated) : null;
    },
    async remove(id: string): Promise<boolean> {
      if (!isObjectId(id)) return false;
      return !!(await model.findByIdAndDelete(id));
    },
  };
}

const educationDb = crud<Education>(EducationModel, SEED_EDUCATION);
const certificationsDb = crud<Certification>(CertificationModel, SEED_CERTIFICATIONS);
const servicesDb = crud<Service>(ServiceModel, SEED_SERVICES);

const ANALYTICS_KEY = 'global';

export const PortfolioRepository = {
  // Profile
  async getProfile(): Promise<Profile> {
    await connectToDatabase();
    if (isDatabaseConnected()) {
      try {
        await seedOnce(ProfileModel, [SEED_PROFILE]);
        const doc = await ProfileModel.findOne().lean();
        if (doc) {
          const { _id, __v, ...rest } = doc as any;
          return rest as Profile;
        }
      } catch (err) {
        console.warn('Mongoose getProfile failed, fallback to memory', err);
      }
    }
    return MemoryRepository.getProfile();
  },

  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    await connectToDatabase();
    if (isDatabaseConnected()) {
      try {
        const updated = await ProfileModel.findOneAndUpdate({}, { $set: data }, { new: true, upsert: true }).lean();
        const { _id, __v, ...rest } = updated as any;
        return rest as Profile;
      } catch (err) {
        console.warn('Mongoose updateProfile failed, fallback to memory', err);
      }
    }
    return MemoryRepository.updateProfile(data);
  },

  // Skills
  async getSkills(): Promise<Skill[]> {
    await connectToDatabase();
    if (isDatabaseConnected()) {
      try {
        await seedOnce(SkillModel, SEED_SKILLS);
        const docs = await SkillModel.find().lean();
        if (docs && docs.length > 0) {
          return docs.map((d: any) => ({
            id: d._id.toString(),
            name: d.name,
            category: d.category,
            proficiency: d.proficiency,
            yearsOfExperience: d.yearsOfExperience,
            iconName: d.iconName,
            featured: d.featured,
          }));
        }
      } catch (err) {
        console.warn('Mongoose getSkills failed, fallback to memory', err);
      }
    }
    return MemoryRepository.getSkills();
  },

  async addSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
    await connectToDatabase();
    if (isDatabaseConnected()) {
      try {
        const created = await SkillModel.create(skill);
        return {
          id: created._id.toString(),
          name: created.name,
          category: created.category,
          proficiency: created.proficiency,
          yearsOfExperience: created.yearsOfExperience,
          iconName: created.iconName,
          featured: created.featured,
        };
      } catch (err) {
        console.warn('Mongoose addSkill fallback to memory', err);
      }
    }
    return MemoryRepository.addSkill(skill);
  },

  async updateSkill(id: string, data: Partial<Skill>): Promise<Skill | null> {
    await connectToDatabase();
    if (isDatabaseConnected()) {
      try {
        const updated = await SkillModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
        if (updated) {
          const d: any = updated;
          return {
            id: d._id.toString(),
            name: d.name,
            category: d.category,
            proficiency: d.proficiency,
            yearsOfExperience: d.yearsOfExperience,
            iconName: d.iconName,
            featured: d.featured,
          };
        }
      } catch (err) {
        console.warn('Mongoose updateSkill fallback to memory', err);
      }
    }
    return MemoryRepository.updateSkill(id, data);
  },

  async deleteSkill(id: string): Promise<boolean> {
    await connectToDatabase();
    if (isDatabaseConnected()) {
      try {
        const res = await SkillModel.findByIdAndDelete(id);
        if (res) return true;
      } catch (err) {
        console.warn('Mongoose deleteSkill fallback to memory', err);
      }
    }
    return MemoryRepository.deleteSkill(id);
  },

  // Experiences
  async getExperiences(): Promise<Experience[]> {
    await connectToDatabase();
    if (isDatabaseConnected()) {
      try {
        await seedOnce(ExperienceModel, SEED_EXPERIENCES);
        const docs = await ExperienceModel.find().sort({ startDate: -1 }).lean();
        if (docs && docs.length > 0) {
          return docs.map((d: any) => ({
            id: d._id.toString(),
            company: d.company,
            position: d.position,
            startDate: d.startDate,
            endDate: d.endDate,
            current: d.current,
            description: d.description,
            responsibilities: d.responsibilities || [],
            technologies: d.technologies || [],
            companyLogo: d.companyLogo,
            location: d.location,
            employmentType: d.employmentType,
            achievements: d.achievements || [],
          }));
        }
      } catch (err) {
        console.warn('Mongoose getExperiences fallback to memory', err);
      }
    }
    return MemoryRepository.getExperiences();
  },

  async addExperience(exp: Omit<Experience, 'id'>): Promise<Experience> {
    await connectToDatabase();
    if (isDatabaseConnected()) {
      try {
        const created = await ExperienceModel.create(exp);
        return {
          id: created._id.toString(),
          company: created.company,
          position: created.position,
          startDate: created.startDate,
          endDate: created.endDate,
          current: created.current,
          description: created.description,
          responsibilities: created.responsibilities,
          technologies: created.technologies,
          companyLogo: created.companyLogo,
          location: created.location,
          employmentType: created.employmentType,
          achievements: created.achievements,
        };
      } catch (err) {
        console.warn('Mongoose addExperience fallback to memory', err);
      }
    }
    return MemoryRepository.addExperience(exp);
  },

  async updateExperience(id: string, data: Partial<Experience>): Promise<Experience | null> {
    await connectToDatabase();
    if (isDatabaseConnected()) {
      try {
        const updated = await ExperienceModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
        if (updated) {
          const d: any = updated;
          return {
            id: d._id.toString(),
            company: d.company,
            position: d.position,
            startDate: d.startDate,
            endDate: d.endDate,
            current: d.current,
            description: d.description,
            responsibilities: d.responsibilities,
            technologies: d.technologies,
            companyLogo: d.companyLogo,
            location: d.location,
            employmentType: d.employmentType,
            achievements: d.achievements,
          };
        }
      } catch (err) {
        console.warn('Mongoose updateExperience fallback to memory', err);
      }
    }
    return MemoryRepository.updateExperience(id, data);
  },

  async deleteExperience(id: string): Promise<boolean> {
    await connectToDatabase();
    if (isDatabaseConnected()) {
      try {
        const res = await ExperienceModel.findByIdAndDelete(id);
        if (res) return true;
      } catch (err) {
        console.warn('Mongoose deleteExperience fallback', err);
      }
    }
    return MemoryRepository.deleteExperience(id);
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    await connectToDatabase();
    if (isDatabaseConnected()) {
      try {
        await seedOnce(ProjectModel, SEED_PROJECTS);
        const docs = await ProjectModel.find().lean();
        if (docs && docs.length > 0) {
          return docs.map((d: any) => ({
            id: d._id.toString(),
            name: d.name,
            slug: d.slug,
            shortDescription: d.shortDescription,
            detailedDescription: d.detailedDescription,
            problem: d.problem,
            solution: d.solution,
            features: d.features || [],
            responsibilities: d.responsibilities || [],
            technologies: d.technologies || [],
            githubUrl: d.githubUrl,
            liveUrl: d.liveUrl,
            images: d.images || [],
            architectureDiagram: d.architectureDiagram,
            architectureTree: d.architectureTree,
            flow: d.flow || [],
            challenges: d.challenges || [],
            results: d.results || [],
            startDate: d.startDate,
            endDate: d.endDate,
            featured: d.featured,
            category: d.category,
          }));
        }
      } catch (err) {
        console.warn('Mongoose getProjects fallback', err);
      }
    }
    return MemoryRepository.getProjects();
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    await connectToDatabase();
    if (isDatabaseConnected()) {
      try {
        const doc = await ProjectModel.findOne(slugOrIdFilter(slug)).lean();
        if (doc) {
          const d: any = doc;
          return {
            id: d._id.toString(),
            name: d.name,
            slug: d.slug,
            shortDescription: d.shortDescription,
            detailedDescription: d.detailedDescription,
            problem: d.problem,
            solution: d.solution,
            features: d.features || [],
            responsibilities: d.responsibilities || [],
            technologies: d.technologies || [],
            githubUrl: d.githubUrl,
            liveUrl: d.liveUrl,
            images: d.images || [],
            architectureDiagram: d.architectureDiagram,
            architectureTree: d.architectureTree,
            flow: d.flow || [],
            challenges: d.challenges || [],
            results: d.results || [],
            startDate: d.startDate,
            endDate: d.endDate,
            featured: d.featured,
            category: d.category,
          };
        }
      } catch (err) {
        console.warn('Mongoose getProjectBySlug fallback', err);
      }
    }
    return MemoryRepository.getProjectBySlug(slug);
  },

  async addProject(proj: Omit<Project, 'id'>): Promise<Project> {
    await connectToDatabase();
    if (isDatabaseConnected()) {
      try {
        const created = await ProjectModel.create(proj);
        return {
          id: created._id.toString(),
          name: created.name,
          slug: created.slug,
          shortDescription: created.shortDescription,
          detailedDescription: created.detailedDescription,
          problem: created.problem,
          solution: created.solution,
          features: created.features,
          responsibilities: created.responsibilities,
          technologies: created.technologies,
          githubUrl: created.githubUrl,
          liveUrl: created.liveUrl,
          images: created.images,
          architectureDiagram: created.architectureDiagram,
          architectureTree: created.architectureTree,
          flow: created.flow,
          challenges: created.challenges,
          results: created.results,
          startDate: created.startDate,
          endDate: created.endDate,
          featured: created.featured,
          category: created.category,
        };
      } catch (err) {
        console.warn('Mongoose addProject fallback', err);
      }
    }
    return MemoryRepository.addProject(proj);
  },

  async updateProject(idOrSlug: string, data: Partial<Project>): Promise<Project | null> {
    await connectToDatabase();
    if (isDatabaseConnected()) {
      try {
        const updated = await ProjectModel.findOneAndUpdate(
          slugOrIdFilter(idOrSlug),
          { $set: data },
          { new: true }
        ).lean();
        if (updated) {
          const d: any = updated;
          return {
            id: d._id.toString(),
            name: d.name,
            slug: d.slug,
            shortDescription: d.shortDescription,
            detailedDescription: d.detailedDescription,
            problem: d.problem,
            solution: d.solution,
            features: d.features,
            responsibilities: d.responsibilities,
            technologies: d.technologies,
            githubUrl: d.githubUrl,
            liveUrl: d.liveUrl,
            images: d.images,
            architectureDiagram: d.architectureDiagram,
            architectureTree: d.architectureTree,
            flow: d.flow,
            challenges: d.challenges,
            results: d.results,
            startDate: d.startDate,
            endDate: d.endDate,
            featured: d.featured,
            category: d.category,
          };
        }
      } catch (err) {
        console.warn('Mongoose updateProject fallback', err);
      }
    }
    return MemoryRepository.updateProject(idOrSlug, data);
  },

  async deleteProject(idOrSlug: string): Promise<boolean> {
    await connectToDatabase();
    if (isDatabaseConnected()) {
      try {
        const res = await ProjectModel.findOneAndDelete(slugOrIdFilter(idOrSlug));
        if (res) return true;
      } catch (err) {
        console.warn('Mongoose deleteProject fallback', err);
      }
    }
    return MemoryRepository.deleteProject(idOrSlug);
  },

  // Education
  async getEducation(): Promise<Education[]> {
    return withDb('getEducation', () => educationDb.list(), () => MemoryRepository.getEducation());
  },
  async addEducation(edu: Omit<Education, 'id'>): Promise<Education> {
    return withDb('addEducation', () => educationDb.add(edu), () => MemoryRepository.addEducation(edu));
  },
  async updateEducation(id: string, data: Partial<Education>): Promise<Education | null> {
    return withDb('updateEducation', () => educationDb.update(id, data), () => MemoryRepository.updateEducation(id, data));
  },
  async deleteEducation(id: string): Promise<boolean> {
    return withDb('deleteEducation', () => educationDb.remove(id), () => MemoryRepository.deleteEducation(id));
  },

  // Certifications
  async getCertifications(): Promise<Certification[]> {
    return withDb('getCertifications', () => certificationsDb.list(), () => MemoryRepository.getCertifications());
  },
  async addCertification(cert: Omit<Certification, 'id'>): Promise<Certification> {
    return withDb('addCertification', () => certificationsDb.add(cert), () => MemoryRepository.addCertification(cert));
  },
  async updateCertification(id: string, data: Partial<Certification>): Promise<Certification | null> {
    return withDb(
      'updateCertification',
      () => certificationsDb.update(id, data),
      () => MemoryRepository.updateCertification(id, data)
    );
  },
  async deleteCertification(id: string): Promise<boolean> {
    return withDb('deleteCertification', () => certificationsDb.remove(id), () => MemoryRepository.deleteCertification(id));
  },

  // Services
  async getServices(): Promise<Service[]> {
    return withDb('getServices', () => servicesDb.list(), () => MemoryRepository.getServices());
  },
  async addService(service: Omit<Service, 'id'>): Promise<Service> {
    return withDb('addService', () => servicesDb.add(service), () => MemoryRepository.addService(service));
  },
  async updateService(id: string, data: Partial<Service>): Promise<Service | null> {
    return withDb('updateService', () => servicesDb.update(id, data), () => MemoryRepository.updateService(id, data));
  },
  async deleteService(id: string): Promise<boolean> {
    return withDb('deleteService', () => servicesDb.remove(id), () => MemoryRepository.deleteService(id));
  },

  // Blogs
  async getBlogs(publishedOnly = true): Promise<Blog[]> {
    return withDb(
      'getBlogs',
      async () => {
        await seedOnce(BlogModel, SEED_BLOGS);
        const docs = await BlogModel.find(publishedOnly ? { published: true } : {})
          .sort({ publishedAt: -1 })
          .lean();
        return docs.map((d: any) => toPlain<Blog>(d));
      },
      () => MemoryRepository.getBlogs(publishedOnly)
    );
  },
  async getBlogBySlug(slug: string): Promise<Blog | null> {
    return withDb(
      'getBlogBySlug',
      async () => {
        await seedOnce(BlogModel, SEED_BLOGS);
        const doc = await BlogModel.findOne(slugOrIdFilter(slug)).lean();
        return doc ? toPlain<Blog>(doc) : null;
      },
      () => MemoryRepository.getBlogBySlug(slug)
    );
  },
  async addBlog(blog: Omit<Blog, 'id'>): Promise<Blog> {
    return withDb(
      'addBlog',
      async () => toPlain<Blog>((await BlogModel.create(stripId(blog as Blog))).toObject()),
      () => MemoryRepository.addBlog(blog)
    );
  },
  async updateBlog(idOrSlug: string, data: Partial<Blog>): Promise<Blog | null> {
    return withDb(
      'updateBlog',
      async () => {
        const updated = await BlogModel.findOneAndUpdate(
          slugOrIdFilter(idOrSlug),
          { $set: stripId(data) },
          { new: true }
        ).lean();
        return updated ? toPlain<Blog>(updated) : null;
      },
      () => MemoryRepository.updateBlog(idOrSlug, data)
    );
  },
  async deleteBlog(idOrSlug: string): Promise<boolean> {
    return withDb(
      'deleteBlog',
      async () => !!(await BlogModel.findOneAndDelete(slugOrIdFilter(idOrSlug))),
      () => MemoryRepository.deleteBlog(idOrSlug)
    );
  },

  // Settings
  async getSettings(): Promise<SiteSettings> {
    return withDb(
      'getSettings',
      async () => {
        const doc = await SiteSettingsModel.findOne().lean();
        if (!doc) return MemoryRepository.getSettings();
        const { id, createdAt, updatedAt, ...rest } = toPlain<SiteSettings & { id: string; createdAt?: string; updatedAt?: string }>(doc);
        return { ...SEED_SETTINGS, ...rest };
      },
      () => MemoryRepository.getSettings()
    );
  },
  async updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    return withDb(
      'updateSettings',
      async () => {
        const { id, _id, createdAt, updatedAt, ...clean } = data as any;
        const existing = await SiteSettingsModel.findOne().lean();
        const updated = await SiteSettingsModel.findOneAndUpdate(
          {},
          // First save starts from the current seed settings so nothing is lost
          { $set: existing ? clean : { ...SEED_SETTINGS, ...clean } },
          { new: true, upsert: true }
        ).lean();
        const { id: _i, createdAt: _c, updatedAt: _u, ...rest } = toPlain<any>(updated);
        return { ...SEED_SETTINGS, ...rest } as SiteSettings;
      },
      () => MemoryRepository.updateSettings(data)
    );
  },

  // Contact
  async getContactMessages(): Promise<ContactMessage[]> {
    return withDb(
      'getContactMessages',
      async () => {
        const docs = await ContactMessageModel.find().sort({ createdAt: -1 }).lean();
        return docs.map((d: any) => toPlain<ContactMessage>(d));
      },
      () => MemoryRepository.getContactMessages()
    );
  },
  async addContactMessage(msg: Omit<ContactMessage, 'id' | 'read' | 'createdAt'>): Promise<ContactMessage> {
    const { name, email, subject, message } = msg;
    return withDb(
      'addContactMessage',
      async () => toPlain<ContactMessage>((await ContactMessageModel.create({ name, email, subject, message })).toObject()),
      () => MemoryRepository.addContactMessage({ name, email, subject, message })
    );
  },
  async markMessageRead(id: string, read = true): Promise<boolean> {
    return withDb(
      'markMessageRead',
      async () => isObjectId(id) && !!(await ContactMessageModel.findByIdAndUpdate(id, { $set: { read } })),
      () => MemoryRepository.markMessageRead(id, read)
    );
  },
  async deleteContactMessage(id: string): Promise<boolean> {
    return withDb(
      'deleteContactMessage',
      async () => isObjectId(id) && !!(await ContactMessageModel.findByIdAndDelete(id)),
      () => MemoryRepository.deleteContactMessage(id)
    );
  },

  // Files
  async getFiles(): Promise<FileRecord[]> {
    return withDb(
      'getFiles',
      async () => {
        const docs = await FileRecordModel.find().sort({ createdAt: -1 }).lean();
        return docs.map((d: any): FileRecord => ({
          id: d.fileId,
          filename: d.filename,
          originalName: d.originalName,
          mimeType: d.mimeType,
          size: d.size,
          category: d.category,
          ownerId: d.ownerId,
          relatedEntity: d.relatedEntity,
          relatedEntityId: d.relatedEntityId,
          uploadedAt: new Date(d.createdAt).toISOString(),
          url: `/api/files/${d.fileId}`,
        }));
      },
      () => MemoryRepository.getFiles()
    );
  },

  // AI
  async recordAIGeneration(gen: Omit<AIGenerationRecord, 'id' | 'createdAt'>): Promise<AIGenerationRecord> {
    return withDb(
      'recordAIGeneration',
      async () => toPlain<AIGenerationRecord>((await AIGenerationModel.create(gen)).toObject()),
      () => MemoryRepository.recordAIGeneration(gen)
    );
  },
  async getAIGenerations(): Promise<AIGenerationRecord[]> {
    return withDb(
      'getAIGenerations',
      async () => {
        const docs = await AIGenerationModel.find().sort({ createdAt: -1 }).limit(200).lean();
        return docs.map((d: any) => toPlain<AIGenerationRecord>(d));
      },
      () => MemoryRepository.getAIGenerations()
    );
  },
  async updateAIGenerationStatus(id: string, status: 'applied' | 'discarded'): Promise<boolean> {
    return withDb(
      'updateAIGenerationStatus',
      async () => isObjectId(id) && !!(await AIGenerationModel.findByIdAndUpdate(id, { $set: { status } })),
      () => MemoryRepository.updateAIGenerationStatus(id, status)
    );
  },

  // Analytics
  async recordAnalytics(type: 'pageview' | 'resume_download' | 'project_click', path?: string): Promise<void> {
    const field = { pageview: 'pageViews', resume_download: 'resumeDownloads', project_click: 'projectClicks' }[type];
    if (!field) return;
    return withDb(
      'recordAnalytics',
      async () => {
        await AnalyticsCounterModel.updateOne({ key: ANALYTICS_KEY }, { $inc: { [field]: 1 } }, { upsert: true });
      },
      () => MemoryRepository.recordAnalytics(type, path)
    );
  },
  async getAnalyticsSummary() {
    await connectToDatabase();
    if (isDatabaseConnected()) {
      try {
        const [counters, projects, skills, experiences, blogs, unreadMessages] = await Promise.all([
          AnalyticsCounterModel.findOne({ key: ANALYTICS_KEY }).lean() as Promise<any>,
          PortfolioRepository.getProjects(),
          PortfolioRepository.getSkills(),
          PortfolioRepository.getExperiences(),
          PortfolioRepository.getBlogs(false),
          ContactMessageModel.countDocuments({ read: false }),
        ]);
        return {
          pageViews: counters?.pageViews || 0,
          resumeDownloads: counters?.resumeDownloads || 0,
          projectClicks: counters?.projectClicks || 0,
          totalProjects: projects.length,
          totalSkills: skills.length,
          totalExperiences: experiences.length,
          totalBlogs: blogs.length,
          unreadMessages,
        };
      } catch (err) {
        console.warn('Mongoose getAnalyticsSummary fallback', err);
      }
    }
    return MemoryRepository.getAnalyticsSummary();
  },
};

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
  ResumeModel,
  FileRecordModel,
  AIGenerationModel,
} from '../models/all-models.ts';
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
import type { Resume } from '../../types/resume.ts';
import type { AIGenerationRecord } from '../../types/ai.ts';

// Match by slug always, by _id only when the value is a valid ObjectId (avoids Mongoose CastError)
function slugOrIdFilter(idOrSlug: string) {
  const or: Record<string, string>[] = [{ slug: idOrSlug }];
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) or.push({ _id: idOrSlug });
  return { $or: or };
}

export const PortfolioRepository = {
  // Profile
  async getProfile(): Promise<Profile> {
    await connectToDatabase();
    if (isDatabaseConnected()) {
      try {
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
    return MemoryRepository.getEducation();
  },
  async addEducation(edu: Omit<Education, 'id'>): Promise<Education> {
    return MemoryRepository.addEducation(edu);
  },
  async updateEducation(id: string, data: Partial<Education>): Promise<Education | null> {
    return MemoryRepository.updateEducation(id, data);
  },
  async deleteEducation(id: string): Promise<boolean> {
    return MemoryRepository.deleteEducation(id);
  },

  // Certifications
  async getCertifications(): Promise<Certification[]> {
    return MemoryRepository.getCertifications();
  },
  async addCertification(cert: Omit<Certification, 'id'>): Promise<Certification> {
    return MemoryRepository.addCertification(cert);
  },
  async updateCertification(id: string, data: Partial<Certification>): Promise<Certification | null> {
    return MemoryRepository.updateCertification(id, data);
  },
  async deleteCertification(id: string): Promise<boolean> {
    return MemoryRepository.deleteCertification(id);
  },

  // Services
  async getServices(): Promise<Service[]> {
    return MemoryRepository.getServices();
  },
  async addService(service: Omit<Service, 'id'>): Promise<Service> {
    return MemoryRepository.addService(service);
  },
  async updateService(id: string, data: Partial<Service>): Promise<Service | null> {
    return MemoryRepository.updateService(id, data);
  },
  async deleteService(id: string): Promise<boolean> {
    return MemoryRepository.deleteService(id);
  },

  // Blogs
  async getBlogs(publishedOnly = true): Promise<Blog[]> {
    return MemoryRepository.getBlogs(publishedOnly);
  },
  async getBlogBySlug(slug: string): Promise<Blog | null> {
    return MemoryRepository.getBlogBySlug(slug);
  },
  async addBlog(blog: Omit<Blog, 'id'>): Promise<Blog> {
    return MemoryRepository.addBlog(blog);
  },
  async updateBlog(idOrSlug: string, data: Partial<Blog>): Promise<Blog | null> {
    return MemoryRepository.updateBlog(idOrSlug, data);
  },
  async deleteBlog(idOrSlug: string): Promise<boolean> {
    return MemoryRepository.deleteBlog(idOrSlug);
  },

  // Resumes
  async getResumes(): Promise<Resume[]> {
    return MemoryRepository.getResumes();
  },
  async getResumeById(id: string): Promise<Resume | null> {
    return MemoryRepository.getResumeById(id);
  },
  async saveResume(resume: Partial<Resume> & { id?: string }): Promise<Resume> {
    return MemoryRepository.saveResume(resume);
  },
  async deleteResume(id: string): Promise<boolean> {
    return MemoryRepository.deleteResume(id);
  },

  // Settings
  async getSettings(): Promise<SiteSettings> {
    return MemoryRepository.getSettings();
  },
  async updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    return MemoryRepository.updateSettings(data);
  },

  // Contact
  async getContactMessages(): Promise<ContactMessage[]> {
    return MemoryRepository.getContactMessages();
  },
  async addContactMessage(msg: Omit<ContactMessage, 'id' | 'read' | 'createdAt'>): Promise<ContactMessage> {
    return MemoryRepository.addContactMessage(msg);
  },
  async markMessageRead(id: string, read = true): Promise<boolean> {
    return MemoryRepository.markMessageRead(id, read);
  },
  async deleteContactMessage(id: string): Promise<boolean> {
    return MemoryRepository.deleteContactMessage(id);
  },

  // Files
  async getFiles(): Promise<FileRecord[]> {
    return MemoryRepository.getFiles();
  },

  // AI
  async recordAIGeneration(gen: Omit<AIGenerationRecord, 'id' | 'createdAt'>): Promise<AIGenerationRecord> {
    return MemoryRepository.recordAIGeneration(gen);
  },
  async getAIGenerations(): Promise<AIGenerationRecord[]> {
    return MemoryRepository.getAIGenerations();
  },
  async updateAIGenerationStatus(id: string, status: 'applied' | 'discarded'): Promise<boolean> {
    return MemoryRepository.updateAIGenerationStatus(id, status);
  },

  // Analytics
  async recordAnalytics(type: 'pageview' | 'resume_download' | 'project_click', path?: string): Promise<void> {
    return MemoryRepository.recordAnalytics(type, path);
  },
  async getAnalyticsSummary() {
    return MemoryRepository.getAnalyticsSummary();
  },
};

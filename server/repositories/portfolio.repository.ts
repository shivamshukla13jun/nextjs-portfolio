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
  SEED_RESUME,
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
import type { Resume } from '../../types/resume.ts';
import type { AIGenerationRecord } from '../../types/ai.ts';
import {
  experienceToResume,
  projectToResume,
  educationToResume,
  certificationToResume,
  profileToPersonalInfo,
} from '../../lib/resume-utils.ts';

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

// ---- Resume <-> model reference bridge -----------------------------------
// Each resume item slot stores one of three shapes:
//   bare ObjectId           -> live link to the model document (auto-syncs)
//   { ref: ObjectId, ... }  -> linked item carrying resume-specific overrides
//   plain embedded object   -> custom item with no model counterpart
// hydration expands refs into the shapes the frontend expects; dehydration
// collapses untouched imported items back into bare ObjectIds.

const asObjectId = (v: any): string | null => {
  if (v instanceof mongoose.Types.ObjectId) return v.toString();
  if (typeof v === 'string' && mongoose.Types.ObjectId.isValid(v)) return v;
  return null;
};

// Key-order-independent equality for "did the user customize this item?"
const stable = (v: any): any =>
  Array.isArray(v)
    ? v.map(stable)
    : v && typeof v === 'object'
      ? Object.keys(v).sort().reduce((o: any, k) => ((o[k] = stable(v[k])), o), {})
      : v;
const sameData = (a: any, b: any) => JSON.stringify(stable(a)) === JSON.stringify(stable(b));

const META_KEYS = new Set(['id', 'sourceId', 'sourceIds', 'ref', '_id', 'createdAt', 'updatedAt', '__v']);

// Split a resume item into { overrides, customized } against its source conversion.
function diffAgainstSource(item: Record<string, any>, src: Record<string, any>) {
  const overrides: Record<string, any> = {};
  let customized = false;
  for (const [k, v] of Object.entries(item)) {
    if (META_KEYS.has(k)) continue;
    overrides[k] = v;
    if (!(k in src) || !sameData(v, src[k])) customized = true;
  }
  // Fields removed in the resume are stored as explicit nulls so the populated value doesn't resurface
  for (const k of Object.keys(src)) {
    if (!META_KEYS.has(k) && !(k in item) && src[k] != null && src[k] !== '') {
      overrides[k] = null;
      customized = true;
    }
  }
  return { overrides, customized };
}

const natKey = (o: any, fields: string[]) => fields.map((f) => String(o?.[f] ?? '')).join('||');

// matchFields lets imported/seeded items link to a model doc by natural identity
// (e.g. company+position) even when they carry no valid ObjectId sourceId.
async function dehydrateItems(items: any[] | undefined, model: any, convert: (d: any) => any, matchFields: string[] = []) {
  if (!Array.isArray(items)) return items;
  const ids = items
    .map((i) => asObjectId(i) || (i && typeof i === 'object' ? asObjectId(i.sourceId) || asObjectId(i.id) : null))
    .filter(Boolean) as string[];
  const sources = new Map<string, any>(); // objectId -> converted
  const natural = new Map<string, { id: string; conv: any }>(); // 'nat:<key>' -> source
  if (ids.length) {
    const docs = await model.find({ _id: { $in: ids } }).lean();
    for (const d of docs) sources.set(String((d as any)._id), convert(toPlain(d)));
  }
  const unlinked = items.filter(
    (i) =>
      i && typeof i === 'object' && !asObjectId(i) &&
      !(asObjectId(i.sourceId) || asObjectId(i.id)) &&
      matchFields.every((f) => i[f] != null && i[f] !== '')
  );
  if (matchFields.length && unlinked.length) {
    const docs = await model
      .find({ $or: unlinked.map((i) => Object.fromEntries(matchFields.map((f) => [f, i[f]]))) })
      .lean();
    for (const d of docs) {
      const conv = convert(toPlain(d));
      natural.set(`nat:${natKey(d, matchFields)}`, { id: String((d as any)._id), conv });
    }
  }
  return items.map((item) => {
    const bare = asObjectId(item);
    if (bare) return new mongoose.Types.ObjectId(bare);
    if (!item || typeof item !== 'object') return item;
    let srcId = asObjectId(item.sourceId) || asObjectId(item.id);
    let src = srcId ? sources.get(srcId) : undefined;
    if (!src && matchFields.length) {
      const hit = natural.get(`nat:${natKey(item, matchFields)}`);
      if (hit) {
        srcId = hit.id;
        src = hit.conv;
      }
    }
    if (!srcId || !src) {
      const { ref, ...embedded } = item;
      return embedded; // custom item — store embedded (drop any stale ref)
    }
    const { overrides, customized } = diffAgainstSource(item, src);
    if (!customized) return new mongoose.Types.ObjectId(srcId);
    return { ref: new mongoose.Types.ObjectId(srcId), ...overrides };
  });
}

async function hydrateItems(items: any[] | undefined, model: any, convert: (d: any) => any) {
  if (!Array.isArray(items)) return items;
  const needed = new Set<string>();
  for (const item of items) {
    const oid = asObjectId(item) || (item && typeof item === 'object' ? asObjectId(item.ref) : null);
    if (oid) needed.add(oid);
  }
  const byId = new Map<string, any>();
  if (needed.size) {
    const docs = await model.find({ _id: { $in: [...needed] } }).lean();
    for (const d of docs) byId.set(String((d as any)._id), convert(toPlain(d)));
  }
  const out: any[] = [];
  for (const item of items) {
    const bare = asObjectId(item);
    if (bare) {
      const resolved = byId.get(bare);
      if (resolved) out.push({ ...resolved, id: resolved.id ?? bare, sourceId: bare });
      continue; // source deleted -> item dropped
    }
    const refId = item && typeof item === 'object' ? asObjectId(item.ref) : null;
    if (refId) {
      const { ref, ...snapshot } = item;
      const base = byId.get(refId) || {};
      out.push({ ...base, ...snapshot, id: snapshot.id ?? refId, sourceId: refId });
      continue;
    }
    out.push(item);
  }
  return out;
}

// Converters receive already-plain docs (callers apply toPlain first)
const toResumeExperience = (d: any) => experienceToResume(d as Experience);
const toResumeProject = (d: any) => projectToResume(d as Project);
const toResumeEducation = (d: any) => educationToResume(d as Education);
const toResumeCertification = (d: any) => certificationToResume(d as Certification);

// Skills round-trip as flat per-skill entries (ObjectId -> Skill or {ref,name,category})
// and are grouped back into { category, skills[] } on read.
function mergeSkillGroups(entries: { category: string; skills: string[]; sourceIds?: string[] }[]) {
  const order: string[] = [];
  const byCat = new Map<string, { category: string; skills: string[]; sourceIds: string[] }>();
  for (const e of entries) {
    const cat = e.category || 'General';
    if (!byCat.has(cat)) {
      byCat.set(cat, { category: cat, skills: [], sourceIds: [] });
      order.push(cat);
    }
    const g = byCat.get(cat)!;
    for (const s of e.skills) if (!g.skills.includes(s)) g.skills.push(s);
    if (e.sourceIds) g.sourceIds.push(...e.sourceIds);
  }
  return order.map((c) => {
    const g = byCat.get(c)!;
    return { category: g.category, skills: g.skills, ...(g.sourceIds.length === g.skills.length && g.sourceIds.length ? { sourceIds: g.sourceIds } : {}) };
  });
}

async function dehydrateSkills(groups: any[] | undefined) {
  if (!Array.isArray(groups)) return groups;
  const skillIds: string[] = [];
  const skillNames: string[] = [];
  for (const g of groups) {
    if (!g || typeof g !== 'object') continue;
    if (g?.sourceIds) for (const s of g.sourceIds) { const o = asObjectId(s); if (o) skillIds.push(o); }
    if (Array.isArray(g.skills)) for (const n of g.skills) skillNames.push(String(n));
  }
  const sources = new Map<string, any>();
  const byName = new Map<string, { id: string; conv: any }>();
  if (skillIds.length || skillNames.length) {
    const docs = await SkillModel.find({
      $or: [
        ...(skillIds.length ? [{ _id: { $in: skillIds } }] : []),
        ...(skillNames.length ? [{ name: { $in: [...new Set(skillNames)] } }] : []),
      ],
    }).lean();
    for (const d of docs) {
      const conv = toPlain<Skill>(d);
      const id = String((d as any)._id);
      sources.set(id, conv);
      byName.set(`${(d as any).category}||${(d as any).name}`, { id, conv });
    }
  }
  const out: any[] = [];
  for (const g of groups) {
    if (!g || typeof g !== 'object') { out.push(g); continue; }
    let { category, skills, sourceIds } = g;
    const hasValidIds =
      Array.isArray(sourceIds) &&
      Array.isArray(skills) &&
      sourceIds.length === skills.length &&
      sourceIds.every((s: string) => sources.has(asObjectId(s) || ''));
    // Fall back to matching by name+category when ids are absent or don't resolve (e.g. seed ids)
    if (!hasValidIds && Array.isArray(skills)) {
      const resolved = skills.map((n: string) => byName.get(`${category}||${n}`)?.id);
      if (resolved.every(Boolean)) sourceIds = resolved;
    }
    const canLink = hasValidIds ||
      (Array.isArray(sourceIds) && Array.isArray(skills) && sourceIds.length === skills.length && sourceIds.every((s: string) => sources.has(asObjectId(s) || '')));
    if (!canLink) {
      const { sourceIds: _drop, ref: _r, ...embedded } = g;
      out.push(embedded);
      continue;
    }
    skills.forEach((name: string, i: number) => {
      const src = sources.get(asObjectId(sourceIds[i])!)!;
      if (src.name === name && src.category === category) out.push(new mongoose.Types.ObjectId(sourceIds[i]));
      else out.push({ ref: new mongoose.Types.ObjectId(sourceIds[i]), name, category });
    });
  }
  return out;
}

async function hydrateSkills(entries: any[] | undefined) {
  if (!Array.isArray(entries)) return entries;
  const needed = new Set<string>();
  for (const e of entries) {
    const oid = asObjectId(e) || (e && typeof e === 'object' ? asObjectId(e.ref) : null);
    if (oid) needed.add(oid);
  }
  const byId = new Map<string, any>();
  if (needed.size) {
    const docs = await SkillModel.find({ _id: { $in: [...needed] } }).lean();
    for (const d of docs) byId.set(String((d as any)._id), toPlain<Skill>(d));
  }
  const singles: { category: string; skills: string[]; sourceIds?: string[] }[] = [];
  for (const e of entries) {
    const bare = asObjectId(e);
    if (bare) {
      const s = byId.get(bare);
      if (s) singles.push({ category: s.category, skills: [s.name], sourceIds: [bare] });
      continue;
    }
    const refId = e && typeof e === 'object' ? asObjectId(e.ref) : null;
    if (refId) {
      const s = byId.get(refId);
      singles.push({ category: e.category || s?.category || 'General', skills: [e.name ?? s?.name].filter(Boolean) as string[], sourceIds: [refId] });
      continue;
    }
    if (e && typeof e === 'object' && Array.isArray(e.skills)) singles.push(e);
  }
  return mergeSkillGroups(singles);
}

async function dehydratePersonalInfo(info: any) {
  const bare = asObjectId(info);
  if (bare) return new mongoose.Types.ObjectId(bare);
  if (!info || typeof info !== 'object') return info;
  const profile = await ProfileModel.findOne().lean();
  if (!profile) {
    const { ref, ...embedded } = info;
    return embedded;
  }
  const pid = String((profile as any)._id);
  const src = profileToPersonalInfo(toPlain<Profile>(profile));
  const { overrides, customized } = diffAgainstSource(info, src);
  if (!customized) return new mongoose.Types.ObjectId(pid);
  return { ref: new mongoose.Types.ObjectId(pid), ...overrides };
}

async function hydratePersonalInfo(info: any) {
  const bare = asObjectId(info);
  if (bare) {
    const p = await ProfileModel.findById(bare).lean();
    if (p) return { ...profileToPersonalInfo(toPlain<Profile>(p)), sourceId: bare };
    return {};
  }
  if (info && typeof info === 'object') {
    const refId = asObjectId(info.ref);
    const { ref, ...snapshot } = info;
    if (!refId) return snapshot;
    const p = await ProfileModel.findById(refId).lean();
    const base = p ? profileToPersonalInfo(toPlain<Profile>(p)) : {};
    return { ...base, ...snapshot, sourceId: refId };
  }
  return info;
}

async function hydrateResumeDoc(doc: any): Promise<Resume> {
  const skills = await hydrateSkills(doc.skills?.length ? doc.skills : doc.technicalSkills);
  return {
    ...toPlain<Resume>(doc),
    personalInfo: await hydratePersonalInfo(doc.personalInfo),
    workExperiences: (await hydrateItems(doc.workExperiences, ExperienceModel, toResumeExperience)) || [],
    projects: (await hydrateItems(doc.projects, ProjectModel, toResumeProject)) || [],
    education: (await hydrateItems(doc.education, EducationModel, toResumeEducation)) || [],
    certifications: (await hydrateItems(doc.certifications, CertificationModel, toResumeCertification)) || [],
    skills,
    technicalSkills: skills,
  } as Resume;
}

export async function dehydrateResume(data: Partial<Resume>) {
  const [personalInfo, workExperiences, projects, education, certifications, skills] = await Promise.all([
    dehydratePersonalInfo(data.personalInfo),
    dehydrateItems(data.workExperiences, ExperienceModel, toResumeExperience, ['company', 'position']),
    dehydrateItems(data.projects, ProjectModel, toResumeProject, ['name']),
    dehydrateItems(data.education, EducationModel, toResumeEducation, ['degree', 'institution']),
    dehydrateItems(data.certifications, CertificationModel, toResumeCertification, ['name']),
    dehydrateSkills(data.skills ?? data.technicalSkills),
  ]);
  return { ...data, personalInfo, workExperiences, projects, education, certifications, skills, technicalSkills: skills };
}

// Seed the default resume dehydrated — its items link to the seeded model docs
// via natural-key matching, so even the seed lands in strict ref form.
function seedResumeOnce(): Promise<void> {
  const name = 'Resume';
  if (!seeded.has(name)) {
    const p = (async () => {
      if ((await ResumeModel.estimatedDocumentCount()) === 0) {
        await Promise.all([
          seedOnce(ProfileModel, [SEED_PROFILE]),
          seedOnce(SkillModel, SEED_SKILLS),
          seedOnce(ExperienceModel, SEED_EXPERIENCES),
          seedOnce(ProjectModel, SEED_PROJECTS),
          seedOnce(EducationModel, SEED_EDUCATION),
          seedOnce(CertificationModel, SEED_CERTIFICATIONS),
        ]);
        await ResumeModel.create(await dehydrateResume(stripId(SEED_RESUME) as Resume));
      }
    })().catch((err) => {
      seeded.delete(name);
      throw err;
    });
    seeded.set(name, p);
  }
  return seeded.get(name)!;
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

  // Resumes
  async getResumes(): Promise<Resume[]> {
    return withDb(
      'getResumes',
      async () => {
        await seedResumeOnce();
        const docs = await ResumeModel.find().sort({ updatedAt: -1 }).lean();
        return Promise.all(docs.map((d: any) => hydrateResumeDoc(d)));
      },
      () => MemoryRepository.getResumes()
    );
  },
  async getResumeById(id: string): Promise<Resume | null> {
    return withDb(
      'getResumeById',
      async () => {
        await seedResumeOnce();
        const doc = await ResumeModel.findOne(slugOrIdFilter(id)).lean();
        return doc ? hydrateResumeDoc(doc) : null;
      },
      () => MemoryRepository.getResumeById(id)
    );
  },
  async saveResume(resume: Partial<Resume> & { id?: string }): Promise<Resume> {
    return withDb(
      'saveResume',
      async () => {
        const { createdAt, updatedAt, ...data } = stripId(resume) as Partial<Resume>;
        const stored = await dehydrateResume(data);
        if (resume.id && isObjectId(resume.id)) {
          const updated = await ResumeModel.findByIdAndUpdate(resume.id, { $set: stored }, { new: true }).lean();
          if (updated) return hydrateResumeDoc(updated);
        }
        return hydrateResumeDoc((await ResumeModel.create(stored)).toObject());
      },
      () => MemoryRepository.saveResume(resume)
    );
  },
  async deleteResume(id: string): Promise<boolean> {
    return withDb(
      'deleteResume',
      async () => isObjectId(id) && !!(await ResumeModel.findByIdAndDelete(id)),
      () => MemoryRepository.deleteResume(id)
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
        const [counters, projects, skills, experiences, blogs, resumes, unreadMessages] = await Promise.all([
          AnalyticsCounterModel.findOne({ key: ANALYTICS_KEY }).lean() as Promise<any>,
          PortfolioRepository.getProjects(),
          PortfolioRepository.getSkills(),
          PortfolioRepository.getExperiences(),
          PortfolioRepository.getBlogs(false),
          PortfolioRepository.getResumes(),
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
          resumeVersionsCount: resumes.length,
        };
      } catch (err) {
        console.warn('Mongoose getAnalyticsSummary fallback', err);
      }
    }
    return MemoryRepository.getAnalyticsSummary();
  },
};

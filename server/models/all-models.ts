import mongoose, { Schema } from 'mongoose';

// User Schema
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['ADMIN', 'USER'], default: 'ADMIN' },
  },
  { timestamps: true }
);

// Profile Schema
const ProfileSchema = new Schema(
  {
    name: { type: String, required: true },
    professionalTitle: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    shortBio: { type: String, default: '' },
    longBio: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    website: { type: String, default: '' },
    yearsOfExperience: { type: Number, default: 0 },
    availability: { type: String, default: 'Available for Hire' },
    resumeFileId: { type: String, default: '' },
  },
  { timestamps: true }
);

// Skill Schema
const SkillSchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'Database', 'DevOps & Cloud', 'Messaging & Caching', 'Tools & Architecture'],
      required: true,
      index: true,
    },
    proficiency: { type: Number, min: 1, max: 100, default: 80 },
    yearsOfExperience: { type: Number, default: 1 },
    featured: { type: Boolean, default: false, index: true },
    iconName: { type: String, default: '' },
  },
  { timestamps: true }
);

// Experience Schema
const ExperienceSchema = new Schema(
  {
    company: { type: String, required: true },
    position: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, default: 'Present' },
    current: { type: Boolean, default: false },
    location: { type: String, default: '' },
    employmentType: { type: String, default: 'Full-time' },
    description: { type: String, default: '' },
    responsibilities: [{ type: String }],
    technologies: [{ type: String }],
    achievements: [{ type: String }],
    companyLogo: { type: String, default: '' },
  },
  { timestamps: true }
);

// Project Schema
const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    shortDescription: { type: String, required: true },
    detailedDescription: { type: String, default: '' },
    problem: { type: String, default: '' },
    solution: { type: String, default: '' },
    features: [{ type: String }],
    responsibilities: [{ type: String }],
    technologies: [{ type: String, index: true }],
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    images: [{ type: String }],
    architectureDiagram: { type: String, default: '' },
    architectureTree: { type: String, default: '' },
    flow: [{ type: String }],
    challenges: [{ type: String }],
    results: [{ type: String }],
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    featured: { type: Boolean, default: false, index: true },
    category: { type: String, default: '' },
  },
  { timestamps: true }
);

// Resume Schema
const ResumeSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    targetRole: { type: String, default: '' },
    isDefault: { type: Boolean, default: false },
    personalInfo: {
      fullName: String,
      professionalTitle: String,
      email: String,
      phone: String,
      location: String,
      website: String,
      linkedin: String,
      github: String,
      summary: String,
    },
    workExperiences: [Schema.Types.Mixed],
    projects: [Schema.Types.Mixed],
    education: [Schema.Types.Mixed],
    skills: [Schema.Types.Mixed],
    certifications: [Schema.Types.Mixed],
    languages: [Schema.Types.Mixed],
    customSections: [Schema.Types.Mixed],
    settings: {
      template: { type: String, default: 'modern' },
      fontFamily: { type: String, default: 'Inter' },
      fontSize: { type: String, default: 'normal' },
      accentColor: { type: String, default: '#2563eb' },
      spacing: { type: String, default: 'normal' },
      pageSize: { type: String, default: 'A4' },
      margins: { type: String, default: 'normal' },
    },
  },
  { timestamps: true }
);

// Contact Message Schema
const ContactMessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Education Schema
const EducationSchema = new Schema(
  {
    degree: { type: String, required: true },
    fieldOfStudy: { type: String, required: true },
    institution: { type: String, required: true },
    location: { type: String },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    grade: { type: String },
    description: { type: String },
    activities: [{ type: String }],
  },
  { timestamps: true }
);

// Certification Schema
const CertificationSchema = new Schema(
  {
    name: { type: String, required: true },
    issuingOrganization: { type: String },
    issuer: { type: String },
    issueDate: { type: String, required: true },
    expirationDate: { type: String },
    credentialId: { type: String },
    credentialUrl: { type: String },
  },
  { timestamps: true }
);

// Service Schema
const ServiceSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    iconName: { type: String },
    deliverables: [{ type: String }],
    features: [{ type: String }],
  },
  { timestamps: true }
);

// Blog Schema
const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    category: { type: String },
    coverImage: { type: String },
    published: { type: Boolean, default: true, index: true },
    publishedAt: { type: String, default: () => new Date().toISOString() },
    readTimeMinutes: { type: Number, default: 5 },
    readingTime: { type: String },
  },
  { timestamps: true }
);

// Site Settings Schema
const SiteSettingsSchema = new Schema(
  {
    siteTitle: { type: String, default: 'DevFolio & Resume Architect' },
    metaDescription: { type: String, default: 'Personal developer portfolio and resume builder' },
    primaryColor: { type: String, default: '#2563eb' },
    analyticsEnabled: { type: Boolean, default: true },
    allowPublicResumeDownload: { type: Boolean, default: true },
    enableBlog: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// File Record Schema
const FileRecordSchema = new Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    category: { type: String, default: 'general', index: true },
    ownerId: { type: String },
    relatedEntity: { type: String },
    relatedEntityId: { type: String },
    gridFSFileId: { type: Schema.Types.ObjectId, index: true },
  },
  { timestamps: true }
);

// AI Generation Record Schema
const AIGenerationSchema = new Schema(
  {
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, enum: ['applied', 'discarded', 'draft'], default: 'draft' },
  },
  { timestamps: true }
);

// Model definitions with mongoose cache guards
export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const ProfileModel = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
export const SkillModel = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
export const ExperienceModel = mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);
export const ProjectModel = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export const ResumeModel = mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
export const ContactMessageModel = mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);
export const EducationModel = mongoose.models.Education || mongoose.model('Education', EducationSchema);
export const CertificationModel = mongoose.models.Certification || mongoose.model('Certification', CertificationSchema);
export const ServiceModel = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
export const BlogModel = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
export const SiteSettingsModel = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
export const FileRecordModel = mongoose.models.FileRecord || mongoose.model('FileRecord', FileRecordSchema);
export const AIGenerationModel = mongoose.models.AIGeneration || mongoose.model('AIGeneration', AIGenerationSchema);

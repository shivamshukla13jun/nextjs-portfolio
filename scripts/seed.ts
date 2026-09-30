// Full database reset: drops EVERY collection and seeds all content fresh
// through the strict Mongoose models. The default resume is dehydrated so its
// items land as ObjectId refs linked to the seeded documents.
// Run: npm run seed
import 'dotenv/config';
import mongoose from 'mongoose';
import { dehydrateResume } from '../server/repositories/portfolio.repository.ts';
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
} from '../lib/db/seed-data.ts';
import {
  ProfileModel,
  SkillModel,
  ExperienceModel,
  ProjectModel,
  EducationModel,
  CertificationModel,
  ServiceModel,
  BlogModel,
  ResumeModel,
  SiteSettingsModel,
} from '../server/models/all-models.ts';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not set in .env — cannot seed.');
  process.exit(1);
}

const strip = ({ id, ...rest }: any) => rest;

await mongoose.connect(uri);
const db = mongoose.connection.db!;

console.log('connected — dropping all collections...');
const collections = await db.listCollections().toArray();
for (const c of collections) {
  await db.dropCollection(c.name);
  console.log(`  dropped ${c.name}`);
}

console.log('\nseeding...');
const counts: [string, number][] = [];

await ProfileModel.create(strip(SEED_PROFILE));
counts.push(['profiles', 1]);

await SkillModel.insertMany(SEED_SKILLS.map(strip));
counts.push(['skills', SEED_SKILLS.length]);

await ExperienceModel.insertMany(SEED_EXPERIENCES.map(strip));
counts.push(['experiences', SEED_EXPERIENCES.length]);

await ProjectModel.insertMany(SEED_PROJECTS.map(strip));
counts.push(['projects', SEED_PROJECTS.length]);

await EducationModel.insertMany(SEED_EDUCATION.map(strip));
counts.push(['educations', SEED_EDUCATION.length]);

if (SEED_CERTIFICATIONS.length) {
  await CertificationModel.insertMany(SEED_CERTIFICATIONS.map(strip));
}
counts.push(['certifications', SEED_CERTIFICATIONS.length]);

if (SEED_SERVICES.length) {
  await ServiceModel.insertMany(SEED_SERVICES.map(strip));
}
counts.push(['services', SEED_SERVICES.length]);

if (SEED_BLOGS.length) {
  await BlogModel.insertMany(SEED_BLOGS.map(strip));
}
counts.push(['blogs', SEED_BLOGS.length]);

await SiteSettingsModel.create(strip(SEED_SETTINGS));
counts.push(['sitesettings', 1]);

// Resume goes through dehydrateResume -> items stored as ObjectId refs
await ResumeModel.create(await dehydrateResume(strip(SEED_RESUME)));
counts.push(['resumes', 1]);

for (const [name, n] of counts) console.log(`  ${name}: ${n}`);

await mongoose.disconnect();
console.log('\nseed complete.');

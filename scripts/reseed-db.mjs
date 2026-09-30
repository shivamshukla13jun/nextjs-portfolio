// Clears seed-managed content collections so they repopulate from the strict
// schemas + SEED_* data on the next API read (seedOnce is lazy).
// Preserves: users, contact messages, uploaded files, AI history, analytics.
import 'dotenv/config';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not set in .env — nothing to clear.');
  process.exit(1);
}

const CONTENT_COLLECTIONS = [
  'profiles',
  'skills',
  'experiences',
  'projects',
  'educations',
  'certifications',
  'services',
  'blogs',
  'resumes',
  'sitesettings',
];

await mongoose.connect(uri);
console.log('connected — clearing content collections...');
for (const name of CONTENT_COLLECTIONS) {
  const exists = await mongoose.connection.db.listCollections({ name }).hasNext();
  if (!exists) {
    console.log(`  ${name}: (absent, skipped)`);
    continue;
  }
  const res = await mongoose.connection.db.collection(name).deleteMany({});
  console.log(`  ${name}: deleted ${res.deletedCount}`);
}
await mongoose.disconnect();
console.log('done — collections reseed automatically on next request.');

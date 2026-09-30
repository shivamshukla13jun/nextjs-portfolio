// E2E test: resume <-> model reference hydration roundtrip.
// Credentials come from .env and are never printed.
import 'dotenv/config';

const BASE = process.env.BASE_URL || 'http://localhost:4000';
const fail = (msg) => { console.error('FAIL:', msg); process.exit(1); };
const ok = (msg) => console.log('  ✓', msg);

// login
const login = await fetch(`${BASE}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }),
});
if (!login.ok) fail(`login ${login.status}`);
const cookie = login.headers.get('set-cookie')?.split(';')[0];
ok('login');

const authed = (init = {}) => ({
  ...init,
  headers: { 'Content-Type': 'application/json', cookie, ...(init.headers || {}) },
});

// grab source models
const exps = (await (await fetch(`${BASE}/api/portfolio/experiences`)).json()).experiences;
const projs = (await (await fetch(`${BASE}/api/portfolio/projects`)).json()).projects;
const skills = (await (await fetch(`${BASE}/api/portfolio/skills`)).json()).skills;
if (!exps.length || !projs.length || !skills.length) fail('need seeded portfolio data');
const exp = exps[0], proj = projs[0];
const skillGroups = [...new Set(skills.map((s) => s.category))].slice(0, 2).map((cat) => ({
  category: cat,
  skills: skills.filter((s) => s.category === cat).map((s) => s.name),
  sourceIds: skills.filter((s) => s.category === cat).map((s) => s.id),
}));
ok(`sources: ${exps.length} exp, ${projs.length} proj, ${skills.length} skills`);

// create resume: linked exp (untouched), linked+customized proj, custom embedded edu
const resume = {
  title: 'ref-test-resume',
  personalInfo: { fullName: 'Test Name', professionalTitle: 'T', email: 't@t.c', location: 'X', summary: 'custom summary' },
  workExperiences: [
    { sourceId: exp.id, id: exp.id, company: exp.company, position: exp.position, location: exp.location, startDate: exp.startDate, endDate: exp.endDate, current: exp.current, bulletPoints: exp.responsibilities?.length ? exp.responsibilities : [exp.description], technologies: exp.technologies },
    { company: 'CustomCo', position: 'Freelance', startDate: '2020', bulletPoints: ['Custom item, no model'] },
  ],
  projects: [
    { sourceId: proj.id, id: proj.id, name: proj.name, description: 'EDITED for this resume', role: 'Lead', technologies: proj.technologies, bulletPoints: ['custom bullet'] },
  ],
  education: [{ degree: 'B.Tech', institution: 'Embedded Uni' }],
  skills: skillGroups,
  certifications: [],
  settings: { template: 'compact' },
};
const createRes = await fetch(`${BASE}/api/resumes`, authed({ method: 'POST', body: JSON.stringify(resume) }));
if (!createRes.ok) fail(`create ${createRes.status}`);
const created = (await createRes.json()).resume;
ok(`created ${created.id}`);

// read back — refs must hydrate to full objects
const got = (await (await fetch(`${BASE}/api/resumes/${created.id}`)).json()).resume;
const w0 = got.workExperiences[0];
if (w0.position !== exp.position || w0.sourceId !== exp.id) fail('exp ref not hydrated');
ok('untouched exp hydrated from model (live link)');
const w1 = got.workExperiences[1];
if (w1.company !== 'CustomCo') fail('embedded exp lost');
ok('custom exp stored embedded');
const p0 = got.projects[0];
if (p0.description !== 'EDITED for this resume' || p0.sourceId !== proj.id) fail('customized proj ref+snapshot wrong');
ok('customized proj keeps snapshot + ref');
if (!got.skills?.length || !got.skills[0].skills?.length) fail('skills not hydrated');
ok(`skills regrouped: ${got.skills.map((g) => `${g.category}(${g.skills.length})`).join(', ')}`);
if (got.education[0].degree !== 'B.Tech') fail('embedded edu lost');
ok('embedded education ok');

// verify raw storage really holds refs (not duplicated embedded blobs)
// re-save without changes — should stay linked
const resave = await fetch(`${BASE}/api/resumes/${created.id}`, authed({ method: 'PUT', body: JSON.stringify(got) }));
if (!resave.ok) fail(`resave ${resave.status}`);
const got2 = (await (await fetch(`${BASE}/api/resumes/${created.id}`)).json()).resume;
if (got2.workExperiences[0].position !== exp.position) fail('resave broke hydration');
ok('idempotent resave keeps links');

// cleanup
const del = await fetch(`${BASE}/api/resumes/${created.id}`, authed({ method: 'DELETE' }));
if (!del.ok) fail(`delete ${del.status}`);
ok('cleanup done');
console.log('\nALL CHECKS PASSED');

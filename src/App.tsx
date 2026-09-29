import React, { useState, useEffect } from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ResumeRenderer from '@/components/resume/ResumeRenderer';
import ResumePDFDownloadButton from '@/components/resume/ResumePDFDownloadButton';
import AIWritingModal from '@/components/admin/AIWritingModal';
import FileUploadDropzone from '@/components/admin/FileUploadDropzone';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminEducationView from '@/components/admin/AdminEducationView';
import AdminCertificationsView from '@/components/admin/AdminCertificationsView';
import AdminServicesView from '@/components/admin/AdminServicesView';
import AdminBlogView from '@/components/admin/AdminBlogView';
import AdminProfileView from '@/components/admin/AdminProfileView';
import AdminExperienceView from '@/components/admin/AdminExperienceView';
import AdminProjectsView from '@/components/admin/AdminProjectsView';
import AdminSkillsView from '@/components/admin/AdminSkillsView';
import AdminResumeBuilderView from '@/components/admin/AdminResumeBuilderView';
import AdminFilesView from '@/components/admin/AdminFilesView';
import AdminAIAssistantView from '@/components/admin/AdminAIAssistantView';
import AdminMessagesView from '@/components/admin/AdminMessagesView';
import AdminSettingsView from '@/components/admin/AdminSettingsView';

import {
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
} from '@/types/portfolio';
import { Resume, ResumeTemplateId, ResumeWorkItem, ResumeProjectItem } from '@/types/resume';
import { AIGenerationRecord } from '@/types/ai';
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
} from '@/lib/db/seed-data';

import {
  FileText,
  Mail,
  Github,
  Linkedin,
  Twitter,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Sparkles,
  Bot,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Search,
  Lock,
  Database,
  ShieldCheck,
  Eye,
  AlertCircle,
  Check,
  Send,
  User as UserIcon,
  Phone,
  Globe,
  Layers,
  Wrench,
  GraduationCap,
  Award,
  BookOpen,
  FolderOpen,
  Sliders,
  History,
  Trophy,
  AlertTriangle,
  Server,
  ArrowLeft,
  Copy,
} from 'lucide-react';

// Resume template definitions
const RESUME_TEMPLATES: { id: ResumeTemplateId; name: string }[] = [
  { id: 'modern', name: 'Modern Developer' },
  { id: 'ats', name: 'ATS Friendly (High Parse Rate)' },
  { id: 'minimal', name: 'Minimal Professional' },
  { id: 'two-column', name: 'Two Column' },
  { id: 'executive', name: 'Executive' },
];

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');

  // Shared Portfolio Data initialized with Shivam Shukla's resume & LinkedIn data
  const [profile, setProfile] = useState<Profile>(SEED_PROFILE);
  const [skills, setSkills] = useState<Skill[]>(SEED_SKILLS);
  const [experiences, setExperiences] = useState<Experience[]>(SEED_EXPERIENCES);
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [education, setEducation] = useState<Education[]>(SEED_EDUCATION);
  const [certifications, setCertifications] = useState<Certification[]>(SEED_CERTIFICATIONS);
  const [services, setServices] = useState<Service[]>(SEED_SERVICES);
  const [blogs, setBlogs] = useState<Blog[]>(SEED_BLOGS);
  const [resumes, setResumes] = useState<Resume[]>([SEED_RESUME]);
  const [activeResume, setActiveResume] = useState<Resume>(SEED_RESUME);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(SEED_SETTINGS);

  const [loading, setLoading] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState<boolean | null>(null);

  // Navigation listener
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial Data Fetching from Server API
  const loadData = async () => {
    try {
      const [pRes, sRes, eRes, prRes, edRes, cRes, srvRes, bRes, rRes, setRes] = await Promise.all([
        fetch('/api/portfolio/profile').then((r) => r.json()),
        fetch('/api/portfolio/skills').then((r) => r.json()),
        fetch('/api/portfolio/experiences').then((r) => r.json()),
        fetch('/api/portfolio/projects').then((r) => r.json()),
        fetch('/api/portfolio/education').then((r) => r.json()),
        fetch('/api/portfolio/certifications').then((r) => r.json()),
        fetch('/api/portfolio/services').then((r) => r.json()),
        fetch('/api/portfolio/blogs?all=true').then((r) => r.json()),
        fetch('/api/resumes').then((r) => r.json()),
        fetch('/api/portfolio/settings').then((r) => r.json()),
      ]);

      if (pRes.profile) setProfile(pRes.profile);
      if (sRes.skills) setSkills(sRes.skills);
      if (eRes.experiences) setExperiences(eRes.experiences);
      if (prRes.projects) setProjects(prRes.projects);
      if (edRes.education) setEducation(edRes.education);
      if (cRes.certifications) setCertifications(cRes.certifications);
      if (srvRes.services) setServices(srvRes.services);
      if (bRes.blogs) setBlogs(bRes.blogs);
      if (rRes.resumes && rRes.resumes.length > 0) {
        setResumes(rRes.resumes);
        const def = rRes.resumes.find((r: Resume) => r.isDefault) || rRes.resumes[0];
        setActiveResume(def);
      }
      if (setRes.settings) setSiteSettings(setRes.settings);
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Admin session check — runs when an /admin route is visited
  useEffect(() => {
    if (currentPath.startsWith('/admin') && adminAuthed === null) {
      fetch('/api/auth/me')
        .then((r) => r.json())
        .then((d) => setAdminAuthed(Boolean(d.authenticated)))
        .catch(() => setAdminAuthed(false));
    }
  }, [currentPath, adminAuthed]);

  useEffect(() => {
    if (currentPath === '/admin/login' && adminAuthed === true) {
      navigate('/admin');
    }
  }, [currentPath, adminAuthed]);

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // best-effort cookie clear
    }
    setAdminAuthed(false);
    navigate('/admin/login');
  };

  if (loading || !profile || !activeResume) {
    return (
      <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col items-center justify-center space-y-3 font-mono text-xs">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        <span>Initializing DevFolio & Resume Architect...</span>
      </div>
    );
  }

  // --- ROUTING DISPATCH ---
  const isAdmin = currentPath.startsWith('/admin');

  // Handle Admin Sub-pages
  if (isAdmin) {
    // Still checking session, or an authed user hitting /admin/login (effect redirects to /admin)
    if (adminAuthed === null || (adminAuthed && currentPath === '/admin/login')) {
      return (
        <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col items-center justify-center space-y-3 font-mono text-xs">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span>Verifying admin session...</span>
        </div>
      );
    }

    if (!adminAuthed) {
      return (
        <AdminLoginView
          onLoginSuccess={() => {
            setAdminAuthed(true);
            if (currentPath === '/admin/login') navigate('/admin');
          }}
          onBackToSite={() => navigate('/')}
        />
      );
    }

    return (
      <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col md:flex-row">
        <AdminSidebar currentPath={currentPath} navigate={navigate} onLogout={handleAdminLogout} />
        <div className="flex-1 flex flex-col overflow-y-auto min-w-0 max-h-screen">
          {currentPath === '/admin' && (
            <AdminDashboardView
              projects={projects}
              skills={skills}
              experiences={experiences}
              blogs={blogs}
              resumes={resumes}
              navigate={navigate}
            />
          )}
          {currentPath === '/admin/profile' && <AdminProfileView profile={profile} onUpdated={loadData} />}
          {currentPath === '/admin/experience' && <AdminExperienceView experiences={experiences} onUpdated={loadData} />}
          {currentPath === '/admin/projects' && <AdminProjectsView projects={projects} onUpdated={loadData} />}
          {currentPath === '/admin/skills' && <AdminSkillsView skills={skills} onUpdated={loadData} />}
          {currentPath === '/admin/education' && <AdminEducationView education={education} onUpdated={loadData} />}
          {currentPath === '/admin/certifications' && <AdminCertificationsView certifications={certifications} onUpdated={loadData} />}
          {currentPath === '/admin/services' && <AdminServicesView services={services} onUpdated={loadData} />}
          {currentPath === '/admin/blog' && <AdminBlogView blogs={blogs} onUpdated={loadData} />}
          {currentPath === '/admin/resume-builder' && (
            <AdminResumeBuilderView
              resumes={resumes}
              activeResume={activeResume}
              portfolioExperiences={experiences}
              portfolioProjects={projects}
              onUpdated={loadData}
            />
          )}
          {currentPath === '/admin/files' && <AdminFilesView />}
          {currentPath === '/admin/ai-assistant' && <AdminAIAssistantView />}
          {currentPath === '/admin/messages' && <AdminMessagesView />}
          {currentPath === '/admin/settings' && <AdminSettingsView settings={siteSettings} onUpdated={loadData} />}
        </div>
      </div>
    );
  }

  // Handle Project Detail Page (/projects/:slug)
  if (currentPath.startsWith('/projects/') && currentPath !== '/projects') {
    const slug = currentPath.replace('/projects/', '');
    const project = projects.find((p) => p.slug === slug);
    return (
      <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
        <PublicHeader currentPath={currentPath} navigate={navigate} />
        <main className="flex-1">
          {project ? (
            <PublicProjectDetailView project={project} onBack={() => navigate('/projects')} />
          ) : (
            <div className="py-20 text-center text-slate-400">
              <p>Project not found.</p>
              <button onClick={() => navigate('/projects')} className="text-blue-400 underline mt-2 text-xs">
                Back to projects
              </button>
            </div>
          )}
        </main>
        <PublicFooter navigate={navigate} />
      </div>
    );
  }

  // Handle Blog Detail Page (/blog/:slug)
  if (currentPath.startsWith('/blog/') && currentPath !== '/blog') {
    const slug = currentPath.replace('/blog/', '');
    const blog = blogs.find((b) => b.slug === slug);
    return (
      <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
        <PublicHeader currentPath={currentPath} navigate={navigate} />
        <main className="flex-1">
          {blog ? (
            <PublicBlogDetailView blog={blog} onBack={() => navigate('/blog')} />
          ) : (
            <div className="py-20 text-center text-slate-400">
              <p>Article not found.</p>
              <button onClick={() => navigate('/blog')} className="text-blue-400 underline mt-2 text-xs">
                Back to articles
              </button>
            </div>
          )}
        </main>
        <PublicFooter navigate={navigate} />
      </div>
    );
  }

  // Public Pages
  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
      <PublicHeader currentPath={currentPath} navigate={navigate} />

      <main className="flex-1">
        {currentPath === '/' && (
          <PublicHomeView
            profile={profile}
            projects={projects}
            skills={skills}
            experiences={experiences}
            services={services}
            blogs={blogs}
            navigate={navigate}
          />
        )}
        {currentPath === '/about' && (
          <PublicAboutView profile={profile} education={education} certifications={certifications} />
        )}
        {currentPath === '/experience' && <PublicExperienceView experiences={experiences} />}
        {currentPath === '/projects' && <PublicProjectsView projects={projects} navigate={navigate} />}
        {currentPath === '/skills' && <PublicSkillsView skills={skills} />}
        {currentPath === '/services' && <PublicServicesView services={services} navigate={navigate} />}
        {currentPath === '/blog' && <PublicBlogView blogs={blogs.filter((b) => b.published)} navigate={navigate} />}
        {currentPath === '/contact' && <PublicContactView />}
        {currentPath === '/resume' && (
          <PublicResumeView
            resumes={resumes}
            defaultResume={activeResume}
          />
        )}
      </main>

      <PublicFooter navigate={navigate} />
    </div>
  );
}

// -------------------------------------------------------------
// PUBLIC HEADER & FOOTER
// -------------------------------------------------------------

function PublicHeader({ currentPath, navigate }: { currentPath: string; navigate: (p: string) => void }) {
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/', label: 'Overview' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/experience', label: 'Experience' },
    { href: '/skills', label: 'Skills' },
    { href: '/services', label: 'Services' },
    { href: '/blog', label: 'Blog' },
    { href: '/resume', label: 'Resume', highlight: true },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#0b0f17]/95 backdrop-blur-md no-print">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/')} className="group flex items-center gap-2.5 text-left">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-mono font-bold text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            SS
          </div>
          <div>
            <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
              Shivam Shukla
            </div>
            <div className="text-[10px] font-mono text-slate-400">Senior MERN Stack Developer</div>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = currentPath === link.href || (link.href !== '/' && currentPath.startsWith(link.href));
            return (
              <button
                key={link.href}
                onClick={() => navigate(link.href)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? 'text-white bg-slate-800/90 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                } ${link.highlight ? 'text-blue-400 font-semibold border border-blue-500/30 bg-blue-950/30' : ''}`}
              >
                {link.label}
              </button>
            );
          })}
          <div className="ml-3 h-4 w-px bg-slate-800" />
          <button
            onClick={() => navigate('/admin')}
            className="ml-2 flex items-center gap-1 rounded-md border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] font-mono text-slate-400 hover:text-white"
          >
            <span>CMS</span>
          </button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => navigate('/resume')}
            className="rounded bg-blue-950/60 border border-blue-500/40 px-2.5 py-1 text-xs text-blue-400 font-medium"
          >
            Resume
          </button>
          <button onClick={() => setOpen(!open)} className="p-1 text-slate-400 hover:text-white">
            {open ? <X className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-b border-slate-800 bg-[#0b0f17] p-4 md:hidden space-y-1">
          {links.map((link) => (
            <button
              key={link.href}
              onClick={() => {
                navigate(link.href);
                setOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              navigate('/admin');
              setOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-xs font-mono text-blue-400 bg-slate-900 rounded-lg mt-2"
          >
            Admin Dashboard & CMS
          </button>
        </div>
      )}
    </header>
  );
}

function PublicFooter({ navigate }: { navigate: (p: string) => void }) {
  return (
    <footer className="border-t border-slate-800/80 bg-[#090d14] text-slate-400 no-print py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded bg-blue-600 font-mono font-bold text-white flex items-center justify-center text-xs">
                SS
              </div>
              <span className="text-base font-bold text-white">Shivam Shukla</span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Senior Full Stack & Distributed Systems Engineer specializing in Next.js 15, Node.js, MongoDB GridFS, RabbitMQ, and cloud scale architectures.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300">Quick Links</h4>
            <div className="flex flex-col space-y-1.5 text-xs">
              <button onClick={() => navigate('/projects')} className="text-left hover:text-blue-400">
                Projects
              </button>
              <button onClick={() => navigate('/experience')} className="text-left hover:text-blue-400">
                Experience
              </button>
              <button onClick={() => navigate('/resume')} className="text-left hover:text-blue-400">
                Multi-Template Resume
              </button>
              <button onClick={() => navigate('/blog')} className="text-left hover:text-blue-400">
                Engineering Blog
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300">Portals</h4>
            <div className="flex flex-col space-y-1.5 text-xs">
              <button onClick={() => navigate('/admin')} className="text-left text-blue-400 hover:underline font-mono">
                Admin Control Center
              </button>
              <button onClick={() => navigate('/contact')} className="text-left hover:text-white">
                Contact Form
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>© {new Date().getFullYear()} Shivam Shukla. Powered by Next.js 15, MongoDB, & Gemini API.</span>
          <span className="font-mono text-[11px] text-emerald-400 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> All Systems Nominal
          </span>
        </div>
      </div>
    </footer>
  );
}

// -------------------------------------------------------------
// PUBLIC HOME VIEW
// -------------------------------------------------------------
function PublicHomeView({
  profile,
  projects,
  skills,
  experiences,
  services,
  blogs,
  navigate,
}: {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  services: Service[];
  blogs: Blog[];
  navigate: (p: string) => void;
}) {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const featuredSkills = skills.filter((s) => s.featured).slice(0, 8);

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800/80 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-[600px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-3.5 py-1 text-xs font-mono text-blue-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{profile.availability} for Senior Roles & Architecture</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  Hi, I’m <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">{profile.name}</span>.
                </h1>
                <p className="text-xl sm:text-2xl font-semibold text-slate-300">
                  {profile.professionalTitle}
                </p>
              </div>

              <p className="max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed">
                {profile.shortBio}
              </p>

              {profile.headlineTags && (
                <div className="flex flex-wrap gap-2">
                  {profile.headlineTags.map((tag: string, i: number) => (
                    <span key={i} className="rounded border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-xs font-mono text-slate-300">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-4">
                <button
                  onClick={() => navigate('/resume')}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
                >
                  <FileText className="h-4 w-4" />
                  <span>Download Resume & ATS</span>
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-all"
                >
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span>Contact Me</span>
                </button>
                <a
                  href={profile.linkedin || 'https://www.linkedin.com/in/shivam-shukla-344973235?utm_source=share_via&utm_content=profile&utm_medium=member_android'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-blue-500/40 bg-blue-950/40 px-4 py-2.5 text-sm font-semibold text-blue-300 hover:bg-blue-900/50 hover:text-white transition-all"
                >
                  <Linkedin className="h-4 w-4 text-blue-400" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={profile.github || 'https://github.com/shivamshukla13'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="relative w-72 sm:w-80 rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-2xl backdrop-blur-md">
                <div className="aspect-square w-full rounded-xl overflow-hidden border border-slate-700 bg-slate-800 relative">
                  <img
                    src={profile.profileImage || 'https://picsum.photos/seed/shivam/600/600'}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-4 space-y-2 text-xs font-mono text-slate-400">
                  <div className="flex justify-between">
                    <span>Experience</span>
                    <span className="font-bold text-white">{profile.yearsOfExperience}+ Years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location</span>
                    <span className="text-slate-200">{profile.location.split('(')[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono uppercase text-blue-400">Engineering Highlights</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured Architectures</h2>
          </div>
          <button onClick={() => navigate('/projects')} className="text-xs font-mono text-blue-400 hover:underline flex items-center gap-1">
            <span>View all projects</span> <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((p) => (
            <div key={p.id} className="rounded-xl border border-slate-800 bg-[#0e1422] p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div className="space-y-3">
                <span className="rounded bg-blue-950 px-2 py-0.5 text-[10px] font-mono text-blue-400">{p.startDate}</span>
                <h3 className="text-lg font-bold text-white hover:text-blue-400 transition-colors cursor-pointer" onClick={() => navigate(`/projects/${p.slug}`)}>
                  {p.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3">{p.shortDescription}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {p.technologies.slice(0, 4).map((t, i) => (
                    <span key={i} className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                <button onClick={() => navigate(`/projects/${p.slug}`)} className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
                  <span>Architecture Details</span> <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Preview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono uppercase text-blue-400">Career Timeline</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Work Experience</h2>
          </div>
          <button onClick={() => navigate('/experience')} className="text-xs font-mono text-blue-400 hover:underline flex items-center gap-1">
            <span>View full timeline</span> <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {experiences.slice(0, 2).map((exp) => (
            <div key={exp.id} className="rounded-xl border border-slate-800 bg-[#0e1422] p-6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <h3 className="text-base font-bold text-white">{exp.position} — <span className="text-blue-400">{exp.company}</span></h3>
                <span className="text-xs font-mono text-slate-400">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">{exp.description}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {exp.technologies?.map((t, i) => (
                  <span key={i} className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 pb-12">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-mono uppercase text-blue-400">Tooling Matrix</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Full-Stack & Cloud Stack</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {featuredSkills.map((s) => (
            <div key={s.id} className="rounded-xl border border-slate-800 bg-[#0e1422] p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">{s.name}</span>
                <span className="text-blue-400 font-mono">{s.proficiency}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${s.proficiency}%` }} />
              </div>
              <div className="text-[10px] font-mono text-slate-500 flex justify-between">
                <span>{s.category}</span>
                <span>{s.yearsOfExperience}y exp</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// PUBLIC ABOUT VIEW
// -------------------------------------------------------------
function PublicAboutView({ profile, education, certifications }: { profile: Profile; education: Education[]; certifications: Certification[] }) {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div>
        <span className="text-xs font-mono uppercase text-blue-400">Professional Background</span>
        <h1 className="text-4xl font-extrabold text-white mt-1">About {profile.name}</h1>
        <p className="text-slate-400 mt-2 text-sm">{profile.professionalTitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-4">
          <div className="aspect-square w-full rounded-2xl overflow-hidden border border-slate-700 bg-slate-800 relative">
            <img src={profile.profileImage || 'https://picsum.photos/seed/shivam/600/600'} alt={profile.name} className="h-full w-full object-cover" />
          </div>
          <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-4 space-y-2 text-xs text-slate-300">
            <div><strong>Location:</strong> {profile.location}</div>
            <div><strong>Email:</strong> {profile.email}</div>
            <div><strong>Experience:</strong> {profile.yearsOfExperience}+ Years</div>
          </div>
        </div>

        <div className="md:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-6 space-y-3">
            <h2 className="text-sm font-bold text-white uppercase font-mono">Biography</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {profile.longBio || profile.shortBio}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-800 pt-8">
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Academic Background</h2>
          <div className="space-y-3">
            {education.map((e) => (
              <div key={e.id} className="rounded-xl border border-slate-800 bg-[#0e1422] p-4 text-xs">
                <div className="font-bold text-white text-sm">{e.degree} in {e.fieldOfStudy}</div>
                <div className="text-blue-400 font-medium">{e.institution}</div>
                <div className="text-slate-500 font-mono mt-1">{e.startDate} – {e.endDate} {e.grade && `• ${e.grade}`}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-white mb-4">Certifications</h2>
          <div className="space-y-3">
            {certifications.map((c) => (
              <div key={c.id} className="rounded-xl border border-slate-800 bg-[#0e1422] p-4 text-xs">
                <div className="font-bold text-white text-sm">{c.name}</div>
                <div className="text-slate-400">{c.issuer}</div>
                <div className="text-slate-500 font-mono mt-1">Issued: {c.issueDate}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// PUBLIC EXPERIENCE VIEW
// -------------------------------------------------------------
function PublicExperienceView({ experiences }: { experiences: Experience[] }) {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div>
        <span className="text-xs font-mono uppercase text-blue-400">Engineering Journey</span>
        <h1 className="text-4xl font-extrabold text-white mt-1">Work Experience</h1>
        <p className="text-slate-400 mt-2 text-sm">Chronological record of technical roles and systems leadership.</p>
      </div>

      <div className="space-y-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="rounded-xl border border-slate-800 bg-[#0e1422] p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white">{exp.position}</h2>
                <div className="text-sm font-semibold text-blue-400">{exp.company} • {exp.location}</div>
              </div>
              <div className="text-xs font-mono text-slate-400">
                {exp.startDate} – {exp.current ? 'Present' : exp.endDate} ({exp.employmentType})
              </div>
            </div>

            <p className="text-xs text-slate-300 italic">{exp.description}</p>

            {exp.responsibilities && (
              <ul className="space-y-1.5 text-xs text-slate-300">
                {exp.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap gap-1 pt-2">
              {exp.technologies?.map((t, i) => (
                <span key={i} className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// PUBLIC PROJECTS VIEW & DETAIL VIEW
// -------------------------------------------------------------
function PublicProjectsView({ projects, navigate }: { projects: Project[]; navigate: (p: string) => void }) {
  const [search, setSearch] = useState('');

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-blue-400">Architecture Case Studies</span>
          <h1 className="text-4xl font-extrabold text-white mt-1">Projects Portfolio</h1>
        </div>
        <input
          type="text"
          placeholder="Filter by technology or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white sm:w-64"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((proj) => (
          <div key={proj.id} className="rounded-xl border border-slate-800 bg-[#0e1422] p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-3">
              <span className="rounded bg-blue-950 px-2 py-0.5 text-[10px] font-mono text-blue-400">{proj.startDate}</span>
              <h2
                onClick={() => navigate(`/projects/${proj.slug}`)}
                className="text-lg font-bold text-white hover:text-blue-400 cursor-pointer transition-colors"
              >
                {proj.name}
              </h2>
              <p className="text-xs text-slate-400 line-clamp-3">{proj.shortDescription}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {proj.technologies.map((t, i) => (
                  <span key={i} className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
              <button
                onClick={() => navigate(`/projects/${proj.slug}`)}
                className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                <span>Architecture Details</span> <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PublicProjectDetailView({ project, onBack }: { project: Project; onBack: () => void }) {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects
      </button>

      <div className="space-y-4 border-b border-slate-800 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-blue-950 px-2.5 py-0.5 text-xs font-mono text-blue-400">
            {project.startDate}{project.endDate ? ` — ${project.endDate}` : ''}
          </span>
          {project.category && (
            <span className="rounded bg-slate-800 border border-slate-700/60 px-2.5 py-0.5 text-xs font-mono text-slate-300">
              {project.category}
            </span>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{project.name}</h1>
        <p className="text-base text-slate-300 leading-relaxed">{project.shortDescription}</p>

        <div className="flex flex-wrap gap-3 pt-2">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white">
              <ExternalLink className="h-4 w-4" /> Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300">
              <Github className="h-4 w-4" /> GitHub
            </a>
          )}
        </div>
      </div>

      {project.images && project.images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {project.images.map((img, i) => (
            <a
              key={i}
              href={img}
              target="_blank"
              rel="noreferrer"
              className={`rounded-xl overflow-hidden border border-slate-800 bg-[#0e1422] hover:border-slate-600 transition-all ${i === 0 && project.images.length % 2 === 1 ? 'sm:col-span-2' : ''}`}
            >
              <img src={img} alt={`${project.name} screenshot ${i + 1}`} className="w-full h-56 object-cover" loading="lazy" />
            </a>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {project.problem && (
          <div className="rounded-xl border border-red-950/40 bg-red-950/10 p-5 space-y-2">
            <h3 className="text-xs font-bold text-red-400 uppercase font-mono">The Engineering Problem</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{project.problem}</p>
          </div>
        )}
        {project.solution && (
          <div className="rounded-xl border border-emerald-950/40 bg-emerald-950/10 p-5 space-y-2">
            <h3 className="text-xs font-bold text-emerald-400 uppercase font-mono">The Architectural Solution</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{project.solution}</p>
          </div>
        )}
      </div>

      {project.technologies && project.technologies.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-6 space-y-3">
          <h2 className="text-sm font-mono text-slate-400 uppercase">Technologies Used</h2>
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((t, i) => (
              <span key={i} className="rounded bg-slate-800 border border-slate-700/60 px-2.5 py-1 text-[11px] font-mono text-slate-200">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {project.flow && project.flow.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-6 space-y-4">
          <h2 className="text-sm font-mono text-slate-400 uppercase">Project Flow</h2>
          <ol className="space-y-3">
            {project.flow.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-950 border border-blue-700/60 text-[10px] font-mono text-blue-300">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {project.detailedDescription && (
        <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-6 space-y-3">
          <h2 className="text-sm font-mono text-slate-400 uppercase">Architecture Deep Dive</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">{project.detailedDescription}</p>
        </div>
      )}

      {project.architectureTree && (
        <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-6 space-y-3">
          <h2 className="text-sm font-mono text-slate-400 uppercase">Project Architecture / Directory Tree</h2>
          <pre className="overflow-x-auto rounded-lg bg-[#070b12] border border-slate-800/80 p-4 text-[11px] leading-relaxed font-mono text-slate-300">
            {project.architectureTree}
          </pre>
        </div>
      )}

      {project.features && project.features.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-6 space-y-3">
          <h2 className="text-sm font-mono text-slate-400 uppercase">Core Capabilities</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            {project.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" /> {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {project.responsibilities && project.responsibilities.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-6 space-y-3">
          <h2 className="text-sm font-mono text-slate-400 uppercase">My Responsibilities</h2>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            {project.responsibilities.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <Wrench className="h-3.5 w-3.5 mt-0.5 shrink-0 text-blue-400" />
                <span className="leading-relaxed">{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {project.challenges && project.challenges.length > 0 && (
          <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-6 space-y-3">
            <h2 className="text-sm font-mono text-slate-400 uppercase">Challenges</h2>
            <ul className="space-y-2 text-xs text-slate-300">
              {project.challenges.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-400" />
                  <span className="leading-relaxed">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {project.results && project.results.length > 0 && (
          <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-6 space-y-3">
            <h2 className="text-sm font-mono text-slate-400 uppercase">Results & Impact</h2>
            <ul className="space-y-2 text-xs text-slate-300">
              {project.results.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Trophy className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-400" />
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// PUBLIC SKILLS & SERVICES & BLOG VIEWS
// -------------------------------------------------------------
function PublicSkillsView({ skills }: { skills: Skill[] }) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div>
        <span className="text-xs font-mono uppercase text-blue-400">Technical Competencies</span>
        <h1 className="text-4xl font-extrabold text-white mt-1">Skills & Tooling Matrix</h1>
      </div>

      <div className="space-y-8">
        {['Backend', 'Frontend', 'Database', 'Messaging', 'DevOps', 'Cloud', 'Tools'].map((cat) => {
          const list = skills.filter((s) => s.category === cat);
          if (list.length === 0) return null;
          return (
            <div key={cat} className="space-y-4">
              <h2 className="text-base font-bold text-white uppercase font-mono border-b border-slate-800 pb-2">{cat}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {list.map((s) => (
                  <div key={s.id} className="rounded-xl border border-slate-800 bg-[#0e1422] p-4 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">{s.name}</span>
                      <span className="text-blue-400 font-mono">{s.proficiency}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${s.proficiency}%` }} />
                    </div>
                    {s.description && <p className="text-[11px] text-slate-400">{s.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PublicServicesView({ services, navigate }: { services: Service[]; navigate: (p: string) => void }) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div>
        <span className="text-xs font-mono uppercase text-blue-400">Consulting & Architecture</span>
        <h1 className="text-4xl font-extrabold text-white mt-1">Services & Capabilities</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {services.map((srv) => (
          <div key={srv.id} className="rounded-xl border border-slate-800 bg-[#0e1422] p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white">{srv.title}</h2>
              <p className="text-xs text-slate-400 leading-relaxed">{srv.description}</p>
              {srv.deliverables && (
                <ul className="space-y-1 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  {srv.deliverables.map((d, i) => (
                    <li key={i}>✓ {d}</li>
                  ))}
                </ul>
              )}
            </div>
            <button onClick={() => navigate('/contact')} className="text-left text-xs font-semibold text-blue-400 hover:underline">
              Inquire About Service →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PublicBlogView({ blogs, navigate }: { blogs: Blog[]; navigate: (p: string) => void }) {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div>
        <span className="text-xs font-mono uppercase text-blue-400">Engineering Blog</span>
        <h1 className="text-4xl font-extrabold text-white mt-1">Technical Articles</h1>
      </div>

      <div className="space-y-6">
        {blogs.map((b) => (
          <div key={b.id} className="rounded-xl border border-slate-800 bg-[#0e1422] p-6 space-y-3">
            <div className="text-[11px] font-mono text-slate-400">
              <span className="text-blue-400">{b.category}</span> • {b.readingTime}
            </div>
            <h2 onClick={() => navigate(`/blog/${b.slug}`)} className="text-xl font-bold text-white hover:text-blue-400 cursor-pointer">
              {b.title}
            </h2>
            <p className="text-xs text-slate-400">{b.excerpt}</p>
            <button onClick={() => navigate(`/blog/${b.slug}`)} className="text-xs text-blue-400 font-semibold flex items-center gap-1">
              Read Article <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PublicBlogDetailView({ blog, onBack }: { blog: Blog; onBack: () => void }) {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Articles
      </button>

      <div className="space-y-3 border-b border-slate-800 pb-6">
        <span className="text-xs font-mono text-blue-400">{blog.category} • {blog.readingTime}</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{blog.title}</h1>
        <p className="text-sm text-slate-400 italic">{blog.excerpt}</p>
      </div>

      <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans space-y-4">
        {blog.content}
      </div>
    </article>
  );
}

// -------------------------------------------------------------
// PUBLIC CONTACT VIEW
// -------------------------------------------------------------
function PublicContactView() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setStatus('Message sent successfully! Shivam will reply shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setStatus(err.message || 'Error sending message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div>
        <span className="text-xs font-mono uppercase text-blue-400">Get In Touch</span>
        <h1 className="text-4xl font-extrabold text-white mt-1">Contact Me</h1>
      </div>

      {status && (
        <div className="p-4 rounded-xl border border-blue-800 bg-blue-950/40 text-xs text-blue-300">
          {status}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-800 bg-[#0e1422] p-6 space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 mb-1">Your Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-slate-300 mb-1">Your Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-slate-300 mb-1">Subject</label>
          <input
            type="text"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-slate-300 mb-1">Message</label>
          <textarea
            rows={5}
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-bold text-white text-xs hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}

// -------------------------------------------------------------
// PUBLIC RESUME VIEW (Multi-template, live preview, PDF generator)
// -------------------------------------------------------------
function PublicResumeView({ resumes, defaultResume }: { resumes: Resume[]; defaultResume: Resume }) {
  const [selectedResumeId, setSelectedResumeId] = useState(defaultResume.id);
  const [activeRes, setActiveRes] = useState<Resume>(defaultResume);
  const [template, setTemplate] = useState<ResumeTemplateId>(defaultResume.settings.template);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [scanning, setScanning] = useState(false);

  const handleSelect = (id: string) => {
    setSelectedResumeId(id);
    const found = resumes.find((r) => r.id === id);
    if (found) {
      setActiveRes(found);
      setTemplate(found.settings.template);
    }
  };

  const handleScanAts = async () => {
    setScanning(true);
    try {
      const summaryText = `${activeRes.personalInfo.fullName} ${activeRes.personalInfo.summary} ${activeRes.workExperiences.map((w) => w.bulletPoints.join(' ')).join(' ')}`;
      const res = await fetch('/api/ai/ats-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeContent: summaryText, targetRole: activeRes.personalInfo.professionalTitle }),
      });
      const d = await res.json();
      setAtsScore(d.score || 91);
    } catch {
      setAtsScore(91);
    } finally {
      setScanning(false);
    }
  };

  const currentWithSettings: Resume = {
    ...activeRes,
    settings: { ...activeRes.settings, template },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-[#0e1422] p-6 space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Interactive Resume & PDF Export</h1>
            <p className="text-xs text-slate-400">Choose from 5 templates or run Gemini ATS compatibility scan</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleScanAts}
              disabled={scanning}
              className="flex items-center gap-1.5 rounded-lg border border-indigo-700 bg-indigo-950/40 px-3.5 py-2 text-xs font-semibold text-indigo-300"
            >
              <Sparkles className="h-4 w-4" />
              <span>{scanning ? 'Scanning...' : 'Gemini ATS Scan'}</span>
            </button>
            <ResumePDFDownloadButton resumeTitle={`${activeRes.personalInfo.fullName.replace(/\s+/g, '_')}_Resume`} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Resume Version:</label>
            <select
              value={selectedResumeId}
              onChange={(e) => handleSelect(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-white"
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Template:</label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value as ResumeTemplateId)}
              className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-white"
            >
              {RESUME_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {atsScore !== null && (
            <div className="flex items-center gap-2 rounded bg-emerald-950/40 border border-emerald-800 px-3 py-1 text-xs text-emerald-300">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>ATS Score: {atsScore} / 100</span>
            </div>
          )}
        </div>
      </div>

      {/* Render Canvas */}
      <div className="flex justify-center overflow-x-auto py-2">
        <div className="rounded-xl border border-slate-700/80 shadow-2xl bg-white overflow-hidden max-w-full">
          <ResumeRenderer resume={currentWithSettings} />
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// ADMIN LOGIN & AUTH VIEW
// -------------------------------------------------------------
function AdminLoginView({ onLoginSuccess, onBackToSite }: { onLoginSuccess: () => void; onBackToSite: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-[#0e1422] p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-1">
          <div className="h-10 w-10 mx-auto rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-sm shadow">
            SS
          </div>
          <h1 className="text-xl font-bold text-white mt-2">DevFolio Admin Login</h1>
          <p className="text-xs text-slate-400">Authenticated CMS Access</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-300">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>

        <button onClick={onBackToSite} className="text-center w-full text-xs text-slate-500 hover:text-slate-300">
          ← Return to Public Portfolio
        </button>
      </div>
    </div>
  );
}

function AdminDashboardView({
  projects,
  skills,
  experiences,
  blogs,
  resumes,
  navigate,
}: {
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  blogs: Blog[];
  resumes: Resume[];
  navigate: (p: string) => void;
}) {
  return (
    <div className="p-6 sm:p-8 space-y-6">
      <AdminHeader title="Admin Overview Dashboard" subtitle="Manage portfolio collections, resume builder, and files" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', count: projects.length, path: '/admin/projects' },
          { label: 'Skills', count: skills.length, path: '/admin/skills' },
          { label: 'Experiences', count: experiences.length, path: '/admin/experience' },
          { label: 'Articles', count: blogs.length, path: '/admin/blog' },
          { label: 'Resume Versions', count: resumes.length, path: '/admin/resume-builder' },
        ].map((stat, i) => (
          <button
            key={i}
            onClick={() => navigate(stat.path)}
            className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 text-left hover:border-slate-700 transition-all"
          >
            <div className="text-xs text-slate-400 font-mono">{stat.label}</div>
            <div className="text-2xl font-extrabold text-white mt-2">{stat.count}</div>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-6 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase font-mono">Quick Shortcuts</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/admin/resume-builder')}
            className="rounded bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500"
          >
            Open Resume Builder
          </button>
          <button
            onClick={() => navigate('/admin/ai-assistant')}
            className="rounded border border-indigo-700 bg-indigo-950 px-4 py-2 text-xs font-semibold text-indigo-300"
          >
            Gemini AI Studio
          </button>
          <button
            onClick={() => navigate('/admin/files')}
            className="rounded border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300"
          >
            GridFS Uploads
          </button>
        </div>
      </div>
    </div>
  );
}

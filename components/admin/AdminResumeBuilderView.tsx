import React, { useState } from 'react';
import { Resume, ResumeTemplateId, ResumeWorkItem, ResumeProjectItem, ResumeEducationItem } from '@/types/resume';
import { Experience, Project, Education, Skill, Certification, Profile } from '@/types/portfolio';
import AdminHeader from './AdminHeader';
import ResumeRenderer from '../resume/ResumeRenderer';
import {
  experienceToResume,
  projectToResume,
  educationToResume,
  certificationToResume,
  skillsToResumeGroups,
  buildResumeFromPortfolio,
  setAtPath,
  getAtPath,
} from '@/lib/resume-utils';
import {
  FileText,
  Save,
  CheckCircle2,
  Sliders,
  Palette,
  Type,
  Printer,
  Trash2,
  Plus,
  Edit2,
  User,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Wrench,
  Check,
  X,
  Download,
  PenLine,
  Eye,
  Database,
  Award,
} from 'lucide-react';

interface AdminResumeBuilderViewProps {
  resumes: Resume[];
  activeResume: Resume;
  portfolioExperiences: Experience[];
  portfolioProjects: Project[];
  portfolioEducation: Education[];
  portfolioSkills: Skill[];
  portfolioCertifications: Certification[];
  profile?: Profile | null;
  onUpdated: () => void;
}

const TEMPLATES: { id: ResumeTemplateId; name: string; desc: string }[] = [
  { id: 'modern', name: 'Modern Developer', desc: 'Slick blue accent dividers, two-column skills, clean hierarchy.' },
  { id: 'ats', name: 'ATS Friendly', desc: 'Standard single-column, 100% parse-rate recruiter standard.' },
  { id: 'minimal', name: 'Minimal Professional', desc: 'Monochrome, understated typography, high information density.' },
  { id: 'two-column', name: 'Two Column', desc: 'Dark sidebar for contact, skills, and education.' },
  { id: 'executive', name: 'Executive', desc: 'Serif headings, formal leadership tone for Staff/Lead roles.' },
  { id: 'creative', name: 'Creative Banner', desc: 'Accent-colored header band, skill chips, timeline experience.' },
  { id: 'compact', name: 'Compact One-Pager', desc: 'Dense layout squeezing maximum content into a single page.' },
  { id: 'classic', name: 'Classic Traditional', desc: 'Centered serif layout for conservative industries.' },
];

export default function AdminResumeBuilderView({
  resumes,
  activeResume,
  portfolioExperiences,
  portfolioProjects,
  portfolioEducation,
  portfolioSkills,
  portfolioCertifications,
  profile,
  onUpdated,
}: AdminResumeBuilderViewProps) {
  const [current, setCurrent] = useState<Resume>(activeResume);
  const [activeTab, setActiveTab] = useState<'design' | 'personal' | 'experience' | 'projects' | 'education' | 'skills'>('design');
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [docEditMode, setDocEditMode] = useState(false);

  // Experience modal/inline edit
  const [editingExpIndex, setEditingExpIndex] = useState<number | null>(null);
  const [expCompany, setExpCompany] = useState('');
  const [expPosition, setExpPosition] = useState('');
  const [expLocation, setExpLocation] = useState('');
  const [expStartDate, setExpStartDate] = useState('');
  const [expEndDate, setExpEndDate] = useState('');
  const [expCurrent, setExpCurrent] = useState(false);
  const [expBullets, setExpBullets] = useState('');

  // Project modal/inline edit
  const [editingProjIndex, setEditingProjIndex] = useState<number | null>(null);
  const [projName, setProjName] = useState('');
  const [projRole, setProjRole] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projBullets, setProjBullets] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/resumes/${current.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(current),
      });

      if (res.ok) {
        setStatusMessage('Resume changes saved and synced live!');
        onUpdated();
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        setStatusMessage('Failed to save resume changes.');
      }
    } catch (e) {
      console.error(e);
      setStatusMessage('Network error updating resume.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm(`Are you sure you want to delete resume version "${current.title}"?`)) return;
    try {
      const res = await fetch(`/api/resumes/${current.id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMessage('Resume version deleted.');
        onUpdated();
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (e) {
      console.error(e);
      setStatusMessage('Error deleting resume.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Inline document editing — writes a field back into the resume by dot path.
  // Existing array fields are re-split into arrays (bullets/skills edited as comma/newline text).
  const handleDocEdit = (path: string, value: string) => {
    const existing = getAtPath(current, path);
    const next = Array.isArray(existing)
      ? value.split(/\n|,|•/).map((s) => s.trim()).filter(Boolean)
      : value;
    setCurrent(setAtPath(current, path, next));
  };

  // Create a brand-new resume version populated from the portfolio data models (not hardcoded).
  const handleNewResume = async () => {
    setSaving(true);
    try {
      const fresh = buildResumeFromPortfolio({
        profile,
        experiences: portfolioExperiences,
        projects: portfolioProjects,
        education: portfolioEducation,
        skills: portfolioSkills,
        certifications: portfolioCertifications,
        title: `Resume — ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
      });
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fresh),
      });
      const data = await res.json();
      if (res.ok && data.resume) {
        setCurrent(data.resume);
        setStatusMessage('New resume created from your portfolio data.');
        onUpdated();
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        setStatusMessage('Failed to create resume.');
      }
    } catch {
      setStatusMessage('Network error creating resume.');
    } finally {
      setSaving(false);
    }
  };

  // Export the rendered document as an editable Word (.doc) file.
  const handleDownloadDoc = () => {
    const el = document.getElementById('printable-resume');
    if (!el) return;
    const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head><meta charset="utf-8"><title>${current.personalInfo.fullName} — Resume</title>
<style>
  body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #111; max-width: 700px; margin: 24px auto; }
  h1 { font-size: 20pt; margin-bottom: 2pt; } h2 { font-size: 12pt; margin: 12pt 0 4pt; }
  p { margin: 0 0 6pt; } ul { margin: 4pt 0 8pt 18pt; padding: 0; } li { margin-bottom: 2pt; }
</style></head><body>${el.innerHTML}</body></html>`;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${current.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.doc`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Generic "pull from portfolio model" panel — lists DB items with one-click add.
  const renderImportPanel = (opts: {
    title: string;
    items: { id: string; title: string; subtitle?: string }[];
    alreadyAdded: (id: string) => boolean;
    onImport: (id: string) => void;
  }) => {
    const pending = opts.items.filter((i) => !opts.alreadyAdded(i.id));
    if (pending.length === 0) return null;
    return (
      <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/10 p-4 space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
          <Database className="h-3.5 w-3.5" />
          <span>{opts.title} — from Portfolio Data ({pending.length})</span>
        </div>
        <div className="space-y-1.5">
          {pending.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
              <div className="min-w-0">
                <div className="font-semibold text-white text-xs truncate">{item.title}</div>
                {item.subtitle && <div className="text-[10px] text-slate-500 truncate">{item.subtitle}</div>}
              </div>
              <button
                type="button"
                onClick={() => opts.onImport(item.id)}
                className="shrink-0 ml-2 flex items-center gap-1 rounded bg-emerald-700/80 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-emerald-600"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- Work Experience Handlers ---
  const handleStartEditExp = (idx: number) => {
    const item = current.workExperiences[idx];
    setEditingExpIndex(idx);
    setExpCompany(item.company);
    setExpPosition(item.position);
    setExpLocation(item.location || '');
    setExpStartDate(item.startDate);
    setExpEndDate(item.endDate || '');
    setExpCurrent(Boolean(item.current));
    setExpBullets(Array.isArray(item.bulletPoints) ? item.bulletPoints.join('\n') : '');
  };

  const handleSaveExp = () => {
    const bulletsList = expBullets.split('\n').map((b) => b.trim()).filter(Boolean);
    const updatedExp: ResumeWorkItem = {
      company: expCompany,
      position: expPosition,
      location: expLocation || undefined,
      startDate: expStartDate,
      endDate: expCurrent ? undefined : expEndDate,
      current: expCurrent,
      bulletPoints: bulletsList,
    };

    const exps = [...current.workExperiences];
    if (editingExpIndex !== null && editingExpIndex >= 0) {
      exps[editingExpIndex] = updatedExp;
    } else {
      exps.push(updatedExp);
    }

    setCurrent({ ...current, workExperiences: exps });
    setEditingExpIndex(null);
  };

  const handleDeleteExp = (idx: number) => {
    const exps = current.workExperiences.filter((_, i) => i !== idx);
    setCurrent({ ...current, workExperiences: exps });
    if (editingExpIndex === idx) setEditingExpIndex(null);
  };

  // --- Project Handlers ---
  const handleStartEditProj = (idx: number) => {
    const item = current.projects[idx];
    setEditingProjIndex(idx);
    setProjName(item.name);
    setProjRole(item.role || '');
    setProjTech(Array.isArray(item.technologies) ? item.technologies.join(', ') : '');
    setProjBullets(Array.isArray(item.bulletPoints) ? item.bulletPoints.join('\n') : '');
  };

  const handleSaveProj = () => {
    const bulletsList = projBullets.split('\n').map((b) => b.trim()).filter(Boolean);
    const techList = projTech.split(',').map((t) => t.trim()).filter(Boolean);
    const updatedProj: ResumeProjectItem = {
      name: projName,
      role: projRole || undefined,
      technologies: techList,
      bulletPoints: bulletsList,
    };

    const projs = [...current.projects];
    if (editingProjIndex !== null && editingProjIndex >= 0) {
      projs[editingProjIndex] = updatedProj;
    } else {
      projs.push(updatedProj);
    }

    setCurrent({ ...current, projects: projs });
    setEditingProjIndex(null);
  };

  const handleDeleteProj = (idx: number) => {
    const projs = current.projects.filter((_, i) => i !== idx);
    setCurrent({ ...current, projects: projs });
    if (editingProjIndex === idx) setEditingProjIndex(null);
  };

  // --- Education Handlers ---
  const handleDeleteEdu = (idx: number) => {
    const edus = current.education.filter((_, i) => i !== idx);
    setCurrent({ ...current, education: edus });
  };

  // --- Skills Handlers ---
  const handleDeleteSkillGroup = (catIdx: number) => {
    const skillsList = [...(current.skills || current.technicalSkills || [])];
    skillsList.splice(catIdx, 1);
    setCurrent({ ...current, skills: skillsList, technicalSkills: skillsList });
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
      <AdminHeader
        title="Resume Architect & Template Studio"
        subtitle="Manage resume versions, edit sections and bullet points, and export high-parse ATS PDF documents"
        actionButton={
          <div className="flex items-center gap-2">
            <select
              value={current.id}
              onChange={(e) => {
                const r = resumes.find((x) => x.id === e.target.value);
                if (r) setCurrent(r);
              }}
              title="Resume version"
              className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-xs text-white max-w-[160px]"
            >
              {resumes.length === 0 && <option value="">(unsaved)</option>}
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
              {current.id && !resumes.some((r) => r.id === current.id) && <option value={current.id}>{current.title}</option>}
            </select>
            <button
              onClick={handleNewResume}
              disabled={saving}
              title="Create a new resume pre-filled from your portfolio data"
              className="flex items-center gap-1.5 rounded-lg border border-emerald-800/60 bg-emerald-950/40 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/40 transition-colors disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              <span>New</span>
            </button>
            <button
              onClick={() => setDocEditMode((v) => !v)}
              title={docEditMode ? 'Disable click-to-edit on the document' : 'Edit text directly on the document'}
              className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors ${
                docEditMode
                  ? 'border-blue-500 bg-blue-950/50 text-blue-300'
                  : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {docEditMode ? <PenLine className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{docEditMode ? 'Editing' : 'Edit Doc'}</span>
            </button>
            <button
              onClick={handleDownloadDoc}
              title="Download as editable .doc (opens in Word / Google Docs)"
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>.doc</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Resume'}</span>
            </button>
            <button
              onClick={handleDeleteResume}
              className="flex items-center gap-1 rounded-lg border border-rose-900/60 bg-rose-950/20 px-3 py-2 text-xs text-rose-400 hover:bg-rose-900/40 hover:text-white transition-colors"
              title="Delete Resume Version"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        }
      />

      {statusMessage && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Editor Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-800 pb-3 text-xs">
        {[
          { id: 'design', label: 'Design & Templates', icon: Sliders },
          { id: 'personal', label: 'Personal Details', icon: User },
          { id: 'experience', label: `Experience (${current.workExperiences.length})`, icon: Briefcase },
          { id: 'projects', label: `Projects (${current.projects.length})`, icon: FolderGit2 },
          { id: 'education', label: `Education (${current.education.length})`, icon: GraduationCap },
          { id: 'skills', label: `Skills (${(current.skills || current.technicalSkills || []).length})`, icon: Wrench },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                active
                  ? 'bg-blue-600 text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column Controls */}
        <div className="lg:col-span-5 space-y-4 text-xs">
          {/* TAB 1: DESIGN & TEMPLATES */}
          {activeTab === 'design' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 space-y-3">
                <div className="flex items-center gap-2 font-bold text-white text-sm border-b border-slate-800 pb-2">
                  <Sliders className="h-4 w-4 text-blue-400" />
                  <span>Layout Template</span>
                </div>

                <div className="space-y-2">
                  {TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() =>
                        setCurrent({
                          ...current,
                          settings: { ...current.settings, template: tmpl.id },
                        })
                      }
                      className={`w-full p-3 rounded-lg text-left transition-all border ${
                        current.settings.template === tmpl.id
                          ? 'border-blue-500 bg-blue-950/30 text-white shadow-md'
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-bold text-xs">{tmpl.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{tmpl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 space-y-4">
                <div className="flex items-center gap-2 font-bold text-white text-sm border-b border-slate-800 pb-2">
                  <Type className="h-4 w-4 text-blue-400" />
                  <span>Typography & Spacing</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-mono text-[11px]">Font Family</label>
                    <select
                      value={current.settings.fontFamily || 'Inter'}
                      onChange={(e) =>
                        setCurrent({
                          ...current,
                          settings: { ...current.settings, fontFamily: e.target.value as any },
                        })
                      }
                      className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-white"
                    >
                      <option value="Inter">Inter (Sans)</option>
                      <option value="Roboto">Roboto (Clean)</option>
                      <option value="Merriweather">Merriweather (Serif)</option>
                      <option value="JetBrains Mono">JetBrains Mono (Code)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-mono text-[11px]">Font Size</label>
                    <select
                      value={current.settings.fontSize || 'base'}
                      onChange={(e) =>
                        setCurrent({
                          ...current,
                          settings: { ...current.settings, fontSize: e.target.value as any },
                        })
                      }
                      className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-white"
                    >
                      <option value="sm">Compact (9pt)</option>
                      <option value="base">Standard (10pt)</option>
                      <option value="lg">Spacious (11pt)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-mono text-[11px]">Spacing</label>
                    <select
                      value={current.settings.spacing || 'normal'}
                      onChange={(e) =>
                        setCurrent({
                          ...current,
                          settings: { ...current.settings, spacing: e.target.value as any },
                        })
                      }
                      className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-white"
                    >
                      <option value="compact">Tight (1-Page)</option>
                      <option value="normal">Balanced (Standard)</option>
                      <option value="spacious">Relaxed (Multi-Page)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-mono text-[11px]">Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={current.settings.accentColor || '#2563eb'}
                        onChange={(e) =>
                          setCurrent({
                            ...current,
                            settings: { ...current.settings, accentColor: e.target.value },
                          })
                        }
                        className="h-8 w-8 rounded border border-slate-700 bg-slate-900 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={current.settings.accentColor || '#2563eb'}
                        onChange={(e) =>
                          setCurrent({
                            ...current,
                            settings: { ...current.settings, accentColor: e.target.value },
                          })
                        }
                        className="w-24 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-white font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAL INFO */}
          {activeTab === 'personal' && (
            <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 space-y-4">
              <div className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                Personal & Contact Information
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={current.personalInfo.fullName}
                  onChange={(e) =>
                    setCurrent({
                      ...current,
                      personalInfo: { ...current.personalInfo, fullName: e.target.value },
                    })
                  }
                  className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Professional Title</label>
                <input
                  type="text"
                  value={current.personalInfo.professionalTitle}
                  onChange={(e) =>
                    setCurrent({
                      ...current,
                      personalInfo: { ...current.personalInfo, professionalTitle: e.target.value },
                    })
                  }
                  className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={current.personalInfo.email}
                    onChange={(e) =>
                      setCurrent({
                        ...current,
                        personalInfo: { ...current.personalInfo, email: e.target.value },
                      })
                    }
                    className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={current.personalInfo.phone || ''}
                    onChange={(e) =>
                      setCurrent({
                        ...current,
                        personalInfo: { ...current.personalInfo, phone: e.target.value },
                      })
                    }
                    className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  value={current.personalInfo.location}
                  onChange={(e) =>
                    setCurrent({
                      ...current,
                      personalInfo: { ...current.personalInfo, location: e.target.value },
                    })
                  }
                  className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">LinkedIn Profile</label>
                <input
                  type="text"
                  value={current.personalInfo.linkedin || ''}
                  onChange={(e) =>
                    setCurrent({
                      ...current,
                      personalInfo: { ...current.personalInfo, linkedin: e.target.value },
                    })
                  }
                  className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Professional Summary</label>
                <textarea
                  rows={5}
                  value={current.personalInfo.summary}
                  onChange={(e) =>
                    setCurrent({
                      ...current,
                      personalInfo: { ...current.personalInfo, summary: e.target.value },
                    })
                  }
                  className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 3: WORK EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              {renderImportPanel({
                title: 'Work Experience',
                items: portfolioExperiences.map((e) => ({
                  id: e.id,
                  title: `${e.position} — ${e.company}`,
                  subtitle: `${e.startDate} – ${e.current ? 'Present' : e.endDate || ''}`,
                })),
                alreadyAdded: (id) => {
                  const src = portfolioExperiences.find((e) => e.id === id);
                  return !!src && current.workExperiences.some((w) => w.company === src.company && w.position === src.position);
                },
                onImport: (id) => {
                  const src = portfolioExperiences.find((e) => e.id === id);
                  if (!src) return;
                  setCurrent({ ...current, workExperiences: [...current.workExperiences, experienceToResume(src)] });
                },
              })}
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Work Experience Items</span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingExpIndex(-1);
                    setExpCompany('');
                    setExpPosition('');
                    setExpLocation('');
                    setExpStartDate('');
                    setExpEndDate('');
                    setExpCurrent(true);
                    setExpBullets('');
                  }}
                  className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Experience</span>
                </button>
              </div>

              {editingExpIndex !== null && (
                <div className="rounded-xl border border-blue-500/40 bg-[#0e1422] p-4 space-y-3">
                  <div className="font-bold text-blue-400 text-xs">
                    {editingExpIndex >= 0 ? 'Edit Role in Resume' : 'Add New Role to Resume'}
                  </div>
                  <input
                    type="text"
                    placeholder="Company"
                    value={expCompany}
                    onChange={(e) => setExpCompany(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Job Title / Position"
                    value={expPosition}
                    onChange={(e) => setExpPosition(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Start Date"
                      value={expStartDate}
                      onChange={(e) => setExpStartDate(e.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-white"
                    />
                    <input
                      type="text"
                      placeholder="End Date"
                      value={expEndDate}
                      disabled={expCurrent}
                      onChange={(e) => setExpEndDate(e.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-white disabled:opacity-50"
                    />
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Bullet points (one per line)"
                    value={expBullets}
                    onChange={(e) => setExpBullets(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-white font-mono text-[11px]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingExpIndex(null)}
                      className="rounded border border-slate-700 px-3 py-1 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveExp}
                      className="rounded bg-blue-600 px-3 py-1 font-bold text-white"
                    >
                      Apply to Resume
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {current.workExperiences.map((exp, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-[#0e1422] p-3.5 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white">{exp.position}</div>
                      <div className="text-slate-400 text-[11px]">
                        {exp.company} • {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStartEditExp(idx)}
                        className="p-1 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800"
                        title="Edit Item"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteExp(idx)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                        title="Delete Item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              {renderImportPanel({
                title: 'Projects',
                items: portfolioProjects.map((p) => ({
                  id: p.id,
                  title: p.name,
                  subtitle: p.technologies?.slice(0, 4).join(', '),
                })),
                alreadyAdded: (id) => {
                  const src = portfolioProjects.find((p) => p.id === id);
                  return !!src && current.projects.some((r) => r.name === src.name);
                },
                onImport: (id) => {
                  const src = portfolioProjects.find((p) => p.id === id);
                  if (!src) return;
                  setCurrent({ ...current, projects: [...current.projects, projectToResume(src)] });
                },
              })}
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Resume Projects</span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProjIndex(-1);
                    setProjName('');
                    setProjRole('Lead Engineer');
                    setProjTech('');
                    setProjBullets('');
                  }}
                  className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              {editingProjIndex !== null && (
                <div className="rounded-xl border border-blue-500/40 bg-[#0e1422] p-4 space-y-3">
                  <div className="font-bold text-blue-400 text-xs">
                    {editingProjIndex >= 0 ? 'Edit Project in Resume' : 'Add New Project to Resume'}
                  </div>
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={projName}
                    onChange={(e) => setProjName(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g. Lead Full Stack Engineer)"
                    value={projRole}
                    onChange={(e) => setProjRole(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Technologies (comma-separated)"
                    value={projTech}
                    onChange={(e) => setProjTech(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-white"
                  />
                  <textarea
                    rows={4}
                    placeholder="Bullet points (one per line)"
                    value={projBullets}
                    onChange={(e) => setProjBullets(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-white font-mono text-[11px]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProjIndex(null)}
                      className="rounded border border-slate-700 px-3 py-1 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProj}
                      className="rounded bg-blue-600 px-3 py-1 font-bold text-white"
                    >
                      Apply to Resume
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {current.projects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-[#0e1422] p-3.5 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white">{proj.name}</div>
                      <div className="text-slate-400 text-[11px]">
                        {proj.role} • {proj.technologies?.slice(0, 3).join(', ')}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStartEditProj(idx)}
                        className="p-1 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800"
                        title="Edit Item"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProj(idx)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                        title="Delete Item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: EDUCATION */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              {renderImportPanel({
                title: 'Education',
                items: portfolioEducation.map((e) => ({
                  id: e.id,
                  title: `${e.degree} — ${e.institution}`,
                  subtitle: `${e.fieldOfStudy} • ${e.startDate} – ${e.endDate}`,
                })),
                alreadyAdded: (id) => {
                  const src = portfolioEducation.find((e) => e.id === id);
                  return !!src && current.education.some((r) => r.degree === src.degree && r.institution === src.institution);
                },
                onImport: (id) => {
                  const src = portfolioEducation.find((e) => e.id === id);
                  if (!src) return;
                  setCurrent({ ...current, education: [...current.education, educationToResume(src)] });
                },
              })}
              {renderImportPanel({
                title: 'Certifications',
                items: portfolioCertifications.map((c) => ({
                  id: c.id,
                  title: c.name,
                  subtitle: c.issuer || c.issuingOrganization,
                })),
                alreadyAdded: (id) => {
                  const src = portfolioCertifications.find((c) => c.id === id);
                  return !!src && (current.certifications || []).some((r) => r.name === src.name);
                },
                onImport: (id) => {
                  const src = portfolioCertifications.find((c) => c.id === id);
                  if (!src) return;
                  setCurrent({ ...current, certifications: [...(current.certifications || []), certificationToResume(src)] });
                },
              })}
              <span className="font-bold text-white text-sm">Resume Education Entries</span>
              <div className="space-y-2">
                {current.education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-[#0e1422] p-3.5 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white">{edu.degree}</div>
                      <div className="text-slate-400 text-[11px]">
                        {edu.institution} • {edu.startDate} – {edu.endDate || edu.year}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteEdu(idx)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                      title="Remove from Resume"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              {portfolioSkills.length > 0 && (
                <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/10 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <Database className="h-3.5 w-3.5" />
                    <span>Skills — from Portfolio Data ({portfolioSkills.length} skills)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const groups = skillsToResumeGroups(portfolioSkills);
                      setCurrent({ ...current, skills: groups, technicalSkills: groups });
                    }}
                    className="flex items-center gap-1 rounded bg-emerald-700/80 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-emerald-600"
                  >
                    <Plus className="h-3 w-3" /> Replace skills with portfolio skill groups
                  </button>
                </div>
              )}
              <span className="font-bold text-white text-sm">Technical Skills Groups in Resume</span>
              <div className="space-y-2">
                {(current.skills || current.technicalSkills || []).map((cat, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-[#0e1422] p-3.5 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white">{cat.category}</div>
                      <div className="text-slate-400 text-[11px] truncate max-w-xs">
                        {cat.skills.join(', ')}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteSkillGroup(idx)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                      title="Remove Skill Group"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Interactive Resume Preview */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
            <span>Live Document Render ({current.settings.template})</span>
            <span>{docEditMode ? 'Click any text to edit it' : 'A4 Document Canvas'}</span>
          </div>

          <div
            className={`rounded-xl border shadow-2xl bg-white overflow-hidden max-h-[85vh] overflow-y-auto flex justify-center p-4 transition-colors ${
              docEditMode ? 'border-blue-500/60 ring-1 ring-blue-500/30' : 'border-slate-800'
            }`}
          >
            <ResumeRenderer resume={current} editable={docEditMode} onEdit={handleDocEdit} />
          </div>
        </div>
      </div>
    </div>
  );
}

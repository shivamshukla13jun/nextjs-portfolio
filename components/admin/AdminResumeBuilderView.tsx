import React, { useState } from 'react';
import { Resume, ResumeTemplateId, ResumeWorkItem, ResumeProjectItem, ResumeEducationItem } from '@/types/resume';
import { Experience, Project } from '@/types/portfolio';
import AdminHeader from './AdminHeader';
import ResumeRenderer from '../resume/ResumeRenderer';
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
} from 'lucide-react';

interface AdminResumeBuilderViewProps {
  resumes: Resume[];
  activeResume: Resume;
  portfolioExperiences: Experience[];
  portfolioProjects: Project[];
  onUpdated: () => void;
}

const TEMPLATES: { id: ResumeTemplateId; name: string; desc: string }[] = [
  { id: 'modern', name: 'Modern Developer', desc: 'Slick blue accent dividers, two-column skills, clean hierarchy.' },
  { id: 'ats', name: 'ATS Friendly', desc: 'Standard single-column, 100% parse-rate recruiter standard.' },
  { id: 'minimal', name: 'Minimal Professional', desc: 'Monochrome, understated typography, high information density.' },
  { id: 'two-column', name: 'Two Column', desc: 'Sidebar for contact, skills, and education; right for experience.' },
  { id: 'executive', name: 'Executive', desc: 'Serif headings, formal leadership tone for Staff/Lead roles.' },
];

export default function AdminResumeBuilderView({
  resumes,
  activeResume,
  portfolioExperiences,
  portfolioProjects,
  onUpdated,
}: AdminResumeBuilderViewProps) {
  const [current, setCurrent] = useState<Resume>(activeResume);
  const [activeTab, setActiveTab] = useState<'design' | 'personal' | 'experience' | 'projects' | 'education' | 'skills'>('design');
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

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
            <span>A4 Document Canvas</span>
          </div>

          <div className="rounded-xl border border-slate-800 shadow-2xl bg-white overflow-hidden max-h-[85vh] overflow-y-auto flex justify-center p-4">
            <ResumeRenderer resume={current} />
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Project } from '@/types/portfolio';
import AdminHeader from './AdminHeader';
import { FolderGit2, Plus, Trash2, Edit2, ExternalLink, Github, Star, X, Check } from 'lucide-react';

interface AdminProjectsViewProps {
  projects: Project[];
  onUpdated: () => void;
}

export default function AdminProjectsView({ projects, onUpdated }: AdminProjectsViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSlugOrId, setEditingSlugOrId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [technologies, setTechnologies] = useState('Node.js, Express.js, MongoDB, Redis, React.js');
  const [githubUrl, setGithubUrl] = useState('https://github.com/shivamshukla13');
  const [liveUrl, setLiveUrl] = useState('');
  const [featured, setFeatured] = useState(true);
  const [features, setFeatures] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [challenges, setChallenges] = useState('');
  const [results, setResults] = useState('');
  const [flow, setFlow] = useState('');
  const [images, setImages] = useState('');
  const [architectureTree, setArchitectureTree] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const toLines = (v: string) => v.split('\n').map((s) => s.trim()).filter(Boolean);

  const resetForm = () => {
    setName('');
    setSlug('');
    setShortDescription('');
    setDetailedDescription('');
    setProblem('');
    setSolution('');
    setTechnologies('Node.js, Express.js, MongoDB, Redis, React.js');
    setGithubUrl('https://github.com/shivamshukla13');
    setLiveUrl('');
    setFeatured(true);
    setFeatures('');
    setResponsibilities('');
    setChallenges('');
    setResults('');
    setFlow('');
    setImages('');
    setArchitectureTree('');
    setCategory('');
    setStartDate('');
    setEndDate('');
    setShowAddForm(false);
    setEditingSlugOrId(null);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingSlugOrId && (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  };

  const handleStartEdit = (p: Project) => {
    setEditingSlugOrId(p.slug || p.id);
    setName(p.name);
    setSlug(p.slug);
    setShortDescription(p.shortDescription);
    setDetailedDescription(p.detailedDescription || p.shortDescription);
    setProblem(p.problem || '');
    setSolution(p.solution || '');
    setTechnologies(Array.isArray(p.technologies) ? p.technologies.join(', ') : '');
    setGithubUrl(p.githubUrl || '');
    setLiveUrl(p.liveUrl || '');
    setFeatured(Boolean(p.featured));
    setFeatures((p.features || []).join('\n'));
    setResponsibilities((p.responsibilities || []).join('\n'));
    setChallenges((p.challenges || []).join('\n'));
    setResults((p.results || []).join('\n'));
    setFlow((p.flow || []).join('\n'));
    setImages((p.images || []).join('\n'));
    setArchitectureTree(p.architectureTree || '');
    setCategory(p.category || '');
    setStartDate(p.startDate || '');
    setEndDate(p.endDate || '');
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const techList = technologies
        ? technologies.split(',').map((t) => t.trim()).filter(Boolean)
        : [];
      const autoSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      const payload = {
        name,
        slug: autoSlug,
        shortDescription,
        detailedDescription: detailedDescription || shortDescription,
        problem,
        solution,
        technologies: techList,
        githubUrl,
        liveUrl,
        featured,
        features: toLines(features),
        responsibilities: toLines(responsibilities),
        challenges: toLines(challenges),
        results: toLines(results),
        flow: toLines(flow),
        images: toLines(images),
        architectureTree,
        category,
        startDate,
        endDate,
      };

      const url = editingSlugOrId ? `/api/portfolio/projects/${editingSlugOrId}` : '/api/portfolio/projects';
      const method = editingSlugOrId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatusMessage(editingSlugOrId ? 'Project updated successfully!' : 'Project saved successfully!');
        resetForm();
        onUpdated();
        setTimeout(() => setStatusMessage(null), 3500);
      } else {
        setStatusMessage('Failed to save project.');
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Network error saving project.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (slugOrId: string, projName: string) => {
    if (!window.confirm(`Delete project "${projName}"?`)) return;
    try {
      const res = await fetch(`/api/portfolio/projects/${slugOrId}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMessage('Project deleted.');
        if (editingSlugOrId === slugOrId) resetForm();
        onUpdated();
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Error deleting project.');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl">
      <AdminHeader
        title="Projects CMS"
        subtitle="Manage architectural case studies, enterprise applications, and logistics platforms"
        actionButton={
          <button
            onClick={() => {
              if (showAddForm) resetForm();
              else setShowAddForm(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
          >
            {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            <span>{showAddForm ? 'Cancel' : 'Add Project'}</span>
          </button>
        }
      />

      {statusMessage && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 rounded-lg flex items-center justify-between">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Add / Edit Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-blue-500/40 bg-[#0e1422] p-5 space-y-4 text-xs shadow-xl shadow-blue-950/20">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <FolderGit2 className="h-4 w-4 text-blue-400" />
              <span>{editingSlugOrId ? 'Edit Project Architecture' : 'New Project Architecture'}</span>
            </div>
            {editingSlugOrId && (
              <span className="text-[11px] font-mono text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                Editing: /{editingSlugOrId}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Project Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. FreightBooks Logistics & Accounting SaaS"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">URL Slug *</label>
              <input
                type="text"
                required
                placeholder="freightbooks-logistics-accounting"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-[11px]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Short Headline Description *</label>
              <input
                type="text"
                required
                placeholder="e.g. Enterprise logistics management with multi-currency billing and RabbitMQ workers."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Detailed Description (Architecture Deep Dive)</label>
              <textarea
                rows={4}
                placeholder="Full case-study description shown on the project detail page..."
                value={detailedDescription}
                onChange={(e) => setDetailedDescription(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Category</label>
              <input
                type="text"
                placeholder="e.g. Enterprise SaaS · Logistics & Accounting"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Start Date</label>
                <input
                  type="text"
                  placeholder="Feb 2025"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">End Date</label>
                <input
                  type="text"
                  placeholder="Present"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Problem Statement</label>
              <textarea
                rows={2}
                placeholder="What challenges did users face before this solution?..."
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Architectural Solution</label>
              <textarea
                rows={2}
                placeholder="How was the MERN/microservices architecture designed to solve this?..."
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">GitHub Repository URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Live Demo URL (optional)</label>
              <input
                type="url"
                placeholder="https://..."
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Technologies Stack (comma-separated)</label>
              <input
                type="text"
                placeholder="Node.js, Express.js, TypeScript, MongoDB, Redis, RabbitMQ, React.js, Docker"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Project Flow (one step per line)</label>
              <textarea
                rows={5}
                placeholder={'Admin onboards company\nDispatchers create loads\nInvoices generated on delivery'}
                value={flow}
                onChange={(e) => setFlow(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Core Features (one per line)</label>
              <textarea
                rows={5}
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Your Responsibilities (one per line)</label>
              <textarea
                rows={5}
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Challenges (one per line)</label>
              <textarea
                rows={4}
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Results / Outcomes (one per line)</label>
              <textarea
                rows={4}
                value={results}
                onChange={(e) => setResults(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Project Images (one URL per line)</label>
              <textarea
                rows={3}
                placeholder={'https://.../screenshot-1.png\n/api/files/<fileId>  (upload via Files CMS)'}
                value={images}
                onChange={(e) => setImages(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-[11px] leading-relaxed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Architecture / Project Tree</label>
              <textarea
                rows={10}
                placeholder={'project/\n├── src/\n│   ├── routes/\n│   └── services/'}
                value={architectureTree}
                onChange={(e) => setArchitectureTree(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-[11px] leading-relaxed whitespace-pre"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="featToggle"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="featToggle" className="text-slate-300 font-medium cursor-pointer">
              Feature on public homepage spotlight
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-500 transition-all disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              <span>{submitting ? 'Saving...' : editingSlugOrId ? 'Update Project' : 'Save Project'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-8 text-center text-slate-400 text-xs">
            No projects found. Click "+ Add Project" above to create an architectural case study.
          </div>
        ) : (
          projects.map((p) => (
            <div
              key={p.id}
              className={`rounded-xl border p-5 flex flex-col justify-between gap-4 transition-all text-xs ${
                editingSlugOrId === (p.slug || p.id)
                  ? 'border-blue-500 bg-[#0e1422] ring-1 ring-blue-500/50'
                  : 'border-slate-800 bg-[#0e1422] hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">{p.name}</h3>
                    {p.featured && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 text-[10px] font-mono">
                        <Star className="h-3 w-3 fill-amber-400" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">/{p.slug}</span>
                </div>

                <p className="text-slate-300 leading-relaxed">{p.shortDescription}</p>

                {p.problem && (
                  <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded border border-slate-800/60">
                    <span className="font-semibold text-slate-300">Challenge: </span>
                    {p.problem}
                  </div>
                )}

                {p.technologies && p.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.technologies.map((t, i) => (
                      <span key={i} className="rounded bg-slate-800/90 border border-slate-700/60 px-2 py-0.5 text-[10px] text-slate-300 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
                <div className="flex items-center gap-3">
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-slate-400 hover:text-white"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span>Code</span>
                    </a>
                  )}
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Demo</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartEdit(p)}
                    className="flex items-center gap-1 rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                    title="Edit Project"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-blue-400" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(p.slug || p.id, p.name)}
                    className="flex items-center gap-1 rounded border border-rose-900/60 bg-rose-950/20 px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-900/40 hover:text-white transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

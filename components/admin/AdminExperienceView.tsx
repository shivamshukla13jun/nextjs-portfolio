import React, { useState } from 'react';
import { Experience } from '@/types/portfolio';
import AdminHeader from './AdminHeader';
import { Briefcase, Plus, Trash2, Edit2, Calendar, MapPin, X, Check } from 'lucide-react';

interface AdminExperienceViewProps {
  experiences: Experience[];
  onUpdated: () => void;
}

export default function AdminExperienceView({ experiences, onUpdated }: AdminExperienceViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form state
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('Mumbai, Maharashtra, India');
  const [employmentType, setEmploymentType] = useState<any>('Full-time');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [current, setCurrent] = useState(false);
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [technologies, setTechnologies] = useState('');

  const resetForm = () => {
    setCompany('');
    setPosition('');
    setLocation('Mumbai, Maharashtra, India');
    setEmploymentType('Full-time');
    setStartDate('');
    setEndDate('');
    setCurrent(false);
    setDescription('');
    setResponsibilities('');
    setTechnologies('');
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleStartEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setCompany(exp.company);
    setPosition(exp.position);
    setLocation(exp.location || 'Mumbai, Maharashtra, India');
    setEmploymentType(exp.employmentType || 'Full-time');
    setStartDate(exp.startDate || '');
    setEndDate(exp.endDate || '');
    setCurrent(Boolean(exp.current));
    setDescription(exp.description || '');
    setResponsibilities(Array.isArray(exp.responsibilities) ? exp.responsibilities.join('\n') : '');
    setTechnologies(Array.isArray(exp.technologies) ? exp.technologies.join(', ') : '');
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const respList = responsibilities
        ? responsibilities.split('\n').map((r) => r.trim()).filter(Boolean)
        : [];
      const techList = technologies
        ? technologies.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      const payload = {
        company,
        position,
        location,
        employmentType,
        startDate,
        endDate: current ? undefined : endDate,
        current,
        description: description || `Software development at ${company}`,
        responsibilities: respList,
        technologies: techList,
        achievements: [],
      };

      const url = editingId ? `/api/portfolio/experiences/${editingId}` : '/api/portfolio/experiences';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatusMessage(editingId ? 'Work experience updated successfully!' : 'Work experience added successfully!');
        resetForm();
        onUpdated();
        setTimeout(() => setStatusMessage(null), 3500);
      } else {
        setStatusMessage('Failed to save experience.');
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Network error saving experience.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, roleTitle: string) => {
    if (!window.confirm(`Delete experience record for "${roleTitle}"?`)) return;
    try {
      const res = await fetch(`/api/portfolio/experiences/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMessage('Experience deleted.');
        if (editingId === id) resetForm();
        onUpdated();
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Error deleting experience.');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl">
      <AdminHeader
        title="Experience CMS"
        subtitle="Manage engineering roles, career milestones, responsibilities, and technical achievements"
        actionButton={
          <button
            onClick={() => {
              if (showAddForm) resetForm();
              else setShowAddForm(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
          >
            {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            <span>{showAddForm ? 'Cancel' : 'Add Experience'}</span>
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
              <Briefcase className="h-4 w-4 text-blue-400" />
              <span>{editingId ? 'Edit Career Role' : 'New Career Milestone'}</span>
            </div>
            {editingId && (
              <span className="text-[11px] font-mono text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                Editing ID: {editingId}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Wing Global IT Service Ltd"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Position / Role Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior MERN Stack Developer"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Location</label>
              <input
                type="text"
                placeholder="e.g. Mumbai, Maharashtra, India"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Employment Type</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as any)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Start Date *</label>
              <input
                type="text"
                required
                placeholder="e.g. Feb 2025"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">End Date</label>
              <input
                type="text"
                disabled={current}
                placeholder={current ? 'Present' : 'e.g. Jan 2025'}
                value={current ? 'Present' : endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
              />
              <div className="flex items-center gap-1.5 mt-1.5">
                <input
                  type="checkbox"
                  id="currToggle"
                  checked={current}
                  onChange={(e) => setCurrent(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-blue-600"
                />
                <label htmlFor="currToggle" className="text-slate-400 text-[11px] cursor-pointer">
                  I currently work in this role
                </label>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Role Description</label>
              <textarea
                rows={2}
                placeholder="High-level overview of team scope and architecture..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Key Responsibilities & Achievements (One per line)</label>
              <textarea
                rows={4}
                placeholder="Develop secure and scalable REST APIs&#10;Implement Redis caching for performance optimization&#10;Use RabbitMQ for background jobs and async workflows"
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-xs leading-relaxed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Technologies Used (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. Node.js, TypeScript, React.js, Express.js, MongoDB, Redis, RabbitMQ, Docker"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
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
              <span>{submitting ? 'Saving...' : editingId ? 'Update Role' : 'Save Experience'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Experience Cards List */}
      <div className="space-y-4">
        {experiences.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-8 text-center text-slate-400 text-xs">
            No work experience records found. Click "+ Add Experience" above to begin.
          </div>
        ) : (
          experiences.map((exp) => (
            <div
              key={exp.id}
              className={`rounded-xl border p-5 flex flex-col justify-between gap-4 transition-all text-xs ${
                editingId === exp.id
                  ? 'border-blue-500 bg-[#0e1422] ring-1 ring-blue-500/50'
                  : 'border-slate-800 bg-[#0e1422] hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">{exp.position}</h3>
                      {exp.current && (
                        <span className="rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 text-[10px] font-mono">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-blue-400 font-semibold text-xs mt-0.5">{exp.company}</div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-slate-400 font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-500" />
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-500" />
                        {exp.location}
                      </span>
                    )}
                  </div>
                </div>

                {exp.description && <p className="text-slate-300 leading-relaxed">{exp.description}</p>}

                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <div className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider font-mono">
                      Key Highlights & Bullets:
                    </div>
                    <ul className="space-y-1 text-slate-300">
                      {exp.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                    {exp.technologies.map((t, i) => (
                      <span key={i} className="rounded bg-slate-800/90 border border-slate-700/60 px-2 py-0.5 text-[10px] text-slate-300 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => handleStartEdit(exp)}
                  className="flex items-center gap-1 rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                  title="Edit Role"
                >
                  <Edit2 className="h-3.5 w-3.5 text-blue-400" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(exp.id, `${exp.position} @ ${exp.company}`)}
                  className="flex items-center gap-1 rounded border border-rose-900/60 bg-rose-950/20 px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-900/40 hover:text-white transition-colors"
                  title="Delete Role"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

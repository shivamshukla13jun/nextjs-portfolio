import React, { useState } from 'react';
import { Education } from '@/types/portfolio';
import AdminHeader from './AdminHeader';
import { GraduationCap, Plus, Trash2, Edit2, MapPin, Calendar, Award, X, Check } from 'lucide-react';

interface AdminEducationViewProps {
  education: Education[];
  onUpdated: () => void;
}

export default function AdminEducationView({ education, onUpdated }: AdminEducationViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form state
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [grade, setGrade] = useState('');
  const [location, setLocation] = useState('');
  const [activities, setActivities] = useState('');
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setInstitution('');
    setDegree('');
    setFieldOfStudy('');
    setStartDate('');
    setEndDate('');
    setGrade('');
    setLocation('');
    setActivities('');
    setDescription('');
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleStartEdit = (edu: Education) => {
    setEditingId(edu.id);
    setInstitution(edu.institution);
    setDegree(edu.degree);
    setFieldOfStudy(edu.fieldOfStudy || '');
    setStartDate(edu.startDate || '');
    setEndDate(edu.endDate || '');
    setGrade(edu.grade || '');
    setLocation(edu.location || '');
    setActivities(Array.isArray(edu.activities) ? edu.activities.join(', ') : '');
    setDescription(edu.description || '');
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const activitiesList = activities
        ? activities.split(',').map((a) => a.trim()).filter(Boolean)
        : [];

      const payload = {
        institution,
        degree,
        fieldOfStudy,
        startDate,
        endDate,
        grade,
        location,
        activities: activitiesList,
        description,
      };

      const url = editingId ? `/api/portfolio/education/${editingId}` : '/api/portfolio/education';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatusMessage(editingId ? 'Education record updated successfully!' : 'Education record added successfully!');
        resetForm();
        onUpdated();
        setTimeout(() => setStatusMessage(null), 3500);
      } else {
        setStatusMessage('Failed to save education record.');
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Network error saving education record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, instName: string) => {
    if (!window.confirm(`Are you sure you want to delete education record for "${instName}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/portfolio/education/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMessage('Education record deleted.');
        if (editingId === id) resetForm();
        onUpdated();
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Error deleting record.');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl">
      <AdminHeader
        title="Education & Academics"
        subtitle="Manage formal academic credentials, degrees, and college coursework"
        actionButton={
          <button
            onClick={() => {
              if (showAddForm) resetForm();
              else setShowAddForm(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
          >
            {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            <span>{showAddForm ? 'Cancel' : 'Add Education'}</span>
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
              <GraduationCap className="h-4 w-4 text-blue-400" />
              <span>{editingId ? 'Edit Academic Credential' : 'New Academic Degree / Diploma'}</span>
            </div>
            {editingId && (
              <span className="text-[11px] font-mono text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                Editing ID: {editingId}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Institution / University *</label>
              <input
                type="text"
                required
                placeholder="e.g. SN College, Mumbai University"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Degree *</label>
              <input
                type="text"
                required
                placeholder="e.g. Bachelor of Science (B.Sc)"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Field of Study *</label>
              <input
                type="text"
                required
                placeholder="e.g. Information Technology"
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Grade / Distinction</label>
              <input
                type="text"
                placeholder="e.g. First Class with Distinction"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Start Date / Year *</label>
              <input
                type="text"
                required
                placeholder="e.g. 2019"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">End Date / Year *</label>
              <input
                type="text"
                required
                placeholder="e.g. 2022"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
              <label className="block text-slate-400 mb-1 font-medium">Activities / Societies (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. Software Engineering Lead, Tech Symposium Co-convener"
                value={activities}
                onChange={(e) => setActivities(e.target.value)}
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
              <span>{submitting ? 'Saving...' : editingId ? 'Update Education' : 'Save Education'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Education Cards List */}
      <div className="space-y-4">
        {education.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-8 text-center text-slate-400 text-xs">
            No education records added yet. Click "+ Add Education" above to add your first academic credential.
          </div>
        ) : (
          education.map((edu) => (
            <div
              key={edu.id}
              className={`rounded-xl border p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-all ${
                editingId === edu.id
                  ? 'border-blue-500 bg-[#0e1422] ring-1 ring-blue-500/50'
                  : 'border-slate-800 bg-[#0e1422] hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-sm">
                    {edu.degree} in {edu.fieldOfStudy}
                  </h3>
                  <div className="text-xs font-semibold text-blue-400">{edu.institution}</div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                      {edu.startDate} – {edu.endDate}
                    </span>
                    {edu.location && (
                      <span className="flex items-center gap-1 text-[11px]">
                        <MapPin className="h-3.5 w-3.5 text-slate-500" />
                        {edu.location}
                      </span>
                    )}
                    {edu.grade && (
                      <span className="flex items-center gap-1 rounded bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-emerald-400">
                        <Award className="h-3 w-3" />
                        {edu.grade}
                      </span>
                    )}
                  </div>

                  {edu.activities && Array.isArray(edu.activities) && edu.activities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {edu.activities.map((act, i) => (
                        <span key={i} className="rounded bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 text-[10px] text-slate-300 font-mono">
                          {act}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => handleStartEdit(edu)}
                  className="flex items-center gap-1 rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                  title="Edit Education"
                >
                  <Edit2 className="h-3.5 w-3.5 text-blue-400" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(edu.id, edu.institution)}
                  className="flex items-center gap-1 rounded border border-rose-900/60 bg-rose-950/20 px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-900/40 hover:text-white transition-colors"
                  title="Delete Education"
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

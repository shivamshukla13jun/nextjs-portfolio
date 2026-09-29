import React, { useState } from 'react';
import { Skill, SkillCategory } from '@/types/portfolio';
import AdminHeader from './AdminHeader';
import { Cpu, Plus, Trash2, Edit2, Star, X, Check } from 'lucide-react';

interface AdminSkillsViewProps {
  skills: Skill[];
  onUpdated: () => void;
}

export default function AdminSkillsView({ skills, onUpdated }: AdminSkillsViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SkillCategory>('Backend');
  const [proficiency, setProficiency] = useState<number>(90);
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(3);
  const [featured, setFeatured] = useState<boolean>(true);

  const resetForm = () => {
    setName('');
    setCategory('Backend');
    setProficiency(90);
    setYearsOfExperience(3);
    setFeatured(true);
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleStartEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setName(skill.name);
    setCategory(skill.category as any);
    setProficiency(skill.proficiency || 85);
    setYearsOfExperience(skill.yearsOfExperience || 2);
    setFeatured(Boolean(skill.featured));
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        category,
        proficiency,
        yearsOfExperience,
        featured,
      };

      const url = editingId ? `/api/portfolio/skills/${editingId}` : '/api/portfolio/skills';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatusMessage(editingId ? `Skill "${name}" updated!` : `Skill "${name}" added!`);
        resetForm();
        onUpdated();
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        setStatusMessage('Failed to save skill.');
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Network error saving skill.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, skillName: string) => {
    if (!window.confirm(`Delete skill "${skillName}"?`)) return;
    try {
      const res = await fetch(`/api/portfolio/skills/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMessage('Skill removed.');
        if (editingId === id) resetForm();
        onUpdated();
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Error deleting skill.');
    }
  };

  const categories: string[] = [
    'All',
    'Backend',
    'Frontend',
    'Database',
    'Messaging & Caching',
    'DevOps & Cloud',
    'Tools & Architecture',
  ];

  const filteredSkills = selectedFilter === 'All'
    ? skills
    : skills.filter((s) => s.category.includes(selectedFilter) || selectedFilter.includes(s.category));

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl">
      <AdminHeader
        title="Skills Matrix CMS"
        subtitle="Manage technical proficiencies, frameworks, cloud tooling, and runtime capabilities"
        actionButton={
          <button
            onClick={() => {
              if (showAddForm) resetForm();
              else setShowAddForm(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
          >
            {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            <span>{showAddForm ? 'Cancel' : 'Add Skill'}</span>
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
              <Cpu className="h-4 w-4 text-blue-400" />
              <span>{editingId ? 'Edit Technical Skill' : 'New Technical Proficiency'}</span>
            </div>
            {editingId && (
              <span className="text-[11px] font-mono text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                Editing ID: {editingId}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Skill / Technology Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. RabbitMQ or Apache Kafka"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Backend">Backend</option>
                <option value="Frontend">Frontend</option>
                <option value="Database">Database</option>
                <option value="Messaging & Caching">Messaging & Caching</option>
                <option value="DevOps & Cloud">DevOps & Cloud</option>
                <option value="Tools & Architecture">Tools & Architecture</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Years of Experience</label>
              <input
                type="number"
                min="1"
                max="25"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <div className="flex justify-between text-slate-400 font-medium">
                <span>Proficiency Level</span>
                <span className="font-mono text-white">{proficiency}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={proficiency}
                onChange={(e) => setProficiency(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="featSkill"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="featSkill" className="text-slate-300 font-medium cursor-pointer">
                Feature on Public Hero & Skills Section
              </label>
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
              <span>{submitting ? 'Saving...' : editingId ? 'Update Skill' : 'Save Skill'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-800 pb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedFilter === cat
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredSkills.length === 0 ? (
          <div className="col-span-full rounded-xl border border-slate-800 bg-[#0e1422] p-8 text-center text-slate-400 text-xs">
            No skills found in this category. Click "+ Add Skill" above to add new technical competencies.
          </div>
        ) : (
          filteredSkills.map((s) => (
            <div
              key={s.id}
              className={`rounded-xl border p-4 flex flex-col justify-between transition-all text-xs space-y-2.5 ${
                editingId === s.id
                  ? 'border-blue-500 bg-[#0e1422] ring-1 ring-blue-500/50'
                  : 'border-slate-800 bg-[#0e1422] hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-sm">{s.name}</span>
                  {s.featured && <Star className="h-3 w-3 text-amber-400 fill-amber-400" />}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(s)}
                    className="text-slate-500 hover:text-blue-400 p-1 rounded hover:bg-slate-800 transition-colors"
                    title="Edit Skill"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id, s.name)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition-colors"
                    title="Delete Skill"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>{s.category}</span>
                  <span className="text-white font-semibold">{s.proficiency}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all"
                    style={{ width: `${s.proficiency}%` }}
                  />
                </div>
              </div>

              {s.yearsOfExperience && (
                <div className="text-[10px] font-mono text-slate-500 pt-0.5">
                  {s.yearsOfExperience} {s.yearsOfExperience === 1 ? 'Year' : 'Years'} Practical Experience
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Profile } from '@/types/portfolio';
import AdminHeader from './AdminHeader';
import { User, Save, CheckCircle2, Globe, Github, Linkedin, Twitter, MapPin, Phone, Mail, Award } from 'lucide-react';

interface AdminProfileViewProps {
  profile: Profile;
  onUpdated: () => void;
}

export default function AdminProfileView({ profile, onUpdated }: AdminProfileViewProps) {
  const [data, setData] = useState<Profile>(profile);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/portfolio/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatusMessage('Profile information saved and synced across all pages!');
        onUpdated();
        setTimeout(() => setStatusMessage(null), 3500);
      } else {
        setStatusMessage('Failed to save profile changes.');
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Network error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl">
      <AdminHeader
        title="Profile & Bio CMS"
        subtitle="Manage professional identity, contact details, social links, and biography statements"
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

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Core Identity */}
        <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 space-y-4">
          <div className="flex items-center gap-2 font-bold text-white text-sm border-b border-slate-800 pb-2">
            <User className="h-4 w-4 text-blue-400" />
            <span>Primary Identity & Contact</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Full Name *</label>
              <input
                type="text"
                required
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Professional Title *</label>
              <input
                type="text"
                required
                value={data.professionalTitle}
                onChange={(e) => setData({ ...data, professionalTitle: e.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Email Address *</label>
              <input
                type="email"
                required
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Phone Number</label>
              <input
                type="text"
                value={data.phone || ''}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Location</label>
              <input
                type="text"
                value={data.location}
                onChange={(e) => setData({ ...data, location: e.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Years of Experience</label>
              <input
                type="number"
                min="0"
                max="50"
                value={data.yearsOfExperience}
                onChange={(e) => setData({ ...data, yearsOfExperience: Number(e.target.value) })}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Availability Status</label>
              <select
                value={data.availability}
                onChange={(e) => setData({ ...data, availability: e.target.value as any })}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Available for Hire">Available for Hire</option>
                <option value="Available">Available</option>
                <option value="Open to Offers">Open to Offers</option>
                <option value="Busy">Busy</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Profile Image URL</label>
              <input
                type="url"
                value={data.profileImage || ''}
                onChange={(e) => setData({ ...data, profileImage: e.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Bios */}
        <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 space-y-4">
          <div className="flex items-center gap-2 font-bold text-white text-sm border-b border-slate-800 pb-2">
            <span>Biographical Statements</span>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Short Introduction (Hero Headline Tagline)</label>
            <textarea
              rows={2}
              value={data.shortBio}
              onChange={(e) => setData({ ...data, shortBio: e.target.value })}
              className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Comprehensive Professional Bio (About Section)</label>
            <textarea
              rows={5}
              value={data.longBio}
              onChange={(e) => setData({ ...data, longBio: e.target.value })}
              className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* Social & Professional Links */}
        <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 space-y-4">
          <div className="flex items-center gap-2 font-bold text-white text-sm border-b border-slate-800 pb-2">
            <Globe className="h-4 w-4 text-blue-400" />
            <span>Social & Public Links</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-slate-400 mb-1 font-medium">
                <Linkedin className="h-3.5 w-3.5 text-blue-400" />
                <span>LinkedIn Profile URL</span>
              </label>
              <input
                type="url"
                value={data.linkedin}
                onChange={(e) => setData({ ...data, linkedin: e.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-slate-400 mb-1 font-medium">
                <Github className="h-3.5 w-3.5 text-slate-300" />
                <span>GitHub Profile URL</span>
              </label>
              <input
                type="url"
                value={data.github}
                onChange={(e) => setData({ ...data, github: e.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-slate-400 mb-1 font-medium">
                <Twitter className="h-3.5 w-3.5 text-sky-400" />
                <span>Twitter / X Profile URL</span>
              </label>
              <input
                type="url"
                value={data.twitter || ''}
                onChange={(e) => setData({ ...data, twitter: e.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-slate-400 mb-1 font-medium">
                <Globe className="h-3.5 w-3.5 text-emerald-400" />
                <span>Personal Portfolio Website</span>
              </label>
              <input
                type="url"
                value={data.website || ''}
                onChange={(e) => setData({ ...data, website: e.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 text-xs"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

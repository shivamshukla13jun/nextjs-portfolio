import React, { useState } from 'react';
import { SiteSettings } from '@/types/portfolio';
import AdminHeader from './AdminHeader';
import { Settings, Save, CheckCircle2, Database, ShieldCheck, Palette, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';

interface AdminSettingsViewProps {
  settings: SiteSettings | null;
  onUpdated: () => void;
}

export default function AdminSettingsView({ settings, onUpdated }: AdminSettingsViewProps) {
  const [siteTitle, setSiteTitle] = useState(settings?.siteTitle || 'Shivam Shukla | Senior MERN Stack Developer');
  const [metaDescription, setMetaDescription] = useState(
    settings?.metaDescription || 'Senior MERN Stack Developer specializing in Node.js, TypeScript, React, MongoDB, Redis, and RabbitMQ.'
  );
  const [primaryColor, setPrimaryColor] = useState(settings?.primaryColor || '#2563eb');
  const [heroHeadline, setHeroHeadline] = useState(
    settings?.heroHeadline || 'Building Secure, Scalable Web Systems & High-Throughput APIs'
  );
  const [heroSubheadline, setHeroSubheadline] = useState(
    settings?.heroSubheadline || 'Senior MERN Stack Developer at Wing Global IT Service Ltd specializing in Node.js, TypeScript, React, MongoDB, Redis, and RabbitMQ.'
  );
  const [enableBlog, setEnableBlog] = useState(settings?.enableBlog ?? true);
  const [enableServices, setEnableServices] = useState(settings?.enableServices ?? true);
  const [enableCertifications, setEnableCertifications] = useState(settings?.enableCertifications ?? true);
  const [allowPublicResumeDownload, setAllowPublicResumeDownload] = useState(
    settings?.allowPublicResumeDownload ?? true
  );

  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/portfolio/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteTitle,
          metaDescription,
          primaryColor,
          heroHeadline,
          heroSubheadline,
          enableBlog,
          enableServices,
          enableCertifications,
          allowPublicResumeDownload,
        }),
      });

      if (res.ok) {
        setStatusMessage('Settings updated and persisted successfully!');
        onUpdated();
        setTimeout(() => setStatusMessage(null), 3500);
      } else {
        setStatusMessage('Failed to save settings.');
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Network error updating settings.');
    } finally {
      setSaving(false);
    }
  };

  const presetColors = ['#2563eb', '#0284c7', '#10b981', '#6366f1', '#8b5cf6', '#d97706'];

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl">
      <AdminHeader
        title="Settings & Global Configuration"
        subtitle="Manage brand identity, site metadata, theme color, and feature visibility"
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

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & SEO Metadata */}
        <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 space-y-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-white text-sm border-b border-slate-800 pb-2">
            <Settings className="h-4 w-4 text-blue-400" />
            <span>General & SEO Configuration</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Browser Title & Meta Title *</label>
              <input
                type="text"
                required
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Meta Description (SEO & Social Sharing) *</label>
              <textarea
                required
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Hero Headline</label>
              <input
                type="text"
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Hero Subheadline</label>
              <input
                type="text"
                value={heroSubheadline}
                onChange={(e) => setHeroSubheadline(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Theme Accent Color */}
        <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 space-y-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-white text-sm border-b border-slate-800 pb-2">
            <Palette className="h-4 w-4 text-blue-400" />
            <span>Theme Accent Color</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg border border-slate-700 shadow-sm" style={{ backgroundColor: primaryColor }} />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-32 rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
              />
              <span className="text-slate-400">Custom Hex Code</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 mr-2">Presets:</span>
              {presetColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setPrimaryColor(color)}
                  className={`h-7 w-7 rounded-full border-2 transition-transform ${
                    primaryColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 space-y-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-white text-sm border-b border-slate-800 pb-2">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span>Feature Modules & Visibility</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <div>
                <div className="font-semibold text-white">Engineering Articles & Blog</div>
                <div className="text-slate-400 text-[11px]">Display articles section on public site and in navigation</div>
              </div>
              <button
                type="button"
                onClick={() => setEnableBlog(!enableBlog)}
                className={`text-xl transition-colors ${enableBlog ? 'text-blue-400' : 'text-slate-600'}`}
              >
                {enableBlog ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <div>
                <div className="font-semibold text-white">Services & Capabilities</div>
                <div className="text-slate-400 text-[11px]">Display technical consulting and backend offerings</div>
              </div>
              <button
                type="button"
                onClick={() => setEnableServices(!enableServices)}
                className={`text-xl transition-colors ${enableServices ? 'text-blue-400' : 'text-slate-600'}`}
              >
                {enableServices ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <div>
                <div className="font-semibold text-white">Certifications & Accreditations</div>
                <div className="text-slate-400 text-[11px]">Showcase verified credentials and licenses</div>
              </div>
              <button
                type="button"
                onClick={() => setEnableCertifications(!enableCertifications)}
                className={`text-xl transition-colors ${enableCertifications ? 'text-blue-400' : 'text-slate-600'}`}
              >
                {enableCertifications ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <div>
                <div className="font-semibold text-white">Public Resume PDF Download</div>
                <div className="text-slate-400 text-[11px]">Enable the resume PDF download on the public resume page</div>
              </div>
              <button
                type="button"
                onClick={() => setAllowPublicResumeDownload(!allowPublicResumeDownload)}
                className={`text-xl transition-colors ${allowPublicResumeDownload ? 'text-blue-400' : 'text-slate-600'}`}
              >
                {allowPublicResumeDownload ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7" />}
              </button>
            </div>
          </div>
        </div>

        {/* Database & Storage Status */}
        <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 space-y-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-white text-sm border-b border-slate-800 pb-2">
            <Database className="h-4 w-4 text-emerald-400" />
            <span>Database & Storage Architecture</span>
          </div>

          <div className="space-y-2 text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">Zero-Latency In-Memory Layer Active</span>
              <span className="rounded bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 text-[10px] font-mono">
                HYDRATED
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              The platform is configured with full MongoDB Mongoose models and GridFS bucket integration. When you set the{' '}
              <code className="text-blue-300 font-mono">MONGODB_URI</code> environment variable in your production deployment,
              all mutations automatically replicate into your live MongoDB Atlas cluster with zero code changes.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 text-xs"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

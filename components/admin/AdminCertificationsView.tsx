import React, { useState } from 'react';
import { Certification } from '@/types/portfolio';
import AdminHeader from './AdminHeader';
import { Award, Plus, Trash2, Edit2, ExternalLink, Calendar, Key, X, Check } from 'lucide-react';

interface AdminCertificationsViewProps {
  certifications: Certification[];
  onUpdated: () => void;
}

export default function AdminCertificationsView({ certifications, onUpdated }: AdminCertificationsViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');

  const resetForm = () => {
    setName('');
    setIssuer('');
    setIssueDate('');
    setExpirationDate('');
    setCredentialId('');
    setCredentialUrl('');
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleStartEdit = (cert: Certification) => {
    setEditingId(cert.id);
    setName(cert.name);
    setIssuer(cert.issuingOrganization || cert.issuer || '');
    setIssueDate(cert.issueDate || '');
    setExpirationDate(cert.expirationDate || '');
    setCredentialId(cert.credentialId || '');
    setCredentialUrl(cert.credentialUrl || '');
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name,
        issuingOrganization: issuer,
        issuer,
        issueDate,
        expirationDate: expirationDate || undefined,
        credentialId: credentialId || undefined,
        credentialUrl: credentialUrl || undefined,
      };

      const url = editingId ? `/api/portfolio/certifications/${editingId}` : '/api/portfolio/certifications';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatusMessage(editingId ? 'Certification updated successfully!' : 'Certification added successfully!');
        resetForm();
        onUpdated();
        setTimeout(() => setStatusMessage(null), 3500);
      } else {
        setStatusMessage('Failed to save certification.');
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Network error saving certification.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, certName: string) => {
    if (!window.confirm(`Are you sure you want to delete certification "${certName}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/portfolio/certifications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMessage('Certification deleted.');
        if (editingId === id) resetForm();
        onUpdated();
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Error deleting certification.');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl">
      <AdminHeader
        title="Certifications & Credentials"
        subtitle="Manage professional certifications, cloud licenses, and verifiable credentials"
        actionButton={
          <button
            onClick={() => {
              if (showAddForm) resetForm();
              else setShowAddForm(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
          >
            {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            <span>{showAddForm ? 'Cancel' : 'Add Certification'}</span>
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
              <Award className="h-4 w-4 text-blue-400" />
              <span>{editingId ? 'Edit Certification' : 'New Certification / License'}</span>
            </div>
            {editingId && (
              <span className="text-[11px] font-mono text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                Editing ID: {editingId}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Certification Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. MongoDB Certified Node.js Developer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Issuer / Organization *</label>
              <input
                type="text"
                required
                placeholder="e.g. MongoDB University, AWS, Linux Foundation"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Issue Date / Year *</label>
              <input
                type="text"
                required
                placeholder="e.g. 2023 or Sep 2023"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Expiration Date (optional)</label>
              <input
                type="text"
                placeholder="e.g. 2026 or Does not expire"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Credential ID / License Number</label>
              <input
                type="text"
                placeholder="e.g. MDB-NODE-8459"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Credential Verification URL</label>
              <input
                type="url"
                placeholder="e.g. https://learn.mongodb.com/verify/..."
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
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
              <span>{submitting ? 'Saving...' : editingId ? 'Update Certification' : 'Save Certification'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Certification Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certifications.length === 0 ? (
          <div className="col-span-full rounded-xl border border-slate-800 bg-[#0e1422] p-8 text-center text-slate-400 text-xs">
            No certifications added yet. Click "+ Add Certification" above to record verified technical credentials.
          </div>
        ) : (
          certifications.map((cert) => {
            const org = cert.issuingOrganization || cert.issuer || 'Professional Organization';
            return (
              <div
                key={cert.id}
                className={`rounded-xl border p-5 flex flex-col justify-between transition-all space-y-4 ${
                  editingId === cert.id
                    ? 'border-blue-500 bg-[#0e1422] ring-1 ring-blue-500/50'
                    : 'border-slate-800 bg-[#0e1422] hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm leading-snug">{cert.name}</h3>
                        <div className="text-xs text-blue-400 font-semibold">{org}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-400 pt-1 font-mono">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Calendar className="h-3 w-3 text-slate-500" />
                      <span>Issued: {cert.issueDate}</span>
                      {cert.expirationDate && <span>(Expires: {cert.expirationDate})</span>}
                    </div>

                    {cert.credentialId && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                        <Key className="h-3 w-3 text-slate-500" />
                        <span>ID: {cert.credentialId}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
                  {cert.credentialUrl ? (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:underline font-medium"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Verify</span>
                    </a>
                  ) : (
                    <span className="text-slate-600 text-[11px]">No link</span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEdit(cert)}
                      className="flex items-center gap-1 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                      title="Edit Certification"
                    >
                      <Edit2 className="h-3 w-3 text-blue-400" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(cert.id, cert.name)}
                      className="flex items-center gap-1 rounded border border-rose-900/60 bg-rose-950/20 px-2 py-1 text-xs text-rose-400 hover:bg-rose-900/40 hover:text-white transition-colors"
                      title="Delete Certification"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

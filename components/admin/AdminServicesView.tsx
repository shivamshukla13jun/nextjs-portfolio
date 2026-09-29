import React, { useState } from 'react';
import { Service } from '@/types/portfolio';
import AdminHeader from './AdminHeader';
import { Layers, Plus, Trash2, Edit2, CheckCircle2, Server, X, Check } from 'lucide-react';

interface AdminServicesViewProps {
  services: Service[];
  onUpdated: () => void;
}

export default function AdminServicesView({ services, onUpdated }: AdminServicesViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deliverables, setDeliverables] = useState('');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDeliverables('');
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleStartEdit = (srv: Service) => {
    setEditingId(srv.id);
    setTitle(srv.title);
    setDescription(srv.description);
    const list = srv.deliverables || srv.features || [];
    setDeliverables(list.join(', '));
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const deliverablesList = deliverables
        ? deliverables.split(',').map((d) => d.trim()).filter(Boolean)
        : [];

      const payload = {
        title,
        description,
        deliverables: deliverablesList,
        features: deliverablesList,
      };

      const url = editingId ? `/api/portfolio/services/${editingId}` : '/api/portfolio/services';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatusMessage(editingId ? 'Service updated successfully!' : 'Service offering added successfully!');
        resetForm();
        onUpdated();
        setTimeout(() => setStatusMessage(null), 3500);
      } else {
        setStatusMessage('Failed to save service.');
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Network error saving service.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, srvTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete service "${srvTitle}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/portfolio/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMessage('Service removed.');
        if (editingId === id) resetForm();
        onUpdated();
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Error deleting service.');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl">
      <AdminHeader
        title="Services & Capabilities"
        subtitle="Manage specialized consulting, architecture, and engineering services offered to clients"
        actionButton={
          <button
            onClick={() => {
              if (showAddForm) resetForm();
              else setShowAddForm(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
          >
            {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            <span>{showAddForm ? 'Cancel' : 'Add Service'}</span>
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
              <Server className="h-4 w-4 text-blue-400" />
              <span>{editingId ? 'Edit Engineering Capability' : 'New Engineering Capability'}</span>
            </div>
            {editingId && (
              <span className="text-[11px] font-mono text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                Editing ID: {editingId}
              </span>
            )}
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Service Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Caching & Event-Driven Architecture"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Description *</label>
            <textarea
              required
              rows={3}
              placeholder="Describe what business challenges this solves and the technical stack utilized..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Deliverables & Features (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. Redis multi-tier caching, RabbitMQ dead-letter queues, sub-10ms response SLAs"
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
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
              <span>{submitting ? 'Saving...' : editingId ? 'Update Service' : 'Save Service'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Services Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.length === 0 ? (
          <div className="col-span-full rounded-xl border border-slate-800 bg-[#0e1422] p-8 text-center text-slate-400 text-xs">
            No services added yet. Click "+ Add Service" above to showcase consulting and technical capabilities.
          </div>
        ) : (
          services.map((srv) => {
            const list = srv.deliverables || srv.features || [];
            return (
              <div
                key={srv.id}
                className={`rounded-xl border p-5 flex flex-col justify-between transition-all space-y-4 ${
                  editingId === srv.id
                    ? 'border-blue-500 bg-[#0e1422] ring-1 ring-blue-500/50'
                    : 'border-slate-800 bg-[#0e1422] hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                        <Layers className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold text-white text-sm">{srv.title}</h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{srv.description}</p>

                  {list.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                      <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                        Key Deliverables
                      </div>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {list.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-800/80 pt-3 text-xs">
                  <button
                    onClick={() => handleStartEdit(srv)}
                    className="flex items-center gap-1 rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                    title="Edit Service"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-blue-400" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(srv.id, srv.title)}
                    className="flex items-center gap-1 rounded border border-rose-900/60 bg-rose-950/20 px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-900/40 hover:text-white transition-colors"
                    title="Delete Service"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

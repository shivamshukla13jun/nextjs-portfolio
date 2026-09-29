import React, { useState } from 'react';
import { Blog } from '@/types/portfolio';
import AdminHeader from './AdminHeader';
import { BookOpen, Plus, Trash2, Edit2, Calendar, Clock, Eye, EyeOff, X, Check } from 'lucide-react';

interface AdminBlogViewProps {
  blogs: Blog[];
  onUpdated: () => void;
}

export default function AdminBlogView({ blogs, onUpdated }: AdminBlogViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSlugOrId, setEditingSlugOrId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Backend Architecture');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('Node.js, Redis, RabbitMQ');
  const [readingTime, setReadingTime] = useState('5 min read');
  const [published, setPublished] = useState(true);

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setCategory('Backend Architecture');
    setExcerpt('');
    setContent('');
    setTags('Node.js, Redis, RabbitMQ');
    setReadingTime('5 min read');
    setPublished(true);
    setShowAddForm(false);
    setEditingSlugOrId(null);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingSlugOrId && (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  };

  const handleStartEdit = (b: Blog) => {
    setEditingSlugOrId(b.slug || b.id);
    setTitle(b.title);
    setSlug(b.slug);
    setCategory(b.category || 'Backend Architecture');
    setExcerpt(b.excerpt);
    setContent(b.content);
    setTags(Array.isArray(b.tags) ? b.tags.join(', ') : '');
    setReadingTime(b.readingTime || '5 min read');
    setPublished(b.published);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const tagsList = tags
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      const autoSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      const payload = {
        title,
        slug: autoSlug,
        category,
        excerpt,
        content,
        tags: tagsList,
        readingTime,
        published,
        publishedAt: new Date().toISOString().split('T')[0],
      };

      const url = editingSlugOrId ? `/api/portfolio/blogs/${editingSlugOrId}` : '/api/portfolio/blogs';
      const method = editingSlugOrId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatusMessage(editingSlugOrId ? 'Article updated successfully!' : 'Blog article published successfully!');
        resetForm();
        onUpdated();
        setTimeout(() => setStatusMessage(null), 3500);
      } else {
        setStatusMessage('Failed to save blog article.');
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Network error saving article.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (slugOrId: string, artTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete article "${artTitle}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/portfolio/blogs/${slugOrId}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMessage('Article deleted.');
        if (editingSlugOrId === slugOrId) resetForm();
        onUpdated();
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Error deleting article.');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl">
      <AdminHeader
        title="Articles & Engineering Insights"
        subtitle="Manage technical publications, architectural deep-dives, and performance articles"
        actionButton={
          <button
            onClick={() => {
              if (showAddForm) resetForm();
              else setShowAddForm(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
          >
            {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            <span>{showAddForm ? 'Cancel' : 'New Article'}</span>
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
              <BookOpen className="h-4 w-4 text-blue-400" />
              <span>{editingSlugOrId ? 'Edit Engineering Article' : 'Write New Engineering Article'}</span>
            </div>
            {editingSlugOrId && (
              <span className="text-[11px] font-mono text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                Editing: /{editingSlugOrId}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Article Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Scaling Node.js Microservices with Redis & RabbitMQ"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">URL Slug</label>
              <input
                type="text"
                required
                placeholder="scaling-nodejs-microservices"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Backend Architecture">Backend Architecture</option>
                <option value="Distributed Systems">Distributed Systems</option>
                <option value="Database Engineering">Database Engineering</option>
                <option value="DevOps & Docker">DevOps & Docker</option>
                <option value="System Design">System Design</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Estimated Reading Time</label>
              <input
                type="text"
                placeholder="e.g. 5 min read"
                value={readingTime}
                onChange={(e) => setReadingTime(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. Node.js, Redis, RabbitMQ, Docker"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Short Excerpt *</label>
              <textarea
                required
                rows={2}
                placeholder="Summary snippet displayed on cards and search results..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Article Content (Markdown / Text) *</label>
              <textarea
                required
                rows={8}
                placeholder="Write full article content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-xs leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="pubToggle"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="pubToggle" className="text-slate-300 font-medium cursor-pointer">
              Publish immediately to public blog section
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
              <span>{submitting ? 'Saving...' : editingSlugOrId ? 'Update Article' : 'Publish Article'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Articles Cards List */}
      <div className="space-y-4">
        {blogs.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-8 text-center text-slate-400 text-xs">
            No articles created yet. Click "+ New Article" above to share technical knowledge.
          </div>
        ) : (
          blogs.map((b) => (
            <div
              key={b.id || b.slug}
              className={`rounded-xl border p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-all ${
                editingSlugOrId === (b.slug || b.id)
                  ? 'border-blue-500 bg-[#0e1422] ring-1 ring-blue-500/50'
                  : 'border-slate-800 bg-[#0e1422] hover:border-slate-700'
              }`}
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono ${
                      b.published
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {b.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    <span>{b.published ? 'Published' : 'Draft'}</span>
                  </span>

                  {b.category && (
                    <span className="rounded bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 text-[10px] text-blue-300 font-mono">
                      {b.category}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white text-base leading-snug">{b.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{b.excerpt}</p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1 font-mono">
                  {b.publishedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-500" />
                      <span>{b.publishedAt}</span>
                    </span>
                  )}
                  {b.readingTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-500" />
                      <span>{b.readingTime}</span>
                    </span>
                  )}
                  {b.slug && <span className="text-slate-500">/{b.slug}</span>}
                </div>

                {b.tags && b.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {b.tags.map((t, idx) => (
                      <span key={idx} className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-400 font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => handleStartEdit(b)}
                  className="flex items-center gap-1 rounded border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                  title="Edit Article"
                >
                  <Edit2 className="h-3.5 w-3.5 text-blue-400" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(b.slug || b.id, b.title)}
                  className="flex items-center gap-1 rounded border border-rose-900/60 bg-rose-950/20 px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-900/40 hover:text-white transition-colors"
                  title="Delete Article"
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

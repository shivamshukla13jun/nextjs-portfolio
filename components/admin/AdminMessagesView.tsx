'use client';

import React, { useState, useEffect } from 'react';
import { ContactMessage } from '@/types/portfolio';
import AdminHeader from './AdminHeader';
import { Mail, Trash2, CheckCircle2, Circle, MailCheck, Reply, Calendar } from 'lucide-react';

export default function AdminMessagesView() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadMessages = async () => {
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !currentRead }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, read: !currentRead } : m))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string, senderName: string) => {
    if (!window.confirm(`Delete message from "${senderName}"?`)) return;
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMessage('Message deleted.');
        setMessages((prev) => prev.filter((m) => m.id !== id));
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (e) {
      console.error(e);
      setStatusMessage('Error deleting message.');
    }
  };

  const filteredMessages = filter === 'unread' ? messages.filter((m) => !m.read) : messages;
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl">
      <AdminHeader
        title="Contact Messages Inbox"
        subtitle="Manage client inquiries, recruiter outreach, and architectural consulting requests"
        actionButton={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        }
      />

      {statusMessage && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 rounded-lg flex items-center justify-between">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-8 text-center text-slate-400 text-xs">
          Loading messages inbox...
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-12 text-center space-y-2 text-xs">
          <MailCheck className="h-8 w-8 text-slate-600 mx-auto" />
          <div className="text-slate-300 font-semibold">Inbox is clear!</div>
          <p className="text-slate-500 max-w-sm mx-auto">
            {filter === 'unread'
              ? 'No unread messages. All communications have been reviewed.'
              : 'No contact inquiries received yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border p-5 transition-all space-y-3 text-xs ${
                msg.read
                  ? 'border-slate-800/80 bg-[#0e1422]/60 text-slate-300'
                  : 'border-blue-500/40 bg-[#0e1422] text-white shadow-lg shadow-blue-950/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => handleToggleRead(msg.id, msg.read)}
                    title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                    className="text-slate-400 hover:text-blue-400"
                  >
                    {msg.read ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-blue-400 fill-blue-500/20" />
                    )}
                  </button>

                  <div>
                    <span className="font-bold text-white text-sm">{msg.name}</span>
                    <span className="text-slate-400 font-mono text-[11px] ml-2">&lt;{msg.email}&gt;</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <Calendar className="h-3 w-3 text-slate-500" />
                  <span>{new Date(msg.createdAt).toLocaleDateString()} at {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <div>
                <div className="font-bold text-blue-400 text-xs mb-1.5">Subject: {msg.subject}</div>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed text-xs bg-slate-900/60 rounded-lg p-3 border border-slate-800/60 font-sans">
                  {msg.message}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/40 bg-blue-950/40 px-3 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-900/50 hover:text-white transition-colors"
                >
                  <Reply className="h-3.5 w-3.5" />
                  <span>Reply via Email</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRead(msg.id, msg.read)}
                    className="text-slate-400 hover:text-white text-[11px] font-mono px-2 py-1 rounded hover:bg-slate-800"
                  >
                    {msg.read ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id, msg.name)}
                    className="flex items-center gap-1 rounded border border-rose-900/60 bg-rose-950/20 px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-900/40 hover:text-white transition-colors"
                    title="Delete Message"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

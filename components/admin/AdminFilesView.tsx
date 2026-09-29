'use client';

import React, { useState, useEffect } from 'react';
import { FileRecord } from '@/types/portfolio';
import AdminHeader from './AdminHeader';
import FileUploadDropzone from './FileUploadDropzone';
import { Database, File, Trash2, Copy, Check, ExternalLink, HardDrive } from 'lucide-react';

export default function AdminFilesView() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadFiles = async () => {
    try {
      const res = await fetch('/api/files');
      const data = await res.json();
      if (data.files) {
        setFiles(data.files);
      }
    } catch (e) {
      console.error('Error fetching files:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleCopyUrl = (url: string, id: string) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, filename: string) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/files/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMessage(`Deleted file "${filename}"`);
        loadFiles();
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (e) {
      console.error(e);
      setStatusMessage('Error deleting file');
    }
  };

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl">
      <AdminHeader
        title="MongoDB GridFS File Storage"
        subtitle="Upload, store, and stream binaries, PDF resumes, images, and credentials"
      />

      {statusMessage && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 rounded-lg flex items-center justify-between">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Upload Dropzone */}
      <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-5">
        <FileUploadDropzone
          onUploadSuccess={() => {
            loadFiles();
            setStatusMessage('File uploaded to GridFS successfully!');
            setTimeout(() => setStatusMessage(null), 3500);
          }}
        />
      </div>

      {/* Files List */}
      <div className="rounded-xl border border-slate-800 bg-[#0e1422] overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <HardDrive className="h-4 w-4 text-blue-400" />
            <span>Stored Assets ({files.length})</span>
          </div>
          <button
            onClick={loadFiles}
            className="text-xs text-blue-400 hover:underline font-mono"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading stored files...</div>
        ) : files.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No files stored in GridFS yet. Upload a resume PDF or project image above.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {files.map((file) => (
              <div
                key={file.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/40 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/15 text-blue-400 border border-blue-500/20">
                    <File className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-white truncate max-w-sm">{file.filename}</div>
                    <div className="flex flex-wrap items-center gap-2 text-slate-400 text-[11px] font-mono pt-0.5">
                      <span>{formatBytes(file.size)}</span>
                      <span>•</span>
                      <span className="capitalize">{file.category}</span>
                      <span>•</span>
                      <span>{file.uploadedAt?.split('T')[0] || 'Recent'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {file.url && (
                    <>
                      <button
                        onClick={() => handleCopyUrl(file.url!, file.id)}
                        className="flex items-center gap-1 rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-slate-300 hover:text-white transition-colors"
                        title="Copy Public URL"
                      >
                        {copiedId === file.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400 text-[11px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span className="text-[11px]">Copy URL</span>
                          </>
                        )}
                      </button>

                      <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 rounded border border-blue-800/60 bg-blue-950/40 px-2.5 py-1 text-blue-400 hover:bg-blue-900/50 hover:text-white transition-colors text-[11px]"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Open</span>
                      </a>
                    </>
                  )}

                  <button
                    onClick={() => handleDelete(file.id, file.filename)}
                    className="flex items-center gap-1 rounded border border-rose-900/60 bg-rose-950/20 px-2.5 py-1 text-rose-400 hover:bg-rose-900/40 hover:text-white transition-colors"
                    title="Delete File"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

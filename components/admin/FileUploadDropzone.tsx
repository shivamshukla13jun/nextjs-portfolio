import React, { useState, useEffect } from 'react';
import { UploadCloud, File, Trash2, CheckCircle2, AlertCircle, FileText, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { FileRecord } from '@/types/portfolio';

interface FileUploadDropzoneProps {
  onUploadSuccess?: (file: FileRecord) => void;
  category?: 'profile' | 'project' | 'resume' | 'certificate' | 'logo' | 'general';
}

export default function FileUploadDropzone({ onUploadSuccess, category = 'general' }: FileUploadDropzoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentFiles, setRecentFiles] = useState<FileRecord[]>([]);

  const loadFiles = async () => {
    try {
      const res = await fetch('/api/files');
      const data = await res.json();
      if (data.files) {
        setRecentFiles(data.files);
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleUpload = async (file: File) => {
    setError(null);

    // Validate size (15MB limit)
    if (file.size > 15 * 1024 * 1024) {
      setError('File size exceeds the 15MB limit.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', selectedCategory);

      // In browser, let's call the API
      // Since this is FormData, we read buffer if testing or send multipart
      const res = await fetch('/api/files/upload', {
        method: 'POST',
        headers: {
          'x-filename': encodeURIComponent(file.name),
          'x-mimetype': file.type || 'application/octet-stream',
          'x-category': selectedCategory,
        },
        body: file,
      });

      const data = await res.json();
      if (data.file) {
        setRecentFiles((prev) => [data.file, ...prev]);
        if (onUploadSuccess) onUploadSuccess(data.file);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/files/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRecentFiles((prev) => prev.filter((f) => f.id !== id));
      }
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white">MongoDB GridFS Asset Management</h3>
          <p className="text-slate-400 text-xs">Upload images, resumes, PDFs, or certificates with chunked binary streaming</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-400">Target Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="rounded border border-slate-700 bg-slate-900 px-2.5 py-1 text-white"
          >
            <option value="general">General</option>
            <option value="profile">Profile Photo</option>
            <option value="project">Project Asset</option>
            <option value="resume">Resume PDF</option>
            <option value="certificate">Certificate</option>
            <option value="logo">Company / Tech Logo</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded bg-rose-950/40 border border-rose-800 p-2.5 text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Drop area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleUpload(e.dataTransfer.files[0]);
          }
        }}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all ${
          dragOver
            ? 'border-blue-500 bg-blue-950/20'
            : 'border-slate-700/80 bg-slate-900/40 hover:border-slate-600'
        }`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 text-blue-400 mb-3 border border-blue-500/20">
          <UploadCloud className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium text-slate-200">
          Drag and drop files here, or{' '}
          <label className="cursor-pointer text-blue-400 underline hover:text-blue-300">
            browse from system
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleUpload(e.target.files[0]);
                }
              }}
            />
          </label>
        </p>
        <p className="mt-1 text-[11px] text-slate-500 font-mono">
          Supports PNG, JPG, WEBP, SVG, PDF up to 15MB • Streams directly to GridFSBucket
        </p>

        {uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-slate-950/80 backdrop-blur-sm">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mb-2" />
            <span className="text-blue-400 font-medium text-xs">Streaming chunks to GridFS...</span>
          </div>
        )}
      </div>

      {/* Files list */}
      {recentFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-300 text-xs font-mono uppercase tracking-wider">
            Stored GridFS Assets ({recentFiles.length})
          </h4>
          <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            {recentFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-slate-800 text-slate-300">
                    {file.mimeType.includes('pdf') ? (
                      <FileText className="h-4 w-4 text-rose-400" />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-slate-200">{file.originalName || file.filename}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {(file.size / 1024).toFixed(1)} KB • {file.category} • {file.mimeType}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`/api/files/${file.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="View / Stream"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="p-1.5 rounded hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete file"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

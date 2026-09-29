import React, { useState } from 'react';
import { Sparkles, Check, X, Copy, RefreshCw, Wand2 } from 'lucide-react';
import { AIOperationType } from '@/types/ai';

interface AIWritingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (enhancedText: string) => void;
  initialContent?: string;
  defaultType?: AIOperationType;
}

export default function AIWritingModal({
  isOpen,
  onClose,
  onApply,
  initialContent = '',
  defaultType = 'experience-enhance',
}: AIWritingModalProps) {
  const [content, setContent] = useState(initialContent);
  const [type, setType] = useState<AIOperationType>(defaultType);
  const [enhanced, setEnhanced] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleEnhance = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, content }),
      });
      const data = await res.json();
      if (data.enhanced) {
        setEnhanced(data.enhanced);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(enhanced);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-indigo-900/60 bg-[#0e1422] p-6 text-xs text-slate-200 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 font-semibold text-sm text-white">
            <div className="p-1 rounded bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <span>Gemini AI Technical Writing Assistant</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-slate-400 mb-1">Enhancement Goal:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AIOperationType)}
              className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-white"
            >
              <option value="experience-enhance">STAR Bullet Points with Metrics</option>
              <option value="resume-summary">Executive Summary Polish</option>
              <option value="project-enhance">Project Architecture & Solution</option>
              <option value="professionalize">Executive Tone (Staff/Principal)</option>
              <option value="shorten">Concise & Punchy</option>
              <option value="ats-optimize">ATS Keyword Alignment</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Input Draft / Rough Notes:</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste raw bullet points, responsibilities, or project notes..."
              className="w-full rounded border border-slate-700 bg-slate-900 p-2.5 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleEnhance}
              disabled={loading || !content.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-md shadow-indigo-900/30"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Enhancing with Gemini...</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-3.5 w-3.5" />
                  <span>Generate Polished Content</span>
                </>
              )}
            </button>
          </div>

          {enhanced && (
            <div className="space-y-2 rounded-xl border border-indigo-800/40 bg-indigo-950/20 p-4">
              <div className="flex items-center justify-between text-indigo-300 font-semibold text-[11px] uppercase tracking-wider">
                <span>Gemini Output</span>
                <button onClick={handleCopy} className="flex items-center gap-1 hover:text-white transition-colors">
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="whitespace-pre-line text-slate-100 text-xs bg-slate-900/80 p-3 rounded-lg border border-slate-800 leading-relaxed font-sans">
                {enhanced}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    onApply(enhanced);
                    onClose();
                  }}
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 font-bold text-white hover:bg-emerald-500 transition-colors"
                >
                  Apply to Form
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

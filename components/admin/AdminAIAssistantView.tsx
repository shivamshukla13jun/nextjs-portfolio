'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import { Sparkles, Copy, Check, Bot, History, ArrowRight, Wand2, RefreshCw } from 'lucide-react';
import { AIOperationType, AIGenerationRecord } from '@/types/ai';

export default function AdminAIAssistantView() {
  const [opType, setOpType] = useState<AIOperationType>('experience-enhance');
  const [content, setContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<AIGenerationRecord[]>([]);

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/ai/history');
      const d = await res.json();
      if (d.history) setHistory(d.history);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleGenerate = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: opType,
          content,
          context: {
            targetRole: 'Senior MERN Stack Developer',
            jobDescription: jobDescription || undefined,
          },
        }),
      });
      const data = await res.json();
      setResult(data);
      loadHistory();
    } catch (err) {
      console.error(err);
      setResult({ suggestion: 'Error connecting to Gemini AI assistant.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const operationOptions: { id: AIOperationType; label: string; desc: string }[] = [
    {
      id: 'experience-enhance',
      label: 'Experience Bullets',
      desc: 'Transforms raw duty descriptions into quantifiable, metric-driven achievements.',
    },
    {
      id: 'project-enhance',
      label: 'Project Case Study',
      desc: 'Generates problem statement, architectural solution, and engineering highlights.',
    },
    {
      id: 'resume-summary',
      label: 'Executive Summary',
      desc: 'Creates a compelling bio synthesizing years of experience, core stacks, and domain authority.',
    },
    {
      id: 'ats-optimize',
      label: 'ATS Alignment',
      desc: 'Rewrites content with industry keywords matching high-parsing recruiter filters.',
    },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl">
      <AdminHeader
        title="Gemini AI Content Studio"
        subtitle="Server-side Gemini 3.8 Flash pipeline for engineering resume optimization and portfolio copy"
      />

      {/* Task Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {operationOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setOpType(opt.id)}
            className={`rounded-xl border p-4 text-left transition-all ${
              opType === opt.id
                ? 'border-indigo-500 bg-indigo-950/40 text-white shadow-lg shadow-indigo-950/30'
                : 'border-slate-800 bg-[#0e1422] text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-xs">
              <Wand2 className={`h-4 w-4 ${opType === opt.id ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span>{opt.label}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">{opt.desc}</p>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            Raw Content / Rough Bullet Points *
          </label>
          <textarea
            rows={4}
            placeholder={
              opType === 'experience-enhance'
                ? 'e.g. Worked with Redis and RabbitMQ to make APIs faster and delivered the FreightBooks project on time...'
                : opType === 'project-enhance'
                ? 'e.g. FreightBooks logistics billing system with Node.js, Express, MongoDB, Redis, and React...'
                : 'e.g. 4 years MERN stack developer focusing on scalable Node.js microservices...'
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-xs leading-relaxed"
          />
        </div>

        {opType === 'ats-optimize' && (
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Target Job Description / Key Skills (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Paste recruiter job requirements (e.g. Senior Backend Node.js Engineer, Redis caching, microservices, high concurrency)..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-xs leading-relaxed"
            />
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !content.trim()}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all disabled:opacity-50 text-xs"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Refining with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Optimized Content</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Result Card */}
      {result && (
        <div className="rounded-xl border border-indigo-500/40 bg-indigo-950/20 p-5 space-y-4 text-xs animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-indigo-900/60 pb-3">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Bot className="h-4 w-4 text-indigo-400" />
              <span>Gemini 3.8 Output</span>
            </div>

            <button
              onClick={() => handleCopy(result.suggestion || result.enhanced || JSON.stringify(result))}
              className="flex items-center gap-1.5 rounded-lg border border-indigo-700 bg-indigo-900/40 px-3 py-1.5 text-xs text-indigo-200 hover:bg-indigo-900/80 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Output</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-4 text-slate-100 whitespace-pre-wrap leading-relaxed font-sans text-xs">
              {result.suggestion || result.enhanced}
            </div>

            {result.reasoning && (
              <div className="text-[11px] text-slate-400 font-mono bg-slate-900/40 p-3 rounded border border-slate-800/60">
                <span className="font-bold text-indigo-300">Architectural Rationale: </span>
                {result.reasoning}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent AI Generations History */}
      {history.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 space-y-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-white text-sm border-b border-slate-800 pb-2">
            <History className="h-4 w-4 text-slate-400" />
            <span>Recent Generation Log ({history.length})</span>
          </div>

          <div className="divide-y divide-slate-800/80 max-h-60 overflow-y-auto">
            {history.slice(0, 5).map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-semibold text-white capitalize text-[11px]">{item.type.replace('-', ' ')}</div>
                  <div className="text-slate-400 truncate text-[11px] max-w-md">{item.prompt}</div>
                </div>
                <button
                  onClick={() => handleCopy(item.response)}
                  className="shrink-0 text-slate-400 hover:text-white p-1"
                  title="Copy Previous Output"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

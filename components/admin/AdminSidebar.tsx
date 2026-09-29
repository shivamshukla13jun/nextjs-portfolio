import React from 'react';
import {
  LayoutDashboard,
  User,
  Briefcase,
  FolderGit2,
  Cpu,
  GraduationCap,
  Award,
  Layers,
  BookOpen,
  FileText,
  Database,
  Sparkles,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';

interface AdminSidebarProps {
  currentPath: string;
  navigate: (path: string) => void;
  onLogout?: () => void;
}

export default function AdminSidebar({ currentPath, navigate, onLogout }: AdminSidebarProps) {
  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/profile', label: 'Profile CMS', icon: User },
    { href: '/admin/experience', label: 'Experience', icon: Briefcase },
    { href: '/admin/projects', label: 'Projects', icon: FolderGit2 },
    { href: '/admin/skills', label: 'Skills Matrix', icon: Cpu },
    { href: '/admin/education', label: 'Education', icon: GraduationCap },
    { href: '/admin/certifications', label: 'Certifications', icon: Award },
    { href: '/admin/services', label: 'Services', icon: Layers },
    { href: '/admin/blog', label: 'Articles & Blog', icon: BookOpen },
    { href: '/admin/resume-builder', label: 'Resume Builder', icon: FileText },
    { href: '/admin/files', label: 'GridFS Files', icon: Database },
    { href: '/admin/ai-assistant', label: 'Gemini AI Studio', icon: Sparkles },
    { href: '/admin/messages', label: 'Inquiries Inbox', icon: Inbox },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 border-r border-slate-800 bg-[#0a0f1d] flex flex-col justify-between shrink-0 md:h-screen md:sticky md:top-0 overflow-y-auto no-print">
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
              ⚡
            </div>
            <span>DevFolio CMS</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
            title="View Public Site"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = currentPath === item.href;
            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  active
                    ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-blue-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800/80 space-y-2">
        <button
          onClick={onLogout || (() => navigate('/admin/login'))}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/20 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

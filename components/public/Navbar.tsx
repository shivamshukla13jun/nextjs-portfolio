import React, { useState } from 'react';
import { Menu, X, FileText, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export default function Navbar({ currentPath, navigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Overview' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/experience', label: 'Experience' },
    { href: '/skills', label: 'Skills' },
    { href: '/services', label: 'Services' },
    { href: '/blog', label: 'Blog' },
    { href: '/resume', label: 'Resume & PDF', highlight: true },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#0b0f17]/95 backdrop-blur-md no-print">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/')} className="group flex items-center gap-2.5 text-left">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-mono font-bold text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            SS
          </div>
          <div>
            <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
              Shivam Shukla
            </div>
            <div className="text-[10px] font-mono text-slate-400">Senior MERN Stack Developer</div>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = currentPath === link.href || (link.href !== '/' && currentPath.startsWith(link.href));
            return (
              <button
                key={link.href}
                onClick={() => navigate(link.href)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? 'text-white bg-slate-800/90 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                } ${link.highlight ? 'text-blue-400 font-semibold border border-blue-500/30 bg-blue-950/30' : ''}`}
              >
                {link.label}
              </button>
            );
          })}
          <button
            onClick={() => navigate('/admin')}
            className="ml-3 px-2.5 py-1 text-[11px] font-mono rounded border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"
          >
            Admin CMS
          </button>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => navigate('/resume')}
            className="flex items-center gap-1 rounded bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Resume</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0b0f17] px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => {
                navigate(link.href);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              navigate('/admin');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-xs font-mono text-slate-400 hover:text-white"
          >
            → Admin Portal
          </button>
        </div>
      )}
    </header>
  );
}

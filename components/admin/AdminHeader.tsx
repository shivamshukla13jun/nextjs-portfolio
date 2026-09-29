import React from 'react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export default function AdminHeader({ title, subtitle, actionButton }: AdminHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {actionButton && <div className="flex items-center gap-2">{actionButton}</div>}
    </div>
  );
}

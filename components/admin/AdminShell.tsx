'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from './AdminSidebar';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const currentPath = usePathname();
  const navigate = (p: string) => router.push(p);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // best-effort cookie clear
    }
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar currentPath={currentPath} navigate={navigate} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col overflow-y-auto min-w-0 max-h-screen">{children}</div>
    </div>
  );
}

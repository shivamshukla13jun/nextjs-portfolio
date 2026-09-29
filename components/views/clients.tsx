'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { Profile, Skill, Experience, Project, Service, Blog } from '@/types/portfolio';
import type { Resume as ResumeDoc } from '@/types/resume';
import {
  PublicHeader,
  PublicFooter,
  PublicHomeView,
  PublicProjectsView,
  PublicProjectDetailView,
  PublicServicesView,
  PublicBlogView,
  PublicBlogDetailView,
  AdminLoginView,
  AdminDashboardView,
} from './public-views';

export function useNav() {
  const router = useRouter();
  return (path: string) => router.push(path);
}

// Shared public-site chrome (header + footer) used by app/(public)/layout.tsx
export function PublicShell({ children }: { children: React.ReactNode }) {
  const currentPath = usePathname();
  const navigate = useNav();
  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
      <PublicHeader currentPath={currentPath} navigate={navigate} />
      <main className="flex-1">{children}</main>
      <PublicFooter navigate={navigate} />
    </div>
  );
}

export function HomeClient(props: {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  services: Service[];
  blogs: Blog[];
}) {
  const navigate = useNav();
  return <PublicHomeView {...props} navigate={navigate} />;
}

export function ProjectsClient({ projects }: { projects: Project[] }) {
  const navigate = useNav();
  return <PublicProjectsView projects={projects} navigate={navigate} />;
}

export function ProjectDetailClient({ project }: { project: Project }) {
  const navigate = useNav();
  return <PublicProjectDetailView project={project} onBack={() => navigate('/projects')} />;
}

export function ServicesClient({ services }: { services: Service[] }) {
  const navigate = useNav();
  return <PublicServicesView services={services} navigate={navigate} />;
}

export function BlogClient({ blogs }: { blogs: Blog[] }) {
  const navigate = useNav();
  return <PublicBlogView blogs={blogs} navigate={navigate} />;
}

export function BlogDetailClient({ blog }: { blog: Blog }) {
  const navigate = useNav();
  return <PublicBlogDetailView blog={blog} onBack={() => navigate('/blog')} />;
}

export function LoginClient() {
  const router = useRouter();
  return (
    <AdminLoginView
      onLoginSuccess={() => {
        router.push('/admin');
        router.refresh();
      }}
      onBackToSite={() => router.push('/')}
    />
  );
}

export function DashboardClient(props: {
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  blogs: Blog[];
  resumes: ResumeDoc[];
}) {
  const navigate = useNav();
  return <AdminDashboardView {...props} navigate={navigate} />;
}

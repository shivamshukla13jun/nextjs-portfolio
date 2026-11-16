'use client';

import React, { useEffect, useState } from 'react';
import { DashboardClient } from '@/components/views/clients';
import AdminProfileView from './AdminProfileView';
import AdminExperienceView from './AdminExperienceView';
import AdminProjectsView from './AdminProjectsView';
import AdminSkillsView from './AdminSkillsView';
import AdminEducationView from './AdminEducationView';
import AdminCertificationsView from './AdminCertificationsView';
import AdminServicesView from './AdminServicesView';
import AdminBlogView from './AdminBlogView';
import AdminFilesView from './AdminFilesView';
import AdminAIAssistantView from './AdminAIAssistantView';
import AdminMessagesView from './AdminMessagesView';
import AdminSettingsView from './AdminSettingsView';

/** Fetch JSON from an API endpoint and expose a reload fn (for onUpdated). */
function useJson<T = any>(url: string, pick: (d: any) => T): [T | null, () => Promise<void>] {
  const [data, setData] = useState<T | null>(null);
  const load = async () => {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setData(pick(json));
      }
    } catch {
      // keep previous state
    }
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  return [data, load];
}

export function DashboardPage() {
  const [projects] = useJson('/api/portfolio/projects', (d) => d.projects || []);
  const [skills] = useJson('/api/portfolio/skills', (d) => d.skills || []);
  const [experiences] = useJson('/api/portfolio/experiences', (d) => d.experiences || []);
  const [blogs] = useJson('/api/portfolio/blogs?all=true', (d) => d.blogs || []);
  return (
    <DashboardClient
      projects={projects || []}
      skills={skills || []}
      experiences={experiences || []}
      blogs={blogs || []}
    />
  );
}

export function ProfilePage() {
  const [profile, load] = useJson('/api/portfolio/profile', (d) => d.profile);
  if (!profile) return null;
  return <AdminProfileView profile={profile} onUpdated={load} />;
}

export function ExperiencePage() {
  const [experiences, load] = useJson('/api/portfolio/experiences', (d) => d.experiences || []);
  return <AdminExperienceView experiences={experiences || []} onUpdated={load} />;
}

export function ProjectsPage() {
  const [projects, load] = useJson('/api/portfolio/projects', (d) => d.projects || []);
  return <AdminProjectsView projects={projects || []} onUpdated={load} />;
}

export function SkillsPage() {
  const [skills, load] = useJson('/api/portfolio/skills', (d) => d.skills || []);
  return <AdminSkillsView skills={skills || []} onUpdated={load} />;
}

export function EducationPage() {
  const [education, load] = useJson('/api/portfolio/education', (d) => d.education || []);
  return <AdminEducationView education={education || []} onUpdated={load} />;
}

export function CertificationsPage() {
  const [certifications, load] = useJson('/api/portfolio/certifications', (d) => d.certifications || []);
  return <AdminCertificationsView certifications={certifications || []} onUpdated={load} />;
}

export function ServicesPage() {
  const [services, load] = useJson('/api/portfolio/services', (d) => d.services || []);
  return <AdminServicesView services={services || []} onUpdated={load} />;
}

export function BlogAdminPage() {
  const [blogs, load] = useJson('/api/portfolio/blogs?all=true', (d) => d.blogs || []);
  return <AdminBlogView blogs={blogs || []} onUpdated={load} />;
}

export function SettingsPage() {
  const [settings, load] = useJson('/api/portfolio/settings', (d) => d.settings);
  if (!settings) return null;
  return <AdminSettingsView settings={settings} onUpdated={load} />;
}

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { ProjectDetailClient } from '@/components/views/clients';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await PortfolioRepository.getProjectBySlug(slug);
  return { title: project ? `${project.name} — Shivam Shukla` : 'Project — Shivam Shukla' };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await PortfolioRepository.getProjectBySlug(slug);
  if (!project) notFound();
  return <ProjectDetailClient project={project} />;
}

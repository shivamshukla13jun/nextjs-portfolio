import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { ProjectsClient } from '@/components/views/clients';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await PortfolioRepository.getProjects();
  return <ProjectsClient projects={projects || []} />;
}

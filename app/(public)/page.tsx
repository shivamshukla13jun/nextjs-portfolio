import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { HomeClient } from '@/components/views/clients';
import { SEED_PROFILE } from '@/lib/db/seed-data';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [profile, projects, skills, experiences, services, blogs] = await Promise.all([
    PortfolioRepository.getProfile(),
    PortfolioRepository.getProjects(),
    PortfolioRepository.getSkills(),
    PortfolioRepository.getExperiences(),
    PortfolioRepository.getServices(),
    PortfolioRepository.getBlogs(true),
  ]);

  return (
    <HomeClient
      profile={profile || SEED_PROFILE}
      projects={projects || []}
      skills={skills || []}
      experiences={experiences || []}
      services={services || []}
      blogs={blogs || []}
    />
  );
}

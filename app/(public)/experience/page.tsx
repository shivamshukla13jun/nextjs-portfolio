import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { PublicExperienceView } from '@/components/views/public-views';

export const dynamic = 'force-dynamic';

export default async function ExperiencePage() {
  const experiences = await PortfolioRepository.getExperiences();
  return <PublicExperienceView experiences={experiences || []} />;
}

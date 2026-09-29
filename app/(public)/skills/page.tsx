import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { PublicSkillsView } from '@/components/views/public-views';

export const dynamic = 'force-dynamic';

export default async function SkillsPage() {
  const skills = await PortfolioRepository.getSkills();
  return <PublicSkillsView skills={skills || []} />;
}

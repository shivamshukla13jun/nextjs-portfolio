import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { PublicResumeView } from '@/components/views/public-views';
import { SEED_RESUME } from '@/lib/db/seed-data';

export const dynamic = 'force-dynamic';

export default async function ResumePage() {
  const resumes = (await PortfolioRepository.getResumes()) || [];
  const defaultResume = resumes.find((r: any) => r.isDefault) || resumes[0] || SEED_RESUME;
  return <PublicResumeView resumes={resumes} defaultResume={defaultResume} />;
}

import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { PublicAboutView } from '@/components/views/public-views';
import { SEED_PROFILE } from '@/lib/db/seed-data';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const [profile, education, certifications] = await Promise.all([
    PortfolioRepository.getProfile(),
    PortfolioRepository.getEducation(),
    PortfolioRepository.getCertifications(),
  ]);
  return (
    <PublicAboutView
      profile={profile || SEED_PROFILE}
      education={education || []}
      certifications={certifications || []}
    />
  );
}

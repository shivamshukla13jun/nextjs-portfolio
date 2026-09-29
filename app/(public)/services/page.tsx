import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { ServicesClient } from '@/components/views/clients';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const services = await PortfolioRepository.getServices();
  return <ServicesClient services={services || []} />;
}

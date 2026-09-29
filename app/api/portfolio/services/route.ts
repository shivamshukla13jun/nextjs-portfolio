import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { handle, jres, requireAuth, unauthorized, OPTIONS } from '@/server/api-utils';

export const dynamic = 'force-dynamic';
export { OPTIONS };

export const GET = handle(async (req) => {
  const services = await PortfolioRepository.getServices();
  return jres(req, { services });
});

export const POST = handle(async (req) => {
  if (!(await requireAuth(req))) return unauthorized(req);
  const data = await req.json();
  const service = await PortfolioRepository.addService(data);
  return jres(req, { success: true, service });
});

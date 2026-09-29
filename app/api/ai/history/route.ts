import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { handle, jres, requireAuth, unauthorized, OPTIONS } from '@/server/api-utils';

export const dynamic = 'force-dynamic';
export { OPTIONS };

export const GET = handle(async (req) => {
  if (!(await requireAuth(req))) return unauthorized(req);
  const history = await PortfolioRepository.getAIGenerations();
  return jres(req, { history });
});

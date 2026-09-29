import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { handle, jres, requireAuth, unauthorized, OPTIONS } from '@/server/api-utils';

export const dynamic = 'force-dynamic';
export { OPTIONS };

export const PATCH = handle(async (req, ctx) => {
  if (!(await requireAuth(req))) return unauthorized(req);
  const { id } = await ctx.params;
  const data = await req.json();
  const success = await PortfolioRepository.updateAIGenerationStatus(id, data.status);
  return jres(req, { success });
});

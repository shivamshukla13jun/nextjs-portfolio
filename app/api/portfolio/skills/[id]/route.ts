import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { handle, jres, requireAuth, unauthorized, OPTIONS } from '@/server/api-utils';

export const dynamic = 'force-dynamic';
export { OPTIONS };

export const PUT = handle(async (req, ctx) => {
  if (!(await requireAuth(req))) return unauthorized(req);
  const { id } = await ctx.params;
  const data = await req.json();
  const skill = await PortfolioRepository.updateSkill(id, data);
  return jres(req, { success: true, skill });
});

export const DELETE = handle(async (req, ctx) => {
  if (!(await requireAuth(req))) return unauthorized(req);
  const { id } = await ctx.params;
  const success = await PortfolioRepository.deleteSkill(id);
  return jres(req, { success });
});

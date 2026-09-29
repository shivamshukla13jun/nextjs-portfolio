import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { handle, jres, requireAuth, unauthorized, OPTIONS } from '@/server/api-utils';

export const dynamic = 'force-dynamic';
export { OPTIONS };

export const PATCH = handle(async (req, ctx) => {
  if (!(await requireAuth(req))) return unauthorized(req);
  const { id } = await ctx.params;
  const data = await req.json();
  const success = await PortfolioRepository.markMessageRead(id, data.read);
  return jres(req, { success });
});

export const DELETE = handle(async (req, ctx) => {
  if (!(await requireAuth(req))) return unauthorized(req);
  const { id } = await ctx.params;
  const success = await PortfolioRepository.deleteContactMessage(id);
  return jres(req, { success });
});

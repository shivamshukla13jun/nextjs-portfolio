import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { handle, jres, notFound, requireAuth, unauthorized, OPTIONS } from '@/server/api-utils';

export const dynamic = 'force-dynamic';
export { OPTIONS };

export const GET = handle(async (req, ctx) => {
  const { id } = await ctx.params;
  const resume = await PortfolioRepository.getResumeById(id);
  if (!resume) return notFound(req, 'Resume not found');
  return jres(req, { resume });
});

export const PUT = handle(async (req, ctx) => {
  if (!(await requireAuth(req))) return unauthorized(req);
  const { id } = await ctx.params;
  const data = await req.json();
  const resume = await PortfolioRepository.saveResume({ ...data, id });
  return jres(req, { success: true, resume });
});

export const DELETE = handle(async (req, ctx) => {
  if (!(await requireAuth(req))) return unauthorized(req);
  const { id } = await ctx.params;
  const success = await PortfolioRepository.deleteResume(id);
  return jres(req, { success });
});

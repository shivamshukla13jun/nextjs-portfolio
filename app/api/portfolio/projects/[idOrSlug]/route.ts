import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { handle, jres, notFound, requireAuth, unauthorized, OPTIONS } from '@/server/api-utils';

export const dynamic = 'force-dynamic';
export { OPTIONS };

export const GET = handle(async (req, ctx) => {
  const { idOrSlug } = await ctx.params;
  const project = await PortfolioRepository.getProjectBySlug(idOrSlug);
  if (!project) return notFound(req, 'Project not found');
  return jres(req, { project });
});

export const PUT = handle(async (req, ctx) => {
  if (!(await requireAuth(req))) return unauthorized(req);
  const { idOrSlug } = await ctx.params;
  const data = await req.json();
  const project = await PortfolioRepository.updateProject(idOrSlug, data);
  return jres(req, { success: true, project });
});

export const DELETE = handle(async (req, ctx) => {
  if (!(await requireAuth(req))) return unauthorized(req);
  const { idOrSlug } = await ctx.params;
  const success = await PortfolioRepository.deleteProject(idOrSlug);
  return jres(req, { success });
});

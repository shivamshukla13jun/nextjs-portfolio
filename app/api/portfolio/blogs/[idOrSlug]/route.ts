import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { handle, jres, notFound, requireAuth, unauthorized, OPTIONS } from '@/server/api-utils';

export const dynamic = 'force-dynamic';
export { OPTIONS };

export const GET = handle(async (req, ctx) => {
  const { idOrSlug } = await ctx.params;
  const blog = await PortfolioRepository.getBlogBySlug(idOrSlug);
  if (!blog) return notFound(req, 'Blog not found');
  return jres(req, { blog });
});

export const PUT = handle(async (req, ctx) => {
  if (!(await requireAuth(req))) return unauthorized(req);
  const { idOrSlug } = await ctx.params;
  const data = await req.json();
  const blog = await PortfolioRepository.updateBlog(idOrSlug, data);
  return jres(req, { success: true, blog });
});

export const DELETE = handle(async (req, ctx) => {
  if (!(await requireAuth(req))) return unauthorized(req);
  const { idOrSlug } = await ctx.params;
  const success = await PortfolioRepository.deleteBlog(idOrSlug);
  return jres(req, { success });
});

import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { handle, jres, requireAuth, unauthorized, OPTIONS } from '@/server/api-utils';

export const dynamic = 'force-dynamic';
export { OPTIONS };

export const GET = handle(async (req) => {
  const all = req.nextUrl.search.includes('all=true');
  if (all && !(await requireAuth(req))) return unauthorized(req);
  const blogs = await PortfolioRepository.getBlogs(!all);
  return jres(req, { blogs });
});

export const POST = handle(async (req) => {
  if (!(await requireAuth(req))) return unauthorized(req);
  const data = await req.json();
  const slug =
    data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const blog = await PortfolioRepository.addBlog({ ...data, slug });
  return jres(req, { success: true, blog });
});

import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { handle, jres, requireAuth, unauthorized, OPTIONS } from '@/server/api-utils';

export const dynamic = 'force-dynamic';
export { OPTIONS };

export const GET = handle(async (req) => {
  const projects = await PortfolioRepository.getProjects();
  return jres(req, { projects });
});

export const POST = handle(async (req) => {
  if (!(await requireAuth(req))) return unauthorized(req);
  const data = await req.json();
  const slug =
    data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const project = await PortfolioRepository.addProject({ ...data, slug });
  return jres(req, { success: true, project });
});

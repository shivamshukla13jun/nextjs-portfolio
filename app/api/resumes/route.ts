import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { handle, jres, requireAuth, unauthorized, OPTIONS } from '@/server/api-utils';

export const dynamic = 'force-dynamic';
export { OPTIONS };

export const GET = handle(async (req) => {
  const resumes = await PortfolioRepository.getResumes();
  return jres(req, { resumes });
});

export const POST = handle(async (req) => {
  if (!(await requireAuth(req))) return unauthorized(req);
  const data = await req.json();
  const resume = await PortfolioRepository.saveResume(data);
  return jres(req, { success: true, resume });
});

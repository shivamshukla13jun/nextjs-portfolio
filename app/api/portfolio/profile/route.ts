import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { handle, jres, requireAuth, unauthorized, OPTIONS } from '@/server/api-utils';

export const dynamic = 'force-dynamic';
export { OPTIONS };

export const GET = handle(async (req) => {
  const profile = await PortfolioRepository.getProfile();
  return jres(req, { profile });
});

export const PUT = handle(async (req) => {
  if (!(await requireAuth(req))) return unauthorized(req);
  const data = await req.json();
  const updated = await PortfolioRepository.updateProfile(data);
  return jres(req, { success: true, profile: updated });
});

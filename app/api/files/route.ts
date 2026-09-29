import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { handle, jres, requireAuth, unauthorized, OPTIONS } from '@/server/api-utils';

export const dynamic = 'force-dynamic';
export { OPTIONS };

// Admin only — file listing
export const GET = handle(async (req) => {
  if (!(await requireAuth(req))) return unauthorized(req);
  const files = (await (PortfolioRepository as any).getFiles?.()) || [];
  return jres(req, { files });
});

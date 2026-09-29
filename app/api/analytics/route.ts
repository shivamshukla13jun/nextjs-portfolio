import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { handle, jres, requireAuth, unauthorized, OPTIONS } from '@/server/api-utils';

export const dynamic = 'force-dynamic';
export { OPTIONS };

// Public — page-view / event tracking beacon
export const POST = handle(async (req) => {
  const data = await req.json();
  await PortfolioRepository.recordAnalytics(data.type, data.path);
  return jres(req, { success: true });
});

// Admin only — analytics summary
export const GET = handle(async (req) => {
  if (!(await requireAuth(req))) return unauthorized(req);
  const summary = await PortfolioRepository.getAnalyticsSummary();
  return jres(req, { summary });
});

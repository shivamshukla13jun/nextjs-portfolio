import { PortfolioRepository } from '@/server/repositories/portfolio.repository';
import { handle, jres, badRequest, requireAuth, unauthorized, OPTIONS } from '@/server/api-utils';

export const dynamic = 'force-dynamic';
export { OPTIONS };

export const GET = handle(async (req) => {
  if (!(await requireAuth(req))) return unauthorized(req);
  const messages = await PortfolioRepository.getContactMessages();
  return jres(req, { messages });
});

export const POST = handle(async (req) => {
  const data = await req.json();
  if (!data.name || !data.email || !data.subject || !data.message) {
    return badRequest(req, 'All fields are required.');
  }
  const saved = await PortfolioRepository.addContactMessage(data);
  return jres(req, {
    success: true,
    message: 'Thank you for your message! Shivam will get back to you shortly.',
    id: saved.id,
  });
});

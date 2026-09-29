import { getAuthPayload, handle, jres, OPTIONS } from '@/server/api-utils';

export const dynamic = 'force-dynamic';
export { OPTIONS };

export const GET = handle(async (req) => {
  const payload = await getAuthPayload(req);
  if (!payload) {
    return jres(req, { authenticated: false });
  }
  return jres(req, {
    authenticated: true,
    user: { id: payload.userId, email: payload.email, name: payload.name, role: payload.role },
  });
});

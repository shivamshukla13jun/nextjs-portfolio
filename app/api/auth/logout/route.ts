import { handle, jres, OPTIONS } from '@/server/api-utils';

export const dynamic = 'force-dynamic';
export { OPTIONS };

export const POST = handle(async (req) => {
  return jres(req, { success: true }, 200, {
    'Set-Cookie': 'devfolio_admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
  });
});

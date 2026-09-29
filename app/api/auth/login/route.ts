import { AuthService } from '@/server/services/auth.service';
import { handle, jres, OPTIONS } from '@/server/api-utils';

export const dynamic = 'force-dynamic';
export { OPTIONS };

export const POST = handle(async (req) => {
  const data = await req.json();
  const result = await AuthService.login(data.email, data.password);
  if (!result) {
    return jres(req, { error: 'Invalid email or password' }, 401);
  }
  return jres(req, { success: true, user: result.user, token: result.token }, 200, {
    'Set-Cookie': `devfolio_admin_session=${result.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
  });
});

import { AuthService } from '@/server/services/auth.service';
import { getAuthPayload, handle, jres, requireAuth, unauthorized, OPTIONS } from '@/server/api-utils';

export const dynamic = 'force-dynamic';
export { OPTIONS };

export const POST = handle(async (req) => {
  const payload = await requireAuth(req);
  if (!payload) return unauthorized(req);
  const data = await req.json();
  const success = await AuthService.changePassword(
    (payload.userId as string) || 'usr-admin-1',
    data.currentPassword,
    data.newPassword
  );
  if (!success) {
    return jres(req, { error: 'Incorrect current password' }, 400);
  }
  return jres(req, { success: true });
});

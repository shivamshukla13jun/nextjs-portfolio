import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthService } from '@/server/services/auth.service';
import { LoginClient } from '@/components/views/clients';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  const store = await cookies();
  const token = store.get('devfolio_admin_session')?.value;
  if (token && (await AuthService.verifyToken(token))) {
    redirect('/admin');
  }
  return <LoginClient />;
}

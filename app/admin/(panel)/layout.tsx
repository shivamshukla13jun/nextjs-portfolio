import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthService } from '@/server/services/auth.service';
import AdminShell from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const token = store.get('devfolio_admin_session')?.value;
  const payload = token ? await AuthService.verifyToken(token) : null;
  if (!payload) {
    redirect('/admin/login');
  }
  return <AdminShell>{children}</AdminShell>;
}

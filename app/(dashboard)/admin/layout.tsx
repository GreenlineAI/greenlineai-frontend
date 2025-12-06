import { checkAdminAccess } from '@/lib/auth/check-access';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side check - will redirect if not admin
  await checkAdminAccess();

  return <>{children}</>;
}

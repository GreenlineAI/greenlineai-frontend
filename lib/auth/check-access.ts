'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'user' | 'unauthorized';

export interface AuthorizedUser {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

/**
 * Check if the current user is authorized to access the dashboard
 * Redirects to /unauthorized if not authorized
 */
export async function checkDashboardAccess(): Promise<AuthorizedUser> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if user is in the admin_users table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: adminUser, error } = await (supabase as any)
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single();

  if (error || !adminUser) {
    redirect('/unauthorized');
  }

  // Cast adminUser to expected shape
  const admin = adminUser as {
    role: string;
    is_active: boolean;
    login_count: number | null;
  };

  // Update last login
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from('admin_users')
    .update({
      last_login_at: new Date().toISOString(),
      login_count: (admin.login_count || 0) + 1,
    })
    .eq('user_id', user.id);

  return {
    id: user.id,
    email: user.email || '',
    role: admin.role as UserRole,
    isActive: admin.is_active,
  };
}

/**
 * Check if user has admin privileges
 */
export async function checkAdminAccess(): Promise<AuthorizedUser> {
  const user = await checkDashboardAccess();

  if (!['super_admin', 'admin'].includes(user.role)) {
    redirect('/dashboard?error=insufficient_permissions');
  }

  return user;
}

/**
 * Check if user is super admin
 */
export async function checkSuperAdminAccess(): Promise<AuthorizedUser> {
  const user = await checkDashboardAccess();

  if (user.role !== 'super_admin') {
    redirect('/dashboard?error=super_admin_required');
  }

  return user;
}

/**
 * Get current user's role (client-safe version)
 */
export async function getUserRole(): Promise<UserRole> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return 'unauthorized';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: adminUser } = await (supabase as any)
    .from('admin_users')
    .select('role, is_active')
    .eq('user_id', user.id)
    .single();

  const admin = adminUser as { role: string; is_active: boolean } | null;

  if (!admin || !admin.is_active) {
    return 'unauthorized';
  }

  return admin.role as UserRole;
}

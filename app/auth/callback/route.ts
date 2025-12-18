import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // If explicit next param provided, use it
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      // Otherwise, check if user has completed onboarding
      const { data: { user } } = await supabase.auth.getUser();

      if (user && user.email) {
        // Check if user has a business_onboarding record
        const { data: onboarding } = await supabase
          .from('business_onboarding')
          .select('id, status')
          .eq('email', user.email)
          .maybeSingle();

        // If no onboarding or status is pending, send to get-started
        if (!onboarding) {
          return NextResponse.redirect(`${origin}/get-started`);
        }

        // If onboarding exists and has an agent, go to dashboard
        if (onboarding.status === 'active' || onboarding.status === 'agent_created') {
          return NextResponse.redirect(`${origin}/dashboard`);
        }

        // Onboarding exists but not complete, go to dashboard to see status
        return NextResponse.redirect(`${origin}/dashboard`);
      }

      // Fallback to get-started for new users
      return NextResponse.redirect(`${origin}/get-started`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}

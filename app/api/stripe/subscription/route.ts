import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription info from profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile, error: profileError } = await (supabase.from('profiles') as any)
      .select('plan, stripe_customer_id, stripe_subscription_id, subscription_status, subscription_period_end')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      return NextResponse.json({
        plan: 'leads',
        status: null,
        periodEnd: null,
        stripeCustomerId: null,
      });
    }

    return NextResponse.json({
      plan: profile?.plan || 'leads',
      status: profile?.subscription_status || null,
      periodEnd: profile?.subscription_period_end || null,
      stripeCustomerId: profile?.stripe_customer_id || null,
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

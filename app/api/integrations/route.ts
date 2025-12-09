import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Get all integrations for the current user
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use type assertion since integrations table is new
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: integrations, error } = await (supabase.from('integrations') as any)
      .select('id, provider, provider_email, connected_at, metadata')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching integrations:', error);
      return NextResponse.json({ error: 'Failed to fetch integrations' }, { status: 500 });
    }

    return NextResponse.json({ integrations: integrations || [] });
  } catch (error) {
    console.error('Integrations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

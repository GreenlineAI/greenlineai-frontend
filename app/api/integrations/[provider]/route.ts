import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// DELETE - Disconnect an integration
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Map URL-friendly names to database values
    const providerMap: Record<string, string> = {
      'google-calendar': 'google_calendar',
      'google_calendar': 'google_calendar',
      'slack': 'slack',
      'hubspot': 'hubspot',
      'salesforce': 'salesforce',
    };

    const dbProvider = providerMap[provider];
    if (!dbProvider) {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
    }

    // Use type assertion since integrations table is new
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const integrationsTable = supabase.from('integrations') as any;

    // Get the integration to revoke Google access
    const { data: integration } = await integrationsTable
      .select('access_token')
      .eq('user_id', user.id)
      .eq('provider', dbProvider)
      .single();

    if (integration?.access_token && dbProvider === 'google_calendar') {
      // Revoke Google access token
      try {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${integration.access_token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
      } catch {
        // Continue even if revoke fails
        console.warn('Failed to revoke Google token');
      }
    }

    // Delete the integration
    const { error } = await integrationsTable
      .delete()
      .eq('user_id', user.id)
      .eq('provider', dbProvider);

    if (error) {
      console.error('Error deleting integration:', error);
      return NextResponse.json({ error: 'Failed to disconnect' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Disconnect error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

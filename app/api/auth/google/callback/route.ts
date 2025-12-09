import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect(
        new URL(`/dashboard/settings?tab=integrations&error=${error}`, process.env.NEXT_PUBLIC_APP_URL)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/dashboard/settings?tab=integrations&error=missing_params', process.env.NEXT_PUBLIC_APP_URL)
      );
    }

    // Verify state from cookie
    const storedState = request.cookies.get('google_oauth_state')?.value;
    if (!storedState || storedState !== state) {
      return NextResponse.redirect(
        new URL('/dashboard/settings?tab=integrations&error=invalid_state', process.env.NEXT_PUBLIC_APP_URL)
      );
    }

    // Parse state to get user ID
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    const userId = stateData.userId;

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange failed:', errorData);
      return NextResponse.redirect(
        new URL('/dashboard/settings?tab=integrations&error=token_exchange_failed', process.env.NEXT_PUBLIC_APP_URL)
      );
    }

    const tokens = await tokenResponse.json();

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const googleUser = await userInfoResponse.json();

    // Store tokens in Supabase
    const supabase = await createClient();

    // Use type assertion since integrations table is new and types may not be generated yet
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const integrationsTable = supabase.from('integrations') as any;

    // Check if integration already exists
    const { data: existingIntegration } = await integrationsTable
      .select('id')
      .eq('user_id', userId)
      .eq('provider', 'google_calendar')
      .single();

    const integrationData = {
      user_id: userId,
      provider: 'google_calendar',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      provider_user_id: googleUser.id,
      provider_email: googleUser.email,
      metadata: {
        name: googleUser.name,
        picture: googleUser.picture,
        scope: tokens.scope,
      },
      connected_at: new Date().toISOString(),
    };

    if (existingIntegration) {
      // Update existing integration
      const { error: updateError } = await integrationsTable
        .upsert(integrationData, { onConflict: 'user_id,provider' });

      if (updateError) {
        console.error('Update error:', updateError);
      }
    } else {
      // Insert new integration
      const { error: insertError } = await integrationsTable
        .insert(integrationData);

      if (insertError) {
        console.error('Insert error:', insertError);
      }
    }

    // Clear the state cookie
    const response = NextResponse.redirect(
      new URL('/dashboard/settings?tab=integrations&success=google_connected', process.env.NEXT_PUBLIC_APP_URL)
    );
    response.cookies.delete('google_oauth_state');

    return response;
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/dashboard/settings?tab=integrations&error=callback_failed', process.env.NEXT_PUBLIC_APP_URL)
    );
  }
}

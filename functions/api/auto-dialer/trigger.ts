/**
 * Cloudflare Pages Function - Auto-Dialer Trigger Endpoint
 * Path: /api/auto-dialer/trigger
 *
 * This endpoint can be called to manually trigger the auto-dialer process.
 */

import { scheduledHandler } from '../../scheduled/auto-dialer';

interface TriggerRequest {
  userId?: string;
  triggeredBy?: string;
  scheduledTime?: number;
}

interface Env {
  AUTO_DIALER_USER_ID: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  NEXT_PUBLIC_SITE_URL: string;
  CRON_SECRET?: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    // Optional: Add authentication
    const cronSecret = request.headers.get('X-Cron-Secret');
    if (env.CRON_SECRET && cronSecret !== env.CRON_SECRET) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body: TriggerRequest = await request.json();

    console.log('Auto-dialer triggered:', {
      userId: body.userId,
      triggeredBy: body.triggeredBy,
      time: body.scheduledTime ? new Date(body.scheduledTime).toISOString() : new Date().toISOString(),
    });

    // Call the scheduled handler
    const mockEvent = {
      scheduledTime: body.scheduledTime || Date.now(),
      cron: '0 17-23,0-2 * * 1-5',
    };

    const result = await scheduledHandler(mockEvent, env);

    return new Response(
      JSON.stringify({
        success: true,
        result,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Auto-dialer trigger error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

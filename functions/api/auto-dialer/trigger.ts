/**
 * Cloudflare Pages Function - Auto-Dialer Trigger Endpoint
 * Path: /api/auto-dialer/trigger
 * 
 * This endpoint is called by the Cloudflare Worker cron job
 * to initiate the auto-dialer process.
 */

import { scheduledHandler } from '../../functions/scheduled/auto-dialer';

interface TriggerRequest {
  userId: string;
  triggeredBy: string;
  scheduledTime: number;
}

export async function onRequestPost(context: { request: Request; env: any }) {
  const { request, env } = context;

  try {
    // Optional: Add authentication
    const cronSecret = request.headers.get('X-Cron-Secret');
    if (cronSecret !== 'your-secret-key-here') {
      // Comment this out if you don't want auth
      // return new Response('Unauthorized', { status: 401 });
    }

    const body: TriggerRequest = await request.json();
    
    console.log('Auto-dialer triggered:', {
      userId: body.userId,
      triggeredBy: body.triggeredBy,
      time: new Date(body.scheduledTime).toISOString(),
    });

    // Call the scheduled handler
    const mockEvent = {
      scheduledTime: body.scheduledTime,
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

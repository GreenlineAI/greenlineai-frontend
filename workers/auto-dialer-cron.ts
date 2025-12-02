/**
 * Cloudflare Worker - Auto-Dialer Cron Job
 * 
 * This Worker runs on a cron schedule and triggers the auto-dialer
 * by calling the Cloudflare Pages Function endpoint.
 * 
 * Deploy this as a separate Cloudflare Worker with cron trigger:
 * Schedule: 0 17-23,0-2 * * 1-5 (9 AM - 6 PM PST, Mon-Fri)
 */

type ScheduledEvent = {
  scheduledTime: number;
  cron: string;
};

type ExecutionContext = {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
};

interface Env {
  PAGES_FUNCTION_URL: string; // https://greenlineai-frontend.pages.dev
  AUTO_DIALER_USER_ID: string;
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('🕐 Cron triggered at:', new Date(event.scheduledTime).toISOString());
    
    try {
      // Call the Pages Function endpoint
      const response = await fetch(`${env.PAGES_FUNCTION_URL}/api/auto-dialer/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Cron-Secret': 'your-secret-key-here', // Add auth if needed
        },
        body: JSON.stringify({
          userId: env.AUTO_DIALER_USER_ID,
          triggeredBy: 'cron',
          scheduledTime: event.scheduledTime,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Auto-dialer failed: ${response.status} - ${error}`);
      }

      const result = await response.json();
      console.log('✅ Auto-dialer completed:', result);
    } catch (error) {
      console.error('❌ Auto-dialer error:', error);
      throw error;
    }
  },
};

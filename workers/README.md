# Cloudflare Worker Auto-Dialer Setup

This guide shows how to deploy a Cloudflare Worker that triggers the auto-dialer on a cron schedule.

## Why a Separate Worker?

Cloudflare Pages doesn't support cron triggers in `wrangler.toml`. Instead, we use:
1. **Worker** (with cron) → Triggers on schedule
2. **Pages Function** → Handles the actual auto-dialer logic

## Deployment Steps

### 1. Deploy the Worker

```bash
cd /workspaces/greenlineai-frontend/workers
npx wrangler deploy
```

This will:
- Deploy `auto-dialer-cron.ts` as a Worker
- Set up cron trigger: `0 17-23,0-2 * * 1-5` (9 AM - 6 PM PST)
- Configure environment variables from `wrangler.toml`

### 2. Verify Cron Schedule

Go to **Cloudflare Dashboard**:
1. **Workers & Pages** → **auto-dialer-cron**
2. **Triggers** tab → Verify cron schedule is active
3. Check **Logs** to monitor executions

### 3. Test Manually

Trigger the worker manually to test:

```bash
npx wrangler dev workers/auto-dialer-cron.ts
```

Or trigger via curl:
```bash
curl -X POST https://greenlineai-frontend.pages.dev/api/auto-dialer/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "0b627f19-6ea2-469b-a596-84cab72190c9",
    "triggeredBy": "manual",
    "scheduledTime": '$(date +%s)000'
  }'
```

## Architecture

```
Cloudflare Worker (Cron)
    ↓ (HTTP POST)
Pages Function: /api/auto-dialer/trigger
    ↓ (Calls)
Auto-Dialer Logic: /functions/scheduled/auto-dialer.ts
    ↓ (Makes calls via)
Stammer AI API
```

## Schedule Details

**Cron Expression**: `0 17-23,0-2 * * 1-5`
- **Time**: Every hour at :00 minutes
- **Hours**: 17-23 (5 PM - 11 PM UTC) and 0-2 (12 AM - 2 AM UTC)
- **Days**: Monday to Friday (1-5)
- **Timezone**: UTC → Converts to 9 AM - 6 PM PST/PDT

## Configuration

### Environment Variables (Set in Worker)

- `PAGES_FUNCTION_URL`: Your Pages deployment URL
- `AUTO_DIALER_USER_ID`: User ID for auto-dialer

### Optional: Add Authentication

Edit `/functions/api/auto-dialer/trigger.ts` to require a secret:

```typescript
const cronSecret = request.headers.get('X-Cron-Secret');
if (cronSecret !== env.CRON_SECRET) {
  return new Response('Unauthorized', { status: 401 });
}
```

Then add `CRON_SECRET` to both Worker and Pages environment variables.

## Monitoring

### Check Worker Logs
```bash
npx wrangler tail auto-dialer-cron
```

### Check Pages Function Logs
Go to Cloudflare Dashboard → Pages → greenlineai-frontend → Functions → Real-time logs

### Check Call Results
Visit your dashboard: https://greenlineai-frontend.pages.dev/dashboard/calls

## Troubleshooting

**Worker not triggering?**
- Verify cron is enabled in Worker settings
- Check Worker logs for errors
- Ensure PAGES_FUNCTION_URL is correct

**Pages Function failing?**
- Check environment variables are set (SUPABASE_URL, STAMMER_API_KEY, etc.)
- Verify Stammer API is working
- Check database connection

**No calls being made?**
- Verify leads exist with status 'new' or 'no_answer'
- Check daily call limit hasn't been reached
- Ensure within working hours (9 AM - 6 PM PST)

## Cost

- **Worker executions**: ~10/day × 30 days = 300 requests/month (FREE tier includes 100,000)
- **Pages Function calls**: Same as Worker executions
- **Total cost**: $0 (well within free tier)

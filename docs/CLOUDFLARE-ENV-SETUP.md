# Cloudflare Pages Environment Setup

Your app is deployed as a static Next.js export on Cloudflare Pages, which means API routes are handled by Cloudflare Functions (in the `functions/` directory).

## Current Status
✅ Cloudflare Functions exist:
- `/functions/api/calls/initiate.ts` - Initiates Stammer AI calls
- `/functions/api/calls/[id]/status.ts` - Gets call status
- `/functions/api/calls/webhook.ts` - Receives Stammer webhooks

## Required Environment Variables in Cloudflare Pages

Go to your Cloudflare Pages dashboard:
1. Navigate to: **Settings → Environment Variables**
2. Add these variables for **Production** and **Preview**:

```
VOICE_AI_PROVIDER = stammer
STAMMER_API_KEY = 9b0255369a055b13bbb215af48f8d9dcf1a2bda4
STAMMER_AGENT_ID = 893b87dd-0f63-4866-8cae-d60b696cae1a
```

## Important Notes

1. **wrangler.toml is for local development only** - These variables are NOT automatically deployed
2. **You must manually set them in Cloudflare Pages dashboard**
3. After setting variables, trigger a new deployment for them to take effect

## How to Deploy Environment Variables

### Option 1: Via Cloudflare Dashboard (Recommended)
1. Go to https://dash.cloudflare.com/
2. Select **Pages** → Your project (greenlineai-frontend)
3. Go to **Settings** → **Environment Variables**
4. Click **Add variable**
5. Add each variable listed above
6. Choose **Production** (and **Preview** if needed)
7. Click **Save**
8. Trigger a new deployment (Git push or manual redeploy)

### Option 2: Via Wrangler CLI
```bash
wrangler pages project variables add VOICE_AI_PROVIDER stammer --project-name=greenlineai-frontend
wrangler pages project variables add STAMMER_API_KEY 9b0255369a055b13bbb215af48f8d9dcf1a2bda4 --project-name=greenlineai-frontend
wrangler pages project variables add STAMMER_AGENT_ID 893b87dd-0f63-4866-8cae-d60b696cae1a --project-name=greenlineai-frontend
```

## Testing After Deployment

Once environment variables are set and deployed:

1. Go to your dashboard → Leads
2. Click "Call" on any lead
3. The system should:
   - Create a call record in Supabase
   - Make a real phone call via Stammer AI
   - Track the call status

## Troubleshooting

If calls still fail after setting variables:

1. **Check Cloudflare deployment logs** for specific errors
2. **Verify variables are set** in Cloudflare dashboard
3. **Check Stammer AI dashboard** to see if calls are being received
4. **Test the API directly**:
   ```bash
   curl -X POST https://greenlineai-frontend.pages.dev/api/calls/initiate \
     -H "Content-Type: application/json" \
     -d '{"phoneNumber": "+15555551234", "leadId": "test"}'
   ```

## Environment Variable Priority

1. **Production deployment** uses **Production** variables
2. **Preview deployments** (PR branches) use **Preview** variables
3. **Local development** uses `.env.local` file
4. **wrangler.toml** is only for `wrangler dev` local testing

## Next Steps

After setting environment variables in Cloudflare:
1. Push any code changes (or trigger manual redeploy)
2. Wait for deployment to complete
3. Test calling a lead from your dashboard
4. Check Stammer AI dashboard to confirm calls are being initiated

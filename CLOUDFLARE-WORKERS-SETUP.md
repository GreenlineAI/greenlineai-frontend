# Cloudflare Workers Setup for Retell AI

## Overview
This project uses Cloudflare Pages Functions (Workers) to handle Retell AI calling functionality. Since Next.js 16 with static export doesn't support API routes, we use Cloudflare's serverless functions instead.

## Functions Created

### 1. `/functions/api/calls/initiate.ts`
**Endpoint:** `POST /api/calls/initiate`
- Initiates outbound calls via Retell AI
- Handles phone number validation
- Creates call records in the system

### 2. `/functions/api/calls/[id]/status.ts`
**Endpoint:** `GET /api/calls/{id}/status`
- Fetches call status from Supabase or Retell AI
- Returns call details including duration, transcript, recording

### 3. `/functions/api/calls/webhook.ts`
**Endpoint:** `POST /api/calls/webhook`
- Receives webhooks from Retell AI
- Updates call status in Supabase
- Updates lead last_contacted timestamp

## Setup Instructions

### Step 1: Get Retell AI Credentials

1. Go to https://app.retellai.com/
2. Sign in to your account
3. Navigate to **Settings** → **API Keys**
4. Copy your API Key
5. Go to **Agents** and copy your Agent ID

### Step 2: Add Environment Variables to Cloudflare Pages

1. Go to your Cloudflare Dashboard
2. Navigate to **Workers & Pages** → **greenlineai-frontend**
3. Click **Settings** → **Environment Variables**
4. Add the following **Production** environment variables:

```
VOICE_AI_PROVIDER=retell
VOICE_AI_API_KEY=your_retell_api_key_here
RETELL_AGENT_ID=agent_xxxxxxxxxxxxxxxxxx
```

5. Click **Save**

### Step 3: Configure Retell AI Webhook

1. In your Retell AI dashboard, go to **Settings** → **Webhooks**
2. Add webhook URL: `https://greenline-ai.com/api/calls/webhook`
3. Select events to listen to:
   - `call_started`
   - `call_ended`
   - `call_analyzed`
4. Save the webhook

### Step 4: Deploy

Once you push your code, Cloudflare Pages will automatically:
1. Build your Next.js static site
2. Deploy the Cloudflare Workers functions
3. Make the API endpoints available at `/api/*`

## How It Works

```
User clicks "Call" in Dashboard
         ↓
Frontend sends POST to /api/calls/initiate
         ↓
Cloudflare Worker receives request
         ↓
Worker calls Retell AI API
         ↓
Retell AI initiates phone call
         ↓
Call happens (AI → Lead)
         ↓
Retell AI sends webhook to /api/calls/webhook
         ↓
Worker updates Supabase with call results
         ↓
Frontend polls /api/calls/{id}/status
         ↓
Dashboard shows updated call status
```

## Testing

After deployment, test the endpoints:

### Test Call Initiation
```bash
curl -X POST https://greenline-ai.com/api/calls/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "leadId": "uuid-here",
    "prompt": "Test call"
  }'
```

### Test Call Status
```bash
curl https://greenline-ai.com/api/calls/{call-id}/status
```

## Troubleshooting

### "Voice AI not configured" error
- Make sure `VOICE_AI_API_KEY` is set in Cloudflare environment variables
- Redeploy after adding environment variables

### Calls not initiating
- Check Retell AI dashboard for errors
- Verify your Retell AI account has credits
- Check phone number format (E.164 format: +1234567890)

### Webhooks not working
- Verify webhook URL is correct in Retell dashboard
- Check Cloudflare Workers logs for errors

## Local Development

To test Functions locally:
```bash
npm install wrangler -g
wrangler pages dev out
```

This will run the static site + Functions locally.

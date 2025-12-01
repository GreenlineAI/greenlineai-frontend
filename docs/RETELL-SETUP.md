# Retell AI Setup Guide

## ✅ You have Retell AI working! Here's how to complete the integration:

### Step 1: Get Your Credentials

1. Go to [Retell AI Dashboard](https://beta.retellai.com/dashboard)
2. Navigate to **API Keys** section
3. Copy your API key
4. Go to **Agents** section and copy your Agent ID

### Step 2: Configure Environment Variables

Update your `.env.local` file:

```env
# Retell AI Configuration
VOICE_AI_API_KEY=key_xxxxxxxxxxxxx  # Your Retell API key
VOICE_AI_PROVIDER=retell
RETELL_AGENT_ID=agent_xxxxxxxxxxxxx  # Your Retell Agent ID
VOICE_AI_PHONE_NUMBER=+14083654503   # Your Retell phone number
```

### Step 3: Configure Webhook in Retell Dashboard

1. Go to Retell Dashboard → **Settings** → **Webhooks**
2. Add webhook URL: `https://your-domain.com/api/calls/webhook`
3. For local development, use ngrok:
   ```bash
   ngrok http 3000
   # Then use: https://xxxx.ngrok.io/api/calls/webhook
   ```

### Step 4: Configure Your Agent

In Retell Dashboard, configure your agent with:

**System Prompt:**
```
You are an AI sales assistant calling on behalf of a B2B lead generation agency.

Your goals:
1. Introduce yourself professionally and ask for the business owner
2. Briefly explain you help home services businesses get more qualified leads
3. Ask if they're currently happy with their lead generation
4. If interested, offer to schedule a brief strategy call
5. If not interested, politely thank them and end the call

Be conversational, professional, and respectful of their time. Listen carefully to their responses and adjust accordingly.
```

**Voice Settings:**
- Voice: Choose a professional, friendly voice
- Speaking rate: Normal (1.0)
- Enable interruptions: Yes

**Post-Call Actions:**
- Enable call analysis
- Enable transcript
- Enable recording

### Step 5: Test the Integration

1. Start your dev server: `npm run dev`
2. Log in to the dashboard
3. Go to **Dialer** page
4. Select a lead with a valid phone number
5. Click **Start Call**

The system will:
- Create a call record in your database
- Make a real phone call via Retell AI
- Update the UI with call status
- Show transcripts when available

### Webhook Events

Retell will send webhooks for these events:

- `call_started` - Call connected
- `call_ended` - Call completed
- `call_analyzed` - Analysis ready (transcript, sentiment, etc.)

The webhook handler at `/api/calls/webhook/route.ts` will automatically:
- Update call status in database
- Store transcript and recording URL
- Update lead status based on conversation outcome
- Trigger any follow-up actions

### Call Flow

```
User clicks "Call" 
  ↓
POST /api/calls/initiate
  ↓
Retell AI creates call
  ↓
Call connects to lead's phone
  ↓
Webhooks update status in real-time
  ↓
Transcript & recording saved
  ↓
Lead status updated
```

### Monitoring Calls

You can monitor calls in:
1. **Your Dashboard** - `/dashboard/outreach` page
2. **Retell Dashboard** - See all call details
3. **Database** - Check `outreach_calls` table

### Cost Estimation

Retell AI pricing (as of Dec 2024):
- **$0.08/min** for calls
- Average call: 2-3 minutes = ~$0.20 per call
- 200 calls/day = ~$40/day

### Troubleshooting

**Call not connecting:**
- Check VOICE_AI_API_KEY is set correctly
- Verify RETELL_AGENT_ID exists
- Check phone number format (+1XXXXXXXXXX)

**Webhook not working:**
- Verify webhook URL in Retell dashboard
- Check webhook endpoint is accessible
- Use ngrok for local testing

**No transcript:**
- Wait 30-60 seconds after call ends
- Check Retell dashboard for processing status
- Verify webhook is receiving call_analyzed event

### Next Steps

1. ✅ Test calling a few leads
2. ✅ Review transcripts and adjust agent prompt
3. ✅ Set up proper phone number verification (TCPA compliance)
4. ✅ Configure business hours and daily call limits
5. ✅ Train your team on the dialer interface

### Support

- **Retell Docs:** https://docs.retellai.com/
- **API Reference:** https://docs.retellai.com/api-references/create-phone-call
- **Discord:** Join Retell AI Discord for support

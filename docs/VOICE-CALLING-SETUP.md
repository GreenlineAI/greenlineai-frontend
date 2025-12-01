# Voice AI Calling Setup Guide

## Current Status
✅ Vapi integrated (browser demos) - WORKING
⏳ Phone calling system - READY TO ACTIVATE

## What You Need

To make real phone calls from the dialer, you need ONE of these services:

### Option 1: Bland AI (Recommended - Easiest)
- **Website**: https://www.bland.ai/
- **Pricing**: $0.09/minute
- **Setup Time**: 5 minutes
- **Best For**: Simple implementation, good voice quality
- **Sign Up Issue?** Try:
  - Use different email
  - Contact: support@bland.ai
  - Join their Discord: https://discord.gg/bland-ai

### Option 2: Retell AI
- **Website**: https://www.retellai.com/
- **Pricing**: $0.08/minute
- **Setup Time**: 10 minutes
- **Best For**: Advanced conversation handling

### Option 3: Synthflow
- **Website**: https://synthflow.ai/
- **Pricing**: $0.10/minute
- **Best For**: Appointment booking focus

### Option 4: Twilio + Custom AI
- **Website**: https://www.twilio.com/
- **Pricing**: $0.02/min + AI costs
- **Setup Time**: 30+ minutes
- **Best For**: Full control, custom setup

## Quick Start (Once You Have API Key)

### Step 1: Get Your API Key
1. Sign up for Bland AI (or alternative)
2. Verify your email
3. Add payment method (they usually offer $10 free credit)
4. Copy your API key from dashboard

### Step 2: Update Environment Variables
Edit `.env.local`:
```env
VOICE_AI_API_KEY=your_actual_api_key_here
VOICE_AI_PROVIDER=bland
```

### Step 3: Test It
1. Go to `/dashboard/dialer`
2. Select a lead
3. Click "Start Call"
4. The system will make a real phone call!

## Webhook Setup (Required for Full Integration)

### For Bland AI:
1. In Bland dashboard, go to Settings > Webhooks
2. Add webhook URL: `https://your-domain.com/api/calls/webhook`
3. Enable events: `call.started`, `call.ended`, `call.failed`

### For Retell AI:
1. In Retell dashboard, go to Settings > Webhooks
2. Add webhook URL: `https://your-domain.com/api/calls/webhook`
3. Save changes

## How It Works

```
User clicks "Call" 
    ↓
Frontend sends request to /api/calls/initiate
    ↓
Backend calls Bland/Retell/Stammer API
    ↓
AI makes actual phone call to lead
    ↓
Webhooks update call status in real-time
    ↓
Frontend shows live transcript & status
```

## Testing Without Real Calls

The dialer will show an error if no API key is configured. This is expected!

To test the UI without making real calls:
1. Keep `VOICE_AI_API_KEY=your_api_key_here` (placeholder)
2. The dialer will still work but show "API key required" message
3. UI and database tracking still function

## Cost Estimation

Example: 200 calls/day × 3 minutes average × $0.09/min = **$54/day** = **$1,620/month**

Ways to reduce costs:
- Use shorter scripts (2 min avg = $1,080/month)
- Filter leads better (only call high-quality)
- Use voicemail detection (hang up faster)
- Start with 50 calls/day to test

## Troubleshooting

### "Failed to initiate call"
- Check API key is correct
- Verify phone number format (+1234567890)
- Check account has credits

### "No webhook received"
- Verify webhook URL is accessible (not localhost)
- Check webhook is configured in provider dashboard
- Use ngrok for local testing: https://ngrok.com/

### "Call shows as 'ringing' forever"
- Webhook not configured
- Check provider dashboard for call status
- Manually update call in database

## Alternative: Contact Bland AI Support

If you can't sign up:
1. **Email**: support@bland.ai
2. **Twitter/X**: @bland_ai
3. **LinkedIn**: Search "Bland AI" and message them
4. **Discord**: Join their community server

Tell them:
- You're building an AI calling platform
- Need to make outbound calls
- Having trouble with signup
- They usually respond within 24 hours

## Next Steps

1. ✅ Code is ready (you're all set!)
2. ⏳ Get API key from Bland AI or alternative
3. ⏳ Update .env.local with your key
4. ⏳ Configure webhook URL
5. 🚀 Start making calls!

**The system is 100% ready to go once you have an API key.**

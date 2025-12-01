# Stammer AI Integration Plan

## Current State
- **Vapi**: Browser-to-browser voice (demo only) ✅ Working
- **Dialer**: Simulated calls, no real phone dialing ❌ Not functional

## Problem
The dialer at `/dashboard/dialer` doesn't actually call phone numbers. It just simulates the calling experience.

## Solution: Integrate Stammer AI

### What is Stammer AI?
Stammer AI (or alternatives like Bland.ai, Retell AI) provides:
- Real PSTN phone calling to actual phone numbers
- AI voice agents that can hold conversations
- Webhook callbacks for call status
- Call recording and transcription
- Meeting booking capabilities

### Integration Steps

#### 1. Get Stammer AI API Credentials
- Sign up at stammer.ai (or bland.ai/retell.ai)
- Get API key
- Configure phone number for outbound calling
- Set up AI agent/assistant

#### 2. Add Environment Variables
```env
# Stammer AI Configuration
NEXT_PUBLIC_STAMMER_API_KEY=your_api_key_here
STAMMER_PHONE_NUMBER=+1234567890
STAMMER_AGENT_ID=your_agent_id
```

#### 3. Create Stammer AI Service
Create `/lib/services/stammer.ts`:
- Initialize calls to phone numbers
- Handle webhooks for call status
- Get call transcripts
- Track call analytics

#### 4. Update Dialer Page
Replace simulated calling with real Stammer AI calls:
- When user clicks "Start Call", trigger Stammer API
- Listen for webhooks to update call status
- Display real-time transcripts
- Record actual call outcomes

#### 5. Setup Webhook Endpoint
Create `/app/api/stammer/webhook/route.ts`:
- Receive call status updates
- Update database with call results
- Notify frontend via real-time updates

### Architecture

```
[Dialer UI] 
    ↓
[Call Button Clicked]
    ↓
[POST /api/stammer/initiate]
    ↓
[Stammer AI makes call to lead's phone]
    ↓
[Webhook updates → Database → Frontend]
```

## Alternative Services

### Bland.ai
- $0.09/min for calls
- Best for simple conversations
- Easy webhook integration

### Retell AI
- $0.08/min for calls
- Advanced conversation handling
- Great for complex objection handling

### Synthflow
- $0.10/min
- Good for appointment booking
- CRM integrations

## Recommendation
Start with **Bland.ai** - it's the easiest to integrate and has great documentation.

## Next Steps
1. Choose provider (Stammer, Bland, or Retell)
2. Get API credentials
3. I'll build the integration

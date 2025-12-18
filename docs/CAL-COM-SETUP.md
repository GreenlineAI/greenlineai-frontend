# Cal.com Integration Setup Guide

This guide walks you through setting up the Cal.com calendar integration for GreenLine AI phone agents.

---

## Overview

The Cal.com integration allows AI phone agents to:
- Check real calendar availability during calls
- Book appointments directly in Cal.com
- Send confirmation emails to customers automatically

```
┌─────────────────────────────────────────────────────────────────┐
│                        CALL FLOW                                │
│                                                                 │
│  Customer: "I'd like to schedule an appointment"                │
│                         │                                       │
│                         ▼                                       │
│  Agent calls check_calendar_availability function               │
│                         │                                       │
│                         ▼                                       │
│  Webhook → /api/calendar/check-availability                     │
│  (looks up business by agent_id, decrypts Cal.com key)          │
│                         │                                       │
│                         ▼                                       │
│  Agent: "I have Tuesday at 9am, 10am, or 11am available"        │
│                         │                                       │
│                         ▼                                       │
│  Customer: "Tuesday at 10am works"                              │
│                         │                                       │
│                         ▼                                       │
│  Agent calls create_calendar_booking function                   │
│                         │                                       │
│                         ▼                                       │
│  Booking created in Cal.com + confirmation email sent           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Step 1: Environment Variables

Add these to your `.env.local` file:

```bash
# Cal.com Integration
# Required: 32-character encryption key for storing Cal.com API keys securely
CAL_COM_ENCRYPTION_KEY=your_32_char_hex_string_here

# Required: Base URL for webhook routing (used by Retell function calls)
NEXT_PUBLIC_BASE_URL=https://www.greenline-ai.com
```

### Generate the Encryption Key

Choose one method:

```bash
# Option 1: Using openssl
openssl rand -hex 16

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"

# Option 3: Using Python
python -c "import secrets; print(secrets.token_hex(16))"
```

**Example output:** `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

Copy this value to `CAL_COM_ENCRYPTION_KEY` in your `.env.local`.

---

## Step 2: Database Migration

Run the migration to add Cal.com fields to the `business_onboarding` table:

```bash
# Using Supabase CLI
npx supabase db push
```

Or run this SQL directly in the Supabase dashboard:

```sql
-- Add Cal.com integration columns to business_onboarding table
ALTER TABLE business_onboarding
ADD COLUMN IF NOT EXISTS cal_com_api_key_encrypted TEXT,
ADD COLUMN IF NOT EXISTS cal_com_event_type_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS cal_com_validated BOOLEAN DEFAULT FALSE;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_business_onboarding_cal_com_validated
ON business_onboarding(cal_com_validated)
WHERE cal_com_validated = TRUE;
```

### Columns Added

| Column | Type | Description |
|--------|------|-------------|
| `cal_com_api_key_encrypted` | TEXT | AES-256 encrypted Cal.com API key |
| `cal_com_event_type_id` | VARCHAR(255) | Event type ID for bookings |
| `cal_com_validated` | BOOLEAN | Whether API key has been validated |

---

## Step 3: Deploy API Routes

Ensure these API endpoints are deployed and accessible:

### Required Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/api/inbound/webhook` | Routes Retell function calls |
| `/api/calendar/check-availability` | Checks Cal.com for available slots |
| `/api/calendar/create-booking` | Creates bookings in Cal.com |
| `/api/calendar/validate-key` | Validates Cal.com API keys |
| `/api/calendar/event-types` | Fetches event types for selection |

### Test the Endpoints

```bash
# Test webhook endpoint
curl https://www.greenline-ai.com/api/inbound/webhook

# Expected response:
# {"status":"ok","endpoint":"/api/inbound/webhook","description":"POST Retell AI webhook events here"}
```

---

## Step 4: Create/Update Retell Agent

The `greenline_agent.py` script now includes calendar tools automatically. When you create a new agent, it will have:

1. **Custom Tools** defined at the flow level:
   - `check_calendar_availability`
   - `create_calendar_booking`

2. **Function Nodes** that call these tools during scheduling

### Create a New Agent

```bash
cd flow-builder

# Set environment variables
export RETELL_API_KEY=your_retell_api_key
export NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
export SUPABASE_SERVICE_ROLE_KEY=your_supabase_key

# Create demo agent
python greenline_agent.py
```

### Create Agent for Specific Business

```python
from greenline_agent import create_agent_for_onboarding

# Pass the business_onboarding UUID
result = create_agent_for_onboarding("uuid-of-business-onboarding")

print(f"Agent ID: {result['agent_id']}")
print(f"Flow ID: {result['conversation_flow_id']}")
```

### Update Existing Agent

If you have existing agents, you'll need to recreate them to include the new calendar tools. The old agents won't have the function nodes.

---

## Step 5: Business Cal.com Setup

Each business needs to connect their Cal.com account:

### 5a. Create Cal.com Account

1. Go to [cal.com/signup](https://cal.com/signup)
2. Create an account (free tier works)
3. Set up their availability schedule

### 5b. Create Event Type

1. Go to **Event Types** in Cal.com
2. Click **+ New Event Type**
3. Configure:
   - Name: "Service Appointment" (or similar)
   - Duration: 30 minutes (or as needed)
   - Location: Phone call / On-site / etc.
4. Save the event type

### 5c. Get API Key

1. Go to **Settings → Developer → API Keys**
2. Click **Create new API key**
3. Name it "GreenLine AI"
4. Copy the key (starts with `cal_live_`)

### 5d. Connect in GreenLine Onboarding

In your onboarding form (or settings):

1. Business pastes their Cal.com API key
2. System validates the key via `/api/calendar/validate-key`
3. System fetches event types via `/api/calendar/event-types`
4. Business selects which event type to use
5. Key is encrypted and stored in `business_onboarding`

---

## Step 6: Testing

### Test 1: Validate API Key

```bash
curl -X POST https://www.greenline-ai.com/api/calendar/validate-key \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "cal_live_xxxxx"}'
```

**Expected:**
```json
{
  "valid": true,
  "user": {
    "email": "business@example.com",
    "name": "Business Name",
    "timeZone": "America/New_York"
  }
}
```

### Test 2: Check Availability

```bash
curl -X POST https://www.greenline-ai.com/api/calendar/check-availability \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "agent_xxxxx",
    "date_range": "next_7_days"
  }'
```

**Expected:**
```json
{
  "available": true,
  "slots": [
    {
      "datetime": "2024-01-15T09:00:00-05:00",
      "display": "Monday, January 15th at 9:00 AM"
    }
  ],
  "message": "I have some availability..."
}
```

### Test 3: Create Booking

```bash
curl -X POST https://www.greenline-ai.com/api/calendar/create-booking \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "agent_xxxxx",
    "attendee_name": "John Smith",
    "attendee_phone": "+15551234567",
    "start_time": "2024-01-15T10:00:00-05:00",
    "service_type": "Lawn Mowing"
  }'
```

**Expected:**
```json
{
  "success": true,
  "booking_id": "123456",
  "confirmation_message": "Your appointment is confirmed for Monday, January 15th at 10:00 AM."
}
```

### Test 4: Full Webhook Flow

Simulate a Retell function call:

```bash
curl -X POST https://www.greenline-ai.com/api/inbound/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "function_call",
    "call_id": "call_test123",
    "agent_id": "agent_xxxxx",
    "function_name": "check_calendar_availability",
    "function_args": {
      "date_range": "this_week"
    }
  }'
```

---

## Troubleshooting

### "Business not found for this agent"

**Cause:** The `agent_id` doesn't match any `retell_agent_id` in `business_onboarding`.

**Fix:** Ensure the agent was created with `link_agent_to_onboarding()` or manually update the `retell_agent_id` column.

### "Cal.com not configured"

**Cause:** Business hasn't connected their Cal.com account.

**Fix:** Have business complete Cal.com setup in onboarding/settings. The agent will use the fallback flow (offer callback) until configured.

### "Invalid API key"

**Cause:** Cal.com API key is incorrect or expired.

**Fix:** Generate a new API key in Cal.com dashboard and re-validate.

### "No event types found"

**Cause:** Cal.com account has no event types.

**Fix:** Create at least one event type in Cal.com (e.g., "Service Appointment").

### Encryption errors

**Cause:** `CAL_COM_ENCRYPTION_KEY` is missing or wrong length.

**Fix:** Generate a new 32-character hex key and set it in `.env.local`.

### Function node not calling webhook

**Cause:** Agent was created before calendar tools were added.

**Fix:** Recreate the agent using the updated `greenline_agent.py`.

---

## File Reference

| File | Purpose |
|------|---------|
| `flow-builder/greenline_agent.py` | Agent builder with calendar tools |
| `lib/cal-com.ts` | Cal.com API utilities & encryption |
| `app/api/inbound/webhook/route.ts` | Webhook router for Retell |
| `app/api/calendar/validate-key/route.ts` | Validate API key endpoint |
| `app/api/calendar/event-types/route.ts` | Fetch event types endpoint |
| `app/api/calendar/check-availability/route.ts` | Check availability endpoint |
| `app/api/calendar/create-booking/route.ts` | Create booking endpoint |
| `supabase/migrations/006_add_cal_com_integration.sql` | Database migration |
| `docs/CAL-COM-INTEGRATION.md` | How the integration works |

---

## Security Notes

1. **API Key Storage**: Cal.com API keys are encrypted with AES-256-CBC before storage
2. **Key Lookup**: Keys are only decrypted server-side when making Cal.com API calls
3. **Agent Isolation**: Each business's calendar is only accessible via their specific agent_id
4. **No Client Exposure**: API keys never leave the server

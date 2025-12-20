# GreenLine AI - Business Setup Guide

This guide covers the complete process for setting up a new business with GreenLine AI's AI receptionist.

## Overview

When onboarding a new business, the system:
1. Collects business information via the onboarding form
2. Creates a Retell AI conversation flow agent
3. Links the agent to the business for CRM integration
4. Optionally connects Cal.com for calendar booking

---

## Step 1: Business Onboarding Form

The business fills out the onboarding form at `/get-started`.

### Required Information

| Field | Description | Example |
|-------|-------------|---------|
| Business Name | Legal business name | "Acme Landscaping LLC" |
| Company Name for Greeting | How AI introduces the business | "Acme Landscaping" |
| Business Type | Industry category | landscaping, hvac |
| Owner Name | Name for transfers/messages | "John Smith" |
| Phone Number | Main business phone | "(408) 555-1234" |
| Email | Contact email | "john@acme.com" |
| Address | Business address | "123 Main St, San Diego, CA" |
| Services | List of services offered | ["Lawn Mowing", "Tree Trimming"] |
| Business Hours | Hours for each day | "Monday: 8AM-5PM" |

### Optional Information

| Field | Description |
|-------|-------------|
| Cal.com API Key | For calendar integration |
| Cal.com Event Type ID | Specific event type for bookings |
| Special Instructions | Custom AI behavior notes |
| Pricing Info | General pricing guidance |

---

## Step 2: Create the AI Agent

After onboarding data is saved, create the agent:

```python
from greenline_agent import create_agent_for_onboarding

result = create_agent_for_onboarding("ONBOARDING-UUID-HERE")
```

### What Gets Created

1. **Conversation Flow** - The multi-node conversation logic
2. **Voice Agent** - The Retell AI agent with voice settings
3. **CRM Link** - Connection to Supabase for lead tracking

### Output Example

```
✓ Phone number formatted: +14085551234
✓ Transfer number formatted: +14085551234
Created conversation flow: conversation_flow_abc123
Created voice agent: agent_xyz789
Linked agent to onboarding f810ca2b-...
CRM integration active
```

---

## Step 3: Assign Phone Number

After agent creation, assign a Retell phone number:

1. Go to Retell Dashboard → Phone Numbers
2. Purchase or port a number
3. Assign to the new agent

Or via API:
```python
# Purchase and assign number
phone = client.phone_number.create(
    area_code="408",
    inbound_agent_id="agent_xyz789"
)
```

---

## Step 4: Configure Cal.com (Optional)

For calendar booking integration:

### In Cal.com:
1. Create an Event Type for appointments
2. Generate an API key (Settings → Developer → API Keys)
3. Note the Event Type ID from the URL

### In Supabase:
```sql
UPDATE business_onboarding
SET
    calcom_api_key = 'cal_live_xxxxx',
    calcom_event_type_id = 123456
WHERE id = 'ONBOARDING-UUID';
```

### Test Calendar:
```bash
curl -X POST https://www.greenline-ai.com/api/calendar/check-availability \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agent_xyz789", "date_range": "next_7_days"}'
```

---

## Step 5: Test the Agent

### Quick Test (Retell Dashboard)
1. Go to your agent in Retell Dashboard
2. Click "Test Agent" or use the simulator
3. Try these scenarios:
   - "I need to schedule lawn mowing service"
   - "What are your hours?"
   - "I have an emergency"
   - "Can I speak to the owner?"

### Full Test (Phone Call)
1. Call the assigned phone number
2. Walk through each flow path
3. Verify leads appear in CRM
4. Check calendar bookings (if configured)

### Automated Tests
```bash
cd flow-builder
python test_call_scenarios.py
```

---

## Troubleshooting

### Agent Name Shows "Thank you for calling..."

**Cause:** The `greeting_name` field contains the full greeting phrase instead of just the company name.

**Fix:**
```sql
UPDATE business_onboarding
SET greeting_name = 'Acme Landscaping'  -- Just the company name!
WHERE id = 'ONBOARDING-UUID';
```
Then recreate the agent.

### Phone Number Format Errors

**Cause:** Phone not in E.164 format.

**Fix:** The system now auto-formats phone numbers. Ensure input is at least 10 digits:
- ✓ "(408) 555-1234" → +14085551234
- ✓ "408-555-1234" → +14085551234
- ✗ "408" → Warning (incomplete)

### Calendar Not Working

**Check:**
1. Cal.com API key is valid and not expired
2. Event Type ID exists and is public
3. Event Type has available slots

```sql
SELECT calcom_api_key, calcom_event_type_id
FROM business_onboarding
WHERE id = 'ONBOARDING-UUID';
```

### Leads Not Appearing in CRM

**Check:**
1. Agent is linked to onboarding:
```sql
SELECT retell_agent_id FROM business_onboarding WHERE id = 'ONBOARDING-UUID';
```

2. Webhook URL is correct:
```
https://www.greenline-ai.com/api/inbound/webhook
```

3. Check webhook logs in Retell Dashboard

---

## Environment Variables

Required for `greenline_agent.py`:

```bash
# Retell AI
RETELL_API_KEY=key_xxxxx

# Supabase (for CRM integration)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx
```

---

## Database Schema Reference

### business_onboarding Table

```sql
id                    UUID PRIMARY KEY
user_id               UUID REFERENCES auth.users
business_name         TEXT NOT NULL
greeting_name         TEXT          -- Company name for AI greeting
business_type         TEXT          -- 'landscaping', 'hvac', etc.
owner_name            TEXT
phone                 TEXT
email                 TEXT
services              TEXT[]        -- Array of service names
city                  TEXT
state                 TEXT

-- Business Hours
hours_monday          TEXT
hours_tuesday         TEXT
...

-- Retell Integration
retell_agent_id       TEXT          -- Set after agent creation
retell_phone_number   TEXT          -- Set after phone assignment
status                TEXT          -- 'pending', 'agent_created', 'active'

-- Cal.com Integration
calcom_api_key        TEXT          -- Encrypted
calcom_event_type_id  INTEGER
```

---

## Quick Reference Commands

```bash
# Create agent for onboarding
python -c "from greenline_agent import create_agent_for_onboarding; create_agent_for_onboarding('UUID')"

# List all agents
python -c "from retell import Retell; c=Retell(api_key='KEY'); print([a.agent_name for a in c.agent.list()])"

# Delete an agent
python -c "from retell import Retell; c=Retell(api_key='KEY'); c.agent.delete('AGENT_ID')"

# Run tests
python test_call_scenarios.py
```

---

## Flow Diagram

```
                    ┌─────────────┐
                    │  GREETING   │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌──────────────┐ ┌──────────┐ ┌─────────────┐
    │ SCHEDULE     │ │ QUESTIONS│ │ URGENCY     │
    │ SERVICE      │ │          │ │ CHECK       │
    └──────┬───────┘ └────┬─────┘ └──────┬──────┘
           │              │              │
           ▼              │              ▼
    ┌──────────────┐      │       ┌─────────────┐
    │ COLLECT      │      │       │ TRANSFER or │
    │ INFO         │      │       │ MESSAGE     │
    └──────┬───────┘      │       └─────────────┘
           │              │
           ▼              │
    ┌──────────────┐      │
    │ CHECK        │◄─────┘
    │ AVAILABILITY │
    └──────┬───────┘
           │
    ┌──────┴──────┐
    ▼             ▼
┌────────┐  ┌──────────┐
│ BOOK   │  │ FALLBACK │
│ APPT   │  │ MESSAGE  │
└────────┘  └──────────┘
```

---

## Support

- Retell AI Docs: https://docs.retellai.com
- Cal.com API: https://cal.com/docs/api
- GreenLine Support: support@greenline-ai.com

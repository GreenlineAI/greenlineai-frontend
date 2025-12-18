# Cal.com Integration Testing Guide

This guide walks you through testing the Cal.com calendar integration end-to-end.

---

## Prerequisites

Before testing, ensure you have:

- [ ] `CAL_COM_ENCRYPTION_KEY` set in `.env.local`
- [ ] Database migration applied (Cal.com columns exist)
- [ ] `RETELL_API_KEY` available for agent creation
- [ ] A Cal.com account with an API key (for full testing)

---

## Test 1: Environment Setup Verification

### 1.1 Check Environment Variables

```bash
# Verify the encryption key is set (should show the key)
grep CAL_COM_ENCRYPTION_KEY .env.local
```

**Expected:** Shows your 32-character hex key

### 1.2 Check Database Columns

Run in Supabase SQL Editor:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'business_onboarding'
AND column_name LIKE 'cal_com%';
```

**Expected:**
| column_name | data_type |
|-------------|-----------|
| cal_com_api_key_encrypted | text |
| cal_com_event_type_id | character varying |
| cal_com_validated | boolean |

---

## Test 2: API Endpoints

### 2.1 Test Webhook Endpoint

```bash
curl http://localhost:3000/api/inbound/webhook
```

**Expected:**
```json
{
  "status": "ok",
  "endpoint": "/api/inbound/webhook",
  "description": "POST Retell AI webhook events here"
}
```

### 2.2 Test Cal.com Key Validation (with real key)

```bash
curl -X POST http://localhost:3000/api/calendar/validate-key \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "cal_live_your_actual_key"}'
```

**Expected (valid key):**
```json
{
  "valid": true,
  "user": {
    "email": "you@example.com",
    "name": "Your Name",
    "timeZone": "America/New_York"
  }
}
```

**Expected (invalid key):**
```json
{
  "valid": false,
  "error": "Invalid API key"
}
```

### 2.3 Test Event Types Fetch

```bash
curl "http://localhost:3000/api/calendar/event-types?apiKey=cal_live_your_actual_key"
```

**Expected:**
```json
{
  "eventTypes": [
    {
      "id": "12345",
      "title": "Service Appointment",
      "slug": "service-appointment",
      "length": 30
    }
  ]
}
```

---

## Test 3: Onboarding Form Submission

### 3.1 Start Development Server

```bash
npm run dev
```

### 3.2 Fill Out Onboarding Form

1. Go to: `http://localhost:3000/get-started`

2. **Step 1 - Business Info:**
   - Business Name: `Test Landscaping Co`
   - Business Type: `Landscaping`
   - Owner Name: `John Test`
   - Email: `test@example.com`
   - Phone: `555-123-4567`

3. **Step 2 - Service Area:**
   - City: `San Diego`
   - State: `CA`
   - Phone Preference: `Get a new number`

4. **Step 3 - Services:**
   - Select: `Lawn Mowing`, `Tree Trimming`

5. **Step 4 - Hours & Cal.com:**
   - Keep default hours
   - **Cal.com API Key:** Enter your `cal_live_xxx` key
   - Click **Validate**
   - Select an event type from dropdown

6. Click **Submit**

### 3.3 Verify Submission

Check terminal for logs:
```
[Onboarding] Cal.com API key encrypted successfully
[Onboarding] New business registered: Test Landscaping Co (ID: abc123-def456)
[Onboarding] Cal.com configured: Yes
```

### 3.4 Verify Database Entry

Run in Supabase SQL Editor:

```sql
SELECT
  id,
  business_name,
  cal_com_api_key_encrypted,
  cal_com_event_type_id,
  cal_com_validated,
  status
FROM business_onboarding
ORDER BY created_at DESC
LIMIT 1;
```

**Expected:**
| Field | Value |
|-------|-------|
| business_name | Test Landscaping Co |
| cal_com_api_key_encrypted | `a1b2c3...:encrypted_data` (NOT the raw key!) |
| cal_com_event_type_id | `12345` |
| cal_com_validated | `true` |
| status | `pending` |

**Important:** The `cal_com_api_key_encrypted` should look like:
```
f7a8b9c0d1e2f3a4:5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e...
```
(IV:EncryptedData format, NOT the original `cal_live_xxx` key)

---

## Test 4: Create Retell Agent

### 4.1 Copy the Onboarding ID

From the database query above, copy the `id` value (UUID).

### 4.2 Create Agent via Python

```bash
cd flow-builder

# Set environment variables
export RETELL_API_KEY=your_retell_api_key
export NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
export SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key

# Create agent for the business
python -c "
from greenline_agent import create_agent_for_onboarding
result = create_agent_for_onboarding('YOUR-ONBOARDING-UUID-HERE')
print('Agent ID:', result['agent_id'])
print('Flow ID:', result['conversation_flow_id'])
"
```

**Expected Output:**
```
Supabase client initialized for CRM integration
Created conversation flow: flow_abc123
Created voice agent: agent_xyz789
Webhook configured: https://www.greenline-ai.com/api/inbound/webhook
Linked agent agent_xyz789 to onboarding abc123-def456
CRM integration active: leads will be created from inbound calls

Agent created for Test Landscaping Co
Leads from calls will appear in their CRM dashboard
Agent ID: agent_xyz789
Flow ID: flow_abc123
```

### 4.3 Verify Agent Link in Database

```sql
SELECT
  id,
  business_name,
  retell_agent_id,
  status
FROM business_onboarding
WHERE id = 'YOUR-ONBOARDING-UUID-HERE';
```

**Expected:**
| Field | Value |
|-------|-------|
| retell_agent_id | `agent_xyz789` |
| status | `agent_created` |

---

## Test 5: Calendar Function Calls

### 5.1 Test Check Availability (via webhook)

```bash
curl -X POST http://localhost:3000/api/inbound/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "function_call",
    "call_id": "test_call_123",
    "agent_id": "agent_xyz789",
    "function_name": "check_calendar_availability",
    "function_args": {
      "date_range": "next_7_days"
    }
  }'
```

**Expected (Cal.com configured):**
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

**Expected (Cal.com NOT configured):**
```json
{
  "available": false,
  "calendar_configured": false,
  "fallback_message": "I don't have direct access to the calendar..."
}
```

### 5.2 Test Create Booking (via webhook)

```bash
curl -X POST http://localhost:3000/api/inbound/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "function_call",
    "call_id": "test_call_123",
    "agent_id": "agent_xyz789",
    "function_name": "create_calendar_booking",
    "function_args": {
      "attendee_name": "Jane Customer",
      "attendee_phone": "+15559876543",
      "start_time": "2024-01-15T10:00:00-05:00",
      "service_type": "Lawn Mowing"
    }
  }'
```

**Expected (success):**
```json
{
  "success": true,
  "booking_id": "123456",
  "booking_uid": "abc-def-ghi",
  "confirmation_message": "Your appointment is confirmed for Monday, January 15th at 10:00 AM."
}
```

---

## Test 6: Full Phone Call Test

### 6.1 Get a Test Phone Number

In Retell Dashboard:
1. Go to **Phone Numbers**
2. Buy or use a test number
3. Assign it to your agent (`agent_xyz789`)

### 6.2 Make a Test Call

1. Call the assigned phone number
2. Say: "I'd like to schedule an appointment"
3. The agent should:
   - Call `check_calendar_availability` function
   - Offer available times from Cal.com
4. Pick a time
5. The agent should:
   - Call `create_calendar_booking` function
   - Confirm the booking
6. Check your Cal.com dashboard for the new booking

---

## Troubleshooting

### "Business not found for this agent"

The agent_id doesn't match any `retell_agent_id` in the database.

**Fix:** Verify the agent was created with `create_agent_for_onboarding()`:
```sql
SELECT retell_agent_id FROM business_onboarding WHERE id = 'your-uuid';
```

### "Cal.com not configured"

The business doesn't have Cal.com credentials stored.

**Fix:** Check the database:
```sql
SELECT cal_com_validated, cal_com_api_key_encrypted
FROM business_onboarding
WHERE retell_agent_id = 'agent_xyz789';
```

### Encryption Errors

`CAL_COM_ENCRYPTION_KEY` is missing or wrong.

**Fix:**
```bash
# Check it's set
echo $CAL_COM_ENCRYPTION_KEY

# Generate new one if needed
openssl rand -hex 16
```

### Agent Not Calling Functions

Agent was created before calendar tools were added.

**Fix:** Delete the agent in Retell Dashboard and recreate:
```python
create_agent_for_onboarding('your-uuid')
```

---

## Test Checklist

Use this checklist to verify everything works:

- [ ] Environment variables set correctly
- [ ] Database migration applied
- [ ] `/api/inbound/webhook` returns 200 OK
- [ ] `/api/calendar/validate-key` validates real Cal.com key
- [ ] `/api/calendar/event-types` returns event types
- [ ] Onboarding form submits successfully
- [ ] Cal.com key is encrypted in database (not raw)
- [ ] Retell agent created and linked to onboarding
- [ ] `check_calendar_availability` returns slots
- [ ] `create_calendar_booking` creates booking
- [ ] Phone call test works end-to-end

---

## Next Steps After Testing

Once all tests pass:

1. **Deploy to production** - Push changes and verify in prod environment
2. **Set up monitoring** - Watch logs for function call errors
3. **Consider auto-agent creation** - Create API endpoint to auto-create agents on signup

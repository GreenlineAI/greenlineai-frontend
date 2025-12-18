# Cal.com Calendar Integration Guide

This document explains how the Cal.com integration works for GreenLine AI, allowing AI phone agents to check real calendar availability and book appointments during calls.

---

## Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           HOW IT WORKS                                          │
│                                                                                 │
│  1. BUSINESS ONBOARDING                                                         │
│     Business enters Cal.com API key → Validates → Selects event type            │
│                                                                                 │
│  2. DURING A PHONE CALL                                                         │
│     Caller: "I'd like to schedule an appointment"                               │
│                         │                                                       │
│                         ▼                                                       │
│     Retell Agent calls webhook: /api/inbound/webhook                            │
│     with function_name: "check_calendar_availability"                           │
│                         │                                                       │
│                         ▼                                                       │
│     Webhook routes to: /api/calendar/check-availability                         │
│                         │                                                       │
│                         ▼                                                       │
│     Endpoint looks up business by agent_id                                      │
│     Decrypts Cal.com API key                                                    │
│     Calls Cal.com API for available slots                                       │
│                         │                                                       │
│                         ▼                                                       │
│     Returns slots to agent: "Tuesday 9am, 10am, 11am"                           │
│                         │                                                       │
│                         ▼                                                       │
│     Agent: "I have Tuesday at 9am, 10am, or 11am. Which works?"                 │
│                                                                                 │
│  3. BOOKING CONFIRMATION                                                        │
│     Caller: "Tuesday at 10am works"                                             │
│                         │                                                       │
│                         ▼                                                       │
│     Agent calls: /api/calendar/create-booking                                   │
│     Creates booking in Cal.com + sends confirmation email                       │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Setup Instructions

### 1. Environment Variables

Add the following to your `.env.local` file:

```bash
# Required: 32-character encryption key for storing Cal.com API keys securely
# Generate with: openssl rand -hex 16
CAL_COM_ENCRYPTION_KEY=your-32-character-hex-string-here

# Required: Base URL for webhook routing
NEXT_PUBLIC_BASE_URL=https://www.greenline-ai.com
```

**Generating an encryption key:**
```bash
# Option 1: Using openssl
openssl rand -hex 16

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### 2. Database Migration

Run the migration to add Cal.com fields to the `business_onboarding` table:

```bash
# Using Supabase CLI
npx supabase db push

# Or run the migration directly in Supabase dashboard SQL editor:
# File: supabase/migrations/006_add_cal_com_integration.sql
```

**Migration adds these columns:**
| Column | Type | Description |
|--------|------|-------------|
| `cal_com_api_key_encrypted` | TEXT | Encrypted Cal.com API key |
| `cal_com_event_type_id` | VARCHAR(255) | Event type ID to use for bookings |
| `cal_com_validated` | BOOLEAN | Whether the API key has been validated |

---

## Business Onboarding Flow

### Step 1: Business Gets Cal.com API Key

1. Go to [cal.com/signup](https://cal.com/signup) and create account
2. Create an event type (e.g., "Service Appointment", 30 minutes)
3. Go to **Settings → Developer → API Keys**
4. Click **Create new API key**
5. Name it "GreenLine AI" and copy the key (starts with `cal_live_`)

### Step 2: Enter API Key in Onboarding Form

In the GreenLine AI onboarding form (Step 4):

1. Expand "How to get your Cal.com API Key" for instructions
2. Paste API key in the input field
3. Click **Validate** button
4. If valid, select the event type from dropdown
5. Complete onboarding

### What Gets Saved

```json
{
  "cal_com_api_key_encrypted": "abc123:encrypted_key_here",
  "cal_com_event_type_id": "12345",
  "cal_com_validated": true
}
```

---

## API Endpoints

### POST `/api/calendar/validate-key`

Validates a Cal.com API key.

**Request:**
```json
{
  "apiKey": "cal_live_xxxxxxxxxxxxx"
}
```

**Response (success):**
```json
{
  "valid": true,
  "user": {
    "email": "business@example.com",
    "name": "John's Landscaping",
    "timeZone": "America/New_York"
  }
}
```

**Response (failure):**
```json
{
  "valid": false,
  "error": "Invalid API key"
}
```

---

### GET `/api/calendar/event-types`

Fetches event types for a Cal.com account.

**Request:**
```
GET /api/calendar/event-types?apiKey=cal_live_xxxxx
```

**Response:**
```json
{
  "eventTypes": [
    {
      "id": "12345",
      "title": "Service Appointment",
      "slug": "service-appointment",
      "length": 30,
      "description": "30-minute service consultation"
    }
  ]
}
```

---

### POST `/api/calendar/check-availability`

Checks available time slots. Called by Retell AI agent via webhook.

**Request:**
```json
{
  "agent_id": "agent_abc123",
  "date_range": "next_7_days",
  "time_zone": "America/New_York"
}
```

**Date range options:**
- `today` - Today only
- `tomorrow` - Tomorrow only
- `this_week` - Rest of current week
- `next_week` - Next week
- `next_7_days` - Next 7 days (default)

**Response (has availability):**
```json
{
  "available": true,
  "slots": [
    {
      "datetime": "2024-01-15T09:00:00-05:00",
      "display": "Monday, January 15th at 9:00 AM"
    },
    {
      "datetime": "2024-01-15T10:00:00-05:00",
      "display": "Monday, January 15th at 10:00 AM"
    }
  ],
  "total_slots": 15,
  "message": "I have some availability. Here are some options: Monday, January 15th at 9:00 AM, Monday, January 15th at 10:00 AM. Which of these works best for you?",
  "next_available": "Monday, January 15th at 9:00 AM"
}
```

**Response (no Cal.com configured):**
```json
{
  "available": false,
  "calendar_configured": false,
  "fallback_message": "I don't have direct access to the calendar right now, but I can take your information and have someone call you back to schedule. Would that work?"
}
```

---

### POST `/api/calendar/create-booking`

Creates a booking in Cal.com. Called by Retell AI agent via webhook.

**Request:**
```json
{
  "agent_id": "agent_abc123",
  "attendee_name": "John Smith",
  "attendee_phone": "+15551234567",
  "attendee_email": "john@example.com",
  "start_time": "2024-01-15T10:00:00-05:00",
  "service_type": "Lawn Mowing",
  "notes": "Large backyard, needs estimate first"
}
```

**Response (success):**
```json
{
  "success": true,
  "booking_id": "123456",
  "booking_uid": "abc-def-ghi",
  "datetime": "2024-01-15T10:00:00-05:00",
  "display_time": "Monday, January 15th at 10:00 AM",
  "confirmation_message": "Your appointment is confirmed for Monday, January 15th at 10:00 AM. You should receive a confirmation email shortly. Is there anything else I can help you with?"
}
```

---

## Testing Guide

### Test 1: Validate API Key

```bash
curl -X POST http://localhost:3000/api/calendar/validate-key \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "cal_live_your_actual_key"}'
```

**Expected:** `{"valid": true, "user": {...}}`

### Test 2: Fetch Event Types

```bash
curl "http://localhost:3000/api/calendar/event-types?apiKey=cal_live_your_actual_key"
```

**Expected:** `{"eventTypes": [...]}`

### Test 3: Check Availability (requires business in DB)

First, create a test business in `business_onboarding` table with:
- `retell_agent_id`: "test_agent_123"
- `cal_com_api_key_encrypted`: (your encrypted key)
- `cal_com_event_type_id`: (from step 2)
- `cal_com_validated`: true

Then test:
```bash
curl -X POST http://localhost:3000/api/calendar/check-availability \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "test_agent_123", "date_range": "next_7_days"}'
```

**Expected:** `{"available": true, "slots": [...], "message": "..."}`

### Test 4: Create Booking

```bash
curl -X POST http://localhost:3000/api/calendar/create-booking \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "test_agent_123",
    "attendee_name": "Test User",
    "attendee_phone": "+15551234567",
    "start_time": "2024-01-20T10:00:00-05:00",
    "service_type": "Test Service"
  }'
```

**Expected:** `{"success": true, "booking_id": "...", "confirmation_message": "..."}`

### Test 5: Full Webhook Flow

Simulate a Retell function call:
```bash
curl -X POST http://localhost:3000/api/inbound/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "function_call",
    "call_id": "call_test123",
    "agent_id": "test_agent_123",
    "function_name": "check_calendar_availability",
    "function_args": {
      "date_range": "this_week"
    }
  }'
```

---

## Retell Dashboard Configuration

To enable the AI agent to call calendar functions, configure these tools in Retell:

### Tool 1: Check Availability

```
Name: check_calendar_availability
Type: Custom Function
URL: https://www.greenline-ai.com/api/inbound/webhook
Method: POST

Parameters:
- date_range (string, optional): "today", "tomorrow", "this_week", "next_7_days"
- preferred_date (string, optional): ISO date string

Description: Check calendar availability for scheduling appointments
```

### Tool 2: Create Booking

```
Name: create_calendar_booking
Type: Custom Function
URL: https://www.greenline-ai.com/api/inbound/webhook
Method: POST

Parameters:
- attendee_name (string, required): Caller's name
- attendee_phone (string, required): Caller's phone number
- start_time (string, required): ISO datetime for appointment
- service_type (string, optional): Type of service requested
- notes (string, optional): Additional notes

Description: Create a booking in the calendar system
```

---

## Troubleshooting

### "Business not found for this agent"

**Cause:** The `agent_id` doesn't match any `retell_agent_id` in the `business_onboarding` table.

**Fix:** Ensure the business has been onboarded and their Retell agent ID is saved.

### "Cal.com not configured"

**Cause:** The business hasn't connected their Cal.com account.

**Fix:** Have the business complete the Cal.com setup in their onboarding or settings.

### "Invalid API key"

**Cause:** The Cal.com API key is incorrect or expired.

**Fix:** Generate a new API key in Cal.com dashboard and re-validate.

### "No event types found"

**Cause:** The Cal.com account has no event types configured.

**Fix:** Create at least one event type in Cal.com (e.g., "Service Appointment").

### Encryption errors

**Cause:** `CAL_COM_ENCRYPTION_KEY` environment variable is missing or incorrect.

**Fix:** Ensure the env variable is set and is exactly 32 hex characters (16 bytes).

---

## File Reference

| File | Purpose |
|------|---------|
| `supabase/migrations/006_add_cal_com_integration.sql` | Database schema |
| `lib/cal-com.ts` | Cal.com API utilities and encryption |
| `app/api/calendar/validate-key/route.ts` | Validate API key endpoint |
| `app/api/calendar/event-types/route.ts` | Fetch event types endpoint |
| `app/api/calendar/check-availability/route.ts` | Check availability endpoint |
| `app/api/calendar/create-booking/route.ts` | Create booking endpoint |
| `app/api/inbound/webhook/route.ts` | Webhook router for Retell |
| `components/CalComInstructions.tsx` | Onboarding instructions UI |
| `app/get-started/page.tsx` | Onboarding form with Cal.com section |
| `flow-builder/greenline_agent.py` | Agent flow with Cal.com comments |

---

## Security Notes

1. **API Key Storage**: Cal.com API keys are encrypted with AES-256-CBC before storage
2. **Key Lookup**: Keys are only decrypted server-side when making Cal.com API calls
3. **Agent Isolation**: Each business's calendar is only accessible via their specific agent_id
4. **No Client Exposure**: API keys never leave the server; only availability results are returned

---

## Future Enhancements

- [ ] Support for Calendly integration
- [ ] Google Calendar direct integration
- [ ] Multi-calendar support per business
- [ ] Webhook notifications for new bookings
- [ ] Rescheduling and cancellation support

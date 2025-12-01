# Calendly Integration Setup

This integration automatically syncs Calendly bookings to your GreenLine AI dashboard.

## Features

✅ Auto-creates meetings when someone books via Calendly
✅ Links bookings to existing leads (by email/phone)
✅ Creates new leads for first-time bookers
✅ Sends email notifications
✅ Shows in dashboard under Meetings

## Setup Instructions

### 1. Add Environment Variable

Add to your `.env.local` and Vercel:

```bash
CALENDLY_WEBHOOK_SECRET=your-calendly-signing-key
```

### 2. Configure Calendly Webhook

1. Go to [Calendly Webhooks](https://calendly.com/integrations/webhooks)
2. Click **Add Webhook**
3. **Webhook URL:** `https://your-domain.com/api/calendly/webhook`
4. **Events to subscribe to:**
   - ✅ `invitee.created` (when someone books)
5. Copy the **Signing Key** and add it to your environment variables
6. Click **Create Webhook**

### 3. Test the Integration

1. Book a test meeting on your Calendly
2. Check your `/dashboard/meetings` - the booking should appear
3. You should receive an email notification
4. The lead will be created/updated automatically

## How It Works

When someone books on Calendly:

1. **Calendly sends webhook** → `invitee.created` event
2. **System finds/creates lead** → Searches by email or phone
3. **Creates meeting record** → Adds to meetings table
4. **Sends notification** → Email to you
5. **Shows in dashboard** → Visible in meetings page

## Webhook Payload Example

Calendly sends this when someone books:

```json
{
  "event": "invitee.created",
  "payload": {
    "event_type": {
      "name": "Strategy Call",
      "duration": 30
    },
    "invitee": {
      "name": "John Smith",
      "email": "john@example.com",
      "text_reminder_number": "+14155551234"
    },
    "scheduled_event": {
      "start_time": "2025-12-05T14:00:00Z",
      "end_time": "2025-12-05T14:30:00Z",
      "location": {
        "type": "zoom",
        "join_url": "https://zoom.us/j/123456789"
      }
    }
  }
}
```

## Custom Questions

If you add custom questions in Calendly (like "What's your business name?"), they'll be:
- Used to create more detailed leads
- Stored in the meeting notes
- Visible in the dashboard

## Troubleshooting

### Webhook not triggering?

1. Check Calendly webhook logs
2. Verify URL is correct: `https://your-domain.com/api/calendly/webhook`
3. Make sure webhook is active

### Meetings not appearing?

1. Check Supabase logs
2. Verify meetings table exists (run migration)
3. Check that lead was created successfully

### No email notifications?

1. Check server logs for email errors
2. Verify email service is configured
3. Make sure profile email exists in database

## For Your Use

Once set up, all Calendly bookings will automatically:
- Create leads in your system
- Show in dashboard meetings
- Send you email notifications
- Track in analytics

No manual entry needed! 🎉

# Stammer AI API Testing

Since the Stammer API is returning errors, we need to verify the correct endpoint and format.

## Your Stammer Details
- **Agent ID**: `893b87dd-0f63-4866-8cae-d60b696cae1a`
- **API Key**: `9b0255369a055b13bbb215af48f8d9dcf1a2bda4`
- **Embed URL**: `https://app.stammer.ai/en/chatbot/embed/893b87dd-0f63-4866-8cae-d60b696cae1a`

## Test the API Manually

### Option 1: Check Stammer Dashboard
1. Go to https://app.stammer.ai
2. Navigate to your agent
3. Look for "API" or "Integration" tab
4. Find the correct endpoint and payload format

### Option 2: Test with curl

Try these different endpoint variations:

```bash
# Option A: /v1/call (singular)
curl -X POST https://api.stammer.ai/v1/call \
  -H "Authorization: Bearer 9b0255369a055b13bbb215af48f8d9dcf1a2bda4" \
  -H "Content-Type: application/json" \
  -d '{
    "chatbot_id": "893b87dd-0f63-4866-8cae-d60b696cae1a",
    "phone": "+14083654503"
  }'

# Option B: /v1/calls (plural)
curl -X POST https://api.stammer.ai/v1/calls \
  -H "Authorization: Bearer 9b0255369a055b13bbb215af48f8d9dcf1a2bda4" \
  -H "Content-Type: application/json" \
  -d '{
    "chatbot_id": "893b87dd-0f63-4866-8cae-d60b696cae1a",
    "phone": "+14083654503"
  }'

# Option C: /api/v1/call
curl -X POST https://api.stammer.ai/api/v1/call \
  -H "Authorization: Bearer 9b0255369a055b13bbb215af48f8d9dcf1a2bda4" \
  -H "Content-Type: application/json" \
  -d '{
    "chatbot_id": "893b87dd-0f63-4866-8cae-d60b696cae1a",
    "phone": "+14083654503"
  }'

# Option D: Different auth format
curl -X POST https://api.stammer.ai/v1/call \
  -H "X-API-Key: 9b0255369a055b13bbb215af48f8d9dcf1a2bda4" \
  -H "Content-Type: application/json" \
  -d '{
    "chatbot_id": "893b87dd-0f63-4866-8cae-d60b696cae1a",
    "phone": "+14083654503"
  }'
```

### Option 3: Check Stammer Documentation
- Visit: https://docs.stammer.ai
- Or: https://stammer.ai/docs
- Look for "API Reference" or "Making Calls"

### Option 4: Contact Stammer Support
If the API docs aren't clear:
1. Email: support@stammer.ai
2. Ask for:
   - Correct API endpoint for initiating calls
   - Required headers format
   - Payload structure
   - Example curl command

## Alternative: Use Stammer's Widget/SDK

If the REST API is complex, Stammer might provide:
- JavaScript SDK
- Webhook-based triggers
- Dashboard-based campaign management

Check the Stammer dashboard for "Campaigns" or "Outbound Calling" features.

## Temporary Workaround

Until we get the correct API format, you can:
1. Upload leads to Stammer dashboard directly
2. Create a campaign in Stammer
3. Let Stammer handle the calling
4. Receive webhooks for results

Then integrate the webhook results into your `/dashboard/calls` page.

---

**Action Items:**
1. Run one of the curl commands above
2. Check which one works
3. Update `/functions/api/calls/initiate.ts` with correct format
4. Or let me know what error you get and we'll debug further

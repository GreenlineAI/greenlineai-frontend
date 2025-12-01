# Test Stammer Voice API (Updated)

Run this curl command from your terminal to test the voice API:

```bash
curl -X POST https://app.stammer.ai/en/chatbot/api/v1/call/ \
  -H "Authorization: Token 9b0255369a055b13bbb215af48f8d9dcf1a2bda4" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "chatbot_uuid": "893b87dd-0f63-4866-8cae-d60b696cae1a",
    "phone_number": "+14083654503",
    "user_key": "test_001"
  }'
```

## What Changed

Based on the Stammer API docs at https://app.stammer.ai/en/api-docs/me/:

1. ✅ **Base URL**: `https://app.stammer.ai/en/chatbot/api/v1/` (not `api.stammer.ai`)
2. ✅ **Auth**: `Authorization: Token` (not `Bearer`)
3. ✅ **Parameters**: `chatbot_uuid`, `phone_number`, `user_key`

## Updated Files

- `/functions/api/calls/initiate.ts` - Updated Stammer integration
- `/scripts/test-stammer-direct.sh` - Direct API test script

## Next Steps

1. **Test the curl command above** from your local terminal (outside the dev container)
2. If it works, deploy: `git add -A && git commit -m "Fix Stammer API integration" && git push`
3. Run `npm run test-stammer` to test through Cloudflare function
4. If successful, the auto-dialer will start working automatically

## Note on Voice vs Chat API

The docs you shared show the **message API** for text chat. The **voice calling API** likely follows the same pattern but uses `/call/` endpoint instead of `/message/`. If the above doesn't work, check your Stammer dashboard for a "Voice API" or "Calling API" section.

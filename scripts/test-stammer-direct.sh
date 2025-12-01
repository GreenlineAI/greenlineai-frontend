#!/bin/bash

# Direct Stammer API Test
# Tests the voice calling API directly (not through our Cloudflare function)

echo "🧪 Testing Stammer Voice API Directly"
echo "════════════════════════════════════"
echo ""

API_KEY="9b0255369a055b13bbb215af48f8d9dcf1a2bda4"
CHATBOT_UUID="893b87dd-0f63-4866-8cae-d60b696cae1a"
PHONE="+14083654503"

echo "📞 Calling: $PHONE"
echo "🤖 Chatbot: $CHATBOT_UUID"
echo ""
echo "⏳ Making API request..."
echo ""

curl -X POST https://app.stammer.ai/en/chatbot/api/v1/call/ \
  -H "Authorization: Token $API_KEY" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"chatbot_uuid\": \"$CHATBOT_UUID\",
    \"phone_number\": \"$PHONE\",
    \"user_key\": \"test_$(date +%s)\"
  }" \
  -w "\n\n📊 HTTP Status: %{http_code}\n" \
  -v

echo ""
echo "✅ Test complete!"

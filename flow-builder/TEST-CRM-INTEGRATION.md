# Testing CRM Integration for New Business Signups

This guide walks through testing the complete flow: creating an agent for a new business and verifying leads appear in their CRM.

## Prerequisites

```bash
cd /workspaces/greenlineai-frontend/flow-builder
pip install python-dotenv supabase
```

## Step 1: Create a Mock Business Onboarding Record

First, insert a test business into the `business_onboarding` table.

### Option A: Using Supabase Dashboard

1. Go to https://supabase.com/dashboard/project/nkyyikohtzabduzlurbl/editor
2. Select `business_onboarding` table
3. Click "Insert row" and fill in:

```json
{
  "business_name": "Test Landscaping Co",
  "business_type": "landscaping",
  "owner_name": "John Test",
  "email": "john@testlandscaping.com",
  "phone": "+15551234567",
  "city": "San Diego",
  "state": "CA",
  "services": ["Lawn Mowing", "Tree Trimming", "Landscaping Design"],
  "status": "pending"
}
```

4. Copy the generated `id` (UUID) for use in Step 2

### Option B: Using Python Script

```python
# test_create_onboarding.py
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_SERVICE_ROLE_KEY"]
)

# Create test business onboarding
result = supabase.table("business_onboarding").insert({
    "business_name": "Test Landscaping Co",
    "business_type": "landscaping",
    "owner_name": "John Test",
    "email": "john@testlandscaping.com",
    "phone": "+15551234567",
    "city": "San Diego",
    "state": "CA",
    "services": ["Lawn Mowing", "Tree Trimming", "Landscaping Design"],
    "greeting_name": "Test Landscaping",
    "preferred_voice": "professional_male",
    "status": "pending"
}).execute()

onboarding_id = result.data[0]["id"]
print(f"Created onboarding: {onboarding_id}")
```

Run it:
```bash
python test_create_onboarding.py
```

## Step 2: Create Agent for the Business

Now create a Retell agent linked to that business:

```python
# test_create_agent.py
import os
from dotenv import load_dotenv
from greenline_agent import create_agent_for_onboarding

load_dotenv()

# Replace with the UUID from Step 1
ONBOARDING_ID = "paste-uuid-here"

result = create_agent_for_onboarding(ONBOARDING_ID)

print(f"Agent ID: {result['agent_id']}")
print(f"Flow ID: {result['conversation_flow_id']}")
print(f"CRM Linked: {result['onboarding_updated']}")
```

Run it:
```bash
python test_create_agent.py
```

### What This Does:
1. Reads business info from `business_onboarding`
2. Creates a Retell conversation flow with the business's services/areas
3. Creates a Retell voice agent with webhook URL set to `https://www.greenline-ai.com/api/inbound/webhook`
4. Updates `business_onboarding.retell_agent_id` with the new agent ID
5. Sets status to `agent_created`

## Step 3: Verify the Setup

Check that the onboarding record was updated:

```python
# test_verify_setup.py
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_SERVICE_ROLE_KEY"]
)

ONBOARDING_ID = "paste-uuid-here"

result = supabase.table("business_onboarding").select("*").eq("id", ONBOARDING_ID).single().execute()

onboarding = result.data
print(f"Business: {onboarding['business_name']}")
print(f"Status: {onboarding['status']}")
print(f"Retell Agent ID: {onboarding['retell_agent_id']}")
print(f"CRM Integration: {'Ready' if onboarding['retell_agent_id'] else 'Not Configured'}")
```

## Step 4: Test the Webhook (Simulate a Call)

To test without making a real phone call, simulate a Retell webhook:

```bash
curl -X POST https://www.greenline-ai.com/api/inbound/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "call_ended",
    "call_id": "test-call-123",
    "agent_id": "PASTE_AGENT_ID_HERE",
    "call_status": "ended",
    "direction": "inbound",
    "from_number": "+15559876543",
    "duration_ms": 120000,
    "dynamic_variables": {
      "caller_name": "Jane Customer",
      "caller_phone": "+15559876543",
      "service_address": "123 Test St, San Diego, CA",
      "service_type": "Lawn Mowing",
      "urgency": "this week"
    },
    "call_analysis": {
      "call_summary": "Customer wants lawn mowing service for next week",
      "user_sentiment": "positive",
      "call_successful": true
    }
  }'
```

## Step 5: Verify Lead Created

Check that the lead was created in the correct user's CRM:

```python
# test_verify_lead.py
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_SERVICE_ROLE_KEY"]
)

# Find the user_id from onboarding
ONBOARDING_ID = "paste-uuid-here"
onboarding = supabase.table("business_onboarding").select("user_id").eq("id", ONBOARDING_ID).single().execute()
user_id = onboarding.data["user_id"]

# Find leads for that user
leads = supabase.table("leads").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(5).execute()

print(f"Recent leads for user {user_id}:")
for lead in leads.data:
    print(f"  - {lead['contact_name']} | {lead['phone']} | {lead['status']} | {lead['score']}")
```

## Complete Test Script

Here's a single script that does everything:

```python
# test_full_flow.py
import os
import time
import requests
from dotenv import load_dotenv
from supabase import create_client
from greenline_agent import create_agent_for_onboarding, GreenLineAgentBuilder

load_dotenv()

supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_SERVICE_ROLE_KEY"]
)

print("=" * 60)
print("GREENLINE AI - CRM INTEGRATION TEST")
print("=" * 60)

# Step 1: Create test onboarding
print("\n1. Creating test business onboarding...")
result = supabase.table("business_onboarding").insert({
    "business_name": f"Test Co {int(time.time())}",
    "business_type": "landscaping",
    "owner_name": "Test Owner",
    "email": "test@example.com",
    "phone": "+15551234567",
    "city": "San Diego",
    "state": "CA",
    "services": ["Lawn Mowing", "Tree Trimming"],
    "status": "pending"
}).execute()

onboarding_id = result.data[0]["id"]
print(f"   Onboarding ID: {onboarding_id}")

# Step 2: Create agent
print("\n2. Creating Retell agent...")
try:
    agent_result = create_agent_for_onboarding(onboarding_id)
    agent_id = agent_result["agent_id"]
    print(f"   Agent ID: {agent_id}")
    print(f"   Webhook: https://www.greenline-ai.com/api/inbound/webhook")
    print(f"   CRM Linked: {agent_result['onboarding_updated']}")
except Exception as e:
    print(f"   Error: {e}")
    agent_id = None

# Step 3: Verify
print("\n3. Verifying setup...")
onboarding = supabase.table("business_onboarding").select("*").eq("id", onboarding_id).single().execute()
print(f"   Status: {onboarding.data['status']}")
print(f"   Agent linked: {bool(onboarding.data.get('retell_agent_id'))}")

# Step 4: Test webhook (optional - uncomment to test)
# print("\n4. Testing webhook...")
# webhook_payload = {
#     "event": "call_ended",
#     "call_id": f"test-{int(time.time())}",
#     "agent_id": agent_id,
#     "direction": "inbound",
#     "from_number": "+15559876543",
#     "dynamic_variables": {
#         "caller_name": "Test Customer",
#         "caller_phone": "+15559876543",
#         "service_type": "Lawn Mowing"
#     }
# }
# response = requests.post(
#     "https://www.greenline-ai.com/api/inbound/webhook",
#     json=webhook_payload
# )
# print(f"   Webhook response: {response.status_code}")

print("\n" + "=" * 60)
print("TEST COMPLETE")
print("=" * 60)

# Cleanup (optional)
# supabase.table("business_onboarding").delete().eq("id", onboarding_id).execute()
```

## Troubleshooting

### "Supabase not configured"
Make sure `.env` has:
```
SUPABASE_URL=https://nkyyikohtzabduzlurbl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_key_here
```

### "No onboarding record found"
- Check the UUID is correct
- Verify the record exists in Supabase dashboard

### "Could not determine user_id"
The onboarding record needs a `user_id` linked. This happens when a user signs up through the app. For testing, you can:
1. Create a user in Supabase Auth
2. Update the onboarding record with that user's ID

### Webhook returns 500
Check Cloudflare Worker logs:
```bash
npx wrangler tail
```

## Production Workflow

When a real business signs up:

1. They fill out the onboarding form at `/get-started`
2. Record is created in `business_onboarding` with their `user_id`
3. Admin reviews and approves
4. Run `create_agent_for_onboarding(onboarding_id)`
5. Agent is created, webhook configured, CRM linked
6. Business starts receiving calls
7. Leads automatically appear in their dashboard at `/dashboard/leads`

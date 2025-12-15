# Business Onboarding Flow

Complete guide for onboarding a new business customer and setting up their AI phone agent.

---

## Overview

When a new business signs up for GreenLine AI, you need to:

1. Create their user account (Supabase Auth)
2. Collect their business information (business_onboarding)
3. Create their Retell AI agent (flow-builder)
4. Link the agent to their account (store retell_agent_id)
5. Assign a phone number (Retell or import)

---

## Database Tables Involved

```
profiles              → User account info
     │
     └── business_onboarding → Business details + agent config
              │
              ├── retell_agent_id      ← Store agent ID here
              ├── retell_phone_number  ← Store phone number here
              └── (business info...)

leads                 → Their customers (created by AI agent)
outreach_calls        → Call logs
meetings              → Booked appointments
```

---

## Step-by-Step Process

### Step 1: User Signs Up

User creates account via your signup flow. This creates:

```sql
-- Automatically created by Supabase Auth trigger
profiles:
  id: "uuid-user-123"
  email: "owner@business.com"
  full_name: "John Smith"
  plan: "professional"
```

### Step 2: Business Onboarding Form

User fills out the onboarding form. Store in `business_onboarding`:

```sql
INSERT INTO business_onboarding (
  user_id,
  business_name,
  business_type,
  owner_name,
  phone,
  email,
  city,
  state,
  services,
  -- Hours
  hours_monday,
  hours_tuesday,
  -- ... etc
  -- Agent config (empty for now)
  retell_agent_id,        -- NULL initially
  retell_phone_number,    -- NULL initially
  status
) VALUES (
  'uuid-user-123',
  'Smith Plumbing LLC',
  'plumbing',
  'John Smith',
  '+15551234567',
  'owner@business.com',
  'San Diego',
  'CA',
  ARRAY['Drain Cleaning', 'Water Heater Repair', 'Pipe Repair'],
  '8:00 AM - 6:00 PM',
  '8:00 AM - 6:00 PM',
  NULL,  -- retell_agent_id (set after agent creation)
  NULL,  -- retell_phone_number (set after phone assignment)
  'pending'
);
```

### Step 3: Create Their Retell Agent

Use the flow-builder to create their customized agent:

```python
# flow-builder/create_customer_agent.py

from greenline_agent import GreenLineAgentBuilder, GreenLineConfig

def create_agent_for_customer(business_data: dict, api_key: str) -> dict:
    """
    Create a Retell agent for a new customer.

    Args:
        business_data: From business_onboarding table
        api_key: Retell API key

    Returns:
        dict with agent_id and flow_id
    """

    config = GreenLineConfig(
        company_name=business_data['business_name'],
        business_type=business_data['business_type'],
        phone_number=business_data['phone'],
        business_hours=format_hours(business_data),  # Helper to format hours
        services=business_data['services'],
        service_areas=[business_data['city'], business_data['state']],
        owner_name=business_data['owner_name'],
        transfer_number=business_data.get('phone'),  # Transfer to owner's cell
        emergency_availability="24/7 for emergencies",
        voice_id="11labs-Adrian",  # Or let them choose
        model="gpt-4.1"
    )

    builder = GreenLineAgentBuilder(api_key)
    result = builder.create_agent(config)

    return {
        'agent_id': result['agent_id'],
        'conversation_flow_id': result['conversation_flow_id']
    }
```

### Step 4: Store Agent ID in Database

After creating the agent, update their `business_onboarding` record:

```python
# Update business_onboarding with agent details
supabase.table('business_onboarding').update({
    'retell_agent_id': result['agent_id'],
    'status': 'agent_created'
}).eq('user_id', user_id).execute()
```

Or via SQL:

```sql
UPDATE business_onboarding
SET
  retell_agent_id = 'agent_abc123def456',
  status = 'agent_created',
  updated_at = NOW()
WHERE user_id = 'uuid-user-123';
```

### Step 5: Assign Phone Number

Either import their existing number or provision a new one via Retell:

```python
# Option A: Import existing number
phone_number = retell.phone_number.import_(
    phone_number="+15551234567",
    termination_uri="sip:xxx@xxx.pstn.twilio.com"
)

# Option B: Buy new number from Retell
phone_number = retell.phone_number.create(
    area_code="619",  # San Diego
    inbound_agent_id=result['agent_id']  # Link to their agent
)

# Store phone number
supabase.table('business_onboarding').update({
    'retell_phone_number': phone_number.phone_number,
    'status': 'active'
}).eq('user_id', user_id).execute()
```

### Step 6: Configure Webhook

Ensure the Retell agent sends webhooks to your endpoint:

```
Webhook URL: https://your-domain.com/api/inbound/webhook
```

The webhook will:
1. Receive call events from Retell
2. Look up `user_id` from `retell_agent_id` in `business_onboarding`
3. Create leads in that user's CRM
4. Track call analytics

---

## Complete Example: API Endpoint

Here's a complete API endpoint that handles the full agent creation:

```typescript
// app/api/onboarding/create-agent/route.ts

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Get their business_onboarding data
    const { data: business, error: bizError } = await supabase
      .from('business_onboarding')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (bizError || !business) {
      return NextResponse.json({ error: 'Business info not found' }, { status: 404 });
    }

    // 2. Check if agent already exists
    if (business.retell_agent_id) {
      return NextResponse.json({
        error: 'Agent already exists',
        agent_id: business.retell_agent_id
      }, { status: 400 });
    }

    // 3. Call flow-builder to create agent
    // This could be a separate Python microservice or inline
    const agentResponse = await fetch(`${process.env.FLOW_BUILDER_URL}/create-agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_name: business.business_name,
        business_type: business.business_type,
        phone_number: business.phone,
        owner_name: business.owner_name,
        services: business.services,
        city: business.city,
        state: business.state,
        // ... other fields
      })
    });

    const agentResult = await agentResponse.json();

    // 4. Store agent_id in business_onboarding
    const { error: updateError } = await supabase
      .from('business_onboarding')
      .update({
        retell_agent_id: agentResult.agent_id,
        status: 'agent_created',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Failed to store agent_id:', updateError);
      // Agent was created but we failed to store - handle this case
    }

    return NextResponse.json({
      success: true,
      agent_id: agentResult.agent_id,
      message: 'Agent created successfully'
    });

  } catch (error) {
    console.error('Agent creation failed:', error);
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}
```

---

## Data Flow Summary

```
┌──────────────────────────────────────────────────────────────────┐
│                     NEW BUSINESS SIGNUP                          │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  1. User signs up → profiles table created                       │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  2. Business form → business_onboarding record created           │
│     - business_name, services, hours, etc.                       │
│     - retell_agent_id = NULL (not yet created)                   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  3. Create Retell Agent (flow-builder)                           │
│     - Uses business info to customize agent                      │
│     - Returns agent_id                                           │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  4. Store agent_id → UPDATE business_onboarding                  │
│     SET retell_agent_id = 'agent_xxx'                            │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  5. Assign phone number → UPDATE business_onboarding             │
│     SET retell_phone_number = '+1555...'                         │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  ✅ READY! Customer's phone now answers with AI                  │
└──────────────────────────────────────────────────────────────────┘

                         WHEN CALLS COME IN:

┌──────────────────────────────────────────────────────────────────┐
│  Inbound Call → Retell Agent answers                             │
│       │                                                          │
│       ▼                                                          │
│  Call ends → Webhook receives agent_id                           │
│       │                                                          │
│       ▼                                                          │
│  Webhook looks up: business_onboarding.retell_agent_id           │
│       │                                                          │
│       ▼                                                          │
│  Gets user_id → Creates lead in THEIR leads table                │
└──────────────────────────────────────────────────────────────────┘
```

---

## Checklist for New Business

- [ ] User account created (profiles)
- [ ] Business info collected (business_onboarding)
- [ ] Retell agent created (flow-builder)
- [ ] `retell_agent_id` stored in business_onboarding
- [ ] Phone number assigned
- [ ] `retell_phone_number` stored in business_onboarding
- [ ] Webhook configured to receive call events
- [ ] Test call completed successfully
- [ ] Lead appears in their CRM dashboard

---

## Troubleshooting

### Lead not appearing in CRM

1. Check `business_onboarding.retell_agent_id` is set correctly
2. Check webhook logs at `/api/inbound/webhook`
3. Verify the `user_id` lookup is working

### Agent not answering calls

1. Verify phone number is linked to agent in Retell dashboard
2. Check agent status is active
3. Test with web call first: `python cli.py test <agent_id>`

### Wrong user's CRM getting leads

1. Check `retell_agent_id` is unique per user
2. Verify lookup query in webhook is correct
3. Check for duplicate agent IDs in business_onboarding

---

## Related Files

| File | Purpose |
|------|---------|
| `flow-builder/greenline_agent.py` | Creates customer service agents |
| `flow-builder/cli.py` | CLI for agent management |
| `functions/api/inbound/webhook.ts` | Handles call webhooks |
| `lib/supabase/client.ts` | Database client |
| `app/(dashboard)/dashboard/settings/` | User settings UI |

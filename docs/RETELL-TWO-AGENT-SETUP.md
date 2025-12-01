# Retell AI Two-Agent Setup

## Overview
This setup allows you to use two different Retell AI agents for different calling scenarios.

## Agent Configuration

### Agent 1 (Primary/Default)
- **Use Case**: General lead qualification calls
- **Environment Variable**: `RETELL_AGENT_ID_1`
- **Default Behavior**: Used when no agent is specified

### Agent 2 (Secondary)
- **Use Case**: Follow-up calls, appointment setting, or specialized pitch
- **Environment Variable**: `RETELL_AGENT_ID_2`
- **Usage**: Explicitly specify `agentId: 'agent2'` in API calls

## Setup Instructions

### 1. Get Your Retell AI Agent IDs

1. Go to [Retell AI Dashboard](https://app.retellai.com/)
2. Navigate to **Agents**
3. Create or select your first agent → Copy the Agent ID
4. Create or select your second agent → Copy the Agent ID

### 2. Update Environment Variables

#### In `wrangler.toml`:
```toml
[vars]
VOICE_AI_PROVIDER = "retell"
RETELL_API_KEY = "key_7128cb9dae3666f93d5df369fa0a"
RETELL_AGENT_ID_1 = "agent_xxxxxxxxxxxxxxxxxx"  # Replace with your Agent 1 ID
RETELL_AGENT_ID_2 = "agent_yyyyyyyyyyyyyyyyyy"  # Replace with your Agent 2 ID
```

#### In Cloudflare Pages (Production):
1. Go to Cloudflare Dashboard → Workers & Pages → greenlineai-frontend
2. Settings → Environment Variables → Production
3. Add these variables:
   - `VOICE_AI_PROVIDER` = `retell`
   - `RETELL_API_KEY` = `key_7128cb9dae3666f93d5df369fa0a`
   - `RETELL_AGENT_ID_1` = `agent_xxxxxxxxxxxxxxxxxx`
   - `RETELL_AGENT_ID_2` = `agent_yyyyyyyyyyyyyyyyyy`

### 3. Using the Agents in Your Code

#### Default (Agent 1):
```typescript
const response = await fetch('/api/calls/initiate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '+1234567890',
    leadId: 'lead-123',
    campaignId: 'campaign-456'
  })
});
```

#### Agent 2:
```typescript
const response = await fetch('/api/calls/initiate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '+1234567890',
    leadId: 'lead-123',
    campaignId: 'campaign-456',
    agentId: 'agent2'  // ← Specify agent2 here
  })
});
```

## Agent Customization

### Agent 1 - Initial Outreach
Suggested configuration in Retell dashboard:
- **Voice**: Professional, friendly
- **Goal**: Qualify leads, gauge interest
- **Script**: 
  ```
  Hi, this is [Name] calling from [Company]. 
  Is this [Business Name]? Great!
  I'm reaching out because we help businesses like yours with [service].
  Are you currently looking for help with [pain point]?
  ```

### Agent 2 - Follow-up/Closing
Suggested configuration in Retell dashboard:
- **Voice**: Warm, conversational
- **Goal**: Schedule appointments, close deals
- **Script**:
  ```
  Hi [Name], this is [Agent] following up on our previous conversation.
  I wanted to share how we can help you [specific value prop].
  Would you be available for a quick 15-minute call this week?
  ```

## API Response

Both agents return the same response format:
```json
{
  "success": true,
  "callId": "call_xxxxxxxxxxxxx",
  "status": "registered"
}
```

## Webhook Configuration

Set up a single webhook in Retell dashboard that handles both agents:
- **Webhook URL**: `https://greenline-ai.com/api/calls/webhook`
- **Events**: 
  - call_started
  - call_ended
  - call_analyzed

## Testing

Test both agents:
```bash
# Test Agent 1
curl -X POST https://greenline-ai.com/api/calls/initiate \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+1234567890", "agentId": "agent1"}'

# Test Agent 2
curl -X POST https://greenline-ai.com/api/calls/initiate \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+1234567890", "agentId": "agent2"}'
```

## Next Steps

1. Replace placeholder Agent IDs in `wrangler.toml`
2. Add the same variables to Cloudflare Pages environment
3. Deploy your changes
4. Test both agents
5. Monitor call performance in Retell dashboard

## Troubleshooting

- **"Agent not configured" error**: Check that both RETELL_AGENT_ID_1 and RETELL_AGENT_ID_2 are set
- **Wrong agent responding**: Verify you're passing `agentId: 'agent2'` in the request
- **No calls going through**: Check RETELL_API_KEY is correct and has permissions

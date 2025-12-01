# Retell AI Conversation Flow Agent for GreenLine AI

## Agent Overview
- **Agent ID**: `ag...f47` (shown in your dashboard)
- **CF ID**: `co...a6c`
- **Cost**: $0.095/min
- **Latency**: 820-1000ms
- **Tokens**: 49-249 per interaction

---

## Call Flow Structure

### START NODE: Static Sentence (Welcome Node)
**Node Type**: Static Sentence  
**What AI Says**:
```
Great to hear from AI, a marketing agency. I hope you're doing well today! Is now a good time to chat, or should I call back at a better time?
```

**Purpose**: Initial greeting to gauge availability and set friendly tone

**User Responses**:
- User ready to chat → Extract Variables → Continue to qualification
- User requests callback → Use "User ready to hear this portion" to reschedule
- User not ready/too busy → Politely end call and mark for callback

---

### EXTRACT VARIABLES NODE
**Node Type**: Extract Variable  
**Variables to Extract**:
1. Business Name
2. Owner Name  
3. Current Marketing Situation
4. Pain Points
5. Call Availability

**Transition**: After extraction → Main Qualification

---

### MAIN CONVERSATION NODE: Transition
**Node Type**: Transition  
**Purpose**: Silent routing node that passes control to the next node based on context

**Use Cases**:
- Route to appropriate conversation path based on extracted variables
- Simple pass-through between nodes without AI speaking
- Organize flow visually without adding extra dialogue

**Transition Logic**:
- If user is business owner → Continue to pitch conversation
- If not owner → Route to "Ask for owner" conversation
- If owner unavailable → Route to callback scheduling

**Note**: Transition nodes don't have the AI say anything - they just route the call flow.

---

### QUALIFICATION NODE: End Call
**Node Type**: End Call  
**What AI Says**:
```
Politely end the call
```

**When to Use**:
- User explicitly says not interested
- User asks to be removed from list
- Owner not available and doesn't want callback
- Wrong number

**Call Disposition Options**:
- Not Interested
- Callback Requested  
- Wrong Number
- Do Not Contact

---

## Node Components Available

Based on your dashboard, you have these node types:

1. **Conversation** - Main dialogue nodes with AI speaking/listening
2. **Transition** - Simple routing without AI speaking, just passes control
3. **Function** - Execute custom functions
4. **Call Transfer** - Transfer to human agent
5. **Press Digit** - IVR-style inputs
6. **Logic Split Node** - Conditional branching based on conditions
7. **Agent Transfer** - Switch between agents
8. **SMS** - Send text messages
9. **Extract Variable** - Capture user information
10. **MCP** - Model Context Protocol integration
11. **Ending** - End call with disposition

---

## Recommended Complete Flow

### Node 1: Welcome (Static Sentence)
```
Great to hear from AI, a marketing agency. I hope you're doing well today! 
Is now a good time to chat, or should I call back at a better time?
```
↓

### Node 2: Logic Split (Availability Check)
**IF** user says "yes" / "now is good" / "go ahead"  
→ Continue to Node 3

**IF** user says "no" / "busy" / "not a good time"  
→ Jump to Node 10 (Schedule Callback)

↓

### Node 3: Extract Variables
**Extract**:
- Are you the business owner?
- What's your name?
- What type of business?

↓

### Node 4: Transition (Silent Router)
**Purpose**: Route based on extracted owner status  
**No AI Speech** - just passes control

**Routing**:
- IF owner = true → Node 5 (Main Pitch)
- IF owner = false → Node 12 (Ask for Owner)

↓

### Node 5: Main Qualification (Conversation)
```
I'll keep this super brief. We help home services businesses like [business_type] 
get more qualified leads. Are you currently happy with the number of leads you're getting?
```

↓

### Node 6: Logic Split (Lead Quality Response)
**IF** "no" / "could be better" / "need more"  
→ Continue to Node 7 (Value Prop)

**IF** "yes" / "happy" / "all good"  
→ Jump to Node 9 (Soft Close)

**IF** "not interested"  
→ Jump to Node 11 (End Call - Not Interested)

↓

### Node 7: Value Proposition (Conversation)
```
We specialize in AI-powered outreach and targeted marketing. We've helped similar 
businesses increase their lead flow by 2-3x. Would you be open to a 15-minute 
strategy call to see if we can help?
```

↓

### Node 8: Logic Split (Meeting Interest)
**IF** "yes" / "sure" / "okay"  
→ Send SMS with Calendly link  
→ End Call (Meeting Scheduled)

**IF** "maybe" / "need to think"  
→ Jump to Node 10 (Schedule Follow-up)

**IF** "no"  
→ Jump to Node 11 (End Call - Not Interested)

↓

### Node 9: Soft Close (Conversation)
```
That's great to hear business is going well! Would you be open to me following 
up in a few months if you ever need help scaling?
```
→ End Call (Warm Lead)

### Node 10: Schedule Callback/Follow-up (Conversation + Extract)
```
When would be a good time for me to call you back?
```
**Extract**: Callback date/time  
**Action**: Mark lead for follow-up  
→ End Call (Callback Scheduled)

↓

### Node 11: End Call - Not Interested
**Disposition**: Not Interested  
**Final Message**:
```
I completely understand. Thanks for your time and have a great day!
```

↓

### Node 12: Ask for Owner (Conversation)
```
No problem! Is the owner available right now, or would it be better if I 
called back at another time?
```

**Next Steps**:
- IF owner available → Transfer to owner → Loop back to Node 5
- IF owner not available → Extract callback time → End Call (Callback Scheduled)

---

## When to Use Each Node Type

### **Conversation Node**
- AI needs to speak and listen
- Main dialogue interactions
- Questions and responses

### **Transition Node**
- Silent routing between nodes
- No AI speech needed
- Organize flow logic cleanly
- Pass control based on context

### **Logic Split Node**
- Conditional branching with explicit conditions
- Multiple outcome paths
- Decision points based on keywords/variables

### **Extract Variable Node**
- Capture specific information
- Pull data from user responses
- Store in variables for later use

---

## Node Settings Configuration

### Global Node Settings (Available on Right Panel):
1. **Skip Response** - Jump to next node without waiting for user
2. **Global Node** - Allow other nodes to jump here without edges
3. **Block Interruptions** - Users cannot interrupt while AI is speaking
4. **LLM** - Choose different LLM for this specific node
5. **Node Knowledge Base** - Add context for this node
6. **Fine-tuning Examples** - Train agent with example conversations

---

## Implementation in Retell Dashboard

### Step 1: Create Nodes
1. Click **Components** tab
2. Drag and drop node types:
   - Start with **Conversation** node for welcome
   - Add **Logic Split Node** for branching
   - Add **Extract Variable** for data capture
   - Add **SMS** node for sending calendar links
   - Add **Ending** node for call termination

### Step 2: Connect Nodes
1. Draw edges between nodes
2. Set conditions on Logic Split nodes
3. Configure jump targets

### Step 3: Configure Each Node
- Set node names
- Write conversation text
- Configure variables
- Set transition conditions

### Step 4: Test
1. Click **Test Agent** button (top right)
2. Use **Simulation** mode
3. Speak or type responses
4. Verify flow follows expected path

---

## Call Dispositions (for Analytics)

| Disposition | When to Use | Next Action |
|-------------|-------------|-------------|
| **Meeting Scheduled** | Sent Calendly link, user interested | Follow up if no booking in 48h |
| **Callback Scheduled** | Owner busy, specific time set | Call at scheduled time |
| **Follow Up Later** | Interested but not now | Follow up in 1-2 weeks |
| **Warm Lead** | Happy now, open to future | Follow up in 3-6 months |
| **Not Interested** | Clear rejection | No follow-up |
| **Do Not Contact** | Requested removal | Remove from list |
| **Wrong Number** | Incorrect contact | Update lead data |

---

## Dynamic Variables from CRM

Pass these from your GreenLine AI dashboard:

```json
{
  "business_name": "Mowbray Tree Services",
  "owner_name": "John Mowbray",
  "business_type": "tree service",
  "city": "San Bernardino",
  "state": "CA",
  "phone": "(909) 389-0077",
  "rating": "3.5",
  "review_count": "133"
}
```

Reference in conversation:
- `{{business_name}}` - "I'm calling about {{business_name}}"
- `{{business_type}}` - "We help {{business_type}} businesses"
- `{{owner_name}}` - "Is {{owner_name}} available?"

---

## Integration with Your Code

The `/functions/api/calls/initiate.ts` will send:

```typescript
POST https://api.retellai.com/v2/create-phone-call
{
  "from_number": null,
  "to_number": "(909) 389-0077",
  "agent_id": "ag...f47",  // Your agent ID
  "metadata": {
    "leadId": "lead-123",
    "campaignId": "campaign-456"
  },
  "retell_llm_dynamic_variables": {
    "business_name": "Mowbray Tree Services",
    "business_type": "tree service",
    "owner_name": "John"
  }
}
```

---

## Best Practices from Your Flow

1. **Start with Availability Check** ✅
   - "Is now a good time?" shows respect
   
2. **Extract Variables Early** ✅
   - Get key info before making pitch
   
3. **Use Logic Splits for Branching** ✅
   - Clean conditional logic
   
4. **Block Interruptions on Key Messages** ✅
   - Ensure important info is heard
   
5. **Multiple End Points** ✅
   - Different dispositions for different outcomes

---

## Next Steps to Complete Your Agent

1. **Add the Missing Nodes**:
   - Value proposition conversation
   - SMS node with Calendly link
   - Follow-up scheduling logic

2. **Configure Logic Split Conditions**:
   - Define exact phrases/keywords for each path
   - Set confidence thresholds

3. **Add Knowledge Base** (if needed):
   - Company information
   - Common objection handling
   - Pricing details

4. **Fine-tune with Examples**:
   - Add successful call transcripts
   - Train on edge cases

5. **Test Thoroughly**:
   - Test all conversation paths
   - Verify variable extraction works
   - Check SMS integration

6. **Deploy**:
   - Copy Agent ID to wrangler.toml
   - Add to Cloudflare environment variables
   - Test from GreenLine dashboard

---

## Monitoring & Optimization

Track these metrics in Retell dashboard:
- **Call Duration** - Aim for 2-4 minutes
- **Completion Rate** - % that reach end without hanging up
- **Booking Rate** - % that result in meeting scheduled
- **Callback Rate** - % that request follow-up
- **Drop-off Points** - Where people hang up most

Iterate based on real call data!

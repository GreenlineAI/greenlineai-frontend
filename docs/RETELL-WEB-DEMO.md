# Retell Web Voice Demo Flow

## Demo Agent Overview
- **Agent Type**: Web Call Agent (Browser-based)
- **Purpose**: Demo for website visitors & sales demonstrations
- **Platform**: RetellWebClient SDK
- **Cost**: $0.095/min (same as phone calls)

---

## Node Components Available

| Node Type | Purpose | Content Mode |
|-----------|---------|--------------|
| **Conversation** | Main dialogue nodes with AI speaking/listening | Prompt OR Static |
| **Extract Variable** | Capture visitor information | Prompt OR Static |
| **Function** | Execute custom functions (e.g., send email, log demo) | N/A |
| **Logic Split Node** | Conditional branching based on conditions | N/A |
| **Ending** | End call with disposition | Prompt OR Static |

---

## Complete Demo Call Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      WEB DEMO FLOW CHART                             │
│                                                                      │
│   [Start] → [Node 1: Welcome] → [Node 2: Understand Needs]          │
│                                        ↓                             │
│                            ┌───────────┴───────────┐                │
│                            ↓                       ↓                │
│                  [Node 3: Service Info]   [Node 4: Pricing Q&A]    │
│                            ↓                       ↓                │
│                            └───────────┬───────────┘                │
│                                        ↓                             │
│                            [Node 5: Book Strategy Call]             │
│                                        ↓                             │
│                            ┌───────────┴───────────┐                │
│                            ↓                       ↓                │
│                    [Yes: Calendly]        [No: Follow-up]           │
│                            ↓                       ↓                │
│                    [Node 6: Confirm]     [Node 7: Thank You]        │
│                            ↓                       ↓                │
│                            └───────────┬───────────┘                │
│                                        ↓                             │
│                                    [End Call]                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Node 1: Welcome
**Node Type**: Conversation
**Content Mode**: Static

**Content**:
```
Hi! I'm Alex, the AI assistant for GreenLine AI. Thanks for trying out our voice demo!
I can answer your questions about our lead generation services, pricing, and how we help
home service businesses grow.

What would you like to know about today?
```

#### Transition
| Condition | Next Node |
|-----------|-----------|
| User asks about services or how it works | → Node 3: Service Info |
| User asks about pricing or cost | → Node 4: Pricing Q&A |
| User asks about leads or lead generation | → Node 3: Service Info |
| User is a business owner exploring options | → Node 2: Understand Needs |
| User is just browsing/curious | → Node 2: Understand Needs |

---

### Node 2: Understand Needs
**Node Type**: Extract Variable
**Content Mode**: Prompt

**Content**:
```
Great! To give you the most relevant info, I have a couple quick questions.
What type of home service business do you run? For example, plumbing, HVAC, landscaping, roofing?
```

#### Variables
| Variable Name | Description | Type |
|---------------|-------------|------|
| `business_type` | Type of home service business | Text |
| `visitor_name` | Name if visitor introduces themselves | Text |
| `current_lead_source` | How they currently get leads | Text |

#### Transition
| Condition | Next Node |
|-----------|-----------|
| User shares business type | → Node 3: Service Info |
| User asks about pricing first | → Node 4: Pricing Q&A |
| User says they're just exploring | → Node 3: Service Info |

---

### Node 3: Service Info
**Node Type**: Conversation
**Content Mode**: Prompt

**Content**:
```
Perfect! So here's what we do at GreenLine AI:

We provide AI-powered marketing and outreach for {{business_type}} businesses. Our system:

1. Finds verified homeowners in your service area who need your services
2. Reaches out to them via AI voice calls - just like this conversation!
3. Books qualified appointments directly onto your calendar

Most of our clients see a 2-3x increase in their lead flow within the first month.

Would you like to know about our pricing, or should we talk about how this would work
specifically for your business?
```

#### Transition
| Condition | Next Node |
|-----------|-----------|
| User asks about pricing | → Node 4: Pricing Q&A |
| User wants to learn more | → Node 5: Book Strategy Call |
| User has specific questions | Continue conversation in this node |
| User is interested in getting started | → Node 5: Book Strategy Call |

---

### Node 4: Pricing Q&A
**Node Type**: Conversation
**Content Mode**: Static

**Content**:
```
Our pricing is simple and transparent. We have three plans:

Starter Plan - $149 per month
- 200 call minutes
- 1 phone number
- Basic AI script
- Great for solo operators

Professional Plan - $297 per month - This is our most popular!
- 500 call minutes
- 2 phone numbers
- Custom AI voice and script
- Appointment booking with calendar sync

Business Plan - $497 per month
- Unlimited call minutes
- 5 phone numbers
- Multiple AI personas
- Dedicated account manager

We also offer annual plans with 2 months free.

Does any of these sound like a fit for your business?
```

#### Transition
| Condition | Next Node |
|-----------|-----------|
| User shows interest, asks follow-up | → Node 5: Book Strategy Call |
| User says too expensive | → Price justification, then Node 5 |
| User wants to proceed | → Node 5: Book Strategy Call |
| User needs to think about it | → Node 7: Thank You |

---

### Node 5: Book Strategy Call
**Node Type**: Conversation
**Content Mode**: Prompt

**Content**:
```
Awesome! The best next step would be a quick 15-minute strategy call with our team.
They can show you exactly how many leads are available in your specific market,
and walk you through how the system would work for {{business_type}} businesses.

Would you like me to tell you how to book that call?
```

#### Transition
| Condition | Next Node |
|-----------|-----------|
| User says yes, wants to book | → Node 6: Calendly Info |
| User says not right now | → Node 7: Thank You |
| User has more questions | Continue conversation or route back |

---

### Node 6: Calendly Info
**Node Type**: Conversation
**Content Mode**: Static

**Content**:
```
Great! Here's how to book:

Go to calendly.com/greenlineai - that's C-A-L-E-N-D-L-Y dot com slash greenlineai.

You can pick any time that works for you. It's just a quick 15-minute call, no pressure,
no obligation. We'll show you the leads in your area and answer any questions.

Is there anything else you'd like to know before we wrap up?
```

#### Transition
| Condition | Next Node |
|-----------|-----------|
| User has more questions | Address questions, then → Node 7 |
| User says thank you or goodbye | → Node 7: Thank You |
| User confirms they'll book | → Node 7: Thank You |

---

### Node 7: Thank You (End Node)
**Node Type**: Ending
**Content Mode**: Static
**Disposition**: Demo Completed

**Content**:
```
Thanks so much for chatting with me today! It was great talking with you.

If you have any questions later, just come back to our website or book that strategy call.
We'd love to help {{business_type}} businesses like yours grow.

Have a great day!
```

---

## Technical Implementation

### Environment Variables

**Client-Side (Browser)**:
```env
NEXT_PUBLIC_RETELL_AGENT_ID=agent_xxx  # Web demo agent ID
```

**Server-Side (Cloudflare Worker)**:
```env
RETELL_API_KEY=key_xxx  # Secret API key
```

---

### Component Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Browser (Client)                             │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                    RetellDemo Component                          ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ ││
│  │  │  Call UI    │  │  Audio      │  │  RetellWebClient        │ ││
│  │  │  - Button   │  │  - Capture  │  │  - WebSocket connection │ ││
│  │  │  - Status   │  │  - Playback │  │  - Event handling       │ ││
│  │  │  - Volume   │  │  - Mute     │  │  - Start/Stop calls     │ ││
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘ ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1. POST /api/retell/register-call
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Cloudflare Worker (API)                           │
│               /api/retell/register-call.ts                          │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 2. POST /v2/create-web-call
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Retell AI API                                │
│              Returns: access_token, call_id                          │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 3. WebSocket Connection
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 Real-time Voice Conversation                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Event Handlers

| Event | Trigger | UI Update |
|-------|---------|-----------|
| `call_started` | Call connected | "Connected - Start speaking!" |
| `call_ended` | Call terminated | "Call ended - Click to try again" |
| `agent_start_talking` | AI begins response | "AI is speaking..." |
| `agent_stop_talking` | AI finishes | "Listening..." |
| `audio` | Audio data received | Update volume indicator |
| `error` | Error occurs | Show error message |

---

### Files

| File | Purpose |
|------|---------|
| `components/RetellDemo.tsx` | Main React component with UI and SDK |
| `functions/api/retell/register-call.ts` | API to register web calls |
| `app/demo/voice/page.tsx` | Demo page hosting the component |

---

## Security Notes

1. **RETELL_API_KEY** - Only used server-side, never exposed
2. **Access tokens** - Short-lived, per-call
3. **Agent ID** - Public, safe to expose
4. **CORS** - Configured for allowed origins only

---

## Testing Checklist

- [ ] Set `NEXT_PUBLIC_RETELL_AGENT_ID` in `.env.local`
- [ ] Set `RETELL_API_KEY` in Cloudflare environment
- [ ] Verify microphone permissions work
- [ ] Test call start/end functionality
- [ ] Test mute/unmute toggle
- [ ] Verify volume indicator updates
- [ ] Test error handling for missing config

# GreenLine AI Voice Agent Flow

This document outlines the conversation flow for the Retell AI voice agent used in the GreenLine AI auto-dialer system.

## Flow Chart

```mermaid
flowchart TD
    A[📞 Call Initiated] --> B{Call Answered?}
    B -->|No| C[Log: No Answer]
    C --> D[Schedule Retry]
    D --> E[End Call]

    B -->|Yes| F[Greeting Node<br/>📝 Prompt OR Static]

    F --> G{Speaking with Decision Maker?}
    G -->|No - Gatekeeper| H[Gatekeeper Response<br/>📝 Prompt OR Static]
    H --> I{Transferred?}
    I -->|No| J[Callback Request<br/>📝 Prompt OR Static]
    J --> K[Log callback time]
    K --> E
    I -->|Yes| F

    G -->|Yes| L[Availability Check<br/>📝 Prompt OR Static]
    L -->|No| M[Reschedule Response<br/>📝 Prompt OR Static]
    M --> K

    L -->|Yes| N[Pain Point Discovery<br/>📝 Prompt OR Static]
    N --> O{Current Lead Gen Satisfaction?}

    O -->|Happy with current| P[Soft Close<br/>📝 Prompt OR Static]
    P --> Q[Future Follow-up<br/>📝 Prompt OR Static]
    Q --> R[Log: Not Interested Now]
    R --> E

    O -->|Some challenges| S[Deep Dive Questions<br/>📝 Prompt OR Static]
    S --> T{Interested in Solution?}

    O -->|Frustrated| S

    T -->|No| P
    T -->|Maybe| U[Value Prop<br/>📝 Prompt OR Static]
    U --> V{Want to learn more?}

    T -->|Yes| W[Meeting Pitch<br/>📝 Prompt OR Static]

    V -->|No| P
    V -->|Yes| W

    W --> X{Interested in Meeting?}
    X -->|No| Y[Email Alternative<br/>📝 Prompt OR Static]
    Y --> Z[Send follow-up email]
    Z --> R

    X -->|Yes| AA[📱 SMS Node]
    AA -->|Success| AB[SMS Success Response<br/>📝 Prompt OR Static]
    AA -->|Failure| AB2[SMS Failure Response<br/>📝 Prompt OR Static]
    AB --> AC[🔧 Function Node: Cal.com<br/>Create Appointment]
    AB2 --> AC2[Verbal Booking Fallback<br/>📝 Prompt OR Static]
    AC2 --> AC
    AC -->|Success| AD[Booking Confirmation<br/>📝 Prompt OR Static]
    AC -->|Failure| AD2[Booking Error Response<br/>📝 Prompt OR Static]
    AD --> AE[Log: Meeting Booked ✅]
    AD2 --> AG
    AE --> AF[Closing<br/>📝 Prompt OR Static]

    AG[Set follow-up reminder]
    AG --> AH[Log: Pending Booking]
    AH --> AF
    AF --> END[End Call]
```

## Node Configuration

Each conversation node in the flow supports two content modes:

| Mode | Description | Use Case |
|------|-------------|----------|
| **Prompt** | AI generates dynamic response based on context | When personalization or situational awareness is needed |
| **Static Sentence** | Pre-defined text spoken exactly as written | For consistent messaging, compliance, or specific scripts |

### Configuration Example

```json
{
  "node_id": "greeting",
  "content_mode": "prompt",  // or "static"
  "prompt": "Introduce yourself warmly and ask if now is a good time to talk briefly about their lead generation.",
  "static_text": "Hi, this is Alex from GreenLine AI. Do you have a quick moment to chat?"
}
```

## Conversation States

### 1. Initial Greeting
- Introduce as Alex from GreenLine AI
- Be warm and professional
- Immediately ask if it's a good time
- **Mode:** Prompt OR Static

### 2. Gatekeeper Handling
- Politely ask to speak with the owner or decision maker
- If unavailable, get best callback time
- Never pitch to gatekeepers
- **Mode:** Prompt OR Static

### 3. Pain Point Discovery
Key questions to ask:
- "How are you currently getting new leads for your business?"
- "Are you happy with the quality and volume of leads you're getting?"
- "What would it mean for your business if you could 2-3x your qualified leads?"
- **Mode:** Prompt OR Static

### 4. Value Proposition
- We help home services businesses generate more qualified leads
- AI-powered outreach that works 24/7
- Clients typically see 2-3x increase in qualified leads
- **Mode:** Prompt OR Static

### 5. SMS Node
Sends booking link via SMS to the lead's phone number.

| Transition | Response Node |
|------------|---------------|
| **Success** | SMS Success Response (Prompt OR Static) - e.g., "Great, I just sent you a link to book directly." |
| **Failure** | SMS Failure Response (Prompt OR Static) - e.g., "I wasn't able to send the link, but let me help you book right now." |

### 6. Meeting Booking (Function Node: Cal.com)
Uses the built-in Cal.com function node to create appointments directly:

```json
{
  "node_type": "function",
  "function": "cal_com_create_booking",
  "parameters": {
    "event_type_id": "your-event-type-id",
    "attendee_name": "{{lead_name}}",
    "attendee_email": "{{lead_email}}",
    "attendee_phone": "{{lead_phone}}",
    "start_time": "{{selected_time}}"
  }
}
```

| Transition | Response Node |
|------------|---------------|
| **Success** | Booking Confirmation (Prompt OR Static) - Confirms meeting details |
| **Failure** | Booking Error Response (Prompt OR Static) - Offers to follow up or retry |

### 7. Objection Handling

| Objection | Response |
|-----------|----------|
| "Not interested" | "I understand. Would it be okay if I followed up in a few months to see if anything has changed?" |
| "Already have a marketing agency" | "That's great! How are they doing with lead generation specifically? Many of our clients use us alongside their agency." |
| "Too busy right now" | "I completely understand. When would be a better time for a quick 5-minute chat?" |
| "How much does it cost?" | "It varies based on your goals. That's exactly what we'd cover in the strategy call - no pressure, just to see if we're a fit." |

## Call Outcomes

| Status | Description | Next Action |
|--------|-------------|-------------|
| `meeting_booked` | Successfully scheduled meeting | Send confirmation email |
| `callback_scheduled` | Will call back at specific time | Add to callback queue |
| `not_interested` | Declined, no follow-up | Archive lead |
| `not_interested_now` | Declined but open to future | Schedule 3-month follow-up |
| `no_answer` | Call not answered | Retry up to 3 times |
| `wrong_number` | Invalid phone number | Remove from list |
| `voicemail` | Left voicemail | Schedule callback |

## Technical Integration

### Retell AI Configuration
- **Agent ID**: Configured in `wrangler.toml` as `RETELL_AGENT_ID_1`
- **From Number**: Twilio number configured as `RETELL_FROM_NUMBER`
- **Webhook URL**: `https://greenlineai-frontend.pages.dev/api/calls/webhook`

### Dynamic Variables
The agent receives these variables for personalization:
```json
{
  "business_context": "Custom prompt or default sales script",
  "lead_name": "Contact name from database",
  "business_name": "Company name",
  "industry": "Business type (e.g., HVAC, Plumbing)"
}
```

### Cal.com Function Node Integration
Uses the built-in Retell function node to create appointments via Cal.com API:

| Parameter | Description |
|-----------|-------------|
| `event_type_id` | Your Cal.com event type ID |
| `attendee_name` | Lead's name (from dynamic variables) |
| `attendee_email` | Lead's email address |
| `attendee_phone` | Lead's phone number |
| `start_time` | Selected appointment time (ISO 8601) |

**Transitions:**
- **Success**: Proceeds to booking confirmation node
- **Failure**: Routes to error handling with follow-up reminder

### SMS Node Integration
Sends booking link via Twilio SMS:

| Transition | Description |
|------------|-------------|
| **Success** | SMS delivered - proceed to confirmation response |
| **Failure** | SMS failed - route to verbal booking fallback |

Each transition can be configured with either a **Prompt** (AI-generated response) or **Static Sentence** (pre-defined text).

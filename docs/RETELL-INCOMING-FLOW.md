# Retell AI Incoming Call Flow for Business Customers

## Agent Overview
- **Agent Type**: Inbound Phone Agent (Customer Service)
- **Purpose**: Handle incoming calls for businesses that sign up with GreenLine AI
- **Use Case**: 24/7 AI phone answering for home service businesses
- **Cost**: $0.095/min

---

## Global Prompt

Copy this into your Retell agent's **Global Prompt** field for inbound customer service agents.

**Note:** This prompt uses dynamic variables (e.g., `{{company_name}}`) that must be configured per-business.

```
You are a professional and friendly AI assistant answering calls for {{company_name}}. Your job is to provide excellent customer service, answer questions, book appointments, and ensure callers feel taken care of.

## Your Personality
- Professional yet warm - you represent the business well
- Patient and helpful - callers may be stressed about their issue
- Efficient - respect the caller's time
- Knowledgeable about the business you represent
- Calm during urgent situations - reassure callers that help is coming

## Business Information
- **Company Name:** {{company_name}}
- **Services Offered:** {{company_services}}
- **Service Area:** {{company_service_area}}
- **Business Hours:** {{company_hours}}
- **Emergency Availability:** {{company_emergency}}
- **Owner/Manager:** {{owner_name}}

## Your Goals (in order of priority)
1. **Greet professionally** - make callers feel they've reached a real, caring business
2. **Understand their need** - is it a service request, question, or emergency?
3. **Help if you can** - answer questions, book appointments, provide information
4. **Escalate appropriately** - transfer emergencies, take messages for complex issues
5. **Leave a positive impression** - every call reflects on the business

## Handling Different Call Types

**Service Appointment Requests:**
- Ask what service they need and briefly about the issue
- Confirm they're in the service area ({{company_service_area}})
- Offer available appointment times
- Collect: name, phone number, address, and issue description
- Send confirmation via SMS when booking completes

**Questions About Services:**
- Provide information about {{company_services}}
- For pricing questions, explain that quotes vary by situation and offer to schedule an evaluation or callback
- Be helpful but don't make up information you don't have

**Emergency/Urgent Calls:**
- Take these seriously - the caller may be stressed
- If truly urgent, offer to transfer to {{owner_name}}
- If transfer isn't possible, take a detailed message and assure them it will be handled immediately

**Requests to Speak to Owner:**
- Ask if it's urgent/emergency or if a callback would work
- For emergencies, attempt transfer to {{owner_phone}}
- For non-urgent, take a message with callback preference

**Solicitors/Sales Calls:**
- Politely but firmly decline: "We're not interested at this time"
- Ask to be removed from their list
- End the call courteously

## Message Taking
When taking messages, always collect:
- Caller's name
- Phone number for callback
- Brief reason for the call
- Best time to call back

Always read back the information to confirm accuracy.

## Important Rules
- **Never give pricing quotes** unless explicitly trained to - always offer evaluation appointment or callback
- **Never make up information** - if you don't know, offer to have someone call back
- **Always be polite** - even to rude callers or solicitors
- **Protect customer privacy** - don't share other customer information
- **Log everything** - every interaction helps the business serve customers better
- **Know your limits** - complex technical questions or complaints should go to {{owner_name}}

## Voice and Tone
- Speak clearly and at a moderate pace
- Use the business name naturally: "Thanks for calling {{company_name}}"
- Mirror the caller's urgency level - calm for routine, responsive for emergencies
- End every call positively: "Thanks for calling, have a great day!"
```

---

## What This Agent Does

When a homeowner calls a GreenLine AI customer's business phone number, this AI agent:
1. Answers professionally as the business
2. Handles common inquiries (services, hours, pricing ranges)
3. Books appointments on the business's calendar
4. Takes messages for urgent or complex requests
5. Qualifies leads before transferring to the business owner

---

## Node Components Used

| Node Type | Purpose | Content Mode |
|-----------|---------|--------------|
| **Conversation** | Main dialogue nodes | Prompt OR Static |
| **Extract Variable** | Capture caller information | N/A |
| **Function** | Cal.com booking, custom functions | N/A |
| **SMS** | Send confirmation texts | Static |
| **Call Transfer** | Transfer to business owner | Static |
| **Ending** | End call with disposition | Prompt OR Static |

---

## Dynamic Variables (Passed per Business)

These variables are configured per-business when they sign up:

| Variable Name | Description | Example |
|---------------|-------------|---------|
| `company_name` | Business name to use in greeting | "Mike's Plumbing" |
| `company_services` | List of services offered | "plumbing, drain cleaning, water heater repair" |
| `company_service_area` | Areas served | "San Diego and surrounding areas" |
| `company_hours` | Business hours | "Monday through Friday, 8am to 6pm" |
| `company_emergency` | Emergency availability | "24/7 for emergencies" |
| `owner_name` | Business owner name | "Mike" |
| `owner_phone` | Number to transfer urgent calls | "+1234567890" |
| `booking_enabled` | Whether to offer appointment booking | true/false |
| `cal_event_type_id` | Cal.com event type for bookings | "abc123" |

---

## Complete Call Flow

```
                        ┌─────────────────────────────────────────┐
                        │           INCOMING CALL FLOW             │
                        └─────────────────────────────────────────┘
                                          │
                                          ▼
                              ┌───────────────────────┐
                              │  Node 1: Greeting     │
                              └───────────────────────┘
                                          │
                      ┌───────────────────┼───────────────────┐
                      ▼                   ▼                   ▼
            ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
            │ Schedule Service│ │ Get Information │ │ Speak to Owner  │
            └─────────────────┘ └─────────────────┘ └─────────────────┘
                      │                   │                   │
                      ▼                   ▼                   ▼
            ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
            │ Collect Details │ │ Answer Questions│ │ Check Urgency   │
            └─────────────────┘ └─────────────────┘ └─────────────────┘
                      │                   │                   │
                      ▼                   │         ┌────────┴────────┐
            ┌─────────────────┐           │         ▼                 ▼
            │ Book Appointment│           │   ┌───────────┐    ┌───────────┐
            └─────────────────┘           │   │ Transfer  │    │ Take Msg  │
                      │                   │   └───────────┘    └───────────┘
                      ▼                   │         │                 │
            ┌─────────────────┐           │         │                 │
            │ Send Confirm SMS│           │         │                 │
            └─────────────────┘           │         │                 │
                      │                   │         │                 │
                      └───────────────────┴─────────┴─────────────────┘
                                          │
                                          ▼
                              ┌───────────────────────┐
                              │     End Call          │
                              └───────────────────────┘
```

---

### Node 1: Greeting
**Node Type**: Conversation
**Content Mode**: Prompt

**Content**:
```
Thank you for calling {{company_name}}! This is our AI assistant.
I can help you schedule a service appointment, answer questions about our services,
or connect you with {{owner_name}} if needed.

How can I help you today?
```

#### Transition
| Condition | Next Node | Type |
|-----------|-----------|------|
| Caller wants to schedule/book service | → Node 2: Collect Service Details | Prompt |
| Caller has questions about services/pricing/hours | → Node 5: Answer Questions | Prompt |
| Caller wants to speak to owner/human | → Node 8: Check Urgency | Prompt |
| Caller has emergency/urgent issue | → Node 8: Check Urgency | Prompt |
| Caller is a solicitor/spam | → Node 12: End - Solicitor | Prompt |

---

### Node 2: Collect Service Details
**Node Type**: Conversation
**Content Mode**: Prompt

**Content**:
```
I'd be happy to help you schedule a service appointment.

First, can you tell me what type of service you need? We offer {{company_services}}.
```

#### Transition
| Condition | Next Node | Type |
|-----------|-----------|------|
| Caller describes the service needed | → Node 2a: Extract Service Info | Prompt |
| Caller unsure what they need | → Node 2b: Help Identify Issue | Prompt |
| Service not offered | → Node 5a: Service Not Offered | Prompt |

---

### Node 2a: Extract Service Info
**Node Type**: Extract Variable

**Purpose**: Capture details about the service request.

#### Variables
| Variable Name | Description | Type |
|---------------|-------------|------|
| `service_type` | Type of service needed (e.g., "drain cleaning", "AC repair") | Text |
| `issue_description` | Brief description of the problem | Text |
| `urgency_level` | How urgent (today, this week, flexible) | Text |
| `caller_name` | Caller's name | Text |
| `caller_phone` | Callback number | Text |
| `service_address` | Address for service | Text |

#### Transition
| Condition | Next Node | Type |
|-----------|-----------|------|
| Details captured successfully | → Node 3: Confirm Service Area | Prompt |
| Need more information | → Node 2: Collect Service Details (loop back) | Prompt |

---

### Node 2b: Help Identify Issue
**Node Type**: Conversation
**Content Mode**: Prompt

**Content**:
```
No problem! Let me help you figure out what you need.

Can you describe what's happening? For example, is there a leak, something not working,
or are you looking for maintenance or installation?
```

#### Transition
| Condition | Next Node | Type |
|-----------|-----------|------|
| Caller describes issue | → Node 2a: Extract Service Info | Prompt |
| Still unclear | → Node 9: Take Message | Prompt |

---

### Node 3: Confirm Service Area
**Node Type**: Conversation
**Content Mode**: Prompt

**Content**:
```
Great! We handle {{service_type}} all the time.

Just to confirm - are you located in {{company_service_area}}?
```

#### Transition
| Condition | Next Node | Type |
|-----------|-----------|------|
| Yes, in service area | → Node 3a: Scheduling Intro (if booking_enabled) | Prompt |
| No, outside service area | → Node 5b: Outside Service Area | Prompt |

---

### Node 3a: Scheduling Intro
**Node Type**: Conversation
**Content Mode**: Prompt

**Content**:
```
Perfect! I'd be happy to get you scheduled for a {{service_type}} appointment.

Do you have a general idea of when works best for you - are you looking for something this week, or is it more flexible?
```

#### Transition
| Condition | Next Node | Type |
|-----------|-----------|------|
| Provides timing preference | → Node 4: Check Availability | Prompt |
| Wants to know more first | → Node 5: Answer Questions | Prompt |
| Changed mind, wants callback | → Node 9: Take Message | Prompt |

---

### Node 4: Check Availability (Function Node)
**Node Type**: Function
**Function**: `cal_com_check_availability`

**Purpose**: Check available appointment slots.

**Function Configuration**:
```json
{
  "function": "cal_com_check_availability",
  "parameters": {
    "event_type_id": "{{cal_event_type_id}}",
    "timezone": "America/Los_Angeles",
    "date_range": "next_7_days"
  }
}
```

#### Transition
| Condition | Next Node | Type |
|-----------|-----------|------|
| Slots available | → Node 4a: Offer Times | Prompt |
| No slots / API failure | → Node 9: Take Message | Prompt |

---

### Node 4a: Offer Times
**Node Type**: Conversation
**Content Mode**: Prompt

**Content**:
```
I can see we have availability. Would {{next_available}} work for you?
Or I can check other times if that doesn't fit your schedule.
```

#### Transition
| Condition | Next Node | Type |
|-----------|-----------|------|
| Accepts offered time | → Node 4b: Create Booking | Prompt |
| Requests different time | → Node 4a-alt: Extract Preferred Time | Prompt |
| Wants to speak to owner instead | → Node 8: Check Urgency | Prompt |

---

### Node 4a-alt: Extract Preferred Time
**Node Type**: Extract Variable

#### Variables
| Variable Name | Description | Type |
|---------------|-------------|------|
| `preferred_time` | When caller wants appointment | Text |

#### Transition
| Condition | Next Node | Type |
|-----------|-----------|------|
| Time extracted | → Node 4b: Create Booking | Prompt |
| Unable to find matching time | → Node 9: Take Message | Prompt |

---

### Node 4b: Create Booking (Function Node)
**Node Type**: Function
**Function**: `cal_com_create_booking`

**Function Configuration**:
```json
{
  "function": "cal_com_create_booking",
  "parameters": {
    "event_type_id": "{{cal_event_type_id}}",
    "attendee_name": "{{caller_name}}",
    "attendee_phone": "{{caller_phone}}",
    "start_time": "{{selected_time}}",
    "timezone": "America/Los_Angeles",
    "notes": "Service: {{service_type}}. Issue: {{issue_description}}"
  }
}
```

#### Transition
| Condition | Next Node | Type |
|-----------|-----------|------|
| Booking successful | → Node 4c: Send Confirmation SMS | Prompt |
| Booking failed | → Node 9: Take Message | Prompt |

---

### Node 4c: Send Confirmation SMS
**Node Type**: SMS

**SMS Content**:
```
Hi {{caller_name}}! Your appointment with {{company_name}} is confirmed for {{confirmed_time}}.

Service: {{service_type}}
Address: {{service_address}}

We'll see you then! Reply to this text if you need to reschedule.
```

#### SMS Transitions
| Transition | Next Node |
|------------|-----------|
| **Success** | → Node 4c-success: SMS Success |
| **Failure** | → Node 4c-failure: SMS Failure |

---

### Node 4c-success: SMS Success
**Node Type**: Conversation
**Content Mode**: Static

**Content**:
```
I just sent you a confirmation text with all the details.
Is there anything else I can help you with today?
```

#### Transition
| Condition | Next Node | Type |
|-----------|-----------|------|
| No, all set | → Node 11: End - Appointment Booked | Prompt |
| Has another question | → Node 5: Answer Questions | Prompt |

---

### Node 4c-failure: SMS Failure
**Node Type**: Conversation
**Content Mode**: Static

**Content**:
```
I had trouble sending the text, but you're all booked!
Your appointment is set for {{confirmed_time}} for {{service_type}}.
{{company_name}} will see you then.

Is there anything else I can help you with?
```

#### Transition
| Condition | Next Node | Type |
|-----------|-----------|------|
| No, all set | → Node 11: End - Appointment Booked | Prompt |
| Has another question | → Node 5: Answer Questions | Prompt |

---

### Node 5: Answer Questions
**Node Type**: Conversation
**Content Mode**: Prompt

**Content**:
```
Of course! I'm happy to help with any questions.

Here's what I can tell you about {{company_name}}:

**Services we offer**: {{company_services}}
**Service area**: {{company_service_area}}
**Hours**: {{company_hours}}
**Emergencies**: {{company_emergency}}

What would you like to know more about?
```

#### Transition
| Condition | Next Node | Type |
|-----------|-----------|------|
| Question answered, wants to book | → Node 2: Collect Service Details | Prompt |
| Question answered, done | → Node 10: End - Info Provided | Prompt |
| Wants to speak to owner | → Node 8: Check Urgency | Prompt |
| Has pricing question | → Node 5c: Pricing Response | Prompt |

---

### Node 5a: Service Not Offered
**Node Type**: Conversation
**Content Mode**: Prompt

**Content**:
```
I apologize, but {{company_name}} doesn't offer that particular service.

Our specialties are {{company_services}}.

Is there something else I can help you with today?
```

#### Transition
| Condition | Next Node | Type |
|-----------|-----------|------|
| Caller has different need we can help | → Node 2: Collect Service Details | Prompt |
| Caller done | → Node 10: End - Info Provided | Prompt |

---

### Node 5b: Outside Service Area
**Node Type**: Conversation
**Content Mode**: Static

**Content**:
```
I'm sorry, but that location is outside our current service area.
We primarily serve {{company_service_area}}.

Is there anything else I can help you with?
```

#### Transition
| Condition | Next Node | Type |
|-----------|-----------|------|
| Done | → Node 10: End - Info Provided | Prompt |
| Wants to check closer location | → Continue conversation | Prompt |

---

### Node 5c: Pricing Response
**Node Type**: Conversation
**Content Mode**: Prompt

**Content**:
```
Great question! Pricing for {{service_type}} can vary depending on the specific situation.

For an accurate quote, I'd recommend scheduling a quick evaluation appointment,
or I can have {{owner_name}} give you a call back to discuss pricing.

Which would work better for you?
```

#### Transition
| Condition | Next Node | Type |
|-----------|-----------|------|
| Wants appointment for quote | → Node 2: Collect Service Details | Prompt |
| Wants callback | → Node 9: Take Message | Prompt |
| Done for now | → Node 10: End - Info Provided | Prompt |

---

### Node 8: Check Urgency
**Node Type**: Conversation
**Content Mode**: Prompt

**Content**:
```
I understand you'd like to speak with {{owner_name}} directly.

Is this an emergency situation that needs immediate attention,
or would you prefer a callback when {{owner_name}} is available?
```

#### Transition
| Condition | Next Node | Type |
|-----------|-----------|------|
| Emergency - needs immediate help | → Node 8a: Transfer Call | Prompt |
| Not urgent - callback is fine | → Node 9: Take Message | Prompt |
| Just had a quick question | → Node 5: Answer Questions | Prompt |

---

### Node 8a: Transfer Call
**Node Type**: Call Transfer
**Content Mode**: Static

**Transfer To**: `{{owner_phone}}`

**Content**:
```
I'm going to transfer you to {{owner_name}} right now.
Please hold for just a moment.
```

#### Transition
| Condition | Next Node | Type |
|-----------|-----------|------|
| Transfer successful | → End Call | — |
| Transfer failed | → Node 9: Take Message | Prompt |

---

### Node 9: Take Message
**Node Type**: Extract Variable

**Purpose**: Capture message details from the caller for business owner follow-up.

#### Variables
| Variable Name | Description | Type |
|---------------|-------------|------|
| `message_name` | Caller's name | Text |
| `message_phone` | Callback number | Text |
| `message_reason` | Reason for call/message | Text |
| `callback_preference` | Best time to call back | Text |

#### Transition
| Condition | Next Node | Type |
|-----------|-----------|------|
| Message captured | → Node 9a: Confirm Message | Prompt |

---

### Node 9a: Confirm Message
**Node Type**: Conversation
**Content Mode**: Prompt

**Content**:
```
I've got it. Let me confirm:

Name: {{message_name}}
Callback number: {{message_phone}}
Regarding: {{message_reason}}

I'll make sure {{owner_name}} gets this message and calls you back as soon as possible.
Is there anything else you'd like me to add?
```

#### Transition
| Condition | Next Node | Type |
|-----------|-----------|------|
| Message confirmed | → Node 13: End - Message Taken | Prompt |
| Needs correction | → Node 9: Take Message (loop) | Prompt |

---

## Ending Nodes

### Node 10: End - Info Provided
**Node Type**: Ending
**Content Mode**: Static
**Disposition**: Info Provided

**Content**:
```
You're welcome! Thanks for calling {{company_name}}.
If you need anything else, don't hesitate to call back.
Have a great day!
```

---

### Node 11: End - Appointment Booked
**Node Type**: Ending
**Content Mode**: Prompt
**Disposition**: Appointment Booked

**Content**:
```
Your appointment is all set for {{confirmed_time}}.
Thanks for choosing {{company_name}}!
We look forward to helping you with your {{service_type}} needs.
Have a great day!
```

---

### Node 12: End - Solicitor
**Node Type**: Ending
**Content Mode**: Static
**Disposition**: Solicitor/Spam

**Content**:
```
I'm sorry, but we're not interested at this time.
Please remove this number from your calling list.
Thank you, goodbye.
```

---

### Node 13: End - Message Taken
**Node Type**: Ending
**Content Mode**: Prompt
**Disposition**: Message Taken

**Content**:
```
I'll make sure {{owner_name}} gets your message right away.
Thanks for calling {{company_name}}, and have a wonderful day!
```

---

## Call Dispositions Summary

| Disposition | When to Use | Follow-up Action |
|-------------|-------------|------------------|
| **Appointment Booked** | Service appointment scheduled | Send to business calendar |
| **Message Taken** | Caller left message for owner | Notify owner immediately |
| **Info Provided** | Caller had questions answered | Log interaction |
| **Transfer Completed** | Call transferred to owner | Track in call log |
| **Solicitor/Spam** | Sales call or spam | No follow-up |
| **Outside Service Area** | Location not served | Log for future expansion |

---

## Integration Notes

### Per-Business Configuration

Each business that signs up needs:
1. Custom agent created in Retell dashboard
2. Dynamic variables configured:
   - Company name, services, hours
   - Cal.com integration (if booking enabled)
   - Owner transfer number
3. Phone number assigned via Twilio
4. Webhook configured for call logging

### API Integration

Calls are logged to Supabase via webhook:
```typescript
// /api/calls/webhook.ts handles incoming call events
{
  call_type: "inbound",
  business_id: "...",
  caller_phone: "...",
  disposition: "Appointment Booked",
  duration: 180,
  transcript: "..."
}
```

---

## Flow Diagram (Mermaid)

```mermaid
flowchart TD
    subgraph Greeting
        N1[Node 1: Greeting]
    end

    subgraph ServiceBooking["Service Booking"]
        N2[Node 2: Collect Service Details]
        N2a[Node 2a: Extract Service Info]
        N2b[Node 2b: Help Identify Issue]
        N3[Node 3: Confirm Service Area]
        N3a[Node 3a: Scheduling Intro]
        N4[Node 4: Check Availability]
        N4a[Node 4a: Offer Times]
        N4a_alt[Node 4a-alt: Extract Preferred Time]
        N4b[Node 4b: Create Booking]
        N4c[Node 4c: Send SMS]
        N4c_s[Node 4c-success: SMS Success]
        N4c_f[Node 4c-failure: SMS Failure]
    end

    subgraph Questions["Questions & Info"]
        N5[Node 5: Answer Questions]
        N5a[Node 5a: Service Not Offered]
        N5b[Node 5b: Outside Service Area]
        N5c[Node 5c: Pricing Response]
    end

    subgraph Transfer["Transfer & Messages"]
        N8[Node 8: Check Urgency]
        N8a[Node 8a: Transfer Call]
        N9[Node 9: Take Message]
        N9a[Node 9a: Confirm Message]
    end

    subgraph Endings
        N10[Node 10: End - Info Provided]
        N11[Node 11: End - Appointment Booked]
        N12[Node 12: End - Solicitor]
        N13[Node 13: End - Message Taken]
    end

    %% Main Flow
    N1 -->|"Schedule service"| N2
    N1 -->|"Questions"| N5
    N1 -->|"Speak to owner"| N8
    N1 -->|"Solicitor"| N12

    %% Service Booking Flow
    N2 -->|"Describes need"| N2a
    N2 -->|"Unsure"| N2b
    N2b --> N2a
    N2a --> N3
    N3 -->|"In area"| N3a
    N3 -->|"Outside area"| N5b
    N3a -->|"Ready to schedule"| N4
    N3a -->|"Questions first"| N5
    N3a -->|"Wants callback"| N9
    N4 -->|"Slots available"| N4a
    N4 -->|"No slots"| N9
    N4a -->|"Accepts"| N4b
    N4a -->|"Different time"| N4a_alt
    N4a_alt --> N4b
    N4b -->|"Success"| N4c
    N4b -->|"Failure"| N9
    N4c -->|"SMS Success"| N4c_s
    N4c -->|"SMS Failure"| N4c_f
    N4c_s --> N11
    N4c_f --> N11

    %% Questions Flow
    N5 -->|"Wants to book"| N2
    N5 -->|"Done"| N10
    N5 -->|"Speak to owner"| N8
    N5 -->|"Pricing"| N5c
    N5a --> N10
    N5b --> N10
    N5c -->|"Book quote"| N2
    N5c -->|"Callback"| N9

    %% Transfer Flow
    N8 -->|"Emergency"| N8a
    N8 -->|"Not urgent"| N9
    N9 --> N9a
    N9a --> N13

    %% Styling
    style N4 fill:#4CAF50,color:#fff
    style N4b fill:#4CAF50,color:#fff
    style N4c fill:#2196F3,color:#fff
    style N4c_s fill:#4CAF50,color:#fff
    style N4c_f fill:#FF9800,color:#fff
    style N8a fill:#9C27B0,color:#fff
    style N10 fill:#607D8B,color:#fff
    style N11 fill:#4CAF50,color:#fff
    style N12 fill:#f44336,color:#fff
    style N13 fill:#2196F3,color:#fff
```

---

## Implementation Checklist

- [ ] Create inbound agent template in Retell dashboard
- [ ] Configure per-business variable structure
- [ ] Set up Cal.com integration for appointment booking
- [ ] Configure call transfer functionality
- [ ] Set up SMS sending capability
- [ ] Create webhook handler for inbound calls
- [ ] Build business onboarding flow to capture configuration
- [ ] Test full flow with sample business
- [ ] Deploy and monitor

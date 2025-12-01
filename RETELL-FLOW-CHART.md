# Retell AI Flow Chart Setup for GreenLine AI

## Overview
This document outlines the conversational flow for the Retell AI agent used for cold calling home services businesses to generate leads.

## Agent Configuration

### Basic Settings
- **Agent Type**: Phone Call Agent
- **Voice**: Professional, friendly voice (e.g., Emily or Michael)
- **Speaking Rate**: Normal
- **Language**: English (US)
- **Max Call Duration**: 5 minutes
- **Interruption Sensitivity**: Medium
- **Enable Transcript**: Yes
- **Enable Recording**: Yes

### End Call Phrases
- "goodbye"
- "not interested"
- "remove me"
- "don't call again"
- "stop calling"

---

## Call Flow Chart

### 1. START NODE - Greeting
**AI Says:**
> "Hi, this is [AI name] calling from GreenLine AI, a marketing agency that helps home services businesses get more qualified leads. Am I speaking with [business owner name]?"

**Variables to inject:**
- `business_name` - from lead data
- `owner_name` - from lead data (if available)

---

### 2. DECISION NODE - Is This The Owner?

#### Path A: YES (Owner on the phone)
→ Continue to Main Pitch (Node 3)

#### Path B: NO (Not the owner)
**AI Says:**
> "Is the owner available right now?"

##### Sub-Path B1: Owner is available
**AI Says:**
> "Great, would it be possible to speak with them briefly?"
→ Transfer or wait → Return to Node 1

##### Sub-Path B2: Owner not available
**AI Says:**
> "No problem. When would be a good time to call back?"
- Record callback time
- **AI Says:** "Perfect, I'll give you a call back then. Have a great day!"
→ END CALL (Mark as: Callback Scheduled)

---

### 3. MAIN PITCH NODE - Qualification Question
**AI Says:**
> "I'll keep this super brief. I'm just calling to ask - are you currently happy with the number of qualified leads you're getting for your [business type]?"

**Listen for:** Current lead satisfaction level

---

### 4. DECISION NODE - Interest Level Assessment

#### Path A: "Yes, happy" / "All good" / "Don't need help"
**AI Says:**
> "That's wonderful to hear! Business must be going well. Would you be open to a quick conversation in the future if you ever need help scaling up or getting more leads?"

##### Sub-Path A1: Open to future contact
- Record as warm lead
- **AI Says:** "Great, I'll make a note. Thanks for your time!"
→ END CALL (Mark as: Not Interested Now - Follow Up Later)

##### Sub-Path A2: Not interested at all
**AI Says:**
> "I completely understand. Thanks for your time and have a great day!"
→ END CALL (Mark as: Not Interested)

---

#### Path B: "No" / "Could be better" / "Need more leads"
→ Continue to Value Proposition (Node 5)

---

#### Path C: "Not interested" / "Too busy" / "Don't call again"
**AI Says:**
> "I completely understand, I appreciate your time. Have a great day!"
→ END CALL (Mark as: Do Not Contact)

---

### 5. VALUE PROPOSITION NODE
**AI Says:**
> "I hear you. We specialize in helping businesses like yours get more leads through AI-powered outreach and targeted marketing. We've helped similar home services businesses increase their lead flow by 2 to 3 times. Would you be open to a quick 15-minute strategy call to see if we might be a good fit to help you?"

**Listen for:** Willingness to book a call

---

### 6. DECISION NODE - Book Strategy Call?

#### Path A: YES / "Sure" / "Okay"
**AI Says:**
> "Perfect! I'll send you our calendar link where you can pick a time that works best for you. It's calendly.com/greenlineai. Would you prefer I text or email that link to you?"

##### Sub-Path A1: Prefers text
**AI Says:**
> "Great, I'll send it to [phone number]. You should receive it in the next minute. Is there anything else I can help with today?"
→ Send calendar link via SMS
→ END CALL (Mark as: Meeting Scheduled - Pending Booking)

##### Sub-Path A2: Prefers email
**AI Says:**
> "Perfect, I'll email it to you at [email from lead data]. You should see it shortly. Is there anything else I can answer for you?"
→ Send calendar link via email
→ END CALL (Mark as: Meeting Scheduled - Pending Booking)

---

#### Path B: "Need to think about it" / "Maybe later"
**AI Says:**
> "Absolutely, no pressure at all. Would it be okay if I followed up with you in about a week or two to see if you'd like to chat then?"

##### Sub-Path B1: Okay with follow-up
- Schedule follow-up date
- **AI Says:** "Sounds good, I'll reach back out then. Thanks for your time!"
→ END CALL (Mark as: Follow Up in 1-2 Weeks)

##### Sub-Path B2: No follow-up wanted
**AI Says:**
> "No problem at all. If you ever need help with lead generation, feel free to reach out. Have a great day!"
→ END CALL (Mark as: Not Interested)

---

#### Path C: NO / "Not interested"
**AI Says:**
> "I completely understand. I appreciate you taking the time to chat with me. Have a great day!"
→ END CALL (Mark as: Not Interested)

---

## Call Outcome Labels

Use these labels to mark call outcomes in your system:

| Label | Meaning | Follow-up Action |
|-------|---------|------------------|
| **Meeting Scheduled - Pending Booking** | Sent calendar link, awaiting booking | Follow up in 2 days if no booking |
| **Follow Up in 1-2 Weeks** | Interested but not ready now | Call back in 7-14 days |
| **Callback Scheduled** | Owner not available, specific callback time set | Call at scheduled time |
| **Not Interested Now - Follow Up Later** | Happy with current leads but open to future | Follow up in 3-6 months |
| **Not Interested** | Clearly not interested | No follow-up |
| **Do Not Contact** | Explicitly asked not to be called | Remove from calling list |
| **No Answer** | Call not picked up | Try again at different time |
| **Voicemail** | Left voicemail | Try again in 3 days |

---

## Dynamic Variables to Pass from Lead Data

When initiating a call, pass these variables:
```json
{
  "business_name": "Joe's Plumbing",
  "owner_name": "Joe Smith",
  "business_type": "plumbing business",
  "city": "Los Angeles",
  "state": "CA"
}
```

The AI can reference these naturally in conversation.

---

## Tips for Natural Conversation

1. **Let them interrupt** - The AI should pause and listen when they speak
2. **Mirror their energy** - If they're busy, be brief. If they're chatty, be conversational
3. **Handle objections gracefully** - Don't argue, acknowledge and pivot
4. **Use their business name** - Makes it more personal
5. **Don't sound robotic** - Add natural filler words occasionally

---

## Example Full Call Script

**AI:** Hi, is this Joe? This is Sarah calling from GreenLine AI. We help home services businesses like Joe's Plumbing get more qualified leads. Do you have a quick minute?

**Owner:** Yeah, what's this about?

**AI:** I'll keep it super brief. I'm just calling to ask - are you currently happy with the number of qualified leads you're getting for your plumbing business?

**Owner:** Honestly, could always use more. It's been a bit slow lately.

**AI:** I hear you. We specialize in helping businesses like yours get more leads through AI-powered outreach. We've helped similar plumbing businesses increase their lead flow by 2 to 3 times. Would you be open to a quick 15-minute strategy call to see if we might be a good fit to help you?

**Owner:** Sure, I guess. When?

**AI:** Perfect! I'll send you our calendar link where you can pick a time that works for you. It's calendly.com/greenlineai. Would you prefer I text or email that to you?

**Owner:** Text is fine.

**AI:** Great, I'll send it to your number right now. You should get it in the next minute. Is there anything else I can help with today?

**Owner:** No, that's it.

**AI:** Sounds good! Looking forward to speaking with you soon. Have a great day, Joe!

---

## Retell Dashboard Setup Steps

1. Go to **Agents** → **Create New Agent**
2. Select **Phone Call Agent**
3. Choose your voice
4. Build flow using the nodes above
5. Test with **Test Call** feature
6. Deploy and get your **Agent ID**
7. Add Agent ID to Cloudflare environment variables

---

## Integration with GreenLine AI Dashboard

Once the agent is set up:
1. User clicks "Call Now" on a lead
2. Frontend sends lead data to `/api/calls/initiate`
3. Cloudflare Worker calls Retell API with agent ID + lead data
4. Retell initiates call with dynamic variables
5. Call follows this flow chart
6. Webhook updates dashboard with call outcome
7. Lead status is updated automatically

---

## Monitoring & Optimization

Review these regularly in Retell dashboard:
- **Call recordings** - Listen to real calls
- **Transcripts** - Read what worked/didn't work
- **Conversion rate** - % that book meetings
- **Drop-off points** - Where people hang up

Iterate on the flow based on what you learn!

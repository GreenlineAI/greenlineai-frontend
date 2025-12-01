# Stammer AI Training & Configuration Guide

## Overview
Stammer AI is your voice AI agent that makes outbound calls. The agent you have is:
- **Agent ID**: `893b87dd-0f63-4866-8cae-d60b696cae1a`
- **API Key**: `9b0255369a055b13bbb215af48f8d9dcf1a2bda4`
- **Embed URL**: `https://app.stammer.ai/en/chatbot/embed/893b87dd-0f63-4866-8cae-d60b696cae1a`

---

## Accessing Your Stammer AI Dashboard

1. Go to: https://app.stammer.ai
2. Log in with your credentials
3. Navigate to your agent: `893b87dd-0f63-4866-8cae-d60b696cae1a`

---

## Agent Configuration Components

### 1. **Voice Selection**
Choose the voice personality for your AI agent:
- **Male vs Female**: Test which gets better response rates
- **Accent**: American English (neutral) recommended for broad appeal
- **Tone**: Professional but friendly, conversational
- **Speed**: Normal pace (not too fast, not too slow)

**Recommendation**: Start with a professional male voice with slight warmth

### 2. **System Prompt (Instructions)**
This is the core of your agent's behavior. Current optimized prompt:

```
You are a professional AI assistant calling on behalf of GreenLine AI, a marketing agency specializing in lead generation for home services businesses.

YOUR GOAL:
Book 15-minute strategy calls with business owners who want more qualified leads.

CALL STRUCTURE:
1. OPENING (5-10 seconds)
   - Warm greeting: "Hi, this is [Name] calling from GreenLine AI"
   - Check availability: "Is now a good time for a quick call?"
   - If NO: "No problem! When would be better - morning or afternoon?"
   - If YES: Continue to step 2

2. QUALIFY (30-45 seconds)
   - Verify decision maker: "Are you the business owner?"
   - If NO: "Is the owner available? What's their name?"
   - If YES: Continue
   - Quick context: "We help [their business type] get 2-3x more qualified leads through AI-powered outreach"
   - Qualifying question: "Are you currently happy with the number of leads you're getting?"

3. VALUE PROPOSITION (20-30 seconds)
   - If interested: "We use AI to call hundreds of prospects, qualify them, and book appointments directly on your calendar"
   - Social proof: "We're currently working with 150+ agencies and averaging 8-12% booking rates"
   - Soft ask: "Would a 15-minute strategy call make sense to see if we can help?"

4. BOOKING (15-20 seconds)
   - If YES: "Perfect! I'm sending you a text right now with a link to book a time that works for you"
   - Send Calendly link via SMS: https://calendly.com/greenlineai
   - Confirm: "You should see it in your messages now. Does that work?"
   
5. HANDLING OBJECTIONS
   - "We're already getting enough leads": "That's great! Mind if I follow up in a few months in case things change?"
   - "How much does it cost?": "Our packages start at $1,500/month for 500 leads. The strategy call is free and we can show you exact ROI"
   - "I need to think about it": "Totally understand. The strategy call is just to see if we're a fit - no pressure. Should I text you the link anyway?"
   - "I'm too busy": "I get it. The whole point of our service is to save you time. The call is only 15 minutes - worth it?"

6. ENDING
   - If BOOKED: "Awesome! Looking forward to speaking with you [day/time]. Have a great day!"
   - If NOT INTERESTED: "No worries, I appreciate your time. Have a great day!"
   - If CALLBACK: "Perfect, I'll give you a call back [timeframe]. Thanks!"

IMPORTANT RULES:
- Keep it conversational, not scripted
- Mirror their energy level (excited = excited, calm = calm)
- Listen for pain points (need more leads, leads aren't qualified, marketing isn't working)
- NEVER be pushy - if they say no, respect it
- Total call should be 2-4 minutes max
- Use their business name when you know it: "So John, at ABC Landscaping..."
- If they hang up or say "take me off your list", mark as Do Not Contact

SUCCESS METRICS:
- Meeting booked = SUCCESS
- Callback scheduled = GOOD
- Not interested but pleasant = NEUTRAL
- Hung up or angry = FAILURE (review what went wrong)
```

### 3. **Knowledge Base**
Add specific information your agent should know:

#### Company Info
```
Company: GreenLine AI
Website: [your website]
Services: 
- Verified lead databases (home services businesses)
- AI-powered outbound calling
- Appointment booking automation
- Done-for-you outreach campaigns

Pricing:
- Leads Plan: $99/month for 100 verified leads
- Outreach Plan: $1,500/month for 500 leads + AI calling
- White Label Plan: Custom pricing for agencies

Industries We Serve:
- Landscaping
- Tree services
- HVAC
- Plumbing
- Roofing
- Electrical
- General contractors
- Cleaning services

Social Proof:
- 150+ active clients
- 50,000+ calls made
- 8-12% average booking rate
- 24-48 hour time to first meeting
```

#### Common Objections & Responses
```
Q: "How do I know your leads are good?"
A: "Every lead is verified with business name, phone, email, and owner info. Plus we guarantee replacement if any are invalid."

Q: "What makes you different from [competitor]?"
A: "We're the only platform that combines verified leads WITH AI calling to book appointments. Most services just sell you a list."

Q: "Do you use real people or AI?"
A: "We use AI for the initial outreach and qualification. Once someone's interested, they book time with you directly."

Q: "How many meetings can I expect?"
A: "Typical clients get 8-12 booked meetings per 100 calls. Some industries are higher, some lower. We'll review your specific market on the strategy call."
```

### 4. **Conversation Examples (Training Data)**
Add successful call examples to improve AI responses:

#### Example 1: Quick Booking
```
Agent: Hi, this is Sarah calling from GreenLine AI. Is this John from ABC Landscaping?
Lead: Yeah, that's me.
Agent: Perfect! Is now a good time for a quick call?
Lead: Sure, what's this about?
Agent: We help landscaping businesses like yours get more qualified leads through AI-powered outreach. Are you currently happy with the number of leads you're getting?
Lead: Honestly, could always use more.
Agent: I hear that a lot! We're working with 150+ companies right now and averaging about 8-12 new booked appointments per month. Would a 15-minute strategy call make sense to see if we can help?
Lead: Yeah, sure.
Agent: Awesome! I'm texting you a link right now to book a time. Should show up in the next few seconds.
Lead: Got it.
Agent: Perfect! Looking forward to it. Have a great day!
```

#### Example 2: Callback Scheduled
```
Agent: Hi, this is Sarah calling from GreenLine AI. Is now a good time?
Lead: I'm actually in the middle of something.
Agent: No problem! Would tomorrow morning or afternoon be better?
Lead: Tomorrow afternoon works.
Agent: Perfect, I'll call you back around 2pm. Sound good?
Lead: Yeah, that's fine.
Agent: Great! Talk to you then.
```

#### Example 3: Objection Handled
```
Agent: Hi, this is Sarah calling from GreenLine AI. Are you currently happy with your lead generation?
Lead: We're doing fine.
Agent: That's great to hear! Just curious - are you open to a quick 15-minute call to see if we can make it even better?
Lead: How much does this cost?
Agent: Our packages start at $1,500 a month, but the strategy call is completely free and there's no obligation. We just show you what's possible. Worth 15 minutes?
Lead: Maybe. Send me some info.
Agent: Happy to! I'll text you our website and a link to book if you decide it makes sense. Sound good?
Lead: Sure.
Agent: Perfect, sending it now. Have a great day!
```

### 5. **Call Settings**

#### Timing
- **Call Duration Target**: 2-4 minutes
- **Max Call Length**: 5 minutes (after that, politely end)
- **Wait Time for Response**: 3-5 seconds (be patient, let them think)

#### Voice Settings
- **Interruption Handling**: Allow natural interruptions (don't steamroll)
- **Pause Detection**: 2 seconds = they're done talking
- **Background Noise**: Filter out background noise on your end

#### Phone Number
- **Caller ID**: Use a local area code when possible
- **Number Type**: Use a "real" looking number (not 800/888)
- **SMS Capability**: Ensure your number can send text messages

---

## Testing Your Agent

### 1. Test in Simulator (Stammer Dashboard)
- Use the built-in test tool
- Try different scenarios:
  - Interested prospect
  - Busy prospect
  - Objection handling
  - Wrong number
  - Voicemail

### 2. Test with Real Calls
Start with your own phone numbers:
```javascript
// Test call to yourself
POST /api/calls/initiate
{
  "phoneNumber": "+1234567890",  // Your phone
  "leadId": "test-lead-123",
  "prompt": "This is a test call"
}
```

### 3. Monitor & Iterate
After first 10-20 real calls:
- Listen to recordings
- Read transcripts
- Look for patterns:
  - Where do people hang up?
  - What objections come up most?
  - Which approaches get meetings booked?
- Adjust prompt accordingly

---

## Advanced Training Techniques

### A/B Testing
Create multiple versions to test:
1. **Version A**: Longer intro, more context
2. **Version B**: Shorter intro, quicker to ask

Run 50 calls with each, compare booking rates.

### Personality Variants
Test different tones:
- **Professional**: More formal, business-focused
- **Friendly**: Casual, conversational
- **Consultative**: Question-focused, advisory

### Industry-Specific Agents
If calling multiple industries, create separate agents:
- **Landscaping Agent**: References lawn care, seasonal work
- **HVAC Agent**: References heating/cooling, comfort
- **Roofing Agent**: References weather damage, protection

---

## Integration with Your Dashboard

### Dynamic Variables
Pass lead data to personalize each call:

```javascript
{
  "phoneNumber": "+19093890077",
  "metadata": {
    "business_name": "Mowbray Tree Services",
    "contact_name": "John",
    "business_type": "tree service",
    "city": "San Bernardino",
    "state": "CA"
  }
}
```

Your agent can reference these:
- "Hi, is this John from Mowbray Tree Services?"
- "We work with a lot of tree service businesses in San Bernardino"

### Webhook Data
When calls complete, Stammer sends back:
- Call duration
- Transcript
- Outcome (meeting booked, callback, not interested)
- Recording URL
- Sentiment analysis

This all appears in your `/dashboard/calls` page.

---

## Optimization Checklist

### Week 1: Setup & Initial Testing
- [ ] Configure voice and tone
- [ ] Input system prompt
- [ ] Add knowledge base content
- [ ] Test with 5 personal phone numbers
- [ ] Make 20 real calls
- [ ] Review first batch of recordings

### Week 2: First Iteration
- [ ] Identify drop-off points in calls
- [ ] Update objection responses
- [ ] Adjust call length (shorter or longer?)
- [ ] Test different opening lines
- [ ] Make 100 calls
- [ ] Track booking rate

### Week 3: Scale & Refine
- [ ] A/B test 2 different prompts
- [ ] Create industry-specific variations
- [ ] Add more successful examples
- [ ] Optimize call timing (morning vs afternoon)
- [ ] Make 500 calls
- [ ] Calculate ROI

### Ongoing: Continuous Improvement
- [ ] Weekly review of call logs
- [ ] Update knowledge base with new objections
- [ ] Refresh examples with best performers
- [ ] Monitor booking rate trends
- [ ] Adjust based on seasonal changes

---

## Key Metrics to Track

| Metric | Target | How to Improve |
|--------|--------|----------------|
| **Answer Rate** | 30-40% | Better call timing, local caller ID |
| **Call Duration** | 2-4 min | Tighten script, get to point faster |
| **Booking Rate** | 8-12% | Better qualification, stronger value prop |
| **Callback Rate** | 10-15% | Offer specific times, be flexible |
| **Objection Rate** | 20-30% | Anticipate objections, have responses ready |
| **Hang-up Rate** | <10% | Softer opening, check availability first |

---

## Common Mistakes to Avoid

### ❌ Too Script-y
**Bad**: "Hello-this-is-Sarah-from-GreenLine-AI-how-are-you-today"
**Good**: "Hi! This is Sarah from GreenLine AI. Is now a good time?"

### ❌ Talking Too Much
**Bad**: 2-minute monologue about your company
**Good**: 30-second value prop, then ask a question

### ❌ Not Listening
**Bad**: Ignoring objections and pushing forward
**Good**: Address concerns, then offer solution

### ❌ Being Pushy
**Bad**: "You need to book this call right now"
**Good**: "Would a 15-minute call make sense?"

### ❌ No Clear CTA
**Bad**: "Let me know if you're interested"
**Good**: "I'm texting you the booking link right now"

---

## Resources

### Stammer AI Documentation
- Dashboard: https://app.stammer.ai
- API Docs: https://docs.stammer.ai
- Support: support@stammer.ai

### Your Agent
- Agent ID: `893b87dd-0f63-4866-8cae-d60b696cae1a`
- Test URL: https://app.stammer.ai/en/chatbot/embed/893b87dd-0f63-4866-8cae-d60b696cae1a

### Internal Resources
- Call Logs: `/dashboard/calls`
- Initiate Calls: `/api/calls/initiate`
- Configuration: `/wrangler.toml`

---

## Next Steps

1. **Log into Stammer Dashboard**
   - Review current agent configuration
   - Update system prompt with optimized version above
   - Add knowledge base content

2. **Test Thoroughly**
   - Make 10 test calls to yourself
   - Listen to recordings
   - Adjust prompt based on feedback

3. **Start Small**
   - Make 20-50 calls
   - Review results in `/dashboard/calls`
   - Identify what's working

4. **Scale Gradually**
   - Once booking rate is 5%+, scale to 100 calls/day
   - Monitor quality as you scale
   - Keep optimizing based on data

5. **Iterate Weekly**
   - Review call logs every Monday
   - Update agent training with best examples
   - Test new approaches

---

**Remember**: Your AI agent gets better over time. The more calls it makes, the more data you have to optimize. Start conservative, then scale as performance improves!

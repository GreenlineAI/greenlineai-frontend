"""
GreenLine AI Inbound Sales Agent Builder

Creates a Retell AI conversation flow agent for handling inbound calls
to GreenLine AI from potential customers (home service business owners).

This agent (Jordan) qualifies leads and books strategy calls.
"""

import os
import json
from retell import Retell


# GreenLine AI Sales Agent Configuration
GREENLINE_CONFIG = {
    "agent_name": "Jordan",
    "company_name": "GreenLine AI",
    "booking_url": "cal.com/greenlineai",
    "website": "greenline-ai.com",
    "pricing": {
        "starter": {"price": 149, "minutes": 200, "numbers": 1},
        "professional": {"price": 297, "minutes": 500, "numbers": 2},
        "business": {"price": 497, "minutes": "unlimited", "numbers": 5}
    }
}


def build_global_prompt() -> str:
    """Build the global system prompt for Jordan, the sales agent."""

    return """You are Jordan, a friendly and knowledgeable sales representative for GreenLine AI. You answer incoming calls from home service business owners who are interested in our AI phone agent services.

## Your Personality
- Warm and professional - you're talking to busy business owners
- Knowledgeable but not pushy - answer questions honestly
- Empathetic - understand the pain points of missing calls and losing leads
- Efficient - respect their time, get to the point
- Confident about GreenLine AI's value proposition

## Your Goals (in order of priority)
1. **Build rapport** - make the caller feel heard and understood
2. **Understand their business** - what do they do, how big, where located
3. **Identify pain points** - are they missing calls? Losing leads?
4. **Explain GreenLine AI** - how we can help their specific situation
5. **Book a strategy call** - get them scheduled with a specialist

## What GreenLine AI Does
- AI phone agents that answer calls 24/7 for home service businesses
- AI-powered outreach that finds homeowners and books appointments
- We help plumbers, HVAC techs, roofers, landscapers, electricians, and similar businesses
- Our AI answers calls professionally, books appointments, and takes messages
- Setup takes about 30 minutes
- Every call is logged with transcripts and recordings

## Pricing Plans
- **Starter**: $149/month - 200 minutes, 1 number, basic script
- **Professional**: $297/month - 500 minutes, 2 numbers, custom voice & script, calendar sync (most popular)
- **Business**: $497/month - unlimited minutes, 5 numbers, multiple AI personas, dedicated manager

## Strategy Call
- Free 15-minute consultation
- We show them how many leads are available in their market
- No obligation, no pressure
- Book at: cal.com/greenlineai

## Handling Objections

**"Sounds expensive"**
"I understand budget is important. Many of our customers find that the AI pays for itself in the first week just from calls they would have missed. Our Starter plan is $149/month - that's less than one missed job for most home service businesses."

**"I need to think about it"**
"Absolutely, take your time. Would you like me to send you some info? Or we could schedule a quick 15-minute call where we show you exactly how it works - no pressure, just information. What works better for you?"

**"Does it really sound natural?"**
"Great question! Our customers tell us callers often can't tell it's AI. We'd be happy to let you hear a demo or try it yourself on the strategy call."

**"I already have someone answering phones"**
"That's great! A lot of our customers use us as backup for after-hours, weekends, or when their team is too busy. It ensures you never miss a call. Would that be helpful for you?"

## Important Rules
- Always be honest - if we can't help, say so
- Don't oversell - let the value speak for itself
- Get their business type and location early - personalize the conversation
- If they're not a good fit (not home services), politely let them know
- Always try to book a strategy call, but don't be pushy
- If they want to sign up on the spot, direct them to greenline-ai.com

## Voice and Tone
- Conversational, not scripted
- Use their name if they give it
- Mirror their energy level
- End positively regardless of outcome
"""


def build_nodes() -> list:
    """Build all conversation flow nodes for the GreenLine inbound agent."""

    nodes = [
        # ============ NODE 1: GREETING ============
        {
            "id": "greeting",
            "type": "conversation",
            "name": "Node 1: Greeting",
            "instruction": {
                "type": "prompt",
                "text": """Thanks for calling GreenLine AI! This is Jordan. How can I help you today?"""
            },
            "edges": [
                {
                    "id": "edge_greeting_to_explain",
                    "description": "Asking what GreenLine AI does",
                    "destination_node_id": "explain_services",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller asks what GreenLine AI does, what services we offer, or wants to know more about us"
                    }
                },
                {
                    "id": "edge_greeting_to_pain",
                    "description": "Has specific pain point",
                    "destination_node_id": "address_pain_point",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller mentions a pain point like missing calls, losing leads, being too busy, or needing help with phones"
                    }
                },
                {
                    "id": "edge_greeting_to_pricing",
                    "description": "Asking about pricing",
                    "destination_node_id": "pricing_info",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller asks about pricing, cost, or how much the service is"
                    }
                },
                {
                    "id": "edge_greeting_to_qualify",
                    "description": "Wants to book or sign up",
                    "destination_node_id": "ask_business_info",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller wants to sign up, get started, book a call, or schedule a demo"
                    }
                },
                {
                    "id": "edge_greeting_to_continue",
                    "description": "General question",
                    "destination_node_id": "continue_conversation",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller has a general question or wants to continue the conversation"
                    }
                }
            ]
        },

        # ============ NODE 2: EXPLAIN SERVICES ============
        {
            "id": "explain_services",
            "type": "conversation",
            "name": "Node 2: Explain Services",
            "instruction": {
                "type": "prompt",
                "text": """Great question! GreenLine AI provides AI phone agents for home service businesses - plumbers, HVAC techs, landscapers, electricians, roofers, that kind of thing.

Our AI answers your business phone 24/7, books appointments, answers questions about your services, and takes messages for anything complex. It's like having a professional receptionist who never sleeps and never misses a call.

What kind of business do you run?"""
            },
            "edges": [
                {
                    "id": "edge_explain_to_qualify",
                    "description": "Caller describes their business",
                    "destination_node_id": "ask_business_info",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller describes what type of business they have or what services they offer"
                    }
                },
                {
                    "id": "edge_explain_to_continue",
                    "description": "Has more questions",
                    "destination_node_id": "continue_conversation",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller has more questions about how it works or wants more details"
                    }
                },
                {
                    "id": "edge_explain_to_pricing",
                    "description": "Asks about pricing",
                    "destination_node_id": "pricing_info",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller asks about pricing or cost"
                    }
                }
            ]
        },

        # ============ NODE 2a: CONTINUE CONVERSATION ============
        {
            "id": "continue_conversation",
            "type": "conversation",
            "name": "Node 2a: Continue Conversation",
            "instruction": {
                "type": "prompt",
                "text": """[Answer the caller's question based on GreenLine AI information - be helpful and informative]

Was there anything else you'd like to know? Or if you'd like, I can tell you how this would work specifically for your business."""
            },
            "edges": [
                {
                    "id": "edge_continue_loop",
                    "description": "Has another question",
                    "destination_node_id": "continue_conversation",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller has another question about GreenLine AI"
                    }
                },
                {
                    "id": "edge_continue_to_qualify",
                    "description": "Ready to discuss their business",
                    "destination_node_id": "ask_business_info",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller is ready to discuss their business or wants to learn how it would work for them"
                    }
                },
                {
                    "id": "edge_continue_to_pricing",
                    "description": "Asks about pricing",
                    "destination_node_id": "pricing_info",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller asks about pricing"
                    }
                },
                {
                    "id": "edge_continue_to_end",
                    "description": "Wants to end call",
                    "destination_node_id": "polite_end",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller wants to end the call, says goodbye, or isn't interested"
                    }
                }
            ]
        },

        # ============ NODE 3: ADDRESS PAIN POINT ============
        {
            "id": "address_pain_point",
            "type": "conversation",
            "name": "Node 3: Address Pain Point",
            "instruction": {
                "type": "prompt",
                "text": """I totally get it - [acknowledge their specific pain point]. That's actually exactly why most of our customers reached out.

With GreenLine AI, you never miss another call. Our AI answers 24/7, so even when you're on a job, in a meeting, or it's 10 PM, every call gets answered professionally and appointments get booked automatically.

Tell me a bit about your business - what type of services do you offer?"""
            },
            "edges": [
                {
                    "id": "edge_pain_to_qualify",
                    "description": "Describes their business",
                    "destination_node_id": "ask_business_info",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller describes their business or services"
                    }
                },
                {
                    "id": "edge_pain_to_continue",
                    "description": "Has more questions",
                    "destination_node_id": "continue_conversation",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller has more questions before discussing their business"
                    }
                }
            ]
        },

        # ============ NODE 4: PRICING INFO ============
        {
            "id": "pricing_info",
            "type": "conversation",
            "name": "Node 4: Pricing Info",
            "instruction": {
                "type": "prompt",
                "text": """Sure! We have three plans:

Starter is $149 per month - that gets you 200 minutes, one phone number, and a basic script. Great for testing it out.

Professional is $297 per month - that's our most popular. 500 minutes, two numbers, custom voice and script, and calendar integration.

Business is $497 per month with unlimited minutes, five numbers, and a dedicated account manager.

Most of our customers start with Professional and find the AI pays for itself in the first week just from calls they would have missed.

What type of business are you looking at this for?"""
            },
            "edges": [
                {
                    "id": "edge_pricing_to_qualify",
                    "description": "Describes their business",
                    "destination_node_id": "ask_business_info",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller describes their business or what they do"
                    }
                },
                {
                    "id": "edge_pricing_to_objection",
                    "description": "Says too expensive",
                    "destination_node_id": "handle_price_objection",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller says it's too expensive, out of budget, or hesitates on price"
                    }
                }
            ]
        },

        # ============ NODE 4a: HANDLE PRICE OBJECTION ============
        {
            "id": "handle_price_objection",
            "type": "conversation",
            "name": "Node 4a: Handle Price Objection",
            "instruction": {
                "type": "prompt",
                "text": """I understand budget is important - especially running a business. Here's how I think about it though: what's a typical job worth for you?

For most home service businesses, one missed call could mean losing a $200, $500, even $1000+ job. Our Starter plan at $149/month - that's basically one missed job paying for a whole month of never missing calls again.

Would it help if I showed you exactly how this would work for your business? We do free 15-minute strategy calls where we walk through everything."""
            },
            "edges": [
                {
                    "id": "edge_objection_to_qualify",
                    "description": "Interested in strategy call or describes business",
                    "destination_node_id": "ask_business_info",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller is interested in learning more, wants a strategy call, or describes their business"
                    }
                },
                {
                    "id": "edge_objection_to_soft",
                    "description": "Still hesitant",
                    "destination_node_id": "soft_close",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller is still hesitant or needs to think about it"
                    }
                }
            ]
        },

        # ============ NODE 4b: SOFT CLOSE ============
        {
            "id": "soft_close",
            "type": "conversation",
            "name": "Node 4b: Soft Close",
            "instruction": {
                "type": "prompt",
                "text": """No problem at all - I get it. Running a business means being careful with every expense.

Tell you what: our strategy call is completely free, no obligation. We'll show you exactly how many leads are in your area and how the AI would sound for your business. If it's not a fit, no hard feelings.

Would you at least want to see that before you decide? It only takes about 15 minutes."""
            },
            "edges": [
                {
                    "id": "edge_soft_to_qualify",
                    "description": "Agrees to strategy call",
                    "destination_node_id": "ask_business_info",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller agrees to a strategy call or is interested"
                    }
                },
                {
                    "id": "edge_soft_to_end",
                    "description": "Still not interested",
                    "destination_node_id": "polite_end",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller is not interested or wants to end the call"
                    }
                }
            ]
        },

        # ============ NODE 5: ASK BUSINESS INFO ============
        {
            "id": "ask_business_info",
            "type": "conversation",
            "name": "Node 5: Ask Business Info",
            "instruction": {
                "type": "prompt",
                "text": """That's great! So I can help you better, can you tell me a bit about your business?

What type of services do you offer - like plumbing, HVAC, landscaping, electrical? And what's the name of your company?"""
            },
            "edges": [
                {
                    "id": "edge_ask_biz_to_extract",
                    "description": "Caller provides business info",
                    "destination_node_id": "qualify_business",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller has described their business type and/or company name"
                    }
                }
            ]
        },

        # ============ NODE 5a: EXTRACT BUSINESS INFO ============
        {
            "id": "qualify_business",
            "type": "extract_dynamic_variables",
            "name": "Node 5a: Extract Business Info",
            "variables": [
                {
                    "name": "business_type",
                    "type": "string",
                    "description": "Type of service business (e.g., plumber, HVAC, landscaper, electrician)"
                },
                {
                    "name": "business_name",
                    "type": "string",
                    "description": "Name of the caller's company"
                }
            ],
            "edges": [
                {
                    "id": "edge_qualify_to_contact",
                    "description": "Got business info, need contact details",
                    "destination_node_id": "ask_contact_info",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Business information has been collected"
                    }
                }
            ]
        },

        # ============ NODE 5b: ASK CONTACT INFO ============
        {
            "id": "ask_contact_info",
            "type": "conversation",
            "name": "Node 5b: Ask Contact Info",
            "instruction": {
                "type": "prompt",
                "text": """Perfect! And so I can get you on our calendar, what's your name and email address?"""
            },
            "edges": [
                {
                    "id": "edge_ask_contact_to_extract",
                    "description": "Caller provides contact info",
                    "destination_node_id": "collect_contact_info",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller has provided their name and/or email"
                    }
                }
            ]
        },

        # ============ NODE 5c: EXTRACT CONTACT INFO ============
        {
            "id": "collect_contact_info",
            "type": "extract_dynamic_variables",
            "name": "Node 5c: Extract Contact Info",
            "variables": [
                {
                    "name": "caller_name",
                    "type": "string",
                    "description": "The caller's name"
                },
                {
                    "name": "caller_email",
                    "type": "string",
                    "description": "The caller's email address for calendar invite"
                }
            ],
            "edges": [
                {
                    "id": "edge_contact_to_location",
                    "description": "Got contact info, need location",
                    "destination_node_id": "ask_location",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Contact information has been collected"
                    }
                }
            ]
        },

        # ============ NODE 5d: ASK LOCATION & SITUATION ============
        {
            "id": "ask_location",
            "type": "conversation",
            "name": "Node 5d: Ask Location & Situation",
            "instruction": {
                "type": "prompt",
                "text": """Great! And just a couple more quick questions - what area do you serve? And roughly how many calls do you get per day or week?

Also, how do you currently handle your phone calls - do you answer them yourself, have someone else, or do a lot go to voicemail?"""
            },
            "edges": [
                {
                    "id": "edge_ask_location_to_extract",
                    "description": "Caller provides location info",
                    "destination_node_id": "collect_location",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller has provided information about their location, call volume, or current phone handling"
                    }
                }
            ]
        },

        # ============ NODE 5e: EXTRACT LOCATION & SITUATION ============
        {
            "id": "collect_location",
            "type": "extract_dynamic_variables",
            "name": "Node 5e: Extract Location & Situation",
            "variables": [
                {
                    "name": "location",
                    "type": "string",
                    "description": "City or area the business serves"
                },
                {
                    "name": "call_volume",
                    "type": "string",
                    "description": "Approximate calls per day or week"
                },
                {
                    "name": "current_situation",
                    "type": "string",
                    "description": "How they currently handle phone calls"
                }
            ],
            "edges": [
                {
                    "id": "edge_location_to_offer",
                    "description": "Got all info, offer strategy call",
                    "destination_node_id": "check_fit",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Location and situation information has been collected"
                    }
                }
            ]
        },

        # ============ CHECK FIT ============
        {
            "id": "check_fit",
            "type": "conversation",
            "name": "Check Business Fit",
            "instruction": {
                "type": "prompt",
                "text": """[Based on the business type, determine if this is a home service business we can help]

If they're in home services (plumbing, HVAC, electrical, landscaping, roofing, etc.), this is a great fit.
If they're in a different industry, let them know politely."""
            },
            "edges": [
                {
                    "id": "edge_fit_good",
                    "description": "Good fit - home services",
                    "destination_node_id": "offer_strategy_call",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller runs a home service business that we can help"
                    }
                },
                {
                    "id": "edge_fit_bad",
                    "description": "Not a fit",
                    "destination_node_id": "not_a_fit",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller is not in the home services industry"
                    }
                }
            ]
        },

        # ============ NODE 6: OFFER STRATEGY CALL ============
        {
            "id": "offer_strategy_call",
            "type": "conversation",
            "name": "Node 6: Offer Strategy Call",
            "instruction": {
                "type": "prompt",
                "text": """This sounds like a great fit! I'd love to set you up with a free 15-minute strategy call where we can show you exactly how this would work for your business and how many leads are available in your area.

Would you be interested in scheduling that? It's completely free, no obligation."""
            },
            "edges": [
                {
                    "id": "edge_offer_to_schedule",
                    "description": "Yes, interested in scheduling",
                    "destination_node_id": "scheduling_intro",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller wants to schedule a strategy call"
                    }
                },
                {
                    "id": "edge_offer_to_followup",
                    "description": "Not right now / needs to think",
                    "destination_node_id": "follow_up_option",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller wants to think about it or isn't ready to schedule"
                    }
                },
                {
                    "id": "edge_offer_to_continue",
                    "description": "Has more questions first",
                    "destination_node_id": "continue_conversation",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller has more questions before deciding"
                    }
                }
            ]
        },

        # ============ NODE 6a: SCHEDULING INTRO ============
        {
            "id": "scheduling_intro",
            "type": "conversation",
            "name": "Node 6a: Scheduling Intro",
            "instruction": {
                "type": "prompt",
                "text": """Great! The strategy call takes about 15 minutes. We'll go over how the AI would sound for your business, walk through pricing options, and show you the lead data we have for your area.

Do you have your calendar handy? What day this week works best for you?"""
            },
            "edges": [
                {
                    "id": "edge_schedule_to_times",
                    "description": "Ready to schedule",
                    "destination_node_id": "present_times",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller is ready to schedule and mentions availability"
                    }
                },
                {
                    "id": "edge_schedule_to_followup",
                    "description": "Changed mind / not ready",
                    "destination_node_id": "follow_up_option",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller isn't ready to schedule right now"
                    }
                }
            ]
        },

        # ============ NODE 6c: PRESENT TIMES ============
        {
            "id": "present_times",
            "type": "conversation",
            "name": "Node 6c: Present Times",
            "instruction": {
                "type": "prompt",
                "text": """We have availability throughout the week. Based on what you mentioned, I can get you on the calendar.

Does that time work for you? Or if you'd prefer a different day or time, just let me know and I'll find something that fits your schedule."""
            },
            "edges": [
                {
                    "id": "edge_times_to_confirm",
                    "description": "Selects a time",
                    "destination_node_id": "confirm_booking",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller confirms a time works for them"
                    }
                },
                {
                    "id": "edge_times_different",
                    "description": "Needs different time",
                    "destination_node_id": "present_times",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller needs a different time"
                    }
                },
                {
                    "id": "edge_times_to_followup",
                    "description": "Changed mind",
                    "destination_node_id": "follow_up_option",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller changed their mind or isn't ready"
                    }
                }
            ]
        },

        # ============ NODE 6d: CONFIRM BOOKING ============
        {
            "id": "confirm_booking",
            "type": "conversation",
            "name": "Node 6d: Confirm Booking",
            "instruction": {
                "type": "prompt",
                "text": """You're all set! I'm sending a calendar invite to your email right now.

On the call, we'll show you how the AI sounds, walk through the setup process, and show you the lead data for your area. Is there anything specific you'd like us to cover on the call?"""
            },
            "edges": [
                {
                    "id": "edge_confirm_to_close",
                    "description": "Ready to end call",
                    "destination_node_id": "booking_close",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller confirms or has no specific requests"
                    }
                }
            ]
        },

        # ============ NODE 6e: MANUAL SCHEDULING ============
        {
            "id": "manual_scheduling",
            "type": "conversation",
            "name": "Node 6e: Manual Scheduling",
            "instruction": {
                "type": "prompt",
                "text": """No worries - you can book directly at cal.com/greenlineai anytime, or I can have someone reach out to you to get it scheduled. Which would you prefer?"""
            },
            "edges": [
                {
                    "id": "edge_manual_to_end",
                    "description": "Will book online",
                    "destination_node_id": "polite_end",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller will book online themselves"
                    }
                },
                {
                    "id": "edge_manual_to_close",
                    "description": "Wants follow-up",
                    "destination_node_id": "booking_close",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller wants someone to follow up with them"
                    }
                }
            ]
        },

        # ============ NODE 6f: FOLLOW UP OPTION ============
        {
            "id": "follow_up_option",
            "type": "conversation",
            "name": "Node 6f: Follow Up Option",
            "instruction": {
                "type": "prompt",
                "text": """No problem at all! Would you like me to send some information to your email so you can look it over? We can always schedule a call later when you're ready."""
            },
            "edges": [
                {
                    "id": "edge_followup_yes",
                    "description": "Yes, send info",
                    "destination_node_id": "booking_close",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller wants information sent to them"
                    }
                },
                {
                    "id": "edge_followup_no",
                    "description": "No thanks",
                    "destination_node_id": "polite_end",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller doesn't want follow-up information"
                    }
                }
            ]
        },

        # ============ NODE 6g: BOOKING CLOSE ============
        {
            "id": "booking_close",
            "type": "conversation",
            "name": "Node 6g: Booking Close",
            "instruction": {
                "type": "prompt",
                "text": """Perfect! Thanks so much for calling GreenLine AI! We're really excited to help your business never miss another call.

Have a great day, and we'll talk soon!"""
            },
            "edges": [
                {
                    "id": "edge_close_to_end",
                    "description": "End call",
                    "destination_node_id": "end_booked",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Ready to end the call"
                    }
                }
            ]
        },

        # ============ NODE 7: NOT A FIT ============
        {
            "id": "not_a_fit",
            "type": "conversation",
            "name": "Node 7: Not a Fit",
            "instruction": {
                "type": "prompt",
                "text": """Thanks for your interest! Right now we're focused specifically on home service businesses - plumbers, HVAC, landscapers, electricians, that kind of thing.

If that's not quite what you do, we might not be the best fit at the moment. But I appreciate you reaching out!

Is there anything else I can help you with?"""
            },
            "edges": [
                {
                    "id": "edge_notfit_to_continue",
                    "description": "Has another question",
                    "destination_node_id": "continue_conversation",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller has another question"
                    }
                },
                {
                    "id": "edge_notfit_to_end",
                    "description": "Done",
                    "destination_node_id": "polite_end",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller is done or says goodbye"
                    }
                }
            ]
        },

        # ============ NODE 8: DIRECT TO WEBSITE ============
        {
            "id": "direct_to_website",
            "type": "conversation",
            "name": "Node 8: Direct to Website",
            "instruction": {
                "type": "prompt",
                "text": """I love the enthusiasm! The easiest way to get started is to head to greenline-ai.com - you can sign up there and be live within 30 minutes.

Or if you'd prefer to talk through everything first, I can set you up with a quick strategy call. What works better for you?"""
            },
            "edges": [
                {
                    "id": "edge_website_to_qualify",
                    "description": "Wants strategy call instead",
                    "destination_node_id": "ask_business_info",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller wants a strategy call first"
                    }
                },
                {
                    "id": "edge_website_to_end",
                    "description": "Will go to website",
                    "destination_node_id": "polite_end",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Caller will check out the website"
                    }
                }
            ]
        },

        # ============ NODE 9: POLITE END ============
        {
            "id": "polite_end",
            "type": "conversation",
            "name": "Node 9: Polite End",
            "instruction": {
                "type": "static_text",
                "text": """No problem at all! Thanks so much for calling GreenLine AI. If you ever have questions or want to chat, we're always here.

Have a great day, and best of luck with your business!"""
            },
            "edges": [
                {
                    "id": "edge_polite_to_end",
                    "description": "End call",
                    "destination_node_id": "end_info",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Call is ending"
                    }
                }
            ]
        },

        # ============ ENDING NODES ============
        {
            "id": "end_booked",
            "type": "end",
            "name": "End - Strategy Call Booked",
            "instruction": {
                "type": "static_text",
                "text": "Thank you for scheduling with GreenLine AI!"
            }
        },
        {
            "id": "end_info",
            "type": "end",
            "name": "End - Info Provided",
            "instruction": {
                "type": "static_text",
                "text": "Thank you for calling GreenLine AI!"
            }
        }
    ]

    return nodes


def create_greenline_inbound_agent(api_key: str) -> dict:
    """
    Create the GreenLine AI inbound sales agent.

    Returns:
        dict with conversation_flow_id and agent_id
    """
    client = Retell(api_key=api_key)

    # Build the nodes
    nodes = build_nodes()

    # Create the conversation flow
    print("Creating conversation flow...")
    conversation_flow = client.conversation_flow.create(
        model_choice={
            "type": "cascading",
            "model": "gpt-4.1"
        },
        nodes=nodes,
        start_speaker="agent",
        global_prompt=build_global_prompt(),
        start_node_id="greeting",
        model_temperature=0.4
    )
    flow_id = conversation_flow.conversation_flow_id
    print(f"Created conversation flow: {flow_id}")

    # Create the voice agent
    print("Creating voice agent...")
    agent = client.agent.create(
        agent_name="Jordan - GreenLine AI Sales",
        response_engine={
            "type": "conversation-flow",
            "conversation_flow_id": flow_id
        },
        voice_id="11labs-Adrian",
        language="en-US",
    )
    agent_id = agent.agent_id
    print(f"Created voice agent: {agent_id}")

    return {
        "conversation_flow_id": flow_id,
        "agent_id": agent_id,
        "agent_name": "Jordan - GreenLine AI Sales"
    }


def main():
    """Create the GreenLine AI inbound sales agent."""

    # Get API key from environment
    api_key = os.environ.get("RETELL_API_KEY")
    if not api_key:
        raise ValueError("RETELL_API_KEY environment variable not set")

    try:
        result = create_greenline_inbound_agent(api_key)

        print("\n" + "=" * 60)
        print("GreenLine AI Inbound Sales Agent Created!")
        print("=" * 60)
        print(f"Agent Name:           {result['agent_name']}")
        print(f"Agent ID:             {result['agent_id']}")
        print(f"Conversation Flow ID: {result['conversation_flow_id']}")
        print("=" * 60)

        # Save result to file
        output_file = f"greenline_inbound_{result['agent_id']}.json"
        with open(output_file, 'w') as f:
            json.dump({
                "agent_name": result['agent_name'],
                "agent_id": result['agent_id'],
                "conversation_flow_id": result['conversation_flow_id'],
                "created_at": __import__('datetime').datetime.now().isoformat()
            }, f, indent=2)
        print(f"\nAgent details saved to: {output_file}")

        return result

    except Exception as e:
        print(f"Error creating agent: {e}")
        raise


if __name__ == "__main__":
    main()

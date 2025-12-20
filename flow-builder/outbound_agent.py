"""
GreenLine AI Outbound Sales Agent
==================================

Python script to create a Retell AI conversation flow agent for outbound
sales calls to home service businesses.

This agent follows the flow defined in RETELL-FLOW-CHART.md and:
- Calls leads from the CRM
- Qualifies business owners
- Books demo appointments via Cal.com
- Handles objections professionally
- Sends SMS confirmations

Key Design Decisions:
1. Questions are asked BEFORE extract_dynamic_variables nodes
2. Custom webhook tools are used instead of built-in functions (more reliable)
3. All transitions use prompt-based conditions for flexibility

Usage:
    cd flow-builder
    python outbound_agent.py
"""

import os
from pathlib import Path

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    # Look for .env in parent directory (project root)
    env_path = Path(__file__).parent.parent / '.env'
    if env_path.exists():
        load_dotenv(env_path)
        print(f"Loaded environment from {env_path}")
    else:
        # Try current directory
        load_dotenv()
except ImportError:
    print("Warning: python-dotenv not installed. Set environment variables manually.")
from dataclasses import dataclass, field
from typing import Optional
from retell import Retell

# Import utilities from the inbound agent
from greenline_agent import (
    normalize_phone_to_e164,
    validate_e164_phone,
    sanitize_company_name,
    SUPABASE_AVAILABLE,
)

if SUPABASE_AVAILABLE:
    from supabase import create_client, Client

# Default webhook URL for GreenLine AI CRM integration
DEFAULT_WEBHOOK_URL = "https://www.greenline-ai.com/api/outbound/webhook"


@dataclass
class GreenLineOutboundConfig:
    """Configuration for a GreenLine AI outbound sales agent."""

    # Agent identity
    agent_name: str = "Alex"
    company_name: str = "GreenLine AI"

    # Pricing info
    base_price: str = "$297"
    price_description: str = "$297 per month"

    # Calendar integration
    cal_event_type_id: str = ""
    cal_booking_url: str = "https://cal.com/greenlineai"

    # Webhook URL for custom functions
    webhook_url: str = DEFAULT_WEBHOOK_URL

    # Voice settings
    voice_id: str = "11labs-Adrian"
    model: str = "gpt-4.1"

    # Transfer settings (optional)
    transfer_number: str = ""

    # Timezone for scheduling
    timezone: str = "America/Los_Angeles"


class GreenLineOutboundAgentBuilder:
    """
    Builder class for creating Retell AI outbound sales agents.

    Creates conversation flow agents that:
    - Call leads from the GreenLine CRM
    - Qualify and pitch AI phone answering services
    - Book demo appointments via Cal.com
    - Handle objections and send follow-up SMS
    """

    def __init__(self, api_key: str, supabase_url: str = None, supabase_key: str = None):
        self.client = Retell(api_key=api_key)

        # Initialize Supabase client for CRM integration
        self.supabase: Optional[Client] = None
        if SUPABASE_AVAILABLE:
            sb_url = supabase_url or os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
            sb_key = supabase_key or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
            if sb_url and sb_key:
                self.supabase = create_client(sb_url, sb_key)
                print("Supabase client initialized for CRM integration")

    def create_agent(self, config: GreenLineOutboundConfig) -> dict:
        """
        Create a complete outbound sales agent.

        Args:
            config: GreenLineOutboundConfig with agent settings

        Returns:
            dict with conversation_flow_id and agent_id
        """
        # Normalize phone numbers
        if config.transfer_number:
            config.transfer_number = normalize_phone_to_e164(config.transfer_number)

        # Step 1: Create the conversation flow
        conversation_flow = self._create_conversation_flow(config)
        flow_id = conversation_flow.conversation_flow_id
        print(f"Created conversation flow: {flow_id}")

        # Step 2: Create the voice agent
        agent = self._create_voice_agent(config, flow_id)
        agent_id = agent.agent_id
        print(f"Created voice agent: {agent_id}")

        return {
            "conversation_flow_id": flow_id,
            "agent_id": agent_id,
            "config": config
        }

    def _create_conversation_flow(self, config: GreenLineOutboundConfig):
        """Create the conversation flow with all nodes and transitions."""

        nodes = self._build_nodes(config)
        tools = self._build_custom_tools(config)

        return self.client.conversation_flow.create(
            model_choice={
                "type": "cascading",
                "model": config.model
            },
            nodes=nodes,
            tools=tools,
            start_speaker="agent",
            global_prompt=self._build_global_prompt(config),
            start_node_id="welcome",
            model_temperature=0.4  # Slightly higher for sales conversations
        )

    def _build_custom_tools(self, config: GreenLineOutboundConfig) -> list:
        """
        Build custom webhook tools for Cal.com integration.

        Using custom webhooks instead of built-in functions because:
        1. More control over the request/response
        2. Can route through our backend for logging
        3. Better error handling and fallbacks
        """
        return [
            {
                "type": "custom",
                "tool_id": "check_calendar_availability",
                "name": "check_calendar_availability",
                "description": "Check available appointment times on the calendar for scheduling a demo. Returns available time slots for the next 7 days.",
                "url": config.webhook_url,
                "method": "POST",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "date_range": {
                            "type": "string",
                            "description": "Time range to check: 'today', 'tomorrow', 'this_week', 'next_week', or 'next_7_days'"
                        },
                        "timezone": {
                            "type": "string",
                            "description": "Timezone for the availability check",
                            "const": config.timezone
                        }
                    }
                }
            },
            {
                "type": "custom",
                "tool_id": "create_calendar_booking",
                "name": "create_calendar_booking",
                "description": "Book a demo appointment on the calendar. Creates a confirmed booking and returns confirmation details.",
                "url": config.webhook_url,
                "method": "POST",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "attendee_name": {
                            "type": "string",
                            "description": "Business owner's full name"
                        },
                        "attendee_phone": {
                            "type": "string",
                            "description": "Business owner's phone number in E.164 format (e.g., +14085551234). Prepend +1 to 10-digit US numbers."
                        },
                        "attendee_email": {
                            "type": "string",
                            "description": "Business owner's email address (optional)"
                        },
                        "business_name": {
                            "type": "string",
                            "description": "Name of the business"
                        },
                        "start_time": {
                            "type": "string",
                            "description": "ISO datetime string for the appointment start time"
                        },
                        "notes": {
                            "type": "string",
                            "description": "Additional notes about the business or their needs"
                        }
                    },
                    "required": ["attendee_name", "attendee_phone", "start_time"]
                }
            },
            {
                "type": "custom",
                "tool_id": "update_lead_status",
                "name": "update_lead_status",
                "description": "Update the lead status in the CRM based on call outcome.",
                "url": config.webhook_url,
                "method": "POST",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "status": {
                            "type": "string",
                            "description": "Lead status: 'meeting_scheduled', 'callback_scheduled', 'not_interested', 'warm_lead', 'wrong_number'"
                        },
                        "callback_date": {
                            "type": "string",
                            "description": "Date for callback if applicable"
                        },
                        "callback_time": {
                            "type": "string",
                            "description": "Time for callback if applicable"
                        },
                        "notes": {
                            "type": "string",
                            "description": "Notes about the call outcome"
                        }
                    },
                    "required": ["status"]
                }
            }
        ]

    def _build_global_prompt(self, config: GreenLineOutboundConfig) -> str:
        """Build the global system prompt for the outbound sales agent."""

        return f"""You are {config.agent_name}, a friendly and professional sales representative for {config.company_name}.

## Your Role
You're calling home service businesses (plumbers, HVAC, landscapers, roofers, etc.) to introduce our AI phone answering service. Your goal is to schedule a 15-minute demo call.

## Your Personality
- Friendly and conversational - not pushy or aggressive
- Respectful of their time - you're interrupting their day
- Empathetic - these business owners work hard and miss calls
- Confident but not arrogant about the product
- Professional but warm - like a helpful neighbor

## Key Product Information
- **Product**: AI phone answering agent that sounds human
- **Price**: {config.price_description}
- **Value Prop**: Never miss a call, 24/7 coverage, books appointments
- **Demo**: Free 15-minute demo to show how it works
- **No Long Contract**: Cancel anytime

## Conversation Guidelines

**Opening:**
- Confirm it's a good time before diving in
- If they're busy, offer to call back
- Keep it brief - respect their time

**Qualification:**
- Ask about their business to personalize the pitch
- Find out if they miss calls or struggle to answer
- Identify pain points around missed opportunities

**Handling Objections:**
- Budget: "One saved call pays for the month"
- Trust: "Hear it in action - most can't tell it's AI"
- Timing: "Happy to call back when it works better"
- Already have solution: "Great! Mind if I follow up in a few months?"

**Booking:**
- Offer specific times from the calendar
- Be flexible if they need different times
- Confirm the booking and send SMS confirmation

**Ending Calls:**
- Always thank them for their time
- Leave a positive impression even if not interested
- Offer info SMS as a last resort

## Important Rules
- NEVER be pushy or aggressive
- ALWAYS respect when they say no
- NEVER argue with the prospect
- ALWAYS confirm information before booking
- Keep calls under 5 minutes unless they're engaged
- Use their name and business name when you have them

## Email Collection (Important!)
When collecting email addresses over the phone:
- Ask them to spell it out using "at" for @ and "dot" for periods
- Give an example: "john at gmail dot com"
- ALWAYS read it back to confirm before booking
- If they're frustrated, offer to just use their phone number
- Convert spoken format to proper email (e.g., "john at gmail dot com" → "john@gmail.com")
- Common domains: gmail, yahoo, hotmail, outlook, icloud, aol
- Watch for common confusions: "bee" vs "dee", "em" vs "en", "ess" vs "eff"

## Phone Number Handling (Important!)
When reading or confirming phone numbers:
- Read numbers in groups: "five five five, one two three, four five six seven"
- Say "area code" before the first three digits: "area code 555..."
- Pause between groups for clarity
- Always read back to confirm: "I have your number as 555-123-4567, is that correct?"
- When collecting a new phone number, ask them to say it slowly
- Common confusions: "fifteen" vs "fifty", "thirteen" vs "thirty", "nine" vs "five"
- ALWAYS format phone numbers in E.164 format: +1 followed by 10 digits (e.g., +14085551234)
- Convert spoken numbers: "408-555-1234" → "+14085551234"
- If they give 10 digits, prepend +1 for US numbers

## Dynamic Variables Available
You may have access to these variables from the CRM:
- {{{{business_name}}}} - Their business name
- {{{{owner_name}}}} - Owner's name if known
- {{{{business_type}}}} - Type of business
- {{{{city}}}} - Their city
- {{{{state}}}} - Their state
- {{{{phone}}}} - Phone number being called (already in E.164 format: +1XXXXXXXXXX)

When using {{{{phone}}}} for bookings or callbacks, it's already properly formatted.
"""

    def _build_nodes(self, config: GreenLineOutboundConfig) -> list:
        """
        Build all conversation flow nodes following RETELL-FLOW-CHART.md.

        Key design: Questions are asked BEFORE extract nodes to ensure
        we have context for variable extraction.
        """

        nodes = [
            # ============================================================
            # WELCOME & INTRODUCTION NODES
            # ============================================================

            # Node 1: Welcome
            {
                "id": "welcome",
                "type": "conversation",
                "name": "Node 1: Welcome",
                "instruction": {
                    "type": "static_text",
                    "text": f"""Hi there! This is {config.agent_name} calling from {config.company_name}, a marketing agency. I hope you're doing well today!

Is now a good time to chat, or should I call back at a better time?"""
                },
                "edges": [
                    {
                        "id": "edge_welcome_to_ask_business",
                        "description": "Good time to talk",
                        "destination_node_id": "ask_about_business",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User says yes, now is good, they have time, or seems open to talking"
                        }
                    },
                    {
                        "id": "edge_welcome_to_callback",
                        "description": "Not a good time",
                        "destination_node_id": "schedule_callback_ask",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User says no, busy, not a good time, or asks to call back later"
                        }
                    },
                    {
                        "id": "edge_welcome_to_intro",
                        "description": "Wants more info",
                        "destination_node_id": "introduction",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User asks who is calling, what this is about, or wants more information"
                        }
                    },
                    {
                        "id": "edge_welcome_to_not_interested",
                        "description": "Immediate rejection",
                        "destination_node_id": "end_not_interested",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User immediately says not interested, hangs up, or asks to be removed"
                        }
                    }
                ]
            },

            # Node 1b: Introduction (for those who want more info)
            {
                "id": "introduction",
                "type": "conversation",
                "name": "Node 1b: Introduction",
                "instruction": {
                    "type": "static_text",
                    "text": f"""Of course! My name is {config.agent_name} and I'm reaching out from {config.company_name}.

We help home service businesses get more qualified leads through AI-powered marketing and never miss a call again with our AI phone answering service.

Is this something you have a few minutes to hear about?"""
                },
                "edges": [
                    {
                        "id": "edge_intro_to_ask_business",
                        "description": "Interested to hear more",
                        "destination_node_id": "ask_about_business",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User agrees to hear more, says yes, or seems interested"
                        }
                    },
                    {
                        "id": "edge_intro_to_not_interested",
                        "description": "Not interested",
                        "destination_node_id": "end_not_interested",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User declines or says not interested"
                        }
                    },
                    {
                        "id": "edge_intro_to_callback",
                        "description": "Requests callback",
                        "destination_node_id": "schedule_callback_ask",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User requests a callback or says it's not a good time"
                        }
                    }
                ]
            },

            # ============================================================
            # QUALIFICATION NODES
            # ============================================================

            # Node 2: Ask About Business (Question BEFORE extraction)
            {
                "id": "ask_about_business",
                "type": "conversation",
                "name": "Node 2: Ask About Business",
                "instruction": {
                    "type": "static_text",
                    "text": """Perfect! Before we dive in, I'd love to know a bit more about you.

Could you tell me your name and a little about your business?"""
                },
                "edges": [
                    {
                        "id": "edge_ask_to_extract",
                        "description": "Provides business info",
                        "destination_node_id": "extract_business_info",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User provides information about themselves or their business"
                        }
                    },
                    {
                        "id": "edge_ask_to_qualification",
                        "description": "Evasive or skips",
                        "destination_node_id": "main_qualification",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User is evasive, doesn't share much, or wants to skip ahead"
                        }
                    },
                    {
                        "id": "edge_ask_to_owner",
                        "description": "Not the owner",
                        "destination_node_id": "ask_for_owner",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User indicates they are not the owner or decision maker"
                        }
                    }
                ]
            },

            # Node 2a: Extract Business Info
            {
                "id": "extract_business_info",
                "type": "extract_dynamic_variables",
                "name": "Node 2a: Extract Business Info",
                "variables": [
                    {
                        "name": "owner_name",
                        "type": "string",
                        "description": "The name of the person on the call. Listen for when they introduce themselves."
                    },
                    {
                        "name": "business_name",
                        "type": "string",
                        "description": "The name of their business if mentioned."
                    },
                    {
                        "name": "is_owner",
                        "type": "string",
                        "description": "Whether this person is the owner or decision maker. 'yes' if they are, 'no' if employee/manager."
                    },
                    {
                        "name": "business_type",
                        "type": "string",
                        "description": "The type of business (plumbing, HVAC, roofing, landscaping, tree service, etc.)"
                    },
                    {
                        "name": "current_marketing",
                        "type": "string",
                        "description": "Any current marketing methods or lead generation they mention."
                    }
                ],
                "edges": [
                    {
                        "id": "edge_extract_to_qualification",
                        "description": "Is owner or decision maker",
                        "destination_node_id": "main_qualification",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Person confirms they are the owner, decision maker, or it's unclear but we should proceed"
                        }
                    },
                    {
                        "id": "edge_extract_to_ask_owner",
                        "description": "Not the owner",
                        "destination_node_id": "ask_for_owner",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Person clearly indicates they are not the owner or decision maker"
                        }
                    }
                ]
            },

            # Node 3: Main Qualification
            {
                "id": "main_qualification",
                "type": "conversation",
                "name": "Node 3: Main Qualification",
                "instruction": {
                    "type": "prompt",
                    "text": """Great to meet you{{#owner_name}}, {{owner_name}}{{/owner_name}}! I'll keep this super brief.

We help {{#business_type}}{{business_type}}{{/business_type}}{{^business_type}}home service{{/business_type}} businesses like yours never miss a call again with our AI phone answering service.

Do you ever have trouble keeping up with incoming calls, or find yourself missing calls when you're out on jobs?"""
                },
                "edges": [
                    {
                        "id": "edge_qual_to_value",
                        "description": "Misses calls - pain point confirmed",
                        "destination_node_id": "value_proposition",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User says yes, admits to missing calls, has trouble keeping up, or acknowledges the problem"
                        }
                    },
                    {
                        "id": "edge_qual_to_soft_close",
                        "description": "Handles calls fine",
                        "destination_node_id": "soft_close",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User says no, they handle calls fine, have a receptionist, or don't miss calls"
                        }
                    },
                    {
                        "id": "edge_qual_to_not_interested",
                        "description": "Not interested",
                        "destination_node_id": "end_not_interested",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User says not interested, asks to stop, or wants off the call"
                        }
                    },
                    {
                        "id": "edge_qual_to_pricing",
                        "description": "Asks about pricing",
                        "destination_node_id": "pricing_discussion",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User asks about pricing, cost, or how much it is"
                        }
                    }
                ]
            },

            # Node 4: Value Proposition
            {
                "id": "value_proposition",
                "type": "conversation",
                "name": "Node 4: Value Proposition",
                "instruction": {
                    "type": "prompt",
                    "text": """I hear that a lot. Every missed call is potentially hundreds or even thousands of dollars walking out the door.

Our AI phone agent answers your calls 24/7 - it sounds just like a real person, books appointments, answers questions about your services, and even qualifies leads before they ever reach you.

Would you be open to a quick 15-minute demo call so I can show you exactly how it works for {{#business_type}}{{business_type}}{{/business_type}}{{^business_type}}businesses like yours{{/business_type}}?"""
                },
                "edges": [
                    {
                        "id": "edge_value_to_check_avail",
                        "description": "Agrees to schedule",
                        "destination_node_id": "check_availability",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User agrees to schedule, says yes, sure, or shows interest in the demo"
                        }
                    },
                    {
                        "id": "edge_value_to_objection",
                        "description": "Hesitant or needs to think",
                        "destination_node_id": "handle_objection",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User says maybe, needs to think about it, is hesitant, or has concerns"
                        }
                    },
                    {
                        "id": "edge_value_to_last_attempt",
                        "description": "Says no",
                        "destination_node_id": "last_attempt",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User says no or declines the demo"
                        }
                    },
                    {
                        "id": "edge_value_to_pricing",
                        "description": "Questions about service",
                        "destination_node_id": "pricing_discussion",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User asks questions about the service, pricing, or how it works"
                        }
                    }
                ]
            },

            # Node 5: Pricing Discussion
            {
                "id": "pricing_discussion",
                "type": "conversation",
                "name": "Node 5: Pricing Discussion",
                "instruction": {
                    "type": "static_text",
                    "text": f"""Great question! Our AI phone agent starts at just {config.base_price} per month.

When you think about it, that's less than a single missed job could cost you. Most of our clients tell us it pays for itself within the first week just from the calls they would have missed.

The best way to see if it's right for you is a quick 15-minute demo where I can show you exactly how it would work for your business. Would you be open to that?"""
                },
                "edges": [
                    {
                        "id": "edge_pricing_to_check_avail",
                        "description": "Agrees to demo",
                        "destination_node_id": "check_availability",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User agrees to schedule a demo call"
                        }
                    },
                    {
                        "id": "edge_pricing_to_budget_objection",
                        "description": "Budget concerns",
                        "destination_node_id": "budget_objection",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User says too expensive, budget concerns, can't afford it"
                        }
                    },
                    {
                        "id": "edge_pricing_to_last_attempt",
                        "description": "Declines",
                        "destination_node_id": "last_attempt",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User declines or says no"
                        }
                    }
                ]
            },

            # ============================================================
            # SCHEDULING NODES (with custom webhook functions)
            # ============================================================

            # Node 6: Check Availability (Function Node)
            {
                "id": "check_availability",
                "type": "function",
                "name": "Node 6: Check Availability",
                "tool_id": "check_calendar_availability",
                "tool_type": "local",
                "wait_for_result": True,
                "speak_during_execution": True,
                "instruction": {
                    "type": "static_text",
                    "text": "Let me check what times we have available for a demo. One moment..."
                },
                "edges": [
                    {
                        "id": "edge_avail_to_offer",
                        "description": "Availability found",
                        "destination_node_id": "offer_time_slots",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Calendar availability was retrieved successfully with available slots"
                        }
                    },
                    {
                        "id": "edge_avail_to_fallback",
                        "description": "API error or no slots",
                        "destination_node_id": "scheduling_fallback",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Calendar check failed, returned an error, or no slots available"
                        }
                    }
                ]
            },

            # Node 6a: Offer Time Slots
            {
                "id": "offer_time_slots",
                "type": "conversation",
                "name": "Node 6a: Offer Time Slots",
                "instruction": {
                    "type": "prompt",
                    "text": """I have some times available this week. How does {{next_available}} work for you?

Or if that doesn't work, I can find another time that fits your schedule."""
                },
                "edges": [
                    {
                        "id": "edge_offer_to_create_booking",
                        "description": "Accepts offered time",
                        "destination_node_id": "ask_booking_details",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User agrees to the offered time or picks a specific slot"
                        }
                    },
                    {
                        "id": "edge_offer_to_preferred_time",
                        "description": "Wants different time",
                        "destination_node_id": "ask_preferred_time",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User wants a different time than what was offered"
                        }
                    },
                    {
                        "id": "edge_offer_to_last_attempt",
                        "description": "Changes mind",
                        "destination_node_id": "last_attempt",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User changes their mind or declines to schedule"
                        }
                    }
                ]
            },

            # Node 6a-ask: Ask Booking Details (Question BEFORE booking)
            {
                "id": "ask_booking_details",
                "type": "conversation",
                "name": "Node 6a-ask: Ask Booking Details",
                "instruction": {
                    "type": "static_text",
                    "text": """Perfect! Let me just confirm a few details to get you booked.

Can I get your email address so we can send you the calendar invite and demo link?

Just spell it out for me - you can say "at" for the @ symbol and "dot" for the period. For example, "john at gmail dot com"."""
                },
                "edges": [
                    {
                        "id": "edge_ask_details_to_extract",
                        "description": "Provides email",
                        "destination_node_id": "extract_booking_details",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User provides their email address, spells it out, or gives contact information"
                        }
                    },
                    {
                        "id": "edge_ask_details_no_email",
                        "description": "No email, proceed anyway",
                        "destination_node_id": "create_booking",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User doesn't have email, prefers not to share, or just wants to use phone number"
                        }
                    }
                ]
            },

            # Node 6a-extract: Extract Booking Details
            {
                "id": "extract_booking_details",
                "type": "extract_dynamic_variables",
                "name": "Node 6a-extract: Extract Booking Details",
                "variables": [
                    {
                        "name": "lead_email",
                        "type": "string",
                        "description": "The email address provided for the calendar invite. Convert spoken format to email format (e.g., 'john at gmail dot com' becomes 'john@gmail.com')"
                    },
                    {
                        "name": "selected_time",
                        "type": "string",
                        "description": "The confirmed appointment time they agreed to"
                    }
                ],
                "edges": [
                    {
                        "id": "edge_extract_booking_to_confirm",
                        "description": "Email extracted",
                        "destination_node_id": "confirm_email",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Email address has been captured"
                        }
                    }
                ]
            },

            # Node 6a-confirm: Confirm Email Address
            {
                "id": "confirm_email",
                "type": "conversation",
                "name": "Node 6a-confirm: Confirm Email",
                "instruction": {
                    "type": "prompt",
                    "text": """Let me read that back to make sure I got it right.

I have your email as {{lead_email}} - is that correct?

If not, just spell it out again for me."""
                },
                "edges": [
                    {
                        "id": "edge_confirm_email_correct",
                        "description": "Email confirmed",
                        "destination_node_id": "create_booking",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User confirms the email is correct, says yes, that's right, or similar"
                        }
                    },
                    {
                        "id": "edge_confirm_email_wrong",
                        "description": "Email incorrect, re-collect",
                        "destination_node_id": "ask_booking_details",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User says the email is wrong, incorrect, or wants to spell it again"
                        }
                    },
                    {
                        "id": "edge_confirm_email_skip",
                        "description": "Skip email, use phone only",
                        "destination_node_id": "create_booking",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User is frustrated with email or says to just use their phone number instead"
                        }
                    }
                ]
            },

            # Node 6a-alt: Ask Preferred Time (Question BEFORE extraction)
            {
                "id": "ask_preferred_time",
                "type": "conversation",
                "name": "Node 6a-alt: Ask Preferred Time",
                "instruction": {
                    "type": "static_text",
                    "text": """No problem! What day and time would work better for you?

I can check if we have availability then."""
                },
                "edges": [
                    {
                        "id": "edge_preferred_to_extract",
                        "description": "Provides time preference",
                        "destination_node_id": "extract_preferred_time",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User provides a day or time preference"
                        }
                    },
                    {
                        "id": "edge_preferred_to_fallback",
                        "description": "Unclear or unsure",
                        "destination_node_id": "scheduling_fallback",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User is unsure about timing or can't commit to a time"
                        }
                    }
                ]
            },

            # Node 6a-alt-extract: Extract Preferred Time
            {
                "id": "extract_preferred_time",
                "type": "extract_dynamic_variables",
                "name": "Node 6a-alt-extract: Extract Preferred Time",
                "variables": [
                    {
                        "name": "preferred_day",
                        "type": "string",
                        "description": "The day they prefer (e.g., 'Tuesday', 'tomorrow', 'next week')"
                    },
                    {
                        "name": "preferred_time_of_day",
                        "type": "string",
                        "description": "The time of day they prefer (e.g., 'morning', 'afternoon', '2pm')"
                    }
                ],
                "edges": [
                    {
                        "id": "edge_extract_pref_to_booking",
                        "description": "Time preference captured",
                        "destination_node_id": "ask_booking_details",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Time preference has been extracted and seems available"
                        }
                    },
                    {
                        "id": "edge_extract_pref_to_fallback",
                        "description": "Unable to accommodate",
                        "destination_node_id": "scheduling_fallback",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Unable to find a matching time or preference is unclear"
                        }
                    }
                ]
            },

            # Node 6b: Create Booking (Function Node)
            {
                "id": "create_booking",
                "type": "function",
                "name": "Node 6b: Create Booking",
                "tool_id": "create_calendar_booking",
                "tool_type": "local",
                "wait_for_result": True,
                "speak_during_execution": True,
                "instruction": {
                    "type": "static_text",
                    "text": "Let me book that for you now. One moment..."
                },
                "edges": [
                    {
                        "id": "edge_booking_to_sms",
                        "description": "Booking successful",
                        "destination_node_id": "send_confirmation_sms",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Booking was created successfully"
                        }
                    },
                    {
                        "id": "edge_booking_to_fallback",
                        "description": "Booking failed",
                        "destination_node_id": "booking_fallback",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Booking failed or there was an error"
                        }
                    }
                ]
            },

            # Node 6c: Send Confirmation SMS
            {
                "id": "send_confirmation_sms",
                "type": "sms",
                "name": "Node 6c: Send Confirmation SMS",
                "instruction": {
                    "type": "prompt",
                    "text": f"""Send an SMS confirmation with:
- Their name and booking time
- Company: {config.company_name}
- A friendly note about looking forward to the demo

Keep it brief and professional."""
                },
                "success_edge": {
                    "id": "edge_sms_success",
                    "description": "SMS sent",
                    "destination_node_id": "sms_success_response",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Sent successfully"
                    }
                },
                "failed_edge": {
                    "id": "edge_sms_failed",
                    "description": "SMS failed",
                    "destination_node_id": "sms_failure_response",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Failed to send"
                    }
                }
            },

            # Node 6c-success: SMS Success Response
            {
                "id": "sms_success_response",
                "type": "conversation",
                "name": "Node 6c-success: SMS Success",
                "instruction": {
                    "type": "static_text",
                    "text": """Excellent! I just sent you a confirmation text. You should receive it in just a second.

Is there anything specific you'd like us to cover during that demo?"""
                },
                "edges": [
                    {
                        "id": "edge_sms_success_to_end",
                        "description": "Confirms or no questions",
                        "destination_node_id": "end_meeting_scheduled",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User confirms, has no questions, or is ready to end the call"
                        }
                    },
                    {
                        "id": "edge_sms_success_retry",
                        "description": "Didn't receive SMS",
                        "destination_node_id": "send_confirmation_sms",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User didn't receive SMS or asks to resend"
                        }
                    }
                ]
            },

            # Node 6c-failure: SMS Failure Response
            {
                "id": "sms_failure_response",
                "type": "conversation",
                "name": "Node 6c-failure: SMS Failure",
                "instruction": {
                    "type": "prompt",
                    "text": """I had a little trouble sending the confirmation text, but no worries - you're all booked!

Your demo is set for {{confirmed_time}}. You'll receive an email confirmation shortly.

Is there anything specific you'd like us to cover during that call?"""
                },
                "edges": [
                    {
                        "id": "edge_sms_fail_to_end",
                        "description": "Confirms",
                        "destination_node_id": "end_meeting_scheduled",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User confirms or is satisfied"
                        }
                    },
                    {
                        "id": "edge_sms_fail_to_objection",
                        "description": "Has concerns",
                        "destination_node_id": "handle_objection",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User has concerns or questions"
                        }
                    }
                ]
            },

            # Node 6d: Scheduling Fallback
            {
                "id": "scheduling_fallback",
                "type": "conversation",
                "name": "Node 6d: Scheduling Fallback",
                "instruction": {
                    "type": "static_text",
                    "text": f"""I'm having a little trouble with our booking system, but no worries!

Let me send you a text with our scheduling link so you can book at your convenience."""
                },
                "edges": [
                    {
                        "id": "edge_fallback_to_sms",
                        "description": "Agrees to receive link",
                        "destination_node_id": "send_booking_link_sms",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User agrees to receive the scheduling link"
                        }
                    },
                    {
                        "id": "edge_fallback_to_verbal",
                        "description": "Prefers verbal booking",
                        "destination_node_id": "verbal_booking",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User prefers to book verbally or give a specific time"
                        }
                    },
                    {
                        "id": "edge_fallback_to_last_attempt",
                        "description": "Changes mind",
                        "destination_node_id": "last_attempt",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User changes their mind or declines"
                        }
                    }
                ]
            },

            # Node 6d-sms: Send Booking Link SMS
            {
                "id": "send_booking_link_sms",
                "type": "sms",
                "name": "Node 6d-sms: Send Booking Link",
                "instruction": {
                    "type": "static_text",
                    "text": f"Hi! Book your {config.company_name} demo here: {config.cal_booking_url}\n\nLooking forward to showing you how our AI phone agent can help your business!"
                },
                "success_edge": {
                    "id": "edge_link_sms_success",
                    "description": "Link sent",
                    "destination_node_id": "booking_link_success",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Sent successfully"
                    }
                },
                "failed_edge": {
                    "id": "edge_link_sms_failed",
                    "description": "Link failed",
                    "destination_node_id": "verbal_booking",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Failed to send"
                    }
                }
            },

            # Node 6d-sms-success: Booking Link Success
            {
                "id": "booking_link_success",
                "type": "conversation",
                "name": "Node 6d-sms-success: Link Sent",
                "instruction": {
                    "type": "static_text",
                    "text": """I just sent that over. You can book a time that works best for you right from that link.

Is there anything else I can help you with?"""
                },
                "edges": [
                    {
                        "id": "edge_link_success_to_end",
                        "description": "Done",
                        "destination_node_id": "end_meeting_scheduled",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User confirms or is done"
                        }
                    },
                    {
                        "id": "edge_link_success_to_questions",
                        "description": "Has questions",
                        "destination_node_id": "handle_objection",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User has questions"
                        }
                    }
                ]
            },

            # Node 6d-verbal: Verbal Booking
            {
                "id": "verbal_booking",
                "type": "conversation",
                "name": "Node 6d-verbal: Verbal Booking",
                "instruction": {
                    "type": "static_text",
                    "text": """No problem! Let's do this the old-fashioned way.

What day this week or next works best for a quick 15-minute demo?"""
                },
                "edges": [
                    {
                        "id": "edge_verbal_to_callback",
                        "description": "Provides time",
                        "destination_node_id": "extract_callback_time",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User provides a day or time"
                        }
                    },
                    {
                        "id": "edge_verbal_to_last_attempt",
                        "description": "Declines",
                        "destination_node_id": "last_attempt",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User declines or changes mind"
                        }
                    }
                ]
            },

            # Node 6b-fallback: Booking Fallback
            {
                "id": "booking_fallback",
                "type": "conversation",
                "name": "Node 6b-fallback: Booking Fallback",
                "instruction": {
                    "type": "prompt",
                    "text": """I wasn't able to complete the booking in our system right now, but don't worry - I have all your information.

I'll make sure someone reaches out to confirm your appointment. You should hear from us within the hour.

Is there anything else I can help you with?"""
                },
                "edges": [
                    {
                        "id": "edge_booking_fallback_to_end",
                        "description": "Satisfied",
                        "destination_node_id": "end_meeting_scheduled",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User acknowledges and is satisfied"
                        }
                    },
                    {
                        "id": "edge_booking_fallback_to_questions",
                        "description": "Has questions",
                        "destination_node_id": "handle_objection",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User has additional questions"
                        }
                    }
                ]
            },

            # ============================================================
            # OBJECTION HANDLING NODES
            # ============================================================

            # Node 7: Handle Objection
            {
                "id": "handle_objection",
                "type": "conversation",
                "name": "Node 7: Handle Objection",
                "instruction": {
                    "type": "prompt",
                    "text": """I totally understand. A lot of business owners feel the same way at first.

Can I ask what's holding you back? Is it timing, budget, or something else?

I want to make sure I can address any concerns you might have."""
                },
                "edges": [
                    {
                        "id": "edge_objection_to_timing",
                        "description": "Timing issue",
                        "destination_node_id": "schedule_callback_ask",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Objection is timing - too busy right now, not a good time"
                        }
                    },
                    {
                        "id": "edge_objection_to_budget",
                        "description": "Budget concern",
                        "destination_node_id": "budget_objection",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Objection is budget - can't afford it, too expensive"
                        }
                    },
                    {
                        "id": "edge_objection_to_trust",
                        "description": "Trust/skepticism",
                        "destination_node_id": "trust_objection",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Objection is trust - tried things before, skeptical, doesn't believe it works"
                        }
                    },
                    {
                        "id": "edge_objection_to_last",
                        "description": "Firm no",
                        "destination_node_id": "last_attempt",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User remains firm on no or wants to end the call"
                        }
                    }
                ]
            },

            # Node 7b: Budget Objection
            {
                "id": "budget_objection",
                "type": "conversation",
                "name": "Node 7b: Budget Objection",
                "instruction": {
                    "type": "prompt",
                    "text": f"""I completely understand - every dollar counts when you're running a business.

Here's how I look at it: at {config.base_price} a month, if the AI agent books you just ONE extra job that you would have missed, it's already paid for itself.

Most {{{{#business_type}}}}{{{{business_type}}}}{{{{/business_type}}}}{{{{^business_type}}}}service{{{{/business_type}}}} jobs are what, $200, $500, maybe more? One saved call and you're in the green.

Would a quick 15-minute demo be worth seeing how it could work for your business?"""
                },
                "edges": [
                    {
                        "id": "edge_budget_to_check_avail",
                        "description": "Agrees to demo",
                        "destination_node_id": "check_availability",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User agrees to the demo call"
                        }
                    },
                    {
                        "id": "edge_budget_to_callback",
                        "description": "Still hesitant",
                        "destination_node_id": "schedule_callback_ask",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User is still hesitant but open to future contact"
                        }
                    },
                    {
                        "id": "edge_budget_to_not_interested",
                        "description": "Firmly declines",
                        "destination_node_id": "end_not_interested",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User firmly declines"
                        }
                    }
                ]
            },

            # Node 7c: Trust Objection
            {
                "id": "trust_objection",
                "type": "conversation",
                "name": "Node 7c: Trust Objection",
                "instruction": {
                    "type": "prompt",
                    "text": """That's a fair concern. A lot of tech solutions promise the world and don't deliver.

What makes our AI phone agent different is you can actually hear it in action before you commit. It sounds like a real person - most callers can't tell the difference.

And there's no long contract - if it's not working for you, you can cancel anytime.

Would you be open to just hearing a quick demo to see what it sounds like?"""
                },
                "edges": [
                    {
                        "id": "edge_trust_to_check_avail",
                        "description": "Agrees to learn more",
                        "destination_node_id": "check_availability",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User agrees to learn more or see a demo"
                        }
                    },
                    {
                        "id": "edge_trust_to_callback",
                        "description": "Wants to think about it",
                        "destination_node_id": "schedule_callback_ask",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User wants to think about it"
                        }
                    },
                    {
                        "id": "edge_trust_to_not_interested",
                        "description": "Firmly declines",
                        "destination_node_id": "end_not_interested",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User firmly declines"
                        }
                    }
                ]
            },

            # Node 8: Last Attempt
            {
                "id": "last_attempt",
                "type": "conversation",
                "name": "Node 8: Last Attempt",
                "instruction": {
                    "type": "static_text",
                    "text": f"""No problem at all, I appreciate your time. Before I let you go - would it be okay if I sent you a quick text with some information about our AI phone agent?

That way if you ever find yourself missing calls, you'll have our info handy."""
                },
                "edges": [
                    {
                        "id": "edge_last_to_send_info",
                        "description": "Agrees to info",
                        "destination_node_id": "send_info_sms",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User agrees to receive info"
                        }
                    },
                    {
                        "id": "edge_last_to_not_interested",
                        "description": "Declines",
                        "destination_node_id": "end_not_interested",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User declines"
                        }
                    }
                ]
            },

            # Node 9: Soft Close
            {
                "id": "soft_close",
                "type": "conversation",
                "name": "Node 9: Soft Close",
                "instruction": {
                    "type": "static_text",
                    "text": """That's great to hear you're staying on top of your calls! We love to hear that.

Would you be open to me following up in a few months? A lot of business owners find that as they grow, keeping up with calls gets harder.

That way you'll have a resource ready if you ever need help."""
                },
                "edges": [
                    {
                        "id": "edge_soft_to_warm_lead",
                        "description": "Agrees to follow-up",
                        "destination_node_id": "end_warm_lead",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User agrees to follow-up"
                        }
                    },
                    {
                        "id": "edge_soft_to_not_interested",
                        "description": "Declines follow-up",
                        "destination_node_id": "end_not_interested",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User declines follow-up"
                        }
                    }
                ]
            },

            # ============================================================
            # CALLBACK SCHEDULING NODES
            # ============================================================

            # Node 10: Schedule Callback - Ask
            {
                "id": "schedule_callback_ask",
                "type": "conversation",
                "name": "Node 10: Schedule Callback - Ask",
                "instruction": {
                    "type": "static_text",
                    "text": """No problem! When would be a better time for me to give you a call back?

I want to make sure I catch you when you have a few minutes."""
                },
                "edges": [
                    {
                        "id": "edge_callback_to_extract",
                        "description": "Provides time",
                        "destination_node_id": "extract_callback_time",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User provides a date or time for callback"
                        }
                    },
                    {
                        "id": "edge_callback_to_not_interested",
                        "description": "Don't call back",
                        "destination_node_id": "end_not_interested",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User says don't call back"
                        }
                    },
                    {
                        "id": "edge_callback_to_suggest",
                        "description": "Unsure about time",
                        "destination_node_id": "suggest_callback_time",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User is unsure about when to schedule"
                        }
                    }
                ]
            },

            # Node 10a: Extract Callback Time
            {
                "id": "extract_callback_time",
                "type": "extract_dynamic_variables",
                "name": "Node 10a: Extract Callback Time",
                "variables": [
                    {
                        "name": "callback_date",
                        "type": "string",
                        "description": "The date for callback (e.g., 'tomorrow', 'Tuesday', 'next week')"
                    },
                    {
                        "name": "callback_time",
                        "type": "string",
                        "description": "The time for callback (e.g., 'morning', 'after 2pm', '3pm')"
                    }
                ],
                "edges": [
                    {
                        "id": "edge_extract_callback_to_end",
                        "description": "Time captured",
                        "destination_node_id": "end_callback_scheduled",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Callback date and time have been captured"
                        }
                    }
                ]
            },

            # Node 10b: Suggest Callback Time
            {
                "id": "suggest_callback_time",
                "type": "conversation",
                "name": "Node 10b: Suggest Callback Time",
                "instruction": {
                    "type": "static_text",
                    "text": """How about I give you a call back tomorrow around the same time?

Or would a morning or afternoon work better for you?"""
                },
                "edges": [
                    {
                        "id": "edge_suggest_to_extract",
                        "description": "Agrees or provides time",
                        "destination_node_id": "extract_callback_time",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User agrees to suggested time or provides a different time"
                        }
                    },
                    {
                        "id": "edge_suggest_to_not_interested",
                        "description": "Declines callback",
                        "destination_node_id": "end_not_interested",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User declines callback"
                        }
                    }
                ]
            },

            # ============================================================
            # OWNER/GATEKEEPER NODES
            # ============================================================

            # Node 12: Ask for Owner
            {
                "id": "ask_for_owner",
                "type": "conversation",
                "name": "Node 12: Ask for Owner",
                "instruction": {
                    "type": "static_text",
                    "text": """No problem! Is the owner available right now, or would it be better if I called back at another time to speak with them?"""
                },
                "edges": [
                    {
                        "id": "edge_owner_available",
                        "description": "Owner available",
                        "destination_node_id": "transfer_to_owner",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Owner is available now"
                        }
                    },
                    {
                        "id": "edge_owner_to_callback",
                        "description": "Owner not available",
                        "destination_node_id": "schedule_callback_ask",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Owner is not available, suggests callback time"
                        }
                    },
                    {
                        "id": "edge_owner_to_not_interested",
                        "description": "Won't provide info",
                        "destination_node_id": "end_not_interested",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "They don't want to provide information or help"
                        }
                    }
                ]
            },

            # Node 12b: Transfer to Owner
            {
                "id": "transfer_to_owner",
                "type": "conversation",
                "name": "Node 12b: Transfer to Owner",
                "instruction": {
                    "type": "static_text",
                    "text": """Perfect! I'll hold while you transfer me. Thank you so much for your help!"""
                },
                "edges": [
                    {
                        "id": "edge_transfer_owner_on",
                        "description": "Owner gets on",
                        "destination_node_id": "welcome",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Owner or new person gets on the line"
                        }
                    },
                    {
                        "id": "edge_transfer_failed",
                        "description": "Transfer failed",
                        "destination_node_id": "schedule_callback_ask",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Transfer fails or owner is unavailable"
                        }
                    }
                ]
            },

            # ============================================================
            # SMS NODES
            # ============================================================

            # Node 14: Send Info SMS
            {
                "id": "send_info_sms",
                "type": "sms",
                "name": "Node 14: Send Info SMS",
                "instruction": {
                    "type": "static_text",
                    "text": f"Thanks for chatting with {config.company_name} today!\n\nWhen you're ready to get more leads, we're here to help:\nhttps://greenline-ai.com\n\nReply anytime with questions!"
                },
                "success_edge": {
                    "id": "edge_info_sms_success",
                    "description": "Info sent",
                    "destination_node_id": "info_sms_success",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Sent successfully"
                    }
                },
                "failed_edge": {
                    "id": "edge_info_sms_failed",
                    "description": "Info failed",
                    "destination_node_id": "info_sms_failure",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Failed to send"
                    }
                }
            },

            # Node 14-success: Info SMS Success
            {
                "id": "info_sms_success",
                "type": "conversation",
                "name": "Node 14-success: Info Sent",
                "instruction": {
                    "type": "static_text",
                    "text": """Perfect, I just sent that over. If you ever have questions or want to chat about growing your business, just reply to that text.

Thanks for your time today!"""
                },
                "edges": [
                    {
                        "id": "edge_info_success_to_end",
                        "description": "End call",
                        "destination_node_id": "end_info_sent",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User says goodbye or confirms"
                        }
                    }
                ]
            },

            # Node 14-failure: Info SMS Failure
            {
                "id": "info_sms_failure",
                "type": "conversation",
                "name": "Node 14-failure: Info Failed",
                "instruction": {
                    "type": "static_text",
                    "text": """I had a little trouble sending the text, but you can find us at greenline-ai.com anytime.

Thanks so much for your time today!"""
                },
                "edges": [
                    {
                        "id": "edge_info_failure_to_end",
                        "description": "End call",
                        "destination_node_id": "end_info_sent",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "User says goodbye or confirms"
                        }
                    }
                ]
            },

            # ============================================================
            # ENDING NODES
            # ============================================================

            # Node 11: End - Not Interested
            {
                "id": "end_not_interested",
                "type": "end",
                "name": "Node 11: End - Not Interested",
                "instruction": {
                    "type": "static_text",
                    "text": """I completely understand. Thanks so much for your time today, and I hope you have a wonderful rest of your day. Take care!"""
                }
            },

            # Node 13: End - Meeting Scheduled
            {
                "id": "end_meeting_scheduled",
                "type": "end",
                "name": "Node 13: End - Meeting Scheduled",
                "instruction": {
                    "type": "prompt",
                    "text": """Awesome! We're all set. You should have that confirmation in your texts now.

I'm really looking forward to showing you how we can help {{#business_name}}{{business_name}}{{/business_name}}{{^business_name}}your business{{/business_name}} grow.

Have a great rest of your day{{#owner_name}}, {{owner_name}}{{/owner_name}}!"""
                }
            },

            # Node 14-end: End - Info Sent
            {
                "id": "end_info_sent",
                "type": "end",
                "name": "Node 14-end: End - Info Sent",
                "instruction": {
                    "type": "static_text",
                    "text": """Take care!"""
                }
            },

            # Node 15: End - Warm Lead
            {
                "id": "end_warm_lead",
                "type": "end",
                "name": "Node 15: End - Warm Lead",
                "instruction": {
                    "type": "prompt",
                    "text": """Sounds great! I'll make a note to check back in with you. Keep up the great work with {{#business_name}}{{business_name}}{{/business_name}}{{^business_name}}your business{{/business_name}}, and I hope your success continues!

Have a wonderful day!"""
                }
            },

            # Node 16: End - Callback Scheduled
            {
                "id": "end_callback_scheduled",
                "type": "end",
                "name": "Node 16: End - Callback Scheduled",
                "instruction": {
                    "type": "prompt",
                    "text": """Perfect! I've got you down for {{callback_date}} at {{callback_time}}.

I'll give you a call then. Thanks so much for your time, and talk to you soon!"""
                }
            }
        ]

        return nodes

    def _create_voice_agent(self, config: GreenLineOutboundConfig, flow_id: str):
        """Create the voice agent and attach the conversation flow."""

        agent_params = {
            "agent_name": f"{config.company_name} Sales Agent ({config.agent_name})",
            "response_engine": {
                "type": "conversation-flow",
                "conversation_flow_id": flow_id
            },
            "voice_id": config.voice_id,
            "language": "en-US",
        }

        # Add webhook URL for CRM integration
        if config.webhook_url:
            agent_params["webhook_url"] = config.webhook_url
            print(f"Webhook configured: {config.webhook_url}")

        return self.client.agent.create(**agent_params)


def create_outbound_agent():
    """
    Create the GreenLine AI outbound sales agent.
    """
    api_key = os.environ.get("RETELL_API_KEY")
    if not api_key:
        raise ValueError("RETELL_API_KEY environment variable not set")

    config = GreenLineOutboundConfig(
        agent_name="Alex",
        company_name="GreenLine AI",
        base_price="$297",
        price_description="$297 per month",
        cal_event_type_id=os.environ.get("CAL_EVENT_TYPE_ID", ""),
        cal_booking_url="https://cal.com/greenlineai",
        webhook_url=DEFAULT_WEBHOOK_URL,
        voice_id="11labs-Adrian",
        model="gpt-4.1",
        timezone="America/Los_Angeles"
    )

    builder = GreenLineOutboundAgentBuilder(api_key)
    result = builder.create_agent(config)

    print("\n" + "=" * 50)
    print("GreenLine AI Outbound Sales Agent Created!")
    print("=" * 50)
    print(f"Conversation Flow ID: {result['conversation_flow_id']}")
    print(f"Agent ID: {result['agent_id']}")
    print(f"Agent Name: {config.agent_name}")
    print(f"Webhook URL: {config.webhook_url}")
    print("=" * 50)

    return result


if __name__ == "__main__":
    create_outbound_agent()

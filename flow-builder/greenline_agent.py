import os
import re
from typing import Optional
from dataclasses import dataclass, field
from retell import Retell


def normalize_phone_to_e164(phone: str, default_country_code: str = "+1") -> str:
    """
    Normalize a phone number to E.164 format for Retell AI.

    E.164 format: +[country code][subscriber number]
    Example: +14085551234

    Handles various input formats:
    - "408" -> "+1408" (incomplete, but preserves what's given)
    - "4085551234" -> "+14085551234"
    - "(408) 555-1234" -> "+14085551234"
    - "408-555-1234" -> "+14085551234"
    - "+1 408 555 1234" -> "+14085551234"
    - "1-408-555-1234" -> "+14085551234"

    Args:
        phone: Phone number in any format
        default_country_code: Country code to prepend if missing (default: +1 for US)

    Returns:
        Phone number in E.164 format
    """
    if not phone:
        return ""

    # Remove all non-digit characters except leading +
    has_plus = phone.strip().startswith('+')
    digits = re.sub(r'\D', '', phone)

    if not digits:
        return ""

    # If already has country code (11+ digits starting with 1 for US)
    if len(digits) >= 11 and digits.startswith('1'):
        return f"+{digits}"

    # If 10 digits (standard US number without country code)
    if len(digits) == 10:
        return f"{default_country_code}{digits}"

    # If it had a + prefix, assume it's already formatted (international)
    if has_plus:
        return f"+{digits}"

    # For partial numbers (like area code only), still format with country code
    # This allows the system to at least attempt the call
    return f"{default_country_code}{digits}"


def validate_e164_phone(phone: str) -> tuple[bool, str]:
    """
    Validate that a phone number is in proper E.164 format.

    Args:
        phone: Phone number to validate

    Returns:
        Tuple of (is_valid, message)
    """
    if not phone:
        return False, "Phone number is empty"

    # E.164 format: + followed by 1-15 digits
    e164_pattern = r'^\+[1-9]\d{1,14}$'

    if not re.match(e164_pattern, phone):
        return False, f"Phone '{phone}' is not in E.164 format (expected: +14085551234)"

    # For US numbers, should be exactly 11 digits after +
    if phone.startswith('+1') and len(phone) != 12:
        return False, f"US phone number should be 11 digits (got {len(phone) - 1}): {phone}"

    return True, "Valid E.164 format"


def sanitize_company_name(name: str) -> str:
    """
    Sanitize a company/greeting name by removing common greeting phrases.

    Users sometimes mistakenly enter the full greeting phrase like
    "Thank you for calling Acme Corp" instead of just "Acme Corp".

    Args:
        name: The company/greeting name to sanitize

    Returns:
        Cleaned company name with proper title case
    """
    if not name:
        return ""

    # Common greeting phrases to strip (case-insensitive)
    phrases_to_remove = [
        r"^thank\s*you\s*for\s*calling\s*",
        r"^thanks\s*for\s*calling\s*",
        r"^welcome\s*to\s*",
        r"^you'?ve\s*reached\s*",
        r"^this\s*is\s*",
        r"^hello,?\s*",
        r"^hi,?\s*",
    ]

    cleaned = name.strip()
    original = cleaned

    for pattern in phrases_to_remove:
        cleaned = re.sub(pattern, '', cleaned, flags=re.IGNORECASE)

    # Strip any leading/trailing punctuation and whitespace
    cleaned = cleaned.strip(' ,!.')

    # Convert to title case if it looks like it's all lowercase or all uppercase
    if cleaned.islower() or cleaned.isupper():
        cleaned = cleaned.title()

    if cleaned != original:
        print(f"📝 Sanitized company name: '{original}' -> '{cleaned}'")

    return cleaned

# Optional Supabase import for CRM integration
try:
    from supabase import create_client, Client
    SUPABASE_AVAILABLE = True
except ImportError:
    SUPABASE_AVAILABLE = False

# Default webhook URL for GreenLine AI CRM integration
DEFAULT_WEBHOOK_URL = "https://www.greenline-ai.com/api/inbound/webhook"


@dataclass
class GreenLineConfig:
    """Configuration for a GreenLine AI agent deployment."""
    company_name: str
    business_type: str  # 'landscaping' or 'hvac'
    phone_number: str
    business_hours: str = "8 AM to 6 PM, Monday through Saturday"
    services: list = field(default_factory=list)
    service_areas: list = field(default_factory=list)
    webhook_url: str = DEFAULT_WEBHOOK_URL  # Webhook URL for lead/call data
    calendly_url: str = ""
    transfer_number: str = ""  # For warm transfers to human
    owner_name: str = ""  # Business owner name for transfers/messages
    emergency_availability: str = "24/7 for emergencies"
    voice_id: str = "11labs-Adrian"
    model: str = "gpt-4.1"


class GreenLineAgentBuilder:
    """
    Builder class for creating Retell AI conversation flow agents
    programmatically for GreenLine AI clients.
    """

    def __init__(self, api_key: str, supabase_url: str = None, supabase_key: str = None):
        self.client = Retell(api_key=api_key)

        # Initialize Supabase client for CRM integration
        self.supabase: Optional[Client] = None
        if SUPABASE_AVAILABLE:
            sb_url = supabase_url or os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
            sb_key = supabase_key or os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
            if sb_url and sb_key:
                self.supabase = create_client(sb_url, sb_key)
                print("Supabase client initialized for CRM integration")

    def create_agent(self, config: GreenLineConfig, onboarding_id: str = None) -> dict:
        """
        Create a complete conversation flow agent for a GreenLine client.

        Args:
            config: GreenLineConfig with business details
            onboarding_id: Optional business_onboarding UUID to link agent to CRM

        Returns:
            dict with conversation_flow_id, agent_id, and onboarding_updated status
        """
        # Sanitize company name (removes accidental greeting phrases)
        config.company_name = sanitize_company_name(config.company_name)

        # Normalize phone numbers to E.164 format
        original_phone = config.phone_number
        original_transfer = config.transfer_number

        config.phone_number = normalize_phone_to_e164(config.phone_number)
        config.transfer_number = normalize_phone_to_e164(config.transfer_number)

        # Validate and warn about phone number issues
        phone_valid, phone_msg = validate_e164_phone(config.phone_number)
        transfer_valid, transfer_msg = validate_e164_phone(config.transfer_number)

        if not phone_valid:
            print(f"⚠️  WARNING: {phone_msg}")
            print(f"   Original input: '{original_phone}' -> Normalized: '{config.phone_number}'")
            print(f"   SMS confirmations may not work correctly.")

        if config.transfer_number and not transfer_valid:
            print(f"⚠️  WARNING: {transfer_msg}")
            print(f"   Original input: '{original_transfer}' -> Normalized: '{config.transfer_number}'")
            print(f"   Call transfers may fail.")

        if phone_valid:
            print(f"✓ Phone number formatted: {config.phone_number}")
        if config.transfer_number and transfer_valid:
            print(f"✓ Transfer number formatted: {config.transfer_number}")

        # Step 1: Create the conversation flow
        conversation_flow = self._create_conversation_flow(config)
        flow_id = conversation_flow.conversation_flow_id
        print(f"Created conversation flow: {flow_id}")

        # Step 2: Create the agent and attach the flow
        agent = self._create_voice_agent(config, flow_id)
        agent_id = agent.agent_id
        print(f"Created voice agent: {agent_id}")

        # Step 3: Link agent to business_onboarding for CRM integration
        onboarding_updated = False
        if onboarding_id:
            onboarding_updated = self.link_agent_to_onboarding(
                onboarding_id=onboarding_id,
                agent_id=agent_id,
                flow_id=flow_id
            )

        return {
            "conversation_flow_id": flow_id,
            "agent_id": agent_id,
            "config": config,
            "onboarding_updated": onboarding_updated
        }

    def link_agent_to_onboarding(
        self,
        onboarding_id: str,
        agent_id: str,
        flow_id: str = None,
        phone_number: str = None
    ) -> bool:
        """
        Link a Retell agent to a business_onboarding record for CRM integration.

        This enables the webhook at /api/inbound/webhook to:
        1. Identify which user owns the agent
        2. Create leads in the correct user's CRM
        3. Track call analytics per user

        Args:
            onboarding_id: UUID of the business_onboarding record
            agent_id: Retell agent ID
            flow_id: Optional conversation flow ID
            phone_number: Optional Retell phone number assigned to agent

        Returns:
            True if successfully updated, False otherwise
        """
        if not self.supabase:
            print("Warning: Supabase not configured. Cannot link agent to onboarding.")
            print("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.")
            return False

        try:
            update_data = {
                "retell_agent_id": agent_id,
                "status": "agent_created",
            }

            if phone_number:
                update_data["retell_phone_number"] = phone_number

            result = self.supabase.table("business_onboarding").update(
                update_data
            ).eq("id", onboarding_id).execute()

            if result.data:
                print(f"Linked agent {agent_id} to onboarding {onboarding_id}")
                print("CRM integration active: leads will be created from inbound calls")
                return True
            else:
                print(f"Warning: No onboarding record found with id {onboarding_id}")
                return False

        except Exception as e:
            print(f"Error linking agent to onboarding: {e}")
            return False

    def activate_onboarding(self, onboarding_id: str) -> bool:
        """
        Mark an onboarding as active (ready for calls).

        Args:
            onboarding_id: UUID of the business_onboarding record

        Returns:
            True if successfully updated
        """
        if not self.supabase:
            print("Warning: Supabase not configured.")
            return False

        try:
            result = self.supabase.table("business_onboarding").update({
                "status": "active"
            }).eq("id", onboarding_id).execute()

            if result.data:
                print(f"Onboarding {onboarding_id} is now active")
                return True
            return False

        except Exception as e:
            print(f"Error activating onboarding: {e}")
            return False

    def _create_conversation_flow(self, config: GreenLineConfig):
        """Create the conversation flow with all nodes and transitions."""

        # Build the nodes
        nodes = self._build_nodes(config)

        # Build custom tools for Cal.com calendar integration
        tools = self._build_calendar_tools(config)

        # Create the flow with tools
        return self.client.conversation_flow.create(
            model_choice={
                "type": "cascading",
                "model": config.model
            },
            nodes=nodes,
            tools=tools,
            start_speaker="agent",
            global_prompt=self._build_global_prompt(config),
            start_node_id="greeting",
            model_temperature=0.3
        )

    def _build_calendar_tools(self, config: GreenLineConfig) -> list:
        """
        Build custom tools for Cal.com calendar integration.

        These tools are called by function nodes to:
        1. Check calendar availability via Cal.com API
        2. Create bookings in Cal.com

        The webhook at config.webhook_url routes these to the appropriate
        calendar endpoints which look up the business's Cal.com credentials
        by agent_id and make the actual Cal.com API calls.
        """
        return [
            {
                "type": "custom",
                "tool_id": "check_calendar_availability",
                "name": "check_calendar_availability",
                "description": "Check available appointment times on the business calendar. Returns available time slots for scheduling appointments. Use this when a customer wants to book an appointment.",
                "url": config.webhook_url,
                "method": "POST",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "date_range": {
                            "type": "string",
                            "description": "Time range to check availability: 'today', 'tomorrow', 'this_week', 'next_week', or 'next_7_days' (default)"
                        }
                    }
                }
            },
            {
                "type": "custom",
                "tool_id": "create_calendar_booking",
                "name": "create_calendar_booking",
                "description": "Book an appointment on the business calendar. Creates a confirmed booking and sends confirmation to the customer. Use this after the customer has selected an available time slot.",
                "url": config.webhook_url,
                "method": "POST",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "attendee_name": {
                            "type": "string",
                            "description": "Customer's full name for the booking"
                        },
                        "attendee_phone": {
                            "type": "string",
                            "description": "Customer's phone number"
                        },
                        "attendee_email": {
                            "type": "string",
                            "description": "Customer's email address (optional, for confirmation)"
                        },
                        "start_time": {
                            "type": "string",
                            "description": "ISO datetime string for the appointment start time"
                        },
                        "service_type": {
                            "type": "string",
                            "description": "Type of service requested (e.g., 'Lawn Mowing', 'Tree Trimming')"
                        },
                        "notes": {
                            "type": "string",
                            "description": "Additional notes about the appointment or service needed"
                        }
                    },
                    "required": ["attendee_name", "attendee_phone", "start_time"]
                }
            }
        ]

    def _build_global_prompt(self, config: GreenLineConfig) -> str:
        """Build the global system prompt for the agent."""

        business_context = {
            "landscaping": "lawn care, landscaping design, tree trimming, irrigation systems, and seasonal maintenance",
            "hvac": "heating, ventilation, air conditioning installation, repair, and maintenance"
        }

        services_list = ", ".join(config.services) if config.services else business_context.get(config.business_type, "various services")
        areas_list = ", ".join(config.service_areas) if config.service_areas else "the local area"
        owner_name = config.owner_name or "the owner"

        return f"""You are a professional and friendly AI assistant answering calls for {config.company_name}. Your job is to provide excellent customer service, answer questions, book appointments, and ensure callers feel taken care of.

## Your Personality
- Professional yet warm - you represent the business well
- Patient and helpful - callers may be stressed about their issue
- Efficient - respect the caller's time
- Knowledgeable about the business you represent
- Calm during urgent situations - reassure callers that help is coming

## Business Information
- **Company Name:** {config.company_name}
- **Services Offered:** {services_list}
- **Service Area:** {areas_list}
- **Business Hours:** {config.business_hours}
- **Emergency Availability:** {config.emergency_availability}
- **Owner/Manager:** {owner_name}

## Your Goals (in order of priority)
1. **Greet professionally** - make callers feel they've reached a real, caring business
2. **Understand their need** - is it a service request, question, or emergency?
3. **Help if you can** - answer questions, book appointments, provide information
4. **Escalate appropriately** - transfer emergencies, take messages for complex issues
5. **Leave a positive impression** - every call reflects on the business

## Handling Different Call Types

**Service Appointment Requests:**
- Ask what service they need and briefly about the issue
- Confirm they're in the service area ({areas_list})
- Collect: name, phone number, address, and issue description
- Let them know someone will call back to schedule

**Questions About Services:**
- Provide information about {services_list}
- For pricing questions, explain that quotes vary by situation and offer to schedule an evaluation or callback
- Be helpful but don't make up information you don't have

**Emergency/Urgent Calls:**
- Take these seriously - the caller may be stressed
- If truly urgent, offer to transfer to {owner_name}
- If transfer isn't possible, take a detailed message and assure them it will be handled immediately

**Requests to Speak to Owner:**
- Ask if it's urgent/emergency or if a callback would work
- For emergencies, attempt transfer
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
- **Know your limits** - complex technical questions or complaints should go to {owner_name}

## Voice and Tone
- Speak clearly and at a moderate pace
- Use the business name naturally: "Thanks for calling {config.company_name}"
- Mirror the caller's urgency level - calm for routine, responsive for emergencies
- End every call positively: "Thanks for calling, have a great day!"
"""

    def _build_nodes(self, config: GreenLineConfig) -> list:
        """Build all conversation flow nodes matching RETELL-INCOMING-FLOW.md"""

        services_list = ", ".join(config.services) if config.services else "various services"
        areas_list = ", ".join(config.service_areas) if config.service_areas else "the local area"
        owner_name = config.owner_name or "the owner"

        nodes = [
            # ============ NODE 1: GREETING ============
            {
                "id": "greeting",
                "type": "conversation",
                "name": "Node 1: Greeting",
                "instruction": {
                    "type": "prompt",
                    "text": f"""Thank you for calling {config.company_name}! This is our AI assistant.
I can help you schedule a service appointment, answer questions about our services,
or connect you with {owner_name} if needed.

How can I help you today?"""
                },
                "edges": [
                    {
                        "id": "edge_greeting_to_collect_service",
                        "description": "Wants to schedule/book service",
                        "destination_node_id": "collect_service_details",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller wants to schedule service, book an appointment, get a quote, or needs work done"
                        }
                    },
                    {
                        "id": "edge_greeting_to_questions",
                        "description": "Has questions about services",
                        "destination_node_id": "answer_questions",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller has questions about services, pricing, hours, or general information"
                        }
                    },
                    {
                        "id": "edge_greeting_to_urgency",
                        "description": "Wants to speak to owner or has emergency",
                        "destination_node_id": "check_urgency",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller wants to speak to owner, a human, or has an emergency/urgent issue"
                        }
                    },
                    {
                        "id": "edge_greeting_to_solicitor",
                        "description": "Solicitor or spam call",
                        "destination_node_id": "end_solicitor",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller is a solicitor, sales call, or spam"
                        }
                    }
                ]
            },

            # ============ NODE 2: COLLECT SERVICE DETAILS ============
            {
                "id": "collect_service_details",
                "type": "conversation",
                "name": "Node 2: Collect Service Details",
                "instruction": {
                    "type": "prompt",
                    "text": f"""I'd be happy to help you schedule a service appointment.

First, can you tell me what type of service you need? We offer {services_list}."""
                },
                "edges": [
                    {
                        "id": "edge_service_to_ask",
                        "description": "Caller describes service needed",
                        "destination_node_id": "ask_service_info",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller has described what service or help they need"
                        }
                    },
                    {
                        "id": "edge_service_to_help",
                        "description": "Caller unsure what they need",
                        "destination_node_id": "help_identify_issue",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller is unsure what they need or can't describe the issue clearly"
                        }
                    },
                    {
                        "id": "edge_service_not_offered",
                        "description": "Service not offered",
                        "destination_node_id": "service_not_offered",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller is asking for a service we don't offer"
                        }
                    }
                ]
            },

            # ============ NODE 2a: ASK FOR SERVICE INFO ============
            {
                "id": "ask_service_info",
                "type": "conversation",
                "name": "Node 2a: Ask for Service Info",
                "instruction": {
                    "type": "prompt",
                    "text": f"""Great! To get you scheduled, I'll need a few details.

Can I get your name, a phone number where we can reach you, and the address where you need the service?

Also, is this urgent - do you need someone today or this week, or is your schedule flexible?"""
                },
                "edges": [
                    {
                        "id": "edge_ask_to_extract",
                        "description": "Caller provides their info",
                        "destination_node_id": "extract_service_info",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller has provided their contact information and service details"
                        }
                    },
                    {
                        "id": "edge_ask_to_message",
                        "description": "Caller prefers callback",
                        "destination_node_id": "take_message_intro",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller would rather receive a callback than provide all details now"
                        }
                    }
                ]
            },

            # ============ NODE 2b: EXTRACT SERVICE INFO ============
            {
                "id": "extract_service_info",
                "type": "extract_dynamic_variables",
                "name": "Node 2b: Extract Service Info",
                "variables": [
                    {
                        "name": "caller_name",
                        "type": "string",
                        "description": "The caller's full name"
                    },
                    {
                        "name": "caller_phone",
                        "type": "string",
                        "description": "The caller's phone number for callback"
                    },
                    {
                        "name": "service_address",
                        "type": "string",
                        "description": "The address where service is needed"
                    },
                    {
                        "name": "service_type",
                        "type": "string",
                        "description": "The type of service needed (e.g., lawn mowing, tree trimming)"
                    },
                    {
                        "name": "urgency",
                        "type": "string",
                        "description": "How urgent - today, this week, or flexible"
                    }
                ],
                "edges": [
                    {
                        "id": "edge_extract_to_area",
                        "description": "Got caller details",
                        "destination_node_id": "confirm_service_area",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "All required information has been collected"
                        }
                    }
                ]
            },

            # ============ NODE 2c: HELP IDENTIFY ISSUE ============
            {
                "id": "help_identify_issue",
                "type": "conversation",
                "name": "Node 2c: Help Identify Issue",
                "instruction": {
                    "type": "prompt",
                    "text": """No problem! Let me help you figure out what you need.

Can you describe what's happening? For example, is there something broken, not working right,
or are you looking for maintenance, installation, or an upgrade?"""
                },
                "edges": [
                    {
                        "id": "edge_help_to_ask",
                        "description": "Caller describes issue",
                        "destination_node_id": "ask_service_info",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller has described their issue or problem"
                        }
                    },
                    {
                        "id": "edge_help_to_message",
                        "description": "Still unclear, take message",
                        "destination_node_id": "take_message_intro",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller's needs are still unclear after trying to help - should take a message for callback"
                        }
                    }
                ]
            },

            # ============ NODE 3: CONFIRM SERVICE AREA ============
            {
                "id": "confirm_service_area",
                "type": "conversation",
                "name": "Node 3: Confirm Service Area",
                "instruction": {
                    "type": "prompt",
                    "text": f"""Great! We handle that all the time.

Just to confirm - are you located in {areas_list}?"""
                },
                "edges": [
                    {
                        "id": "edge_area_to_scheduling",
                        "description": "In service area",
                        "destination_node_id": "scheduling_intro",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller confirms they are in our service area"
                        }
                    },
                    {
                        "id": "edge_area_outside",
                        "description": "Outside service area",
                        "destination_node_id": "outside_service_area",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller is outside our service area"
                        }
                    }
                ]
            },

            # ============ NODE 3a: SCHEDULING INTRO ============
            {
                "id": "scheduling_intro",
                "type": "conversation",
                "name": "Node 3a: Scheduling Intro",
                "instruction": {
                    "type": "prompt",
                    "text": """Perfect! I'd be happy to get you scheduled for an appointment.

Do you have a general idea of when works best for you - are you looking for something this week, or is it more flexible?"""
                },
                "edges": [
                    {
                        "id": "edge_scheduling_to_availability",
                        "description": "Provides timing preference",
                        "destination_node_id": "check_availability",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller has indicated their timing preference or availability"
                        }
                    },
                    {
                        "id": "edge_scheduling_to_questions",
                        "description": "Wants more info first",
                        "destination_node_id": "answer_questions",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller wants to know more about services or pricing before scheduling"
                        }
                    },
                    {
                        "id": "edge_scheduling_to_message",
                        "description": "Changed mind, wants callback",
                        "destination_node_id": "take_message_intro",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller changed their mind and prefers a callback instead of scheduling now"
                        }
                    }
                ]
            },

            # ============ NODE 4: CHECK AVAILABILITY (Function Node) ============
            # This function node calls the check_calendar_availability tool
            # which hits the webhook and checks Cal.com for available slots
            {
                "id": "check_availability",
                "type": "function",
                "name": "Node 4: Check Calendar Availability",
                "tool_id": "check_calendar_availability",
                "tool_type": "local",
                "wait_for_result": True,
                "speak_during_execution": True,
                "instruction": {
                    "type": "prompt",
                    "text": "Let me check our availability for you. One moment please..."
                },
                "edges": [
                    {
                        "id": "edge_availability_to_offer",
                        "description": "Availability retrieved successfully",
                        "destination_node_id": "offer_times",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Calendar availability was retrieved successfully"
                        }
                    },
                    {
                        "id": "edge_availability_to_fallback",
                        "description": "Calendar not configured or error",
                        "destination_node_id": "availability_fallback",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Calendar is not configured or there was an error checking availability"
                        }
                    }
                ]
            },

            # ============ NODE 4-fallback: AVAILABILITY FALLBACK ============
            # Fallback when Cal.com is not configured for the business
            {
                "id": "availability_fallback",
                "type": "conversation",
                "name": "Node 4-fallback: Availability Fallback",
                "instruction": {
                    "type": "prompt",
                    "text": """I don't have direct access to the calendar right now, but I can take your information and have someone call you back to schedule.

Would that work for you? I just need your name, phone number, and a general idea of when works best for you."""
                },
                "edges": [
                    {
                        "id": "edge_fallback_to_message",
                        "description": "Caller agrees to callback",
                        "destination_node_id": "take_message_intro",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller agrees to receive a callback to schedule"
                        }
                    },
                    {
                        "id": "edge_fallback_to_end",
                        "description": "Caller declines",
                        "destination_node_id": "end_info_provided",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller declines or wants to call back later"
                        }
                    }
                ]
            },

            # ============ NODE 4a: OFFER TIMES ============
            {
                "id": "offer_times",
                "type": "conversation",
                "name": "Node 4a: Offer Times",
                "instruction": {
                    "type": "prompt",
                    "text": """I can see we have availability. Based on what you mentioned, would one of our upcoming openings work for you?

Or I can check other times if those don't fit your schedule."""
                },
                "edges": [
                    {
                        "id": "edge_offer_to_booking",
                        "description": "Accepts offered time",
                        "destination_node_id": "create_booking",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller accepts an offered appointment time"
                        }
                    },
                    {
                        "id": "edge_offer_different_time",
                        "description": "Requests different time",
                        "destination_node_id": "extract_preferred_time",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller wants a different time than what was offered"
                        }
                    },
                    {
                        "id": "edge_offer_to_urgency",
                        "description": "Wants to speak to owner",
                        "destination_node_id": "check_urgency",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller wants to speak to owner instead of booking"
                        }
                    }
                ]
            },

            # ============ NODE 4a-alt: EXTRACT PREFERRED TIME ============
            {
                "id": "extract_preferred_time",
                "type": "conversation",
                "name": "Node 4a-alt: Extract Preferred Time",
                "instruction": {
                    "type": "prompt",
                    "text": """No problem! What day and time would work better for you?

I'll see if we have availability then."""
                },
                "edges": [
                    {
                        "id": "edge_preferred_to_booking",
                        "description": "Time extracted",
                        "destination_node_id": "create_booking",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller has specified their preferred time and it's available"
                        }
                    },
                    {
                        "id": "edge_preferred_to_message",
                        "description": "Unable to find matching time",
                        "destination_node_id": "take_message_intro",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Unable to find an available time that matches caller's preference"
                        }
                    }
                ]
            },

            # ============ NODE 4b: CREATE BOOKING (Function Node) ============
            # This function node calls the create_calendar_booking tool
            # which hits the webhook and creates a booking in Cal.com
            {
                "id": "create_booking",
                "type": "function",
                "name": "Node 4b: Create Calendar Booking",
                "tool_id": "create_calendar_booking",
                "tool_type": "local",
                "wait_for_result": True,
                "speak_during_execution": True,
                "instruction": {
                    "type": "prompt",
                    "text": "Let me book that appointment for you now. One moment please..."
                },
                "edges": [
                    {
                        "id": "edge_booking_to_confirm",
                        "description": "Booking created successfully",
                        "destination_node_id": "booking_confirmation",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Booking was created successfully"
                        }
                    },
                    {
                        "id": "edge_booking_to_fallback",
                        "description": "Booking failed or calendar not configured",
                        "destination_node_id": "booking_fallback",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Booking failed or calendar is not configured"
                        }
                    }
                ]
            },

            # ============ NODE 4b-fallback: BOOKING FALLBACK ============
            # Fallback when booking fails or Cal.com is not configured
            {
                "id": "booking_fallback",
                "type": "conversation",
                "name": "Node 4b-fallback: Booking Fallback",
                "instruction": {
                    "type": "prompt",
                    "text": """I wasn't able to complete the booking in our system right now, but don't worry - I have all your information.

I'll make sure someone calls you back shortly to confirm your appointment. You should hear from us within the hour.

Is there anything else I can help you with?"""
                },
                "edges": [
                    {
                        "id": "edge_booking_fallback_to_end",
                        "description": "Caller is satisfied",
                        "destination_node_id": "end_message_taken",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller acknowledges and is satisfied"
                        }
                    },
                    {
                        "id": "edge_booking_fallback_to_questions",
                        "description": "Caller has questions",
                        "destination_node_id": "answer_questions",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller has additional questions"
                        }
                    }
                ]
            },

            # ============ NODE 4c: BOOKING CONFIRMATION ============
            {
                "id": "booking_confirmation",
                "type": "conversation",
                "name": "Node 4c: Booking Confirmation",
                "instruction": {
                    "type": "prompt",
                    "text": """Your appointment is confirmed! I'll send you a text message with all the details right now.

Is there anything else I can help you with today?"""
                },
                "edges": [
                    {
                        "id": "edge_confirm_to_sms",
                        "description": "Send confirmation SMS",
                        "destination_node_id": "send_confirmation_sms",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller acknowledges the booking or says they're all set"
                        }
                    },
                    {
                        "id": "edge_confirm_to_questions",
                        "description": "Has another question",
                        "destination_node_id": "answer_questions",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller has additional questions before ending"
                        }
                    }
                ]
            },

            # ============ NODE 4d: SEND CONFIRMATION SMS ============
            {
                "id": "send_confirmation_sms",
                "type": "sms",
                "name": "Node 4d: Send Confirmation SMS",
                "instruction": {
                    "type": "prompt",
                    "text": f"""Send an SMS confirmation to the caller with the following information:
- Company name: {config.company_name}
- Service type they requested
- Their appointment date and time
- A friendly reminder to call if they need to reschedule
- The business phone number: {config.phone_number}

Keep the message concise and professional."""
                },
                "success_edge": {
                    "id": "edge_sms_success",
                    "description": "SMS sent successfully",
                    "destination_node_id": "end_appointment_booked",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Sent successfully"
                    }
                },
                "failed_edge": {
                    "id": "edge_sms_failed",
                    "description": "SMS failed to send",
                    "destination_node_id": "end_appointment_booked",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Failed to send"
                    }
                }
            },

            # ============ NODE 5: ANSWER QUESTIONS ============
            {
                "id": "answer_questions",
                "type": "conversation",
                "name": "Node 5: Answer Questions",
                "instruction": {
                    "type": "prompt",
                    "text": f"""Of course! I'm happy to help with any questions.

Here's what I can tell you about {config.company_name}:

**Services we offer**: {services_list}
**Service area**: {areas_list}
**Hours**: {config.business_hours}
**Emergencies**: {config.emergency_availability}

What would you like to know more about?"""
                },
                "edges": [
                    {
                        "id": "edge_questions_to_collect",
                        "description": "Wants to book after questions",
                        "destination_node_id": "collect_service_details",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Question answered and caller now wants to schedule service"
                        }
                    },
                    {
                        "id": "edge_questions_to_end",
                        "description": "Questions answered, done",
                        "destination_node_id": "end_info_provided",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller's questions are answered and they don't need to schedule"
                        }
                    },
                    {
                        "id": "edge_questions_to_urgency",
                        "description": "Wants to speak to owner",
                        "destination_node_id": "check_urgency",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller wants to speak to owner or a human"
                        }
                    },
                    {
                        "id": "edge_questions_to_pricing",
                        "description": "Has pricing question",
                        "destination_node_id": "pricing_response",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller is asking about pricing or costs"
                        }
                    }
                ]
            },

            # ============ NODE 5a: SERVICE NOT OFFERED ============
            {
                "id": "service_not_offered",
                "type": "conversation",
                "name": "Node 5a: Service Not Offered",
                "instruction": {
                    "type": "prompt",
                    "text": f"""I apologize, but {config.company_name} doesn't offer that particular service.

Our specialties are {services_list}.

Is there something else I can help you with today?"""
                },
                "edges": [
                    {
                        "id": "edge_not_offered_to_collect",
                        "description": "Has different need we can help",
                        "destination_node_id": "collect_service_details",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller has a different need that we can help with"
                        }
                    },
                    {
                        "id": "edge_not_offered_to_end",
                        "description": "Caller done",
                        "destination_node_id": "end_info_provided",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller doesn't need anything else"
                        }
                    }
                ]
            },

            # ============ NODE 5b: OUTSIDE SERVICE AREA ============
            {
                "id": "outside_service_area",
                "type": "conversation",
                "name": "Node 5b: Outside Service Area",
                "instruction": {
                    "type": "static_text",
                    "text": f"""I'm sorry, but that location is outside our current service area.
We primarily serve {areas_list}.

Is there anything else I can help you with?"""
                },
                "edges": [
                    {
                        "id": "edge_outside_to_end",
                        "description": "Done",
                        "destination_node_id": "end_info_provided",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller is done or says goodbye"
                        }
                    },
                    {
                        "id": "edge_outside_continue",
                        "description": "Has other questions",
                        "destination_node_id": "answer_questions",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller has other questions or wants to check a different location"
                        }
                    }
                ]
            },

            # ============ NODE 5c: PRICING RESPONSE ============
            {
                "id": "pricing_response",
                "type": "conversation",
                "name": "Node 5c: Pricing Response",
                "instruction": {
                    "type": "prompt",
                    "text": f"""Great question! Pricing can vary depending on the specific situation.

For an accurate quote, I'd recommend scheduling a quick evaluation appointment,
or I can have {owner_name} give you a call back to discuss pricing.

Which would work better for you?"""
                },
                "edges": [
                    {
                        "id": "edge_pricing_to_collect",
                        "description": "Wants appointment for quote",
                        "destination_node_id": "collect_service_details",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller wants to schedule an appointment for a quote or evaluation"
                        }
                    },
                    {
                        "id": "edge_pricing_to_message",
                        "description": "Wants callback",
                        "destination_node_id": "take_message_intro",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller prefers a callback to discuss pricing"
                        }
                    },
                    {
                        "id": "edge_pricing_to_end",
                        "description": "Done for now",
                        "destination_node_id": "end_info_provided",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller is done for now and doesn't want to schedule or get a callback"
                        }
                    }
                ]
            },

            # ============ NODE 8: CHECK URGENCY ============
            {
                "id": "check_urgency",
                "type": "conversation",
                "name": "Node 8: Check Urgency",
                "instruction": {
                    "type": "prompt",
                    "text": f"""I understand you'd like to speak with {owner_name} directly.

Is this an emergency situation that needs immediate attention,
or would you prefer a callback when {owner_name} is available?"""
                },
                "edges": [
                    {
                        "id": "edge_urgency_to_transfer",
                        "description": "Emergency - needs immediate help",
                        "destination_node_id": "transfer_call",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller has an emergency or urgent situation needing immediate attention"
                        }
                    },
                    {
                        "id": "edge_urgency_to_message",
                        "description": "Not urgent - callback is fine",
                        "destination_node_id": "take_message_intro",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller says it's not urgent and a callback would be fine"
                        }
                    },
                    {
                        "id": "edge_urgency_to_questions",
                        "description": "Just had a quick question",
                        "destination_node_id": "answer_questions",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller just had a quick question that the AI can help with"
                        }
                    }
                ]
            },

            # ============ NODE 8a: CALL TRANSFER ============
            # Actual call transfer node - transfers to owner/manager
            {
                "id": "transfer_call",
                "type": "transfer_call",
                "name": "Node 8a: Transfer to Owner",
                "transfer_destination": {
                    "type": "predefined",
                    "number": config.transfer_number if config.transfer_number else "+15551234567",
                    "ignore_e164_validation": False
                },
                "transfer_option": {
                    "type": "warm_transfer",
                    "show_transferee_as_caller": True
                },
                "instruction": {
                    "type": "prompt",
                    "text": f"I'm transferring you to {owner_name} now. Please hold for just a moment."
                },
                "speak_during_execution": True,
                "edge": {
                    "id": "edge_transfer_failed",
                    "description": "Transfer failed - take message instead",
                    "destination_node_id": "transfer_failed_message",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Transfer failed"
                    }
                }
            },

            # ============ NODE 8b: TRANSFER FAILED - TAKE MESSAGE ============
            {
                "id": "transfer_failed_message",
                "type": "conversation",
                "name": "Node 8b: Transfer Failed",
                "instruction": {
                    "type": "prompt",
                    "text": f"""I apologize, but I wasn't able to connect you with {owner_name} right now.

Let me take down your information so {owner_name} can call you back as soon as possible - this will be marked as urgent.

Can I get your name and the best number to reach you at?"""
                },
                "edges": [
                    {
                        "id": "edge_transfer_failed_to_message",
                        "description": "Collect caller info for urgent callback",
                        "destination_node_id": "take_message_intro",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller provides their information"
                        }
                    }
                ]
            },

            # ============ NODE 9: ASK FOR MESSAGE INFO ============
            {
                "id": "take_message_intro",
                "type": "conversation",
                "name": "Node 9: Ask for Message Info",
                "instruction": {
                    "type": "prompt",
                    "text": f"""I'd be happy to take a message for {owner_name}.

Can I get your name, a phone number where you can be reached, and briefly what you're calling about?

Also, when is the best time for a callback - morning, afternoon, or evening?"""
                },
                "edges": [
                    {
                        "id": "edge_intro_to_extract",
                        "description": "Caller provides message info",
                        "destination_node_id": "take_message",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller has provided their name, phone number, and reason for calling"
                        }
                    }
                ]
            },

            # ============ NODE 9a: EXTRACT MESSAGE INFO ============
            {
                "id": "take_message",
                "type": "extract_dynamic_variables",
                "name": "Node 9a: Extract Message Info",
                "variables": [
                    {
                        "name": "message_name",
                        "type": "string",
                        "description": "The caller's name for the message"
                    },
                    {
                        "name": "message_phone",
                        "type": "string",
                        "description": "The caller's phone number for callback"
                    },
                    {
                        "name": "message_reason",
                        "type": "string",
                        "description": "The reason for the call or message content"
                    },
                    {
                        "name": "callback_time",
                        "type": "string",
                        "description": "Best time to call back (morning, afternoon, evening, anytime)"
                    }
                ],
                "edges": [
                    {
                        "id": "edge_message_to_confirm",
                        "description": "Message captured",
                        "destination_node_id": "confirm_message",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "All message information has been collected"
                        }
                    }
                ]
            },

            # ============ NODE 9b: CONFIRM MESSAGE ============
            {
                "id": "confirm_message",
                "type": "conversation",
                "name": "Node 9b: Confirm Message",
                "instruction": {
                    "type": "prompt",
                    "text": f"""I've got it. Let me confirm the details back to you:

[Read back the name, phone number, and reason for calling]

I'll make sure {owner_name} gets this message and calls you back as soon as possible.
I'll also send you a text message confirming we received your message.
Is there anything else you'd like me to add?"""
                },
                "edges": [
                    {
                        "id": "edge_confirm_msg_to_sms",
                        "description": "Message confirmed - send SMS",
                        "destination_node_id": "send_message_confirmation_sms",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller confirms the message is correct"
                        }
                    },
                    {
                        "id": "edge_confirm_msg_loop",
                        "description": "Needs correction",
                        "destination_node_id": "take_message_intro",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller wants to correct or change something in the message"
                        }
                    }
                ]
            },

            # ============ NODE 9c: SEND MESSAGE CONFIRMATION SMS ============
            {
                "id": "send_message_confirmation_sms",
                "type": "sms",
                "name": "Node 9c: Send Message Confirmation SMS",
                "instruction": {
                    "type": "prompt",
                    "text": f"""Send an SMS confirmation that their message was received:
- Thank them for calling {config.company_name}
- Confirm their message has been received
- Let them know {owner_name} will call them back soon
- Include the business phone number: {config.phone_number}

Keep the message brief and reassuring."""
                },
                "success_edge": {
                    "id": "edge_msg_sms_success",
                    "description": "SMS sent successfully",
                    "destination_node_id": "end_message_taken",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Sent successfully"
                    }
                },
                "failed_edge": {
                    "id": "edge_msg_sms_failed",
                    "description": "SMS failed to send",
                    "destination_node_id": "end_message_taken",
                    "transition_condition": {
                        "type": "prompt",
                        "prompt": "Failed to send"
                    }
                }
            },

            # ============ ENDING NODES ============

            # Node 10: End - Info Provided
            {
                "id": "end_info_provided",
                "type": "end",
                "name": "Node 10: End - Info Provided",
                "instruction": {
                    "type": "static_text",
                    "text": f"""You're welcome! Thanks for calling {config.company_name}.
If you need anything else, don't hesitate to call back.
Have a great day!"""
                }
            },

            # Node 11: End - Appointment Booked
            {
                "id": "end_appointment_booked",
                "type": "end",
                "name": "Node 11: End - Appointment Booked",
                "instruction": {
                    "type": "prompt",
                    "text": f"""Your appointment is all set!
Thanks for choosing {config.company_name}!
We look forward to helping you.
Have a great day!"""
                }
            },

            # Node 12: End - Solicitor
            {
                "id": "end_solicitor",
                "type": "end",
                "name": "Node 12: End - Solicitor",
                "instruction": {
                    "type": "static_text",
                    "text": """I'm sorry, but we're not interested at this time.
Please remove this number from your calling list.
Thank you, goodbye."""
                }
            },

            # Node 13: End - Message Taken
            {
                "id": "end_message_taken",
                "type": "end",
                "name": "Node 13: End - Message Taken",
                "instruction": {
                    "type": "prompt",
                    "text": f"""I'll make sure {owner_name} gets your message right away.
Thanks for calling {config.company_name}, and have a wonderful day!"""
                }
            }
        ]

        return nodes

    def _create_voice_agent(self, config: GreenLineConfig, flow_id: str):
        """Create the voice agent and attach the conversation flow."""

        agent_params = {
            "agent_name": f"{config.company_name} AI Receptionist",
            "response_engine": {
                "type": "conversation-flow",
                "conversation_flow_id": flow_id
            },
            "voice_id": config.voice_id,
            "language": "en-US",
        }

        # Add webhook URL for CRM integration
        # This sends call data (including extracted lead info) to our backend
        if config.webhook_url:
            agent_params["webhook_url"] = config.webhook_url
            print(f"Webhook configured: {config.webhook_url}")

        return self.client.agent.create(**agent_params)


def create_demo_agent(onboarding_id: str = None):
    """
    Create a demo agent with sample configuration.

    Args:
        onboarding_id: Optional business_onboarding UUID to link for CRM integration
    """

    # Get API key from environment
    api_key = os.environ.get("RETELL_API_KEY")
    if not api_key:
        raise ValueError("RETELL_API_KEY environment variable not set")

    # Sample configuration for a landscaping company
    # Note: Phone numbers can be in any format - they'll be auto-converted to E.164
    # Examples: "408-555-1234", "(408) 555-1234", "4085551234" all become "+14085551234"
    config = GreenLineConfig(
        company_name="Green Valley Landscaping",
        business_type="landscaping",
        phone_number="(619) 555-1234",  # Will be normalized to +16195551234
        business_hours="8 AM to 6 PM, Monday through Saturday",
        services=[
            "Lawn Mowing & Maintenance",
            "Landscaping Design",
            "Tree Trimming & Removal",
            "Irrigation Systems",
            "Seasonal Cleanups",
            "Mulching & Bed Maintenance"
        ],
        service_areas=[
            "San Diego",
            "La Jolla",
            "Del Mar",
            "Encinitas",
            "Carlsbad"
        ],
        webhook_url=DEFAULT_WEBHOOK_URL,  # Auto-sends leads to GreenLine CRM
        transfer_number="619-555-1234",  # Will be normalized to +16195551234
        owner_name="Mike",
        emergency_availability="24/7 for emergencies",
        voice_id="11labs-Adrian",
        model="gpt-4.1"
    )

    # Create the agent with CRM integration
    builder = GreenLineAgentBuilder(api_key)
    result = builder.create_agent(config, onboarding_id=onboarding_id)

    print("\n" + "=" * 50)
    print("GreenLine AI Agent Created Successfully!")
    print("=" * 50)
    print(f"Conversation Flow ID: {result['conversation_flow_id']}")
    print(f"Agent ID: {result['agent_id']}")
    print(f"Company: {config.company_name}")
    print(f"Webhook URL: {config.webhook_url}")
    print(f"CRM Linked: {result.get('onboarding_updated', False)}")
    print("=" * 50)

    return result


def create_agent_for_onboarding(onboarding_id: str) -> dict:
    """
    Create an agent for a specific business_onboarding record.

    This is the main function to use when deploying agents for new clients.
    It reads the onboarding data from Supabase and creates a fully configured agent.

    Args:
        onboarding_id: UUID of the business_onboarding record

    Returns:
        dict with agent details and CRM link status
    """
    api_key = os.environ.get("RETELL_API_KEY")
    if not api_key:
        raise ValueError("RETELL_API_KEY environment variable not set")

    builder = GreenLineAgentBuilder(api_key)

    if not builder.supabase:
        raise ValueError("Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")

    # Fetch onboarding data
    result = builder.supabase.table("business_onboarding").select("*").eq("id", onboarding_id).single().execute()

    if not result.data:
        raise ValueError(f"No onboarding record found with id {onboarding_id}")

    onboarding = result.data

    # Build config from onboarding data
    config = GreenLineConfig(
        company_name=onboarding.get("greeting_name") or onboarding["business_name"],
        business_type=onboarding["business_type"],
        phone_number=onboarding["phone"],
        business_hours=_build_business_hours(onboarding),
        services=onboarding.get("services", []),
        service_areas=[onboarding.get("city", ""), onboarding.get("state", "")],
        webhook_url=DEFAULT_WEBHOOK_URL,
        transfer_number=onboarding.get("phone", ""),
        owner_name=onboarding["owner_name"],
        voice_id=_map_voice_preference(onboarding.get("preferred_voice", "professional_male")),
        model="gpt-4.1"
    )

    # Create the agent and link to onboarding
    agent_result = builder.create_agent(config, onboarding_id=onboarding_id)

    print(f"\nAgent created for {onboarding['business_name']}")
    print(f"Leads from calls will appear in their CRM dashboard")

    return agent_result


def _build_business_hours(onboarding: dict) -> str:
    """Build business hours string from onboarding data."""
    days = []
    day_map = {
        "hours_monday": "Monday",
        "hours_tuesday": "Tuesday",
        "hours_wednesday": "Wednesday",
        "hours_thursday": "Thursday",
        "hours_friday": "Friday",
        "hours_saturday": "Saturday",
        "hours_sunday": "Sunday",
    }

    for field, day_name in day_map.items():
        hours = onboarding.get(field)
        if hours:
            days.append(f"{day_name}: {hours}")

    return "; ".join(days) if days else "8 AM to 6 PM, Monday through Friday"


def _map_voice_preference(preference: str) -> str:
    """Map voice preference to Retell voice ID."""
    voice_map = {
        "professional_male": "11labs-Adrian",
        "professional_female": "11labs-Rachel",
        "friendly_male": "11labs-Drew",
        "friendly_female": "11labs-Sarah",
    }
    return voice_map.get(preference, "11labs-Adrian")


if __name__ == "__main__":
    create_demo_agent()

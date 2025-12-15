import os
import json
from typing import Optional
from dataclasses import dataclass, field
from retell import Retell


@dataclass
class GreenLineConfig:
    """Configuration for a GreenLine AI agent deployment."""
    company_name: str
    business_type: str  # 'landscaping' or 'hvac'
    phone_number: str
    business_hours: str = "8 AM to 6 PM, Monday through Saturday"
    services: list = field(default_factory=list)
    service_areas: list = field(default_factory=list)
    webhook_base_url: str = ""
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

    def __init__(self, api_key: str):
        self.client = Retell(api_key=api_key)

    def create_agent(self, config: GreenLineConfig) -> dict:
        """
        Create a complete conversation flow agent for a GreenLine client.

        Returns:
            dict with conversation_flow_id and agent_id
        """
        # Step 1: Create the conversation flow
        conversation_flow = self._create_conversation_flow(config)
        flow_id = conversation_flow.conversation_flow_id
        print(f"Created conversation flow: {flow_id}")

        # Step 2: Create the agent and attach the flow
        agent = self._create_voice_agent(config, flow_id)
        agent_id = agent.agent_id
        print(f"Created voice agent: {agent_id}")

        return {
            "conversation_flow_id": flow_id,
            "agent_id": agent_id,
            "config": config
        }

    def _create_conversation_flow(self, config: GreenLineConfig):
        """Create the conversation flow with all nodes and transitions."""

        # Build the nodes
        nodes = self._build_nodes(config)

        # Create the flow
        return self.client.conversation_flow.create(
            model_choice={
                "type": "cascading",
                "model": config.model
            },
            nodes=nodes,
            start_speaker="agent",
            global_prompt=self._build_global_prompt(config),
            start_node_id="greeting",
            model_temperature=0.3
        )

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
                        "id": "edge_service_to_extract",
                        "description": "Caller describes service needed",
                        "destination_node_id": "extract_service_info",
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

            # ============ NODE 2a: EXTRACT SERVICE INFO ============
            {
                "id": "extract_service_info",
                "type": "extract_dynamic_variables",
                "name": "Node 2a: Extract Service Info",
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
                "success_edge": {
                    "id": "edge_extract_to_area",
                    "description": "Got caller details",
                    "destination_node_id": "confirm_service_area"
                }
            },

            # ============ NODE 2b: HELP IDENTIFY ISSUE ============
            {
                "id": "help_identify_issue",
                "type": "conversation",
                "name": "Node 2b: Help Identify Issue",
                "instruction": {
                    "type": "prompt",
                    "text": """No problem! Let me help you figure out what you need.

Can you describe what's happening? For example, is there something broken, not working right,
or are you looking for maintenance, installation, or an upgrade?"""
                },
                "edges": [
                    {
                        "id": "edge_help_to_extract",
                        "description": "Caller describes issue",
                        "destination_node_id": "extract_service_info",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller has described their issue or problem"
                        }
                    },
                    {
                        "id": "edge_help_to_message",
                        "description": "Still unclear, take message",
                        "destination_node_id": "take_message",
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
                        "destination_node_id": "take_message",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller changed their mind and prefers a callback instead of scheduling now"
                        }
                    }
                ]
            },

            # ============ NODE 4: CHECK AVAILABILITY ============
            # Note: In production, this would connect to Cal.com via tools configured in Retell dashboard
            {
                "id": "check_availability",
                "type": "conversation",
                "name": "Node 4: Check Availability",
                "instruction": {
                    "type": "prompt",
                    "text": """Let me check our availability for you.

Based on your preference, we typically have openings throughout the week.
Would a morning or afternoon appointment work better for you?"""
                },
                "edges": [
                    {
                        "id": "edge_availability_to_offer",
                        "description": "Caller provides preference",
                        "destination_node_id": "offer_times",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller has indicated a time preference (morning, afternoon, specific day)"
                        }
                    },
                    {
                        "id": "edge_availability_to_message",
                        "description": "Caller wants callback instead",
                        "destination_node_id": "take_message",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller prefers a callback to schedule or is unsure about timing"
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
                        "destination_node_id": "take_message",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Unable to find an available time that matches caller's preference"
                        }
                    }
                ]
            },

            # ============ NODE 4b: CREATE BOOKING ============
            # Note: In production, this would create a booking via Cal.com tools in Retell dashboard
            {
                "id": "create_booking",
                "type": "conversation",
                "name": "Node 4b: Create Booking",
                "instruction": {
                    "type": "prompt",
                    "text": """Let me confirm those details and get you scheduled.

So I have:
- Your name and contact info
- The service you need
- Your preferred appointment time

I'm scheduling that for you now. One moment please..."""
                },
                "edges": [
                    {
                        "id": "edge_booking_to_confirm",
                        "description": "Proceed to confirmation",
                        "destination_node_id": "booking_confirmation",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Ready to confirm the booking details with the caller"
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
                    "type": "static_text",
                    "text": """Your appointment is confirmed! You should receive a confirmation with all the details.

Is there anything else I can help you with today?"""
                },
                "edges": [
                    {
                        "id": "edge_confirm_to_end_booked",
                        "description": "No, all set",
                        "destination_node_id": "end_appointment_booked",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller is satisfied and has no more questions"
                        }
                    },
                    {
                        "id": "edge_confirm_to_questions",
                        "description": "Has another question",
                        "destination_node_id": "answer_questions",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller has additional questions"
                        }
                    }
                ]
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
                        "destination_node_id": "take_message",
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
                        "destination_node_id": "take_message",
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

            # ============ NODE 8a: TRANSFER/URGENT HANDLING ============
            # Note: For actual call transfer, configure in Retell dashboard
            {
                "id": "transfer_call",
                "type": "conversation",
                "name": "Node 8a: Urgent Call Handling",
                "instruction": {
                    "type": "prompt",
                    "text": f"""I understand this is urgent and you need to speak with {owner_name} right away.

Let me take down your information so {owner_name} can call you back immediately - this will be treated as a priority callback.

Can I get your name and the best number to reach you at?"""
                },
                "edges": [
                    {
                        "id": "edge_urgent_to_message",
                        "description": "Collect urgent message details",
                        "destination_node_id": "take_message",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller provides their information or agrees to leave a message"
                        }
                    }
                ]
            },

            # ============ NODE 9: TAKE MESSAGE ============
            {
                "id": "take_message",
                "type": "extract_dynamic_variables",
                "name": "Node 9: Take Message",
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
                "success_edge": {
                    "id": "edge_message_to_confirm",
                    "description": "Message captured",
                    "destination_node_id": "confirm_message"
                }
            },

            # ============ NODE 9a: CONFIRM MESSAGE ============
            {
                "id": "confirm_message",
                "type": "conversation",
                "name": "Node 9a: Confirm Message",
                "instruction": {
                    "type": "prompt",
                    "text": f"""I've got it. Let me confirm the details back to you:

[Read back the name, phone number, and reason for calling]

I'll make sure {owner_name} gets this message and calls you back as soon as possible.
Is there anything else you'd like me to add?"""
                },
                "edges": [
                    {
                        "id": "edge_confirm_msg_to_end",
                        "description": "Message confirmed",
                        "destination_node_id": "end_message_taken",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller confirms the message is correct"
                        }
                    },
                    {
                        "id": "edge_confirm_msg_loop",
                        "description": "Needs correction",
                        "destination_node_id": "take_message",
                        "transition_condition": {
                            "type": "prompt",
                            "prompt": "Caller wants to correct or change something in the message"
                        }
                    }
                ]
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

        return self.client.agent.create(
            agent_name=f"{config.company_name} AI Receptionist",
            response_engine={
                "type": "conversation-flow",
                "conversation_flow_id": flow_id
            },
            voice_id=config.voice_id,
            language="en-US",
        )


def create_demo_agent():
    """Create a demo agent with sample configuration."""

    # Get API key from environment
    api_key = os.environ.get("RETELL_API_KEY")
    if not api_key:
        raise ValueError("RETELL_API_KEY environment variable not set")

    # Sample configuration for a landscaping company
    config = GreenLineConfig(
        company_name="Green Valley Landscaping",
        business_type="landscaping",
        phone_number="(555) 123-4567",
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
        webhook_base_url="https://your-webhook-server.com",
        transfer_number="+15551234567",
        owner_name="Mike",
        emergency_availability="24/7 for emergencies",
        voice_id="11labs-Adrian",
        model="gpt-4.1"
    )

    # Create the agent
    builder = GreenLineAgentBuilder(api_key)
    result = builder.create_agent(config)

    print("\n" + "=" * 50)
    print("GreenLine AI Agent Created Successfully!")
    print("=" * 50)
    print(f"Conversation Flow ID: {result['conversation_flow_id']}")
    print(f"Agent ID: {result['agent_id']}")
    print(f"Company: {config.company_name}")
    print("=" * 50)

    return result


if __name__ == "__main__":
    create_demo_agent()

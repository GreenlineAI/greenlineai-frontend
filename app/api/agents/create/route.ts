/**
 * API Route - Create Retell AI Agent
 * Path: /api/agents/create
 *
 * Creates a Retell AI voice agent from onboarding data.
 * One-click deploy from admin dashboard.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Default webhook URL for CRM integration
const DEFAULT_WEBHOOK_URL = 'https://www.greenline-ai.com/api/inbound/webhook';

// Retell API base URL
const RETELL_API_BASE = 'https://api.retellai.com';

// Initialize Supabase with service role
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseKey);
}

// Helper function to call Retell API using fetch
async function callRetellAPI(
  endpoint: string,
  method: string,
  body?: any
): Promise<any> {
  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey) {
    throw new Error('RETELL_API_KEY not configured');
  }

  const url = `${RETELL_API_BASE}${endpoint}`;

  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Retell API error (${response.status}): ${errorText}`
    );
  }

  return response.json();
}

interface OnboardingData {
  id: string;
  user_id?: string;
  business_name: string;
  business_type: string;
  business_type_other?: string;
  owner_name: string;
  email: string;
  phone: string;
  website?: string;
  city: string;
  state: string;
  zip?: string;
  service_radius_miles: number;
  services: string[];
  hours_monday?: string;
  hours_tuesday?: string;
  hours_wednesday?: string;
  hours_thursday?: string;
  hours_friday?: string;
  hours_saturday?: string;
  hours_sunday?: string;
  greeting_name?: string;
  appointment_duration?: number;
  calendar_link?: string;
  pricing_info?: string;
  special_instructions?: string;
  phone_preference?: string;
  existing_phone_number?: string;
  preferred_voice?: string;
  retell_agent_id?: string;
  retell_phone_number?: string;
  status?: string;
}

interface CreateAgentRequest {
  onboarding_id: string;
  assign_phone?: boolean;
  area_code?: string;
}

// Voice mapping
function mapVoicePreference(preference?: string): string {
  const voiceMap: Record<string, string> = {
    professional_male: '11labs-Adrian',
    professional_female: '11labs-Rachel',
    friendly_male: '11labs-Drew',
    friendly_female: '11labs-Sarah',
  };
  return voiceMap[preference || 'professional_male'] || '11labs-Adrian';
}

// Build business hours string
function buildBusinessHours(onboarding: OnboardingData): string {
  const days = [
    { name: 'Monday', hours: onboarding.hours_monday },
    { name: 'Tuesday', hours: onboarding.hours_tuesday },
    { name: 'Wednesday', hours: onboarding.hours_wednesday },
    { name: 'Thursday', hours: onboarding.hours_thursday },
    { name: 'Friday', hours: onboarding.hours_friday },
    { name: 'Saturday', hours: onboarding.hours_saturday },
    { name: 'Sunday', hours: onboarding.hours_sunday },
  ];

  const formattedDays = days
    .filter((d) => d.hours)
    .map((d) => `${d.name}: ${d.hours}`);

  return formattedDays.length > 0
    ? formattedDays.join('; ')
    : '8 AM to 6 PM, Monday through Friday';
}

// Build the global prompt for the agent
function buildGlobalPrompt(onboarding: OnboardingData): string {
  const servicesList = onboarding.services.join(', ') || 'various services';
  const areasText = `${onboarding.city}, ${onboarding.state}`;
  const ownerName = onboarding.owner_name || 'the owner';
  const companyName = onboarding.greeting_name || onboarding.business_name;
  const businessHours = buildBusinessHours(onboarding);

  return `You are a professional and friendly AI assistant answering calls for ${companyName}. Your job is to provide excellent customer service, answer questions, book appointments, and ensure callers feel taken care of.

## Your Personality
- Professional yet warm - you represent the business well
- Patient and helpful - callers may be stressed about their issue
- Efficient - respect the caller's time
- Knowledgeable about the business you represent
- Calm during urgent situations - reassure callers that help is coming

## Business Information
- **Company Name:** ${companyName}
- **Services Offered:** ${servicesList}
- **Service Area:** ${areasText} (${onboarding.service_radius_miles} mile radius)
- **Business Hours:** ${businessHours}
- **Owner/Manager:** ${ownerName}

## Your Goals (in order of priority)
1. **Greet professionally** - make callers feel they've reached a real, caring business
2. **Understand their need** - is it a service request, question, or emergency?
3. **Help if you can** - answer questions, book appointments, provide information
4. **Escalate appropriately** - transfer emergencies, take messages for complex issues
5. **Leave a positive impression** - every call reflects on the business

## Handling Different Call Types

**Service Appointment Requests:**
- Ask what service they need and briefly about the issue
- Confirm they're in the service area (${areasText})
- Collect: name, phone number, address, and issue description
- Let them know someone will call back to schedule

**Questions About Services:**
- Provide information about ${servicesList}
- For pricing questions, explain that quotes vary by situation and offer to schedule an evaluation or callback
- Be helpful but don't make up information you don't have

**Emergency/Urgent Calls:**
- Take these seriously - the caller may be stressed
- If truly urgent, offer to transfer to ${ownerName}
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
- **Know your limits** - complex technical questions or complaints should go to ${ownerName}

${onboarding.pricing_info ? `## Pricing Information\n${onboarding.pricing_info}` : ''}

${onboarding.special_instructions ? `## Special Instructions\n${onboarding.special_instructions}` : ''}`;
}

// Build calendar tools for the agent
function buildCalendarTools(webhookUrl: string): object[] {
  return [
    {
      type: 'custom',
      tool_id: 'check_calendar_availability',
      name: 'check_calendar_availability',
      description:
        'Check available appointment times on the business calendar. Returns available time slots for scheduling appointments.',
      url: webhookUrl,
      method: 'POST',
      parameters: {
        type: 'object',
        properties: {
          date_range: {
            type: 'string',
            description:
              "Time range to check: 'today', 'tomorrow', 'this_week', 'next_week', or 'next_7_days'",
          },
        },
      },
    },
    {
      type: 'custom',
      tool_id: 'create_calendar_booking',
      name: 'create_calendar_booking',
      description:
        'Book an appointment on the business calendar. Creates a confirmed booking.',
      url: webhookUrl,
      method: 'POST',
      parameters: {
        type: 'object',
        properties: {
          attendee_name: {
            type: 'string',
            description: "Customer's full name",
          },
          attendee_phone: {
            type: 'string',
            description: "Customer's phone number",
          },
          attendee_email: {
            type: 'string',
            description: "Customer's email (optional)",
          },
          start_time: {
            type: 'string',
            description: 'ISO datetime for appointment start',
          },
          service_type: {
            type: 'string',
            description: 'Type of service requested',
          },
          notes: {
            type: 'string',
            description: 'Additional notes',
          },
        },
        required: ['attendee_name', 'attendee_phone', 'start_time'],
      },
    },
  ];
}

// Build conversation flow nodes
function buildConversationNodes(
  onboarding: OnboardingData,
  phoneNumber: string
): object[] {
  const companyName = onboarding.greeting_name || onboarding.business_name;
  const servicesList = onboarding.services.join(', ') || 'various services';
  const areasText = `${onboarding.city}, ${onboarding.state}`;
  const ownerName = onboarding.owner_name || 'the owner';

  return [
    // Node 1: Greeting
    {
      id: 'greeting',
      type: 'conversation',
      name: 'Greeting',
      instruction: {
        type: 'prompt',
        text: `Thank you for calling ${companyName}! This is our AI assistant.
I can help you schedule a service appointment, answer questions about our services,
or connect you with ${ownerName} if needed.

How can I help you today?`,
      },
      edges: [
        {
          id: 'edge_greeting_to_collect',
          description: 'Wants to schedule service',
          destination_node_id: 'collect_service_details',
          transition_condition: {
            type: 'prompt',
            prompt:
              'Caller wants to schedule service, book an appointment, get a quote, or needs work done',
          },
        },
        {
          id: 'edge_greeting_to_questions',
          description: 'Has questions',
          destination_node_id: 'answer_questions',
          transition_condition: {
            type: 'prompt',
            prompt:
              'Caller has questions about services, pricing, hours, or general information',
          },
        },
        {
          id: 'edge_greeting_to_urgency',
          description: 'Wants owner or emergency',
          destination_node_id: 'check_urgency',
          transition_condition: {
            type: 'prompt',
            prompt:
              'Caller wants to speak to owner, a human, or has an emergency/urgent issue',
          },
        },
        {
          id: 'edge_greeting_to_solicitor',
          description: 'Solicitor',
          destination_node_id: 'end_solicitor',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller is a solicitor, sales call, or spam',
          },
        },
      ],
    },

    // Node 2: Collect Service Details
    {
      id: 'collect_service_details',
      type: 'conversation',
      name: 'Collect Service Details',
      instruction: {
        type: 'prompt',
        text: `I'd be happy to help you schedule a service appointment.

First, can you tell me what type of service you need? We offer ${servicesList}.`,
      },
      edges: [
        {
          id: 'edge_service_to_ask',
          description: 'Caller describes service needed',
          destination_node_id: 'ask_service_info',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller has described what service or help they need',
          },
        },
        {
          id: 'edge_service_to_help',
          description: 'Caller unsure what they need',
          destination_node_id: 'help_identify_issue',
          transition_condition: {
            type: 'prompt',
            prompt: "Caller is unsure what they need or can't describe the issue clearly",
          },
        },
        {
          id: 'edge_service_not_offered',
          description: 'Service not offered',
          destination_node_id: 'service_not_offered',
          transition_condition: {
            type: 'prompt',
            prompt: "Caller is asking for a service we don't offer",
          },
        },
      ],
    },

    // Node 2a: Ask for Service Info
    {
      id: 'ask_service_info',
      type: 'conversation',
      name: 'Ask for Service Info',
      instruction: {
        type: 'prompt',
        text: `Great! To get you scheduled, I'll need a few details.

Can I get your name, a phone number where we can reach you, and the address where you need the service?

Also, is this urgent - do you need someone today or this week, or is your schedule flexible?`,
      },
      edges: [
        {
          id: 'edge_ask_to_extract',
          description: 'Caller provides their info',
          destination_node_id: 'extract_service_info',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller has provided their contact information and service details',
          },
        },
        {
          id: 'edge_ask_to_message',
          description: 'Caller prefers callback',
          destination_node_id: 'take_message_intro',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller would rather receive a callback than provide all details now',
          },
        },
      ],
    },

    // Node 2c: Help Identify Issue
    {
      id: 'help_identify_issue',
      type: 'conversation',
      name: 'Help Identify Issue',
      instruction: {
        type: 'prompt',
        text: `No problem! Let me help you figure out what you need.

Can you describe what's happening? For example, is there something broken, not working right,
or are you looking for maintenance, installation, or an upgrade?`,
      },
      edges: [
        {
          id: 'edge_help_to_ask',
          description: 'Caller describes issue',
          destination_node_id: 'ask_service_info',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller has described their issue or problem',
          },
        },
        {
          id: 'edge_help_to_message',
          description: 'Still unclear, take message',
          destination_node_id: 'take_message_intro',
          transition_condition: {
            type: 'prompt',
            prompt: "Caller's needs are still unclear after trying to help - should take a message for callback",
          },
        },
      ],
    },

    // Node 2b: Extract Service Info
    {
      id: 'extract_service_info',
      type: 'extract_dynamic_variables',
      name: 'Extract Service Info',
      variables: [
        {
          name: 'caller_name',
          type: 'string',
          description: "The caller's full name",
        },
        {
          name: 'caller_phone',
          type: 'string',
          description: "The caller's phone number",
        },
        {
          name: 'service_address',
          type: 'string',
          description: 'The address where service is needed',
        },
        {
          name: 'service_type',
          type: 'string',
          description: 'The type of service needed',
        },
        {
          name: 'urgency',
          type: 'string',
          description: 'How urgent - today, this week, or flexible',
        },
      ],
      edges: [
        {
          id: 'edge_extract_to_area',
          description: 'Got details',
          destination_node_id: 'confirm_service_area',
          transition_condition: {
            type: 'prompt',
            prompt: 'Information has been collected',
          },
        },
      ],
    },

    // Node 3: Confirm Service Area
    {
      id: 'confirm_service_area',
      type: 'conversation',
      name: 'Confirm Service Area',
      instruction: {
        type: 'prompt',
        text: `Great! We handle that all the time.

Just to confirm - are you located in or near ${areasText}?`,
      },
      edges: [
        {
          id: 'edge_area_to_scheduling',
          description: 'In service area',
          destination_node_id: 'scheduling_confirmation',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller confirms they are in our service area',
          },
        },
        {
          id: 'edge_area_outside',
          description: 'Outside area',
          destination_node_id: 'outside_service_area',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller is outside our service area',
          },
        },
      ],
    },

    // Node 3a: Scheduling Intro
    {
      id: 'scheduling_intro',
      type: 'conversation',
      name: 'Scheduling Intro',
      instruction: {
        type: 'prompt',
        text: `Perfect! I'd be happy to get you scheduled for an appointment.

Do you have a general idea of when works best for you - are you looking for something this week, or is it more flexible?`,
      },
      edges: [
        {
          id: 'edge_scheduling_to_availability',
          description: 'Provides timing preference',
          destination_node_id: 'check_availability',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller has indicated their timing preference or availability',
          },
        },
        {
          id: 'edge_scheduling_to_questions',
          description: 'Wants more info first',
          destination_node_id: 'answer_questions',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller wants to know more about services or pricing before scheduling',
          },
        },
        {
          id: 'edge_scheduling_to_message',
          description: 'Changed mind, wants callback',
          destination_node_id: 'take_message_intro',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller changed their mind and prefers a callback instead of scheduling now',
          },
        },
      ],
    },

    // Node 4: Check Availability (Function Node)
    {
      id: 'check_availability',
      type: 'function',
      name: 'Check Calendar Availability',
      tool_id: 'check_calendar_availability',
      tool_type: 'local',
      wait_for_result: true,
      speak_during_execution: true,
      instruction: {
        type: 'prompt',
        text: 'Let me check our availability for you. One moment please...',
      },
      edges: [
        {
          id: 'edge_availability_to_offer',
          description: 'Availability retrieved successfully',
          destination_node_id: 'offer_times',
          transition_condition: {
            type: 'prompt',
            prompt: 'Calendar availability was retrieved successfully',
          },
        },
        {
          id: 'edge_availability_to_fallback',
          description: 'Calendar not configured or error',
          destination_node_id: 'availability_fallback',
          transition_condition: {
            type: 'prompt',
            prompt: 'Calendar is not configured or there was an error checking availability',
          },
        },
      ],
    },

    // Node 4-fallback: Availability Fallback
    {
      id: 'availability_fallback',
      type: 'conversation',
      name: 'Availability Fallback',
      instruction: {
        type: 'prompt',
        text: `I don't have direct access to the calendar right now, but I can take your information and have someone call you back to schedule.

Would that work for you? I just need your name, phone number, and a general idea of when works best for you.`,
      },
      edges: [
        {
          id: 'edge_fallback_to_message',
          description: 'Caller agrees to callback',
          destination_node_id: 'take_message_intro',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller agrees to receive a callback to schedule',
          },
        },
        {
          id: 'edge_fallback_to_end',
          description: 'Caller declines',
          destination_node_id: 'end_info_provided',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller declines or wants to call back later',
          },
        },
      ],
    },

    // Node 4a: Offer Times
    {
      id: 'offer_times',
      type: 'conversation',
      name: 'Offer Times',
      instruction: {
        type: 'prompt',
        text: `I can see we have availability. Based on what you mentioned, would one of our upcoming openings work for you?

Or I can check other times if those don't fit your schedule.`,
      },
      edges: [
        {
          id: 'edge_offer_to_booking',
          description: 'Accepts offered time',
          destination_node_id: 'create_booking',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller accepts an offered appointment time',
          },
        },
        {
          id: 'edge_offer_different_time',
          description: 'Requests different time',
          destination_node_id: 'extract_preferred_time',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller wants a different time than what was offered',
          },
        },
        {
          id: 'edge_offer_to_urgency',
          description: 'Wants to speak to owner',
          destination_node_id: 'check_urgency',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller wants to speak to owner instead of booking',
          },
        },
      ],
    },

    // Node 4a-alt: Extract Preferred Time
    {
      id: 'extract_preferred_time',
      type: 'conversation',
      name: 'Extract Preferred Time',
      instruction: {
        type: 'prompt',
        text: `No problem! What day and time would work better for you?

I'll see if we have availability then.`,
      },
      edges: [
        {
          id: 'edge_preferred_to_booking',
          description: 'Time extracted',
          destination_node_id: 'create_booking',
          transition_condition: {
            type: 'prompt',
            prompt: "Caller has specified their preferred time and it's available",
          },
        },
        {
          id: 'edge_preferred_to_message',
          description: 'Unable to find matching time',
          destination_node_id: 'take_message_intro',
          transition_condition: {
            type: 'prompt',
            prompt: "Unable to find an available time that matches caller's preference",
          },
        },
      ],
    },

    // Node 4b: Create Booking (Function Node)
    {
      id: 'create_booking',
      type: 'function',
      name: 'Create Calendar Booking',
      tool_id: 'create_calendar_booking',
      tool_type: 'local',
      wait_for_result: true,
      speak_during_execution: true,
      instruction: {
        type: 'prompt',
        text: 'Let me book that appointment for you now. One moment please...',
      },
      edges: [
        {
          id: 'edge_booking_to_confirm',
          description: 'Booking created successfully',
          destination_node_id: 'booking_confirmation',
          transition_condition: {
            type: 'prompt',
            prompt: 'Booking was created successfully',
          },
        },
        {
          id: 'edge_booking_to_fallback',
          description: 'Booking failed or calendar not configured',
          destination_node_id: 'booking_fallback',
          transition_condition: {
            type: 'prompt',
            prompt: 'Booking failed or calendar is not configured',
          },
        },
      ],
    },

    // Node 4b-fallback: Booking Fallback
    {
      id: 'booking_fallback',
      type: 'conversation',
      name: 'Booking Fallback',
      instruction: {
        type: 'prompt',
        text: `I wasn't able to complete the booking in our system right now, but don't worry - I have all your information.

I'll make sure someone calls you back shortly to confirm your appointment. You should hear from us within the hour.

Is there anything else I can help you with?`,
      },
      edges: [
        {
          id: 'edge_booking_fallback_to_end',
          description: 'Caller is satisfied',
          destination_node_id: 'end_message_taken',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller acknowledges and is satisfied',
          },
        },
        {
          id: 'edge_booking_fallback_to_questions',
          description: 'Caller has questions',
          destination_node_id: 'answer_questions',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller has additional questions',
          },
        },
      ],
    },

    // Node 4c: Booking Confirmation
    {
      id: 'booking_confirmation',
      type: 'conversation',
      name: 'Booking Confirmation',
      instruction: {
        type: 'prompt',
        text: `Your appointment is confirmed! I'll send you a text message with all the details right now.

Is there anything else I can help you with today?`,
      },
      edges: [
        {
          id: 'edge_confirm_to_sms',
          description: 'Send confirmation SMS',
          destination_node_id: 'send_confirmation_sms',
          transition_condition: {
            type: 'prompt',
            prompt: "Caller acknowledges the booking or says they're all set",
          },
        },
        {
          id: 'edge_confirm_to_questions',
          description: 'Has another question',
          destination_node_id: 'answer_questions',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller has additional questions before ending',
          },
        },
      ],
    },

    // Node 4d: Send Confirmation SMS
    {
      id: 'send_confirmation_sms',
      type: 'sms',
      name: 'Send Confirmation SMS',
      instruction: {
        type: 'prompt',
        text: `Send an SMS confirmation to the caller with the following information:
- Company name: ${companyName}
- Service type they requested
- Their appointment date and time
- A friendly reminder to call if they need to reschedule
- The business phone number: ${phoneNumber}

Keep the message concise and professional.`,
      },
      success_edge: {
        id: 'edge_sms_success',
        description: 'SMS sent successfully',
        destination_node_id: 'end_appointment_booked',
        transition_condition: {
          type: 'prompt',
          prompt: 'Sent successfully',
        },
      },
      failed_edge: {
        id: 'edge_sms_failed',
        description: 'SMS failed to send',
        destination_node_id: 'end_appointment_booked',
        transition_condition: {
          type: 'prompt',
          prompt: 'Failed to send',
        },
      },
    },

    // Node 5: Answer Questions
    {
      id: 'answer_questions',
      type: 'conversation',
      name: 'Answer Questions',
      instruction: {
        type: 'prompt',
        text: `Of course! I'm happy to help with any questions.

Here's what I can tell you about ${companyName}:

**Services we offer**: ${servicesList}
**Service area**: ${areasText}
**Hours**: ${buildBusinessHours(onboarding)}

What would you like to know more about?`,
      },
      edges: [
        {
          id: 'edge_questions_to_collect',
          description: 'Wants to book after questions',
          destination_node_id: 'collect_service_details',
          transition_condition: {
            type: 'prompt',
            prompt: 'Question answered and caller now wants to schedule service',
          },
        },
        {
          id: 'edge_questions_to_end',
          description: 'Questions answered, done',
          destination_node_id: 'end_info_provided',
          transition_condition: {
            type: 'prompt',
            prompt: "Caller's questions are answered and they don't need to schedule",
          },
        },
        {
          id: 'edge_questions_to_urgency',
          description: 'Wants to speak to owner',
          destination_node_id: 'check_urgency',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller wants to speak to owner or a human',
          },
        },
        {
          id: 'edge_questions_to_pricing',
          description: 'Has pricing question',
          destination_node_id: 'pricing_response',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller is asking about pricing or costs',
          },
        },
      ],
    },

    // Node 5a: Service Not Offered
    {
      id: 'service_not_offered',
      type: 'conversation',
      name: 'Service Not Offered',
      instruction: {
        type: 'prompt',
        text: `I apologize, but ${companyName} doesn't offer that particular service.

Our specialties are ${servicesList}.

Is there something else I can help you with today?`,
      },
      edges: [
        {
          id: 'edge_not_offered_to_collect',
          description: 'Has different need we can help',
          destination_node_id: 'collect_service_details',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller has a different need that we can help with',
          },
        },
        {
          id: 'edge_not_offered_to_end',
          description: 'Caller done',
          destination_node_id: 'end_info_provided',
          transition_condition: {
            type: 'prompt',
            prompt: "Caller doesn't need anything else",
          },
        },
      ],
    },

    // Node 5b: Outside Service Area
    {
      id: 'outside_service_area',
      type: 'conversation',
      name: 'Outside Service Area',
      instruction: {
        type: 'static_text',
        text: `I'm sorry, but that location is outside our current service area.
We primarily serve ${areasText}.

Is there anything else I can help you with?`,
      },
      edges: [
        {
          id: 'edge_outside_to_end',
          description: 'Done',
          destination_node_id: 'end_info_provided',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller is done or says goodbye',
          },
        },
        {
          id: 'edge_outside_continue',
          description: 'Has other questions',
          destination_node_id: 'answer_questions',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller has other questions or wants to check a different location',
          },
        },
      ],
    },

    // Node 5c: Pricing Response
    {
      id: 'pricing_response',
      type: 'conversation',
      name: 'Pricing Response',
      instruction: {
        type: 'prompt',
        text: `Great question! Pricing can vary depending on the specific situation.

For an accurate quote, I'd recommend scheduling a quick evaluation appointment,
or I can have ${ownerName} give you a call back to discuss pricing.

Which would work better for you?`,
      },
      edges: [
        {
          id: 'edge_pricing_to_collect',
          description: 'Wants appointment for quote',
          destination_node_id: 'collect_service_details',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller wants to schedule an appointment for a quote or evaluation',
          },
        },
        {
          id: 'edge_pricing_to_message',
          description: 'Wants callback',
          destination_node_id: 'take_message_intro',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller prefers a callback to discuss pricing',
          },
        },
        {
          id: 'edge_pricing_to_end',
          description: 'Done for now',
          destination_node_id: 'end_info_provided',
          transition_condition: {
            type: 'prompt',
            prompt: "Caller is done for now and doesn't want to schedule or get a callback",
          },
        },
      ],
    },

    // Node 8: Check Urgency
    {
      id: 'check_urgency',
      type: 'conversation',
      name: 'Check Urgency',
      instruction: {
        type: 'prompt',
        text: `I understand you'd like to speak with ${ownerName} directly.

Is this an emergency situation that needs immediate attention,
or would you prefer a callback when ${ownerName} is available?`,
      },
      edges: [
        {
          id: 'edge_urgency_to_transfer',
          description: 'Emergency - needs immediate help',
          destination_node_id: 'transfer_call',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller has an emergency or urgent situation needing immediate attention',
          },
        },
        {
          id: 'edge_urgency_to_message',
          description: 'Not urgent - callback is fine',
          destination_node_id: 'take_message_intro',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller says it is not urgent and a callback would be fine',
          },
        },
        {
          id: 'edge_urgency_to_questions',
          description: 'Just had a quick question',
          destination_node_id: 'answer_questions',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller just had a quick question that the AI can help with',
          },
        },
      ],
    },

    // Node 8a: Call Transfer
    {
      id: 'transfer_call',
      type: 'transfer_call',
      name: 'Transfer to Owner',
      transfer_destination: {
        type: 'predefined',
        number: phoneNumber,
        ignore_e164_validation: false,
      },
      transfer_option: {
        type: 'warm_transfer',
        show_transferee_as_caller: true,
      },
      instruction: {
        type: 'prompt',
        text: `I'm transferring you to ${ownerName} now. Please hold for just a moment.`,
      },
      speak_during_execution: true,
      edge: {
        id: 'edge_transfer_failed',
        description: 'Transfer failed - take message instead',
        destination_node_id: 'transfer_failed_message',
        transition_condition: {
          type: 'prompt',
          prompt: 'Transfer failed',
        },
      },
    },

    // Node 8b: Transfer Failed - Take Message
    {
      id: 'transfer_failed_message',
      type: 'conversation',
      name: 'Transfer Failed',
      instruction: {
        type: 'prompt',
        text: `I apologize, but I wasn't able to connect you with ${ownerName} right now.

Let me take down your information so ${ownerName} can call you back as soon as possible - this will be marked as urgent.

Can I get your name and the best number to reach you at?`,
      },
      edges: [
        {
          id: 'edge_transfer_failed_to_message',
          description: 'Collect caller info for urgent callback',
          destination_node_id: 'take_message_intro',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller provides their information',
          },
        },
      ],
    },

    // Node 9: Take Message Intro
    {
      id: 'take_message_intro',
      type: 'conversation',
      name: 'Take Message',
      instruction: {
        type: 'prompt',
        text: `I'd be happy to take a message for ${ownerName}.

Can I get your name, a phone number where you can be reached, and briefly what you're calling about?

Also, when is the best time for a callback - morning, afternoon, or evening?`,
      },
      edges: [
        {
          id: 'edge_intro_to_extract',
          description: 'Provides info',
          destination_node_id: 'extract_message_info',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller has provided their information',
          },
        },
      ],
    },

    // Node 9a: Extract Message Info
    {
      id: 'extract_message_info',
      type: 'extract_dynamic_variables',
      name: 'Extract Message Info',
      variables: [
        {
          name: 'message_name',
          type: 'string',
          description: "The caller's name",
        },
        {
          name: 'message_phone',
          type: 'string',
          description: "The caller's phone number",
        },
        {
          name: 'message_reason',
          type: 'string',
          description: 'The reason for the call',
        },
        {
          name: 'callback_time',
          type: 'string',
          description: 'Best time to call back',
        },
      ],
      edges: [
        {
          id: 'edge_message_to_confirm',
          description: 'Message captured',
          destination_node_id: 'confirm_message',
          transition_condition: {
            type: 'prompt',
            prompt: 'Message information has been collected',
          },
        },
      ],
    },

    // Node 9b: Confirm Message
    {
      id: 'confirm_message',
      type: 'conversation',
      name: 'Confirm Message',
      instruction: {
        type: 'prompt',
        text: `I've got it. Let me confirm the details back to you:

[Read back the name, phone number, and reason for calling]

I'll make sure ${ownerName} gets this message and calls you back as soon as possible.
I'll also send you a text message confirming we received your message.
Is there anything else you'd like me to add?`,
      },
      edges: [
        {
          id: 'edge_confirm_msg_to_sms',
          description: 'Message confirmed - send SMS',
          destination_node_id: 'send_message_confirmation_sms',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller confirms the message is correct',
          },
        },
        {
          id: 'edge_confirm_msg_loop',
          description: 'Needs correction',
          destination_node_id: 'take_message_intro',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller wants to correct or change something in the message',
          },
        },
      ],
    },

    // Node 9c: Send Message Confirmation SMS
    {
      id: 'send_message_confirmation_sms',
      type: 'sms',
      name: 'Send Message Confirmation SMS',
      instruction: {
        type: 'prompt',
        text: `Send an SMS confirmation that their message was received:
- Thank them for calling ${companyName}
- Confirm their message has been received
- Let them know ${ownerName} will call them back soon
- Include the business phone number: ${phoneNumber}

Keep the message brief and reassuring.`,
      },
      success_edge: {
        id: 'edge_msg_sms_success',
        description: 'SMS sent successfully',
        destination_node_id: 'end_message_taken',
        transition_condition: {
          type: 'prompt',
          prompt: 'Sent successfully',
        },
      },
      failed_edge: {
        id: 'edge_msg_sms_failed',
        description: 'SMS failed to send',
        destination_node_id: 'end_message_taken',
        transition_condition: {
          type: 'prompt',
          prompt: 'Failed to send',
        },
      },
    },

    // End Nodes
    {
      id: 'end_info_provided',
      type: 'end',
      name: 'End - Info Provided',
      instruction: {
        type: 'static_text',
        text: `You're welcome! Thanks for calling ${companyName}.
If you need anything else, don't hesitate to call back.
Have a great day!`,
      },
    },
    {
      id: 'end_appointment_booked',
      type: 'end',
      name: 'End - Appointment Booked',
      instruction: {
        type: 'prompt',
        text: `Your appointment is all set!
Thanks for choosing ${companyName}!
We look forward to helping you.
Have a great day!`,
      },
    },
    {
      id: 'end_solicitor',
      type: 'end',
      name: 'End - Solicitor',
      instruction: {
        type: 'static_text',
        text: `I'm sorry, but we're not interested at this time.
Please remove this number from your calling list.
Thank you, goodbye.`,
      },
    },
    {
      id: 'end_message_taken',
      type: 'end',
      name: 'End - Message Taken',
      instruction: {
        type: 'prompt',
        text: `I'll make sure ${ownerName} gets your message right away.
Thanks for calling ${companyName}, and have a wonderful day!`,
      },
    },
  ];
}

export async function POST(request: NextRequest) {
  // Top-level error boundary
  try {
    console.log('[Create Agent] POST request received');

    // Early validation of environment variables
    if (!process.env.RETELL_API_KEY) {
      console.error('[Create Agent] RETELL_API_KEY not configured');
      return NextResponse.json(
        { error: 'RETELL_API_KEY not configured' },
        { status: 500 }
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('[Create Agent] SUPABASE_SERVICE_ROLE_KEY not configured');
      return NextResponse.json(
        { error: 'SUPABASE_SERVICE_ROLE_KEY not configured' },
        { status: 500 }
      );
    }

    const supabase = getSupabaseAdmin();

    const body: CreateAgentRequest = await request.json();
    console.log('[Create Agent] Request body:', JSON.stringify(body));

    if (!body.onboarding_id) {
      return NextResponse.json(
        { error: 'Missing onboarding_id' },
        { status: 400 }
      );
    }

    // Fetch onboarding data
    const { data: onboarding, error: fetchError } = await supabase
      .from('business_onboarding')
      .select('*')
      .eq('id', body.onboarding_id)
      .single();

    if (fetchError || !onboarding) {
      return NextResponse.json(
        { error: 'Onboarding not found', details: fetchError?.message },
        { status: 404 }
      );
    }

    // Check if agent already exists
    if (onboarding.retell_agent_id) {
      return NextResponse.json(
        {
          error: 'Agent already exists',
          agent_id: onboarding.retell_agent_id,
          phone_number: onboarding.retell_phone_number,
        },
        { status: 409 }
      );
    }

    console.log(
      `[Create Agent] Starting for ${onboarding.business_name} (${body.onboarding_id})`
    );

    const webhookUrl = DEFAULT_WEBHOOK_URL;
    const voiceId = mapVoicePreference(onboarding.preferred_voice);

    // Step 1: Create conversation flow
    console.log('[Create Agent] Creating conversation flow...');
    const nodes = buildConversationNodes(onboarding, onboarding.phone);
    const tools = buildCalendarTools(webhookUrl);
    const globalPrompt = buildGlobalPrompt(onboarding);

    const conversationFlow = await callRetellAPI('/create-conversation-flow', 'POST', {
      model_choice: {
        type: 'cascading',
        model: 'gpt-4.1',
      },
      nodes: nodes,
      tools: tools,
      start_speaker: 'agent',
      global_prompt: globalPrompt,
      start_node_id: 'greeting',
      model_temperature: 0.3,
    });

    console.log(
      `[Create Agent] Conversation flow created: ${conversationFlow.conversation_flow_id}`
    );

    // Step 2: Create voice agent
    console.log('[Create Agent] Creating voice agent...');
    const agentName = `${onboarding.greeting_name || onboarding.business_name} AI Receptionist`;

    const agent = await callRetellAPI('/create-agent', 'POST', {
      agent_name: agentName,
      response_engine: {
        type: 'conversation-flow',
        conversation_flow_id: conversationFlow.conversation_flow_id,
      },
      voice_id: voiceId,
      language: 'en-US',
      webhook_url: webhookUrl,
    });

    console.log(`[Create Agent] Voice agent created: ${agent.agent_id}`);

    // Step 3: Optionally assign phone number
    let phoneNumber: string | null = null;

    if (body.assign_phone) {
      console.log('[Create Agent] Purchasing phone number...');
      try {
        // Get area code from business location or use provided
        const areaCode = body.area_code || getAreaCodeForState(onboarding.state);

        const phoneResult = await callRetellAPI('/create-phone-number', 'POST', {
          area_code: parseInt(areaCode),
          inbound_agent_id: agent.agent_id,
        });

        phoneNumber = phoneResult.phone_number;
        console.log(`[Create Agent] Phone number assigned: ${phoneNumber}`);
      } catch (phoneError) {
        console.error('[Create Agent] Phone assignment failed:', phoneError);
        // Don't fail the whole request if phone fails
      }
    }

    // Step 4: Update onboarding record
    const updateData: Record<string, string | null> = {
      retell_agent_id: agent.agent_id,
      status: 'agent_created',
    };

    if (phoneNumber) {
      updateData.retell_phone_number = phoneNumber;
      updateData.status = 'active';
    }

    const { error: updateError } = await supabase
      .from('business_onboarding')
      .update(updateData)
      .eq('id', body.onboarding_id);

    if (updateError) {
      console.error('[Create Agent] Failed to update onboarding:', updateError);
    }

    console.log(
      `[Create Agent] Complete! Agent: ${agent.agent_id}, Phone: ${phoneNumber || 'not assigned'}`
    );

    // Send notification email about agent creation
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/onboarding/notify`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: body.onboarding_id,
            business_name: onboarding.business_name,
            owner_name: onboarding.owner_name,
            email: onboarding.email,
            phone: onboarding.phone,
            city: onboarding.city,
            state: onboarding.state,
            services: onboarding.services,
            event_type: 'agent_created',
            agent_id: agent.agent_id,
            phone_number: phoneNumber,
          }),
        }
      );
    } catch (notifyError) {
      console.error('[Create Agent] Notification failed:', notifyError);
    }

    return NextResponse.json({
      success: true,
      agent_id: agent.agent_id,
      conversation_flow_id: conversationFlow.conversation_flow_id,
      phone_number: phoneNumber,
      status: phoneNumber ? 'active' : 'agent_created',
      message: `Agent created for ${onboarding.business_name}`,
    });
  } catch (error) {
    console.error('[Create Agent] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create agent', details: String(error) },
      { status: 500 }
    );
  }
}

// Helper to get area code for state (common ones)
function getAreaCodeForState(state: string): string {
  const areaCodes: Record<string, string> = {
    CA: '619',
    TX: '512',
    FL: '305',
    NY: '212',
    IL: '312',
    PA: '215',
    OH: '614',
    GA: '404',
    NC: '704',
    MI: '313',
    NJ: '201',
    VA: '703',
    WA: '206',
    AZ: '602',
    MA: '617',
    TN: '615',
    IN: '317',
    MO: '314',
    MD: '410',
    WI: '414',
    CO: '303',
    MN: '612',
    SC: '803',
    AL: '205',
    LA: '504',
    KY: '502',
    OR: '503',
    OK: '405',
    CT: '203',
    UT: '801',
    NV: '702',
    IA: '515',
    AR: '501',
    MS: '601',
    KS: '316',
    NM: '505',
    NE: '402',
    WV: '304',
    ID: '208',
    HI: '808',
    NH: '603',
    ME: '207',
    MT: '406',
    RI: '401',
    DE: '302',
    SD: '605',
    ND: '701',
    AK: '907',
    VT: '802',
    WY: '307',
  };
  return areaCodes[state] || '619'; // Default to San Diego
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/agents/create',
    description: 'POST with { onboarding_id, assign_phone?, area_code? }',
  });
}

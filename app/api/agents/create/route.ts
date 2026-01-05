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
          id: 'edge_service_to_info',
          description: 'Describes service needed',
          destination_node_id: 'ask_service_info',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller has described what service or help they need',
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
          id: 'edge_info_to_extract',
          description: 'Provides info',
          destination_node_id: 'extract_service_info',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller has provided their contact information',
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

    // Node 3a: Scheduling Confirmation
    {
      id: 'scheduling_confirmation',
      type: 'conversation',
      name: 'Scheduling Confirmation',
      instruction: {
        type: 'prompt',
        text: `I've got all your information. Someone from our team will call you back shortly to confirm your appointment time.

Is there anything else I can help you with today?`,
      },
      edges: [
        {
          id: 'edge_scheduling_to_end',
          description: 'Done',
          destination_node_id: 'end_appointment_booked',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller is satisfied and ready to end the call',
          },
        },
        {
          id: 'edge_scheduling_to_questions',
          description: 'Has questions',
          destination_node_id: 'answer_questions',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller has additional questions',
          },
        },
      ],
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
- Services we offer: ${servicesList}
- Service area: ${areasText}
- Hours: ${buildBusinessHours(onboarding)}

What would you like to know more about?`,
      },
      edges: [
        {
          id: 'edge_questions_to_collect',
          description: 'Wants to book',
          destination_node_id: 'collect_service_details',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller now wants to schedule service',
          },
        },
        {
          id: 'edge_questions_to_end',
          description: 'Questions answered',
          destination_node_id: 'end_info_provided',
          transition_condition: {
            type: 'prompt',
            prompt: "Caller's questions are answered",
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
We primarily serve ${areasText} and surrounding areas.

Is there anything else I can help you with?`,
      },
      edges: [
        {
          id: 'edge_outside_to_end',
          description: 'Done',
          destination_node_id: 'end_info_provided',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller is done',
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
          id: 'edge_urgency_to_message',
          description: 'Not urgent',
          destination_node_id: 'take_message_intro',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller says it is not urgent and a callback would be fine',
          },
        },
        {
          id: 'edge_urgency_to_message_urgent',
          description: 'Urgent',
          destination_node_id: 'take_message_intro',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller has an urgent situation',
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
        text: `I've got it. Let me confirm the details back to you.

I'll make sure ${ownerName} gets this message and calls you back as soon as possible.

Is there anything else you'd like me to add?`,
      },
      edges: [
        {
          id: 'edge_confirm_to_end',
          description: 'Message confirmed',
          destination_node_id: 'end_message_taken',
          transition_condition: {
            type: 'prompt',
            prompt: 'Caller confirms the message is correct',
          },
        },
      ],
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
        text: `Perfect! Your information has been recorded and someone will call you back to confirm.
Thanks for choosing ${companyName}!
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

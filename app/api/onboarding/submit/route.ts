/**
 * API Route - Business Onboarding Submission
 * Path: /api/onboarding/submit
 *
 * Handles new business onboarding form submissions.
 * Encrypts Cal.com API keys server-side before storing.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { encryptApiKey } from '@/lib/cal-com';

// Initialize Supabase with service role for server-side operations
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseKey);
}

interface OnboardingSubmission {
  // Step 1: Business Info
  business_name: string;
  business_type: string;
  business_type_other?: string;
  owner_name: string;
  email: string;
  phone: string;
  website?: string;

  // Step 2: Service Area & Phone
  city: string;
  state: string;
  zip?: string;
  service_radius_miles: number;
  phone_preference: 'new' | 'forward' | 'port';
  existing_phone_number?: string;
  current_phone_provider?: string;

  // Step 3: Services
  services: string[];

  // Step 4: Hours & Preferences
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

  // Cal.com Integration (raw key - will be encrypted)
  cal_com_api_key?: string;
  cal_com_event_type_id?: string;
  cal_com_validated?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: OnboardingSubmission = await request.json();

    // Validate required fields
    if (!body.business_name || !body.owner_name || !body.email || !body.phone) {
      return NextResponse.json(
        { error: 'Missing required fields: business_name, owner_name, email, phone' },
        { status: 400 }
      );
    }

    if (!body.city || !body.state) {
      return NextResponse.json(
        { error: 'Missing required fields: city, state' },
        { status: 400 }
      );
    }

    if (!body.services || body.services.length === 0) {
      return NextResponse.json(
        { error: 'At least one service is required' },
        { status: 400 }
      );
    }

    // Encrypt Cal.com API key if provided and validated
    let encryptedCalComKey: string | null = null;
    if (body.cal_com_api_key && body.cal_com_validated) {
      try {
        encryptedCalComKey = encryptApiKey(body.cal_com_api_key);
        console.log('[Onboarding] Cal.com API key encrypted successfully');
      } catch (encryptError) {
        console.error('[Onboarding] Failed to encrypt Cal.com API key:', encryptError);
        // Don't fail the submission, just skip Cal.com integration
        encryptedCalComKey = null;
      }
    }

    // Prepare data for insertion
    const insertData = {
      business_name: body.business_name,
      business_type: body.business_type,
      business_type_other: body.business_type_other || null,
      owner_name: body.owner_name,
      email: body.email,
      phone: body.phone,
      website: body.website || null,
      city: body.city,
      state: body.state,
      zip: body.zip || null,
      service_radius_miles: body.service_radius_miles || 25,
      phone_preference: body.phone_preference || 'new',
      existing_phone_number: body.existing_phone_number || null,
      current_phone_provider: body.current_phone_provider || null,
      services: body.services,
      hours_monday: body.hours_monday || '8:00 AM - 5:00 PM',
      hours_tuesday: body.hours_tuesday || '8:00 AM - 5:00 PM',
      hours_wednesday: body.hours_wednesday || '8:00 AM - 5:00 PM',
      hours_thursday: body.hours_thursday || '8:00 AM - 5:00 PM',
      hours_friday: body.hours_friday || '8:00 AM - 5:00 PM',
      hours_saturday: body.hours_saturday || '9:00 AM - 2:00 PM',
      hours_sunday: body.hours_sunday || 'Closed',
      greeting_name: body.greeting_name || body.business_name,
      appointment_duration: body.appointment_duration || 30,
      calendar_link: body.calendar_link || null,
      pricing_info: body.pricing_info || null,
      special_instructions: body.special_instructions || null,
      // Cal.com - encrypted key
      cal_com_api_key_encrypted: encryptedCalComKey,
      cal_com_event_type_id: body.cal_com_validated ? body.cal_com_event_type_id : null,
      cal_com_validated: body.cal_com_validated && encryptedCalComKey ? true : false,
      // Initial status
      status: 'pending',
    };

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('business_onboarding')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('[Onboarding] Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save onboarding data', details: error.message },
        { status: 500 }
      );
    }

    console.log(`[Onboarding] New business registered: ${body.business_name} (ID: ${data.id})`);
    console.log(`[Onboarding] Cal.com configured: ${data.cal_com_validated ? 'Yes' : 'No'}`);

    // Send notification (non-blocking)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/onboarding/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: data.id,
          business_name: body.business_name,
          business_type: body.business_type,
          owner_name: body.owner_name,
          email: body.email,
          phone: body.phone,
          city: body.city,
          state: body.state,
          services: body.services,
          cal_com_configured: data.cal_com_validated,
        }),
      });
    } catch (notifyError) {
      console.error('[Onboarding] Notification error (non-blocking):', notifyError);
    }

    return NextResponse.json({
      success: true,
      id: data.id,
      message: 'Onboarding submitted successfully',
      cal_com_configured: data.cal_com_validated,
    });

  } catch (error) {
    console.error('[Onboarding] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

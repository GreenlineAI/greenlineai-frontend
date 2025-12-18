/**
 * Next.js API Route - Onboarding Notification
 * Path: /api/onboarding/notify
 *
 * Sends email notification when a new business completes onboarding
 */

import { NextRequest, NextResponse } from 'next/server';

interface OnboardingData {
  id?: string;
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
  appointment_duration: number;
  calendar_link?: string;
  pricing_info?: string;
  special_instructions?: string;
  phone_preference: 'new' | 'forward' | 'port';
  existing_phone_number?: string;
  current_phone_provider?: string;
}

function formatBusinessType(type: string, other?: string): string {
  if (type === 'other' && other) return other;
  return type.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function formatPhonePreference(pref: string): string {
  const labels: Record<string, string> = {
    'new': 'Get a new local number',
    'forward': 'Forward existing number',
    'port': 'Port existing number to GreenLine',
  };
  return labels[pref] || pref;
}

function generateEmailHtml(data: OnboardingData): string {
  const servicesHtml = data.services.map(s => `<li>${s}</li>`).join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Business Onboarding</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0;">New Business Onboarding</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">${data.business_name}</p>
  </div>
  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
    <h2>Business Information</h2>
    <p><strong>Business:</strong> ${data.business_name}</p>
    <p><strong>Type:</strong> ${formatBusinessType(data.business_type, data.business_type_other)}</p>
    <p><strong>Owner:</strong> ${data.owner_name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Location:</strong> ${data.city}, ${data.state}</p>
    <p><strong>Service Radius:</strong> ${data.service_radius_miles} miles</p>
    <p><strong>Phone Setup:</strong> ${formatPhonePreference(data.phone_preference)}</p>
    <h2>Services (${data.services.length})</h2>
    <ul>${servicesHtml}</ul>
    ${data.special_instructions ? `<h2>Special Instructions</h2><p>${data.special_instructions}</p>` : ''}
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://www.greenline-ai.com/admin/onboarding" style="display: inline-block; background: #059669; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none;">View in Dashboard</a>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const data: OnboardingData = await request.json();

    // Validate required fields
    if (!data.business_name || !data.email || !data.owner_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@greenlineai.com';
    const results: { email: boolean; webhook: boolean } = { email: false, webhook: false };

    // Send email notification via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'GreenLine AI <notifications@greenlineai.com>',
            to: adminEmail,
            subject: `New Business Onboarding: ${data.business_name}`,
            html: generateEmailHtml(data),
          }),
        });

        if (emailResponse.ok) {
          results.email = true;
          console.log(`[Onboarding] Email sent for ${data.business_name}`);
        }
      } catch (emailError) {
        console.error('[Onboarding] Email failed:', emailError);
      }
    }

    // Call webhook if configured (for n8n/automation integration)
    if (process.env.ONBOARDING_WEBHOOK_URL) {
      try {
        const webhookResponse = await fetch(process.env.ONBOARDING_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'onboarding.completed',
            timestamp: new Date().toISOString(),
            data,
          }),
        });

        if (webhookResponse.ok) {
          results.webhook = true;
        }
      } catch (webhookError) {
        console.error('[Onboarding] Webhook failed:', webhookError);
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: 'Notification processed'
    });

  } catch (error) {
    console.error('[Onboarding] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process notification', details: String(error) },
      { status: 500 }
    );
  }
}

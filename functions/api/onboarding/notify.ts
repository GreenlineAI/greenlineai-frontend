/**
 * Onboarding Notification API
 * Sends email notification when a new business completes onboarding
 */

interface Env {
  RESEND_API_KEY?: string;
  ADMIN_EMAIL?: string;
  ONBOARDING_WEBHOOK_URL?: string;
}

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

  const hoursRows = [
    { day: 'Monday', hours: data.hours_monday },
    { day: 'Tuesday', hours: data.hours_tuesday },
    { day: 'Wednesday', hours: data.hours_wednesday },
    { day: 'Thursday', hours: data.hours_thursday },
    { day: 'Friday', hours: data.hours_friday },
    { day: 'Saturday', hours: data.hours_saturday },
    { day: 'Sunday', hours: data.hours_sunday },
  ].map(({ day, hours }) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: 500;">${day}</td>
      <td style="padding: 8px; border: 1px solid #e5e7eb;">${hours || 'Not specified'}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Business Onboarding</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 700px; margin: 0 auto; padding: 20px;">

  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">New Business Onboarding</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">${data.business_name}</p>
  </div>

  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">

    <!-- Business Information -->
    <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
      <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #059669; border-bottom: 2px solid #d1fae5; padding-bottom: 10px;">
        Business Information
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; width: 140px;">Business Name:</td>
          <td style="padding: 8px 0; font-weight: 600;">${data.business_name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Business Type:</td>
          <td style="padding: 8px 0;">${formatBusinessType(data.business_type, data.business_type_other)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Owner Name:</td>
          <td style="padding: 8px 0;">${data.owner_name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Email:</td>
          <td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #059669;">${data.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Phone:</td>
          <td style="padding: 8px 0;"><a href="tel:${data.phone}" style="color: #059669;">${data.phone}</a></td>
        </tr>
        ${data.website ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Website:</td>
          <td style="padding: 8px 0;"><a href="${data.website}" style="color: #059669;">${data.website}</a></td>
        </tr>
        ` : ''}
      </table>
    </div>

    <!-- Service Area -->
    <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
      <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #059669; border-bottom: 2px solid #d1fae5; padding-bottom: 10px;">
        Service Area
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; width: 140px;">Location:</td>
          <td style="padding: 8px 0;">${data.city}, ${data.state}${data.zip ? ` ${data.zip}` : ''}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Service Radius:</td>
          <td style="padding: 8px 0;">${data.service_radius_miles} miles</td>
        </tr>
      </table>
    </div>

    <!-- Phone Setup -->
    <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
      <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #059669; border-bottom: 2px solid #d1fae5; padding-bottom: 10px;">
        Phone Setup Preference
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; width: 140px;">Preference:</td>
          <td style="padding: 8px 0; font-weight: 600;">${formatPhonePreference(data.phone_preference)}</td>
        </tr>
        ${data.existing_phone_number ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Existing Number:</td>
          <td style="padding: 8px 0;">${data.existing_phone_number}</td>
        </tr>
        ` : ''}
        ${data.current_phone_provider ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Current Provider:</td>
          <td style="padding: 8px 0;">${data.current_phone_provider}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    <!-- Services -->
    <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
      <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #059669; border-bottom: 2px solid #d1fae5; padding-bottom: 10px;">
        Services Offered (${data.services.length})
      </h2>
      <ul style="margin: 0; padding-left: 20px; color: #374151;">
        ${servicesHtml}
      </ul>
    </div>

    <!-- Business Hours -->
    <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
      <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #059669; border-bottom: 2px solid #d1fae5; padding-bottom: 10px;">
        Business Hours
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        ${hoursRows}
      </table>
    </div>

    <!-- AI Configuration -->
    <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
      <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #059669; border-bottom: 2px solid #d1fae5; padding-bottom: 10px;">
        AI Agent Configuration
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; width: 160px;">Greeting Name:</td>
          <td style="padding: 8px 0;">${data.greeting_name || data.business_name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Appointment Duration:</td>
          <td style="padding: 8px 0;">${data.appointment_duration} minutes</td>
        </tr>
        ${data.calendar_link ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Calendar Link:</td>
          <td style="padding: 8px 0;"><a href="${data.calendar_link}" style="color: #059669;">${data.calendar_link}</a></td>
        </tr>
        ` : ''}
      </table>
    </div>

    <!-- Pricing Info -->
    ${data.pricing_info ? `
    <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
      <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #059669; border-bottom: 2px solid #d1fae5; padding-bottom: 10px;">
        Pricing Information
      </h2>
      <p style="margin: 0; color: #374151; white-space: pre-wrap;">${data.pricing_info}</p>
    </div>
    ` : ''}

    <!-- Special Instructions -->
    ${data.special_instructions ? `
    <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 20px; border: 1px solid #fbbf24;">
      <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #92400e;">
        ⚠️ Special Instructions
      </h2>
      <p style="margin: 0; color: #78350f; white-space: pre-wrap;">${data.special_instructions}</p>
    </div>
    ` : ''}

    <!-- Action Button -->
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://greenlineai.com/admin/onboarding"
         style="display: inline-block; background: #059669; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        View in Admin Dashboard
      </a>
    </div>

  </div>

  <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 14px;">
    <p style="margin: 0;">GreenLine AI - AI Phone Agents for Home Services</p>
  </div>

</body>
</html>
  `;
}

function generatePlainText(data: OnboardingData): string {
  const services = data.services.map(s => `  - ${s}`).join('\n');

  return `
NEW BUSINESS ONBOARDING: ${data.business_name}
${'='.repeat(50)}

BUSINESS INFORMATION
--------------------
Business Name: ${data.business_name}
Business Type: ${formatBusinessType(data.business_type, data.business_type_other)}
Owner Name: ${data.owner_name}
Email: ${data.email}
Phone: ${data.phone}
${data.website ? `Website: ${data.website}` : ''}

SERVICE AREA
------------
Location: ${data.city}, ${data.state}${data.zip ? ` ${data.zip}` : ''}
Service Radius: ${data.service_radius_miles} miles

PHONE SETUP
-----------
Preference: ${formatPhonePreference(data.phone_preference)}
${data.existing_phone_number ? `Existing Number: ${data.existing_phone_number}` : ''}
${data.current_phone_provider ? `Current Provider: ${data.current_phone_provider}` : ''}

SERVICES OFFERED (${data.services.length})
-----------------
${services}

BUSINESS HOURS
--------------
Monday:    ${data.hours_monday || 'Not specified'}
Tuesday:   ${data.hours_tuesday || 'Not specified'}
Wednesday: ${data.hours_wednesday || 'Not specified'}
Thursday:  ${data.hours_thursday || 'Not specified'}
Friday:    ${data.hours_friday || 'Not specified'}
Saturday:  ${data.hours_saturday || 'Not specified'}
Sunday:    ${data.hours_sunday || 'Not specified'}

AI AGENT CONFIGURATION
----------------------
Greeting Name: ${data.greeting_name || data.business_name}
Appointment Duration: ${data.appointment_duration} minutes
${data.calendar_link ? `Calendar Link: ${data.calendar_link}` : ''}

${data.pricing_info ? `PRICING INFORMATION
-------------------
${data.pricing_info}` : ''}

${data.special_instructions ? `SPECIAL INSTRUCTIONS
--------------------
${data.special_instructions}` : ''}

---
View in Admin Dashboard: https://greenlineai.com/admin/onboarding
  `.trim();
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    const data: OnboardingData = await request.json();

    // Validate required fields
    if (!data.business_name || !data.email || !data.owner_name) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const adminEmail = env.ADMIN_EMAIL || 'admin@greenlineai.com';
    const results: { email: boolean; webhook: boolean } = { email: false, webhook: false };

    // Send email notification via Resend
    if (env.RESEND_API_KEY) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'GreenLine AI <notifications@greenlineai.com>',
            to: adminEmail,
            subject: `🆕 New Business Onboarding: ${data.business_name}`,
            html: generateEmailHtml(data),
            text: generatePlainText(data),
          }),
        });

        if (emailResponse.ok) {
          results.email = true;
          console.log(`✅ Onboarding notification sent for ${data.business_name}`);
        } else {
          const errorData = await emailResponse.text();
          console.error('❌ Resend API error:', errorData);
        }
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
      }
    } else {
      console.log('⚠️ RESEND_API_KEY not configured, skipping email');
      console.log('📧 Would send onboarding notification for:', data.business_name);
    }

    // Call webhook if configured (for n8n integration)
    if (env.ONBOARDING_WEBHOOK_URL) {
      try {
        const webhookResponse = await fetch(env.ONBOARDING_WEBHOOK_URL, {
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
          console.log(`✅ Webhook called for ${data.business_name}`);
        } else {
          console.error('❌ Webhook error:', await webhookResponse.text());
        }
      } catch (webhookError) {
        console.error('❌ Webhook failed:', webhookError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        results,
        message: 'Notification processed'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Onboarding notification error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process notification',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

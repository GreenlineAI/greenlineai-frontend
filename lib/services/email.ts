/**
 * Email notification service
 * Simple email sending for meeting notifications
 * Uses standard fetch to send emails via an email API
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface MeetingBookedEmailData {
  userName: string;
  businessName: string;
  contactName?: string;
  scheduledAt: string;
  duration: number;
  phone?: string;
  email?: string;
}

export async function sendMeetingBookedEmail(data: MeetingBookedEmailData): Promise<boolean> {
  const { userName, businessName, contactName, scheduledAt, duration, phone, email } = data;

  const dateTime = new Date(scheduledAt).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .meeting-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .detail { margin: 10px 0; }
        .label { font-weight: bold; color: #667eea; }
        .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 New Meeting Booked!</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          <p>Great news! Your AI assistant just booked a new strategy call.</p>
          
          <div class="meeting-card">
            <h2 style="margin-top: 0; color: #667eea;">Meeting Details</h2>
            <div class="detail">
              <span class="label">Business:</span> ${businessName}
            </div>
            ${contactName ? `<div class="detail"><span class="label">Contact:</span> ${contactName}</div>` : ''}
            <div class="detail">
              <span class="label">Date & Time:</span> ${dateTime}
            </div>
            <div class="detail">
              <span class="label">Duration:</span> ${duration} minutes
            </div>
            ${phone ? `<div class="detail"><span class="label">Phone:</span> ${phone}</div>` : ''}
            ${email ? `<div class="detail"><span class="label">Email:</span> ${email}</div>` : ''}
          </div>

          <p>The meeting has been added to your dashboard. Make sure to:</p>
          <ul>
            <li>Review the lead's information before the call</li>
            <li>Add the meeting to your personal calendar</li>
            <li>Prepare your pitch and any relevant materials</li>
          </ul>

          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/meetings" class="cta-button">
            View All Meetings →
          </a>

          <div class="footer">
            <p>This is an automated notification from GreenLine AI</p>
            <p>If you have questions, contact support</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
New Meeting Booked!

Business: ${businessName}
${contactName ? `Contact: ${contactName}\n` : ''}
Date & Time: ${dateTime}
Duration: ${duration} minutes
${phone ? `Phone: ${phone}\n` : ''}
${email ? `Email: ${email}\n` : ''}

View all meetings: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/meetings
  `;

  try {
    // For now, just log the email
    // In production, integrate with SendGrid, Resend, or your email provider
    console.log('📧 Email would be sent:', {
      subject: '🎉 New Meeting Booked!',
      html: html.substring(0, 100) + '...',
      text: text.substring(0, 100) + '...'
    });

    // TODO: Uncomment and configure when email service is set up
    // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     personalizations: [{ to: [{ email: to }] }],
    //     from: { email: 'notifications@greenlineai.com', name: 'GreenLine AI' },
    //     subject,
    //     content: [
    //       { type: 'text/plain', value: text },
    //       { type: 'text/html', value: html }
    //     ]
    //   })
    // });
    
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    console.log('📧 Email would be sent:', {
      to: options.to,
      subject: options.subject,
      preview: options.text?.substring(0, 50) || options.html.substring(0, 50)
    });
    
    // TODO: Implement actual email sending
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

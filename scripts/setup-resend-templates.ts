import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

// Template configurations
const templates = [
  {
    name: 'greenline-confirmation',
    subject: 'Confirm Your Email - GreenLine AI',
    file: 'confirmation.html',
  },
  {
    name: 'greenline-recovery',
    subject: 'Reset Your Password - GreenLine AI',
    file: 'recovery.html',
  },
  {
    name: 'greenline-magic-link',
    subject: 'Your Magic Link - GreenLine AI',
    file: 'magic_link.html',
  },
  {
    name: 'greenline-invite',
    subject: "You've Been Invited - GreenLine AI",
    file: 'invite.html',
  },
  {
    name: 'greenline-email-change',
    subject: 'Confirm Email Change - GreenLine AI',
    file: 'email_change.html',
  },
  {
    name: 'greenline-reauthentication',
    subject: 'Verify Your Identity - GreenLine AI',
    file: 'reauthentication.html',
  },
];

async function setupTemplates() {
  console.log('Setting up Resend email templates...\n');

  const templatesDir = path.join(__dirname, '../supabase/templates/email');

  for (const template of templates) {
    try {
      const htmlPath = path.join(templatesDir, template.file);
      let html = fs.readFileSync(htmlPath, 'utf-8');

      // Convert Supabase template variables to Resend format
      // {{ .ConfirmationURL }} -> {{{CONFIRMATION_URL}}}
      html = html.replace(/\{\{\s*\.ConfirmationURL\s*\}\}/g, '{{{CONFIRMATION_URL}}}');

      console.log(`Creating template: ${template.name}...`);

      const result = await resend.templates.create({
        name: template.name,
        subject: template.subject,
        html: html,
        variables: [
          {
            key: 'CONFIRMATION_URL',
            type: 'string',
            fallbackValue: 'https://greenline-ai.com',
          },
        ],
      });

      console.log(`  Created: ${template.name} (ID: ${result.data?.id})`);
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log(`  Skipped: ${template.name} (already exists)`);
      } else {
        console.error(`  Error creating ${template.name}:`, error.message);
      }
    }
  }

  console.log('\nTemplate setup complete!');
  console.log('\nNext steps:');
  console.log('1. Go to Resend dashboard to verify templates');
  console.log('2. Configure Supabase SMTP settings with Resend credentials');
}

setupTemplates();

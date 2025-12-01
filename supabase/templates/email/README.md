# Supabase Email Templates for GreenLine AI

This directory contains custom email templates for Supabase authentication flows, branded for GreenLine AI.

## Templates Included

- **confirmation.html** - Email confirmation for new signups
- **invite.html** - User invitation email
- **recovery.html** - Password reset email
- **magic_link.html** - Passwordless magic link email (user auth)
- **email_change.html** - Email address change confirmation

## Setting Up Templates in Supabase

### Via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Email Templates**
3. For each template type, copy the HTML content from the corresponding file
4. Paste it into the template editor
5. Save changes

### Template Mapping

| Supabase Template | File | Subject Line |
|------------------|------|--------------|
| Confirm signup | confirmation.html | Confirm Your Email - GreenLine AI |
| Invite user | invite.html | You've Been Invited - GreenLine AI |
| Reset password | recovery.html | Reset Your Password - GreenLine AI |
| Magic Link | magic_link.html | Your Magic Link - GreenLine AI |
| Change Email Address | email_change.html | Confirm Your Email Change - GreenLine AI |

## Template Variables

These templates use Supabase's template variables:

- `{{ .ConfirmationURL }}` - The confirmation/action link

## Customization

You can customize:
- Company name and branding
- Colors (currently using GreenLine AI's green theme: #10b981)
- Support email addresses (currently support@greenline-ai.com)
- Website URL (currently greenline-ai.com)
- Add your logo by replacing the emoji 🌱 with an `<img>` tag pointing to your hosted logo

## Styling Notes

- All styles are inline for maximum email client compatibility
- Mobile-responsive design
- Tested with major email clients (Gmail, Outlook, Apple Mail)
- Uses web-safe fonts with fallbacks
- Green gradient header matching GreenLine AI brand colors

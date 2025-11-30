# Revues AI - Voice AI Sales CRM Access Guide

## Overview

The Revues AI CRM is a secure, role-based Voice AI Sales platform for managing leads, campaigns, and AI-powered outreach calls for landscaping and home service businesses.

## Accessing the Dashboard

### Production URL
```
https://your-domain.com/dashboard
```

### Login Credentials
Contact your administrator to receive login credentials. All users must authenticate via Supabase Auth.

---

## User Roles & Permissions

### Account Executive (AE)
- View and manage assigned leads
- Make outbound calls via AI dialer
- Update lead status and notes
- View personal call analytics
- Access campaign leads assigned to them

### Sales Manager
- All AE permissions
- Create and manage campaigns
- Assign leads to team members
- View team-wide analytics
- Export reports

### Administrator / CEO
- Full system access
- User management
- API key management
- Billing and subscription settings
- View all leads and analytics across the organization

---

## Dashboard Pages

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/dashboard` | Overview stats, recent activity |
| Leads | `/dashboard/leads` | Manage and filter all leads |
| Dialer | `/dashboard/dialer` | AI-powered calling interface |
| Campaigns | `/dashboard/campaigns` | Create and manage campaigns |
| Call History | `/dashboard/calls` | View all call records and transcripts |
| Analytics | `/dashboard/analytics` | Charts and performance metrics |
| Settings | `/dashboard/settings` | Profile, voice AI, and API settings |

---

## Security Features

### Authentication
- **Supabase Auth** with email/password or OAuth providers
- **Session management** with secure HTTP-only cookies
- **Password requirements**: Minimum 8 characters, mixed case, numbers

### Row Level Security (RLS)
All database tables are protected with RLS policies:
- Users can only access their own data
- Cross-tenant data isolation
- Automatic user_id filtering on all queries

### Data Encryption
- **At rest**: AES-256 encryption via Supabase/PostgreSQL
- **In transit**: TLS 1.3 for all API calls
- **API keys**: Stored hashed, displayed masked (sk_live_xxxx...)
- **Call recordings**: Encrypted storage with signed URLs

### Access Controls
- JWT tokens with short expiration (1 hour)
- Refresh token rotation
- Rate limiting on API endpoints
- CORS restrictions to allowed domains

---

## Environment Variables

Required environment variables (store in `.env.local`, never commit):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Server-side only

# Vapi Voice AI
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your-vapi-public-key
VAPI_PRIVATE_KEY=your-vapi-private-key  # Server-side only

# Backend API
NEXT_PUBLIC_API_URL=https://lead-engager-production.up.railway.app

# Optional
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/your-link
```

---

## API Authentication

### For External Integrations

1. Navigate to Settings > API
2. Generate a new API key
3. Use the key in request headers:

```bash
curl -X GET https://api.your-domain.com/v1/leads \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### Rate Limits
- 100 requests per minute per API key
- 10,000 requests per day per account

---

## Troubleshooting

### Cannot Access Dashboard
1. Verify you have an active account
2. Check your email/password
3. Clear browser cookies and try again
4. Contact administrator if issue persists

### Calls Not Connecting
1. Check Vapi API key configuration
2. Verify microphone permissions in browser
3. Ensure stable internet connection
4. Check Vapi dashboard for service status

### Data Not Loading
1. Check network connectivity
2. Verify Supabase project is active
3. Check browser console for errors
4. Contact support with error details

---

## Support

- **Email**: support@revues.ai
- **Documentation**: https://docs.revues.ai
- **Status Page**: https://status.revues.ai

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Nov 2024 | Initial release |

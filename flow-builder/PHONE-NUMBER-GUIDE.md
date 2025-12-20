# GreenLine AI Phone Number Setup Guide

This guide explains the three options for phone numbers with Retell AI voice agents.

## Quick Summary

| Option | Best For | Monthly Cost | Setup Time |
|--------|----------|--------------|------------|
| **New Number** | Most businesses | $2/month | Instant |
| **Forward Existing** | Keep current number, use AI for overflow | $0 + SIP trunk costs | 1-2 hours |
| **Port Number** | Move number fully to Retell ecosystem | $2/month + porting fees | 1-4 weeks |

---

## Option 1: Get a New Local Number (Recommended)

This is the simplest option. Retell purchases and manages the phone number for you.

### How It Works
1. We purchase a number in your local area code from Retell
2. The number is immediately ready for inbound/outbound calls
3. Retell handles all telephony infrastructure

### Pricing
- **US/Canada numbers**: $2/month
- **US Toll-free numbers**: $5/month + $0.06/min for inbound calls
- No additional telephony costs

### Setup Steps (Automated)
When you click "Deploy with Phone Number" in the admin dashboard:
1. We call Retell's API to purchase a number in the business's state
2. The number is automatically bound to their AI agent
3. Status updates to "Active" and they're ready to receive calls

### Limitations
- Currently only US and Canada numbers available for purchase
- Cannot guarantee specific phone numbers (only area codes)

---

## Option 2: Forward Existing Number via SIP Trunking

Use your existing phone number with Retell AI without transferring ownership. Your current carrier forwards calls to Retell via SIP.

### How It Works
1. Business keeps their number with current carrier (Twilio, Telnyx, Vonage, etc.)
2. Configure SIP trunk to route calls to Retell
3. Retell's AI agent answers calls on that number

### When to Use This
- Business has an established number they don't want to change
- Marketing materials already have the number printed
- Multiple lines where only some should go to AI
- Trial period before committing to full migration

### Supported Carriers
Retell has official guides for:
- **Twilio** (recommended)
- **Telnyx**
- **Vonage**
- Any carrier supporting Elastic SIP Trunking

### Setup Steps (Manual - Twilio Example)

#### Step 1: Create Elastic SIP Trunk in Twilio
1. Go to Twilio Console → Elastic SIP Trunking → Trunks
2. Create a new trunk with a descriptive name
3. Configure **Termination** (for outbound):
   - Add a Termination SIP URI (e.g., `yourtrunk.pstn.twilio.com`)
   - Set authentication: username + password
4. Configure **Origination** (for inbound):
   - Set Origination SIP URI: `sip:sip.retellai.com`

#### Step 2: Move Phone Number to Trunk
1. In Twilio Console → Phone Numbers
2. Select the number to use with AI
3. Configure it to use your Elastic SIP Trunk

#### Step 3: Import Number to Retell
1. Go to Retell Dashboard → Phone Numbers → Add
2. Select "Connect via SIP Trunking"
3. Enter:
   - **Phone Number**: `+1XXXXXXXXXX` (E.164 format)
   - **Termination URI**: `yourtrunk.pstn.twilio.com`
   - **Username/Password**: From Twilio termination settings
4. Assign your AI agent to the number

### Retell API Import (Programmatic)
```javascript
await retell.phoneNumber.import({
  phone_number: '+14155551234',
  termination_uri: 'yourtrunk.pstn.twilio.com',
  sip_trunk_auth_username: 'your_username',
  sip_trunk_auth_password: 'your_password',
  inbound_agent_id: 'agent_xxx',
});
```

### Pricing
- No Retell phone charges (you're bringing your own)
- Continue paying your carrier (Twilio: ~$1-2/month per number)
- SIP trunk costs vary by carrier
- Retell per-minute charges still apply

### Troubleshooting
- **Inbound not working?** Check origination URI is `sip:sip.retellai.com`
- **Outbound not working?** Verify termination URI and credentials
- **International calls?** Enable countries in Twilio Voice Geographic Permissions

---

## Option 3: Port Number to Retell Ecosystem

Transfer full ownership of your existing number to Twilio/Telnyx, then connect to Retell.

### How It Works
1. Submit Letter of Authorization (LOA) to port number from current carrier
2. Number transfers to Twilio or Telnyx (1-4 weeks)
3. Connect to Retell via SIP trunking
4. Full control through Retell + carrier dashboard

### Important: Retell Doesn't Port Directly
Retell AI does **not** handle number porting themselves. Instead:
1. Port your number TO a supported carrier (Twilio, Telnyx)
2. Then connect that carrier to Retell via SIP trunking

### When to Use This
- Want to consolidate all numbers under one carrier
- Current carrier doesn't support SIP trunking
- Need full ownership transfer for business reasons

### Porting Process

#### Step 1: Gather Information
You'll need from your current carrier:
- Account number
- Account PIN/password
- Authorized user name (must match exactly)
- Service address on file
- Current carrier's billing name

#### Step 2: Submit Port Request
**For Twilio:**
1. Go to Twilio Console → Phone Numbers → Port & Host
2. Click "Start a Port"
3. Enter the number(s) to port
4. Complete the Letter of Authorization (LOA)
5. Upload any required documentation

**For Telnyx:**
1. Go to Telnyx Portal → Numbers → Porting
2. Create new port order
3. Fill out LOA with exact account information
4. Submit and wait for carrier approval

#### Step 3: Wait for Port Completion
- **Simple ports**: 1-2 weeks
- **Complex ports** (toll-free, multiple numbers): 2-4 weeks
- You'll receive updates via email

#### Step 4: Configure SIP Trunking
Once ported, follow Option 2 steps to connect to Retell.

### LOA Requirements
The Letter of Authorization must include:
- Authorized signer name (matching carrier records)
- Company name
- Service address
- Phone number(s) being ported
- Account number with current carrier
- Signature and date

**Important:** Information must match your current carrier's records exactly, or the port will be rejected.

### Pricing
- One-time porting fee: Usually free with Twilio/Telnyx
- Ongoing: $2/month for the number + Retell usage

---

## Comparison Table

| Feature | New Number | Forward (SIP) | Full Port |
|---------|------------|---------------|-----------|
| Setup time | Instant | 1-2 hours | 1-4 weeks |
| Keep existing number | No | Yes | Yes |
| Keep existing carrier | N/A | Yes | No |
| Monthly cost | $2 | Carrier rates | $2 |
| Complexity | Low | Medium | High |
| Requires tech setup | No | Yes (SIP config) | Yes |
| Retell manages billing | Yes | No | Yes (after port) |

---

## Recommendations by Scenario

### New Business / Startup
→ **Option 1: New Number** - Get up and running immediately

### Established Business with Existing Number
→ **Option 2: Forward via SIP** - Keep your number, add AI handling

### Business Consolidating Services
→ **Option 3: Full Port** - Move everything to Retell ecosystem

### Multi-Location Business
→ **Option 2 for main lines** + **Option 1 for new locations**

---

## Implementation in GreenLine AI

### Admin Dashboard Flow
1. User selects phone preference during onboarding:
   - "Get a new local number" → Option 1
   - "Forward my existing number" → Option 2
   - "Port my number to GreenLine" → Option 3

2. For Option 1: Deploy button handles everything automatically

3. For Options 2 & 3:
   - System creates the agent without phone
   - Admin follows up with SIP configuration instructions
   - Number is imported manually via Retell dashboard or API

### API Endpoints

**Option 1 - New Number:**
```
POST /api/agents/create
{ onboarding_id: "xxx", assign_phone: true }
```

**Option 2/3 - Import Existing:**
```
POST /api/agents/import-number
{
  onboarding_id: "xxx",
  phone_number: "+14155551234",
  termination_uri: "trunk.pstn.twilio.com",
  sip_username: "xxx",
  sip_password: "xxx"
}
```

---

## Resources

- [Retell AI Phone Number Docs](https://docs.retellai.com/make-calls/phone-call)
- [Retell Import Phone Number API](https://docs.retellai.com/api-references/import-phone-number)
- [Twilio Elastic SIP Trunking](https://docs.retellai.com/deploy/twilio)
- [Telnyx SIP Setup](https://docs.retellai.com/deploy/telnyx)
- [Twilio Number Porting](https://www.twilio.com/docs/phone-numbers/porting)
- [Telnyx Number Porting](https://support.telnyx.com/en/articles/2034326-how-to-fill-out-an-loa)

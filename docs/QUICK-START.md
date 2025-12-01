# Quick Start Guide - Login & Make Calls

## ✅ Your Setup Status

### Authentication
✅ Login page exists at `/login`
✅ Middleware protecting dashboard routes
✅ Supabase auth configured

### Leads Data
✅ Phone numbers in database (e.g., (909) 389-0077, (714) 860-7099, etc.)
✅ 400+ leads imported with valid phone numbers

### Calling System
✅ Retell AI integration complete
⚠️ Need to add your Retell credentials

---

## 🚀 Getting Started

### Step 1: Create Your Account

1. **Go to signup page:**
   - Navigate to: `http://localhost:3000/signup`
   - Or click "Sign Up" from landing page

2. **Use this email:**
   ```
   Email: Gugo2942@gmail.com
   Password: (create a secure password)
   ```
   
   This email matches the leads in your database!

### Step 2: Login

1. Go to: `http://localhost:3000/login`
2. Enter your credentials
3. You'll be redirected to `/dashboard`

### Step 3: Import Leads (First Time Only)

Run this in your Supabase SQL Editor:

```sql
-- Option 1: Quick test (29 leads)
-- Already in import-leads-supabase.sql

-- Option 2: Full import (400+ leads)
-- Use scripts/import-leads.sql
```

To access Supabase:
1. Go to: https://supabase.com/dashboard
2. Select your project: nggelyppkswqxycblvcb
3. Click "SQL Editor"
4. Paste the import script
5. Run it

### Step 4: Add Retell AI Credentials

Update `.env.local`:

```env
VOICE_AI_API_KEY=key_xxxxxxxxx  # From Retell dashboard
RETELL_AGENT_ID=agent_xxxxxxxx   # From Retell dashboard
VOICE_AI_PROVIDER=retell
```

Get these from: https://beta.retellai.com/dashboard

### Step 5: Start Calling!

1. Login to dashboard
2. Go to **Dialer** page (`/dashboard/dialer`)
3. You'll see leads with phone numbers like:
   - Mowbray Tree Services: (909) 389-0077
   - GRS Landscaping: (714) 860-7099
   - Mimosa Nursery: (323) 722-4543
4. Click **"Start Call"**
5. Retell AI will dial the real phone number!

---

## 🔐 Authentication Flow

```
Landing Page (/)
    ↓
[Not Logged In]
    ↓
Click "Login" or try to access /dashboard
    ↓
/login page
    ↓
Enter credentials
    ↓
[Authenticated]
    ↓
/dashboard (protected)
```

---

## 📞 How Calling Works

```
1. Login to dashboard
2. Go to Dialer
3. Select lead with phone number
4. Click "Start Call"
5. System calls: POST /api/calls/initiate
6. Retell AI dials: (909) 389-0077
7. AI agent converses with lead
8. Webhook updates status
9. Transcript appears in UI
```

---

## ⚠️ Troubleshooting

### "Takes me straight to dashboard"

**This happens when:**
- You're already logged in (Supabase session exists)
- Landing page redirects authenticated users

**To fix:**
1. Logout: Go to dashboard → Settings → Logout
2. Or clear cookies for localhost:3000
3. Now you'll see login page when accessing /dashboard

### "Can't call leads"

**Check:**
1. ✅ Lead has phone number (check database)
2. ✅ VOICE_AI_API_KEY is set in .env.local
3. ✅ RETELL_AGENT_ID is set
4. ✅ Phone number format: (XXX) XXX-XXXX

### "No leads showing"

**Solution:**
1. Go to Supabase SQL Editor
2. Check: `SELECT COUNT(*) FROM leads;`
3. If 0, run import script
4. Make sure user_id matches your auth.users.id

---

## 🎯 Quick Commands

**Check if you're logged in:**
```javascript
// In browser console on localhost:3000
localStorage.getItem('supabase.auth.token')
```

**Manual logout:**
```javascript
// In browser console
localStorage.clear()
// Then refresh page
```

**Check leads in database:**
```sql
SELECT business_name, phone FROM leads LIMIT 10;
```

---

## 📋 Current Leads Sample

Your database has these leads ready to call:

| Business | Phone | Location |
|----------|-------|----------|
| Mowbray Tree Services | (909) 389-0077 | San Bernardino, CA |
| GRS Landscaping | (714) 860-7099 | Buena Park, CA |
| Mimosa Nursery | (323) 722-4543 | Los Angeles, CA |
| Mario Tree Service | (562) 322-2246 | Whittier, CA |
| Grassland Landscape | (562) 551-8873 | Long Beach, CA |

All formatted correctly for Retell AI calling!

---

## Next Steps

1. ✅ Sign up with Gugo2942@gmail.com
2. ✅ Login to dashboard
3. ✅ Add Retell credentials
4. ✅ Go to Dialer
5. ✅ Make your first call!

The system is ready - just need your Retell API credentials to start calling.

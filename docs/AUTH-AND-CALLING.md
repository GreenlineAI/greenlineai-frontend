# GreenLine AI - Authentication & Calling Setup

## ✅ What's Working Now

### 1. Authentication Flow
- ✅ Login page at `/login`
- ✅ Signup page at `/signup`
- ✅ Protected dashboard routes
- ✅ Middleware redirects unauthenticated users
- ✅ **NEW:** Login/Dashboard button in header (shows based on auth state)
- ✅ Logout button in dashboard sidebar

### 2. Leads with Phone Numbers
- ✅ 400+ leads in SQL import file
- ✅ All have valid phone numbers (e.g., (909) 389-0077)
- ✅ Phone numbers ready for Retell AI calling

### 3. Calling System
- ✅ Retell AI integration complete
- ✅ Dialer page ready at `/dashboard/dialer`
- ⚠️ **Needs your Retell credentials to work**

---

## 🔐 How to Access Dashboard

### Method 1: Create Account (Recommended)

1. **Visit:** `http://localhost:3000/signup`
2. **Sign up with:**
   - Email: `Gugo2942@gmail.com` (matches your leads)
   - Password: (your choice)
3. **Auto-redirected to:** `/dashboard`

### Method 2: Login with Existing Account

1. **Visit:** `http://localhost:3000/login`
2. **Or click "Login"** button in header
3. Enter your credentials
4. Redirected to dashboard

### Method 3: From Landing Page

1. Visit `http://localhost:3000`
2. Click **"Login"** button in header (top right)
3. Enter credentials

---

## 📱 How to Call Leads

### Step 1: Add Retell Credentials

Create/update `.env.local`:

```env
# Retell AI (get from https://beta.retellai.com/dashboard)
VOICE_AI_API_KEY=key_xxxxxxxxxxxxxxxxxx
RETELL_AGENT_ID=agent_xxxxxxxxxxxxxxxxxx
VOICE_AI_PROVIDER=retell
```

### Step 2: Import Leads

Run in Supabase SQL Editor:
```sql
-- File: scripts/import-leads.sql
-- This imports 400+ leads with phone numbers
```

### Step 3: Start Calling

1. Login to dashboard
2. Go to **"Dialer"** (left sidebar)
3. See list of leads with phone numbers
4. Click **"Start Call"** on any lead
5. Retell AI dials the real phone number
6. Transcript appears in real-time
7. Call recorded automatically

---

## 🎯 Lead Phone Numbers

Your leads already have valid phone numbers:

```sql
-- Sample from database:
Mowbray Tree Services     → (909) 389-0077
GRS Landscaping           → (714) 860-7099  
Mimosa Nursery           → (323) 722-4543
Mario Tree Service       → (562) 322-2246
Grassland Landscape      → (562) 551-8873
```

All formatted correctly for calling!

---

## ⚙️ Why You See Dashboard Without Login

**This happens when:**
- You're already logged in (Supabase session active)
- Browser has auth cookie saved
- Middleware sees valid session and allows access

**To test login flow:**
1. Click "Logout" in dashboard sidebar
2. Or clear cookies: DevTools → Application → Cookies → Delete
3. Visit `/dashboard` - now redirects to `/login` ✅

---

## 🔄 Complete User Flow

```
Landing Page (/)
    ↓
[See "Login" button in header]
    ↓
Click "Login"
    ↓
/login page
    ↓
Enter credentials
    ↓
Authenticated ✅
    ↓
/dashboard (protected)
    ↓
Click "Dialer" in sidebar
    ↓
See leads with phone numbers
    ↓
Click "Start Call"
    ↓
Retell AI dials phone number
    ↓
Conversation happens
    ↓
Transcript saved
    ↓
Lead status updated
```

---

## 📞 Calling Requirements

### Before First Call:

1. ✅ Account created (Gugo2942@gmail.com)
2. ✅ Leads imported (run SQL script)
3. ⚠️ **Add Retell API credentials**
4. ✅ Login to dashboard
5. ✅ Go to Dialer page

### What Happens When You Call:

```javascript
// User clicks "Start Call" on lead
↓
POST /api/calls/initiate
    phoneNumber: "(909) 389-0077"
    leadId: "abc123"
↓
Retell AI receives request
↓
Retell dials phone number
↓
AI agent converses
↓
Webhook updates status
↓
Transcript appears in UI
↓
Call completed
```

---

## 🐛 Troubleshooting

### "Takes me straight to dashboard"
**You're already logged in!**
- Click "Logout" in sidebar to test login
- Or you can just start using it

### "Can't find Login button"
**Now fixed!**
- Check header top-right
- Shows "Login" when logged out
- Shows "Dashboard" when logged in

### "No leads to call"
**Import them:**
```bash
# Go to Supabase SQL Editor
# Run: scripts/import-leads.sql
```

### "Call fails / doesn't connect"
**Check:**
1. VOICE_AI_API_KEY is set in .env.local
2. RETELL_AGENT_ID is set
3. Phone number exists on lead
4. Retell account has credits

---

## ✅ System is Ready!

Your platform has:
- ✅ Working authentication
- ✅ Login/Logout flow
- ✅ Protected routes
- ✅ Leads with phone numbers
- ✅ Retell AI integration
- ✅ Real-time dialer

**Just need:** Your Retell API credentials to start calling!

Get them at: https://beta.retellai.com/dashboard

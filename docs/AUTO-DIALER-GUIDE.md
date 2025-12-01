# Auto-Dialer Setup & Usage Guide

## Overview
The auto-dialer automatically calls through your lead database using Stammer AI, systematically booking appointments while you focus on closing deals.

**Your Current Setup:**
- **Total Leads**: 450 (909 in database, 450 available to call)
- **User ID**: `0b627f19-6ea2-469b-a596-84cab72190c9`
- **Stammer Agent**: `893b87dd-0f63-4866-8cae-d60b696cae1a`

---

## How It Works

### Automated Schedule
The auto-dialer runs **every hour** from **9 AM to 6 PM, Monday-Friday**:
- ⏰ 9:00 AM - Makes 10 calls
- ⏰ 10:00 AM - Makes 10 calls
- ⏰ 11:00 AM - Makes 10 calls
- ... continues every hour
- ⏰ 6:00 PM - Final batch

**Daily Limit**: 100 calls/day (prevents spam, maintains quality)

### Smart Calling Logic
1. **Prioritizes New Leads**: Calls "new" status leads first
2. **Retries No-Answers**: Tries "no_answer" leads up to 3 times
3. **Respects Do-Not-Call**: Skips "not_interested" and "do_not_contact"
4. **Paces Calls**: 30-second delay between calls
5. **Working Hours Only**: 9 AM - 6 PM, weekdays only

---

## Configuration

### In `wrangler.toml`
```toml
[vars]
# Auto-Dialer Settings
AUTO_DIALER_USER_ID = "0b627f19-6ea2-469b-a596-84cab72190c9"
NEXT_PUBLIC_SITE_URL = "https://greenlineai-frontend.pages.dev"

# Cron Schedule
[triggers]
crons = ["0 9-18 * * 1-5"]  # Every hour, 9 AM-6 PM, Mon-Fri
```

### In `/functions/scheduled/auto-dialer.ts`
```typescript
const CONFIG = {
  DAILY_CALL_LIMIT: 100,         // Max 100 calls/day
  CALLS_PER_BATCH: 10,           // 10 calls per hour
  DELAY_BETWEEN_CALLS: 30000,    // 30 seconds between
  WORKING_HOURS_START: 9,        // 9 AM
  WORKING_HOURS_END: 18,         // 6 PM
  EXCLUDED_DAYS: [0, 6],         // Weekend off
  MAX_ATTEMPTS_PER_LEAD: 3,      // Try each lead 3 times max
};
```

---

## Testing Before Going Live

### 1. Test with Your Own Phone (Dry Run)
```bash
npm run test-dialer:dry
```
This shows you what would happen without making actual calls.

### 2. Test with 1 Real Call
```bash
npm run test-dialer 1
```
Makes 1 actual call to verify Stammer integration works.

### 3. Test with 5 Calls
```bash
npm run test-dialer 5
```
Makes 5 calls to test batch processing.

### 4. View Results
After testing, check:
- **Call Logs**: https://greenlineai-frontend.pages.dev/dashboard/calls
- **Lead Status**: Updated in database
- **Stammer Dashboard**: Listen to recordings

---

## Deployment

### Step 1: Push Code
```bash
git add -A
git commit -m "feat: add auto-dialer with cron scheduling"
git push
```

### Step 2: Deploy to Cloudflare
The code auto-deploys to Cloudflare Pages. The cron trigger will activate automatically.

### Step 3: Set Environment Variables
In Cloudflare Dashboard:
1. Go to **Workers & Pages** → **greenlineai-frontend**
2. Go to **Settings** → **Environment Variables**
3. Add these (if not already set):
   ```
   AUTO_DIALER_USER_ID = 0b627f19-6ea2-469b-a596-84cab72190c9
   NEXT_PUBLIC_SITE_URL = https://greenlineai-frontend.pages.dev
   SUPABASE_SERVICE_ROLE_KEY = [your service role key]
   ```

### Step 4: Verify Cron Trigger
1. In Cloudflare Dashboard → **Triggers** tab
2. You should see: `0 9-18 * * 1-5`
3. Status should be **Active**

---

## Monitoring

### Real-Time Dashboard
View all calls at: `/dashboard/calls`
- See who was called
- Listen to recordings
- Check booking status
- Review transcripts

### Daily Reports
Every evening, check:
1. **Total Calls Made**: Should be ≤100/day
2. **Booking Rate**: Target 8-12%
3. **Failed Calls**: Investigate why
4. **Callback Requests**: Add to calendar

### Weekly Review
Every Monday:
1. Review last week's stats
2. Listen to 5-10 random calls
3. Update Stammer AI prompt based on patterns
4. Adjust call timing if needed

---

## Expected Results

### Week 1 (450 leads, 100 calls/day)
- **Monday**: 100 calls → ~10 meetings booked
- **Tuesday**: 100 calls → ~10 meetings booked
- **Wednesday**: 100 calls → ~10 meetings booked
- **Thursday**: 100 calls → ~10 meetings booked
- **Friday**: 50 calls → ~5 meetings booked
- **Total**: 450 calls → **36-54 meetings booked**

### Call Outcomes Breakdown (Estimated)
- **30-40%** Answer rate → 135-180 conversations
- **8-12%** Booking rate → 36-54 meetings
- **40-50%** No answer → 180-225 (retry later)
- **10-15%** Not interested → 45-68 (no follow-up)
- **5-10%** Callback requested → 23-45 (schedule follow-up)

### ROI Calculation
- **Cost**: $0.10/min × 3 min avg = $0.30/call
- **450 calls** = $135 in calling costs
- **45 meetings** booked = $3/meeting
- **Close rate 20%** = 9 new clients
- **Average deal $1,500** = **$13,500 revenue**
- **ROI**: 100x return on calling costs

---

## Troubleshooting

### "No calls being made"
**Check:**
1. Is it within working hours? (9 AM - 6 PM, Mon-Fri)
2. Have you hit daily limit? (100 calls/day)
3. Are there leads with status "new" or "no_answer"?
4. Is cron trigger active in Cloudflare?

**Solution:**
```bash
# Check lead count
SELECT COUNT(*) FROM leads 
WHERE user_id = '0b627f19-6ea2-469b-a596-84cab72190c9' 
AND status IN ('new', 'no_answer');

# Check today's call count
SELECT COUNT(*) FROM outreach_calls 
WHERE user_id = '0b627f19-6ea2-469b-a596-84cab72190c9' 
AND created_at > CURRENT_DATE;
```

### "Calls failing"
**Check:**
1. Stammer API key valid?
2. Phone numbers formatted correctly? (E.164: +1234567890)
3. Webhook endpoint working?

**Solution:**
```bash
# Test single call manually
npm run test-dialer 1
```

### "Low booking rate (<5%)"
**Check:**
1. Listen to call recordings
2. Are objections being handled well?
3. Is value prop clear?
4. Too script-y or too casual?

**Solution:**
1. Update Stammer AI prompt in dashboard
2. Add more training examples
3. Test different opening lines
4. A/B test agent personalities

### "Leads not updating"
**Check:**
1. Webhook receiving call results?
2. Database RLS policies correct?
3. Lead IDs matching?

**Solution:**
```bash
# Check webhook endpoint
curl -X POST https://greenlineai-frontend.pages.dev/api/calls/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

---

## Scaling Up

### After First 450 Leads
1. **Import More Leads**: Use CSV import at `/dashboard/leads`
2. **Increase Daily Limit**: Change `DAILY_CALL_LIMIT` to 200
3. **Add More Hours**: Extend to 8 AM - 7 PM if needed
4. **Weekend Calling**: Remove `[0, 6]` from `EXCLUDED_DAYS`

### Multiple Users
To enable for multiple clients:
1. Create separate cron triggers per user
2. Or run single cron that loops through all users
3. Set different daily limits per user tier

### Multiple Agents
For different industries:
1. Create separate Stammer agents (HVAC, landscaping, etc.)
2. Route leads to appropriate agent based on industry
3. Track which agent performs best per vertical

---

## Manual Controls

### Pause Auto-Dialer
```bash
# In Cloudflare Dashboard
1. Go to Triggers tab
2. Toggle cron trigger to "Disabled"
```

### Resume Auto-Dialer
```bash
# In Cloudflare Dashboard
1. Go to Triggers tab
2. Toggle cron trigger to "Active"
```

### Force Run Now
```bash
# In Cloudflare Dashboard
1. Go to Triggers tab
2. Click "Send Test Event"
3. Or use wrangler CLI:
wrangler pages deployment tail greenlineai-frontend --environment production
```

### Change Schedule
Edit `wrangler.toml`:
```toml
# Run every 30 minutes instead of hourly
crons = ["0,30 9-18 * * 1-5"]

# Run twice per hour
crons = ["0,30 * * * 1-5"]

# Run every 2 hours
crons = ["0 9-18/2 * * 1-5"]
```

---

## Best Practices

### ✅ DO:
- Start with small batches (10-20 calls)
- Monitor first 50 calls closely
- Adjust prompt based on actual results
- Respect do-not-call requests immediately
- Keep accurate records

### ❌ DON'T:
- Call before 9 AM or after 6 PM
- Exceed 100 calls/day initially
- Call the same lead more than 3 times
- Ignore negative feedback
- Skip monitoring call logs

---

## Support

### Logs & Debugging
- **Cloudflare Logs**: View in Cloudflare Dashboard → Logs
- **Call Logs**: `/dashboard/calls`
- **Supabase Logs**: Check database queries

### Getting Help
1. Check call logs first
2. Review Stammer recordings
3. Test with `npm run test-dialer 1`
4. Check Cloudflare cron trigger status

---

## Summary Checklist

Before going live:
- [ ] Stammer AI agent configured with optimized prompt
- [ ] Test dialer with your own phone: `npm run test-dialer 1`
- [ ] Environment variables set in Cloudflare
- [ ] Cron trigger active (9 AM-6 PM, Mon-Fri)
- [ ] Webhook endpoint working
- [ ] Call logs dashboard accessible
- [ ] Daily limit set to 100
- [ ] Leads have status "new" or "no_answer"

Once live:
- [ ] Monitor first hour's batch (10 calls)
- [ ] Listen to 2-3 recordings
- [ ] Verify leads are updating
- [ ] Check booking rate after 50 calls
- [ ] Adjust prompt if needed
- [ ] Scale gradually

---

**Your auto-dialer is ready! It will systematically call through all 450 leads, booking appointments while you focus on closing deals. 🚀**

Expected results: **36-54 meetings booked** from your 450 leads over the next week.

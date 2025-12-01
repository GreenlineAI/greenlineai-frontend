# Campaign Automation Setup

This system automatically processes campaigns and makes calls on a schedule.

## How It Works

The cron job at `/api/cron/campaign-automation` runs every 15 minutes and:

1. ✅ Checks if it's business hours (9 AM - 6 PM)
2. ✅ Finds all active campaigns
3. ✅ Gets leads that haven't been contacted
4. ✅ Creates call records (up to 5 per campaign per run)
5. ✅ Updates lead statuses
6. ✅ Auto-pauses completed campaigns

## Setup Instructions

### 1. Add Environment Variable

Add to your `.env.local` and deployment:

```bash
CRON_SECRET=your-secret-key-here-generate-a-random-string
```

### 2. Configure Vercel Cron (Recommended)

Create `vercel.json` in your project root:

```json
{
  "crons": [
    {
      "path": "/api/cron/campaign-automation",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

This runs every 15 minutes.

### 3. Or Use GitHub Actions

Create `.github/workflows/cron-campaigns.yml`:

```yaml
name: Campaign Automation
on:
  schedule:
    - cron: '*/15 * * * *'  # Every 15 minutes
  workflow_dispatch:  # Allow manual trigger

jobs:
  run-cron:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger campaign automation
        run: |
          curl -X GET "https://your-domain.com/api/cron/campaign-automation" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

### 4. Or Use cron-job.org

1. Go to https://cron-job.org
2. Create a new cron job
3. URL: `https://your-domain.com/api/cron/campaign-automation`
4. Schedule: Every 15 minutes
5. Add header: `Authorization: Bearer your-cron-secret`

## Testing

Test the cron job manually:

```bash
curl -X GET "https://your-domain.com/api/cron/campaign-automation" \
  -H "Authorization: Bearer your-cron-secret"
```

Response:
```json
{
  "success": true,
  "timestamp": "2025-12-01T14:30:00Z",
  "campaigns_processed": 2,
  "calls_initiated": 8,
  "campaigns_paused": 0,
  "errors": []
}
```

## Rate Limiting

- Maximum 5 calls per campaign per run (every 15 minutes)
- That's up to 20 calls per hour per campaign
- 160 calls per day per campaign (during business hours)
- Respects business hours: 9 AM - 6 PM only

## Campaign Flow

1. **User creates campaign** → Status: `draft`
2. **User activates campaign** → Status: `active`
3. **Cron job picks it up** → Makes calls automatically
4. **All leads contacted** → Status: `completed`
5. **User can pause anytime** → Status: `paused`

## For litigator2334@gmail.com

Once you activate a campaign:
1. The system will automatically start calling leads
2. Calls happen every 15 minutes during business hours
3. You'll see progress in the dashboard
4. Meetings will be tracked automatically
5. You get email notifications for booked meetings

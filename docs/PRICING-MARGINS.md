# GreenLine AI Pricing & Margins Analysis

## Retell AI Cost Structure

**Base Cost**: $0.095/minute

This includes:
- LLM processing
- Voice synthesis
- Telephony

---

## Pricing Plans

### Monthly Pricing

| Plan | Price | Minutes Included | Cost to Us | Gross Margin | Margin % |
|------|-------|------------------|------------|--------------|----------|
| **Starter** | $149/mo | 200 min | $19.00 | $130.00 | 87.2% |
| **Professional** | $297/mo | 500 min | $47.50 | $249.50 | 84.0% |
| **Business** | $497/mo | Unlimited* | Variable | Variable | Variable |

*Business plan "unlimited" - estimate based on typical usage

### Annual Pricing (2 months free = ~17% discount)

| Plan | Monthly Equiv | Annual Total | Minutes/yr | Cost to Us/yr | Gross Margin/yr | Margin % |
|------|---------------|--------------|------------|---------------|-----------------|----------|
| **Starter** | $124/mo | $1,488/yr | 2,400 min | $228.00 | $1,260.00 | 84.7% |
| **Professional** | $247/mo | $2,964/yr | 6,000 min | $570.00 | $2,394.00 | 80.8% |
| **Business** | $414/mo | $4,968/yr | Unlimited | Variable | Variable | Variable |

---

## Business Plan Margin Analysis

Since Business is "unlimited", margin depends on actual usage:

| Monthly Usage | Cost to Us | Revenue | Margin | Margin % |
|---------------|------------|---------|--------|----------|
| 500 min | $47.50 | $497 | $449.50 | 90.4% |
| 1,000 min | $95.00 | $497 | $402.00 | 80.9% |
| 1,500 min | $142.50 | $497 | $354.50 | 71.3% |
| 2,000 min | $190.00 | $497 | $307.00 | 61.8% |
| 3,000 min | $285.00 | $497 | $212.00 | 42.7% |
| 5,000 min | $475.00 | $497 | $22.00 | 4.4% |
| 5,232 min | $497.04 | $497 | -$0.04 | **Break-even** |

**Break-even point for Business plan**: ~5,232 minutes/month (~87 hours)

### Recommendation for Business Plan
Consider implementing a soft cap or fair usage policy:
- 2,000 min/month = 61.8% margin (healthy)
- Alert at 3,000 min/month
- Review accounts exceeding 4,000 min/month

---

## Cost Per Minute Comparison

| Provider | Cost/min | Notes |
|----------|----------|-------|
| **Retell AI** | $0.095 | Our cost |
| **Human Receptionist** | $0.50-1.00 | Based on $15-30/hr |
| **Answering Service** | $0.80-1.50 | Traditional services |
| **Ruby Receptionist** | $1.50+ | Premium service |

**Our markup over Retell**:
- Starter: $0.745/min effective price ($149/200 min)
- Professional: $0.594/min effective price ($297/500 min)

---

## Revenue Projections

### Per Customer Lifetime Value (assuming 12-month retention)

| Plan | Monthly | Annual Rev | Cost | Gross Profit |
|------|---------|------------|------|--------------|
| Starter Monthly | $149 | $1,788 | $228 | $1,560 |
| Starter Annual | $124 | $1,488 | $228 | $1,260 |
| Professional Monthly | $297 | $3,564 | $570 | $2,994 |
| Professional Annual | $247 | $2,964 | $570 | $2,394 |
| Business Monthly | $497 | $5,964 | ~$1,140* | ~$4,824 |
| Business Annual | $414 | $4,968 | ~$1,140* | ~$3,828 |

*Assuming 1,000 min/month average usage for Business

### Monthly Recurring Revenue (MRR) Goals

| Customers | Starter | Pro | Business | Total MRR | Annual Run Rate |
|-----------|---------|-----|----------|-----------|-----------------|
| 10 each | $1,490 | $2,970 | $4,970 | $9,430 | $113,160 |
| 25 each | $3,725 | $7,425 | $12,425 | $23,575 | $282,900 |
| 50 each | $7,450 | $14,850 | $24,850 | $47,150 | $565,800 |
| 100 each | $14,900 | $29,700 | $49,700 | $94,300 | $1,131,600 |

---

## Additional Costs to Consider

| Item | Estimated Cost | Notes |
|------|----------------|-------|
| Phone Numbers | $1-2/mo each | Twilio/Retell |
| SMS | $0.0075/message | If using SMS features |
| Cal.com | Free tier or $12/mo | Booking system |
| Supabase | Free tier or $25/mo | Database |
| Vercel/Cloudflare | Free tier | Hosting |
| Support Labor | Variable | Your time or team |

---

## Margin Summary

| Plan | Monthly Margin % | Annual Margin % |
|------|------------------|-----------------|
| Starter | 87.2% | 84.7% |
| Professional | 84.0% | 80.8% |
| Business (avg) | ~65-80% | ~60-75% |

**Overall blended margin target**: 75-85%

---

## Pricing Strategy Notes

1. **Starter** - High margin, low commitment. Good for acquisition.
2. **Professional** - Best value, push customers here. Sweet spot.
3. **Business** - Premium positioning, watch usage closely.
4. **Annual** - Lower margin but better cash flow and retention.

### Upsell Path
Starter → Professional: +$148/mo (+99% increase)
Professional → Business: +$200/mo (+67% increase)

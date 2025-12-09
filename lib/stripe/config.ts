// Stripe price IDs - these should be set in environment variables in production
// Format: price_[plan]_[interval]
export const STRIPE_PRICES = {
  starter: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY || 'price_starter_monthly',
    annual: process.env.STRIPE_PRICE_STARTER_ANNUAL || 'price_starter_annual',
  },
  professional: {
    monthly: process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY || 'price_professional_monthly',
    annual: process.env.STRIPE_PRICE_PROFESSIONAL_ANNUAL || 'price_professional_annual',
  },
  business: {
    monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY || 'price_business_monthly',
    annual: process.env.STRIPE_PRICE_BUSINESS_ANNUAL || 'price_business_annual',
  },
} as const;

// Map Stripe plan names to database plan values
export const PLAN_TO_DB_VALUE: Record<string, 'leads' | 'outreach' | 'whitelabel'> = {
  starter: 'leads',
  professional: 'outreach',
  business: 'whitelabel',
};

// Map price IDs to plan names
export const PRICE_TO_PLAN: Record<string, string> = {
  [STRIPE_PRICES.starter.monthly]: 'starter',
  [STRIPE_PRICES.starter.annual]: 'starter',
  [STRIPE_PRICES.professional.monthly]: 'professional',
  [STRIPE_PRICES.professional.annual]: 'professional',
  [STRIPE_PRICES.business.monthly]: 'business',
  [STRIPE_PRICES.business.annual]: 'business',
};

// Valid price IDs
export const VALID_PRICE_IDS = new Set([
  STRIPE_PRICES.starter.monthly,
  STRIPE_PRICES.starter.annual,
  STRIPE_PRICES.professional.monthly,
  STRIPE_PRICES.professional.annual,
  STRIPE_PRICES.business.monthly,
  STRIPE_PRICES.business.annual,
]);

// Plan features for display
export const PLAN_FEATURES = {
  starter: {
    name: 'Starter',
    price: { monthly: 149, annual: 124 },
    features: [
      '200 call minutes/month',
      '1 phone number',
      'Basic AI script',
      'Call recording & transcripts',
      'Email notifications',
      'Standard support',
    ],
  },
  professional: {
    name: 'Professional',
    price: { monthly: 297, annual: 247 },
    features: [
      '500 call minutes/month',
      '2 phone numbers',
      'Custom AI voice & script',
      'Appointment booking',
      'Google Calendar sync',
      'SMS & email notifications',
      'Call analytics dashboard',
      'Priority support',
    ],
  },
  business: {
    name: 'Business',
    price: { monthly: 497, annual: 414 },
    features: [
      'Unlimited call minutes',
      '5 phone numbers',
      'Multiple AI personas',
      'Multi-location support',
      'CRM integrations',
      'Priority call routing',
      'Dedicated account manager',
      '99.9% uptime SLA',
    ],
  },
} as const;

export type PlanName = keyof typeof STRIPE_PRICES;
export type BillingInterval = 'monthly' | 'annual';

import { getStripe } from './client';
import { VALID_PRICE_IDS, PRICE_TO_PLAN, PLAN_TO_DB_VALUE } from './config';

interface CreateCheckoutSessionParams {
  userId: string;
  email: string;
  priceId: string;
  customerId?: string;
  trialDays?: number;
  successUrl?: string;
  cancelUrl?: string;
}

interface CheckoutSessionResult {
  sessionId: string;
  url: string;
}

export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<CheckoutSessionResult> {
  const {
    userId,
    email,
    priceId,
    customerId,
    trialDays = 14,
    successUrl,
    cancelUrl,
  } = params;

  // Validate required fields
  if (!userId || !email) {
    throw new Error('User ID and email are required');
  }

  // Validate price ID
  if (!VALID_PRICE_IDS.has(priceId)) {
    throw new Error('Invalid price ID');
  }

  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Get or create customer
  let stripeCustomerId = customerId;
  if (!stripeCustomerId) {
    // Check if customer already exists by email
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      stripeCustomerId = existingCustomers.data[0].id;
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email,
        metadata: {
          userId,
        },
      });
      stripeCustomerId = customer.id;
    }
  }

  // Get plan name from price ID
  const planName = PRICE_TO_PLAN[priceId] || 'starter';

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: stripeCustomerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_period_days: trialDays,
      metadata: {
        userId,
        plan: planName,
      },
    },
    metadata: {
      userId,
      plan: planName,
    },
    success_url: successUrl || `${appUrl}/dashboard/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl || `${appUrl}/pricing?canceled=true`,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    customer_update: {
      address: 'auto',
      name: 'auto',
    },
  });

  if (!session.url) {
    throw new Error('Failed to create checkout session');
  }

  return {
    sessionId: session.id,
    url: session.url,
  };
}

export async function getCheckoutSession(sessionId: string) {
  const stripe = getStripe();
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['subscription', 'customer'],
  });
}

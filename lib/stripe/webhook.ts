import Stripe from 'stripe';
import { getStripe } from './client';
import { PRICE_TO_PLAN, PLAN_TO_DB_VALUE } from './config';
import { createClient } from '@/lib/supabase/server';

interface WebhookResult {
  success: boolean;
  message?: string;
  error?: string;
}

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

export async function handleWebhookEvent(event: Stripe.Event): Promise<WebhookResult> {
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        return handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        return handleSubscriptionUpdated(event.data.object as Stripe.Subscription);

      case 'customer.subscription.deleted':
        return handleSubscriptionDeleted(event.data.object as Stripe.Subscription);

      case 'invoice.payment_failed':
        return handlePaymentFailed(event.data.object as Stripe.Invoice);

      case 'invoice.payment_succeeded':
        return handlePaymentSucceeded(event.data.object as Stripe.Invoice);

      default:
        return { success: true, message: `Unhandled event type: ${event.type}` };
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<WebhookResult> {
  const userId = session.metadata?.userId;
  const planName = session.metadata?.plan;

  if (!userId) {
    return { success: false, error: 'No userId in session metadata' };
  }

  const supabase = await createClient();

  // Get the DB plan value
  const dbPlan = planName ? PLAN_TO_DB_VALUE[planName] : 'leads';

  // Update user profile with Stripe info
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('profiles') as any)
    .update({
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      plan: dbPlan,
      subscription_status: 'active',
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }

  return { success: true, message: 'Checkout completed' };
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<WebhookResult> {
  const customerId = subscription.customer as string;
  const supabase = await createClient();

  // Get the price ID to determine the plan
  const priceId = subscription.items.data[0]?.price.id;
  const planName = priceId ? PRICE_TO_PLAN[priceId] : null;
  const dbPlan = planName ? PLAN_TO_DB_VALUE[planName] : undefined;

  // Determine subscription status
  let subscriptionStatus: string;
  if (subscription.status === 'active') {
    subscriptionStatus = subscription.cancel_at_period_end ? 'canceling' : 'active';
  } else if (subscription.status === 'trialing') {
    subscriptionStatus = 'trialing';
  } else if (subscription.status === 'past_due') {
    subscriptionStatus = 'past_due';
  } else {
    subscriptionStatus = subscription.status;
  }

  // Update user profile
  const updateData: Record<string, unknown> = {
    subscription_status: subscriptionStatus,
    stripe_subscription_id: subscription.id,
  };

  if (dbPlan) {
    updateData.plan = dbPlan;
  }

  // In Stripe API 2025-11-17, period fields are on subscription items
  const firstItem = subscription.items.data[0];
  if (firstItem?.current_period_end) {
    updateData.subscription_period_end = new Date(
      firstItem.current_period_end * 1000
    ).toISOString();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('profiles') as any)
    .update(updateData)
    .eq('stripe_customer_id', customerId);

  if (error) {
    console.error('Error updating subscription:', error);
    return { success: false, error: 'Failed to update subscription' };
  }

  return { success: true, message: 'Subscription updated' };
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<WebhookResult> {
  const customerId = subscription.customer as string;
  const supabase = await createClient();

  // Downgrade to free plan
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('profiles') as any)
    .update({
      plan: 'leads', // Default free plan
      subscription_status: 'canceled',
      stripe_subscription_id: null,
    })
    .eq('stripe_customer_id', customerId);

  if (error) {
    console.error('Error downgrading subscription:', error);
    return { success: false, error: 'Failed to downgrade subscription' };
  }

  return { success: true, message: 'Subscription deleted, user downgraded' };
}

async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<WebhookResult> {
  const customerId = invoice.customer as string;
  const supabase = await createClient();

  // Update subscription status to past_due
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('profiles') as any)
    .update({
      subscription_status: 'past_due',
      payment_failed_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId);

  if (error) {
    console.error('Error updating payment status:', error);
    return { success: false, error: 'Failed to update payment status' };
  }

  // TODO: Send email notification about failed payment

  return { success: true, message: 'Payment failure recorded' };
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<WebhookResult> {
  const customerId = invoice.customer as string;
  const supabase = await createClient();

  // Clear any past_due status
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('profiles') as any)
    .update({
      subscription_status: 'active',
      payment_failed_at: null,
    })
    .eq('stripe_customer_id', customerId);

  if (error) {
    console.error('Error updating payment status:', error);
    return { success: false, error: 'Failed to update payment status' };
  }

  return { success: true, message: 'Payment succeeded' };
}

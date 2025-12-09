import { getStripe } from './client';
import { createClient } from '@/lib/supabase/server';

interface SubscriptionStatus {
  plan: 'leads' | 'outreach' | 'whitelabel';
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'canceling' | 'none';
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  trialEnd?: string;
}

export async function getSubscriptionStatus(
  userId: string
): Promise<SubscriptionStatus> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile, error } = await (supabase.from('profiles') as any)
    .select('plan, subscription_status, subscription_period_end, stripe_subscription_id')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    return {
      plan: 'leads',
      status: 'none',
    };
  }

  return {
    plan: profile.plan || 'leads',
    status: profile.subscription_status || 'none',
    currentPeriodEnd: profile.subscription_period_end,
  };
}

export async function getSubscriptionDetails(subscriptionId: string) {
  if (!subscriptionId) {
    return null;
  }

  const stripe = getStripe();

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method', 'latest_invoice', 'items.data'],
    });

    // In Stripe API 2025-11-17, period fields are on subscription items
    const firstItem = subscription.items.data[0];

    return {
      id: subscription.id,
      status: subscription.status,
      currentPeriodEnd: firstItem?.current_period_end
        ? new Date(firstItem.current_period_end * 1000)
        : null,
      currentPeriodStart: firstItem?.current_period_start
        ? new Date(firstItem.current_period_start * 1000)
        : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      cancelAt: subscription.cancel_at
        ? new Date(subscription.cancel_at * 1000)
        : null,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
      priceId: firstItem?.price.id,
      amount: firstItem?.price.unit_amount,
      interval: firstItem?.price.recurring?.interval,
    };
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

export async function cancelSubscription(
  subscriptionId: string,
  immediately = false
) {
  const stripe = getStripe();

  if (immediately) {
    return stripe.subscriptions.cancel(subscriptionId);
  }

  // Cancel at period end
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

export async function reactivateSubscription(subscriptionId: string) {
  const stripe = getStripe();

  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

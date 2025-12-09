import { getStripe } from './client';

interface PortalSessionResult {
  url: string;
}

export async function createPortalSession(
  customerId: string,
  returnUrl?: string
): Promise<PortalSessionResult> {
  if (!customerId) {
    throw new Error('No Stripe customer ID');
  }

  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl ? `${appUrl}${returnUrl}` : `${appUrl}/dashboard/billing`,
  });

  return {
    url: session.url,
  };
}

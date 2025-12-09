import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the stripe client module
const mockBillingPortalSessionCreate = vi.fn();

vi.mock('@/lib/stripe/client', () => ({
  getStripe: () => ({
    billingPortal: {
      sessions: {
        create: mockBillingPortalSessionCreate,
      },
    },
    subscriptions: {
      retrieve: vi.fn(() => Promise.resolve({
        id: 'sub_123',
        status: 'active',
        current_period_end: Math.floor(Date.now() / 1000) + 86400 * 30,
        current_period_start: Math.floor(Date.now() / 1000),
        cancel_at_period_end: false,
        items: {
          data: [
            {
              price: {
                id: 'price_professional_monthly',
                unit_amount: 29700,
                recurring: { interval: 'month' },
              },
            },
          ],
        },
      })),
    },
  }),
}));

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve({
    auth: {
      getUser: vi.fn(() => Promise.resolve({
        data: { user: { id: 'user-123' } },
        error: null,
      })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: {
              stripe_customer_id: 'cus_123',
              stripe_subscription_id: 'sub_123',
              plan: 'outreach',
              subscription_status: 'active',
            },
            error: null,
          })),
        })),
      })),
    })),
  })),
}));

describe('Stripe Customer Portal API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/stripe/portal', () => {
    it('should create a portal session for authenticated user', async () => {
      mockBillingPortalSessionCreate.mockResolvedValue({
        id: 'bps_123',
        url: 'https://billing.stripe.com/session/bps_123',
      });

      const { createPortalSession } = await import('@/lib/stripe/portal');

      const result = await createPortalSession('cus_123');

      expect(result.url).toBe('https://billing.stripe.com/session/bps_123');
      expect(mockBillingPortalSessionCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          customer: 'cus_123',
          return_url: expect.stringContaining('/dashboard'),
        })
      );
    });

    it('should throw error if user has no Stripe customer ID', async () => {
      const { createPortalSession } = await import('@/lib/stripe/portal');

      await expect(createPortalSession('')).rejects.toThrow(
        'No Stripe customer ID'
      );
    });

    it('should include return URL to billing page', async () => {
      mockBillingPortalSessionCreate.mockResolvedValue({
        id: 'bps_123',
        url: 'https://billing.stripe.com/session/bps_123',
      });

      const { createPortalSession } = await import('@/lib/stripe/portal');

      await createPortalSession('cus_123', '/dashboard/billing');

      expect(mockBillingPortalSessionCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          return_url: expect.stringContaining('/dashboard/billing'),
        })
      );
    });
  });
});

describe('Subscription Status', () => {
  it('should fetch current subscription status', async () => {
    const { getSubscriptionStatus } = await import('@/lib/stripe/subscription');

    const status = await getSubscriptionStatus('user-123');

    expect(status).toHaveProperty('plan');
    expect(status).toHaveProperty('status');
    expect(status.plan).toBe('outreach');
    expect(status.status).toBe('active');
  });
});

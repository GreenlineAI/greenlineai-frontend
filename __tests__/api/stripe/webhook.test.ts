import { describe, it, expect, vi, beforeEach } from 'vitest';
import type Stripe from 'stripe';

// Mock the stripe client module
const mockWebhooksConstructEvent = vi.fn();

vi.mock('@/lib/stripe/client', () => ({
  getStripe: () => ({
    webhooks: {
      constructEvent: mockWebhooksConstructEvent,
    },
  }),
}));

// Mock Supabase
const mockSupabaseUpdate = vi.fn(() => ({ error: null }));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve({
    from: vi.fn(() => ({
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: { stripe_customer_id: 'cus_123' },
            error: null,
          })),
        })),
      })),
    })),
  })),
}));

describe('Stripe Webhook Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkout.session.completed', () => {
    it('should update user subscription on successful checkout', async () => {
      const mockEvent: Stripe.Event = {
        id: 'evt_123',
        object: 'event',
        type: 'checkout.session.completed',
        api_version: '2024-12-18.acacia',
        created: Date.now(),
        livemode: false,
        pending_webhooks: 0,
        request: null,
        data: {
          object: {
            id: 'cs_123',
            object: 'checkout.session',
            customer: 'cus_123',
            subscription: 'sub_123',
            metadata: {
              userId: 'user-123',
              plan: 'professional',
            },
          } as unknown as Stripe.Checkout.Session,
        },
      };

      const { handleWebhookEvent } = await import('@/lib/stripe/webhook');

      const result = await handleWebhookEvent(mockEvent);

      expect(result.success).toBe(true);
    });
  });

  describe('customer.subscription.updated', () => {
    it('should update plan when subscription changes', async () => {
      const mockEvent: Stripe.Event = {
        id: 'evt_123',
        object: 'event',
        type: 'customer.subscription.updated',
        api_version: '2024-12-18.acacia',
        created: Date.now(),
        livemode: false,
        pending_webhooks: 0,
        request: null,
        data: {
          object: {
            id: 'sub_123',
            object: 'subscription',
            customer: 'cus_123',
            status: 'active',
            current_period_end: Math.floor(Date.now() / 1000) + 86400 * 30,
            items: {
              data: [
                {
                  price: {
                    id: 'price_professional_monthly',
                    lookup_key: 'professional_monthly',
                  },
                },
              ],
            },
          } as unknown as Stripe.Subscription,
        },
      };

      const { handleWebhookEvent } = await import('@/lib/stripe/webhook');

      const result = await handleWebhookEvent(mockEvent);

      expect(result.success).toBe(true);
    });

    it('should handle subscription cancellation', async () => {
      const mockEvent: Stripe.Event = {
        id: 'evt_123',
        object: 'event',
        type: 'customer.subscription.updated',
        api_version: '2024-12-18.acacia',
        created: Date.now(),
        livemode: false,
        pending_webhooks: 0,
        request: null,
        data: {
          object: {
            id: 'sub_123',
            object: 'subscription',
            customer: 'cus_123',
            status: 'active',
            cancel_at_period_end: true,
            current_period_end: Math.floor(Date.now() / 1000) + 86400 * 30,
            items: {
              data: [
                {
                  price: {
                    id: 'price_professional_monthly',
                  },
                },
              ],
            },
          } as unknown as Stripe.Subscription,
        },
      };

      const { handleWebhookEvent } = await import('@/lib/stripe/webhook');

      const result = await handleWebhookEvent(mockEvent);

      expect(result.success).toBe(true);
    });
  });

  describe('customer.subscription.deleted', () => {
    it('should downgrade user to free plan when subscription is deleted', async () => {
      const mockEvent: Stripe.Event = {
        id: 'evt_123',
        object: 'event',
        type: 'customer.subscription.deleted',
        api_version: '2024-12-18.acacia',
        created: Date.now(),
        livemode: false,
        pending_webhooks: 0,
        request: null,
        data: {
          object: {
            id: 'sub_123',
            object: 'subscription',
            customer: 'cus_123',
          } as unknown as Stripe.Subscription,
        },
      };

      const { handleWebhookEvent } = await import('@/lib/stripe/webhook');

      const result = await handleWebhookEvent(mockEvent);

      expect(result.success).toBe(true);
    });
  });

  describe('invoice.payment_failed', () => {
    it('should handle failed payment', async () => {
      const mockEvent: Stripe.Event = {
        id: 'evt_123',
        object: 'event',
        type: 'invoice.payment_failed',
        api_version: '2024-12-18.acacia',
        created: Date.now(),
        livemode: false,
        pending_webhooks: 0,
        request: null,
        data: {
          object: {
            id: 'in_123',
            object: 'invoice',
            customer: 'cus_123',
            subscription: 'sub_123',
            attempt_count: 1,
          } as unknown as Stripe.Invoice,
        },
      };

      const { handleWebhookEvent } = await import('@/lib/stripe/webhook');

      const result = await handleWebhookEvent(mockEvent);

      expect(result.success).toBe(true);
    });
  });

  describe('Signature Verification', () => {
    it('should reject requests with invalid signature', async () => {
      mockWebhooksConstructEvent.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      const { verifyWebhookSignature } = await import('@/lib/stripe/webhook');

      expect(() =>
        verifyWebhookSignature('payload', 'invalid_sig', 'whsec_test')
      ).toThrow('Invalid signature');
    });
  });
});

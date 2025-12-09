import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the stripe client module
const mockCheckoutSessionCreate = vi.fn();
const mockCustomerCreate = vi.fn();
const mockCustomerList = vi.fn();

vi.mock('@/lib/stripe/client', () => ({
  getStripe: () => ({
    checkout: {
      sessions: {
        create: mockCheckoutSessionCreate,
      },
    },
    customers: {
      create: mockCustomerCreate,
      list: mockCustomerList,
    },
  }),
}));

describe('Stripe Checkout API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset module cache to get fresh imports
    vi.resetModules();
  });

  describe('POST /api/stripe/checkout', () => {
    it('should create a checkout session for a valid plan', async () => {
      mockCustomerList.mockResolvedValue({ data: [] });
      mockCustomerCreate.mockResolvedValue({ id: 'cus_123' });
      mockCheckoutSessionCreate.mockResolvedValue({
        id: 'cs_123',
        url: 'https://checkout.stripe.com/cs_123',
      });

      const { createCheckoutSession } = await import('@/lib/stripe/checkout');

      const result = await createCheckoutSession({
        userId: 'user-123',
        email: 'test@example.com',
        priceId: 'price_starter_monthly',
      });

      expect(result.url).toBe('https://checkout.stripe.com/cs_123');
      expect(mockCheckoutSessionCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'subscription',
          line_items: [{ price: 'price_starter_monthly', quantity: 1 }],
        })
      );
    });

    it('should reuse existing Stripe customer if available', async () => {
      mockCheckoutSessionCreate.mockResolvedValue({
        id: 'cs_123',
        url: 'https://checkout.stripe.com/cs_123',
      });

      const { createCheckoutSession } = await import('@/lib/stripe/checkout');

      await createCheckoutSession({
        userId: 'user-123',
        email: 'test@example.com',
        priceId: 'price_starter_monthly',
        customerId: 'cus_existing',
      });

      expect(mockCustomerCreate).not.toHaveBeenCalled();
      expect(mockCheckoutSessionCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          customer: 'cus_existing',
        })
      );
    });

    it('should include trial period for new subscriptions', async () => {
      mockCustomerList.mockResolvedValue({ data: [] });
      mockCustomerCreate.mockResolvedValue({ id: 'cus_123' });
      mockCheckoutSessionCreate.mockResolvedValue({
        id: 'cs_123',
        url: 'https://checkout.stripe.com/cs_123',
      });

      const { createCheckoutSession } = await import('@/lib/stripe/checkout');

      await createCheckoutSession({
        userId: 'user-123',
        email: 'test@example.com',
        priceId: 'price_starter_monthly',
        trialDays: 14,
      });

      expect(mockCheckoutSessionCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          subscription_data: expect.objectContaining({
            trial_period_days: 14,
          }),
        })
      );
    });

    it('should throw error for invalid price ID', async () => {
      const { createCheckoutSession } = await import('@/lib/stripe/checkout');

      await expect(
        createCheckoutSession({
          userId: 'user-123',
          email: 'test@example.com',
          priceId: 'invalid_price',
        })
      ).rejects.toThrow('Invalid price ID');
    });

    it('should return error when user is not authenticated', async () => {
      const { createCheckoutSession } = await import('@/lib/stripe/checkout');

      await expect(
        createCheckoutSession({
          userId: '',
          email: '',
          priceId: 'price_starter_monthly',
        })
      ).rejects.toThrow('User ID and email are required');
    });
  });
});

describe('Stripe Price Configuration', () => {
  it('should have correct price IDs for all plans', async () => {
    const { STRIPE_PRICES } = await import('@/lib/stripe/config');

    expect(STRIPE_PRICES).toHaveProperty('starter');
    expect(STRIPE_PRICES).toHaveProperty('professional');
    expect(STRIPE_PRICES).toHaveProperty('business');

    expect(STRIPE_PRICES.starter).toHaveProperty('monthly');
    expect(STRIPE_PRICES.starter).toHaveProperty('annual');
  });

  it('should map plan names to database values', async () => {
    const { PLAN_TO_DB_VALUE } = await import('@/lib/stripe/config');

    expect(PLAN_TO_DB_VALUE.starter).toBe('leads');
    expect(PLAN_TO_DB_VALUE.professional).toBe('outreach');
    expect(PLAN_TO_DB_VALUE.business).toBe('whitelabel');
  });
});

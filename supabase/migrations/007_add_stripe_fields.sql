-- Add Stripe fields to profiles table for subscription management

-- Add Stripe customer ID
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);

-- Add Stripe subscription ID
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255);

-- Add subscription status
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50);

-- Add subscription period end
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subscription_period_end TIMESTAMPTZ;

-- Add payment failed timestamp
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS payment_failed_at TIMESTAMPTZ;

-- Create indexes for Stripe lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id
ON profiles(stripe_customer_id)
WHERE stripe_customer_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_subscription_id
ON profiles(stripe_subscription_id)
WHERE stripe_subscription_id IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN profiles.stripe_customer_id IS 'Stripe customer ID for billing';
COMMENT ON COLUMN profiles.stripe_subscription_id IS 'Active Stripe subscription ID';
COMMENT ON COLUMN profiles.subscription_status IS 'Current subscription status: active, trialing, past_due, canceled, canceling';
COMMENT ON COLUMN profiles.subscription_period_end IS 'When the current billing period ends';
COMMENT ON COLUMN profiles.payment_failed_at IS 'Timestamp of last failed payment';

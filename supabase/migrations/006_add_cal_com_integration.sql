-- Migration: Add Cal.com integration fields to business_onboarding
-- Purpose: Enable real calendar availability checking and booking via Cal.com API

-- Add Cal.com integration columns to business_onboarding table
ALTER TABLE business_onboarding
ADD COLUMN IF NOT EXISTS cal_com_api_key_encrypted TEXT,
ADD COLUMN IF NOT EXISTS cal_com_event_type_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS cal_com_validated BOOLEAN DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN business_onboarding.cal_com_api_key_encrypted IS 'AES-256 encrypted Cal.com API key for calendar integration';
COMMENT ON COLUMN business_onboarding.cal_com_event_type_id IS 'Cal.com event type ID to use for booking appointments';
COMMENT ON COLUMN business_onboarding.cal_com_validated IS 'Whether the Cal.com API key has been validated';

-- Create index for faster lookups when checking if business has calendar integration
CREATE INDEX IF NOT EXISTS idx_business_onboarding_cal_com_validated
ON business_onboarding(cal_com_validated)
WHERE cal_com_validated = TRUE;

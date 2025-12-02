-- Rollback Migration: Remove Calls Table and Calendly Integration
-- Date: 2025-12-02
-- Description: Rolls back migration 004_add_calls_and_calendly.sql

-- Drop RLS policies for calls
DROP POLICY IF EXISTS "Users can view own calls" ON calls;
DROP POLICY IF EXISTS "Users can insert own calls" ON calls;
DROP POLICY IF EXISTS "Users can update own calls" ON calls;
DROP POLICY IF EXISTS "Users can delete own calls" ON calls;

-- Drop triggers
DROP TRIGGER IF EXISTS update_calls_updated_at ON calls;

-- Drop indexes for calls
DROP INDEX IF EXISTS idx_calls_user_id;
DROP INDEX IF EXISTS idx_calls_lead_id;
DROP INDEX IF EXISTS idx_calls_status;
DROP INDEX IF EXISTS idx_calls_phone_number;
DROP INDEX IF EXISTS idx_calls_vapi_call_id;
DROP INDEX IF EXISTS idx_calls_created_at;

-- Drop calls table
DROP TABLE IF EXISTS calls;

-- Remove Calendly fields from meetings table
ALTER TABLE meetings 
  DROP COLUMN IF EXISTS calendly_event_uri,
  DROP COLUMN IF EXISTS calendly_invitee_uri;

-- Migration: Add Calls Table and Calendly Integration
-- Date: 2025-12-02
-- Description: Adds dedicated calls table for Stammer AI integration and Calendly fields to meetings

-- Create calls table for voice call tracking
CREATE TABLE IF NOT EXISTS calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  phone_number TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'no_answer', 'voicemail')),
  disposition TEXT, -- answered, no_answer, voicemail, busy, failed, etc
  duration INTEGER, -- in seconds
  transcript TEXT,
  recording_url TEXT,
  vapi_call_id TEXT, -- External ID from Stammer/Vapi
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add Calendly integration fields to meetings table
ALTER TABLE meetings 
  ADD COLUMN IF NOT EXISTS calendly_event_uri TEXT,
  ADD COLUMN IF NOT EXISTS calendly_invitee_uri TEXT;

-- Create indexes for calls table
CREATE INDEX IF NOT EXISTS idx_calls_user_id ON calls(user_id);
CREATE INDEX IF NOT EXISTS idx_calls_lead_id ON calls(lead_id);
CREATE INDEX IF NOT EXISTS idx_calls_status ON calls(status);
CREATE INDEX IF NOT EXISTS idx_calls_phone_number ON calls(phone_number);
CREATE INDEX IF NOT EXISTS idx_calls_vapi_call_id ON calls(vapi_call_id);
CREATE INDEX IF NOT EXISTS idx_calls_created_at ON calls(created_at);

-- Enable Row Level Security for calls
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

-- RLS Policies for calls table
CREATE POLICY "Users can view own calls"
  ON calls FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calls"
  ON calls FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calls"
  ON calls FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own calls"
  ON calls FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at on calls
DROP TRIGGER IF EXISTS update_calls_updated_at ON calls;
CREATE TRIGGER update_calls_updated_at
  BEFORE UPDATE ON calls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Add comment for documentation
COMMENT ON TABLE calls IS 'Tracks individual voice calls made through Stammer AI or other voice providers';
COMMENT ON COLUMN calls.vapi_call_id IS 'External call ID from voice AI provider (Stammer, Vapi, etc)';
COMMENT ON COLUMN calls.disposition IS 'Final outcome of the call (answered, no_answer, voicemail, etc)';
COMMENT ON COLUMN meetings.calendly_event_uri IS 'Calendly event URI for webhook correlation';
COMMENT ON COLUMN meetings.calendly_invitee_uri IS 'Calendly invitee URI for tracking bookings';

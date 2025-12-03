-- Business Onboarding table for AI Voice Agent setup
-- Stores information needed to configure Retell AI for each business

CREATE TYPE onboarding_status AS ENUM (
  'pending',
  'in_review',
  'agent_created',
  'active',
  'paused'
);

CREATE TYPE phone_setup_preference AS ENUM (
  'new',      -- Get a new local number from us
  'forward',  -- Keep existing number, forward to our number
  'port'      -- Port existing number to us
);

CREATE TYPE business_type AS ENUM (
  'landscaping',
  'lawn_care',
  'tree_service',
  'hardscaping',
  'irrigation',
  'snow_removal',
  'general_contractor',
  'hvac',
  'plumbing',
  'electrical',
  'roofing',
  'painting',
  'cleaning',
  'pest_control',
  'pool_service',
  'other'
);

CREATE TABLE business_onboarding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  -- Business Information
  business_name TEXT NOT NULL,
  business_type business_type NOT NULL,
  business_type_other TEXT, -- If 'other' is selected
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,

  -- Service Area
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT,
  service_radius_miles INTEGER DEFAULT 25,

  -- Services Offered (for AI script)
  services TEXT[] NOT NULL, -- Array of services like ['lawn mowing', 'leaf cleanup', 'mulching']

  -- Business Hours (for appointment booking)
  hours_monday TEXT,
  hours_tuesday TEXT,
  hours_wednesday TEXT,
  hours_thursday TEXT,
  hours_friday TEXT,
  hours_saturday TEXT,
  hours_sunday TEXT,

  -- AI Agent Configuration
  greeting_name TEXT, -- How should AI greet? "Mike's Landscaping" or "Green Valley Services"
  preferred_voice TEXT DEFAULT 'professional_male', -- Voice preference for Retell

  -- Appointment Settings
  appointment_duration INTEGER DEFAULT 30, -- Default appointment length in minutes
  calendar_link TEXT, -- Google Calendar, Calendly, etc.

  -- Additional Info for AI
  pricing_info TEXT, -- General pricing info AI can reference
  special_instructions TEXT, -- Any special handling instructions

  -- Phone Setup Preference
  phone_preference phone_setup_preference DEFAULT 'new',
  existing_phone_number TEXT, -- If forwarding or porting
  current_phone_provider TEXT, -- If porting, who's the current provider

  -- Retell AI Integration
  retell_agent_id TEXT, -- Once agent is created, store the ID
  retell_phone_number TEXT, -- Assigned phone number

  -- Status tracking
  status onboarding_status DEFAULT 'pending',
  notes TEXT, -- Admin notes

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_business_onboarding_user_id ON business_onboarding(user_id);
CREATE INDEX idx_business_onboarding_status ON business_onboarding(status);
CREATE INDEX idx_business_onboarding_email ON business_onboarding(email);

-- Enable RLS
ALTER TABLE business_onboarding ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own onboarding"
  ON business_onboarding FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can insert onboarding"
  ON business_onboarding FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own onboarding"
  ON business_onboarding FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_business_onboarding_updated_at
  BEFORE UPDATE ON business_onboarding
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

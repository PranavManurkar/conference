-- Create registrations table with all fields from the brochure
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Personal Information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  institution_organization TEXT NOT NULL,
  designation TEXT,
  country TEXT NOT NULL,
  
  -- Delegate Information
  delegate_type TEXT NOT NULL CHECK (delegate_type IN ('UG/PG Student', 'Research Scholar', 'Faculty', 'Industry')),
  registration_period TEXT NOT NULL CHECK (registration_period IN ('Early Bird', 'Final')),
  participant_region TEXT NOT NULL CHECK (participant_region IN ('Indian', 'SAARC', 'Non-SAARC')),
  
  -- Payment Information
  payment_amount DECIMAL(10,2) NOT NULL,
  payment_reference_number TEXT,
  payment_date DATE,
  payment_screenshot_url TEXT,
  
  -- Abstract Submission (Optional)
  abstract_title TEXT,
  abstract_file_url TEXT,
  presentation_preference TEXT CHECK (presentation_preference IN ('Oral', 'Poster', 'No Preference')),
  
  -- Status Management
  status TEXT NOT NULL DEFAULT 'Under Process' CHECK (status IN ('Under Process', 'Accepted', 'Rejected')),
  admin_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own registrations
CREATE POLICY "Users can view own registrations"
  ON public.registrations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own registrations
CREATE POLICY "Users can insert own registrations"
  ON public.registrations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own registrations (only if status is 'Under Process')
CREATE POLICY "Users can update own pending registrations"
  ON public.registrations
  FOR UPDATE
  USING (auth.uid() = user_id AND status = 'Under Process');

-- Create index for faster queries
CREATE INDEX idx_registrations_user_id ON public.registrations(user_id);
CREATE INDEX idx_registrations_status ON public.registrations(status);
CREATE INDEX idx_registrations_created_at ON public.registrations(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_registrations_updated_at BEFORE UPDATE
    ON public.registrations FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

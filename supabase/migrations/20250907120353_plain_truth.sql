/*
  # User Profiles and NGO Verification System

  1. New Tables
    - `user_profiles` - Extended user profile information
    - `ngo_applications` - NGO verification applications with document uploads
    - `ngo_postings` - Job/volunteer postings by verified NGOs
    - `applications` - Volunteer applications to NGO postings
    - `user_locations` - Geocoded location data for users

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
    - Secure file upload policies

  3. Storage
    - Create bucket for NGO verification documents
*/

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type text NOT NULL CHECK (user_type IN ('volunteer', 'ngo', 'admin')),
  name text NOT NULL,
  phone text,
  bio text,
  skills text[],
  interests text[],
  location text,
  coordinates point, -- PostGIS point for lat/lng
  availability text,
  experience text,
  languages text[],
  education text,
  verified boolean DEFAULT false,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- NGO applications table for verification process
CREATE TABLE IF NOT EXISTS ngo_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_name text NOT NULL,
  description text NOT NULL,
  contact_person text NOT NULL,
  website text,
  registration_number text,
  focus_areas text[],
  documents jsonb, -- Array of document URLs from Supabase Storage
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes text,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- NGO postings table (only for verified NGOs)
CREATE TABLE IF NOT EXISTS ngo_postings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ngo_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  skills_required text[],
  location text NOT NULL,
  coordinates point, -- PostGIS point for lat/lng
  time_commitment text,
  duration text,
  benefits text[],
  requirements text,
  application_deadline timestamptz,
  max_volunteers integer,
  current_volunteers integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed', 'draft')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Applications table for volunteer applications to postings
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  posting_id uuid REFERENCES ngo_postings(id) ON DELETE CASCADE,
  volunteer_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  cover_letter text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  applied_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  ngo_notes text,
  UNIQUE(posting_id, volunteer_user_id)
);

-- User locations table for geocoding cache
CREATE TABLE IF NOT EXISTS user_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  address text NOT NULL,
  coordinates point NOT NULL,
  city text,
  state text,
  country text DEFAULT 'India',
  geocoded_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable PostGIS extension for geographic queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_type ON user_profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_verified ON user_profiles(verified);
CREATE INDEX IF NOT EXISTS idx_user_profiles_location ON user_profiles USING GIST(coordinates);

CREATE INDEX IF NOT EXISTS idx_ngo_applications_user_id ON ngo_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_ngo_applications_status ON ngo_applications(status);

CREATE INDEX IF NOT EXISTS idx_ngo_postings_ngo_user_id ON ngo_postings(ngo_user_id);
CREATE INDEX IF NOT EXISTS idx_ngo_postings_status ON ngo_postings(status);
CREATE INDEX IF NOT EXISTS idx_ngo_postings_location ON ngo_postings USING GIST(coordinates);
CREATE INDEX IF NOT EXISTS idx_ngo_postings_deadline ON ngo_postings(application_deadline);

CREATE INDEX IF NOT EXISTS idx_applications_posting_id ON applications(posting_id);
CREATE INDEX IF NOT EXISTS idx_applications_volunteer_id ON applications(volunteer_user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

CREATE INDEX IF NOT EXISTS idx_user_locations_user_id ON user_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_coordinates ON user_locations USING GIST(coordinates);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can read verified profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (verified = true);

-- RLS Policies for ngo_applications
CREATE POLICY "NGOs can manage own applications"
  ON ngo_applications
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all applications"
  ON ngo_applications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND user_type = 'admin'
    )
  );

CREATE POLICY "Admins can update applications"
  ON ngo_applications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND user_type = 'admin'
    )
  );

-- RLS Policies for ngo_postings
CREATE POLICY "NGOs can manage own postings"
  ON ngo_postings
  FOR ALL
  TO authenticated
  USING (auth.uid() = ngo_user_id);

CREATE POLICY "Public can read active postings"
  ON ngo_postings
  FOR SELECT
  TO authenticated
  USING (status = 'active');

-- RLS Policies for applications
CREATE POLICY "Volunteers can manage own applications"
  ON applications
  FOR ALL
  TO authenticated
  USING (auth.uid() = volunteer_user_id);

CREATE POLICY "NGOs can read applications to their postings"
  ON applications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ngo_postings 
      WHERE id = posting_id AND ngo_user_id = auth.uid()
    )
  );

CREATE POLICY "NGOs can update applications to their postings"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ngo_postings 
      WHERE id = posting_id AND ngo_user_id = auth.uid()
    )
  );

-- RLS Policies for user_locations
CREATE POLICY "Users can manage own location"
  ON user_locations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create storage bucket for NGO documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('ngo-documents', 'ngo-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for NGO documents
CREATE POLICY "NGOs can upload verification documents"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'ngo-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "NGOs can read own documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'ngo-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can read all NGO documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'ngo-documents' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND user_type = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ngo_applications_updated_at
  BEFORE UPDATE ON ngo_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ngo_postings_updated_at
  BEFORE UPDATE ON ngo_postings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
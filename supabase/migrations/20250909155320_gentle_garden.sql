/*
  # Add NGO-specific fields to user_profiles table

  1. New Columns
    - `organization_name` (text, nullable) - For NGO organization name
    - `description` (text, nullable) - For NGO description/mission
    - `contact_person` (text, nullable) - For NGO contact person
    - `website` (text, nullable) - For NGO website URL
    - `registration_number` (text, nullable) - For NGO government registration number
    - `focus_areas` (text[], nullable) - For NGO focus areas

  2. Notes
    - All columns are nullable to accommodate volunteer profiles
    - These fields are only used when user_type = 'ngo'
*/

-- Add NGO-specific columns to user_profiles table
DO $$
BEGIN
  -- Add organization_name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'organization_name'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN organization_name text;
  END IF;

  -- Add description column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'description'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN description text;
  END IF;

  -- Add contact_person column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'contact_person'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN contact_person text;
  END IF;

  -- Add website column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'website'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN website text;
  END IF;

  -- Add registration_number column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'registration_number'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN registration_number text;
  END IF;

  -- Add focus_areas column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'focus_areas'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN focus_areas text[];
  END IF;
END $$;
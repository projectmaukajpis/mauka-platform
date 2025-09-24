/*
  # Fix NGO Postings Relationship

  1. Schema Updates
    - Ensure ngo_postings has proper foreign key to user_profiles
    - Add missing indexes for performance
    - Update RLS policies if needed

  2. Relationship Fix
    - The ngo_postings.ngo_user_id should reference users.id (auth table)
    - user_profiles.user_id also references users.id
    - This creates the relationship path: ngo_postings -> users <- user_profiles
*/

-- Ensure the foreign key relationship exists
DO $$
BEGIN
  -- Check if the foreign key already exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'ngo_postings_ngo_user_id_fkey' 
    AND table_name = 'ngo_postings'
  ) THEN
    -- Add the foreign key if it doesn't exist
    ALTER TABLE ngo_postings 
    ADD CONSTRAINT ngo_postings_ngo_user_id_fkey 
    FOREIGN KEY (ngo_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Ensure user_profiles foreign key exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_profiles_user_id_fkey' 
    AND table_name = 'user_profiles'
  ) THEN
    ALTER TABLE user_profiles 
    ADD CONSTRAINT user_profiles_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ngo_postings_ngo_user_id ON ngo_postings(ngo_user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
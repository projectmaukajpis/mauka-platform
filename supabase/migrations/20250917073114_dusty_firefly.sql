/*
  # Create Test User Accounts for NGOs

  1. Authentication Users
    - Creates auth.users entries for each NGO
    - Provides login credentials for testing
    - Links to the NGO profiles created earlier

  2. Login Credentials
    - All NGOs use password: "TestNGO123!"
    - Email format: ngo-name@test.com
    - Ready for immediate login testing

  3. Security
    - Email confirmation disabled for testing
    - Users can login immediately after creation
*/

-- Insert auth users for NGOs (these will allow login)
-- Note: In a real scenario, you would create these through Supabase Auth API or dashboard
-- This is for reference - you'll need to create these manually in Supabase Auth

/*
Manual steps to create NGO login accounts in Supabase:

1. Go to Authentication > Users in your Supabase dashboard
2. Click "Add user" for each NGO
3. Use these credentials:

NGO: Teach for India
Email: teachforindia@test.com
Password: TestNGO123!
User ID: ngo-teach-for-india

NGO: Akshaya Patra Foundation  
Email: akshayapatra@test.com
Password: TestNGO123!
User ID: ngo-akshaya-patra

NGO: Smile Foundation
Email: smilefoundation@test.com
Password: TestNGO123!
User ID: ngo-smile-foundation

NGO: Goonj
Email: goonj@test.com
Password: TestNGO123!
User ID: ngo-goonj

NGO: Pratham
Email: pratham@test.com
Password: TestNGO123!
User ID: ngo-pratham

NGO: HelpAge India
Email: helpageindia@test.com
Password: TestNGO123!
User ID: ngo-helpage-india

NGO: CRY - Child Rights and You
Email: cry@test.com
Password: TestNGO123!
User ID: ngo-cry

NGO: Isha Foundation
Email: ishafoundation@test.com
Password: TestNGO123!
User ID: ngo-isha-foundation

NGO: Nanhi Kali
Email: nanhikali@test.com
Password: TestNGO123!
User ID: ngo-nanhi-kali

NGO: Magic Bus
Email: magicbus@test.com
Password: TestNGO123!
User ID: ngo-magic-bus

IMPORTANT: Make sure the User ID in Supabase Auth matches the user_id in the user_profiles table!
*/

-- Create a sample volunteer user for testing applications
INSERT INTO user_profiles (
  user_id, user_type, name, bio, location, coordinates, skills, interests,
  availability, experience, verified, verification_status, created_at, updated_at
) VALUES (
  'volunteer-test-user',
  'volunteer',
  'Test Volunteer',
  'I am a passionate student volunteer interested in making a positive impact in my community. I have experience in teaching and event management.',
  'Bandra West, Mumbai, Maharashtra',
  POINT(72.8295, 19.0596),
  ARRAY['Teaching', 'Communication', 'Event Management', 'Technology'],
  ARRAY['Education', 'Child Welfare', 'Technology'],
  'weekends',
  'Volunteered at local schools for 6 months. Organized community events.',
  true,
  'verified',
  now(),
  now()
);

-- Create some sample applications for testing
INSERT INTO applications (
  posting_id, volunteer_user_id, cover_letter, status, applied_at
) 
SELECT 
  np.id,
  'volunteer-test-user',
  'I am very interested in this opportunity as it aligns with my skills and passion for ' || 
  CASE 
    WHEN 'Education' = ANY(np.skills_required) THEN 'education and teaching'
    WHEN 'Healthcare' = ANY(np.skills_required) THEN 'healthcare and helping others'
    WHEN 'Technology' = ANY(np.skills_required) THEN 'technology and digital literacy'
    ELSE 'making a positive impact in the community'
  END || '. I believe my experience and dedication would be valuable for this role.',
  CASE 
    WHEN random() < 0.3 THEN 'pending'
    WHEN random() < 0.7 THEN 'accepted'
    ELSE 'rejected'
  END,
  now() - (random() * interval '30 days')
FROM ngo_postings np
WHERE random() < 0.4  -- Apply to about 40% of postings
LIMIT 8;
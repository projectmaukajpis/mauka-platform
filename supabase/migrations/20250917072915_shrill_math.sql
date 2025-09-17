/*
  # Populate Test NGO Data

  1. Test Data Creation
    - 10 verified NGO profiles with realistic information
    - Covers major Indian cities (Mumbai, Delhi, Bangalore, Chennai, Pune)
    - Diverse focus areas (Education, Healthcare, Environment, etc.)
    - Complete with contact details and descriptions

  2. Geographic Distribution
    - NGOs spread across different cities for location-based testing
    - Coordinates provided for accurate distance calculations
    - Mix of urban and semi-urban locations

  3. Verification Status
    - All NGOs set as verified for immediate testing
    - Ready to create volunteer postings
*/

-- Insert test NGO profiles
INSERT INTO user_profiles (
  user_id, user_type, name, organization_name, description, contact_person, 
  website, focus_areas, location, coordinates, verified, verification_status,
  created_at, updated_at
) VALUES 
(
  'ngo-teach-for-india',
  'ngo',
  'Teach for India',
  'Teach for India',
  'Teach for India is working to eliminate educational inequity in India by developing a pipeline of leaders who work to expand educational opportunity, in classrooms, schools, and across the system.',
  'Rajesh Kumar',
  'https://teachforindia.org',
  ARRAY['Education', 'Leadership Development', 'Teacher Training'],
  'Andheri West, Mumbai, Maharashtra',
  POINT(72.8697, 19.1136),
  true,
  'verified',
  now(),
  now()
),
(
  'ngo-akshaya-patra',
  'ngo',
  'Akshaya Patra Foundation',
  'The Akshaya Patra Foundation',
  'Akshaya Patra serves nutritious school meals to children across India, supporting their education and nutrition needs.',
  'Priya Sharma',
  'https://akshayapatra.org',
  ARRAY['Education', 'Nutrition', 'Child Welfare'],
  'Whitefield, Bangalore, Karnataka',
  POINT(77.7500, 12.9698),
  true,
  'verified',
  now(),
  now()
),
(
  'ngo-smile-foundation',
  'ngo',
  'Smile Foundation',
  'Smile Foundation',
  'Smile Foundation works with underprivileged children and youth to provide them with education, healthcare, and livelihood opportunities.',
  'Amit Verma',
  'https://smilefoundationindia.org',
  ARRAY['Education', 'Healthcare', 'Youth Development'],
  'Lajpat Nagar, New Delhi',
  POINT(77.2410, 28.5665),
  true,
  'verified',
  now(),
  now()
),
(
  'ngo-goonj',
  'ngo',
  'Goonj',
  'Goonj',
  'Goonj works on disaster relief, humanitarian aid, and community development using urban waste as a tool for rural development.',
  'Meera Gupta',
  'https://goonj.org',
  ARRAY['Disaster Relief', 'Community Development', 'Rural Development'],
  'Vasant Kunj, New Delhi',
  POINT(77.1025, 28.5200),
  true,
  'verified',
  now(),
  now()
),
(
  'ngo-pratham',
  'ngo',
  'Pratham',
  'Pratham Education Foundation',
  'Pratham focuses on providing quality education to underprivileged children and youth in India through innovative learning methods.',
  'Sunita Patel',
  'https://pratham.org',
  ARRAY['Education', 'Literacy', 'Skill Development'],
  'Bandra East, Mumbai, Maharashtra',
  POINT(72.8405, 19.0596),
  true,
  'verified',
  now(),
  now()
),
(
  'ngo-helpage-india',
  'ngo',
  'HelpAge India',
  'HelpAge India',
  'HelpAge India works for the cause and care of disadvantaged elderly people in India, providing healthcare, emergency care, and advocacy.',
  'Dr. Ravi Krishnan',
  'https://helpageindia.org',
  ARRAY['Elderly Care', 'Healthcare', 'Social Welfare'],
  'T. Nagar, Chennai, Tamil Nadu',
  POINT(80.2340, 13.0389),
  true,
  'verified',
  now(),
  now()
),
(
  'ngo-cry',
  'ngo',
  'CRY - Child Rights and You',
  'Child Rights and You',
  'CRY works to ensure happier childhoods for underprivileged children through education, healthcare, protection from exploitation, and participation.',
  'Kavya Reddy',
  'https://cry.org',
  ARRAY['Child Rights', 'Education', 'Child Protection'],
  'Koramangala, Bangalore, Karnataka',
  POINT(77.6309, 12.9279),
  true,
  'verified',
  now(),
  now()
),
(
  'ngo-isha-foundation',
  'ngo',
  'Isha Foundation',
  'Isha Foundation',
  'Isha Foundation is a non-profit organization founded by Sadhguru, focusing on yoga, meditation, and environmental conservation.',
  'Arjun Singh',
  'https://isha.sadhguru.org',
  ARRAY['Environment', 'Rural Development', 'Health & Wellness'],
  'Velachery, Chennai, Tamil Nadu',
  POINT(80.2206, 12.9756),
  true,
  'verified',
  now(),
  now()
),
(
  'ngo-nanhi-kali',
  'ngo',
  'Nanhi Kali',
  'Nanhi Kali',
  'Nanhi Kali is committed to educating underprivileged girls in India, providing them with academic and material support.',
  'Sneha Agarwal',
  'https://nanhikali.org',
  ARRAY['Girls Education', 'Women Empowerment', 'Child Welfare'],
  'Pune Camp, Pune, Maharashtra',
  POINT(73.8567, 18.5074),
  true,
  'verified',
  now(),
  now()
),
(
  'ngo-magic-bus',
  'ngo',
  'Magic Bus',
  'Magic Bus India Foundation',
  'Magic Bus moves children and young people out of poverty by involving them in their own development, through education and life skills.',
  'Vikash Jain',
  'https://magicbus.org',
  ARRAY['Youth Development', 'Life Skills', 'Education'],
  'Lower Parel, Mumbai, Maharashtra',
  POINT(72.8311, 18.9975),
  true,
  'verified',
  now(),
  now()
);
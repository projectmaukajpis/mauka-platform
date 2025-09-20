/*
  # Sample NGO Postings Data

  1. New Data
    - Sample volunteer postings for various verified NGOs
    - Covers different cities: Mumbai, Delhi, Bangalore, Chennai, Pune
    - Various volunteer opportunities across different focus areas
    - Realistic data with proper coordinates and requirements

  2. Data Structure
    - Uses proper UUID format for ngo_user_id references
    - Includes diverse skills, locations, and time commitments
    - Proper geographic coordinates for location-based matching
    - Realistic volunteer counts and requirements

  3. Coverage
    - 18 sample postings across 8 different NGO types
    - Multiple cities and states for geographic diversity
    - Various volunteer roles from teaching to healthcare to environment
*/

-- First, let's create some sample NGO user profiles if they don't exist
INSERT INTO user_profiles (
  user_id, user_type, name, organization_name, description, location, 
  coordinates, focus_areas, verified, verification_status, created_at, updated_at
) VALUES 
(
  gen_random_uuid(),
  'ngo',
  'Teach for India',
  'Teach for India',
  'Working to eliminate educational inequity by developing a pipeline of leaders who work to expand educational opportunity.',
  'Mumbai, Maharashtra',
  POINT(72.8777, 19.0760),
  ARRAY['Education', 'Teaching', 'Leadership Development'],
  true,
  'verified',
  now(),
  now()
),
(
  gen_random_uuid(),
  'ngo',
  'Akshaya Patra Foundation',
  'Akshaya Patra Foundation',
  'Implementing the Mid Day Meal Scheme in Government schools and Government aided schools.',
  'Bangalore, Karnataka',
  POINT(77.5946, 12.9716),
  ARRAY['Nutrition', 'Education', 'Child Welfare'],
  true,
  'verified',
  now(),
  now()
),
(
  gen_random_uuid(),
  'ngo',
  'Smile Foundation',
  'Smile Foundation',
  'Working towards the welfare of underprivileged children, youth and women through education, healthcare and livelihood programs.',
  'New Delhi',
  POINT(77.2090, 28.6139),
  ARRAY['Education', 'Healthcare', 'Women Empowerment'],
  true,
  'verified',
  now(),
  now()
),
(
  gen_random_uuid(),
  'ngo',
  'Goonj',
  'Goonj',
  'A non-profit organization that works to bridge the gap between the urban and rural divide by using urban surplus material as a tool for rural development.',
  'New Delhi',
  POINT(77.2090, 28.6139),
  ARRAY['Rural Development', 'Disaster Relief', 'Community Development'],
  true,
  'verified',
  now(),
  now()
),
(
  gen_random_uuid(),
  'ngo',
  'Pratham',
  'Pratham',
  'Improving the quality of education for underprivileged children in India through various innovative programs.',
  'Mumbai, Maharashtra',
  POINT(72.8777, 19.0760),
  ARRAY['Education', 'Literacy', 'Child Development'],
  true,
  'verified',
  now(),
  now()
),
(
  gen_random_uuid(),
  'ngo',
  'HelpAge India',
  'HelpAge India',
  'Working for the cause and care of disadvantaged elderly in India through programs on healthcare, emergency care and disaster relief.',
  'Chennai, Tamil Nadu',
  POINT(80.2707, 13.0827),
  ARRAY['Elderly Care', 'Healthcare', 'Emergency Relief'],
  true,
  'verified',
  now(),
  now()
),
(
  gen_random_uuid(),
  'ngo',
  'CRY - Child Rights and You',
  'CRY - Child Rights and You',
  'Ensuring happier childhoods for underprivileged children through education, healthcare, protection from exploitation and participation.',
  'Bangalore, Karnataka',
  POINT(77.5946, 12.9716),
  ARRAY['Child Rights', 'Education', 'Healthcare', 'Child Protection'],
  true,
  'verified',
  now(),
  now()
),
(
  gen_random_uuid(),
  'ngo',
  'Isha Foundation',
  'Isha Foundation',
  'Dedicated to raising human consciousness and fostering global harmony through individual transformation and community revitalization.',
  'Chennai, Tamil Nadu',
  POINT(80.2707, 13.0827),
  ARRAY['Environment', 'Rural Development', 'Spirituality', 'Education'],
  true,
  'verified',
  now(),
  now()
),
(
  gen_random_uuid(),
  'ngo',
  'Nanhi Kali',
  'Nanhi Kali',
  'Supporting the education of underprivileged girls in India by providing them with school essentials and academic support.',
  'Pune, Maharashtra',
  POINT(73.8567, 18.5074),
  ARRAY['Girls Education', 'Women Empowerment', 'Child Development'],
  true,
  'verified',
  now(),
  now()
),
(
  gen_random_uuid(),
  'ngo',
  'Magic Bus',
  'Magic Bus',
  'Moving children and young people from poverty to livelihood by providing them with education, life skills and livelihood training.',
  'Mumbai, Maharashtra',
  POINT(72.8777, 19.0760),
  ARRAY['Youth Development', 'Education', 'Livelihood', 'Life Skills'],
  true,
  'verified',
  now(),
  now()
)
ON CONFLICT (user_id) DO NOTHING;

-- Now insert sample postings using the created NGO profiles
-- We'll use a subquery to get the actual user_ids from the profiles we just created

INSERT INTO ngo_postings (
  ngo_user_id, title, description, skills_required, location, coordinates,
  time_commitment, duration, benefits, requirements, max_volunteers, 
  current_volunteers, status, created_at, updated_at
) 
SELECT 
  up.user_id,
  posting.title,
  posting.description,
  posting.skills_required,
  posting.location,
  posting.coordinates,
  posting.time_commitment,
  posting.duration,
  posting.benefits,
  posting.requirements,
  posting.max_volunteers,
  posting.current_volunteers,
  posting.status,
  posting.created_at,
  posting.updated_at
FROM user_profiles up
CROSS JOIN (
  VALUES 
  -- Teach for India postings
  ('Teach for India', 'Mathematics Teaching Assistant', 'Help teach mathematics to underprivileged children in grades 6-8. Support classroom activities, provide one-on-one tutoring, and assist with homework completion.', ARRAY['Teaching', 'Mathematics', 'Communication', 'Patience'], 'Andheri West, Mumbai, Maharashtra', POINT(72.8697, 19.1136), '6-8 hours/week', '6 months', ARRAY['Certificate of Appreciation', 'Training Provided', 'Skill Development'], 'Basic knowledge of mathematics up to grade 8 level. Good communication skills in Hindi or English.', 8, 3, 'active', now(), now()),
  ('Teach for India', 'English Language Volunteer', 'Conduct English conversation sessions and reading activities for children aged 8-14. Help improve their speaking confidence and vocabulary.', ARRAY['Teaching', 'English', 'Communication', 'Creativity'], 'Malad East, Mumbai, Maharashtra', POINT(72.8544, 19.1868), '4-6 hours/week', '4 months', ARRAY['Certificate of Appreciation', 'Training Provided', 'Flexible Timings'], 'Fluency in English. Experience with children preferred but not mandatory.', 6, 1, 'active', now(), now()),
  ('Teach for India', 'Science Lab Assistant', 'Help set up and conduct science experiments for middle school students. Make science learning fun and interactive.', ARRAY['Science', 'Teaching', 'Laboratory Skills', 'Creativity'], 'Borivali West, Mumbai, Maharashtra', POINT(72.8567, 19.2307), '6-8 hours/week', '5 months', ARRAY['Certificate of Appreciation', 'Science Training', 'Lab Experience'], 'Science background (10+2 minimum). Interest in hands-on teaching. Safety consciousness.', 6, 1, 'active', now(), now()),
  
  -- Akshaya Patra postings
  ('Akshaya Patra Foundation', 'Nutrition Program Coordinator', 'Assist in organizing and distributing nutritious meals to school children. Help with meal preparation, serving, and maintaining hygiene standards.', ARRAY['Event Management', 'Healthcare', 'Communication', 'Leadership'], 'Whitefield, Bangalore, Karnataka', POINT(77.7500, 12.9698), '8-10 hours/week', '3 months', ARRAY['Certificate of Appreciation', 'Meals Provided', 'Transportation Allowance'], 'Basic understanding of nutrition and hygiene. Ability to work with children.', 12, 5, 'active', now(), now()),
  ('Akshaya Patra Foundation', 'Kitchen Volunteer', 'Support kitchen operations for school meal programs. Assist with food preparation, packaging, and quality control under supervision.', ARRAY['Food Safety', 'Teamwork', 'Physical Stamina'], 'Electronic City, Bangalore, Karnataka', POINT(77.6648, 12.8456), '5-7 hours/week', '2 months', ARRAY['Certificate of Appreciation', 'Meals Provided', 'Skill Development'], 'Basic food safety knowledge. Willingness to work in kitchen environment.', 10, 2, 'active', now(), now()),
  ('Akshaya Patra Foundation', 'Nutrition Education Volunteer', 'Educate children and parents about nutrition, healthy eating habits, and food safety through interactive sessions.', ARRAY['Nutrition', 'Teaching', 'Health Education', 'Communication'], 'HSR Layout, Bangalore, Karnataka', POINT(77.6387, 12.9082), '4-6 hours/week', '3 months', ARRAY['Certificate of Appreciation', 'Nutrition Training', 'Health Knowledge'], 'Basic nutrition knowledge. Good communication skills. Interest in public health.', 10, 4, 'active', now(), now()),
  
  -- Smile Foundation postings
  ('Smile Foundation', 'Digital Literacy Trainer', 'Teach basic computer skills and internet usage to underprivileged youth and adults. Conduct workshops on digital safety and online learning.', ARRAY['Technology', 'Teaching', 'Computer Skills', 'Communication'], 'Lajpat Nagar, New Delhi', POINT(77.2410, 28.5665), '6-8 hours/week', '4 months', ARRAY['Certificate of Appreciation', 'Training Provided', 'Networking Opportunities'], 'Basic computer knowledge. Patience to work with beginners. Hindi/English fluency.', 8, 3, 'active', now(), now()),
  ('Smile Foundation', 'Healthcare Camp Assistant', 'Support medical camps by helping with registration, crowd management, and basic health screenings under medical supervision.', ARRAY['Healthcare', 'Communication', 'Event Management', 'First Aid'], 'Karol Bagh, New Delhi', POINT(77.1907, 28.6519), '8-12 hours/month', '6 months', ARRAY['Certificate of Appreciation', 'First Aid Training', 'Medical Knowledge'], 'Basic first aid knowledge preferred. Good communication skills. Comfortable working with patients.', 15, 7, 'active', now(), now()),
  ('Smile Foundation', 'Technology Workshop Instructor', 'Teach basic computer skills, internet usage, and digital literacy to underprivileged youth and adults.', ARRAY['Technology', 'Teaching', 'Computer Skills', 'Digital Literacy'], 'Rohini, New Delhi', POINT(77.1025, 28.7041), '6-8 hours/week', '5 months', ARRAY['Certificate of Appreciation', 'Technology Training', 'Equipment Access'], 'Good computer skills. Teaching experience preferred. Patience with beginners.', 8, 2, 'active', now(), now()),
  ('Smile Foundation', 'Skill Development Trainer', 'Train youth in vocational skills like tailoring, computer repair, mobile repair, and other employable skills.', ARRAY['Skill Development', 'Vocational Training', 'Technical Skills', 'Employment'], 'Janakpuri, New Delhi', POINT(77.0674, 28.6219), '8-12 hours/week', '6 months', ARRAY['Certificate of Appreciation', 'Technical Training', 'Employment Support'], 'Technical skills in any vocational area. Teaching ability. Understanding of employment market.', 8, 2, 'active', now(), now()),
  
  -- Goonj postings
  ('Goonj', 'Disaster Relief Coordinator', 'Help coordinate disaster relief efforts including collection, sorting, and distribution of relief materials to affected communities.', ARRAY['Event Management', 'Leadership', 'Communication', 'Crisis Management'], 'Vasant Kunj, New Delhi', POINT(77.1025, 28.5200), '10-15 hours/week', '3 months', ARRAY['Certificate of Appreciation', 'Leadership Training', 'Travel Opportunities'], 'Strong organizational skills. Ability to work under pressure. Willingness to travel to affected areas.', 6, 2, 'active', now(), now()),
  ('Goonj', 'Community Development Volunteer', 'Work with rural communities on development projects including education, healthcare, and livelihood programs.', ARRAY['Community Development', 'Communication', 'Project Management', 'Rural Experience'], 'Mehrauli, New Delhi', POINT(77.1855, 28.5245), '12-16 hours/week', '6 months', ARRAY['Certificate of Appreciation', 'Rural Exposure', 'Skill Development', 'Travel Allowance'], 'Interest in rural development. Good communication skills. Willingness to stay in rural areas.', 4, 1, 'active', now(), now()),
  ('Goonj', 'Waste Management Volunteer', 'Help with collection, sorting, and processing of urban waste for rural development projects. Promote sustainable practices.', ARRAY['Environment', 'Waste Management', 'Sustainability', 'Physical Work'], 'Dwarka, New Delhi', POINT(77.0469, 28.5921), '6-10 hours/week', '3 months', ARRAY['Certificate of Appreciation', 'Environmental Training', 'Sustainability Knowledge'], 'Interest in environmental issues. Physical ability for sorting work. Basic environmental awareness.', 12, 4, 'active', now(), now()),
  
  -- Pratham postings
  ('Pratham', 'Reading Program Volunteer', 'Conduct reading sessions for children aged 6-14. Help improve literacy levels through interactive storytelling and reading activities.', ARRAY['Teaching', 'Storytelling', 'Communication', 'Creativity'], 'Bandra East, Mumbai, Maharashtra', POINT(72.8405, 19.0596), '4-6 hours/week', '5 months', ARRAY['Certificate of Appreciation', 'Training Provided', 'Flexible Timings'], 'Love for reading and storytelling. Patience with children. Hindi/Marathi/English fluency.', 10, 4, 'active', now(), now()),
  ('Pratham', 'Adult Literacy Instructor', 'Teach basic reading, writing, and numeracy skills to adults in urban slums. Conduct evening classes for working adults.', ARRAY['Teaching', 'Adult Education', 'Communication', 'Patience'], 'Dharavi, Mumbai, Maharashtra', POINT(72.8570, 19.0430), '6-8 hours/week', '8 months', ARRAY['Certificate of Appreciation', 'Training Provided', 'Transportation Allowance'], 'Experience in adult education preferred. Good communication skills. Evening availability.', 5, 2, 'active', now(), now()),
  ('Pratham', 'Community Mobilizer', 'Engage with parents and community members to promote education and encourage school enrollment for children.', ARRAY['Community Outreach', 'Communication', 'Social Work', 'Persuasion'], 'Worli, Mumbai, Maharashtra', POINT(72.8181, 19.0176), '8-12 hours/week', '6 months', ARRAY['Certificate of Appreciation', 'Community Work Training', 'Social Impact'], 'Strong communication skills. Understanding of local community dynamics. Social work interest.', 6, 2, 'active', now(), now()),
  
  -- HelpAge India postings
  ('HelpAge India', 'Elderly Care Companion', 'Provide companionship and basic care assistance to elderly residents. Engage in conversations, recreational activities, and health monitoring.', ARRAY['Elderly Care', 'Communication', 'Empathy', 'Healthcare'], 'T. Nagar, Chennai, Tamil Nadu', POINT(80.2340, 13.0389), '6-10 hours/week', '4 months', ARRAY['Certificate of Appreciation', 'Healthcare Training', 'Emotional Fulfillment'], 'Patience and empathy for elderly. Basic health awareness. Tamil/English communication.', 8, 3, 'active', now(), now()),
  ('HelpAge India', 'Health Camp Organizer', 'Organize and coordinate health camps for elderly in rural and urban areas. Assist with registration, crowd management, and follow-ups.', ARRAY['Event Management', 'Healthcare', 'Communication', 'Organization'], 'Adyar, Chennai, Tamil Nadu', POINT(80.2574, 13.0067), '8-12 hours/month', '6 months', ARRAY['Certificate of Appreciation', 'Event Management Training', 'Networking'], 'Event management experience preferred. Good organizational skills. Healthcare interest.', 12, 6, 'active', now(), now()),
  ('HelpAge India', 'Medical Camp Volunteer', 'Assist in organizing medical camps for elderly. Help with patient registration, basic health checks, and medicine distribution.', ARRAY['Healthcare', 'Event Management', 'Communication', 'Medical Assistance'], 'Anna Nagar, Chennai, Tamil Nadu', POINT(80.2093, 13.0850), '8-10 hours/month', '1 year', ARRAY['Certificate of Appreciation', 'Medical Training', 'Healthcare Exposure'], 'Interest in healthcare. Basic medical knowledge helpful. Good interpersonal skills.', 10, 4, 'active', now(), now()),
  
  -- CRY postings
  ('CRY - Child Rights and You', 'Child Protection Advocate', 'Work on child protection initiatives including awareness campaigns, community outreach, and supporting vulnerable children.', ARRAY['Child Protection', 'Communication', 'Social Work', 'Advocacy'], 'Koramangala, Bangalore, Karnataka', POINT(77.6309, 12.9279), '8-10 hours/week', '6 months', ARRAY['Certificate of Appreciation', 'Social Work Training', 'Legal Awareness'], 'Background in social work or psychology preferred. Strong communication skills. Sensitivity to child issues.', 6, 2, 'active', now(), now()),
  ('CRY - Child Rights and You', 'Education Support Volunteer', 'Support educational programs for underprivileged children. Assist with homework, conduct creative activities, and mentor students.', ARRAY['Teaching', 'Mentoring', 'Creativity', 'Child Psychology'], 'Indiranagar, Bangalore, Karnataka', POINT(77.6413, 12.9784), '5-7 hours/week', '4 months', ARRAY['Certificate of Appreciation', 'Training Provided', 'Mentoring Skills'], 'Good academic background. Patience with children. Creative thinking abilities.', 10, 5, 'active', now(), now()),
  ('CRY - Child Rights and You', 'Creative Arts Instructor', 'Conduct art, music, and dance sessions for children. Help develop their creative abilities and provide emotional expression outlets.', ARRAY['Arts', 'Music', 'Dance', 'Creativity', 'Child Psychology'], 'Jayanagar, Bangalore, Karnataka', POINT(77.5833, 12.9279), '4-6 hours/week', '6 months', ARRAY['Certificate of Appreciation', 'Arts Training', 'Creative Development'], 'Background in arts, music, or dance. Experience with children. Creative teaching methods.', 8, 3, 'active', now(), now()),
  
  -- Isha Foundation postings
  ('Isha Foundation', 'Environmental Conservation Volunteer', 'Participate in tree plantation drives, river cleaning activities, and environmental awareness campaigns in rural and urban areas.', ARRAY['Environment', 'Physical Activity', 'Awareness Campaigns', 'Teamwork'], 'Velachery, Chennai, Tamil Nadu', POINT(80.2206, 12.9756), '8-12 hours/month', '1 year', ARRAY['Certificate of Appreciation', 'Environmental Training', 'Travel Opportunities'], 'Physical fitness for outdoor activities. Interest in environmental conservation. Willingness to travel.', 20, 8, 'active', now(), now()),
  ('Isha Foundation', 'Rural Development Coordinator', 'Support rural development projects including water conservation, organic farming, and community health initiatives.', ARRAY['Rural Development', 'Project Management', 'Agriculture', 'Community Work'], 'Coimbatore, Tamil Nadu', POINT(76.9558, 11.0168), '15-20 hours/week', '8 months', ARRAY['Certificate of Appreciation', 'Rural Exposure', 'Skill Development', 'Accommodation'], 'Interest in rural development. Basic project management skills. Willingness to stay in rural areas.', 8, 3, 'active', now(), now()),
  ('Isha Foundation', 'Yoga & Wellness Instructor', 'Teach basic yoga and meditation to community members. Promote physical and mental wellness through holistic practices.', ARRAY['Yoga', 'Meditation', 'Wellness', 'Teaching', 'Health'], 'Besant Nagar, Chennai, Tamil Nadu', POINT(80.2669, 12.9986), '5-7 hours/week', '6 months', ARRAY['Certificate of Appreciation', 'Yoga Training', 'Wellness Knowledge'], 'Certified yoga instructor or equivalent experience. Good understanding of wellness practices.', 12, 5, 'active', now(), now()),
  
  -- Nanhi Kali postings
  ('Nanhi Kali', 'Girls Education Mentor', 'Mentor underprivileged girls in their educational journey. Provide academic support, career guidance, and life skills training.', ARRAY['Mentoring', 'Teaching', 'Career Guidance', 'Women Empowerment'], 'Pune Camp, Pune, Maharashtra', POINT(73.8567, 18.5074), '6-8 hours/week', '1 year', ARRAY['Certificate of Appreciation', 'Mentoring Training', 'Leadership Skills'], 'Good academic background. Understanding of gender issues. Patience and empathy.', 12, 6, 'active', now(), now()),
  ('Nanhi Kali', 'Life Skills Trainer', 'Conduct life skills workshops for teenage girls covering topics like health, hygiene, financial literacy, and career planning.', ARRAY['Training', 'Life Skills', 'Communication', 'Women Empowerment'], 'Kothrud, Pune, Maharashtra', POINT(73.8062, 18.5074), '4-6 hours/week', '6 months', ARRAY['Certificate of Appreciation', 'Training Materials', 'Skill Development'], 'Experience in training or counseling. Good presentation skills. Understanding of adolescent issues.', 8, 3, 'active', now(), now()),
  ('Nanhi Kali', 'Career Counseling Volunteer', 'Provide career guidance and counseling to teenage girls. Help them explore career options and plan their educational path.', ARRAY['Career Guidance', 'Counseling', 'Communication', 'Women Empowerment'], 'Shivajinagar, Pune, Maharashtra', POINT(73.8567, 18.5304), '4-6 hours/week', '8 months', ARRAY['Certificate of Appreciation', 'Counseling Training', 'Career Development'], 'Background in counseling or HR. Good understanding of career options. Empathy for young women.', 6, 2, 'active', now(), now()),
  
  -- Magic Bus postings
  ('Magic Bus', 'Youth Development Facilitator', 'Facilitate youth development programs focusing on life skills, leadership, and career readiness for young people aged 16-24.', ARRAY['Youth Development', 'Leadership', 'Facilitation', 'Career Guidance'], 'Lower Parel, Mumbai, Maharashtra', POINT(72.8311, 18.9975), '8-10 hours/week', '6 months', ARRAY['Certificate of Appreciation', 'Leadership Training', 'Networking Opportunities'], 'Experience working with youth. Good facilitation skills. Understanding of career development.', 10, 4, 'active', now(), now()),
  ('Magic Bus', 'Sports & Recreation Coordinator', 'Organize sports activities and recreational programs for children and youth. Promote physical fitness and team building.', ARRAY['Sports', 'Event Management', 'Team Building', 'Physical Fitness'], 'Goregaon West, Mumbai, Maharashtra', POINT(72.8489, 19.1646), '6-8 hours/week', '4 months', ARRAY['Certificate of Appreciation', 'Sports Training', 'Equipment Access'], 'Sports background preferred. Good physical fitness. Ability to motivate and engage youth.', 15, 7, 'active', now(), now()),
  ('Magic Bus', 'Financial Literacy Trainer', 'Teach basic financial literacy including banking, savings, budgeting, and digital payments to youth and adults.', ARRAY['Financial Literacy', 'Teaching', 'Banking', 'Digital Payments'], 'Andheri East, Mumbai, Maharashtra', POINT(72.8697, 19.1197), '5-7 hours/week', '4 months', ARRAY['Certificate of Appreciation', 'Financial Training', 'Banking Knowledge'], 'Basic understanding of banking and finance. Good teaching skills. Interest in financial inclusion.', 8, 3, 'active', now(), now())
) AS posting(org_name, title, description, skills_required, location, coordinates, time_commitment, duration, benefits, requirements, max_volunteers, current_volunteers, status, created_at, updated_at)
WHERE up.organization_name = posting.org_name 
  AND up.user_type = 'ngo' 
  AND up.verified = true;
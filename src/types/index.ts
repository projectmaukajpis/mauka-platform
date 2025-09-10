export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  type: 'volunteer' | 'ngo';
  profile?: VolunteerProfile | NGOProfile;
  created_at: string;
}

export interface VolunteerProfile {
  id: string;
  user_id: string;
  skills: string[];
  interests: string[];
  location: string;
  availability: string;
  working_hours: number;
  bio?: string;
}

export interface NGOProfile {
  id: string;
  user_id: string;
  organization_name: string;
  description: string;
  location: string;
  contact_person: string;
  website?: string;
  verified: boolean;
  positions: Position[];
}

export interface Position {
  id: string;
  title: string;
  description: string;
  skills_required: string[];
  location: string;
  time_commitment: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  status: 'active' | 'upcoming' | 'completed';
}

export interface LeaderboardEntry {
  id: string;
  volunteer_id: string;
  volunteer_name: string;
  working_hours: number;
  rank: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  image_url: string;
  bio?: string;
}
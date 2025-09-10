import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import VolunteerDashboard from '../components/Dashboard/VolunteerDashboard';
import NGODashboard from '../components/Dashboard/NGODashboard';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { supabase } from '../config/supabase';

interface UserProfile {
  id: string;
  user_type: 'volunteer' | 'ngo' | 'admin';
  name: string;
  verified: boolean;
  verification_status: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !authLoading) {
      fetchUserProfile();
    }
  }, [user, authLoading]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, user_type, name, verified, verification_status')
        .eq('user_id', user!.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, redirect to profile setup
          setError('profile_not_found');
        } else {
          throw error;
        }
      } else {
        setProfile(data);
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (error === 'profile_not_found') {
    return <Navigate to="/auth/profile-setup" replace />;
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/auth/profile-setup" replace />;
  }

  // Render appropriate dashboard based on user type
  switch (profile.user_type) {
    case 'volunteer':
      return <VolunteerDashboard profile={profile} />;
    case 'ngo':
      return <NGODashboard profile={profile} />;
    case 'admin':
      return <AdminDashboard profile={profile} />;
    default:
      return <Navigate to="/auth/profile-setup" replace />;
  }
}
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Users, FileText, Map, List } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { matchAPI } from '../../lib/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import NearbyNGOsMap from '../Maps/NearbyNGOsMap';
import NearbyNGOsList from '../Maps/NearbyNGOsList';

interface VolunteerDashboardProps {
  profile: {
    id: string;
    user_type: string;
    name: string;
    verified: boolean;
  };
}

interface Application {
  id: string;
  posting: {
    title: string;
    organization_name: string;
    location: string;
  };
  status: string;
  applied_at: string;
}

export default function VolunteerDashboard({ profile }: VolunteerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'nearby' | 'applications' | 'active' | 'history'>('nearby');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);

  const tabs = [
    { id: 'nearby', label: 'Nearby NGOs', icon: MapPin },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'active', label: 'Active', icon: Users },
    { id: 'history', label: 'History', icon: Clock },
  ];

  useEffect(() => {
    fetchUserLocation();
    if (activeTab === 'applications' || activeTab === 'active' || activeTab === 'history') {
      fetchApplications();
    }
  }, [activeTab]);

  const fetchUserLocation = async () => {
    try {
      // Try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.error('Error getting location:', error);
            // Fallback to profile location if available
            fetchProfileLocation();
          }
        );
      } else {
        fetchProfileLocation();
      }
    } catch (error) {
      console.error('Error fetching user location:', error);
      fetchProfileLocation();
    }
  };

  const fetchProfileLocation = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('location')
        .eq('user_id', profile.id)
        .single();

      if (data?.location) {
        // Extract coordinates from location data
        if (data.location.coordinates) {
          const coords = data.location.coordinates;
          if (coords.coordinates && Array.isArray(coords.coordinates)) {
            const [lng, lat] = coords.coordinates;
            setUserLocation({ lat, lng });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profile location:', error);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('applications')
        .select(`
          id,
          status,
          applied_at,
          ngo_postings!inner(
            title,
            location,
            ngo_user_id
          )
        `)
        .eq('volunteer_user_id', user.id);

      if (activeTab === 'applications') {
        query = query.eq('status', 'pending');
      } else if (activeTab === 'active') {
        query = query.eq('status', 'accepted');
      }

      const { data, error } = await query.order('applied_at', { ascending: false });

      if (error) throw error;

      // Get organization names separately
      const postingIds = data?.map(app => app.ngo_postings.ngo_user_id) || [];
      const { data: orgData } = await supabase
        .from('user_profiles')
        .select('user_id, name')
        .in('user_id', postingIds);

      const orgMap = new Map(orgData?.map(org => [org.user_id, org.name]) || []);

      const formattedApplications = data?.map(app => ({
        id: app.id,
        posting: {
          title: app.ngo_postings.title,
          organization_name: orgMap.get(app.ngo_postings.ngo_user_id) || 'Unknown Organization',
          location: app.ngo_postings.location,
        },
        status: app.status,
        applied_at: app.applied_at,
      })) || [];

      setApplications(formattedApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile.name}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to make a difference? Explore volunteer opportunities near you.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96">
          {activeTab === 'nearby' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Nearby NGO Opportunities
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md ${
                      viewMode === 'list' 
                        ? 'bg-orange-100 text-orange-600' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <List size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`p-2 rounded-md ${
                      viewMode === 'map' 
                        ? 'bg-orange-100 text-orange-600' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Map size={20} />
                  </button>
                </div>
              </div>

              {viewMode === 'map' ? (
                <NearbyNGOsMap userLocation={userLocation} />
              ) : (
                <NearbyNGOsList userLocation={userLocation} profileId={profile.id} />
              )}
            </div>
          )}

          {(activeTab === 'applications' || activeTab === 'active' || activeTab === 'history') && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {activeTab === 'applications' && 'Pending Applications'}
                {activeTab === 'active' && 'Active Volunteering'}
                {activeTab === 'history' && 'Application History'}
              </h2>

              {loading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No {activeTab} found
                  </h3>
                  <p className="text-gray-600">
                    {activeTab === 'applications' && "You haven't applied to any opportunities yet."}
                    {activeTab === 'active' && "You don't have any active volunteer positions."}
                    {activeTab === 'history' && "No application history available."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {application.posting.title}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {application.posting.organization_name}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <MapPin size={14} />
                              <span>{application.posting.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>Applied {new Date(application.applied_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
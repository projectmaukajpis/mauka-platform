import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { matchAPI } from '../lib/api';
import { supabase } from '../config/supabase';
import { MapPin, Users, Target, Clock, CheckCircle, Star, AlertCircle, RefreshCw } from 'lucide-react';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';

export default function MatchPage() {
  const { user } = useAuth();
  const [nearbyMatches, setNearbyMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radiusKm, setRadiusKm] = useState(25);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Get user's current location
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Fetch matches when location is available
  useEffect(() => {
    if (userLocation && user) {
      fetchMatches();
    }
  }, [userLocation, user, radiusKm]);

  const getCurrentLocation = () => {
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationError(null);
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Unable to get your location. ';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please enable location services and refresh the page.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }
        
        setLocationError(errorMessage);
        
        // Set default location (Mumbai) as fallback
        setUserLocation({
          lat: 19.0760,
          lng: 72.8777
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const fetchMatches = async () => {
    if (!userLocation || !user) return;

    setLoading(true);
    setError(null);

    try {
      // Get user profile to determine type
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('user_type')
        .eq('user_id', user.id)
        .single();

      if (profile?.user_type === 'volunteer') {
        // Find nearby NGOs for volunteers
        const ngos = await matchAPI.findNearbyNGOs(
          userLocation.lat, 
          userLocation.lng, 
          radiusKm
        );
        setNearbyMatches(ngos);
      } else if (profile?.user_type === 'ngo') {
        // For NGOs, show message about selecting a posting
        setNearbyMatches([]);
        setError('Please select a specific posting to find matching volunteers.');
      } else {
        setError('Please complete your profile setup to view matches.');
      }
    } catch (err: any) {
      console.error('Error fetching matches:', err);
      setError(err.message || 'Failed to load matches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadiusKm(newRadius);
  };

  const handleRetry = () => {
    if (userLocation) {
      fetchMatches();
    } else {
      getCurrentLocation();
    }
  };

  if (!user) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view matches</h1>
          <p className="text-gray-600">You need to be logged in to see nearby opportunities.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Match
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover opportunities and connections near you that match your skills and interests
          </p>
        </div>

        {/* Location Error */}
        {locationError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-medium text-yellow-800 mb-1">Location Access</h3>
                <p className="text-yellow-700 text-sm mb-3">{locationError}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <MapPin className="text-orange-600" size={20} />
              <span className="text-gray-700">Search radius:</span>
              <select
                value={radiusKm}
                onChange={(e) => handleRadiusChange(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={25}>25 km</option>
                <option value={50}>50 km</option>
                <option value={100}>100 km</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              {userLocation && (
                <span className="text-sm text-gray-500">
                  📍 {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </span>
              )}
              <Button 
                onClick={handleRetry} 
                disabled={loading}
                icon={RefreshCw}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {loading ? 'Searching...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-medium text-red-800 mb-1">Error</h3>
                <p className="text-red-700 text-sm mb-3">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Finding your perfect matches...</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && nearbyMatches.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Found {nearbyMatches.length} opportunities within {radiusKm}km
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyMatches.map((match) => (
                <div key={match.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    {/* Match Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{match.title}</h3>
                        <p className="text-orange-600 font-medium flex items-center">
                          <Users className="mr-2" size={16} />
                          {match.organization_name}
                        </p>
                      </div>
                      {match.verified && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle size={20} />
                        </div>
                      )}
                    </div>

                    {/* Location and Distance */}
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="mr-2" size={16} />
                      <span className="text-sm">{match.location}</span>
                      <span className="ml-auto bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                        {match.distanceKm.toFixed(1)} km away
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                      {match.description}
                    </p>

                    {/* Skills Required */}
                    {match.skills_required && match.skills_required.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center text-gray-700 text-sm mb-2">
                          <Target className="mr-2" size={16} />
                          Skills needed:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {match.skills_required.slice(0, 3).map((skill: string, index: number) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                          {match.skills_required.length > 3 && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                              +{match.skills_required.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Time Commitment */}
                    {match.time_commitment && (
                      <div className="flex items-center text-gray-600 text-sm mb-4">
                        <Clock className="mr-2" size={16} />
                        {match.time_commitment}
                      </div>
                    )}

                    {/* Volunteer Progress */}
                    {match.max_volunteers && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Volunteers</span>
                          <span>{match.current_volunteers || 0}/{match.max_volunteers}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min((match.current_volunteers || 0) / match.max_volunteers * 100, 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-orange-600 hover:bg-orange-700"
                        disabled={match.current_volunteers >= match.max_volunteers}
                      >
                        {match.current_volunteers >= match.max_volunteers ? 'Full' : 'Apply Now'}
                      </Button>
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && nearbyMatches.length === 0 && !error && userLocation && (
          <div className="text-center py-12">
            <Target className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No matches found</h3>
            <p className="text-gray-600 mb-4">
              Try expanding your search radius or check back later for new opportunities.
            </p>
            <Button 
              onClick={() => handleRadiusChange(Math.min(radiusKm + 25, 100))}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Expand Search Radius
            </Button>
          </div>
        )}

        {/* Location not available */}
        {!userLocation && !locationError && (
          <div className="text-center py-12">
            <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Getting your location...</h3>
            <p className="text-gray-600">
              We need your location to find nearby opportunities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
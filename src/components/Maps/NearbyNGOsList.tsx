import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Filter } from 'lucide-react';
import { matchAPI } from '../../lib/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import Button from '../UI/Button';

interface NearbyNGOsListProps {
  userLocation: {lat: number; lng: number} | null;
  profileId?: string;
}

interface NearbyNGO {
  id: string;
  title: string;
  organization_name: string;
  location: string;
  description: string;
  focus_areas: string[];
  distanceKm: number;
  verified: boolean;
}

export default function NearbyNGOsList({ userLocation, profileId }: NearbyNGOsListProps) {
  const [ngos, setNgos] = useState<NearbyNGO[]>([]);
  const [loading, setLoading] = useState(false);
  const [radiusKm, setRadiusKm] = useState(25);
  const [skillFilter, setSkillFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchNearbyNGOs();
  }, [userLocation, radiusKm, skillFilter]);

  const fetchNearbyNGOs = async () => {
    if (!userLocation) {
      return;
    }

    setLoading(true);
    try {
      const tags = skillFilter ? skillFilter.split(',').map(s => s.trim()) : [];
      const nearbyNGOs = await matchAPI.findNearbyNGOs(
        userLocation.lat,
        userLocation.lng,
        radiusKm
      );
      
      // Filter by skills if provided
      let filteredNGOs = nearbyNGOs;
      if (tags.length > 0) {
        filteredNGOs = nearbyNGOs.filter(ngo =>
          ngo.focus_areas?.some(area =>
            tags.some(tag => area.toLowerCase().includes(tag.toLowerCase()))
          )
        );
      }
      
      setNgos(filteredNGOs);
    } catch (error) {
      console.error('Error fetching nearby NGOs:', error);
      setNgos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (ngoId: string) => {
    // TODO: Implement connection functionality
    alert('Connection feature coming soon!');
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">
            Within:
          </label>
          <select
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={25}>25 km</option>
            <option value={50}>50 km</option>
          </select>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={Filter}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters
        </Button>
      </div>

      {/* Skill Filter */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Skills:
          </label>
          <input
            type="text"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            placeholder="e.g., Teaching, Healthcare, Technology"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      )}

      {/* Location Status */}
      {!userLocation && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <MapPin className="text-yellow-600" size={20} />
            <div>
              <h3 className="font-medium text-yellow-800">Location not set</h3>
              <p className="text-sm text-yellow-700">
                Please update your profile with your location to see nearby opportunities.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : ngos.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No opportunities found nearby
          </h3>
          <p className="text-gray-600">
            Try expanding your search radius or check back later for new postings.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {ngos.length} NGOs within {radiusKm}km
          </h3>
          
          {ngos.map((ngo) => (
            <div
              key={ngo.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {ngo.organization_name}
                    </h4>
                    {ngo.verified && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {ngo.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin size={14} />
                      <span>{ngo.location}</span>
                    </div>
                    <span className="font-medium text-orange-600">
                      {ngo.distanceKm.toFixed(1)} km away
                    </span>
                  </div>
                  
                  {ngo.focus_areas && ngo.focus_areas.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {ngo.focus_areas.slice(0, 3).map((area, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                        >
                          {area}
                        </span>
                      ))}
                      {ngo.focus_areas.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{ngo.focus_areas.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="ml-6">
                  <Button
                    onClick={() => handleConnect(ngo.id)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Connect
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
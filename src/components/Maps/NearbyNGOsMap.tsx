import React, { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import Button from '../UI/Button';

interface NearbyNGOsMapProps {
  userLocation: {lat: number; lng: number} | null;
}

interface NGOPosting {
  id: string;
  title: string;
  organization_name: string;
  location: string;
  coordinates: {lat: number; lng: number};
  distanceKm: number;
  description: string;
  skills_required: string[];
}

export default function NearbyNGOsMap({ userLocation }: NearbyNGOsMapProps) {
  const [nearbyNGOs, setNearbyNGOs] = useState<NGOPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [radiusKm, setRadiusKm] = useState(25);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyNGOs();
    }
  }, [userLocation, radiusKm]);

  const fetchNearbyNGOs = async () => {
    if (!userLocation) return;

    setLoading(true);
    try {
      // This would call your backend API
      const response = await fetch(`/api/match/nearby-ngos?lat=${userLocation.lat}&lng=${userLocation.lng}&radiusKm=${radiusKm}`);
      const data = await response.json();
      
      if (data.success) {
        setNearbyNGOs(data.results);
      }
    } catch (error) {
      console.error('Error fetching nearby NGOs:', error);
      // For now, show sample data
      setNearbyNGOs([
        {
          id: '1',
          title: 'Teaching Assistant',
          organization_name: 'Teach for India',
          location: 'Andheri, Mumbai',
          coordinates: { lat: 19.1136, lng: 72.8697 },
          distanceKm: 5.2,
          description: 'Help teach mathematics to underprivileged children',
          skills_required: ['Teaching', 'Mathematics']
        },
        {
          id: '2',
          title: 'Health Camp Volunteer',
          organization_name: 'Akshaya Patra',
          location: 'Bandra, Mumbai',
          coordinates: { lat: 19.0596, lng: 72.8295 },
          distanceKm: 8.7,
          description: 'Assist in organizing health camps for children',
          skills_required: ['Healthcare', 'Event Management']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // This would update the user's location in the database
          console.log('Current location:', position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">
            Radius:
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
          icon={Navigation}
          onClick={getCurrentLocation}
        >
          Update Location
        </Button>
      </div>

      {/* Map Container */}
      <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Interactive Map Coming Soon
          </h3>
          <p className="text-gray-600 mb-4">
            We're integrating Mapbox to show nearby NGOs on an interactive map.
          </p>
          {userLocation && (
            <p className="text-sm text-gray-500">
              Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </p>
          )}
        </div>
      </div>

      {/* Nearby NGOs List */}
      {nearbyNGOs.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Found {nearbyNGOs.length} opportunities within {radiusKm}km
          </h3>
          <div className="space-y-4">
            {nearbyNGOs.map((ngo) => (
              <div
                key={ngo.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {ngo.title}
                    </h4>
                    <p className="text-orange-600 font-medium mb-2">
                      {ngo.organization_name}
                    </p>
                    <p className="text-gray-600 mb-3">
                      {ngo.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} />
                        <span>{ngo.location}</span>
                      </div>
                      <span className="font-medium text-orange-600">
                        {ngo.distanceKm.toFixed(1)} km away
                      </span>
                    </div>
                  </div>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
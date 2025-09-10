/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Object} coord1 - First coordinate {lat, lng}
 * @param {Object} coord2 - Second coordinate {lat, lng}
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(coord1, coord2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(coord2.lat - coord1.lat);
  const dLng = toRadians(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) *
      Math.cos(toRadians(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Check if a point is within a radius of another point
 */
export function isWithinRadius(center, point, radiusKm) {
  const distance = calculateDistance(center, point);
  return distance <= radiusKm;
}

/**
 * Sort locations by distance from a center point
 */
export function sortByDistance(locations, center) {
  return locations
    .map(location => ({
      ...location,
      distanceKm: calculateDistance(center, location.coordinates)
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

/**
 * Create a MongoDB geospatial query for nearby documents
 */
export function createNearQuery(lat, lng, radiusKm, additionalQuery = {}) {
  return {
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: radiusKm * 1000 // Convert km to meters
      }
    },
    ...additionalQuery
  };
}

/**
 * Create a MongoDB aggregation pipeline for geospatial search
 */
export function createGeoAggregationPipeline(lat, lng, radiusKm, additionalMatch = {}) {
  return [
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        distanceField: 'distanceMeters',
        maxDistance: radiusKm * 1000,
        spherical: true,
        query: additionalMatch
      }
    },
    {
      $addFields: {
        distanceKm: { $divide: ['$distanceMeters', 1000] }
      }
    },
    {
      $sort: { distanceKm: 1 }
    }
  ];
}
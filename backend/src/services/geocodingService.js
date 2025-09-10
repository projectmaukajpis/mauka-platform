import dotenv from 'dotenv';

dotenv.config();

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

/**
 * Geocode an address using Mapbox Geocoding API
 */
export async function geocodeAddress(address) {
  if (!MAPBOX_ACCESS_TOKEN) {
    console.warn('Mapbox access token not configured');
    return null;
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=IN&limit=1`
    );

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      const [lng, lat] = feature.center;

      // Extract place components
      const context = feature.context || [];
      const city = context.find(c => c.id.includes('place'))?.text;
      const state = context.find(c => c.id.includes('region'))?.text;
      const country = context.find(c => c.id.includes('country'))?.text;

      return {
        coordinates: { lat, lng },
        address: feature.place_name,
        city,
        state,
        country
      };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Reverse geocode coordinates to get address
 */
export async function reverseGeocode(lat, lng) {
  if (!MAPBOX_ACCESS_TOKEN) {
    console.warn('Mapbox access token not configured');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=IN&limit=1`
    );

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      return {
        address: feature.place_name,
        coordinates: { lat, lng }
      };
    }

    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}
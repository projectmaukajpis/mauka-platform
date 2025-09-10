import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import { getDatabase } from '../config/database.js';

const router = express.Router();

// GET /api/users/profile
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const db = getDatabase();

    // Find profile in unified collection
    const profile = await db.collection('user_profiles').findOne({ 
      user_id: userId
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
});

// PUT /api/users/profile
router.put('/profile', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;
    const db = getDatabase();

    // Geocode location if provided
    if (profileData.location && typeof profileData.location === 'string') {
      try {
        const geocodeResult = await geocodeAddress(profileData.location);
        if (geocodeResult) {
          profileData.location = {
            address: geocodeResult.address,
            coordinates: geocodeResult.geoJSON
          };
        }
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    }
    
    const result = await db.collection('user_profiles').updateOne(
      { user_id: userId },
      {
        $set: {
          ...profileData,
          user_id: userId,
          updated_at: new Date()
        }
      },
      { upsert: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { modified: result.modifiedCount, upserted: result.upsertedCount }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

// Geocoding helper function
async function geocodeAddress(address) {
  const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
  if (!MAPBOX_TOKEN) {
    console.warn('Mapbox token not configured');
    return null;
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_TOKEN}&country=IN&limit=1`
    );

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      const [lng, lat] = feature.center;

      return {
        coordinates: { lat, lng },
        address: feature.place_name,
        geoJSON: {
          type: 'Point',
          coordinates: [lng, lat]
        }
      };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
export default router;
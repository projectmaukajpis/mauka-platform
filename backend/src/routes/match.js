import express from 'express';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database.js';
import { authenticateUser } from '../middleware/auth.js';
const router = express.Router();

/**
 * GET /api/match/nearby-ngos
 * Find nearby NGO postings for volunteers
 */
router.get('/nearby-ngos', authenticateUser, async (req, res) => {
  try {
    const { lat, lng, radiusKm = 25 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const radius = Math.min(parseFloat(radiusKm as string), 100); // Max 100km

    const db = getDatabase();
    
    // Find nearby NGOs using real geospatial query
    const pipeline = [
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          distanceField: 'distanceMeters',
          maxDistance: radius * 1000,
          spherical: true,
          query: { 
            user_type: 'ngo',
            'location.coordinates': { $exists: true }
          }
        }
      },
      {
        $addFields: {
          distanceKm: { $divide: ['$distanceMeters', 1000] }
        }
      },
      {
        $sort: { distanceKm: 1 }
      },
      {
        $limit: 50
      }
    ];

    const nearbyNGOs = await db.collection('user_profiles').aggregate(pipeline).toArray();

    const results = nearbyNGOs.map(ngo => ({
      id: ngo._id,
      title: ngo.name || ngo.organization_name,
      coordinates: {
        lat: ngo.location?.coordinates?.coordinates[1] || 0,
        lng: ngo.location?.coordinates?.coordinates[0] || 0
      },
      distanceKm: Math.round(ngo.distanceKm * 10) / 10,
      description: ngo.bio || ngo.description,
      focus_areas: ngo.focus_areas || [],
      verified: ngo.verified || false
    }));

    res.json({
      success: true,
      results,
      meta: {
        count: results.length,
        radiusKm: radius,
        center: { lat: latitude, lng: longitude }
      }
    });

  } catch (error) {
    console.error('Error finding nearby NGOs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to find nearby NGOs'
    });
  }
});

/**
 * GET /api/match/nearby-volunteers
 * Find nearby volunteers for a specific posting
 */
router.get('/nearby-volunteers', authenticateUser, async (req, res) => {
  try {
    const { postingId } = req.query;

    if (!postingId) {
      return res.status(400).json({
        success: false,
        error: 'Posting ID is required'
      });
    }

    const db = getDatabase();
    
    // Get the posting to find its location
    const posting = await db.collection('ngo_postings').findOne({ 
      _id: new ObjectId(postingId) 
    });
    
    if (!posting) {
      return res.status(404).json({
        success: false,
        error: 'Posting not found'
      });
    }

    if (!posting.location?.coordinates) {
      return res.status(400).json({
        success: false,
        error: 'Posting has no location data'
      });
    }

    const [longitude, latitude] = posting.location.coordinates.coordinates;

    // Find nearby volunteers
    const pipeline = [
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          distanceField: 'distanceMeters',
          maxDistance: 50000, // 50km max
          spherical: true,
          query: { 
            user_type: 'volunteer',
            verified: true,
            'location.coordinates': { $exists: true }
          }
        }
      },
      {
        $addFields: {
          distanceKm: { $divide: ['$distanceMeters', 1000] }
        }
      },
      {
        $sort: { distanceKm: 1 }
      },
      {
        $limit: 100
      }
    ];

    const nearbyVolunteers = await db.collection('user_profiles').aggregate(pipeline).toArray();

    // Calculate skill match scores
    const results = nearbyVolunteers.map(volunteer => {
      const volunteerSkills = volunteer.skills || [];
      const requiredSkills = posting.skills_required || [];
      
      const skillMatches = requiredSkills.filter(skill =>
        volunteerSkills.some(vSkill => 
          vSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(vSkill.toLowerCase())
        )
      ).length;
      
      const skillScore = requiredSkills.length > 0 ? skillMatches / requiredSkills.length : 0;

      return {
        id: volunteer._id,
        name: volunteer.name,
        location: volunteer.location?.address || 'Location not specified',
        coordinates: {
          lat: volunteer.location?.coordinates?.coordinates[1] || 0,
          lng: volunteer.location?.coordinates?.coordinates[0] || 0
        },
        distanceKm: Math.round(volunteer.distanceKm * 10) / 10,
        skills: volunteerSkills,
        bio: volunteer.bio || '',
        availability: volunteer.availability || '',
        verified: volunteer.verified,
        skillMatchScore: Math.round(skillScore * 100)
      };
    });

    // Sort by distance primarily, then by skill match
    results.sort((a, b) => {
      if (Math.abs(a.distanceKm - b.distanceKm) < 1) {
        return b.skillMatchScore - a.skillMatchScore;
      }
      return a.distanceKm - b.distanceKm;
    });

    res.json({
      success: true,
      results: results.slice(0, 20), // Limit to top 20
      meta: {
        postingId,
        postingLocation: posting.location?.address || 'Unknown location',
        count: results.length
      }
    });

  } catch (error) {
    console.error('Error finding nearby volunteers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to find nearby volunteers'
    });
  }
});

export default router;
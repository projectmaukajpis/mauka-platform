import express from 'express';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database.js';
import { ObjectId } from 'mongodb';
const router = express.Router();

/**
 * Geocode address using Mapbox (simplified version)
 */
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
/**
 * Geocode address using Mapbox (simplified version)
 */
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
/**
 * GET /api/postings
 * Search postings with location and filters
 */
router.get('/', async (req, res) => {
  try {
    const { near, radiusKm = 25, tags, limit = 20, skip = 0 } = req.query;

    const db = getDatabase();
    let pipeline = [];

    // Location-based search
    if (near) {
      const [lat, lng] = near.split(',').map(coord => parseFloat(coord.trim()));
      
      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid coordinates format. Use: lat,lng'
        });
      }

      const radius = Math.min(parseFloat(radiusKm), 100) * 1000; // Convert to meters

      pipeline = [
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            distanceField: 'distanceMeters',
            maxDistance: radius,
            spherical: true,
            query: { 
              status: 'active',
              'location.coordinates': { $exists: true }
            }
          }
        },
        {
          $addFields: {
            distanceKm: { $divide: ['$distanceMeters', 1000] }
          }
        }
      ];
    } else {
      // Non-location search
      pipeline = [
        { $match: { status: 'active' } },
        { $addFields: { distanceKm: null } }
      ];
    }

    // Lookup NGO information
    pipeline.push(
      {
        $lookup: {
          from: 'user_profiles',
          localField: 'ngo_user_id',
          foreignField: 'user_id',
          as: 'ngo'
        }
      },
      {
        $unwind: '$ngo'
      },
      {
        $match: {
          'ngo.verified': true
        }
      }
    );

    // Tag filtering
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      pipeline.push({
        $match: {
          $or: [
            { tags: { $in: tagArray } },
            { skills_required: { $in: tagArray } }
          ]
        }
      });
    }

    // Sort and limit
    pipeline.push(
      { $sort: near ? { distanceKm: 1 } : { createdAt: -1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) }
    );

    const postings = await db.collection('ngo_postings').aggregate(pipeline).toArray();

    const results = postings.map(posting => ({
      id: posting._id,
      title: posting.title,
      description: posting.description,
      location: posting.location?.address || 'Location not specified',
      coordinates: {
        lat: posting.location?.coordinates?.coordinates[1] || 0,
        lng: posting.location?.coordinates?.coordinates[0] || 0
      },
      distanceKm: posting.distanceKm ? Math.round(posting.distanceKm * 10) / 10 : null,
      skills_required: posting.skills_required || [],
      time_commitment: posting.timeCommitment,
      duration: posting.duration,
      benefits: posting.benefits || [],
      max_volunteers: posting.maxVolunteers,
      current_volunteers: posting.currentVolunteers,
      application_deadline: posting.applicationDeadline,
      tags: posting.tags || [],
      organization: {
        name: posting.ngo.name || posting.ngo.organization_name,
        verified: posting.ngo.verified
      },
      created_at: posting.created_at
    }));

    res.json({
      success: true,
      results,
      meta: {
        count: results.length,
        radiusKm: near ? parseFloat(radiusKm) : null,
        center: near ? { lat: parseFloat(near.split(',')[0]), lng: parseFloat(near.split(',')[1]) } : null
      }
    });

  } catch (error) {
    console.error('Error searching postings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search postings'
    });
  }
});

/**
 * POST /api/postings
 * Create a new posting (NGOs only)
 */
router.post('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const db = getDatabase();
    
    // Verify user is a verified NGO
    const user = await db.collection('user_profiles').findOne({ 
      user_id: userId, 
      user_type: 'ngo', 
      verified: true 
    });
    
    if (!user) {
      return res.status(403).json({
        success: false,
        error: 'Only verified NGOs can create postings'
      });
    }

    const {
      title,
      description,
      skills_required,
      location,
      time_commitment,
      duration,
      benefits,
      requirements,
      application_deadline,
      max_volunteers,
      tags
    } = req.body;

    // Geocode the location
    const geocodeResult = await geocodeAddress(location);
    if (!geocodeResult) {
      return res.status(400).json({
        success: false,
        error: 'Could not geocode the provided location'
      });
    }

    const posting = {
      ngo_user_id: userId,
      title,
      description,
      skills_required: skills_required || [],
      location: {
        address: geocodeResult.address,
        coordinates: geocodeResult.geoJSON
      },
      time_commitment,
      duration,
      benefits,
      requirements,
      application_deadline: application_deadline ? new Date(application_deadline) : null,
      max_volunteers: max_volunteers,
      current_volunteers: 0,
      tags: tags || [],
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    };
    const result = await db.collection('ngo_postings').insertOne(posting);
    posting.id = result.insertedId;

    res.json({
      success: true,
      data: posting,
      message: 'Posting created successfully'
    });

  } catch (error) {
    console.error('Error creating posting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create posting'
    });
  }
});

/**
 * PUT /api/postings/:id
 * Update a posting
 */
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const db = getDatabase();

    // Find user
    const user = await db.collection('user_profiles').findOne({ user_id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Find posting and verify ownership
    const posting = await db.collection('ngo_postings').findOne({ 
      _id: new ObjectId(id), 
      ngo_user_id: userId 
    });
    
    if (!posting) {
      return res.status(404).json({
        success: false,
        error: 'Posting not found or access denied'
      });
    }

    const updateData = { ...req.body };

    // If location is being updated, geocode it
    if (updateData.location && updateData.location !== posting.location?.address) {
      const geocodeResult = await geocodeAddress(updateData.location);
      if (geocodeResult) {
        updateData.location = {
          address: geocodeResult.address,
          coordinates: geocodeResult.geoJSON
        };
      }
    }
    
    updateData.updated_at = new Date();
    
    const result = await db.collection('ngo_postings').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Posting not found'
      });
    }

    const updatedPosting = await db.collection('ngo_postings').findOne({ _id: new ObjectId(id) });

    res.json({
      success: true,
      data: updatedPosting,
      message: 'Posting updated successfully'
    });

  } catch (error) {
    console.error('Error updating posting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update posting'
    });
  }
});

/**
 * DELETE /api/postings/:id
 * Delete a posting
 */
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const db = getDatabase();

    // Find user
    const user = await db.collection('user_profiles').findOne({ user_id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Find and delete posting
    const result = await db.collection('ngo_postings').deleteOne({ 
      _id: new ObjectId(id), 
      ngo_user_id: userId 
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Posting not found or access denied'
      });
    }

    res.json({
      success: true,
      message: 'Posting deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting posting:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete posting'
    });
  }
});

export default router;
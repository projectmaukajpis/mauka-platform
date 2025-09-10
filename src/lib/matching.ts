import { connectToMongoDB } from './mongodb';
import { calculateDistance, Coordinates } from './geocoding';

export interface MatchResult {
  id: string;
  name: string;
  location: string;
  coordinates: Coordinates;
  distanceKm: number;
  skills?: string[];
  interests?: string[];
  focus_areas?: string[];
  bio?: string;
  verified: boolean;
  matchScore?: number;
}

export interface NearbyNGOsParams {
  lat: number;
  lng: number;
  radiusKm: number;
  tags?: string[];
}

export interface NearbyVolunteersParams {
  postingId: string;
  radiusKm?: number;
}

/**
 * Find nearby NGOs for volunteers using real geospatial queries
 */
export async function findNearbyNGOs(params: NearbyNGOsParams): Promise<MatchResult[]> {
  const db = await connectToMongoDB();
  const { lat, lng, radiusKm, tags = [] } = params;

  const pipeline: any[] = [
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng, lat] // MongoDB uses [lng, lat]
        },
        distanceField: 'distanceMeters',
        maxDistance: radiusKm * 1000, // Convert km to meters
        spherical: true,
        query: {
          user_type: 'ngo',
          verified: true,
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

  // Add tag filtering if provided
  if (tags.length > 0) {
    pipeline.push({
      $match: {
        $or: [
          { focus_areas: { $in: tags } },
          { skills: { $in: tags } }
        ]
      }
    });
  }

  pipeline.push(
    { $sort: { distanceKm: 1 } },
    { $limit: 50 }
  );

  const results = await db.collection('user_profiles').aggregate(pipeline).toArray();

  return results.map(result => ({
    id: result._id.toString(),
    name: result.name || result.organization_name,
    location: result.location?.address || 'Location not specified',
    coordinates: {
      lat: result.location?.coordinates?.coordinates[1] || 0,
      lng: result.location?.coordinates?.coordinates[0] || 0
    },
    distanceKm: Math.round(result.distanceKm * 10) / 10,
    focus_areas: result.focus_areas || [],
    bio: result.bio || result.description,
    verified: result.verified || false
  }));
}

/**
 * Find nearby volunteers for a specific NGO posting
 */
export async function findNearbyVolunteers(params: NearbyVolunteersParams): Promise<MatchResult[]> {
  const db = await connectToMongoDB();
  const { postingId, radiusKm = 50 } = params;

  // First get the posting to find its location
  const posting = await db.collection('ngo_postings').findOne({ _id: postingId });
  if (!posting || !posting.location?.coordinates) {
    throw new Error('Posting not found or has no location');
  }

  const [lng, lat] = posting.location.coordinates.coordinates;

  const pipeline = [
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        distanceField: 'distanceMeters',
        maxDistance: radiusKm * 1000,
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
    { $sort: { distanceKm: 1 } },
    { $limit: 100 }
  ];

  const results = await db.collection('user_profiles').aggregate(pipeline).toArray();

  // Calculate skill match scores
  const requiredSkills = posting.skills_required || [];
  
  return results.map(result => {
    const volunteerSkills = result.skills || [];
    const skillMatches = requiredSkills.filter(skill =>
      volunteerSkills.some(vSkill => 
        vSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(vSkill.toLowerCase())
      )
    ).length;
    
    const skillScore = requiredSkills.length > 0 ? skillMatches / requiredSkills.length : 0;

    return {
      id: result._id.toString(),
      name: result.name,
      location: result.location?.address || 'Location not specified',
      coordinates: {
        lat: result.location?.coordinates?.coordinates[1] || 0,
        lng: result.location?.coordinates?.coordinates[0] || 0
      },
      distanceKm: Math.round(result.distanceKm * 10) / 10,
      skills: volunteerSkills,
      interests: result.interests || [],
      bio: result.bio,
      verified: result.verified || false,
      matchScore: Math.round(skillScore * 100)
    };
  }).sort((a, b) => {
    // Sort by distance first, then by skill match
    if (Math.abs(a.distanceKm - b.distanceKm) < 1) {
      return (b.matchScore || 0) - (a.matchScore || 0);
    }
    return a.distanceKm - b.distanceKm;
  });
}

/**
 * Search postings with location and filters
 */
export async function searchPostings(params: {
  lat: number;
  lng: number;
  radiusKm: number;
  tags?: string[];
  limit?: number;
}): Promise<any[]> {
  const db = await connectToMongoDB();
  const { lat, lng, radiusKm, tags = [], limit = 20 } = params;

  const pipeline: any[] = [
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        distanceField: 'distanceMeters',
        maxDistance: radiusKm * 1000,
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

  // Add tag filtering
  if (tags.length > 0) {
    pipeline.push({
      $match: {
        $or: [
          { tags: { $in: tags } },
          { skills_required: { $in: tags } }
        ]
      }
    });
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
    },
    { $sort: { distanceKm: 1 } },
    { $limit: limit }
  );

  const results = await db.collection('ngo_postings').aggregate(pipeline).toArray();

  return results.map(posting => ({
    id: posting._id.toString(),
    title: posting.title,
    description: posting.description,
    location: posting.location?.address || 'Location not specified',
    coordinates: {
      lat: posting.location?.coordinates?.coordinates[1] || 0,
      lng: posting.location?.coordinates?.coordinates[0] || 0
    },
    distanceKm: Math.round(posting.distanceKm * 10) / 10,
    skills_required: posting.skills_required || [],
    tags: posting.tags || [],
    time_commitment: posting.time_commitment,
    max_volunteers: posting.max_volunteers,
    current_volunteers: posting.current_volunteers || 0,
    organization: {
      name: posting.ngo.name || posting.ngo.organization_name,
      verified: posting.ngo.verified
    },
    created_at: posting.created_at
  }));
}
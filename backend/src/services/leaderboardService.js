import { getDatabase } from '../config/database.js';

export const updateLeaderboard = async () => {
  try {
    const db = getDatabase();
    
    // Aggregate volunteer working hours
    const pipeline = [
      {
        $group: {
          _id: '$volunteer_id',
          total_hours: { $sum: '$working_hours' },
          volunteer_name: { $first: '$volunteer_name' }
        }
      },
      {
        $sort: { total_hours: -1 }
      },
      {
        $limit: 50 // Top 50 volunteers
      },
      {
        $addFields: {
          rank: { $add: [{ $indexOfArray: [{ $setUnion: ['$_id'] }, '$_id'] }, 1] }
        }
      }
    ];

    const results = await db.collection('volunteer_activities').aggregate(pipeline).toArray();

    // Clear existing leaderboard
    await db.collection('leaderboard').deleteMany({});

    // Insert new leaderboard data
    const leaderboardData = results.map((item, index) => ({
      volunteer_id: item._id,
      volunteer_name: item.volunteer_name,
      working_hours: item.total_hours,
      rank: index + 1,
      updated_at: new Date()
    }));

    if (leaderboardData.length > 0) {
      await db.collection('leaderboard').insertMany(leaderboardData);
    }

    console.log(`✅ Leaderboard updated with ${leaderboardData.length} entries`);
    return leaderboardData;
  } catch (error) {
    console.error('❌ Error updating leaderboard:', error);
    throw error;
  }
};

export const getLeaderboard = async (limit = 10) => {
  try {
    const db = getDatabase();
    
    const leaderboard = await db.collection('leaderboard')
      .find({})
      .sort({ rank: 1 })
      .limit(limit)
      .toArray();

    return leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};
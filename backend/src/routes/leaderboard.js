import express from 'express';
import { getLeaderboard } from '../services/leaderboardService.js';

const router = express.Router();

// GET /api/leaderboard
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await getLeaderboard(limit);
    
    res.json({
      success: true,
      data: leaderboard,
      meta: {
        count: leaderboard.length,
        last_updated: leaderboard[0]?.updated_at || null
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard'
    });
  }
});

export default router;
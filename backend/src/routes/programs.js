import express from 'express';
import { getDatabase } from '../config/database.js';

const router = express.Router();

// GET /api/programs
router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    const { status, limit = 20, skip = 0 } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const programs = await db.collection('programs')
      .find(query)
      .sort({ created_at: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .toArray();

    const total = await db.collection('programs').countDocuments(query);

    res.json({
      success: true,
      data: programs,
      meta: {
        total,
        count: programs.length,
        skip: parseInt(skip),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch programs'
    });
  }
});

export default router;
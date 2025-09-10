import express from 'express';
import { getDatabase } from '../config/database.js';

const router = express.Router();

// GET /api/ngos
router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    const { location, verified, limit = 20, skip = 0 } = req.query;

    const query = {};
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (verified !== undefined) {
      query.verified = verified === 'true';
    }

    const ngos = await db.collection('ngos')
      .find(query)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .toArray();

    const total = await db.collection('ngos').countDocuments(query);

    res.json({
      success: true,
      data: ngos,
      meta: {
        total,
        count: ngos.length,
        skip: parseInt(skip),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching NGOs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch NGOs'
    });
  }
});

// GET /api/ngos/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    const ngo = await db.collection('ngos').findOne({ _id: new ObjectId(id) });
    
    if (!ngo) {
      return res.status(404).json({
        success: false,
        error: 'NGO not found'
      });
    }

    res.json({
      success: true,
      data: ngo
    });
  } catch (error) {
    console.error('Error fetching NGO:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch NGO'
    });
  }
});

export default router;
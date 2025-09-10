import express from 'express';
import { getDatabase } from '../config/database.js';
import { sendWelcomeEmail } from '../services/emailService.js';
import searchService from '../lib/search.js';

const router = express.Router();

// POST /api/auth/profile-setup
router.post('/profile-setup', async (req, res) => {
  try {
    const { user_id, user_type, profile_data } = req.body;

    if (!user_id || !user_type || !profile_data) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const db = getDatabase();
    const collection = user_type === 'volunteer' ? 'volunteers' : 'ngos';

    // Create profile document
    const profileDoc = {
      user_id,
      ...profile_data,
      created_at: new Date(),
      updated_at: new Date()
    };

    // Insert profile
    const result = await db.collection(collection).insertOne(profileDoc);

    // Generate embeddings for the new profile
    if (result.insertedId) {
      try {
        await searchService.upsertDocument({ ...profileDoc, _id: result.insertedId }, collection);
        console.log(`✅ Created ${user_type} profile with embeddings for ${profile_data.name || profile_data.email}`);
      } catch (embeddingError) {
        console.error('Failed to generate embeddings, but profile created:', embeddingError.message);
      }
    }

    // Send welcome email (don't wait for it)
    if (profile_data.email && profile_data.name) {
      sendWelcomeEmail(profile_data.email, profile_data.name)
        .catch(err => console.error('Welcome email error:', err));
    }

    res.json({
      success: true,
      message: 'Profile setup completed successfully',
      data: { user_id, user_type }
    });
  } catch (error) {
    console.error('Error setting up profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to set up profile'
    });
  }
});

export default router;
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Create Supabase client only if environment variables are provided
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export const authenticateUser = async (req, res, next) => {
  try {
    // If Supabase is not configured, create a mock user for testing
    if (!supabase) {
      console.log('⚠️  Supabase not configured, using mock authentication for testing');
      
      // Extract user ID from token for development
      const authHeader = req.headers.authorization;
      let mockUserId = 'dev-user-123'; // default
      let mockEmail = 'dev@test.com';
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        // Use the token as the user ID for more flexibility
        mockUserId = token;
        mockEmail = `${token}@test.com`;
      }
      
      req.user = { id: mockUserId, email: mockEmail };
      console.log('🔧 Mock user:', mockUserId, mockEmail);
      return next();
    }

    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};
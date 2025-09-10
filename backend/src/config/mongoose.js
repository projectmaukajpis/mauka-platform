import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mauka';

export const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB with Mongoose');
    
    // Ensure geospatial indexes exist
    await ensureGeospatialIndexes();
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const ensureGeospatialIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    
    // Create 2dsphere indexes for location-based queries
    await db.collection('users').createIndex({ 'profile.location.coordinates': '2dsphere' });
    await db.collection('postings').createIndex({ 'location.coordinates': '2dsphere' });
    
    console.log('✅ Geospatial indexes ensured');
  } catch (error) {
    console.error('Error creating geospatial indexes:', error);
  }
};

export default mongoose;
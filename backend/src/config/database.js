import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let db = null;
let client = null;

export const connectToDatabase = async () => {
  try {
    if (db) {
      return db;
    }

    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const dbName = process.env.MONGODB_DB_NAME || 'MAUKA';

    // MongoDB client options optimized for Atlas
    const clientOptions = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    };

    client = new MongoClient(uri, clientOptions);

    await client.connect();
    console.log('✅ Connected to MongoDB');

    db = client.db(dbName);

    // Create indexes for better performance
    await createIndexes(db);

    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

const createIndexes = async (database) => {
  try {
    // User profiles indexes
    // User profiles indexes (unified collection)
    await database.collection('user_profiles').createIndex({ user_id: 1 });
    await database.collection('user_profiles').createIndex({ user_type: 1 });
    await database.collection('user_profiles').createIndex({ 'location.coordinates': '2dsphere' });
    await database.collection('user_profiles').createIndex({ verified: 1 });
    await database.collection('user_profiles').createIndex({ skills: 1 });
    await database.collection('user_profiles').createIndex({ focus_areas: 1 });

    // NGO postings indexes
    await database.collection('ngo_postings').createIndex({ ngo_user_id: 1 });
    await database.collection('ngo_postings').createIndex({ status: 1 });
    await database.collection('ngo_postings').createIndex({ 'location.coordinates': '2dsphere' });
    await database.collection('ngo_postings').createIndex({ tags: 1 });
    await database.collection('ngo_postings').createIndex({ skills_required: 1 });
    await database.collection('ngo_postings').createIndex({ created_at: -1 });

    // Leaderboard indexes
    await database.collection('leaderboard').createIndex({ working_hours: -1 });
    await database.collection('leaderboard').createIndex({ volunteer_id: 1 });

    // Programs indexes
    await database.collection('programs').createIndex({ status: 1 });
    await database.collection('programs').createIndex({ created_at: -1 });

    // Applications indexes
    await database.collection('applications').createIndex({ volunteer_user_id: 1 });
    await database.collection('applications').createIndex({ posting_id: 1 });
    await database.collection('applications').createIndex({ status: 1 });
    await database.collection('applications').createIndex({ applied_at: -1 });
    
    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  }
};

export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return db;
};

export const closeConnection = async () => {
  if (client) {
    await client.close();
    db = null;
    client = null;
    console.log('✅ MongoDB connection closed');
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT, closing MongoDB connection...');
  await closeConnection();
  process.exit(0);
});
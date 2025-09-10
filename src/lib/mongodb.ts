import { MongoClient, Db, Collection } from 'mongodb';

const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || 'mongodb+srv://Mrityunjay-mauka:Bhi2076@mauka.gmcrozn.mongodb.net/?retryWrites=true&w=majority&appName=MAUKA';
const DB_NAME = 'MAUKA';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToMongoDB(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    
    // Ensure indexes exist
    await ensureIndexes(db);
    
    console.log('✅ Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

async function ensureIndexes(database: Db) {
  try {
    // User profiles with geospatial index
    await database.collection('user_profiles').createIndex({ location: '2dsphere' });
    await database.collection('user_profiles').createIndex({ user_id: 1 });
    await database.collection('user_profiles').createIndex({ user_type: 1 });
    await database.collection('user_profiles').createIndex({ verified: 1 });

    // NGO postings with geospatial index
    await database.collection('ngo_postings').createIndex({ location: '2dsphere' });
    await database.collection('ngo_postings').createIndex({ ngo_user_id: 1 });
    await database.collection('ngo_postings').createIndex({ status: 1 });
    await database.collection('ngo_postings').createIndex({ tags: 1 });

    // Vector search index for AI matching
    await database.collection('user_profiles').createIndex({ embedding: 1 });

    console.log('✅ MongoDB indexes ensured');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  }
}

export async function getCollection(collectionName: string): Promise<Collection> {
  const database = await connectToMongoDB();
  return database.collection(collectionName);
}

export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('✅ MongoDB connection closed');
  }
}

// Graceful shutdown
if (typeof window === 'undefined') {
  process.on('SIGINT', async () => {
    await closeConnection();
    process.exit(0);
  });
}
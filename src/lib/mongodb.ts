import { MongoClient, ServerApiVersion, MongoClientOptions } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 120000, // 2 minutes
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 60000,
  connectTimeoutMS: 30000,
  serverApi: ServerApiVersion.v1,
  retryWrites: true,
  w: 'majority'
};

// Use a cached connection pattern
let cachedClient: MongoClient | null = null;
let cachedClientPromise: Promise<MongoClient> | null = null;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

async function connectToDatabase(): Promise<MongoClient> {
  // If we have a cached client and it's connected, return it
  if (cachedClient) {
    return cachedClient;
  }

  // If we have a cached promise, return it
  if (cachedClientPromise) {
    try {
      cachedClient = await cachedClientPromise;
      return cachedClient;
    } catch (e) {
      // If the cached promise rejects, clear it and try again
      console.error('MongoDB connection error:', e);
      cachedClientPromise = null;
    }
  }

  // Create a new client and connect
  const client = new MongoClient(uri, options);
  
  // Create a new promise
  cachedClientPromise = client.connect()
    .then(client => {
      console.log('New MongoDB connection established');
      
      // Set up event listeners
      client.on('error', (err) => {
        console.error('MongoDB client error:', err);
        // Reset cache on error
        cachedClient = null;
        cachedClientPromise = null;
      });
      
      client.on('close', () => {
        console.log('MongoDB connection closed');
        // Reset cache when connection closes
        cachedClient = null;
        cachedClientPromise = null;
      });
      
      // Cache the connected client
      cachedClient = client;
      return client;
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      // Reset cache on connection error
      cachedClientPromise = null;
      throw err;
    });

  return cachedClientPromise;
}

// For Next.js development mode with HMR
const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>
};

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = connectToDatabase();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  clientPromise = connectToDatabase();
}

export default clientPromise;
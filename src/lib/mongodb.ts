import { MongoClient, ServerApiVersion } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 5, // Reduced from 10 to prevent connection overload
  minPoolSize: 1, // Ensure at least one connection is maintained
  maxIdleTimeMS: 15000, // Close idle connections after 15 seconds
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 30000, // Reduced from 45000
  connectTimeoutMS: 10000,
  serverApi: ServerApiVersion.v1,
  retryWrites: true,
  w: 1, // Changed from string to number
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect()
      .catch(err => {
        console.error('MongoDB connection error:', err);
        throw err;
      });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect()
    .catch(err => {
      console.error('MongoDB connection error:', err);
      throw err;
    });
}

// Add connection monitoring
client?.on('connectionPoolCreated', () => {
  console.log('Connection pool created');
});

client?.on('connectionPoolClosed', () => {
  console.log('Connection pool closed');
});

client?.on('timeout', () => {
  console.log('MongoDB operation timeout');
});

export default clientPromise;
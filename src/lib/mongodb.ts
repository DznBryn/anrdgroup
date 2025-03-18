import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {
  // Add these options to fix TLS issues
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  // Use a more recent TLS version
  tlsCAFile: undefined,
  connectTimeoutMS: 10000,
  // Force the driver to use a newer TLS version
  minPoolSize: 1,
  maxPoolSize: 10
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

try {
  if (process.env.NODE_ENV === 'development') {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} catch (error) {
  console.error('MongoDB connection error:', error);
  throw new Error('Failed to connect to MongoDB');
}

export default clientPromise;
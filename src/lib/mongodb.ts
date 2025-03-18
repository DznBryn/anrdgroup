import { MongoClient, ServerApiVersion, MongoClientOptions } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  maxPoolSize: 3, // Reduce from 5 to 3
  minPoolSize: 1,
  maxIdleTimeMS: 10000, // Reduce idle time to 10 seconds
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 20000,
  connectTimeoutMS: 10000,
  serverApi: ServerApiVersion.v1,
  retryWrites: true,
  w: 'majority',
  monitorCommands: true,
  directConnection: false,
  heartbeatFrequencyMS: 10000
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

// Add connection pool monitoring
client?.on('connectionPoolCreated', (event) => {
  console.log('Connection pool created with size:', event.options.maxPoolSize);
});

client?.on('connectionCreated', (event) => {
  console.log('New connection created, current connections:', event.connectionId);
});

client?.on('connectionClosed', (event) => {
  console.log('Connection closed:', event.connectionId);
});

export default clientPromise;
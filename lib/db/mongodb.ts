import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
  hasAttempted: boolean;
  isConnected: boolean;
}

declare global {
  var __mongooseCache: MongooseCache | undefined;
}

// Cache on the global in every environment so warm serverless invocations reuse the connection
const cached: MongooseCache = (global.__mongooseCache ??= {
  conn: null,
  promise: null,
  hasAttempted: false,
  isConnected: false,
});

// Minimum delay between reconnection attempts after a failure, so a down cluster
// doesn't add the selection timeout to every request
const RETRY_COOLDOWN_MS = 10_000;
let lastFailureAt = 0;

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    if (!cached.hasAttempted) {
      console.log('⚡ No MONGODB_URI provided in environment. Operating in zero-setup memory-fallback mode.');
      cached.hasAttempted = true;
    }
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (Date.now() - lastFailureAt < RETRY_COOLDOWN_MS) return null;

    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2500, // Quick timeout to fallback smoothly
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        cached.isConnected = true;
        console.log('✅ Connected to MongoDB Atlas/Cluster successfully.');
        return m;
      })
      .catch((err) => {
        console.warn('⚠️ MongoDB connection attempt failed. Falling back to robust memory repository store.', err.message);
        cached.isConnected = false;
        lastFailureAt = Date.now();
        // Clear the failed attempt so the next request retries instead of reusing it forever
        cached.promise = null;
        return null;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export function isDatabaseConnected(): boolean {
  return cached.isConnected && mongoose.connection.readyState === 1;
}

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  hasAttempted: boolean;
  isConnected: boolean;
}

declare global {
  var __mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.__mongooseCache || {
  conn: null,
  promise: null,
  hasAttempted: false,
  isConnected: false,
};

if (process.env.NODE_ENV !== 'production') {
  global.__mongooseCache = cached;
}

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
        return null as any;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.conn = null;
    return null;
  }
}

export function isDatabaseConnected(): boolean {
  return cached.isConnected && mongoose.connection.readyState === 1;
}

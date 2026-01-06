import mongoose from "mongoose";

const MONGO_DB_URL = process.env.MONGO_DB_URL as string;

if (!MONGO_DB_URL) {
  throw new Error("Please define the MONGO_DB_URL environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_DB_URL)
      .then((conn) => conn.connection);
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    console.error("Failed to connect to MongoDB:", e);
  }
}

export default connectDB;

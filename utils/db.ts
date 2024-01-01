import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("No MongoDB URI specified");
}

const uri = process.env.MONGODB_URI;

export async function dbConnect(): Promise<typeof mongoose> {
  try {
    const db = await mongoose.connect(uri, {
      autoIndex: true,
      maxPoolSize: 10, // Example max pool size
      minPoolSize: 5, // Example min pool size
      socketTimeoutMS: 5000,
      family: 4, // Connect using IPv4
      authSource: "admin", // Specify the authentication database
      serverSelectionTimeoutMS: 30000, // Example server selection timeout
      heartbeatFrequencyMS: 10000, // Example heartbeat frequency
    });

    console.log("CONNECTED TO DATABASE");

    return db;
  } catch (err) {
    throw new Error(`Failed to connect to database: ${err}`);
  }
}

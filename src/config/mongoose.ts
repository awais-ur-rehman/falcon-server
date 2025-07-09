import mongoose, { ConnectOptions } from "mongoose";
import vars from "./vars.js";

// Set mongoose Promise to Bluebird
(mongoose as any).Promise = Promise;

const mongo = vars.mongo;
const env = vars.env;

/**
 * MongoDB connection options
 */
const mongooseOptions: ConnectOptions = {
  autoIndex: true,
  dbName: "IAE-Platform", // Specify your database name here
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  maxPoolSize: 10, // Maintain up to 10 socket connections
};

// Exit application on error
mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// Log when connection is established
mongoose.connection.once("connected", () => {
  const dbName = mongoose.connection.db?.databaseName || "unknown";
  console.log(`MongoDB connected to ${dbName}`);
});

// Handle disconnection
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

// Handle process termination
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed through app termination");
    process.exit(0);
  } catch (err) {
    console.error("Error during MongoDB connection closure:", err);
    process.exit(1);
  }
});

// Print mongoose logs in dev env
if (env === "development") {
  mongoose.set("debug", true);
}

/**
 * Initialize database and create if it doesn't exist
 */
async function initializeDatabase(): Promise<void> {
  try {
    // Wait for connection to be established
    if (!mongoose.connection.db) {
      throw new Error("Database connection not established");
    }

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    // If no collections exist, create initial ones
    if (collections.length === 0) {
      console.log("Initializing database with default collections...");

      // Create your initial collections here
      await db.createCollection("users");
      await db.createCollection("modules");
      await db.createCollection("roles");
      await db.createCollection("onboardingdatas");

      console.log("Database initialized successfully!");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

/**
 * Connect to MongoDB
 *
 * @returns {Promise<typeof mongoose>} Mongoose instance
 */
export const connect = async (): Promise<typeof mongoose> => {
  try {
    await mongoose.connect(mongo.uri, mongooseOptions);
    await initializeDatabase();
    return mongoose;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(-1);
  }
};

// Export the mongoose instance if needed elsewhere
export default mongoose;
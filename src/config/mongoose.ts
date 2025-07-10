import mongoose, { ConnectOptions } from "mongoose";
import vars from "./vars.js";

(mongoose as any).Promise = Promise;

const mongo = vars.mongo;
const env = vars.env;

const mongooseOptions: ConnectOptions = {
  autoIndex: true,
  dbName: "falcon",
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  maxPoolSize: 10,
};

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

mongoose.connection.once("connected", () => {
  const dbName = mongoose.connection.db?.databaseName || "unknown";
  console.log(`MongoDB connected to ${dbName}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

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

if (env === "development") {
  mongoose.set("debug", true);
}

async function initializeDatabase(): Promise<void> {
  try {
    if (!mongoose.connection.db) {
      throw new Error("Database connection not established");
    }

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    if (collections.length === 0) {
      console.log("Initializing database with default collections...");
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

export default mongoose;
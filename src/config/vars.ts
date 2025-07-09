import * as path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

interface MongoConfig {
  uri: string;
}

interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

interface GoogleConfig {
  sheetsId: string;
  serviceAccountEmail: string;
  privateKey: string;
}

interface Vars {
  env: string;
  port: string;
  jwtSecret: string;
  jwtExpirationInterval: string;
  mongo: MongoConfig;
  logs: string;
  cloudinary: CloudinaryConfig;
  google: GoogleConfig;
}

const vars: Vars = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || "3001",
  jwtSecret: process.env.JWT_SECRET || "7FKR3ZVTOLgwvL03XseIJJ7fnOkjfOSzA2XaCPy9w6g=",
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES || "1440",
  mongo: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/iae-platform",
  },
  logs: process.env.NODE_ENV === "production" ? "combined" : "dev",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
  google: {
    sheetsId: process.env.GOOGLE_SHEETS_ID || "",
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "",
    privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
  },
};

export default vars;
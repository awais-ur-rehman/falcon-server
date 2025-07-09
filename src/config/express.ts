import express from "express";
import morgan from "morgan";
import compress from "compression";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

import routes from "../api/routes/v1/index.js";
import vars from "./vars.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadsPath = join(__dirname, "..", "..", "uploads");

const logs = vars.logs;
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://localhost:5174",
];

const app: express.Application = express();

app.use(morgan(logs));
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.set("trust proxy", 1);

app.use(express.json({ 
  limit: '10mb',
  type: 'application/json'
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
  if (error instanceof SyntaxError && 'body' in error) {
    console.error('JSON Parse Error:', error.message);
    res.status(400).json({ 
      success: false, 
      error: 'Invalid JSON format in request body' 
    });
    return;
  }
  next(error);
});

app.use(compress());
app.use(methodOverride());
app.use("/uploads", express.static(uploadsPath));

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/v1", routes);

export default app;
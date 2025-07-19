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
  "http://localhost:8080",
  "http://localhost:8081",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:8080",
];

const app: express.Application = express();

app.use(morgan(logs));
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }

      // In development, allow all origins
      if (process.env.NODE_ENV === "development") {
        return callback(null, true);
      }

      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
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
import express from "express";
import { createServer } from "http";
import { connect } from "./config/mongoose.js";
import app from "./config/express.js";
import { errorHandler } from "./api/middleware/error.middleware.js";
import { initializeDefaultData } from './api/services/app/appInitializer.js';

// --- Swagger setup ---
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Falcon API",
    version: "1.0.0",
    description: "API documentation for Falcon project",
  },
  servers: [
    {
      url: "http://localhost:3001/api/v1",
    },
  ],
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ["./src/api/routes/v1/*.ts"], // adjust if using .js
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// --- End Swagger setup ---

connect();

const server = createServer(app);

app.use(errorHandler);

initializeDefaultData();

const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`Swagger docs: http://localhost:${port}/api-docs`);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Shutting down gracefully...");
  process.exit(0);
});

export default app;
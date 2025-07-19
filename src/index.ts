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
    description: "Access Control and Management API for Falcon Platform",
    contact: {
      name: "API Support",
      email: "support@falcon.com"
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT"
    }
  },
  servers: [
    {
      url: "http://localhost:3001/v1",
      description: "Development server"
    },
    {
      url: "https://api.falcon.com/v1",
      description: "Production server"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token in the format: Bearer <token>"
      }
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false
          },
          error: {
            type: "string",
            example: "Error message"
          }
        }
      },
      Success: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true
          },
          data: {
            type: "object"
          },
          message: {
            type: "string"
          }
        }
      },
      Pagination: {
        type: "object",
        properties: {
          page: {
            type: "integer",
            example: 1
          },
          limit: {
            type: "integer",
            example: 20
          },
          total: {
            type: "integer",
            example: 100
          },
          totalPages: {
            type: "integer",
            example: 5
          }
        }
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ["./src/api/routes/v1/*.ts"], // adjust if using .js
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Falcon API Documentation",
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
  }
}));
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
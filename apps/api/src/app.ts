import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { rateLimiter } from "./middleware/rateLimit";
import logger from "./utils/logger";
import { env } from "./config/env";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS
    this.app.use(
      cors({
        origin: env.FRONTEND_URL,
        credentials: true,
      }),
    );

    // Rate limiting
    this.app.use("/api/", rateLimiter);

    // Body parsing
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Compression
    this.app.use(compression());

    // Logging
    this.app.use(morgan("combined", { stream: logger.stream as any }));

    // Health check endpoint
    this.app.get("/health", (_req, res) => {
      res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use("/api/v1", routes);

    // 404 handler
    this.app.use("*", (_req, res) => {
      res.status(404).json({
        success: false,
        error: "Route not found",
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }
}

export default App;

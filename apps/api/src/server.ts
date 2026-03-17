import App from './app';
import connectDB from './config/database';
import { env } from './config/env';
import logger from './utils/logger';
import { startDbKeepAlive, stopDbKeepAlive } from './utils/dbKeepAlive';

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Initialize app
const app = new App().app;

// Start server (listen first so /health is reachable even if DB is slow or down)
const startServer = async () => {
  try {
    // Listen immediately so health check and tools can reach the app
    const server = app.listen(env.PORT, '0.0.0.0', () => {
      logger.info(`Server running on http://0.0.0.0:${env.PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
      logger.info(`Health: http://localhost:${env.PORT}/health`);
    });

    // Connect DB after listen (non-blocking; API routes will fail until connected)
    connectDB()
      .then(() => {
        // Start keep-alive scheduler once DB is up (prevents Atlas free-tier pause)
        startDbKeepAlive();
      })
      .catch((err) => {
        logger.error('MongoDB connection failed:', err);
      });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: Error) => {
      logger.error('Unhandled Rejection:', reason);
      server.close(() => {
        process.exit(1);
      });
    });

    // Graceful shutdown
    const shutdown = (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully...`);
      stopDbKeepAlive();
      server.close(() => {
        logger.info('Process terminated');
      });
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

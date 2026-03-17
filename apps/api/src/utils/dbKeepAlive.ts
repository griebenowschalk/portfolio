import mongoose from 'mongoose';
import logger from './logger';

// How often to ping MongoDB (default: every 24 hours).
// Free-tier MongoDB Atlas pauses after 60 days of inactivity, but providers like
// Render/Railway also sleep containers — regular DB activity prevents both issues.
const PING_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

let intervalHandle: ReturnType<typeof setInterval> | null = null;

async function pingDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 1) {
    logger.debug('dbKeepAlive: skipping ping — DB not connected');
    return;
  }

  try {
    // Lightweight admin ping — does not scan any collection
    await mongoose.connection.db?.admin().ping();
    logger.debug('dbKeepAlive: ping ok');
  } catch (err) {
    logger.warn('dbKeepAlive: ping failed', err);
  }
}

/**
 * Start the keep-alive scheduler.
 * Call once after the DB connection is established.
 */
export function startDbKeepAlive(intervalMs = PING_INTERVAL_MS): void {
  if (intervalHandle) return; // already running

  // Fire once after the interval, then repeat
  intervalHandle = setInterval(() => {
    pingDatabase().catch(() => {}); // swallow — logged inside
  }, intervalMs);

  // Allow the Node process to exit even if this timer is active
  if (intervalHandle.unref) intervalHandle.unref();

  logger.info(
    `dbKeepAlive: scheduler started — pinging every ${intervalMs / 3_600_000}h`
  );
}

/**
 * Stop the keep-alive scheduler (useful in tests / graceful shutdown).
 */
export function stopDbKeepAlive(): void {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
    logger.info('dbKeepAlive: scheduler stopped');
  }
}

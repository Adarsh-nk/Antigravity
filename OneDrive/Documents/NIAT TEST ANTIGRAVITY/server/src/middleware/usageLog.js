import { logger } from '../lib/logger.js';

export function logApiUsage(req, res, next) {
  const start = Date.now();

  res.on('finish', async () => {
    const latencyMs = Date.now() - start;
    const statusCode = res.statusCode;
    const endpoint = req.originalUrl || req.url;

    // Asynchronously log to DB if authenticated
    if (req.user && req.db) {
      req.db
        .from('api_usage_logs')
        .insert({
          user_id: req.user.id,
          endpoint,
          status_code: statusCode,
          latency_ms: latencyMs,
        })
        .then(({ error }) => {
          if (error) logger.warn({ err: error }, 'Failed to insert api_usage_log entry');
        })
        .catch((err) => logger.warn({ err }, 'Error inserting api_usage_log entry'));
    }
  });

  next();
}

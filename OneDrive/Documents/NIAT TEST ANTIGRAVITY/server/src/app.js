import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import pinoHttp from 'pino-http';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { generalLimiter } from './middleware/rateLimit.js';
import { logApiUsage } from './middleware/usageLog.js';
import { errorHandler } from './middleware/errorHandler.js';
import { AppError } from './lib/errors.js';
import routes from './routes/index.js';

const app = express();

if (env.TRUST_PROXY !== '0') {
  app.set('trust proxy', env.TRUST_PROXY);
}

app.use(helmet());

const allowedOrigins = env.CORS_ORIGINS.split(',').map((o) => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV === 'test') {
        callback(null, true);
      } else {
        callback(new Error('CORS request blocked by server policy'));
      }
    },
    credentials: true,
  })
);

app.use(compression());

app.use(
  pinoHttp({
    logger,
    autoLogging: {
      ignore: (req) => req.url === '/api/health',
    },
  })
);

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

app.use(generalLimiter);
app.use(logApiUsage);

// API routes mounted at /api
app.use('/api', routes);

// 404 Handler
app.use((req, res, next) => {
  next(new AppError('NOT_FOUND', `Route ${req.method} ${req.originalUrl} not found`, 404));
});

// Central Error Handler
app.use(errorHandler);

export default app;

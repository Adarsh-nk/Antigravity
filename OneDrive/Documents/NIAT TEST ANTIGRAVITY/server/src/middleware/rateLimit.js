import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { AppError } from '../lib/errors.js';

const rateLimitHandler = (message) => (req, res, next, options) => {
  next(new AppError('RATE_LIMITED', message, 429));
};

export const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_GENERAL_WINDOW_MS,
  max: env.RATE_LIMIT_GENERAL_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many requests, please try again later.'),
});

export const aiAdvisoryLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_AI_WINDOW_MS,
  max: env.RATE_LIMIT_AI_MAX,
  keyGenerator: (req) => (req.user ? req.user.id : req.ip),
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Advisory generation limit reached (10 per hour). Please try again later.'),
});

export const aiChatLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_CHAT_WINDOW_MS,
  max: env.RATE_LIMIT_CHAT_MAX,
  keyGenerator: (req) => (req.user ? req.user.id : req.ip),
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Chat message limit reached (60 per hour). Please try again later.'),
});

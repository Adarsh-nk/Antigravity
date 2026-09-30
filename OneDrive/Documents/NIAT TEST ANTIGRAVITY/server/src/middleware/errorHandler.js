import multer from 'multer';
import { AppError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import { env } from '../config/env.js';

export function errorHandler(err, req, res, _next) {
  let statusCode = 500;
  let errorCode = 'INTERNAL_ERROR';
  let message = 'An internal server error occurred';
  let details = null;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorCode = err.code;
    message = err.message;
    details = err.details;
  } else if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      statusCode = 413;
      errorCode = 'PAYLOAD_TOO_LARGE';
      message = 'Image size exceeds the maximum allowed limit of 4 MB';
    } else {
      statusCode = 400;
      errorCode = 'VALIDATION_ERROR';
      message = err.message;
    }
  } else if (err.status || err.statusCode) {
    statusCode = err.status || err.statusCode;
    message = err.message;
  }

  const requestId = req.id || req.headers['x-request-id'] || Math.random().toString(36).substring(2, 10);

  logger.error(
    {
      requestId,
      err,
      url: req.originalUrl,
      method: req.method,
      user: req.user?.id,
    },
    `[${errorCode}] ${message}`
  );

  const responseError = {
    code: errorCode,
    message: env.NODE_ENV === 'production' && statusCode === 500 ? 'An unexpected error occurred. Please try again later.' : message,
    details: details || undefined,
    requestId: env.NODE_ENV === 'production' ? requestId : undefined,
  };

  res.status(statusCode).json({
    success: false,
    error: responseError,
  });
}

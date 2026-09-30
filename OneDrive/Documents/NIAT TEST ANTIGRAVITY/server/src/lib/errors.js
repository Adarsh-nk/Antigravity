export class AppError extends Error {
  constructor(code, message, statusCode = 500, details = null) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const ERROR_CODES = {
  VALIDATION_ERROR: { code: 'VALIDATION_ERROR', statusCode: 400 },
  UNAUTHORIZED: { code: 'UNAUTHORIZED', statusCode: 401 },
  NOT_FOUND: { code: 'NOT_FOUND', statusCode: 404 },
  PAYLOAD_TOO_LARGE: { code: 'PAYLOAD_TOO_LARGE', statusCode: 413 },
  UNSUPPORTED_MEDIA_TYPE: { code: 'UNSUPPORTED_MEDIA_TYPE', statusCode: 415 },
  RATE_LIMITED: { code: 'RATE_LIMITED', statusCode: 429 },
  AI_UNAVAILABLE: { code: 'AI_UNAVAILABLE', statusCode: 502 },
  AI_INVALID_RESPONSE: { code: 'AI_INVALID_RESPONSE', statusCode: 502 },
  AI_TIMEOUT: { code: 'AI_TIMEOUT', statusCode: 504 },
  INTERNAL_ERROR: { code: 'INTERNAL_ERROR', statusCode: 500 },
};

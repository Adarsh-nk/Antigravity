import { AppError } from '../lib/errors.js';

export function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const result = schema.safeParse(dataToValidate);

      if (!result.success) {
        const details = result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));
        throw new AppError('VALIDATION_ERROR', 'Validation failed for request data', 400, details);
      }

      req[source] = result.data;
      next();
    } catch (err) {
      next(err);
    }
  };
}

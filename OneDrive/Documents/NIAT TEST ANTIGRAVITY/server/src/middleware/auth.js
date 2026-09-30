import { AppError } from '../lib/errors.js';
import { createAnonClient, createUserClient } from '../lib/supabase.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('UNAUTHORIZED', 'Authentication token required', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError('UNAUTHORIZED', 'Malformed authorization token', 401);
    }

    const anonClient = createAnonClient();
    const { data: { user }, error } = await anonClient.auth.getUser(token);

    if (error || !user) {
      throw new AppError('UNAUTHORIZED', 'Invalid or expired authentication token', 401);
    }

    req.user = user;
    req.token = token;
    req.db = createUserClient(token);

    next();
  } catch (err) {
    next(err);
  }
}

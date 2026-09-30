import { z } from 'zod';
import { ADVISORY_TYPES, LANGUAGES } from '../config/domain.js';

export const commonAdvisorySchema = z.object({
  farm_id: z.string().uuid('Invalid farm ID'),
  language: z.enum(LANGUAGES).default('en'),
  additional_notes: z.string().trim().max(1000, 'Additional notes cannot exceed 1000 characters').optional().default(''),
});

export const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid parameter ID'),
});

export const listQuerySchema = z.object({
  type: z.enum(ADVISORY_TYPES).optional(),
  q: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
});

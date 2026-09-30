import { z } from 'zod';
import { LANGUAGES } from '../config/domain.js';

export const profileUpdateSchema = z
  .object({
    full_name: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100, 'Full name cannot exceed 100 characters'),
    preferred_language: z.enum(LANGUAGES).default('en'),
    state: z.string().trim().max(60).optional().nullable(),
    district: z.string().trim().max(60).optional().nullable(),
    village_or_town: z.string().trim().max(80).optional().nullable(),
    primary_crops: z
      .array(z.string().trim().max(60, 'Crop name cannot exceed 60 characters'))
      .max(10, 'Cannot specify more than 10 primary crops')
      .default([]),
  })
  .strict();

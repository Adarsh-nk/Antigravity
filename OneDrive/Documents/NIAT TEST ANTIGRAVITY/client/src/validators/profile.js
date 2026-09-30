import { z } from 'zod';
import { LANGUAGES } from '../config/domain.js';

export const profileFormSchema = z.object({
  full_name: z.string().trim().min(2, 'Full name required').max(100),
  preferred_language: z.enum(LANGUAGES).default('en'),
  state: z.string().trim().max(60).optional().or(z.literal('')),
  district: z.string().trim().max(60).optional().or(z.literal('')),
  village_or_town: z.string().trim().max(80).optional().or(z.literal('')),
  primary_crops: z.array(z.string()).default([]),
});

import { z } from 'zod';
import {
  SOIL_TYPES,
  IRRIGATION_SOURCES,
  LAND_UNITS,
  INDIAN_STATES,
} from '../config/domain.js';

export const farmFormSchema = z.object({
  name: z.string().trim().min(2, 'Farm name must be at least 2 characters').max(80, 'Max 80 characters'),
  area: z.coerce.number({ invalid_type_error: 'Enter a valid area number' }).positive('Area must be greater than 0').max(100000, 'Max 100,000'),
  area_unit: z.enum(LAND_UNITS).default('acre'),
  state: z.string().trim().refine((val) => INDIAN_STATES.includes(val), {
    message: 'Select a valid Indian state',
  }),
  district: z.string().trim().min(2, 'District required').max(60),
  soil_type: z.enum(SOIL_TYPES, { errorMap: () => ({ message: 'Select soil type' }) }),
  irrigation_source: z.enum(IRRIGATION_SOURCES, { errorMap: () => ({ message: 'Select irrigation source' }) }),

  soil_ph: z.coerce.number().min(3).max(10).optional().or(z.literal('')),
  soil_nitrogen_kg_ha: z.coerce.number().min(0).optional().or(z.literal('')),
  soil_phosphorus_kg_ha: z.coerce.number().min(0).optional().or(z.literal('')),
  soil_potassium_kg_ha: z.coerce.number().min(0).optional().or(z.literal('')),
  soil_organic_carbon_percent: z.coerce.number().min(0).max(20).optional().or(z.literal('')),
  soil_ec_ds_m: z.coerce.number().min(0).optional().or(z.literal('')),
  soil_test_date: z.string().optional().or(z.literal('')),
});

import { z } from 'zod';
import {
  SOIL_TYPES,
  IRRIGATION_SOURCES,
  LAND_UNITS,
  INDIAN_STATES,
} from '../config/domain.js';

export const farmSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80, 'Name cannot exceed 80 characters'),
    area: z.coerce.number().positive('Area must be greater than 0').max(100000, 'Area cannot exceed 100,000'),
    area_unit: z.enum(LAND_UNITS).default('acre'),
    state: z.string().trim().refine((val) => INDIAN_STATES.includes(val), {
      message: 'State must be a valid Indian state or UT',
    }),
    district: z.string().trim().min(2, 'District must be at least 2 characters').max(60, 'District cannot exceed 60 characters'),
    soil_type: z.enum(SOIL_TYPES),
    irrigation_source: z.enum(IRRIGATION_SOURCES),

    soil_ph: z.coerce.number().min(3, 'pH must be between 3 and 10').max(10, 'pH must be between 3 and 10').optional().nullable(),
    soil_nitrogen_kg_ha: z.coerce.number().min(0, 'Nitrogen must be non-negative').optional().nullable(),
    soil_phosphorus_kg_ha: z.coerce.number().min(0, 'Phosphorus must be non-negative').optional().nullable(),
    soil_potassium_kg_ha: z.coerce.number().min(0, 'Potassium must be non-negative').optional().nullable(),
    soil_organic_carbon_percent: z.coerce
      .number()
      .min(0, 'Organic carbon must be between 0 and 20%')
      .max(20, 'Organic carbon must be between 0 and 20%')
      .optional()
      .nullable(),
    soil_ec_ds_m: z.coerce.number().min(0, 'EC must be non-negative').optional().nullable(),
    soil_test_date: z
      .string()
      .optional()
      .nullable()
      .refine(
        (val) => {
          if (!val) return true;
          const date = new Date(val);
          return !isNaN(date.getTime()) && date <= new Date();
        },
        { message: 'Soil test date cannot be in the future' }
      ),
  })
  .strict();

import { z } from 'zod';
import {
  SEASONS,
  WATER_AVAILABILITY,
  FARMING_PREFERENCES,
  BUDGET_LEVELS,
  GROWTH_STAGES,
  SYMPTOM_CATEGORIES,
  RECENT_WEATHER_OPTIONS,
  GOALS_OPTIONS,
  LANGUAGES,
} from '../config/domain.js';

const commonBase = z.object({
  farm_id: z.string().uuid('Invalid farm ID'),
  language: z.enum(LANGUAGES).default('en'),
  additional_notes: z.string().trim().max(1000, 'Additional notes cannot exceed 1000 characters').optional().default(''),
});

export const cropRecommendationInputSchema = commonBase.extend({
  advisory_type: z.literal('crop_recommendation'),
  season: z.enum(SEASONS),
  sowing_month: z.coerce.number().int().min(1).max(12).optional().nullable(),
  water_availability: z.enum(WATER_AVAILABILITY),
  farming_preference: z.enum(FARMING_PREFERENCES).default('conventional'),
  budget_level: z.enum(BUDGET_LEVELS).default('medium'),
  previous_crop: z.string().trim().max(60).optional().nullable(),
  goals: z.array(z.enum(GOALS_OPTIONS)).min(1, 'Select at least 1 goal').max(3, 'Select up to 3 goals'),
}).strict();

export const diseaseDiagnosisInputSchema = commonBase.extend({
  advisory_type: z.literal('disease_diagnosis'),
  crop: z.string().trim().min(1, 'Crop is required').max(60),
  growth_stage: z.enum(GROWTH_STAGES),
  symptoms: z.array(z.enum(SYMPTOM_CATEGORIES)).min(1, 'Select at least 1 symptom').max(6, 'Select up to 6 symptoms'),
  symptom_description: z.string().trim().min(10, 'Symptom description must be at least 10 characters').max(1000),
  days_since_first_noticed: z.coerce.number().int().min(0).max(365).optional().nullable(),
  affected_area_percent: z.coerce.number().min(0).max(100),
  recent_weather: z.enum(RECENT_WEATHER_OPTIONS).optional().nullable(),
  recent_sprays: z.string().trim().max(500).optional().nullable(),
}).strict();

export const fertilizerIrrigationInputSchema = commonBase.extend({
  advisory_type: z.literal('fertilizer_irrigation'),
  crop: z.string().trim().min(1, 'Crop is required').max(60),
  growth_stage: z.enum(GROWTH_STAGES),
  sowing_date: z.string().optional().nullable().refine(
    (val) => {
      if (!val) return true;
      const date = new Date(val);
      if (isNaN(date.getTime())) return false;
      const now = new Date();
      const pastLimit = new Date();
      pastLimit.setDate(now.getDate() - 400);
      const futureLimit = new Date();
      futureLimit.setDate(now.getDate() + 60);
      return date >= pastLimit && date <= futureLimit;
    },
    { message: 'Sowing date must be within 400 days in the past and 60 days in the future' }
  ),
  soil_test_available: z.boolean().default(false),
  farming_preference: z.enum(FARMING_PREFERENCES).default('conventional'),
  water_availability: z.enum(WATER_AVAILABILITY),
}).strict();

export const pestManagementInputSchema = commonBase.extend({
  advisory_type: z.literal('pest_management'),
  crop: z.string().trim().min(1, 'Crop is required').max(60),
  growth_stage: z.enum(GROWTH_STAGES),
  pest_description: z.string().trim().min(10, 'Pest description must be at least 10 characters').max(1000),
  infestation_severity: z.enum(['mild', 'moderate', 'severe']),
  farming_preference: z.enum(FARMING_PREFERENCES).default('conventional'),
  pesticide_sprayer_experience: z.enum(['beginner', 'experienced']),
}).strict();

export const seasonalPlanInputSchema = commonBase.extend({
  advisory_type: z.literal('seasonal_plan'),
  crop: z.string().trim().min(1, 'Crop is required').max(60),
  season: z.enum(SEASONS),
  planned_sowing_date: z.string().min(1, 'Planned sowing date is required').refine(
    (val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) return false;
      const now = new Date();
      const pastLimit = new Date();
      pastLimit.setDate(now.getDate() - 30);
      const futureLimit = new Date();
      futureLimit.setDate(now.getDate() + 365);
      return date >= pastLimit && date <= futureLimit;
    },
    { message: 'Planned sowing date must be between 30 days ago and 365 days ahead' }
  ),
  water_availability: z.enum(WATER_AVAILABILITY),
  farming_preference: z.enum(FARMING_PREFERENCES).default('conventional'),
  budget_level: z.enum(BUDGET_LEVELS).default('medium'),
}).strict();

export const advisoryInputUnionSchema = z.discriminatedUnion('advisory_type', [
  cropRecommendationInputSchema,
  diseaseDiagnosisInputSchema,
  fertilizerIrrigationInputSchema,
  pestManagementInputSchema,
  seasonalPlanInputSchema,
]);

export const chatMessageSchema = z.object({
  message: z.string().trim().min(1, 'Message cannot be empty').max(1000, 'Message cannot exceed 1000 characters'),
}).strict();

export const feedbackSchema = z.object({
  rating: z.union([z.literal(1), z.literal(-1)]),
  comment: z.string().trim().max(1000, 'Comment cannot exceed 1000 characters').optional().nullable(),
}).strict();

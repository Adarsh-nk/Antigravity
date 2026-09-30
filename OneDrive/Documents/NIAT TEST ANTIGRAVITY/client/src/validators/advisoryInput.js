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
  farm_id: z.string().uuid('Please select a farm'),
  language: z.enum(LANGUAGES).default('en'),
  additional_notes: z.string().trim().max(1000, 'Max 1000 characters').optional().default(''),
});

export const clientCropRecommendationSchema = commonBase.extend({
  advisory_type: z.literal('crop_recommendation'),
  season: z.enum(SEASONS),
  sowing_month: z.coerce.number().min(1).max(12).optional().nullable(),
  water_availability: z.enum(WATER_AVAILABILITY),
  farming_preference: z.enum(FARMING_PREFERENCES).default('conventional'),
  budget_level: z.enum(BUDGET_LEVELS).default('medium'),
  previous_crop: z.string().trim().max(60).optional().nullable(),
  goals: z.array(z.enum(GOALS_OPTIONS)).min(1, 'Select at least 1 goal').max(3, 'Select up to 3 goals'),
});

export const clientDiseaseDiagnosisSchema = commonBase.extend({
  advisory_type: z.literal('disease_diagnosis'),
  crop: z.string().trim().min(1, 'Crop name is required').max(60),
  growth_stage: z.enum(GROWTH_STAGES),
  symptoms: z.array(z.enum(SYMPTOM_CATEGORIES)).min(1, 'Select at least 1 symptom').max(6, 'Select up to 6 symptoms'),
  symptom_description: z.string().trim().min(10, 'Description must be at least 10 characters').max(1000),
  days_since_first_noticed: z.coerce.number().min(0).max(365).optional().nullable(),
  affected_area_percent: z.coerce.number().min(0).max(100),
  recent_weather: z.enum(RECENT_WEATHER_OPTIONS).optional().nullable(),
  recent_sprays: z.string().trim().max(500).optional().nullable(),
});

export const clientFertilizerIrrigationSchema = commonBase.extend({
  advisory_type: z.literal('fertilizer_irrigation'),
  crop: z.string().trim().min(1, 'Crop name is required').max(60),
  growth_stage: z.enum(GROWTH_STAGES),
  sowing_date: z.string().optional().nullable(),
  soil_test_available: z.boolean().default(false),
  farming_preference: z.enum(FARMING_PREFERENCES).default('conventional'),
  water_availability: z.enum(WATER_AVAILABILITY),
});

export const clientPestManagementSchema = commonBase.extend({
  advisory_type: z.literal('pest_management'),
  crop: z.string().trim().min(1, 'Crop name is required').max(60),
  growth_stage: z.enum(GROWTH_STAGES),
  pest_description: z.string().trim().min(10, 'Pest description must be at least 10 characters').max(1000),
  infestation_severity: z.enum(['mild', 'moderate', 'severe']),
  farming_preference: z.enum(FARMING_PREFERENCES).default('conventional'),
  pesticide_sprayer_experience: z.enum(['beginner', 'experienced']),
});

export const clientSeasonalPlanSchema = commonBase.extend({
  advisory_type: z.literal('seasonal_plan'),
  crop: z.string().trim().min(1, 'Crop name is required').max(60),
  season: z.enum(SEASONS),
  planned_sowing_date: z.string().min(1, 'Planned sowing date is required'),
  water_availability: z.enum(WATER_AVAILABILITY),
  farming_preference: z.enum(FARMING_PREFERENCES).default('conventional'),
  budget_level: z.enum(BUDGET_LEVELS).default('medium'),
});

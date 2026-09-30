import { z } from 'zod';

export const envelopeSchema = z.object({
  title: z.string().min(1).max(160),
  summary: z.string().min(1),
  confidence: z.enum(['low', 'medium', 'high']),
  confidence_reason: z.string().default(''),
  key_actions: z.array(
    z.object({
      priority: z.number().int().min(1).max(6),
      action: z.string().min(1),
      timeframe: z.string().min(1),
    })
  ).min(1).max(6),
  warnings: z.array(z.string()).max(6).default([]),
  data_gaps: z.array(z.string()).max(6).default([]),
  escalate_to_expert: z.object({
    needed: z.boolean(),
    reason: z.string().default(''),
    who: z.string().default('Local agriculture officer or nearest KVK'),
  }),
});

// 15.2 Crop Recommendation Result Schema
export const cropRecommendationResultSchema = z.object({
  recommendations: z.array(
    z.object({
      rank: z.number().int().min(1).max(5),
      crop: z.string().min(1),
      suitability_score: z.number().min(0).max(100),
      why_suitable: z.string().min(1),
      sowing_window: z.string().min(1),
      duration_days: z.string().min(1),
      expected_yield_range: z.object({
        min: z.number(),
        max: z.number(),
        unit: z.string().min(1),
      }),
      water_requirement: z.enum(['low', 'medium', 'high']),
      input_cost_level: z.enum(['low', 'medium', 'high']),
      key_risks: z.array(z.string()).default([]),
      rotation_or_intercrop_note: z.string().default(''),
    })
  ).min(1).max(5),
  crops_to_avoid: z.array(
    z.object({
      crop: z.string().min(1),
      reason: z.string().min(1),
    })
  ).max(5).default([]),
  soil_improvement_notes: z.array(z.string()).max(5).default([]),
  market_guidance: z.string().default(''),
});

// 15.3 Disease Diagnosis Result Schema
export const diseaseDiagnosisResultSchema = z.object({
  image_observations: z.string().default(''),
  possible_conditions: z.array(
    z.object({
      name: z.string().min(1),
      category: z.enum([
        'fungal',
        'bacterial',
        'viral',
        'insect_pest',
        'mite',
        'nematode',
        'nutrient_deficiency',
        'abiotic_stress',
        'unknown',
      ]),
      likelihood: z.enum(['low', 'medium', 'high']),
      matching_symptoms: z.array(z.string()).default([]),
      distinguishing_checks: z.array(z.string()).default([]),
    })
  ).min(1).max(4),
  immediate_actions: z.array(z.string()).min(1).max(6),
  cultural_and_organic_controls: z.array(z.string()).max(6).default([]),
  chemical_options_last_resort: z.array(
    z.object({
      active_ingredient_or_class: z.string().min(1),
      target: z.string().default(''),
      when_to_consider: z.string().default(''),
      safety_note: z.string().default(''),
    })
  ).max(3).default([]),
  prevention: z.array(z.string()).max(6).default([]),
  monitoring_plan: z.string().default(''),
});

// 15.4 Fertilizer Irrigation Result Schema
export const fertilizerIrrigationResultSchema = z.object({
  soil_test_recommended: z.boolean().default(false),
  soil_test_note: z.string().default(''),
  nutrient_plan: z.array(
    z.object({
      stage: z.string().min(1),
      timing: z.string().min(1),
      nutrient_focus: z.string().min(1),
      organic_options: z.array(z.string()).default([]),
      mineral_options: z.array(z.string()).default([]),
      indicative_quantity_per_acre: z.string().default(''),
      application_method: z.string().default(''),
    })
  ).min(1).max(8),
  irrigation_schedule: z.array(
    z.object({
      stage: z.string().min(1),
      frequency: z.string().min(1),
      method: z.string().min(1),
      critical_stage: z.boolean().default(false),
      water_saving_tip: z.string().default(''),
    })
  ).min(1).max(8),
  micronutrient_notes: z.array(z.string()).max(5).default([]),
  mistakes_to_avoid: z.array(z.string()).max(6).default([]),
});

// 15.5 Pest Management Result Schema
export const pestManagementResultSchema = z.object({
  likely_pests: z.array(
    z.object({
      name: z.string().min(1),
      likelihood: z.enum(['low', 'medium', 'high']),
      damage_signs: z.array(z.string()).default([]),
    })
  ).min(1).max(4),
  scouting_guide: z.string().default(''),
  action_threshold_note: z.string().default(''),
  ipm_tiers: z.object({
    cultural: z.array(z.string()).default([]),
    mechanical: z.array(z.string()).default([]),
    biological: z.array(z.string()).default([]),
    chemical_last_resort: z.array(
      z.object({
        active_ingredient_or_class: z.string().min(1),
        when_to_consider: z.string().default(''),
        resistance_management_note: z.string().default(''),
      })
    ).default([]),
  }),
  beneficial_insects_to_protect: z.array(z.string()).default([]),
  safety_and_ppe: z.array(z.string()).min(3).default([]),
  pre_harvest_interval_note: z.string().default(''),
});

// 15.5 Seasonal Plan Result Schema
export const seasonalPlanResultSchema = z.object({
  total_duration_days: z.string().min(1),
  timeline: z.array(
    z.object({
      phase: z.string().min(1),
      week_range: z.string().min(1),
      approx_dates: z.string().default(''),
      tasks: z.array(z.string()).default([]),
      inputs_needed: z.array(z.string()).default([]),
      risks_to_watch: z.array(z.string()).default([]),
    })
  ).min(3).max(14),
  budget_outline: z.array(
    z.object({
      category: z.string().min(1),
      relative_cost: z.enum(['low', 'medium', 'high']),
      note: z.string().default(''),
    })
  ).default([]),
  harvest_indicators: z.array(z.string()).default([]),
  post_harvest_and_storage: z.array(z.string()).default([]),
  marketing_tips: z.array(z.string()).default([]),
});

export const advisoryOutputSchemas = {
  crop_recommendation: envelopeSchema.extend({ result: cropRecommendationResultSchema }),
  disease_diagnosis: envelopeSchema.extend({ result: diseaseDiagnosisResultSchema }),
  fertilizer_irrigation: envelopeSchema.extend({ result: fertilizerIrrigationResultSchema }),
  pest_management: envelopeSchema.extend({ result: pestManagementResultSchema }),
  seasonal_plan: envelopeSchema.extend({ result: seasonalPlanResultSchema }),
};

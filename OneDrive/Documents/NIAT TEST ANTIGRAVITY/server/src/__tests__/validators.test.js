import { describe, it, expect } from 'vitest';
import { farmSchema } from '../validators/farm.js';
import { profileUpdateSchema } from '../validators/profile.js';
import { cropRecommendationInputSchema } from '../validators/advisoryInput.js';

describe('Zod Server Validators', () => {
  it('validates a valid farm payload', () => {
    const validFarm = {
      name: 'Green Field Farm',
      area: 5.5,
      area_unit: 'acre',
      state: 'Maharashtra',
      district: 'Nashik',
      soil_type: 'black_cotton_regur',
      irrigation_source: 'borewell_tubewell',
      soil_ph: 6.8,
      soil_organic_carbon_percent: 0.75,
    };

    const result = farmSchema.safeParse(validFarm);
    expect(result.success).toBe(true);
  });

  it('rejects invalid farm area or negative soil values', () => {
    const invalidFarm = {
      name: 'Bad Farm',
      area: -2,
      area_unit: 'acre',
      state: 'Maharashtra',
      district: 'Nashik',
      soil_type: 'black_cotton_regur',
      irrigation_source: 'borewell_tubewell',
      soil_ph: 12, // out of range 3-10
    };

    const result = farmSchema.safeParse(invalidFarm);
    expect(result.success).toBe(false);
  });

  it('validates a valid profile update', () => {
    const profile = {
      full_name: 'Ramesh Patel',
      preferred_language: 'hi',
      state: 'Gujarat',
      district: 'Anand',
      village_or_town: 'Vithal Udyognagar',
      primary_crops: ['Cotton', 'Groundnut'],
    };

    const result = profileUpdateSchema.safeParse(profile);
    expect(result.success).toBe(true);
  });

  it('validates crop recommendation input', () => {
    const input = {
      farm_id: '123e4567-e89b-12d3-a456-426614174000',
      language: 'mr',
      advisory_type: 'crop_recommendation',
      season: 'kharif',
      water_availability: 'moderate',
      farming_preference: 'conventional',
      budget_level: 'medium',
      goals: ['max_profit'],
      additional_notes: 'Looking for fast growing crop',
    };

    const result = cropRecommendationInputSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
});

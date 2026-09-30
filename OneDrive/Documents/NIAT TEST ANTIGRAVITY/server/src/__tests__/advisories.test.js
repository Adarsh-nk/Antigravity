import { describe, it, expect, vi } from 'vitest';
import { generateAdvisoryPipeline } from '../services/advisory.service.js';

// Mock gemini service module
vi.mock('../services/gemini.service.js', () => ({
  generateStructured: async ({ userText }) => {
    return {
      text: JSON.stringify({
        title: 'Crop Recommendation Advisory',
        summary: 'Recommended crops for Kharif season in Nashik.',
        confidence: 'high',
        confidence_reason: 'Complete soil and water data provided.',
        key_actions: [
          { priority: 1, action: 'Prepare land by deep plowing', timeframe: 'Within 7 days' },
        ],
        warnings: [],
        data_gaps: [],
        escalate_to_expert: { needed: false, reason: '', who: 'Local KVK' },
        result: {
          recommendations: [
            {
              rank: 1,
              crop: 'Soybean',
              suitability_score: 92,
              why_suitable: 'Suits black cotton soil and moderate rainfall.',
              sowing_window: 'June 15 - July 10',
              duration_days: '95-105 days',
              expected_yield_range: { min: 8, max: 12, unit: 'quintal per acre' },
              water_requirement: 'medium',
              input_cost_level: 'low',
              key_risks: ['Stem fly attack during early stage'],
              rotation_or_intercrop_note: 'Intercrop with pigeon pea 4:2 ratio',
            },
          ],
          crops_to_avoid: [],
          soil_improvement_notes: ['Add FYM before sowing'],
          market_guidance: 'Check nearest APMC mandi prices on e-NAM portal.',
        },
      }),
      latencyMs: 1200,
      promptTokens: 450,
      outputTokens: 380,
    };
  },
}));

describe('Advisory Pipeline Orchestration with Mocked Gemini', () => {
  it('successfully generates structured crop recommendation output', async () => {
    const mockFarm = {
      name: 'Demonstration Farm',
      area: 4.0,
      area_unit: 'acre',
      state: 'Maharashtra',
      district: 'Nashik',
      soil_type: 'black_cotton_regur',
      irrigation_source: 'borewell_tubewell',
    };

    const mockInput = {
      farm_id: '123e4567-e89b-12d3-a456-426614174000',
      language: 'en',
      advisory_type: 'crop_recommendation',
      season: 'kharif',
      water_availability: 'moderate',
      farming_preference: 'conventional',
      budget_level: 'medium',
      goals: ['max_profit'],
      additional_notes: '',
    };

    const result = await generateAdvisoryPipeline({
      advisoryType: 'crop_recommendation',
      inputPayload: mockInput,
      farmSnapshot: mockFarm,
      language: 'en',
    });

    expect(result.title).toBe('Crop Recommendation Advisory');
    expect(result.confidence).toBe('high');
    expect(result.outputPayload.result.recommendations[0].crop).toBe('Soybean');
    expect(result.latencyMs).toBe(1200);
  });
});

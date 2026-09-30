import { describe, it, expect } from 'vitest';
import { postProcessAdvisoryOutput } from '../services/postprocess.service.js';

describe('Postprocessing Service Safety & Format Rules', () => {
  it('truncates titles exceeding 100 characters', () => {
    const longTitle = 'A'.repeat(120);
    const mockOutput = {
      title: longTitle,
      confidence: 'high',
      result: {},
    };

    const processed = postProcessAdvisoryOutput('crop_recommendation', mockOutput);
    expect(processed.title.length).toBeLessThanOrEqual(100);
    expect(processed.title.endsWith('...')).toBe(true);
  });

  it('enforces expert escalation for low confidence disease diagnosis', () => {
    const mockOutput = {
      title: 'Leaf Spot Diagnosis',
      confidence: 'low',
      confidence_reason: 'Image was blurry',
      escalate_to_expert: { needed: false, reason: '', who: '' },
      result: {},
    };

    const processed = postProcessAdvisoryOutput('disease_diagnosis', mockOutput);
    expect(processed.escalate_to_expert.needed).toBe(true);
    expect(processed.escalate_to_expert.who).toBe('Local agriculture officer or nearest KVK');
  });

  it('strips exact pesticide dosage numbers from chemical recommendations', () => {
    const mockOutput = {
      title: 'Pest Plan',
      confidence: 'medium',
      result: {
        chemical_options_last_resort: [
          {
            active_ingredient_or_class: 'Apply Mancozeb 250 g/acre or 2 ml/l water',
            target: 'Fungal leaf blight',
            when_to_consider: 'High humidity',
            safety_note: 'Wear mask',
          },
        ],
      },
    };

    const processed = postProcessAdvisoryOutput('disease_diagnosis', mockOutput);
    const item = processed.result.chemical_options_last_resort[0];
    expect(item.active_ingredient_or_class).not.toMatch(/250 g\/acre/);
    expect(item.active_ingredient_or_class).not.toMatch(/2 ml\/l/);
    expect(item.active_ingredient_or_class).toContain('Follow the product label');
  });
});

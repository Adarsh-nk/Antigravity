import { sanitizePromptInput } from '../lib/sanitize.js';
import { LANGUAGE_NAMES } from '../config/domain.js';

export function buildCropRecommendationPrompt(payload, farm, language) {
  const langName = LANGUAGE_NAMES[language] || 'English';

  const soilTestSummary = farm.soil_ph
    ? `pH ${farm.soil_ph}, N ${farm.soil_nitrogen_kg_ha || 'N/A'} kg/ha, P ${farm.soil_phosphorus_kg_ha || 'N/A'} kg/ha, K ${farm.soil_potassium_kg_ha || 'N/A'} kg/ha, OC ${farm.soil_organic_carbon_percent || 'N/A'}%`
    : 'not available';

  const userNotes = sanitizePromptInput(payload.additional_notes || '', 1000);

  const userText = `TASK: Recommend the most suitable crops for the following farm and season.

OUTPUT LANGUAGE: ${langName}

FARM:
- Location: ${farm.district}, ${farm.state}
- Area: ${farm.area} ${farm.area_unit}
- Soil type: ${farm.soil_type}
- Irrigation source: ${farm.irrigation_source}
- Soil test: ${soilTestSummary}

REQUEST:
- Season: ${payload.season}
- Planned sowing month: ${payload.sowing_month || 'not specified'}
- Water availability: ${payload.water_availability}
- Farming preference: ${payload.farming_preference}
- Budget level: ${payload.budget_level}
- Previous crop: ${payload.previous_crop || 'not specified'}
- Farmer goals: ${(payload.goals || []).join(', ')}

<user_input>
${userNotes}
</user_input>

Recommend 3 to 5 crops ranked by suitability. For each, explain why it fits this farm, key risks, and rotation or intercropping advice. List crops to avoid with reasons. Do not state market prices.`;

  return { userText, languageName: langName };
}

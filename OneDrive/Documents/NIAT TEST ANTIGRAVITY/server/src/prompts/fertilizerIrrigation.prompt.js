import { sanitizePromptInput } from '../lib/sanitize.js';
import { LANGUAGE_NAMES } from '../config/domain.js';

export function buildFertilizerIrrigationPrompt(payload, farm, language) {
  const langName = LANGUAGE_NAMES[language] || 'English';

  const soilTestSummary = payload.soil_test_available && farm.soil_ph
    ? `pH ${farm.soil_ph}, N ${farm.soil_nitrogen_kg_ha || 'N/A'} kg/ha, P ${farm.soil_phosphorus_kg_ha || 'N/A'} kg/ha, K ${farm.soil_potassium_kg_ha || 'N/A'} kg/ha, OC ${farm.soil_organic_carbon_percent || 'N/A'}%`
    : 'not available or not used';

  const userNotes = sanitizePromptInput(payload.additional_notes || '', 1000);

  const userText = `TASK: Create a stage-wise fertilizer (nutrient) and irrigation plan.

OUTPUT LANGUAGE: ${langName}

FARM:
- Location: ${farm.district}, ${farm.state}
- Area: ${farm.area} ${farm.area_unit}
- Soil type: ${farm.soil_type}
- Irrigation source: ${farm.irrigation_source}
- Soil test: ${soilTestSummary}

REQUEST:
- Crop: ${payload.crop}
- Current growth stage: ${payload.growth_stage}
- Sowing date: ${payload.sowing_date || 'not specified'}
- Farming preference: ${payload.farming_preference}
- Water availability: ${payload.water_availability}

<user_input>
${userNotes}
</user_input>

Cover the current stage and the remaining stages. Combine organic sources with mineral nutrients according to the farming preference. Any quantities must be labelled indicative and tied to the soil test. Include micronutrient watch-outs and water-saving methods suited to the irrigation source.`;

  return { userText, languageName: langName };
}

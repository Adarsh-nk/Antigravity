import { sanitizePromptInput } from '../lib/sanitize.js';
import { LANGUAGE_NAMES } from '../config/domain.js';

export function buildPestManagementPrompt(payload, farm, language) {
  const langName = LANGUAGE_NAMES[language] || 'English';

  const pestDesc = sanitizePromptInput(payload.pest_description || '', 1000);
  const userNotes = sanitizePromptInput(payload.additional_notes || '', 1000);

  const userText = `TASK: Create an Integrated Pest Management (IPM) plan.

OUTPUT LANGUAGE: ${langName}

FARM:
- Location: ${farm.district}, ${farm.state}
- Soil type: ${farm.soil_type}

REQUEST:
- Crop: ${payload.crop}
- Growth stage: ${payload.growth_stage}
- Infestation severity: ${payload.infestation_severity}
- Farming preference: ${payload.farming_preference}
- Sprayer experience: ${payload.pesticide_sprayer_experience}

<user_input>
Pest description: ${pestDesc}
Additional notes: ${userNotes}
</user_input>

Identify the most likely pests, then give a tiered plan: monitoring, cultural, mechanical, biological, and chemical as a last resort (active ingredient class only, no brand names, no exact doses). Include safety and PPE guidance suited to the sprayer's experience.`;

  return { userText, languageName: langName };
}

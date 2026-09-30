import { sanitizePromptInput } from '../lib/sanitize.js';
import { LANGUAGE_NAMES } from '../config/domain.js';

export function buildSeasonalPlanPrompt(payload, farm, language) {
  const langName = LANGUAGE_NAMES[language] || 'English';

  const userNotes = sanitizePromptInput(payload.additional_notes || '', 1000);

  const userText = `TASK: Build a week-by-week season plan from land preparation to post-harvest.

OUTPUT LANGUAGE: ${langName}

FARM:
- Location: ${farm.district}, ${farm.state}
- Area: ${farm.area} ${farm.area_unit}
- Soil type: ${farm.soil_type}
- Irrigation source: ${farm.irrigation_source}

REQUEST:
- Crop: ${payload.crop}
- Season: ${payload.season}
- Planned sowing date: ${payload.planned_sowing_date}
- Water availability: ${payload.water_availability}
- Farming preference: ${payload.farming_preference}
- Budget level: ${payload.budget_level}

<user_input>
${userNotes}
</user_input>

Give a timeline covering land preparation, seed treatment, sowing, each growth stage, harvest, and post-harvest handling. For each phase list tasks, inputs needed, and risks to watch. Provide a relative (low, medium, high) budget outline; do not state rupee prices.`;

  return { userText, languageName: langName };
}

import { sanitizePromptInput } from '../lib/sanitize.js';
import { LANGUAGE_NAMES } from '../config/domain.js';

export function buildDiseaseDiagnosisPrompt(payload, farm, language, hasImage = false) {
  const langName = LANGUAGE_NAMES[language] || 'English';
  const imageNote = hasImage ? 'A photo of the affected plant is attached.' : 'No photo was provided.';

  const symptomDesc = sanitizePromptInput(payload.symptom_description || '', 1000);
  const recentSprays = sanitizePromptInput(payload.recent_sprays || 'none reported', 500);
  const additionalNotes = sanitizePromptInput(payload.additional_notes || '', 1000);

  const userText = `TASK: Help identify the probable cause of the crop problem below and advise on treatment and prevention. ${imageNote}

OUTPUT LANGUAGE: ${langName}

FARM:
- Location: ${farm.district}, ${farm.state}
- Soil type: ${farm.soil_type}
- Irrigation source: ${farm.irrigation_source}

CROP PROBLEM:
- Crop: ${payload.crop}
- Growth stage: ${payload.growth_stage}
- Symptoms selected: ${(payload.symptoms || []).join(', ')}
- Days since first noticed: ${payload.days_since_first_noticed ?? 'not specified'}
- Approximate area affected: ${payload.affected_area_percent}%
- Recent weather: ${payload.recent_weather || 'not specified'}

<user_input>
Symptom description: ${symptomDesc}
Recent sprays already applied: ${recentSprays}
Additional notes: ${additionalNotes}
</user_input>

Give 2 to 4 possible causes ranked by likelihood, with checks the farmer can do to tell them apart. Include non-infectious causes (nutrient deficiency, water stress) where plausible. Give immediate actions, cultural and organic controls first, and chemical options (active ingredient class only) only as a last resort. If an image is attached, describe what you observe in it and state how clear it is. If the image is blurry, off-topic, or not a plant, say so and lower confidence.`;

  return { userText, languageName: langName };
}

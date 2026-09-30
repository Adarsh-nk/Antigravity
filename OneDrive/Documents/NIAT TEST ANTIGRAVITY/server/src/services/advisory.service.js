import { generateStructured } from './gemini.service.js';
import { SYSTEM_PROMPT } from '../prompts/system.prompt.js';
import { buildRepairPrompt } from '../prompts/repair.prompt.js';
import { buildCropRecommendationPrompt } from '../prompts/cropRecommendation.prompt.js';
import { buildDiseaseDiagnosisPrompt } from '../prompts/diseaseDiagnosis.prompt.js';
import { buildFertilizerIrrigationPrompt } from '../prompts/fertilizerIrrigation.prompt.js';
import { buildPestManagementPrompt } from '../prompts/pestManagement.prompt.js';
import { buildSeasonalPlanPrompt } from '../prompts/seasonalPlan.prompt.js';
import { advisoryOutputSchemas } from '../validators/advisoryOutput.js';
import { postProcessAdvisoryOutput } from './postprocess.service.js';
import { AppError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';

export async function generateAdvisoryPipeline({
  advisoryType,
  inputPayload,
  farmSnapshot,
  language,
  imagePart = null,
}) {
  let promptInfo;
  switch (advisoryType) {
    case 'crop_recommendation':
      promptInfo = buildCropRecommendationPrompt(inputPayload, farmSnapshot, language);
      break;
    case 'disease_diagnosis':
      promptInfo = buildDiseaseDiagnosisPrompt(inputPayload, farmSnapshot, language, !!imagePart);
      break;
    case 'fertilizer_irrigation':
      promptInfo = buildFertilizerIrrigationPrompt(inputPayload, farmSnapshot, language);
      break;
    case 'pest_management':
      promptInfo = buildPestManagementPrompt(inputPayload, farmSnapshot, language);
      break;
    case 'seasonal_plan':
      promptInfo = buildSeasonalPlanPrompt(inputPayload, farmSnapshot, language);
      break;
    default:
      throw new AppError('VALIDATION_ERROR', `Unsupported advisory type: ${advisoryType}`, 400);
  }

  const { userText } = promptInfo;
  const targetSchema = advisoryOutputSchemas[advisoryType];

  let response;
  try {
    response = await generateStructured({
      systemInstruction: SYSTEM_PROMPT,
      userText,
      imagePart,
    });
  } catch (err) {
    logger.error({ err }, 'Gemini API call failed');
    if (err.code === 'AI_TIMEOUT') {
      throw new AppError('AI_TIMEOUT', 'Advisory generation timed out. Please try again.', 504);
    }
    throw new AppError('AI_UNAVAILABLE', 'AI service is temporarily unavailable. Please try again shortly.', 502);
  }

  let rawJson = response.text;
  let parsed;
  let parseError = null;

  try {
    const cleanText = rawJson.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const jsonObject = JSON.parse(cleanText);
    const validated = targetSchema.parse(jsonObject);
    parsed = validated;
  } catch (err) {
    parseError = err;
    logger.warn({ err: err.message }, 'Initial Gemini structured response validation failed; attempting repair retry');
  }

  // Retry once with repair prompt if initial attempt failed
  if (parseError) {
    const errorSummary = parseError.issues
      ? parseError.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
      : parseError.message;

    const repairInstruction = buildRepairPrompt(errorSummary);

    try {
      const repairResponse = await generateStructured({
        systemInstruction: SYSTEM_PROMPT,
        userText: `${userText}\n\nREPAIR INSTRUCTION:\n${repairInstruction}`,
        imagePart,
      });

      const cleanText = repairResponse.text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      const jsonObject = JSON.parse(cleanText);
      parsed = targetSchema.parse(jsonObject);

      response.latencyMs += repairResponse.latencyMs;
      response.promptTokens = (response.promptTokens || 0) + (repairResponse.promptTokens || 0);
      response.outputTokens = (response.outputTokens || 0) + (repairResponse.outputTokens || 0);
    } catch (retryErr) {
      logger.error({ err: retryErr }, 'Repair retry also failed');
      throw new AppError(
        'AI_INVALID_RESPONSE',
        'Unable to generate a valid structured advisory. Please check your inputs and try again.',
        502
      );
    }
  }

  // Apply post-processing (safety checks, dosage stripping, title truncation, expert escalation)
  const finalOutput = postProcessAdvisoryOutput(advisoryType, parsed);

  return {
    outputPayload: finalOutput,
    title: finalOutput.title,
    confidence: finalOutput.confidence,
    escalateToExpert: finalOutput.escalate_to_expert?.needed ?? false,
    latencyMs: response.latencyMs,
    promptTokens: response.promptTokens,
    outputTokens: response.outputTokens,
  };
}

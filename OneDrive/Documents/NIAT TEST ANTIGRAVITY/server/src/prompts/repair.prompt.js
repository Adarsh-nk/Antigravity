export function buildRepairPrompt(errorSummary) {
  return `Your previous response was not valid. Problems: ${errorSummary}.
Return ONLY a corrected JSON object that strictly conforms to the required schema and the original task. Do not add commentary or code fences. Keep the same output language.`;
}

/**
 * Sanitizes input text before embedding in prompt templates.
 * Removes control characters, collapses whitespace, caps length,
 * and escapes prompt delimiters to prevent injection attacks.
 */
export function sanitizePromptInput(text, maxLength = 1000) {
  if (typeof text !== 'string') return '';

  let sanitized = text
    // Remove null bytes and non-printable control characters (except newline, tab)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
    // Replace prompt delimiters to avoid injection breaks
    .replace(/<user_input>/gi, '&lt;user_input&gt;')
    .replace(/<\/user_input>/gi, '&lt;/user_input&gt;')
    // Collapse multiple blank lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  return sanitized;
}

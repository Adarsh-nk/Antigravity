import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

function withTimeout(promise, ms, code) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const err = new Error('AI request timed out');
      err.code = code;
      reject(err);
    }, ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export async function generateStructured({
  systemInstruction,
  userText,
  imagePart,
  responseJsonSchema,
  temperature = 0.3,
  maxOutputTokens = 6000,
}) {
  const parts = [{ text: userText }];
  if (imagePart) {
    parts.push({
      inlineData: {
        mimeType: imagePart.mimeType,
        data: imagePart.buffer.toString('base64'),
      },
    });
  }

  const started = Date.now();
  const response = await withTimeout(
    ai.models.generateContent({
      model: env.GEMINI_MODEL,
      contents: [{ role: 'user', parts }],
      config: {
        systemInstruction,
        temperature,
        maxOutputTokens,
        responseMimeType: 'application/json',
        responseJsonSchema,
      },
    }),
    env.AI_ADVISORY_TIMEOUT_MS,
    'AI_TIMEOUT'
  );

  return {
    text: response.text,
    latencyMs: Date.now() - started,
    promptTokens: response.usageMetadata?.promptTokenCount ?? null,
    outputTokens: response.usageMetadata?.candidatesTokenCount ?? null,
  };
}

export async function generateText({
  systemInstruction,
  contents,
  temperature = 0.5,
  maxOutputTokens = 1500,
}) {
  const response = await withTimeout(
    ai.models.generateContent({
      model: env.GEMINI_MODEL,
      contents,
      config: { systemInstruction, temperature, maxOutputTokens },
    }),
    env.AI_CHAT_TIMEOUT_MS,
    'AI_TIMEOUT'
  );
  return response.text;
}

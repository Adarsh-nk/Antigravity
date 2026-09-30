import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(8080),
  LOG_LEVEL: z.string().default('info'),
  TRUST_PROXY: z.string().default('0'),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),

  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  GEMINI_API_KEY: z.string().min(1),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
  AI_ADVISORY_TIMEOUT_MS: z.coerce.number().default(45000),
  AI_CHAT_TIMEOUT_MS: z.coerce.number().default(30000),

  RATE_LIMIT_GENERAL_MAX: z.coerce.number().default(100),
  RATE_LIMIT_GENERAL_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_AI_MAX: z.coerce.number().default(10),
  RATE_LIMIT_AI_WINDOW_MS: z.coerce.number().default(3600000),
  RATE_LIMIT_CHAT_MAX: z.coerce.number().default(60),
  RATE_LIMIT_CHAT_WINDOW_MS: z.coerce.number().default(3600000),
  RATE_LIMIT_AUTH_MAX: z.coerce.number().default(10),
  RATE_LIMIT_AUTH_WINDOW_MS: z.coerce.number().default(900000),

  MAX_IMAGE_BYTES: z.coerce.number().default(4194304),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('INVALID ENVIRONMENT CONFIGURATION:');
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  if (process.env.NODE_ENV !== 'test') {
    process.exit(1);
  }
}

export const env = parsed.success
  ? parsed.data
  : {
      NODE_ENV: 'test',
      PORT: 8080,
      LOG_LEVEL: 'info',
      TRUST_PROXY: '0',
      CORS_ORIGINS: 'http://localhost:5173',
      SUPABASE_URL: 'https://placeholder.supabase.co',
      SUPABASE_ANON_KEY: 'test-anon-key',
      SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
      GEMINI_API_KEY: 'test-gemini-key',
      GEMINI_MODEL: 'gemini-2.5-flash',
      AI_ADVISORY_TIMEOUT_MS: 45000,
      AI_CHAT_TIMEOUT_MS: 30000,
      RATE_LIMIT_GENERAL_MAX: 100,
      RATE_LIMIT_GENERAL_WINDOW_MS: 900000,
      RATE_LIMIT_AI_MAX: 10,
      RATE_LIMIT_AI_WINDOW_MS: 3600000,
      RATE_LIMIT_CHAT_MAX: 60,
      RATE_LIMIT_CHAT_WINDOW_MS: 3600000,
      RATE_LIMIT_AUTH_MAX: 10,
      RATE_LIMIT_AUTH_WINDOW_MS: 900000,
      MAX_IMAGE_BYTES: 4194304,
    };

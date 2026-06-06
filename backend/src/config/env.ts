import { z } from 'zod'
import dotenv from 'dotenv'
dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 chars'),
  GITHUB_CLIENT_ID: z.string().min(1, 'GITHUB_CLIENT_ID is required'),
  GITHUB_CLIENT_SECRET: z.string().min(1, 'GITHUB_CLIENT_SECRET is required'),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  ENABLE_DEVELOPER_DNA: z.string().default('true'),
  ENABLE_RESUME_BUILDER: z.string().default('true'),
  ENABLE_PORTFOLIO_GENERATOR: z.string().default('true'),
  ENABLE_SOCIAL_SHARING: z.string().default('true'),
  ENABLE_GITHUB_WRAPPED: z.string().default('true'),
  ENABLE_REPO_COMPARE: z.string().default('true'),
  ENABLE_PUBLIC_PROFILES: z.string().default('true'),
  ENABLE_BACKGROUND_JOBS: z.string().default('true'),
})

const parsed = envSchema.safeParse(process.env)
if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format())
  process.exit(1)
}

export const env = parsed.data

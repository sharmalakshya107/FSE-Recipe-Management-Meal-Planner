import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  ACCESS_TOKEN_SECRET: z
    .string()
    .min(32, "Access token secret must be at least 32 characters"),
  REFRESH_TOKEN_SECRET: z
    .string()
    .min(32, "Refresh token secret must be at least 32 characters"),
  ACCESS_TOKEN_EXPIRE: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRE: z.string().default("7d"),
  EMAIL_USER: z.string().email("Email user must be a valid email"),
  EMAIL_PASS: z.string().min(1, "Email password (App Password) is required"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  CALLBACK_URL_PREFIX: z.string().default("http://localhost:3000/api/v1/auth"),
  FRONTEND_SOCIAL_REDIRECT: z
    .string()
    .default("http://localhost:5173/social-callback"),
  FRONTEND_URL: z.string().default("http://localhost:5173"),
  MONGO_URI: z.string().default("mongodb://localhost:27017/recipe-planner"),
  USDA_API_KEY: z.string().default("DEMO_KEY"),
  USDA_API_URL: z.string().default("https://api.nal.usda.gov/fdc/v1"),
  EMAIL_TEMPLATES_DIR: z.string().default("src/modules/auth/templates"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  process.exit(1);
}

export const config = _env.data;

import dotenv from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";
import { z } from "zod";

// Load env: .env.development first when present (local/Docker dev), then .env (production reference).
// Railway/production: no .env.development in container; set NODE_ENV and all vars in dashboard.
const devPath = resolve(process.cwd(), ".env.development");
if (existsSync(devPath)) {
  dotenv.config({ path: devPath });
}
dotenv.config();

// Define schema for environment variables
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().transform(Number).default(5002),

  // Database
  MONGODB_URI: z.string().url(),

  // AWS
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_REGION: z.string().min(1),
  AWS_BUCKET_NAME: z.string().min(1),
  CLOUDFRONT_URL: z.string().url().optional(),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRE: z.string().default("7d"),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRE: z.string().default("30d"),

  // URLs
  FRONTEND_URL: z.string().url(),
  CMS_URL: z.string().url(),

  LOG_LEVEL: z.string().default("info"),

  // Admin
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(8),
  ADMIN_NAME: z.string().default("Admin User"),
});

// Validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Invalid environment variables:");
      error.issues.forEach((err) => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
};

export const env = parseEnv();

export default env;

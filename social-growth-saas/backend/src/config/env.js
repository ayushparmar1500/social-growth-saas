import dotenv from "dotenv";

dotenv.config();

export const {
  MONGODB_URI,
  PORT = 5000,
  CLIENT_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN = "7d",
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
  SMM_API_URL,
  SMM_API_KEY,
  LOG_LEVEL = "dev",
} = process.env;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is required");
}

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}

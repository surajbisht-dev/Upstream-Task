import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  appBaseUrl: process.env.APP_BASE_URL || "http://localhost:5000",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mailMode: process.env.MAIL_MODE || "console",
};

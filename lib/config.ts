export const config = {
  env: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "default_super_secret_for_dev_only",
  databaseUrl: process.env.DATABASE_URL || "file:./dev.db",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
};

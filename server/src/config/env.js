// Loads environment variables from .env once, and exposes them in one place.
// Every other file imports from here instead of reading process.env directly.
require('dotenv').config();

const env = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

// Fail fast with a clear message if the database URL is missing.
if (!env.databaseUrl) {
  console.warn('⚠️  DATABASE_URL is not set. Copy .env.example to .env and add your PostgreSQL URL.');
}

module.exports = env;

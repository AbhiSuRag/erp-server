// Central configuration loader
const dotenv = require('dotenv');
dotenv.config();

const env = (process.env.NODE_ENV || 'development').toLowerCase();
const isDev = env === 'development' || env === 'dev';

const config = {
  env,
  isDev,
  port: process.env.PORT || 3000,
  // Support separate DB env vars for dev/prod, fallback to DB_URL
  dbUrl: env === 'production' ? (process.env.PROD_DB_URL || process.env.DB_URL) : (process.env.DEV_DB_URL || process.env.DB_URL),
  jwtSecret: process.env.JWT_SECRET || 'change_this_secret',
  logLevel: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  // Request id strategy: 'header' to prefer x-request-id, 'ip' to use client IP,
  // 'uuid' to always use a generated id, or 'auto' (default) to prefer header -> ip -> uuid.
  requestIdStrategy: process.env.REQUEST_ID_STRATEGY || (isDev ? 'uuid' : 'auto')
};

module.exports = config;

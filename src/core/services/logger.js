// Logger wrapper. Uses winston when available, falls back to console.
const path = require('path');
const config = require('../config');

let logger;
try {
  const winston = require('winston');
  const { combine, timestamp, printf, colorize } = winston.format;

  const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  });

  const transports = [
    new winston.transports.Console({ format: combine(colorize(), timestamp(), myFormat) })
  ];

  if (config.env === 'production') {
    // Ensure logs directory exists when running in prod (best-effort)
    const fs = require('fs');
    const logsDir = path.resolve(process.cwd(), 'logs');
    try { if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir); } catch (e) { /* ignore */ }
    transports.push(new winston.transports.File({ filename: path.join(logsDir, 'app.log'), format: combine(timestamp(), myFormat) }));
  }

  logger = winston.createLogger({
    level: config.logLevel,
    format: combine(timestamp(), myFormat),
    transports
  });
} catch (err) {
  // Fallback simple logger if winston isn't available
  logger = {
    info: console.log.bind(console, '[info]'),
    warn: console.warn.bind(console, '[warn]'),
    error: console.error.bind(console, '[error]'),
    debug: console.debug ? console.debug.bind(console, '[debug]') : console.log.bind(console, '[debug]')
  };
}

module.exports = logger;

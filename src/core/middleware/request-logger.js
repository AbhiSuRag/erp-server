const logger = require('../services/logger');
const config = require('../config');

function safeStringify(obj, maxLen = 1000) {
  try {
    const str = typeof obj === 'string' ? obj : JSON.stringify(obj);
    if (str.length > maxLen) return str.slice(0, maxLen) + '...';
    return str;
  } catch (err) {
    return String(obj);
  }
}

function getClientIp(req) {
  // Prefer X-Forwarded-For (may contain comma-separated list)
  const xf = req.headers['x-forwarded-for'];
  if (xf) return xf.split(',')[0].trim();
  if (req.ip) return req.ip;
  if (req.connection && req.connection.remoteAddress) return req.connection.remoteAddress;
  return 'unknown';
}

function generateShortId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
}

module.exports = function requestLogger(req, res, next) {
  const start = Date.now();

  // Determine request identifier strategy
  const strategy = (config.requestIdStrategy || 'auto').toLowerCase();

  let id;
  // 1) prefer explicit incoming header if configured or in auto mode
  if (strategy === 'header') {
    id = req.headers['x-request-id'] || null;
  } else if (strategy === 'ip') {
    const ip = getClientIp(req) || 'unknown';
    // append a small suffix so concurrent requests from same IP are distinguishable
    id = `${ip}-${Date.now().toString(36).slice(-6)}`;
  } else if (strategy === 'uuid') {
    id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : generateShortId();
  } else {
    // auto: try header, then ip, then uuid
    id = req.headers['x-request-id'] || null;
    if (!id) {
      const ip = getClientIp(req);
      if (ip && ip !== 'unknown') id = `${ip}-${Date.now().toString(36).slice(-6)}`;
    }
    if (!id) id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : generateShortId();
  }

  req.id = id;

  const { method, originalUrl } = req;

  // Log minimal headers (avoid logging auth tokens by default)
  const headers = {
    'user-agent': req.headers['user-agent'],
    host: req.headers['host'],
    'content-type': req.headers['content-type']
  };


  logger.info(`[req:${id}] -> ${method} ${originalUrl} headers=${safeStringify(headers)}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`[req:${id}] <- ${method} ${originalUrl} ${res.statusCode} ${duration}ms`);
  });

  next();
};

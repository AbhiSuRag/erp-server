const logger = require('../services/logger');
const { verifyToken } = require('../services/token');
const orgDbService = require('../services/org-db-service');

/**
 * Tenant middleware
 * - verifies JWT (if provided)
 * - extracts payload (expects payload.orgName or payload.org)
 * - attaches req.user and req.orgName
 * - obtains (or reuses) a per-org mongoose connection and attaches it to req.dbConn
 *
 * Behavior:
 * - If no Authorization header is present, middleware calls next() (unauthenticated routes allowed).
 * - If Authorization present but token invalid, responds 401.
 */
module.exports = async function tenantMiddleware(req, res, next) {
  try {
    const auth = req.headers && req.headers.authorization;
    if (!auth) return next();

    const parts = String(auth).split(' ');
    const token = parts.length === 2 ? parts[1] : parts[0];
    if (!token) return next();

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // normalize org name from payload
    const orgName = payload.orgName || payload.org || payload.orgname || payload.organization;
    req.user = payload;
    req.orgName = orgName;

    if (orgName) {
      // get (or create) a connection for this org and attach
      const conn = await orgDbService.getConnectionForOrg(orgName);
      req.dbConn = conn;
      // Also expose a helper to get models from this connection: req.models('Users') => Model
      req.models = function (name, schema) {
        // if schema provided, ensure model exists on this connection
        if (schema) return conn.model(name, schema);
        return conn.model(name);
      };
    }

    next();
  } catch (err) {
    logger.error('tenant-middleware error: ' + (err && err.message ? err.message : String(err)));
    // fail closed if token present but something broke
    return res.status(500).json({ message: 'Server error in tenant middleware' });
  }
};

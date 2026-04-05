const mongoose = require('mongoose');
const config = require('../config');
const logger = require('./logger');

// Manage per-organization mongoose connections.
// This module lazily creates connections and caches them in memory.
const connections = new Map();

function makeOrgDbUrl(orgName) {
  if (!config.dbBase) throw new Error('dbBase is not configured (DEV_DB_BASE / PROD_DB_BASE)');
  // ensure no trailing slash on base
  const base = String(config.dbBase).replace(/\/$/, '');
  // encode org name to be safe in URL path
  const safeOrg = encodeURIComponent(orgName);
  return `${base}/${safeOrg}`;
}

async function getConnectionForOrg(orgName) {
  if (!orgName) throw new Error('orgName is required to get org connection');

  if (connections.has(orgName)) return connections.get(orgName);

  const url = makeOrgDbUrl(orgName);

  // create a new connection (use createConnection to avoid changing the default mongoose connection)
  const conn = mongoose.createConnection(url);

  // wire error/connected logging
  conn.on('connected', () => logger.info(`Org DB connected: ${orgName}`));
  conn.on('error', (err) => logger.error(`Org DB connection error for ${orgName}: ${err && err.message ? err.message : String(err)}`));

  // cache and return
  connections.set(orgName, conn);
  return conn;
}

function getCachedConnection(orgName) {
  return connections.get(orgName) || null;
}

module.exports = {
  getConnectionForOrg,
  getCachedConnection,
};

const mongoose = require('mongoose');
const config = require('../config');
const logger = require('./logger');


// connect to the DB
async function connectToDB() {
  try {
    // Use the connection string from config
    const dbUrl = config.dbUrl;
    if (!dbUrl) {
      throw new Error('Database connection string is not defined in environment variables');
    }

    // Connect to the database
    await mongoose.connect(dbUrl);

    logger.info('Connected to the database successfully');
  } catch (error) {
    logger.error('Error connecting to the database: ' + error.message);
    process.exit(1); // Exit the process with failure
  }

}

module.exports = {
  connectToDB,
};

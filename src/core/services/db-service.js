const mongoose = require('mongoose'); 
 require('dotenv').config();




// connect to the DB

async function connectToDB() {
  try {
    // Use the connection string from environment variables
    const dbUrl = process.env.DEV_DB_URL;
    if (!dbUrl) {
      throw new Error('Database connection string is not defined in environment variables');
    } 

    // Connect to the database
    await mongoose.connect(dbUrl);

    console.log('Connected to the database successfully');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    process.exit(1); // Exit the process with failure
  } 

}

module.exports = {
  connectToDB,
};

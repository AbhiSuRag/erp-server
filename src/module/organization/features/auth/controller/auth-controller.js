//imports
const { comparePassword } = require('../../../../../core/services/password');
const { generateToken } = require('../../../../../core/services/token');
const orgModel = require('../models/org-model');
const logger = require('../../../../../core/services/logger');


// login
async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const org = await orgModel.findOne({ email });

    //check if user does not exists
    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    //match password
    const isPasswordCorrect = await comparePassword(password, org.password);

    // Check if password is correct
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = await generateToken(org);

    // Return token and user info
    res.status(200).json({
      token,
      org: org
    });
  } catch (error) {
    logger.error('Auth login error: ' + (error && error.message ? error.message : String(error)));
    res.status(500).json({ message: error.message });
  }
}

//register
async function register(req, res) {
  //get data from request body
  const { name, email, password, ownBy, address, role, mode } = req.body;

  try {
    // Validate input
    if (!name || !email || !password || !ownBy || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingOrg = await orgModel.findOne({ email });
    if (existingOrg) {
      return res.status(409).json({ message: 'Organization already exists' });
    }

    // Create new user
    const newOrg = new orgModel({
      name,
      email,
      password,
      ownBy,
      address,
      role,
      mode
    });

    // Save user to database
    await newOrg.save();

    // Generate JWT token
    const token = await generateToken(newOrg);

    // Return token and user info
    res.status(201).json({
      token,
      org: newOrg
    });
  } catch (error) {
    logger.error('Auth register error: ' + (error && error.message ? error.message : String(error)));
    res.status(500).json({ message: error.message });
  }
}



//exports
module.exports = {
  login,
  register
};

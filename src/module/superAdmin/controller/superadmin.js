//imports
const { comparePassword } = require('../../../core/services/password');
const { generateToken } = require('../../../core/services/token');
const logger = require('../../../core/services/logger');
const superadminModel = require('../models/superadmin');

async function login(req, res) {
  //get data from request body
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find superadmin by email
    const superadmin = await superadminModel.findOne({ email });
    if (!superadmin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await comparePassword(password, superadmin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = await generateToken(superadmin);

    // Return token and superadmin info
    res.status(200).json({
      token,
      data: {
        id: superadmin._id,
        email: superadmin.email,
        name: superadmin.name,
        role: superadmin.role
      }
    });
  } catch (error) {
    logger.error('SuperAdmin login error: ' + (error && error.message ? error.message : String(error)));
    res.status(500).json({ message: 'Server error during login' });
  }
}

module.exports = {
  login,
};

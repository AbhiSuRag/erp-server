//imports
const jwt = require('jsonwebtoken');
const config = require('../../../core/config');
const superadminModel = require('../../superAdmin/models/superadmin');
const logger = require('../../../core/services/logger');

//organization middleware
async function verifySuperAdmin(req, res, next) {
  const auth = req.headers['authorization'];

  try {
    //check if token is present
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized, token missing' });
    }

    const token = auth.split(' ')[1];

    //verify token
    const payload = jwt.verify(token, config.jwtSecret);

    //get check if superadmin is genuine
    const superadmin = await superadminModel.findOne({ _id: payload.id });
    if (superadmin) {
      return next();
    }

    if (!superadmin) {
      return res.status(401).json({ message: 'Unauthorized, token expired- login again' });
    }

    next();
  } catch (error) {
    logger.error('Org middleware error: ' + (error && error.message ? error.message : String(error)));
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  verifySuperAdmin
};

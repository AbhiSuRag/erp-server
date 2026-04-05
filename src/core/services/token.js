const jwt = require('jsonwebtoken');


//generate JWT token
function generateToken(org) {
  const payload = {
    id: org.id,
    email: org.email,
    orgName: org.name
  };

  return jwt.sign(payload, process.env.JWT_SECRET);
}

//verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken
};



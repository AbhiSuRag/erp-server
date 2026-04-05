const jwt = require('jsonwebtoken');


//generate JWT token
function generateToken(data) {
  const payload = {
    id: data.id,
    role: data.role
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



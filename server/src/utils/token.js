// Helpers to create and verify JWT login tokens.
const jwt = require('jsonwebtoken');
const env = require('../config/env');

// Create a signed token that stores the user's id.
function signToken(userId) {
  return jwt.sign({ userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

// Verify a token and return its payload. Throws if invalid/expired.
function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

module.exports = { signToken, verifyToken };

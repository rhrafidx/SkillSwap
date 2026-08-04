// Middleware that protects routes requiring a logged-in user.
// It reads the "Authorization: Bearer <token>" header, verifies the token,
// and attaches the user's id to req.userId for the controller to use.
const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../utils/token');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return next(new ApiError(401, 'You must be logged in to do that.'));
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    next(new ApiError(401, 'Your session is invalid or has expired. Please log in again.'));
  }
}

module.exports = requireAuth;

// Central error handler. Any error thrown anywhere in a route ends up here,
// so we format all error responses the same way: { error: "message" }.
const ApiError = require('../utils/ApiError');

// Runs when no route matched the request.
function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// Runs whenever next(err) is called or a controller throws.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Prisma "unique constraint" error (e.g. email already used).
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'That value is already taken.' });
  }

  const status = err.statusCode || 500;
  const message = status === 500 ? 'Something went wrong on our end.' : err.message;

  if (status === 500) console.error(err); // log real server errors for debugging

  res.status(status).json({ error: message });
}

module.exports = { notFound, errorHandler };

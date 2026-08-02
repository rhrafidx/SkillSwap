// Wraps an async controller so that any thrown error (or rejected promise)
// is automatically passed to Express's error handler via next().
// This means controllers can just use async/await and throw — no try/catch needed.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

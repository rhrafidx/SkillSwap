// A small custom error class so controllers can throw errors with a
// specific HTTP status code (e.g. 404, 401). The error handler reads these.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ApiError;

// Controllers handle the HTTP layer: read the request, call the service,
// send the response. Thin by design — real logic lives in the service.
const asyncHandler = require('../../utils/asyncHandler');
const authService = require('./auth.service');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result); // { user, token }
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result); // { user, token }
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.userId); // set by requireAuth middleware
  res.json({ user });
});

module.exports = { register, login, me };

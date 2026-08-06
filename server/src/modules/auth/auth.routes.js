// Maps URLs to auth controller functions.
const { Router } = require('express');
const controller = require('./auth.controller');
const requireAuth = require('../../middleware/auth');

const router = Router();

router.post('/register', controller.register); // POST /api/auth/register
router.post('/login', controller.login); // POST /api/auth/login
router.get('/me', requireAuth, controller.me); // GET  /api/auth/me   (protected)

module.exports = router;

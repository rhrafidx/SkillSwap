const { Router } = require('express');
const controller = require('./skills.controller');
const requireAuth = require('../../middleware/auth');

const router = Router();

router.get('/', controller.list); // GET  /api/skills          (public, supports ?q= &category=)
router.get('/:id', controller.getOne); // GET  /api/skills/:id       (public)
router.post('/', requireAuth, controller.create); // POST /api/skills   (must be logged in)

module.exports = router;

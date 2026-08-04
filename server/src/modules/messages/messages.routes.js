const { Router } = require('express');
const controller = require('./messages.controller');
const requireAuth = require('../../middleware/auth');

const router = Router();

// All message routes require login.
router.use(requireAuth);

router.get('/', controller.listConversations); // GET  /api/messages            (chat list)
router.get('/:userId', controller.listThread); // GET  /api/messages/:userId    (one thread)
router.post('/', controller.send); // POST /api/messages            (send a message)

module.exports = router;

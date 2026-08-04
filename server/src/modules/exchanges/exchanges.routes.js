const { Router } = require('express');
const controller = require('./exchanges.controller');
const requireAuth = require('../../middleware/auth');

const router = Router();

// All exchange routes require login.
router.use(requireAuth);

router.post('/', controller.create); // POST  /api/exchanges
router.get('/sent', controller.listSent); // GET   /api/exchanges/sent
router.get('/received', controller.listReceived); // GET   /api/exchanges/received
router.patch('/:id/status', controller.updateStatus); // PATCH /api/exchanges/:id/status

module.exports = router;

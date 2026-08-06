const { Router } = require('express');
const controller = require('./contact.controller');

const router = Router();

router.post('/', controller.create); // POST /api/contact  (public)

module.exports = router;

// Combines every feature module's routes under /api.
// To add a new feature, build its module folder and mount it here.
const { Router } = require('express');

const authRoutes = require('./modules/auth/auth.routes');
const skillsRoutes = require('./modules/skills/skills.routes');
const exchangesRoutes = require('./modules/exchanges/exchanges.routes');
const messagesRoutes = require('./modules/messages/messages.routes');
const contactRoutes = require('./modules/contact/contact.routes');

const router = Router();

// Simple health check — handy to confirm the server is up.
router.get('/health', (req, res) => res.json({ status: 'ok' }));

router.use('/auth', authRoutes);
router.use('/skills', skillsRoutes);
router.use('/exchanges', exchangesRoutes);
router.use('/messages', messagesRoutes);
router.use('/contact', contactRoutes);

module.exports = router;

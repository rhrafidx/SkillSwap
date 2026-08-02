// Builds and configures the Express application (but does not start it —
// that happens in index.js). Keeping them separate makes testing easier.
const express = require('express');
const cors = require('cors');

const env = require('./config/env');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// ── Global middleware ──
app.use(cors({ origin: env.corsOrigin })); // allow the frontend to call this API
app.use(express.json()); // parse JSON request bodies

// ── Routes ──
app.use('/api', routes);

// ── Error handling (must be last) ──
app.use(notFound);
app.use(errorHandler);

module.exports = app;

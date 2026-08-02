// Entry point: starts the HTTP server.
// Run with `npm run dev` (auto-reload) or `npm start`.
const app = require('./app');
const env = require('./config/env');
const prisma = require('./config/prisma');

async function start() {
  try {
    // Confirm the database is reachable before we start listening.
    await prisma.$connect();
    console.log('✅ Connected to the database.');

    app.listen(env.port, () => {
      console.log(`🚀 SkillSwap API running at http://localhost:${env.port}`);
      console.log(`   Try http://localhost:${env.port}/api/health`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

// Close the database connection cleanly on shutdown.
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

start();

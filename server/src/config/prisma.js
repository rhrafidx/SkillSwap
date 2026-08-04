// A single shared Prisma client for the whole app.
// Importing this everywhere avoids opening many database connections.
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;

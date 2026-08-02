// Business logic for skills (the marketplace listings).
const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');

// Public author info to attach to each skill (never the password).
const authorSelect = { select: { id: true, name: true, avatarUrl: true } };

// List skills, with optional search (?q=) and category (?category=) filters.
async function list({ q, category } = {}) {
  const where = {};

  if (category && category !== 'all') {
    where.category = category;
  }
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ];
  }

  return prisma.skill.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { owner: authorSelect },
  });
}

async function getById(id) {
  const skill = await prisma.skill.findUnique({
    where: { id },
    include: { owner: authorSelect },
  });
  if (!skill) throw new ApiError(404, 'Skill not found.');
  return skill;
}

async function create(ownerId, { title, category, description }) {
  if (!title || !category || !description) {
    throw new ApiError(400, 'Title, category and description are required.');
  }
  return prisma.skill.create({
    data: { title, category, description, ownerId },
    include: { owner: authorSelect },
  });
}

module.exports = { list, getById, create };

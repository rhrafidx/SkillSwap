// Business logic for exchange requests (asking to trade for a skill).
const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');

const userSelect = { select: { id: true, name: true, avatarUrl: true } };

// Create a request from the logged-in user for a given skill.
async function create(requesterId, { skillId, offerSkill, message }) {
  if (!skillId || !offerSkill) {
    throw new ApiError(400, 'skillId and offerSkill are required.');
  }

  const skill = await prisma.skill.findUnique({ where: { id: skillId } });
  if (!skill) throw new ApiError(404, 'That skill does not exist.');
  if (skill.ownerId === requesterId) {
    throw new ApiError(400, 'You cannot request an exchange for your own skill.');
  }

  return prisma.exchange.create({
    data: {
      skillId,
      offerSkill,
      message: message || null,
      requesterId,
      ownerId: skill.ownerId,
    },
  });
}

// Requests the logged-in user has sent.
async function listSent(userId) {
  return prisma.exchange.findMany({
    where: { requesterId: userId },
    orderBy: { createdAt: 'desc' },
    include: { skill: true, owner: userSelect },
  });
}

// Requests other people sent to the logged-in user.
async function listReceived(userId) {
  return prisma.exchange.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' },
    include: { skill: true, requester: userSelect },
  });
}

// Owner accepts or declines a request.
async function updateStatus(userId, exchangeId, status) {
  if (!['accepted', 'declined'].includes(status)) {
    throw new ApiError(400, "Status must be 'accepted' or 'declined'.");
  }
  const exchange = await prisma.exchange.findUnique({ where: { id: exchangeId } });
  if (!exchange) throw new ApiError(404, 'Exchange not found.');
  if (exchange.ownerId !== userId) {
    throw new ApiError(403, 'Only the skill owner can respond to this request.');
  }
  return prisma.exchange.update({ where: { id: exchangeId }, data: { status } });
}

module.exports = { create, listSent, listReceived, updateStatus };

// Business logic for 1-to-1 chat messages.
const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');

const userSelect = { select: { id: true, name: true, avatarUrl: true } };

// Everyone the user has chatted with, plus the most recent message.
// Simple approach: fetch all of the user's messages, group by the other person.
async function listConversations(userId) {
  const messages = await prisma.message.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    orderBy: { createdAt: 'desc' },
    include: { sender: userSelect, receiver: userSelect },
  });

  const seen = new Map();
  for (const msg of messages) {
    const other = msg.senderId === userId ? msg.receiver : msg.sender;
    if (!seen.has(other.id)) {
      seen.set(other.id, { user: other, lastMessage: msg.body, lastAt: msg.createdAt });
    }
  }
  return Array.from(seen.values());
}

// Full message history between the logged-in user and one other user.
async function listThread(userId, otherUserId) {
  return prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    },
    orderBy: { createdAt: 'asc' },
  });
}

// Send a message from the logged-in user to another user.
async function send(senderId, { receiverId, body }) {
  if (!receiverId || !body) {
    throw new ApiError(400, 'receiverId and body are required.');
  }
  if (receiverId === senderId) {
    throw new ApiError(400, 'You cannot message yourself.');
  }
  const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
  if (!receiver) throw new ApiError(404, 'That user does not exist.');

  return prisma.message.create({ data: { senderId, receiverId, body } });
}

module.exports = { listConversations, listThread, send };

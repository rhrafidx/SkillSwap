const asyncHandler = require('../../utils/asyncHandler');
const service = require('./messages.service');

const listConversations = asyncHandler(async (req, res) => {
  const conversations = await service.listConversations(req.userId);
  res.json({ conversations });
});

const listThread = asyncHandler(async (req, res) => {
  const messages = await service.listThread(req.userId, req.params.userId);
  res.json({ messages });
});

const send = asyncHandler(async (req, res) => {
  const message = await service.send(req.userId, req.body);
  res.status(201).json({ message });
});

module.exports = { listConversations, listThread, send };

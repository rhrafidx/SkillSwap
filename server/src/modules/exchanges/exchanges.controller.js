const asyncHandler = require('../../utils/asyncHandler');
const service = require('./exchanges.service');

const create = asyncHandler(async (req, res) => {
  const exchange = await service.create(req.userId, req.body);
  res.status(201).json({ exchange });
});

const listSent = asyncHandler(async (req, res) => {
  const exchanges = await service.listSent(req.userId);
  res.json({ exchanges });
});

const listReceived = asyncHandler(async (req, res) => {
  const exchanges = await service.listReceived(req.userId);
  res.json({ exchanges });
});

const updateStatus = asyncHandler(async (req, res) => {
  const exchange = await service.updateStatus(req.userId, req.params.id, req.body.status);
  res.json({ exchange });
});

module.exports = { create, listSent, listReceived, updateStatus };

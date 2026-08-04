const asyncHandler = require('../../utils/asyncHandler');
const service = require('./contact.service');

const create = asyncHandler(async (req, res) => {
  await service.create(req.body);
  res.status(201).json({ message: 'Thanks! Your message has been received.' });
});

module.exports = { create };

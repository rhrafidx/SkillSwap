const asyncHandler = require('../../utils/asyncHandler');
const skillsService = require('./skills.service');

const list = asyncHandler(async (req, res) => {
  const skills = await skillsService.list(req.query); // supports ?q= and ?category=
  res.json({ skills });
});

const getOne = asyncHandler(async (req, res) => {
  const skill = await skillsService.getById(req.params.id);
  res.json({ skill });
});

const create = asyncHandler(async (req, res) => {
  const skill = await skillsService.create(req.userId, req.body);
  res.status(201).json({ skill });
});

module.exports = { list, getOne, create };

// Business logic for the public "Contact us" form.
const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');

async function create({ name, email, subject, message }) {
  if (!name || !email || !subject || !message) {
    throw new ApiError(400, 'All fields are required.');
  }
  return prisma.contactMessage.create({
    data: { name, email, subject, body: message },
  });
}

module.exports = { create };

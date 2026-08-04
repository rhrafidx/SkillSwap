// Business logic for authentication. Talks to the database, hashes passwords,
// and returns plain data. Knows nothing about HTTP (req/res).
const bcrypt = require('bcryptjs');
const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');
const { signToken } = require('../../utils/token');

// Remove the password hash before sending a user back to the client.
function safeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

async function register({ name, email, password }) {
  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email and password are all required.');
  }
  if (password.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters.');
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email: email.toLowerCase(), password: hashed },
  });

  const token = signToken(user.id);
  return { user: safeUser(user), token };
}

async function login({ email, password }) {
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required.');
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) throw new ApiError(401, 'Invalid email or password.');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new ApiError(401, 'Invalid email or password.');

  const token = signToken(user.id);
  return { user: safeUser(user), token };
}

async function getMe(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, 'User not found.');
  return safeUser(user);
}

module.exports = { register, login, getMe, safeUser };

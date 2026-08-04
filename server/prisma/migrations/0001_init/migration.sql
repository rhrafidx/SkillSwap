-- Initial schema for SkillSwap.
-- Prisma normally generates this for you via `npx prisma migrate dev`.
-- It is included here so the tables can also be created directly with:
--   psql "$DATABASE_URL" -f prisma/migrations/0001_init/migration.sql

CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  bio TEXT,
  "avatarUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Skill" (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  rating DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ownerId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE TABLE "Exchange" (
  id TEXT PRIMARY KEY,
  "offerSkill" TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "skillId" TEXT NOT NULL REFERENCES "Skill"(id) ON DELETE CASCADE,
  "requesterId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "ownerId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE TABLE "Message" (
  id TEXT PRIMARY KEY,
  body TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "senderId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "receiverId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE TABLE "ContactMessage" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

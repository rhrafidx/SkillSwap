// Seeds the database with a couple of demo users and skills so the
// marketplace isn't empty on first run. Safe to run repeatedly.
// Usage: npm run db:seed
const bcrypt = require('bcryptjs');
const prisma = require('../src/config/prisma');

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const aisha = await prisma.user.upsert({
    where: { email: 'aisha@example.com' },
    update: {},
    create: {
      name: 'Aisha K.',
      email: 'aisha@example.com',
      password,
      bio: 'UI/UX designer who loves teaching design fundamentals.',
      avatarUrl: 'https://i.pravatar.cc/120?img=47',
    },
  });

  const marco = await prisma.user.upsert({
    where: { email: 'marco@example.com' },
    update: {},
    create: {
      name: 'Marco T.',
      email: 'marco@example.com',
      password,
      bio: 'Spreadsheet wizard and native Italian speaker.',
      avatarUrl: 'https://i.pravatar.cc/120?img=12',
    },
  });

  const demoSkills = [
    { title: 'React for Beginners', category: 'coding', description: 'Learn components, state and hooks by building a real app.', rating: 4.9, ownerId: aisha.id },
    { title: 'UI Design Feedback', category: 'design', description: 'Get a design review and learn layout, spacing and colour.', rating: 4.8, ownerId: aisha.id },
    { title: 'Excel & Google Sheets', category: 'business', description: 'Formulas, pivot tables and clean dashboards.', rating: 4.7, ownerId: marco.id },
    { title: 'Conversational Italian', category: 'languages', description: 'Practical phrases and pronunciation for travel.', rating: 5.0, ownerId: marco.id },
  ];

  for (const skill of demoSkills) {
    // Avoid duplicating skills on repeat runs.
    const existing = await prisma.skill.findFirst({ where: { title: skill.title, ownerId: skill.ownerId } });
    if (!existing) await prisma.skill.create({ data: skill });
  }

  console.log('🌱 Seed complete. Demo login: aisha@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

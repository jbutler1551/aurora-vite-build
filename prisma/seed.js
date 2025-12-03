import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a demo team
  const team = await prisma.team.upsert({
    where: { id: 'demo-team-id' },
    update: {},
    create: {
      id: 'demo-team-id',
      name: 'Demo Team',
      monthlyAnalysisLimit: 50,
    },
  });

  console.log('Created team:', team.name);

  // Create a demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@aurora.ai' },
    update: {},
    create: {
      email: 'demo@aurora.ai',
      name: 'Demo User',
      passwordHash: hashedPassword,
      role: 'admin',
      teamId: team.id,
    },
  });

  console.log('Created user:', user.email);

  // Create a demo company
  const company = await prisma.company.upsert({
    where: { domain_teamId: { domain: 'example.com', teamId: team.id } },
    update: {},
    create: {
      name: 'Example Corp',
      domain: 'example.com',
      url: 'https://example.com',
      industry: 'Technology',
      teamId: team.id,
    },
  });

  console.log('Created company:', company.name);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

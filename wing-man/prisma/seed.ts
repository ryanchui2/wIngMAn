import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import "dotenv/config";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (optional - be careful in production!)
  await prisma.datePlan.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create test users
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
      profile: {
        create: {
          location: 'San Francisco, CA',
          interests: JSON.stringify(['hiking', 'coffee', 'museums', 'live music']),
          budget: 'medium',
          dietaryRestrictions: JSON.stringify(['vegetarian']),
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      name: 'Jane Smith',
      profile: {
        create: {
          location: 'New York, NY',
          interests: JSON.stringify(['theater', 'wine tasting', 'art galleries']),
          budget: 'high',
          dietaryRestrictions: JSON.stringify([]),
        },
      },
    },
  });

  // Create sample date plans for user1
  await prisma.datePlan.createMany({
    data: [
      {
        userId: user1.id,
        title: 'Coffee and Park Walk',
        query: 'casual coffee date with a walk',
        response: 'Start with coffee at Blue Bottle at 2pm, then walk through Golden Gate Park. Backup: If weather is bad, head to the de Young Museum instead. Keep it light and fun! ☕',
        favorite: true,
        completed: true,
      },
      {
        userId: user1.id,
        title: 'Sunset Hike and Dinner',
        query: 'romantic outdoor date for weekend',
        response: 'Meet at Lands End trail at 4pm for sunset hike (about 1.5 hours). Then dinner at Cliff House restaurant by 6:30pm. Backup: If too windy, do Baker Beach instead. Bring a light jacket! 🌅',
        favorite: false,
        completed: false,
      },
      {
        userId: user1.id,
        title: 'Museum and Brunch',
        query: 'Sunday morning date idea',
        response: 'Brunch at Zazie in Cole Valley at 10am (make reservation!), then walk to California Academy of Sciences (opens at 11am). Plan for 2-3 hours at museum. Backup plan: SFMOMA if Academy is too crowded. 🎨',
        favorite: true,
        completed: false,
      },
    ],
  });

  // Create sample date plans for user2
  await prisma.datePlan.createMany({
    data: [
      {
        userId: user2.id,
        title: 'Broadway Show and Dinner',
        query: 'fancy date night in Manhattan',
        response: 'Dinner at Carbone at 6pm (make reservation 2 weeks ahead!), then Broadway show at 8pm. Dress nice! Backup: If show is sold out, try Lincoln Center for opera or ballet. 🎭',
        favorite: false,
        completed: true,
      },
    ],
  });

  console.log('✅ Seed completed successfully!');
  console.log(`Created ${await prisma.user.count()} users`);
  console.log(`Created ${await prisma.profile.count()} profiles`);
  console.log(`Created ${await prisma.datePlan.count()} date plans`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

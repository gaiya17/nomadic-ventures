const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRaw`ALTER TABLE "ResortVilla" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;`;
    console.log('Added order to ResortVilla');
  } catch (err) {
    console.log('ResortVilla error:', err.message);
  }

  try {
    await prisma.$executeRaw`ALTER TABLE "ResortRestaurant" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;`;
    console.log('Added order to ResortRestaurant');
  } catch (err) {
    console.log('ResortRestaurant error:', err.message);
  }
}

main().finally(() => prisma.$disconnect());

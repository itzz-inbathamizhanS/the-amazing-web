import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const chars = await prisma.character.findMany({
    where: {
      OR: [{ imageUrl: null }, { imageUrl: '' }]
    }
  });
  console.log(chars.map(c => c.id));
}

main().finally(() => prisma.$disconnect());

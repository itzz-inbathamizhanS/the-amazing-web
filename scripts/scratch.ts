import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const chars = await prisma.character.findMany({
    select: { id: true, name: true, earthId: true }
  });
  console.log("Total characters:", chars.length);
  const peters = chars.filter(c => c.name.includes('Peter') || c.id.includes('peter') || c.id.includes('maguire') || c.id.includes('holland') || c.id.includes('garfield') || c.name.includes('Spider-Man'));
  console.log(JSON.stringify(peters, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());

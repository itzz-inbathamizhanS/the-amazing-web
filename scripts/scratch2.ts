import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.character.findUnique({where: {id: 'peter-parker-tobey'}});
  console.log("URL:", p?.imageUrl);
  
  if (p?.imageUrl) {
    const res = await fetch(p.imageUrl);
    const text = await res.text();
    console.log("Content start:", text.substring(0, 50));
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const charsToFix = [
    'peter-parker-tobey', 'peter-parker-andrew', 'peter-parker-tom',
    'mary-jane-watson-raimi', 'green-goblin-raimi', 'doc-ock-raimi',
    'gwen-stacy-webb', 'lizard-webb', 'electro-webb',
    'mj-mcu', 'vulture-mcu', 'mysterio-mcu'
  ];

  for (const id of charsToFix) {
    await prisma.character.update({
      where: { id },
      data: { imageUrl: null }
    });
    console.log(`Cleared bad image for ${id}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

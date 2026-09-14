import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const mapping: Record<string, string> = {
    'spider-punk': '/images/characters/hobie-brown.jpg',
    'spider-noir': '/images/characters/spider-man-noir.jpg',
    'spider-ham': '/images/characters/peter-porker.jpg',
    'cindy-moon': '/images/characters/silk.jpg',
    'jessica-drew': '/images/characters/spider-woman.jpg',
    'ben-reilly': '/images/characters/scarlet-spider.jpg',
    'mayday-parker': '/images/characters/mayday-616b.jpg',
    'lyla-928': '/images/characters/lyla-928.jpg',
    'green-gobbler-8311': '/images/characters/green-gobbler-8311.jpg',
    'gayatri-singh-50101': '/images/characters/gayatri-singh-50101.jpg',
    'aunt-may-14512': '/images/characters/aunt-may-14512.jpg',
    'mj-616b': '/images/characters/mj-616b.jpg',
    'mayday-616b': '/images/characters/mayday-616b.jpg',
    'spider-girl-anya': '/images/characters/anya-corazon.jpg',
    'spider-girl-may': '/images/characters/mayday-parker.jpg',
    'anya-corazon': '/images/characters/anya-corazon.jpg',
  };

  for (const [id, imageUrl] of Object.entries(mapping)) {
    try {
      await prisma.character.update({
        where: { id },
        data: { imageUrl }
      });
      console.log(`Updated ${id}`);
    } catch (e) {
      // ignore if character doesn't exist
    }
  }
}

main().finally(() => prisma.$disconnect());

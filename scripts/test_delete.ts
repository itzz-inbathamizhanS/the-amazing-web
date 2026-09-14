import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  try {
    await prisma.movie.delete({ where: { id: 'amazing-spider-man-2012' } });
    console.log('success');
  } catch (e) {
    console.error(e);
  }
}
main().finally(() => prisma.$disconnect());

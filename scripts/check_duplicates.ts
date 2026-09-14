import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const movies = await prisma.movie.findMany({ select: { id: true, title: true } });
  console.log('MOVIES:');
  movies.forEach(m => console.log(m.id, '|', m.title));
  
  const events = await prisma.timelineEvent.findMany({ select: { id: true, title: true } });
  console.log('\nEVENTS:');
  events.forEach(e => console.log(e.id, '|', e.title));
}
main().finally(() => prisma.$disconnect());

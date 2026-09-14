import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const badMovieIds = [
    'amazing-spider-man-2012', 
    'amazing-spider-man-2-2014', 
    'civil-war-2016', 
    'far-from-home-2019', 
    'no-way-home-2021',
    'into-the-spider-verse',
    'across-the-spider-verse',
    'beyond-the-spider-verse'
  ];

  const badEventIds = [
    'no-way-home-event',
    'live-action-multiverse', // Replaced by the 8 individual movies
    'spider-verse-animated' // Replaced by individual movies
  ];

  console.log('Cleaning up duplicate movies...');
  for (const id of badMovieIds) {
    try {
      await prisma.characterMovie.deleteMany({ where: { movieId: id } });
      await prisma.actorMovie.deleteMany({ where: { movieId: id } });
      await prisma.movie.delete({ where: { id } });
      console.log(`Deleted movie: ${id}`);
    } catch(e: any) {
      console.log(`Failed to delete movie ${id}: ${e.message}`);
    }
  }

  console.log('\nCleaning up duplicate events...');
  for (const id of badEventIds) {
    try {
      await prisma.timelineEvent.delete({ where: { id } });
      console.log(`Deleted event: ${id}`);
    } catch {
      // ignore
    }
  }

  console.log('\nDone!');
}

main().finally(() => prisma.$disconnect());

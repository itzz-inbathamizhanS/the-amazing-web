import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Dumping data from SQLite...');
  
  const earths = await prisma.earth.findMany();
  const timelineEvents = await prisma.timelineEvent.findMany();
  const movies = await prisma.movie.findMany();
  const actors = await prisma.actor.findMany();
  
  const characters = await prisma.character.findMany({
    include: {
      timelineEvents: true,
      movies: true,
      relatedCharacters: true,
      relatedTo: true,
      attachments: true
    }
  });
  
  const characterTimelineEvents = await prisma.characterTimelineEvent.findMany();
  const characterMovies = await prisma.characterMovie.findMany();
  const actorMovies = await prisma.actorMovie.findMany();
  const relatedCharacters = await prisma.relatedCharacter.findMany();
  const comicAttachments = await prisma.comicAttachment.findMany();

  const data = {
    earths,
    timelineEvents,
    movies,
    actors,
    characters,
    characterTimelineEvents,
    characterMovies,
    actorMovies,
    relatedCharacters,
    comicAttachments
  };

  const outputPath = path.join(__dirname, 'sqlite_dump.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`Data successfully exported to ${outputPath}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

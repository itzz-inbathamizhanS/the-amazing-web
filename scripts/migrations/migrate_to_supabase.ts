import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import mime from 'mime-types';

dotenv.config();

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function uploadLocalImage(localPath: string): Promise<string | null> {
  if (!localPath || localPath.startsWith('http')) return localPath;
  
  let fullPath = '';
  if (localPath.startsWith('/images/')) {
    fullPath = path.join(__dirname, '..', 'Frontend', 'public', localPath.replace(/^\//, ''));
  } else if (localPath.startsWith('/uploads/')) {
    fullPath = path.join(__dirname, '..', localPath.replace(/^\//, ''));
  } else {
    fullPath = path.join(__dirname, '..', localPath);
  }

  if (!fs.existsSync(fullPath)) {
    console.warn('File not found locally:', fullPath);
    return localPath;
  }

  const fileBuffer = fs.readFileSync(fullPath);
  const fileName = path.basename(localPath);
  const uniqueName = `${Date.now()}-${fileName}`;
  const contentType = mime.lookup(fullPath) || 'application/octet-stream';

  try {
    const { error } = await supabase.storage
      .from('images')
      .upload(uniqueName, fileBuffer, { contentType });
      
    if (error) throw error;
    
    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(uniqueName);
      
    return publicUrlData.publicUrl;
  } catch (err) {
    console.error(`Failed to upload ${localPath}:`, err);
    return localPath;
  }
}

async function main() {
  console.log('Reading data from sqlite_dump.json...');
  const dumpPath = path.join(__dirname, 'sqlite_dump.json');
  if (!fs.existsSync(dumpPath)) {
    console.error('No sqlite_dump.json found. Aborting migration.');
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));

  console.log('Migrating Earths...');
  for (const earth of data.earths) {
    await prisma.earth.create({ data: earth });
  }

  console.log('Migrating Timeline Events...');
  for (const event of data.timelineEvents) {
    await prisma.timelineEvent.create({ data: event });
  }

  console.log('Migrating Movies...');
  for (const movie of data.movies) {
    await prisma.movie.create({ data: movie });
  }

  console.log('Migrating Actors...');
  for (const actor of data.actors) {
    await prisma.actor.create({ data: actor });
  }

  console.log('Migrating Characters and uploading images...');
  for (const char of data.characters) {
    if (char.imageUrl && !char.imageUrl.startsWith('http')) {
      char.imageUrl = await uploadLocalImage(char.imageUrl);
    }
    
    await prisma.character.create({
      data: {
        id: char.id,
        name: char.name,
        alias: char.alias,
        earthId: char.earthId,
        realName: char.realName,
        firstAppearance: char.firstAppearance,
        description: char.description,
        powers: char.powers,
        imageUrl: char.imageUrl,
        tags: char.tags
      }
    });
  }

  console.log('Migrating Relations...');
  for (const cte of data.characterTimelineEvents) await prisma.characterTimelineEvent.create({ data: cte });
  for (const cm of data.characterMovies) await prisma.characterMovie.create({ data: cm });
  for (const am of data.actorMovies) await prisma.actorMovie.create({ data: am });
  for (const rc of data.relatedCharacters) await prisma.relatedCharacter.create({ data: { characterId: rc.characterId, relatedCharacterId: rc.relatedCharacterId } });
  
  for (const att of data.comicAttachments) {
    if (att.filePath && !att.filePath.startsWith('http')) {
      att.filePath = await uploadLocalImage(att.filePath);
    }
    await prisma.comicAttachment.create({ data: att });
  }

  console.log('Migration complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location as string).then(resolve).catch(reject);
      }
      
      const data: Buffer[] = [];
      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function uploadToSupabase(buffer: Buffer, filename: string, contentType: string): Promise<string> {
  const uniqueName = `${Date.now()}-${filename}`;
  const { error } = await supabase.storage
    .from('images')
    .upload(uniqueName, buffer, { contentType });
    
  if (error) throw error;
  
  const { data: publicUrlData } = supabase.storage
    .from('images')
    .getPublicUrl(uniqueName);
    
  return publicUrlData.publicUrl;
}

const liveActionSpideys = [
  {
    id: 'peter-parker-tobey',
    name: 'Peter Parker (Tobey Maguire)',
    earthId: 'earth-96283',
    earthName: 'Earth-96283 (Raimi)',
    earthHex: '#a30000',
    description: 'The Friendly Neighborhood Spider-Man from the Sam Raimi trilogy.',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Spider-Man_%28Tobey_Maguire%29.png',
    filename: 'tobey.png',
    mime: 'image/png'
  },
  {
    id: 'peter-parker-andrew',
    name: 'Peter Parker (Andrew Garfield)',
    earthId: 'earth-120703',
    earthName: 'Earth-120703 (Webb)',
    earthHex: '#0055a3',
    description: 'The Amazing Spider-Man from the Marc Webb films.',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e0/Andrew_Garfield_as_Spider-Man.jpg',
    filename: 'andrew.jpg',
    mime: 'image/jpeg'
  },
  {
    id: 'peter-parker-tom',
    name: 'Peter Parker (Tom Holland)',
    earthId: 'earth-199999',
    earthName: 'Earth-199999 (MCU)',
    earthHex: '#ffcc00',
    description: 'The Spider-Man of the Marvel Cinematic Universe.',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f6/Spider-Man_%28Tom_Holland%29.png',
    filename: 'tom.png',
    mime: 'image/png'
  }
];

async function main() {
  for (const spidey of liveActionSpideys) {
    console.log(`Processing ${spidey.name}...`);
    
    // 1. Download and Upload Image
    console.log(`Downloading image from ${spidey.imgUrl}...`);
    const buffer = await downloadImage(spidey.imgUrl);
    console.log(`Uploading to Supabase...`);
    const cloudUrl = await uploadToSupabase(buffer, spidey.filename, spidey.mime);
    
    // 2. Upsert Earth
    await prisma.earth.upsert({
      where: { id: spidey.earthId },
      update: {},
      create: {
        id: spidey.earthId,
        designation: spidey.earthName,
        description: `Live-action universe: ${spidey.earthName}`,
      }
    });

    // 3. Upsert Character
    await prisma.character.upsert({
      where: { id: spidey.id },
      update: {
        imageUrl: cloudUrl,
        description: spidey.description
      },
      create: {
        id: spidey.id,
        name: spidey.name,
        alias: 'Spider-Man',
        earthId: spidey.earthId,
        realName: 'Peter Parker',
        description: spidey.description,
        imageUrl: cloudUrl,
      }
    });
    
    // 4. Link to Main Peter Parker (earth-616)
    // First ensure no duplicate link exists
    const existingLink = await prisma.relatedCharacter.findFirst({
      where: {
        characterId: 'peter-parker',
        relatedCharacterId: spidey.id
      }
    });
    
    if (!existingLink) {
      await prisma.relatedCharacter.create({
        data: {
          characterId: 'peter-parker',
          relatedCharacterId: spidey.id
        }
      });
      // And link back
      await prisma.relatedCharacter.create({
        data: {
          characterId: spidey.id,
          relatedCharacterId: 'peter-parker'
        }
      });
    }

    console.log(`Successfully added ${spidey.name}!\n`);
  }
  
  console.log("All live-action characters added to the database!");
}

main().catch(console.error).finally(() => prisma.$disconnect());

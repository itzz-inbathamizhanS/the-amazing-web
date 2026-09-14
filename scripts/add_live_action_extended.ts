import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';

dotenv.config();

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function downloadImage(url: string): Promise<Buffer | null> {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location as string).then(resolve);
      }
      
      if (res.statusCode !== 200) {
        console.warn(`Failed to download ${url}: ${res.statusCode}`);
        return resolve(null);
      }
      
      const data: Buffer[] = [];
      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
      res.on('error', () => resolve(null));
    }).on('error', () => resolve(null));
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

const characters = [
  // Raimi (earth-96283) linked to peter-parker-tobey
  {
    id: 'mary-jane-watson-raimi',
    name: 'Mary Jane Watson',
    earthId: 'earth-96283',
    description: 'The love of Peter Parker’s life in the Raimi universe.',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Kirsten_Dunst_Cannes_2016_3.jpg',
    filename: 'mj-raimi.jpg',
    mime: 'image/jpeg',
    linkedTo: 'peter-parker-tobey'
  },
  {
    id: 'green-goblin-raimi',
    name: 'Norman Osborn / Green Goblin',
    earthId: 'earth-96283',
    description: 'A wealthy industrialist driven insane by his own performance-enhancing serum.',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e1/Green_Goblin_%28Willem_Dafoe%29.png',
    filename: 'goblin.png',
    mime: 'image/png',
    linkedTo: 'peter-parker-tobey'
  },
  {
    id: 'doc-ock-raimi',
    name: 'Otto Octavius / Doc Ock',
    earthId: 'earth-96283',
    description: 'A brilliant scientist whose mind was corrupted by his mechanical tentacles.',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/en/2/23/Doctor_Octopus_%28Alfred_Molina%29.png',
    filename: 'doc-ock.png',
    mime: 'image/png',
    linkedTo: 'peter-parker-tobey'
  },
  // Webb (earth-120703) linked to peter-parker-andrew
  {
    id: 'gwen-stacy-webb',
    name: 'Gwen Stacy',
    earthId: 'earth-120703',
    description: 'A brilliant student and Peter Parker’s first true love in the Webb universe.',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Emma_Stone_at_the_30th_Annual_Producers_Guild_Awards_%28cropped%29.jpg',
    filename: 'gwen.jpg',
    mime: 'image/jpeg',
    linkedTo: 'peter-parker-andrew'
  },
  {
    id: 'lizard-webb',
    name: 'Curt Connors / The Lizard',
    earthId: 'earth-120703',
    description: 'A scientist who transformed into a monstrous lizard after injecting himself with reptilian DNA.',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e0/Lizard_%28The_Amazing_Spider-Man%29.png',
    filename: 'lizard.png',
    mime: 'image/png',
    linkedTo: 'peter-parker-andrew'
  },
  {
    id: 'electro-webb',
    name: 'Max Dillon / Electro',
    earthId: 'earth-120703',
    description: 'An electrical engineer who gained the power to manipulate electricity after an accident.',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/en/1/10/Electro_%28Jamie_Foxx%29.png',
    filename: 'electro.png',
    mime: 'image/png',
    linkedTo: 'peter-parker-andrew'
  },
  // MCU (earth-199999) linked to peter-parker-tom
  {
    id: 'mj-mcu',
    name: 'Michelle "MJ" Jones',
    earthId: 'earth-199999',
    description: 'A highly intelligent, deadpan classmate who uncovers Peter’s secret.',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Zendaya_at_the_2019_MTV_Movie_and_TV_Awards.jpg',
    filename: 'mj-mcu.jpg',
    mime: 'image/jpeg',
    linkedTo: 'peter-parker-tom'
  },
  {
    id: 'vulture-mcu',
    name: 'Adrian Toomes / Vulture',
    earthId: 'earth-199999',
    description: 'A blue-collar worker turned arms dealer using Chitauri technology.',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/en/6/65/Vulture_%28Michael_Keaton%29.png',
    filename: 'vulture.png',
    mime: 'image/png',
    linkedTo: 'peter-parker-tom'
  },
  {
    id: 'mysterio-mcu',
    name: 'Quentin Beck / Mysterio',
    earthId: 'earth-199999',
    description: 'A disgruntled former Stark Industries employee who uses advanced drones to simulate magic.',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/en/7/77/Mysterio_%28Jake_Gyllenhaal%29.png',
    filename: 'mysterio.png',
    mime: 'image/png',
    linkedTo: 'peter-parker-tom'
  }
];

async function main() {
  for (const c of characters) {
    console.log(`Processing ${c.name}...`);
    
    // 1. Download and Upload Image
    let cloudUrl = null;
    console.log(`Downloading image from ${c.imgUrl}...`);
    const buffer = await downloadImage(c.imgUrl);
    
    if (buffer) {
      console.log(`Uploading to Supabase...`);
      cloudUrl = await uploadToSupabase(buffer, c.filename, c.mime);
    } else {
      console.log(`Failed to download image. Falling back to default.`);
    }
    
    // 2. Upsert Character
    await prisma.character.upsert({
      where: { id: c.id },
      update: {
        description: c.description,
        ...(cloudUrl ? { imageUrl: cloudUrl } : {})
      },
      create: {
        id: c.id,
        name: c.name,
        earthId: c.earthId,
        description: c.description,
        imageUrl: cloudUrl, // might be null, which is fine
      }
    });
    
    // 3. Link to their Spider-Man
    const existingLink = await prisma.relatedCharacter.findFirst({
      where: {
        characterId: c.linkedTo,
        relatedCharacterId: c.id
      }
    });
    
    if (!existingLink) {
      await prisma.relatedCharacter.create({
        data: {
          characterId: c.linkedTo,
          relatedCharacterId: c.id
        }
      });
      // Bidirectional link
      await prisma.relatedCharacter.create({
        data: {
          characterId: c.id,
          relatedCharacterId: c.linkedTo
        }
      });
    }

    console.log(`Successfully added ${c.name}!\n`);
  }
  
  console.log("All extended live-action characters added to the database!");
}

main().catch(console.error).finally(() => prisma.$disconnect());

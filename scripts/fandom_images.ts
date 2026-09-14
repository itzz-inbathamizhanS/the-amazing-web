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

async function downloadFromFandom(url: string): Promise<Buffer | null> {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        console.warn(`Fandom returned ${res.statusCode} for ${url}`);
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
  {
    id: 'peter-parker-tobey',
    url: 'https://static.wikia.nocookie.net/marveldatabase/images/3/3a/Peter_Parker_%28Earth-96283%29_from_Spider-Man_3_%28film%29_poster_001.jpg',
    filename: 'tobey-fandom.jpg'
  },
  {
    id: 'peter-parker-andrew',
    url: 'https://static.wikia.nocookie.net/marveldatabase/images/7/7f/The_Amazing_Spider-Man_2_%28film%29_poster_001_textless.jpg',
    filename: 'andrew-fandom.jpg'
  },
  {
    id: 'peter-parker-tom',
    url: 'https://static.wikia.nocookie.net/marveldatabase/images/e/e0/Peter_Parker_%28Earth-199999%29_from_Spider-Man_No_Way_Home_Promo_001.png',
    filename: 'tom-fandom.png'
  }
];

async function main() {
  for (const c of characters) {
    console.log(`Processing ${c.id}...`);
    const buffer = await downloadFromFandom(c.url);
    if (buffer) {
      console.log(`-> Uploading ${buffer.length} bytes to Supabase...`);
      try {
        const cloudUrl = await uploadToSupabase(buffer, c.filename, c.filename.endsWith('.png') ? 'image/png' : 'image/jpeg');
        await prisma.character.update({
          where: { id: c.id },
          data: { imageUrl: cloudUrl }
        });
        console.log(`-> Updated DB for ${c.id}!`);
      } catch (err) {
        console.error(`-> Supabase upload failed for ${c.id}:`, err);
      }
    } else {
      console.log(`-> Failed to retrieve from Fandom.`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

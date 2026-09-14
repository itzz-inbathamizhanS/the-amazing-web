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

// Helper to fetch via Wayback Machine to avoid Wikipedia 429 bots
async function downloadViaWayback(originalUrl: string): Promise<Buffer | null> {
  const waybackUrl = `https://web.archive.org/web/2/${originalUrl}`;
  return new Promise((resolve) => {
    const fetchUrl = (url: string) => {
      https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
          const location = res.headers.location;
          if (location) {
            // Archive.org sometimes returns relative paths like /web/2026...
            const nextUrl = location.startsWith('/') ? `https://web.archive.org${location}` : location;
            return fetchUrl(nextUrl);
          }
        }
        
        if (res.statusCode !== 200) {
          console.warn(`Wayback returned ${res.statusCode} for ${url}`);
          return resolve(null);
        }
        
        const data: Buffer[] = [];
        res.on('data', (chunk) => data.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(data);
          // Prevent downloading HTML pages masked as 200s (wayback error pages)
          const isHtml = res.headers['content-type']?.includes('text/html') || buffer.toString('utf8', 0, 100).includes('<html');
          if (isHtml) return resolve(null);
          resolve(buffer);
        });
        res.on('error', () => resolve(null));
      }).on('error', () => resolve(null));
    };
    fetchUrl(waybackUrl);
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
    imgUrl: 'https://upload.wikimedia.org/wikipedia/en/b/bf/Tobey_Maguire_as_Spider-Man.jpg',
    filename: 'tobey.jpg',
    mime: 'image/jpeg'
  },
  {
    id: 'peter-parker-andrew',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Andrew_Garfield_by_Gage_Skidmore_%28cropped%29.jpg',
    filename: 'andrew.jpg',
    mime: 'image/jpeg'
  },
  {
    id: 'peter-parker-tom',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Tom_Holland_%2828652884235%29_%28cropped%29.jpg',
    filename: 'tom.jpg',
    mime: 'image/jpeg'
  },
  {
    id: 'mary-jane-watson-raimi',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Kirsten_Dunst_Cannes_2016_3.jpg',
    filename: 'mj-raimi.jpg',
    mime: 'image/jpeg'
  },
  {
    id: 'green-goblin-raimi',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e1/Green_Goblin_%28Willem_Dafoe%29.png',
    filename: 'goblin.png',
    mime: 'image/png'
  },
  {
    id: 'doc-ock-raimi',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/en/2/23/Doctor_Octopus_%28Alfred_Molina%29.png',
    filename: 'doc-ock.png',
    mime: 'image/png'
  },
  {
    id: 'gwen-stacy-webb',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Emma_Stone_at_the_30th_Annual_Producers_Guild_Awards_%28cropped%29.jpg',
    filename: 'gwen.jpg',
    mime: 'image/jpeg'
  },
  {
    id: 'lizard-webb',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e0/Lizard_%28The_Amazing_Spider-Man%29.png',
    filename: 'lizard.png',
    mime: 'image/png'
  },
  {
    id: 'electro-webb',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/en/1/10/Electro_%28Jamie_Foxx%29.png',
    filename: 'electro.png',
    mime: 'image/png'
  },
  {
    id: 'mj-mcu',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Zendaya_at_the_2019_MTV_Movie_and_TV_Awards.jpg',
    filename: 'mj-mcu.jpg',
    mime: 'image/jpeg'
  },
  {
    id: 'vulture-mcu',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/en/6/65/Vulture_%28Michael_Keaton%29.png',
    filename: 'vulture.png',
    mime: 'image/png'
  },
  {
    id: 'mysterio-mcu',
    imgUrl: 'https://upload.wikimedia.org/wikipedia/en/7/77/Mysterio_%28Jake_Gyllenhaal%29.png',
    filename: 'mysterio.png',
    mime: 'image/png'
  }
];

async function main() {
  for (const c of characters) {
    console.log(`Processing ${c.id}...`);
    const buffer = await downloadViaWayback(c.imgUrl);
    
    if (buffer) {
      console.log(`-> Found on Wayback, uploading ${buffer.length} bytes to Supabase...`);
      try {
        const cloudUrl = await uploadToSupabase(buffer, c.filename, c.mime);
        await prisma.character.update({
          where: { id: c.id },
          data: { imageUrl: cloudUrl }
        });
        console.log(`-> Successfully updated DB with cloud URL!`);
      } catch (err) {
        console.error(`-> Supabase upload failed for ${c.id}:`, err);
      }
    } else {
      console.log(`-> Failed to retrieve from Wayback Machine.`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

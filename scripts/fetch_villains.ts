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

const targets = [
  { id: 'gwen-stacy-webb', wikiTitle: 'Gwendolyne_Stacy_(Earth-120703)' },
  { id: 'mj-mcu', wikiTitle: 'Michelle_Jones_(Earth-199999)' }
];

function getImageUrlFromWiki(title: string): Promise<string | null> {
  return new Promise((resolve) => {
    const apiUrl = `https://marvel.fandom.com/api.php?action=query&prop=pageimages&titles=${title}&format=json&pithumbsize=1000`;
    https.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pageId === '-1' || !pages[pageId].thumbnail) {
            resolve(null);
          } else {
            // Remove the revision param to get original size or keep it, it's fine.
            let url = pages[pageId].thumbnail.source;
            // Clean URL from /revision/latest/...
            if (url.includes('/revision/latest')) {
              url = url.split('/revision/latest')[0];
            }
            resolve(url);
          }
        } catch (e) {
          resolve(null);
        }
      });
      res.on('error', () => resolve(null));
    }).on('error', () => resolve(null));
  });
}

function downloadImage(url: string): Promise<Buffer | null> {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        return resolve(null);
      }
      const data: Buffer[] = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
      res.on('error', () => resolve(null));
    }).on('error', () => resolve(null));
  });
}

async function main() {
  for (const t of targets) {
    console.log(`\nFetching ${t.id}...`);
    const imgUrl = await getImageUrlFromWiki(t.wikiTitle);
    if (!imgUrl) {
      console.log(`❌ Could not find Fandom image for ${t.wikiTitle}`);
      continue;
    }

    console.log(`-> Found image: ${imgUrl}`);
    const buffer = await downloadImage(imgUrl);
    
    if (!buffer) {
      console.log(`❌ Failed to download ${imgUrl}`);
      continue;
    }

    const filename = imgUrl.split('/').pop() || `${t.id}.jpg`;
    const uniqueName = `${Date.now()}-${filename}`;
    const contentType = imgUrl.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

    console.log(`-> Uploading ${buffer.length} bytes to Supabase...`);
    try {
      const { error } = await supabase.storage
        .from('images')
        .upload(uniqueName, buffer, { contentType });
        
      if (error) throw error;
      
      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(uniqueName);
        
      await prisma.character.update({
        where: { id: t.id },
        data: { imageUrl: publicUrlData.publicUrl }
      });
      
      console.log(`✅ Updated DB for ${t.id}!`);
    } catch (err: any) {
      console.error(`❌ Upload failed: ${err.message}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

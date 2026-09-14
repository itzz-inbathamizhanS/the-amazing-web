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
  console.log('Fetching characters from Supabase DB to find local images...');
  const characters = await prisma.character.findMany();
  
  let updatedCount = 0;
  for (const char of characters) {
    if (char.imageUrl && !char.imageUrl.startsWith('http')) {
      console.log(`Uploading image for ${char.name}...`);
      const cloudUrl = await uploadLocalImage(char.imageUrl);
      
      if (cloudUrl && cloudUrl !== char.imageUrl) {
        await prisma.character.update({
          where: { id: char.id },
          data: { imageUrl: cloudUrl }
        });
        updatedCount++;
        console.log(`-> Success: ${cloudUrl}`);
      }
    }
  }

  console.log(`\nFinished! Successfully uploaded and linked ${updatedCount} images to Supabase.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const chars = await prisma.character.findMany({
    include: { earth: true },
    orderBy: [{ earthId: 'asc' }, { name: 'asc' }]
  });
  
  let md = '# Character Image Mapping Checklist\n\n';
  md += 'Use this checklist to manually download and name images for characters. Place all downloaded images in the `Frontend/public/images/characters/` folder.\n\n';
  md += '| Character Name | Universe (Earth) | Expected Filename | Status |\n';
  md += '|---|---|---|---|\n';
  
  for (const c of chars) {
    let expectedFile = c.id + '.jpg';
    if (c.imageUrl && c.imageUrl.includes('/images/characters/')) {
      expectedFile = c.imageUrl.split('/').pop() || expectedFile;
    }
    
    // Check if the file actually exists
    const imgPath = path.join(__dirname, '..', 'Frontend', 'public', 'images', 'characters', expectedFile);
    const exists = fs.existsSync(imgPath);
    const status = exists ? '✅ Exists' : '❌ Missing';
    
    md += `| **${c.name}** | ${c.earthId || 'Unknown'} | \`${expectedFile}\` | ${status} |\n`;
  }
  
  fs.writeFileSync('C:/Users/itzzi/.gemini/antigravity-ide/brain/9b3dbc43-ee34-4e0d-95b8-76f07036a5c3/character_image_checklist.md', md);
  console.log('Markdown checklist generated.');
}

main().finally(() => prisma.$disconnect());

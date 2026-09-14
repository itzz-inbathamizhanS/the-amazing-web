import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const chars = await prisma.character.findMany({
    include: { earth: true },
    orderBy: [{ earthId: 'asc' }, { name: 'asc' }]
  });
  
  let md = '# Complete Image Download Checklist\n\n';
  md += 'Here is the full table of all characters, their universe, their tags, and the exact photo filename you should use when manually downloading images.\n\n';
  md += '> [!TIP]\n> Search this document using `Ctrl+F` to find specific characters you want to download photos for. Save the downloaded photo into your `Frontend/public/images/characters/` folder using the exact name listed in the **Photo Filename** column.\n\n';
  md += '| Character | Universe (Earth) | Tags/Role | Photo Filename | Status |\n';
  md += '|---|---|---|---|---|\n';
  
  for (const c of chars) {
    let expectedFile = c.id + '.jpg';
    if (c.imageUrl && c.imageUrl.includes('/images/characters/')) {
      expectedFile = c.imageUrl.split('/').pop() || expectedFile;
    }
    
    // Check if the file actually exists
    const imgPath = require('path').join(__dirname, '..', 'Frontend', 'public', 'images', 'characters', expectedFile);
    const exists = fs.existsSync(imgPath);
    const status = exists ? '✅ Downloaded' : '❌ Needs Download';

    // Clean up tags for display
    const tags = c.tags ? c.tags.split(',').map(t => t.trim().charAt(0).toUpperCase() + t.trim().slice(1)).join(', ') : 'None';
    
    md += `| **${c.name}** | ${c.earth?.designation || 'Unknown'} (${c.earthId || 'N/A'}) | ${tags} | \`${expectedFile}\` | ${status} |\n`;
  }
  
  fs.writeFileSync('C:/Users/itzzi/.gemini/antigravity-ide/brain/9b3dbc43-ee34-4e0d-95b8-76f07036a5c3/image_download_checklist.md', md);
  console.log('Image table generated.');
}

main().finally(() => prisma.$disconnect());

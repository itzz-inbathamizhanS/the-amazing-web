import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const earths = await prisma.earth.findMany({ orderBy: { designation: 'asc' } });
  const chars = await prisma.character.findMany({ include: { earth: true } });
  const relations = await prisma.relatedCharacter.findMany();

  // Create lookup maps
  const charMap = new Map(chars.map(c => [c.id, c]));
  const relationsMap = new Map<string, string[]>();

  for (const r of relations) {
    if (!relationsMap.has(r.characterId)) relationsMap.set(r.characterId, []);
    relationsMap.get(r.characterId)!.push(r.relatedCharacterId);
  }

  let md = '# Spider-Verse Network & Image Checklist\n\n';
  md += 'This document provides a full breakdown of every Spider-Man, their universe, and their categorized relationships (Villains, Allies, Lovers), followed by a network analysis and your image download checklist.\n\n';

  let checklistMd = '## 🖼️ Image Download Checklist\n\n| Character | Universe | Role | Expected Filename | Status |\n|---|---|---|---|---|\n';

  for (const earth of earths) {
    const earthChars = chars.filter(c => c.earthId === earth.id);
    if (earthChars.length === 0) continue;

    md += `---\n\n## 🌍 ${earth.designation} (${earth.id})\n\n`;

    // Try to find the "Main" Spider-character for this Earth (usually has 'spider' in tags/id or is the most connected)
    // Simple heuristic: The character with the most relations in this Earth, or first character
    let mainSpidey = earthChars.find(c => c.id.includes('spider') || c.id.includes('parker') || c.id.includes('morales') || c.id.includes('gwen') || c.id.includes('miguel'));
    if (!mainSpidey) mainSpidey = earthChars[0];

    md += `### 🕷️ Primary Hero: **${mainSpidey.name}**\n\n`;

    const relatedIds = relationsMap.get(mainSpidey.id) || [];
    const relatedChars = relatedIds.map(id => charMap.get(id)).filter(c => c !== undefined) as typeof chars;

    const villains = relatedChars.filter(c => c.tags.includes('villain'));
    const allies = relatedChars.filter(c => !c.tags.includes('villain')); // Treating non-villains as allies/friends/lovers

    md += '#### 👿 Villains\n';
    if (villains.length > 0) {
      villains.forEach(v => md += `- **${v.name}**\n`);
    } else {
      md += '- *None documented*\n';
    }

    md += '\n#### 🤝 Allies & Lovers\n';
    if (allies.length > 0) {
      allies.forEach(a => md += `- **${a.name}**\n`);
    } else {
      md += '- *None documented*\n';
    }

    // Mermaid Graph for this Earth
    md += '\n#### 🕸️ Relational Tree (Network)\n';
    md += '```mermaid\ngraph TD;\n';
    
    // Nodes
    const nodeIds = new Set<string>();
    nodeIds.add(mainSpidey.id);
    relatedChars.forEach(c => nodeIds.add(c.id));
    
    nodeIds.forEach(id => {
      const c = charMap.get(id)!;
      let shape = c.tags.includes('villain') ? '}}' : ')]'; // Hexagon for villains, pill for allies
      let openShape = c.tags.includes('villain') ? '{{' : '([';
      md += `  ${id}${openShape}"${c.name}"${shape};\n`;
    });

    // Edges
    relatedChars.forEach(c => {
      md += `  ${mainSpidey!.id} --- ${c.id};\n`;
    });
    
    // Intra-relations among allies/villains in the same universe
    for (const c of relatedChars) {
      const cRels = relationsMap.get(c.id) || [];
      for (const crId of cRels) {
        if (nodeIds.has(crId) && crId !== mainSpidey.id && crId > c.id) { // Avoid duplicate edges
           md += `  ${c.id} -.- ${crId};\n`;
        }
      }
    }
    
    md += '```\n\n';

    // Populate checklist for these characters
    for (const c of earthChars) {
      let expectedFile = c.id + '.jpg';
      if (c.imageUrl && c.imageUrl.includes('/images/characters/')) {
        expectedFile = c.imageUrl.split('/').pop() || expectedFile;
      }
      
      const imgPath = fs.existsSync('C:/Users/itzzi/.gemini/antigravity-ide/brain/9b3dbc43-ee34-4e0d-95b8-76f07036a5c3/scratch/' + expectedFile) || 
                      fs.existsSync(`../Frontend/public/images/characters/${expectedFile}`);
      const status = imgPath ? '✅ Exists' : '❌ Missing';
      const role = c.tags.includes('villain') ? '👿 Villain' : (c.id === mainSpidey.id ? '🕷️ Hero' : '🤝 Ally/Friend');
      
      checklistMd += `| **${c.name}** | ${earth.id} | ${role} | \`${expectedFile}\` | ${status} |\n`;
    }
  }

  // Cross-universe characters or those without Earth (if any)
  const unknownChars = chars.filter(c => !c.earthId);
  if (unknownChars.length > 0) {
    for (const c of unknownChars) {
      let expectedFile = c.id + '.jpg';
      if (c.imageUrl && c.imageUrl.includes('/images/characters/')) {
        expectedFile = c.imageUrl.split('/').pop() || expectedFile;
      }
      const role = c.tags.includes('villain') ? '👿 Villain' : '🤝 Ally/Friend';
      checklistMd += `| **${c.name}** | Unknown | ${role} | \`${expectedFile}\` | ❌ Check manually |\n`;
    }
  }

  md += checklistMd;

  fs.writeFileSync('C:/Users/itzzi/.gemini/antigravity-ide/brain/9b3dbc43-ee34-4e0d-95b8-76f07036a5c3/spider_network_analysis.md', md);
  console.log('Network analysis generated.');
}

main().finally(() => prisma.$disconnect());

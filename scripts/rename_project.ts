import * as fs from 'fs';
import * as path from 'path';

const searchDir = path.resolve('d:/Spider/Frontend/src');

function walk(dir: string, fileCallback: (filepath: string) => void) {
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat && stat.isDirectory()) {
      walk(filepath, fileCallback);
    } else {
      fileCallback(filepath);
    }
  });
}

let changedCount = 0;

walk(searchDir, (filepath) => {
  if (!filepath.endsWith('.tsx') && !filepath.endsWith('.ts')) return;

  const content = fs.readFileSync(filepath, 'utf8');
  if (content.includes('Branching Web') || content.includes('BRANCHING WEB') || content.includes('branching web')) {
    let newContent = content.replace(/Branching Web/g, 'Amazing Web');
    newContent = newContent.replace(/BRANCHING WEB/g, 'AMAZING WEB');
    newContent = newContent.replace(/branching web/g, 'amazing web');
    
    fs.writeFileSync(filepath, newContent, 'utf8');
    console.log(`Updated ${filepath}`);
    changedCount++;
  }
});

console.log(`Finished renaming project in ${changedCount} files.`);

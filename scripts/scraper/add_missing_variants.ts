import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

const newEarths = [
  { id: 'earth-1048', name: 'Earth-1048', designation: 'Earth-1048' },
  { id: 'earth-13', name: 'Earth-13', designation: 'Earth-13' },
  { id: 'earth-51778', name: 'Earth-51778', designation: 'Earth-51778' },
  { id: 'earth-66', name: 'Earth-66', designation: 'Earth-66' },
  { id: 'earth-71490', name: 'Earth-71490', designation: 'Earth-71490' }
];

const newCharacters = [
  // Insomniac Spider-Man
  { id: 'insomniac-spidey', name: 'Spider-Man (Insomniac)', alias: 'Spider-Man', earth: 'earth-1048', realName: 'Peter Parker', firstAppearance: 'Marvel\'s Spider-Man (PS4)', description: 'The seasoned Peter Parker from the critically acclaimed PlayStation games.', powers: ['Spider abilities', 'Advanced gadgets'], tags: ['spider'] },
  // Cosmic Spider-Man
  { id: 'cosmic-spidey', name: 'Cosmic Spider-Man', alias: 'Captain Universe', earth: 'earth-13', realName: 'Peter Parker', firstAppearance: 'Amazing Spider-Man #329 (Variant)', description: 'A Peter Parker who retained the Enigma Force, possessing god-like cosmic powers. His universe was a safe haven during the Spider-Verse event.', powers: ['Uni-Power', 'Cosmic Manipulation', 'Spider abilities'], tags: ['spider'] },
  // Supaidaman
  { id: 'supaidaman', name: 'Supaidāman', alias: 'Spider-Man', earth: 'earth-51778', realName: 'Takuya Yamashiro', firstAppearance: 'Spider-Man (Toei TV Series)', description: 'The Emissary of Hell! A motorcycle racer who received powers from the last warrior of Planet Spider and pilots the giant mech Leopardon.', powers: ['Spider abilities', 'Pilots Leopardon'], tags: ['spider'] },
  // Spider-Rex
  { id: 'spider-rex', name: 'Spider-Rex', alias: 'Spider-Rex', earth: 'earth-66', realName: 'Pter Ptarker', firstAppearance: 'Edge of Spider-Verse (Vol. 2) #1', description: 'A Pteranodon who swapped bodies with a T-Rex that was bitten by a radioactive meteor containing alien spiders.', powers: ['Dinosaur physiology', 'Spider abilities'], tags: ['spider'] },
  // Web-Weaver
  { id: 'web-weaver', name: 'Web-Weaver', alias: 'Web-Weaver', earth: 'earth-71490', realName: 'Cooper Coen', firstAppearance: 'Edge of Spider-Verse (Vol. 2) #5', description: 'A fabulous fashion designer who gained spider powers and fights crime in style.', powers: ['Spider abilities', 'Fashion sense'], tags: ['spider'] }
];

const targets = [
  { id: 'insomniac-spidey', page: 'Peter_Parker_(Earth-1048)' },
  { id: 'cosmic-spidey', page: 'Peter_Parker_(Earth-13)' },
  { id: 'supaidaman', page: 'Takuya_Yamashiro_(Earth-51778)' },
  { id: 'spider-rex', page: 'Pter_Ptarker_(Earth-66)' },
  { id: 'web-weaver', page: 'Cooper_Coen_(Earth-71490)' }
];

async function fetchPageHtml(pageTitle: string): Promise<any> {
  const url = `https://marvel.fandom.com/api.php?action=parse&page=${encodeURIComponent(pageTitle)}&redirects=1&format=json`;
  const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (response.data.error) throw new Error(response.data.error.info);
  return response.data.parse;
}

function extractInfobox($: cheerio.CheerioAPI, parseData: any, target: any) {
  let imgUrl = '';
  const fallbackImg = $('aside.portable-infobox img').first();
  imgUrl = fallbackImg.attr('src') || fallbackImg.attr('data-src') || '';
  if (imgUrl && imgUrl.includes('/revision/latest')) {
    imgUrl = imgUrl.split('/scale-to-width-down')[0];
  }
  return { imageUrl: imgUrl };
}

async function main() {
  console.log('Seeding new variants...');
  
  for (const e of newEarths) {
    await prisma.earth.upsert({
      where: { id: e.id },
      update: {},
      create: { id: e.id, designation: e.designation }
    });
  }

  for (const c of newCharacters) {
    await prisma.character.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        name: c.name,
        alias: c.alias,
        earthId: c.earth,
        realName: c.realName,
        firstAppearance: c.firstAppearance,
        description: c.description,
        powers: c.powers.join(', '),
        tags: c.tags.join(', '),
      },
    });
  }

  console.log('Scraping extra images...');
  for (const target of targets) {
    try {
      console.log(`\nFetching ${target.page}...`);
      const parseData = await fetchPageHtml(target.page);
      const $ = cheerio.load(parseData.text['*']);
      
      const infobox = extractInfobox($, parseData, target);

      let localImageUrl = '';
      if (infobox.imageUrl) {
        try {
          const imgResponse = await axios.get(infobox.imageUrl, { responseType: 'arraybuffer' });
          const imgName = `${target.id}.jpg`;
          const imgPath = path.join(__dirname, '..', 'Frontend', 'public', 'images', 'characters', imgName);
          await fs.writeFile(imgPath, imgResponse.data);
          localImageUrl = `/images/characters/${imgName}`;
        } catch (e) {}
      }

      await prisma.character.update({
        where: { id: target.id },
        data: { imageUrl: localImageUrl || undefined }
      });
      console.log(`Successfully scraped: ${target.id}`);
    } catch (e) {
      console.error(`Failed to process ${target.page}:`, (e as Error).message);
    }
  }
}

main().finally(() => prisma.$disconnect());

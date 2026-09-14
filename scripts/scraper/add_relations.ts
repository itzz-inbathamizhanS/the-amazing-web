import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

const newCharacters = [
  // Peni Parker
  { id: 'uncle-ben-14512', name: 'Uncle Ben', alias: 'Uncle Ben', earth: 'earth-14512', realName: 'Ben Parker', firstAppearance: 'Edge of Spider-Verse #5', description: 'Co-creator of the SP//dr suit.', powers: [], tags: ['ally'] },
  { id: 'aunt-may-14512', name: 'Aunt May', alias: 'Aunt May', earth: 'earth-14512', realName: 'May Parker', firstAppearance: 'Edge of Spider-Verse #5', description: 'Peni\'s guardian.', powers: [], tags: ['ally'] },
  { id: 'venom-14512', name: 'VEN#m', alias: 'VEN#m', earth: 'earth-14512', realName: 'Addy Brock', firstAppearance: 'Edge of Spider-Geddon #2', description: 'Pilot of the VEN#m mech suit.', powers: ['Mech pilot'], tags: ['villain'] },

  // Spider-Woman
  { id: 'high-evolutionary', name: 'High Evolutionary', alias: 'High Evolutionary', earth: 'earth-616', realName: 'Herbert Wyndham', firstAppearance: 'Thor #134', description: 'The geneticist responsible for Jessica Drew\'s powers.', powers: ['Godlike intellect', 'Evolutionary armor'], tags: ['villain'] },
  { id: 'madame-hydra', name: 'Viper', alias: 'Madame Hydra', earth: 'earth-616', realName: 'Ophelia Sarkissian', firstAppearance: 'Captain America #110', description: 'Leader of HYDRA who manipulated Jessica.', powers: ['Master strategist'], tags: ['villain'] },

  // Scarlet Spider & Kaine
  { id: 'jackal-616', name: 'The Jackal', alias: 'The Jackal', earth: 'earth-616', realName: 'Miles Warren', firstAppearance: 'The Amazing Spider-Man #129', description: 'The mad geneticist who created the clones of Peter Parker.', powers: ['Genius geneticist'], tags: ['villain'] },

  // Silk
  { id: 'ezekiel-sims', name: 'Ezekiel Sims', alias: 'Ezekiel Sims', earth: 'earth-616', realName: 'Ezekiel Sims', firstAppearance: 'The Amazing Spider-Man (Vol. 2) #30', description: 'The man who locked Cindy Moon in a bunker to protect her.', powers: ['Spider abilities'], tags: ['ally'] },

  // Superior
  { id: 'anna-maria', name: 'Anna Maria Marconi', alias: 'Anna Maria', earth: 'earth-616', realName: 'Anna Maria Marconi', firstAppearance: 'The Superior Spider-Man #5', description: 'The brilliant scientist who fell in love with Otto Octavius while he was in Peter\'s body.', powers: ['Genius intellect'], tags: ['ally'] },

  // Peter B. Parker
  { id: 'mj-616b', name: 'Mary Jane Watson', alias: 'Mary Jane', earth: 'earth-616B', realName: 'Mary Jane Watson', firstAppearance: 'Into the Spider-Verse', description: 'Peter B. Parker\'s ex-wife, whom he reconciles with.', powers: [], tags: ['ally'] },
  { id: 'mayday-616b', name: 'Mayday Parker', alias: 'Mayday', earth: 'earth-616B', realName: 'Mayday Parker', firstAppearance: 'Across the Spider-Verse', description: 'The infant daughter of Peter B. Parker and Mary Jane.', powers: ['Spider abilities'], tags: ['ally'] }
];

const relationships = [
  ['peni-parker', 'uncle-ben-14512'],
  ['peni-parker', 'aunt-may-14512'],
  ['peni-parker', 'venom-14512'],

  ['spider-woman', 'high-evolutionary'],
  ['spider-woman', 'madame-hydra'],

  ['scarlet-spider', 'jackal-616'],
  ['kaine-parker', 'jackal-616'],

  ['silk', 'ezekiel-sims'],
  ['silk', 'black-cat'],

  ['doc-ock-superior', 'anna-maria'],

  ['peter-b-parker', 'mj-616b'],
  ['peter-b-parker', 'mayday-616b']
];

const targets = [
  { id: 'uncle-ben-14512', page: 'Benjamin_Parker_(Earth-14512)' },
  { id: 'aunt-may-14512', page: 'May_Parker_(Earth-14512)' },
  { id: 'venom-14512', page: 'Addy_Brock_(Earth-14512)' },
  { id: 'high-evolutionary', page: 'Herbert_Wyndham_(Earth-616)' },
  { id: 'madame-hydra', page: 'Ophelia_Sarkissian_(Earth-616)' },
  { id: 'jackal-616', page: 'Miles_Warren_(Earth-616)' },
  { id: 'ezekiel-sims', page: 'Ezekiel_Sims_(Earth-616)' },
  { id: 'anna-maria', page: 'Anna_Maria_Marconi_(Earth-616)' },
  
  // Retries for failed pages
  { id: 'gabriel-ohara-928', page: "Gabriel_O'Hara_(Earth-928)" },
  { id: 'lyla-928', page: 'Lyla_(Earth-928)' },
  { id: 'may-parker-90214', page: 'May_Reilly_(Earth-90214)' },
  { id: 'green-gobbler-8311', page: 'Norman_Osborn_(Earth-8311)' },
  { id: 'gayatri-singh-50101', page: 'Gayatri_(Earth-50101)' },
];

async function fetchPageHtml(pageTitle: string): Promise<any> {
  const url = `https://marvel.fandom.com/api.php?action=parse&page=${encodeURIComponent(pageTitle)}&redirects=1&format=json`;
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    }
  });
  if (response.data.error) {
    throw new Error(`Fandom API error for ${pageTitle}: ${response.data.error.info}`);
  }
  return response.data.parse;
}

function extractBio($: cheerio.CheerioAPI): string {
  let bio = '';
  const paragraphs = $('.mw-parser-output > p');
  paragraphs.each((i, el) => {
    if (i < 3) {
      const text = $(el).text().trim();
      if (text.length > 20) {
        bio += text.replace(/\[\d+\]/g, '') + '\n\n';
      }
    }
  });
  return bio.trim();
}

function extractInfobox($: cheerio.CheerioAPI, parseData: any, target: any) {
  const data: any = {};
  let imgUrl = '';
  let bestFilename = '';
  
  const searchName = target.page.split('_')[0].replace(/[^a-zA-Z]/g, '');
  if (parseData.images && parseData.images.length > 0) {
    for (const img of parseData.images) {
      if (img.toLowerCase().includes(searchName.toLowerCase())) {
        bestFilename = img;
        break;
      }
    }
  }

  if (bestFilename) {
    const imgEl = $(`img[src*="${encodeURIComponent(bestFilename).replace(/'/g, "%27")}"]`).first();
    if (imgEl.length) {
      imgUrl = imgEl.attr('src') || imgEl.attr('data-src');
    }
  }

  if (!imgUrl) {
    const imgElement = $('aside.portable-infobox img.pi-image-thumbnail').first();
    imgUrl = imgElement.attr('src') || imgElement.attr('data-src');
  }
  
  if (!imgUrl) {
    const fallbackImg = $('aside.portable-infobox img').first();
    imgUrl = fallbackImg.attr('src') || fallbackImg.attr('data-src');
  }

  if (imgUrl && imgUrl.includes('/revision/latest')) {
    imgUrl = imgUrl.split('/scale-to-width-down')[0];
  }
  data.imageUrl = imgUrl || '';
  return data;
}

async function main() {
  console.log('Seeding new characters into DB...');
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

  console.log('Linking relationships...');
  for (const [char1, char2] of relationships) {
    const exists1 = await prisma.relatedCharacter.findFirst({
      where: { characterId: char1, relatedCharacterId: char2 }
    });
    if (!exists1) {
      await prisma.relatedCharacter.create({
        data: { characterId: char1, relatedCharacterId: char2 }
      });
    }

    const exists2 = await prisma.relatedCharacter.findFirst({
      where: { characterId: char2, relatedCharacterId: char1 }
    });
    if (!exists2) {
      await prisma.relatedCharacter.create({
        data: { characterId: char2, relatedCharacterId: char1 }
      });
    }
  }

  console.log('Scraping extra images...');
  for (const target of targets) {
    try {
      console.log(`\nFetching ${target.page}...`);
      const parseData = await fetchPageHtml(target.page);
      const $ = cheerio.load(parseData.text['*']);
      
      const description = extractBio($);
      const infobox = extractInfobox($, parseData, target);

      let localImageUrl = infobox.imageUrl;
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
        data: {
          description: description || undefined,
          imageUrl: localImageUrl,
        }
      });
      console.log(`Successfully scraped: ${target.id}`);
    } catch (e) {
      console.error(`Failed to process ${target.page}:`, (e as Error).message);
    }
  }
}

main().finally(() => prisma.$disconnect());

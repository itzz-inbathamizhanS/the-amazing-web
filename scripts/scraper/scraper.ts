import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const targets = [
  { id: 'peter-parker', page: 'Peter_Parker_(Earth-616)' },
  { id: 'miles-morales', page: 'Miles_Morales_(Earth-1610)' },
  { id: 'gwen-stacy', page: 'Gwendolyn_Stacy_(Earth-65)' },
  { id: 'miguel-ohara', page: 'Miguel_O\'Hara_(Earth-928)' },
  { id: 'peter-b-parker', page: 'Peter_Parker_(Earth-616B)' },
  { id: 'spider-man-noir', page: 'Peter_Parker_(Earth-90214)' },
  { id: 'peni-parker', page: 'Peni_Parker_(Earth-14512)' },
  { id: 'peter-porker', page: 'Peter_Porker_(Earth-8311)' },
  { id: 'hobie-brown', page: 'Hobart_Brown_(Earth-138)' },
  { id: 'pavitr-prabhakar', page: 'Pavitr_Prabhakar_(Earth-50101)' },
  { id: 'silk', page: 'Cindy_Moon_(Earth-616)' },
  { id: 'spider-woman', page: 'Jessica_Drew_(Earth-616)' },
  { id: 'scarlet-spider', page: 'Benjamin_Reilly_(Earth-616)' },
  { id: 'kaine-parker', page: 'Kaine_Parker_(Earth-616)' },
  { id: 'doc-ock-superior', page: 'Otto_Octavius_(Earth-616)' },
  { id: 'mary-jane-watson', page: 'Mary_Jane_Watson_(Earth-616)' },
  { id: 'gwen-stacy-616', page: 'Gwendolyn_Stacy_(Earth-616)' },
  { id: 'black-cat', page: 'Felicia_Hardy_(Earth-616)' },
  { id: 'aunt-may', page: 'May_Reilly_(Earth-616)' },
  { id: 'green-goblin', page: 'Norman_Osborn_(Earth-616)' },
  { id: 'doctor-octopus', page: 'Otto_Octavius_(Earth-616)' },
  { id: 'venom', page: 'Venom_(Symbiote)_(Earth-616)' },
  
  // 1610 (Miles Morales)
  { id: 'rio-morales-1610', page: 'Rio_Morales_(Earth-1610)' },
  { id: 'jefferson-davis-1610', page: 'Jefferson_Davis_(Earth-1610)' },
  { id: 'ganke-lee-1610', page: 'Ganke_Lee_(Earth-1610)' },
  { id: 'aaron-davis-1610', page: 'Aaron_Davis_(Earth-1610)' },
  { id: 'green-goblin-1610', page: 'Norman_Osborn_(Earth-1610)' },

  // 65 (Spider-Gwen)
  { id: 'mj-65', page: 'Mary_Jane_Watson_(Earth-65)' },
  { id: 'george-stacy-65', page: 'George_Stacy_(Earth-65)' },
  { id: 'kingpin-65', page: 'Matthew_Murdock_(Earth-65)' },
  { id: 'silk-65', page: 'Cindy_Moon_(Earth-65)' },

  // 928 (Spider-Man 2099)
  { id: 'gabriel-ohara-928', page: 'Gabriel_O%27Hara_(Earth-928)' },
  { id: 'lyla-928', page: 'LYRAT_Lifeform_Approximation_(Earth-928)' },
  { id: 'tyler-stone-928', page: 'Tyler_Stone_(Earth-928)' },
  { id: 'venom-928', page: 'Kron_Stone_(Earth-928)' },

  // 90214 (Spider-Man Noir)
  { id: 'may-parker-90214', page: 'May_Parker_(Earth-90214)' },
  { id: 'felicia-hardy-90214', page: 'Felicia_Hardy_(Earth-90214)' },
  { id: 'goblin-90214', page: 'Norman_Osborn_(Earth-90214)' },

  // 8311 (Spider-Ham)
  { id: 'mary-jane-waterbuffalo', page: 'Mary_Jane_Waterbuffalo_(Earth-8311)' },
  { id: 'green-gobbler-8311', page: 'Norman_Osburgh_(Earth-8311)' },

  // 50101 (Spider-Man India)
  { id: 'gayatri-singh-50101', page: 'Gayatri_Singh_(Earth-50101)' },
  { id: 'maya-prabhakar-50101', page: 'Maya_Prabhakar_(Earth-50101)' },
  { id: 'nalin-oberoi-50101', page: 'Nalin_Oberoi_(Earth-50101)' },

  // 138 (Spider-Punk)
  { id: 'karl-morgenthau-138', page: 'Karl_Morgenthau_(Earth-138)' },
  { id: 'osborn-138', page: 'Norman_Osborn_(Earth-138)' },

  // 616 (Main Universe Villains Expansion)
  { id: 'kraven-616', page: 'Sergei_Kravinoff_(Earth-616)' },
  { id: 'sandman-616', page: 'William_Baker_(Earth-616)' },
  { id: 'mysterio-616', page: 'Quentin_Beck_(Earth-616)' },
  { id: 'electro-616', page: 'Maxwell_Dillon_(Earth-616)' },
  { id: 'vulture-616', page: 'Adrian_Toomes_(Earth-616)' },
  { id: 'lizard-616', page: 'Curtis_Connors_(Earth-616)' },
  { id: 'kingpin-616', page: 'Wilson_Fisk_(Earth-616)' },
  { id: 'carnage-616', page: 'Cletus_Kasady_(Earth-616)' },
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
  
  const realName = $('div[data-source="RealName"] div.pi-data-value').text().trim().replace(/\[\d+\]/g, '');
  if (realName) data.realName = realName.split('\n')[0];

  const firstApp = $('div[data-source="First"] div.pi-data-value').text().trim().replace(/\[\d+\]/g, '');
  if (firstApp) data.firstAppearance = firstApp;

  // Smart Image Extraction
  let imgUrl = '';
  let bestFilename = '';
  
  const searchName = (data.realName || target.page.split('_')[0]).split(' ')[0].replace(/[^a-zA-Z]/g, '');
  
  if (parseData.images && parseData.images.length > 0) {
    // Find the first image that contains the character's first name or alias
    for (const img of parseData.images) {
      if (img.toLowerCase().includes(searchName.toLowerCase())) {
        bestFilename = img;
        break;
      }
    }
  }

  if (bestFilename) {
    // Find the img tag with this filename
    const imgEl = $(`img[src*="${encodeURIComponent(bestFilename).replace(/'/g, "%27")}"]`).first();
    if (imgEl.length) {
      imgUrl = imgEl.attr('src') || imgEl.attr('data-src');
    } else {
      // Sometimes it's encoded differently, let's just search all imgs
      $('img').each((i, el) => {
        const src = $(el).attr('src') || $(el).attr('data-src') || '';
        if (src.includes(encodeURIComponent(bestFilename.substring(0, 10)))) {
          imgUrl = src;
        }
      });
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

  if (!imgUrl) {
    const fallbackImg = $('.mw-parser-output img').first();
    imgUrl = fallbackImg.attr('src') || fallbackImg.attr('data-src');
  }
  
  if (imgUrl && imgUrl.includes('/revision/latest')) {
    imgUrl = imgUrl.split('/scale-to-width-down')[0];
  }
  
  data.imageUrl = imgUrl || '';

  return data;
}

import fs from 'fs/promises';
import path from 'path';

async function main() {
  console.log('Starting Marvel Fandom scraper...');
  
  for (const target of targets) {
    try {
      console.log(`\nFetching ${target.page}...`);
      const parseData = await fetchPageHtml(target.page);
      const $ = cheerio.load(parseData.text['*']);
      
      const name = target.page.replace(/_\(Earth-\d+\)/, '').replace(/_/g, ' ');
      
      const description = extractBio($);
      const infobox = extractInfobox($, parseData, target);

      const finalDesc = description || `Detailed lore for ${name} from ${target.earthId}.`;

      let localImageUrl = infobox.imageUrl;
      if (infobox.imageUrl) {
        try {
          const imgResponse = await axios.get(infobox.imageUrl, { responseType: 'arraybuffer' });
          const imgName = `${target.id}.jpg`;
          const imgPath = path.join(__dirname, '..', 'Frontend', 'public', 'images', 'characters', imgName);
          await fs.writeFile(imgPath, imgResponse.data);
          localImageUrl = `/images/characters/${imgName}`;
        } catch (imgError) {
          console.error(`Failed to download image for ${target.id}:`, (imgError as Error).message);
        }
      }

      await prisma.character.update({
        where: { id: target.id },
        data: {
          description: finalDesc,
          imageUrl: localImageUrl,
        }
      });
      
      console.log(`Successfully scraped and saved: ${target.id}`);
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      console.error(`Failed to process ${target.page}:`, (e as Error).message);
    }
  }

  console.log('\nCreating relationships...');
  
  const relationships = [
    // 616 Peter Parker relationships
    ['peter-parker', 'mary-jane-watson'],
    ['peter-parker', 'gwen-stacy-616'],
    ['peter-parker', 'black-cat'],
    ['peter-parker', 'aunt-may'],
    ['peter-parker', 'green-goblin'],
    ['peter-parker', 'doctor-octopus'],
    ['peter-parker', 'venom'],
    ['peter-parker', 'kraven-616'],
    ['peter-parker', 'sandman-616'],
    ['peter-parker', 'mysterio-616'],
    ['peter-parker', 'electro-616'],
    ['peter-parker', 'vulture-616'],
    ['peter-parker', 'lizard-616'],
    ['peter-parker', 'kingpin-616'],
    ['peter-parker', 'carnage-616'],

    // 1610 Miles Morales relationships
    ['miles-morales', 'rio-morales-1610'],
    ['miles-morales', 'jefferson-davis-1610'],
    ['miles-morales', 'ganke-lee-1610'],
    ['miles-morales', 'aaron-davis-1610'],
    ['miles-morales', 'green-goblin-1610'],
    ['peter-parker', 'miles-morales'],

    // 65 Spider-Gwen relationships
    ['gwen-stacy', 'mj-65'],
    ['gwen-stacy', 'george-stacy-65'],
    ['gwen-stacy', 'kingpin-65'],
    ['gwen-stacy', 'silk-65'],

    // 928 Spider-Man 2099 relationships
    ['miguel-ohara', 'gabriel-ohara-928'],
    ['miguel-ohara', 'lyla-928'],
    ['miguel-ohara', 'tyler-stone-928'],
    ['miguel-ohara', 'venom-928'],

    // 90214 Spider-Man Noir relationships
    ['spider-man-noir', 'may-parker-90214'],
    ['spider-man-noir', 'felicia-hardy-90214'],
    ['spider-man-noir', 'goblin-90214'],

    // 8311 Spider-Ham relationships
    ['peter-porker', 'mary-jane-waterbuffalo'],
    ['peter-porker', 'green-gobbler-8311'],

    // 50101 Spider-Man India relationships
    ['pavitr-prabhakar', 'gayatri-singh-50101'],
    ['pavitr-prabhakar', 'maya-prabhakar-50101'],
    ['pavitr-prabhakar', 'nalin-oberoi-50101'],

    // 138 Spider-Punk relationships
    ['hobie-brown', 'karl-morgenthau-138'],
    ['hobie-brown', 'osborn-138'],
  ];

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

  console.log('Scraping and relationship mapping finished!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

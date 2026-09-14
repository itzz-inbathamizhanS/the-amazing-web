import fs from 'fs';
import path from 'path';
import axios from 'axios';

const images = {
  'lyla-928.jpg': 'https://static.wikia.nocookie.net/marveldatabase/images/1/14/LYRAT_Lifeform_Approximation_%28Earth-928%29_from_Spider-Man_2099_Vol_3_8_001.png',
  'green-gobbler-8311.jpg': 'https://static.wikia.nocookie.net/marveldatabase/images/f/f6/Norman_Osburgh_%28Earth-8311%29_from_Peter_Porker%2C_The_Spectacular_Spider-Ham_Vol_1_15.jpg',
  'gayatri-singh-50101.jpg': 'https://static.wikia.nocookie.net/marveldatabase/images/2/22/Gayatri_%28Earth-50101%29_from_Spider-Man_India_Vol_1_1.jpg',
  'aunt-may-14512.jpg': 'https://static.wikia.nocookie.net/marveldatabase/images/8/87/May_Parker_%28Earth-14512%29_from_Edge_of_Spider-Verse_Vol_1_5_001.jpg',
  'anya-corazon.jpg': 'https://static.wikia.nocookie.net/marveldatabase/images/4/4e/A%C3%B1a_Coraz%C3%B3n_%28Earth-616%29_from_Spider-Girl_Vol_2_1_cover.jpg',
  'mayday-parker.jpg': 'https://static.wikia.nocookie.net/marveldatabase/images/4/4b/May_Parker_%28Earth-982%29_from_Spider-Girl_Vol_1_45.jpg',
  'spider-girl-anya.jpg': 'https://static.wikia.nocookie.net/marveldatabase/images/4/4e/A%C3%B1a_Coraz%C3%B3n_%28Earth-616%29_from_Spider-Girl_Vol_2_1_cover.jpg',
  'spider-girl-may.jpg': 'https://static.wikia.nocookie.net/marveldatabase/images/4/4b/May_Parker_%28Earth-982%29_from_Spider-Girl_Vol_1_45.jpg'
};

async function downloadImages() {
  const dir = path.join(__dirname, '..', 'Frontend', 'public', 'images', 'characters');
  
  for (const [filename, url] of Object.entries(images)) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      fs.writeFileSync(path.join(dir, filename), response.data);
      console.log(`Downloaded ${filename}`);
    } catch (e) {
      console.error(`Failed to download ${filename}:`, (e as Error).message);
    }
  }
}

downloadImages();

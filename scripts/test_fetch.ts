import fs from 'fs';

async function main() {
  const url = 'https://upload.wikimedia.org/wikipedia/en/0/0c/Spider-Man_%28Tobey_Maguire%29.png';
  console.log('Fetching', url);
  
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://en.wikipedia.org/',
    }
  });
  
  console.log('Status:', res.status, res.statusText);
  
  if (res.ok) {
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync('test_image.png', buffer);
    console.log('Saved to test_image.png. Size:', buffer.length);
  }
}

main().catch(console.error);

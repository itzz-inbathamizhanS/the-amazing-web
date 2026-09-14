import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  const r = await p.earth.findMany({ select: { id: true, hex: true } });
  r.forEach(e => console.log(e.id, e.hex));

  // Fix earths that have null hex
  const fixes: Record<string, string> = {
    'earth-616b': '#ff6b8a',
    'live-action': '#e74c3c',
  };
  for (const [id, hex] of Object.entries(fixes)) {
    try {
      await p.earth.update({ where: { id }, data: { hex, colorVar: `--${id}` } });
      console.log(`Fixed: ${id} → ${hex}`);
    } catch { console.log(`Skip: ${id}`); }
  }
}

main().finally(() => p.$disconnect());

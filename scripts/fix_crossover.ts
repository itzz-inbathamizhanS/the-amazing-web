import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
  await p.earth.update({where:{id:'crossover'},data:{hex:'#e67e22',colorVar:'--crossover'}});
  console.log('Fixed crossover');
}
main().finally(() => p.$disconnect());

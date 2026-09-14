import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // ── 1. Seed Earth hex colors ──
  const earthColors: Record<string, { hex: string; colorVar: string }> = {
    'earth-616':   { hex: '#ff3b5c', colorVar: '--earth-616' },
    'earth-1610':  { hex: '#9d6bff', colorVar: '--earth-1610' },
    'earth-65':    { hex: '#3fd8e8', colorVar: '--earth-65' },
    'earth-928':   { hex: '#3fe89a', colorVar: '--earth-928' },
    'earth-90214': { hex: '#c9cddb', colorVar: '--earth-90214' },
    'earth-138':   { hex: '#ffd23f', colorVar: '--earth-138' },
    'earth-8311':  { hex: '#ffc23f', colorVar: '--earth-8311' },
    'earth-14512': { hex: '#6ee7ff', colorVar: '--earth-14512' },
    'earth-50101': { hex: '#ff7a3f', colorVar: '--earth-50101' },
    'earth-982':   { hex: '#c48bff', colorVar: '--earth-982' },
    'earth-616B':  { hex: '#ff6b8a', colorVar: '--earth-616b' },
    'earth-13':    { hex: '#ffd700', colorVar: '--earth-13' },
    'earth-1048':  { hex: '#e63946', colorVar: '--earth-1048' },
    'earth-51778': { hex: '#ff4444', colorVar: '--earth-51778' },
    'earth-66':    { hex: '#8b4513', colorVar: '--earth-66' },
    'earth-71490': { hex: '#00bfff', colorVar: '--earth-71490' },
    'earth-96283': { hex: '#1a5276', colorVar: '--earth-96283' },
    'earth-120703':{ hex: '#2874a6', colorVar: '--earth-120703' },
    'earth-199999':{ hex: '#c0392b', colorVar: '--earth-199999' },
  };

  for (const [id, colors] of Object.entries(earthColors)) {
    try {
      await prisma.earth.update({
        where: { id },
        data: { hex: colors.hex, colorVar: colors.colorVar }
      });
      console.log(`✅ Earth ${id} → ${colors.hex}`);
    } catch {
      console.log(`⏭️  Earth ${id} not found, skipping`);
    }
  }

  // ── 2. Set media column on characters ──
  const liveActionIds = [
    'peter-parker-tobey', 'peter-parker-andrew', 'peter-parker-tom',
    'mary-jane-watson-raimi', 'green-goblin-raimi', 'doc-ock-raimi',
    'gwen-stacy-webb', 'lizard-webb', 'electro-webb',
    'mj-mcu', 'vulture-mcu', 'mysterio-mcu'
  ];
  for (const id of liveActionIds) {
    try {
      await prisma.character.update({ where: { id }, data: { media: 'live-action' } });
      console.log(`✅ Character ${id} → live-action`);
    } catch { console.log(`⏭️  ${id} not found`); }
  }

  // Set animated characters
  const animatedEarths = ['earth-1610', 'earth-65', 'earth-928', 'earth-8311', 'earth-14512', 'earth-50101', 'earth-138', 'earth-616B', 'earth-90214', 'earth-982'];
  const animatedChars = await prisma.character.findMany({
    where: { earthId: { in: animatedEarths }, media: null }
  });
  for (const c of animatedChars) {
    await prisma.character.update({ where: { id: c.id }, data: { media: 'comics, animated' } });
    console.log(`✅ Character ${c.id} → comics, animated`);
  }

  // Set remaining as comics
  await prisma.character.updateMany({
    where: { media: null },
    data: { media: 'comics' }
  });
  console.log('✅ Remaining characters → comics');

  // ── 3. Seed live-action timeline events ──
  const liveActionEvents = [
    { id: 'event-sm1', title: 'Spider-Man (2002)', year: 2002, branch: 'earth-96283', summary: 'Peter Parker is bitten by a genetically modified spider. He battles the Green Goblin atop the Queensboro Bridge.' },
    { id: 'event-sm2', title: 'Spider-Man 2 (2004)', year: 2004, branch: 'earth-96283', summary: 'Peter nearly gives up being Spider-Man. Doc Ock threatens New York with a fusion reactor.' },
    { id: 'event-sm3', title: 'Spider-Man 3 (2007)', year: 2007, branch: 'earth-96283', summary: 'The Venom symbiote corrupts Peter. He faces Sandman and a new Goblin.' },
    { id: 'event-tasm1', title: 'The Amazing Spider-Man (2012)', year: 2012, branch: 'earth-120703', summary: 'Peter uncovers his father\'s research at Oscorp. The Lizard threatens to mutate all of Manhattan.' },
    { id: 'event-tasm2', title: 'The Amazing Spider-Man 2 (2014)', year: 2014, branch: 'earth-120703', summary: 'Electro attacks Times Square. Gwen Stacy dies during the clock tower battle with Green Goblin.' },
    { id: 'event-homecoming', title: 'Spider-Man: Homecoming (2017)', year: 2017, branch: 'earth-199999', summary: 'After Civil War, young Peter Parker battles the Vulture who salvages alien tech from the Battle of New York.' },
    { id: 'event-ffh', title: 'Spider-Man: Far From Home (2019)', year: 2019, branch: 'earth-199999', summary: 'On a European school trip, Peter teams with Mysterio — who turns out to be a fraud using Stark drones.' },
    { id: 'event-nwh', title: 'Spider-Man: No Way Home (2021)', year: 2021, branch: 'earth-199999', crossover: true, summary: 'A botched spell tears the multiverse open. All three Spider-Men unite to cure the villains from other universes. The world forgets Peter Parker.' },
  ];

  for (const evt of liveActionEvents) {
    try {
      await prisma.timelineEvent.upsert({
        where: { id: evt.id },
        update: evt,
        create: { ...evt, crossover: evt.crossover || false }
      });
      console.log(`✅ Event: ${evt.title}`);
    } catch (e: any) { console.log(`⏭️  Event ${evt.id}: ${e.message}`); }
  }

  // ── 4. Seed movies table ──
  const movies = [
    // Raimi trilogy
    { id: 'spider-man-2002', title: 'Spider-Man', year: 2002, type: 'live-action', continuity: 'Raimi', watchOrderRank: 1 },
    { id: 'spider-man-2-2004', title: 'Spider-Man 2', year: 2004, type: 'live-action', continuity: 'Raimi', watchOrderRank: 2 },
    { id: 'spider-man-3-2007', title: 'Spider-Man 3', year: 2007, type: 'live-action', continuity: 'Raimi', watchOrderRank: 3 },
    // Webb duology
    { id: 'tasm-2012', title: 'The Amazing Spider-Man', year: 2012, type: 'live-action', continuity: 'Webb', watchOrderRank: 4 },
    { id: 'tasm-2-2014', title: 'The Amazing Spider-Man 2', year: 2014, type: 'live-action', continuity: 'Webb', watchOrderRank: 5 },
    // MCU trilogy
    { id: 'homecoming-2017', title: 'Spider-Man: Homecoming', year: 2017, type: 'live-action', continuity: 'MCU', watchOrderRank: 6 },
    { id: 'ffh-2019', title: 'Spider-Man: Far From Home', year: 2019, type: 'live-action', continuity: 'MCU', watchOrderRank: 7 },
    { id: 'nwh-2021', title: 'Spider-Man: No Way Home', year: 2021, type: 'live-action', continuity: 'MCU / Crossover', watchOrderRank: 8 },
    // Animated
    { id: 'itsv-2018', title: 'Spider-Man: Into the Spider-Verse', year: 2018, type: 'animated', continuity: 'Sony Animated', watchOrderRank: 9 },
    { id: 'atsv-2023', title: 'Spider-Man: Across the Spider-Verse', year: 2023, type: 'animated', continuity: 'Sony Animated', watchOrderRank: 10 },
    { id: 'btsv-2024', title: 'Spider-Man: Beyond the Spider-Verse', year: 2024, type: 'animated', continuity: 'Sony Animated', watchOrderRank: 11 },
  ];

  for (const m of movies) {
    try {
      await prisma.movie.upsert({
        where: { id: m.id },
        update: m,
        create: m
      });
      console.log(`✅ Movie: ${m.title}`);
    } catch (e: any) { console.log(`⏭️  Movie ${m.id}: ${e.message}`); }
  }

  // ── 5. Cross-reference characters ↔ events ──
  const charEventLinks = [
    { characterId: 'peter-parker-tobey', eventId: 'event-sm1' },
    { characterId: 'peter-parker-tobey', eventId: 'event-sm2' },
    { characterId: 'peter-parker-tobey', eventId: 'event-sm3' },
    { characterId: 'peter-parker-tobey', eventId: 'event-nwh' },
    { characterId: 'green-goblin-raimi', eventId: 'event-sm1' },
    { characterId: 'green-goblin-raimi', eventId: 'event-nwh' },
    { characterId: 'doc-ock-raimi', eventId: 'event-sm2' },
    { characterId: 'doc-ock-raimi', eventId: 'event-nwh' },
    { characterId: 'mary-jane-watson-raimi', eventId: 'event-sm1' },
    { characterId: 'mary-jane-watson-raimi', eventId: 'event-sm2' },
    { characterId: 'mary-jane-watson-raimi', eventId: 'event-sm3' },
    { characterId: 'peter-parker-andrew', eventId: 'event-tasm1' },
    { characterId: 'peter-parker-andrew', eventId: 'event-tasm2' },
    { characterId: 'peter-parker-andrew', eventId: 'event-nwh' },
    { characterId: 'gwen-stacy-webb', eventId: 'event-tasm1' },
    { characterId: 'gwen-stacy-webb', eventId: 'event-tasm2' },
    { characterId: 'lizard-webb', eventId: 'event-tasm1' },
    { characterId: 'lizard-webb', eventId: 'event-nwh' },
    { characterId: 'electro-webb', eventId: 'event-tasm2' },
    { characterId: 'electro-webb', eventId: 'event-nwh' },
    { characterId: 'peter-parker-tom', eventId: 'event-homecoming' },
    { characterId: 'peter-parker-tom', eventId: 'event-ffh' },
    { characterId: 'peter-parker-tom', eventId: 'event-nwh' },
    { characterId: 'vulture-mcu', eventId: 'event-homecoming' },
    { characterId: 'mysterio-mcu', eventId: 'event-ffh' },
    { characterId: 'mj-mcu', eventId: 'event-homecoming' },
    { characterId: 'mj-mcu', eventId: 'event-ffh' },
    { characterId: 'mj-mcu', eventId: 'event-nwh' },
  ];

  for (const link of charEventLinks) {
    try {
      await prisma.characterTimelineEvent.upsert({
        where: { characterId_eventId: link },
        update: {},
        create: link,
      });
      console.log(`✅ Link: ${link.characterId} ↔ ${link.eventId}`);
    } catch (e: any) { console.log(`⏭️  Link ${link.characterId}↔${link.eventId}: ${e.message}`); }
  }

  // ── 6. Seed actors table ──
  const actors = [
    { id: 'tobey-maguire', name: 'Tobey Maguire', role: 'Peter Parker / Spider-Man' },
    { id: 'andrew-garfield', name: 'Andrew Garfield', role: 'Peter Parker / Spider-Man' },
    { id: 'tom-holland', name: 'Tom Holland', role: 'Peter Parker / Spider-Man' },
    { id: 'kirsten-dunst', name: 'Kirsten Dunst', role: 'Mary Jane Watson' },
    { id: 'willem-dafoe', name: 'Willem Dafoe', role: 'Norman Osborn / Green Goblin' },
    { id: 'alfred-molina', name: 'Alfred Molina', role: 'Otto Octavius / Doc Ock' },
    { id: 'emma-stone', name: 'Emma Stone', role: 'Gwen Stacy' },
    { id: 'jamie-foxx', name: 'Jamie Foxx', role: 'Max Dillon / Electro' },
    { id: 'zendaya', name: 'Zendaya', role: 'MJ' },
    { id: 'michael-keaton', name: 'Michael Keaton', role: 'Adrian Toomes / Vulture' },
    { id: 'jake-gyllenhaal', name: 'Jake Gyllenhaal', role: 'Quentin Beck / Mysterio' },
  ];

  for (const a of actors) {
    try {
      await prisma.actor.upsert({
        where: { id: a.id },
        update: a,
        create: a,
      });
      console.log(`✅ Actor: ${a.name}`);
    } catch (e: any) { console.log(`⏭️  Actor ${a.id}: ${e.message}`); }
  }

  console.log('\n🎉 Phase 2 seeding complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());

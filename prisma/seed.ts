import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding extensive Spider-Man wiki data...');

  // 1. Seed Earths
  const earths = [
    {
      id: 'earth-616',
      designation: 'Earth-616',
      description: 'The primary continuity of the Marvel Universe. It is the trunk from which most multiversal stories branch out. This Earth has seen decades of rich history, including the Clone Saga, Maximum Carnage, Superior Spider-Man, and numerous alien invasions. Peter Parker operates as its definitive Spider-Man.',
      primaryCharacterId: 'peter-parker'
    },
    {
      id: 'earth-1610',
      designation: 'Earth-1610',
      description: 'The Ultimate Marvel Universe. Created to modernize characters for a new era. In this universe, Peter Parker was killed in action, inspiring young Miles Morales to take up the mantle. It famously collided with Earth-616 during the Secret Wars (2015) incursions.',
      primaryCharacterId: 'miles-morales'
    },
    {
      id: 'earth-65',
      designation: 'Earth-65',
      description: 'A vibrant universe where Gwen Stacy was bitten by the radioactive spider instead of Peter Parker. Peter tragically transformed into the Lizard and died, framing Gwen as a criminal. The reality features neon-lit aesthetics and a focus on music and band culture.',
      primaryCharacterId: 'gwen-stacy'
    },
    {
      id: 'earth-928',
      designation: 'Earth-928',
      description: 'The Marvel 2099 Universe. A dystopian, cyberpunk future ruled by mega-corporations like Alchemax. Miguel O\'Hara, a brilliant geneticist, accidentally spliced his DNA with a spider, becoming the Spider-Man of a neon-soaked, ruthless tomorrow.',
      primaryCharacterId: 'miguel-ohara'
    },
    {
      id: 'earth-90214',
      designation: 'Earth-90214',
      description: 'The Marvel Noir Universe. A gritty, 1930s Depression-era world where Peter Parker is an investigative reporter who operates in the shadows. Bitten by a mystical spider god, he fights mob bosses like Norman Osborn using lethal force when necessary.',
      primaryCharacterId: 'spider-man-noir'
    },
    {
      id: 'earth-8311',
      designation: 'Earth-8311',
      description: 'The Larval Universe. A reality populated by anthropomorphic cartoon animals. Physics operates on cartoon logic, where anvils and hammerspace are standard arsenals. Peter Porker, born a spider, was bitten by a radioactive pig.',
      primaryCharacterId: 'peter-porker'
    },
    {
      id: 'earth-14512',
      designation: 'Earth-14512',
      description: 'An anime and manga-inspired universe. Peni Parker co-pilots the SP//dr mech suit alongside a radioactive spider she shares a psychic link with. The world is heavily influenced by mecha tropes like Evangelion.',
      primaryCharacterId: 'peni-parker'
    },
    {
      id: 'earth-138',
      designation: 'Earth-138',
      description: 'The Punk Universe. A dystopian society ruled by President Norman Osborn\'s totalitarian regime. Hobie Brown, a homeless teenager, leads a revolution using a guitar and an anti-establishment ethos as the Spider-Punk.',
      primaryCharacterId: 'hobie-brown'
    },
    {
      id: 'earth-50101',
      designation: 'Earth-50101',
      description: 'Mumbai, India. Instead of a science experiment, Pavitr Prabhakar gained his abilities from an ancient yogi. He fights demonic entities like Nalin Oberoi while dealing with the pressures of his aunt Maya and uncle Bhim.',
      primaryCharacterId: 'pavitr-prabhakar'
    },
    {
      id: 'earth-982',
      designation: 'Earth-982',
      description: 'The MC2 Universe. A reality where Peter Parker and Mary Jane\'s daughter, Mayday Parker, survived and grew up to inherit her father\'s abilities. Peter retired after a brutal final battle with the Green Goblin.',
      primaryCharacterId: 'mayday-parker'
    },
    {
      id: 'earth-616B',
      designation: 'Earth-616B',
      description: 'A cinematic reflection of Earth-616 shown in Into the Spider-Verse. Peter B. Parker is an older, wearier, and slightly out-of-shape hero who suffered a divorce and financial ruin, yet slowly rediscovers his purpose as a mentor.',
      primaryCharacterId: 'peter-b-parker'
    },
    {
      id: 'live-action',
      designation: 'Live-Action Multiverse',
      description: 'An amalgam designation representing the nexus of cinematic live-action universes, connecting the Raimi, Webb, and MCU timelines.',
      primaryCharacterId: null
    },
    {
      id: 'crossover',
      designation: 'Crossover Hubs',
      description: 'The abstract space representing multiversal crossing events, including Loomworld and the Web of Life and Destiny.',
      primaryCharacterId: null
    }
  ];

  for (const e of earths) {
    await prisma.earth.upsert({
      where: { id: e.id },
      update: {
        designation: e.designation,
        description: e.description,
        primaryCharacterId: e.primaryCharacterId,
      },
      create: {
        id: e.id,
        designation: e.designation,
        description: e.description,
        primaryCharacterId: e.primaryCharacterId,
      },
    });
  }
  console.log('Seeded Earths');

  // 2. Seed Characters
  const characters = [
    {
      id: 'peter-parker',
      name: 'Peter Parker',
      alias: 'Spider-Man',
      earth: 'earth-616',
      realName: 'Peter Benjamin Parker',
      firstAppearance: 'Amazing Fantasy #15 (August 1962)',
      description: 'Bitten by a radioactive spider during a science exhibition, Peter Parker gained arachnid-like abilities. Initially seeking fame, he let a burglar escape who later murdered his Uncle Ben. Learning that "with great power, there must also come great responsibility," Peter became the superhero Spider-Man. He is a brilliant scientist, a photographer for the Daily Bugle, and the quintessential everyman hero of the Marvel Universe.',
      powers: ['Wall-crawling', 'Superhuman strength (10-25 tons)', 'Superhuman speed and agility', 'Spider-Sense (Precognition)', 'Genius-level intellect', 'Web-shooters (artificial)'],
      tags: ['core', 'founder', 'avenger'],
    },
    {
      id: 'miles-morales',
      name: 'Miles Morales',
      alias: 'Spider-Man',
      earth: 'earth-1610',
      realName: 'Miles Gonzalo Morales',
      firstAppearance: 'Ultimate Fallout #4 (August 2011)',
      description: 'An Afro-Latino teenager from Brooklyn who was bitten by a genetically enhanced spider engineered by Norman Osborn. Initially reluctant to use his powers, Miles stepped up after witnessing the death of his universe\'s Peter Parker. He possesses unique abilities like camouflage and venom blasts, setting him apart from his predecessor. He eventually migrated to Earth-616 after the Secret Wars event.',
      powers: ['Wall-crawling', 'Superhuman strength', 'Spider-Sense', 'Invisibility/Camouflage', 'Bio-electrokinesis (Venom Blast)'],
      tags: ['core', 'animated-lead', 'champion'],
    },
    {
      id: 'gwen-stacy',
      name: 'Gwen Stacy',
      alias: 'Spider-Woman / Ghost-Spider',
      earth: 'earth-65',
      realName: 'Gwendolyn Maxine Stacy',
      firstAppearance: 'Edge of Spider-Verse #2 (September 2014)',
      description: 'In a universe where Gwen Stacy was bitten by the radioactive spider instead of Peter Parker, she operates as the fugitive hero Spider-Woman (often called Spider-Gwen). Her reality\'s Peter Parker, driven by bullying, turned himself into the Lizard and died in her arms, leading the NYPD (led by her father, Captain George Stacy) to hunt her down. She is the drummer for the Mary Janes and uses a dimensional travel watch to hop universes.',
      powers: ['Wall-crawling', 'Superhuman strength and agility', 'Spider-Sense', 'Dimensional travel watch', 'Symbiote suit (currently)'],
      tags: ['core', 'animated-lead', 'band-member'],
    },
    {
      id: 'miguel-ohara',
      name: 'Miguel O\'Hara',
      alias: 'Spider-Man 2099',
      earth: 'earth-928',
      realName: 'Miguel O\'Hara',
      firstAppearance: 'The Amazing Spider-Man #365 (August 1992)',
      description: 'A brilliant geneticist living in Nueva York in the year 2099. Miguel attempted to recreate the abilities of the original Spider-Man in others but was forced to use the procedure on himself to purge a highly addictive drug from his system. His DNA was rewritten with 50% spider genetic code. He fights against the corrupt mega-corporation Alchemax and serves as a ruthless, pragmatic leader in multiversal conflicts.',
      powers: ['Wall-crawling (talons)', 'Superhuman strength and speed', 'Accelerated vision (no Spider-Sense)', 'Venomous fangs', 'Organic webbing'],
      tags: ['core', 'future', 'leader'],
    },
    {
      id: 'peter-b-parker',
      name: 'Peter B. Parker',
      alias: 'Spider-Man',
      earth: 'earth-616B',
      realName: 'Peter Parker',
      firstAppearance: 'Spider-Man: Into the Spider-Verse (2018)',
      description: 'An older, jaded, and out-of-shape Peter Parker who has suffered through divorce, bad investments, and physical toll. Pulled into Earth-1610, he reluctantly mentors Miles Morales, ultimately rediscovering his own heroism and love for Mary Jane in the process. He later returns as a father to baby Mayday Parker.',
      powers: ['Wall-crawling', 'Superhuman strength', 'Spider-Sense', 'Web-shooters', 'Dad reflexes'],
      tags: ['animated-lead', 'mentor', 'father'],
    },
    {
      id: 'spider-man-noir',
      name: 'Spider-Man Noir',
      alias: 'Spider-Man',
      earth: 'earth-90214',
      realName: 'Peter Parker',
      firstAppearance: 'Spider-Man: Noir #1 (February 2009)',
      description: 'Raised during the Great Depression by his socialist uncle and aunt. Peter was bitten by an illegal spider shipped within a spider-god statue, gaining mystical powers. He operates as a brutal vigilante in a fedora and trench coat, heavily utilizing shadows, stealth, and dual revolvers to wage a one-man war against the Goblin mob.',
      powers: ['Wall-crawling', 'Superhuman agility', 'Mystic Spider-Sense', 'Marksman', 'Shadow stealth'],
      tags: ['core', 'period', 'detective'],
    },
    {
      id: 'peni-parker',
      name: 'Peni Parker',
      alias: 'SP//dr',
      earth: 'earth-14512',
      realName: 'Peni Parker',
      firstAppearance: 'Edge of Spider-Verse #5 (October 2014)',
      description: 'A Japanese-American middle schooler who allowed herself to be bitten by a radioactive spider to sync with its DNA. This creates a psychic link, allowing her to pilot the SP//dr mecha suit left behind by her deceased father. Her universe is heavily influenced by mecha anime like Neon Genesis Evangelion.',
      powers: ['Psychic link with radioactive spider', 'Genius intellect', 'Pilots the heavily armed SP//dr mech suit'],
      tags: ['core', 'mech', 'anime'],
    },
    {
      id: 'peter-porker',
      name: 'Peter Porker',
      alias: 'Spider-Ham',
      earth: 'earth-8311',
      realName: 'Peter Porker',
      firstAppearance: 'Marvel Tails Starring Peter Porker, the Spectacular Spider-Ham #1 (November 1983)',
      description: 'Originally a spider residing in the basement lab of May Porker, an anthropomorphic pig scientist. When May accidentally irradiated herself and bit Peter, he transformed into an anthropomorphic pig with spider abilities. He combines superhuman strength with absolute cartoon logic and physics.',
      powers: ['Cartoon physics', 'Super-strength', 'Wall-crawling', 'Hammerspace mallet'],
      tags: ['core', 'comedy', 'animal'],
    },
    {
      id: 'hobie-brown',
      name: 'Hobart Brown',
      alias: 'Spider-Punk',
      earth: 'earth-138',
      realName: 'Hobart Brown',
      firstAppearance: 'The Amazing Spider-Man (Vol. 3) #10 (January 2015)',
      description: 'A homeless teenager who was bitten by a spider irradiated by illegal waste dumping. Hobie leads the Spider Army against the totalitarian regime of President Norman Osborn. He fights with an electric guitar and an unyielding punk-rock philosophy, refusing to bow to authority—even the multiversal Spider-Society.',
      powers: ['Wall-crawling', 'Superhuman strength', 'Sonic amplification (via guitar)'],
      tags: ['core', 'punk', 'rebel'],
    },
    {
      id: 'pavitr-prabhakar',
      name: 'Pavitr Prabhakar',
      alias: 'Spider-Man India',
      earth: 'earth-50101',
      realName: 'Pavitr Prabhakar',
      firstAppearance: 'Spider-Man: India #1 (January 2004)',
      description: 'An Indian boy living in Mumbai who receives the powers of a spider from an ancient yogi to fight demonic forces. He balances his duties as a hero with his love for Gayatri and the pressures of the bustling city of Mumbattan. His primary foe is the demonic crime lord Nalin Oberoi.',
      powers: ['Wall-crawling', 'Super-agility', 'Mystic Spider-Sense', 'Yo-yo web slingers'],
      tags: ['core', 'mystic'],
    },
    {
      id: 'silk',
      name: 'Cindy Moon',
      alias: 'Silk',
      earth: 'earth-616',
      realName: 'Cindy Moon',
      firstAppearance: 'The Amazing Spider-Man (Vol. 3) #1 (April 2014)',
      description: 'Bitten by the exact same radioactive spider as Peter Parker mere moments later. She was locked in a bunker by Ezekiel Sims for 10 years to protect her from the Inheritors. When freed, she demonstrated a faster Spider-Sense (Silk-Sense), a photographic memory, and the ability to spin organic webs from her fingertips.',
      powers: ['Organic webbing', 'Hyper-accelerated Silk-Sense', 'Superhuman agility (faster than Peter)', 'Photographic memory'],
      tags: ['core', 'comics-only', 'bunker'],
    },
    {
      id: 'spider-woman',
      name: 'Jessica Drew',
      alias: 'Spider-Woman',
      earth: 'earth-616',
      realName: 'Jessica Drew',
      firstAppearance: 'Marvel Spotlight #32 (February 1977)',
      description: 'Her powers derive from a spider-blood serum administered by her father to save her from uranium exposure. She was brainwashed by HYDRA, became a double agent for SHIELD, and later joined the Avengers. She has no direct relation to Peter Parker, possessing unique abilities like venom blasts and pheromone secretion.',
      powers: ['Superhuman strength and agility', 'Venom blasts (bio-electric)', 'Pheromone manipulation', 'Gliding', 'Immunity to toxins'],
      tags: ['core', 'avenger', 'spy'],
    },
    {
      id: 'scarlet-spider',
      name: 'Ben Reilly',
      alias: 'Scarlet Spider',
      earth: 'earth-616',
      realName: 'Benjamin Reilly',
      firstAppearance: 'The Amazing Spider-Man #149 (October 1975)',
      description: 'A clone of Peter Parker created by the Jackal. Believing himself to be the clone, he spent five years wandering America before returning to New York as the Scarlet Spider. During the infamous Clone Saga, he briefly believed he was the original Peter and took over the mantle of Spider-Man before tragically dying (and being resurrected numerous times).',
      powers: ['Wall-crawling', 'Super-strength', 'Spider-Sense', 'Impact webbing', 'Stingers'],
      tags: ['clone', 'comics-only', 'nomad'],
    },
    {
      id: 'kaine-parker',
      name: 'Kaine Parker',
      alias: 'Scarlet Spider',
      earth: 'earth-616',
      realName: 'Kaine Parker',
      firstAppearance: 'Web of Spider-Man #119 (December 1994)',
      description: 'The Jackal\'s first, unstable clone of Peter Parker. Afflicted by cellular degeneration, he was heavily scarred and mentally unstable, operating as an anti-hero/villain for years. After being cured during the Spider-Island event, he reluctantly became the new Scarlet Spider in Houston, Texas.',
      powers: ['Wall-crawling', 'Super-strength (stronger than Peter)', 'Mark of Kaine (corrosive touch)', 'Retractable stingers', 'Night vision'],
      tags: ['clone', 'anti-hero', 'comics-only'],
    },
    {
      id: 'doc-ock-superior',
      name: 'Otto Octavius',
      alias: 'Superior Spider-Man',
      earth: 'earth-616',
      realName: 'Otto Gunther Octavius',
      firstAppearance: 'The Amazing Spider-Man #697 (November 2012)',
      description: 'Dying of radiation poisoning, Doctor Octopus successfully swapped minds with Peter Parker, leaving Peter to die in his failing body. Otto experienced Peter\'s memories and lessons of responsibility, vowing to become a "Superior" Spider-Man. He brutalized villains, established a tech empire, and eventually sacrificed himself to return Peter\'s mind when he couldn\'t defeat the Goblin King.',
      powers: ['Wall-crawling', 'Super-strength', 'Spider-Sense', 'Genius intellect', 'Spider-Bots', 'Mechanical spider-arms'],
      tags: ['villain-turned-hero', 'comics-only', 'tech'],
    },
    // --- EARTH-1610 (Miles Morales) ---
    {
      id: 'rio-morales-1610',
      name: 'Rio Morales',
      alias: 'Rio Morales',
      earth: 'earth-1610',
      realName: 'Rio Morales',
      firstAppearance: 'Ultimate Comics Spider-Man #1',
      description: 'Miles Morales\'s loving mother who works as a nurse.',
      powers: [],
      tags: ['ally', 'family'],
    },
    {
      id: 'jefferson-davis-1610',
      name: 'Jefferson Davis',
      alias: 'Jefferson Davis',
      earth: 'earth-1610',
      realName: 'Jefferson Davis',
      firstAppearance: 'Ultimate Comics Spider-Man #1',
      description: 'Miles\'s father, a dedicated police officer with a complicated past.',
      powers: [],
      tags: ['ally', 'family'],
    },
    {
      id: 'ganke-lee-1610',
      name: 'Ganke Lee',
      alias: 'Ganke Lee',
      earth: 'earth-1610',
      realName: 'Ganke Lee',
      firstAppearance: 'Ultimate Comics Spider-Man #2',
      description: 'Miles Morales\'s best friend and closest confidant.',
      powers: [],
      tags: ['ally', 'friend'],
    },
    {
      id: 'aaron-davis-1610',
      name: 'Aaron Davis',
      alias: 'The Prowler',
      earth: 'earth-1610',
      realName: 'Aaron Davis',
      firstAppearance: 'Ultimate Comics Spider-Man #1',
      description: 'Miles\'s uncle, a career criminal and skilled thief known as the Prowler.',
      powers: ['Master thief', 'High-tech suit'],
      tags: ['villain', 'family'],
    },
    {
      id: 'green-goblin-1610',
      name: 'Norman Osborn',
      alias: 'Green Goblin',
      earth: 'earth-1610',
      realName: 'Norman Osborn',
      firstAppearance: 'Ultimate Spider-Man #1',
      description: 'The Ultimate Universe version of Norman Osborn, who mutates into a massive, fiery demonic monster.',
      powers: ['Superhuman strength', 'Pyrokinesis'],
      tags: ['villain', 'monster'],
    },
    // --- EARTH-65 (Spider-Gwen) ---
    {
      id: 'mj-65',
      name: 'Mary Jane Watson',
      alias: 'Mary Jane Watson',
      earth: 'earth-65',
      realName: 'Mary Jane Watson',
      firstAppearance: 'Edge of Spider-Verse #2',
      description: 'Lead singer of the band The Mary Janes.',
      powers: [],
      tags: ['ally', 'friend', 'band-member'],
    },
    {
      id: 'george-stacy-65',
      name: 'George Stacy',
      alias: 'Captain Stacy',
      earth: 'earth-65',
      realName: 'George Stacy',
      firstAppearance: 'Edge of Spider-Verse #2',
      description: 'Gwen\'s father and a Captain in the NYPD.',
      powers: [],
      tags: ['ally', 'family'],
    },
    {
      id: 'kingpin-65',
      name: 'Matt Murdock',
      alias: 'The Kingpin',
      earth: 'earth-65',
      realName: 'Matthew Murdock',
      firstAppearance: 'Edge of Spider-Verse #2',
      description: 'In this universe, Matt Murdock is the corrupt and powerful Kingpin of Crime.',
      powers: ['Master martial artist', 'Enhanced senses'],
      tags: ['villain', 'kingpin'],
    },
    {
      id: 'silk-65',
      name: 'Cindy Moon',
      alias: 'S.I.L.K.',
      earth: 'earth-65',
      realName: 'Cindy Moon',
      firstAppearance: 'Spider-Women Alpha #1',
      description: 'A villainous version of Cindy Moon who runs a covert organization.',
      powers: ['Genius intellect'],
      tags: ['villain'],
    },
    // --- EARTH-928 (Spider-Man 2099) ---
    {
      id: 'gabriel-ohara-928',
      name: 'Gabriel O\'Hara',
      alias: 'Gabriel O\'Hara',
      earth: 'earth-928',
      realName: 'Gabriel O\'Hara',
      firstAppearance: 'Spider-Man 2099 #1',
      description: 'Miguel O\'Hara\'s brother.',
      powers: [],
      tags: ['ally', 'family'],
    },
    {
      id: 'lyla-928',
      name: 'Lyla',
      alias: 'LYRATE LIFEFORM APPROXIMATION',
      earth: 'earth-928',
      realName: 'LYLA',
      firstAppearance: 'Spider-Man 2099 #1',
      description: 'Miguel\'s holographic AI assistant.',
      powers: ['Holographic projection', 'Supercomputing'],
      tags: ['ally', 'ai'],
    },
    {
      id: 'tyler-stone-928',
      name: 'Tyler Stone',
      alias: 'Tyler Stone',
      earth: 'earth-928',
      realName: 'Tyler Stone',
      firstAppearance: 'Spider-Man 2099 #1',
      description: 'The ruthless executive of Alchemax and Miguel\'s biological father.',
      powers: [],
      tags: ['villain', 'corporate'],
    },
    {
      id: 'venom-928',
      name: 'Kron Stone',
      alias: 'Venom 2099',
      earth: 'earth-928',
      realName: 'Kron Stone',
      firstAppearance: 'Punisher 2099 #1',
      description: 'Miguel\'s half-brother who bonded with a mutated symbiote.',
      powers: ['Symbiote abilities', 'Acid generation'],
      tags: ['villain', 'symbiote'],
    },
    // --- EARTH-90214 (Spider-Man Noir) ---
    {
      id: 'may-parker-90214',
      name: 'May Parker',
      alias: 'May Parker',
      earth: 'earth-90214',
      realName: 'May Parker',
      firstAppearance: 'Spider-Man: Noir #1',
      description: 'A fierce socialist activist during the Great Depression.',
      powers: [],
      tags: ['ally', 'family'],
    },
    {
      id: 'felicia-hardy-90214',
      name: 'Felicia Hardy',
      alias: 'White Widow',
      earth: 'earth-90214',
      realName: 'Felicia Hardy',
      firstAppearance: 'Spider-Man: Noir #1',
      description: 'Owner of the Black Cat club and former lover of Peter Parker.',
      powers: [],
      tags: ['ally', 'lover'],
    },
    {
      id: 'goblin-90214',
      name: 'Norman Osborn',
      alias: 'The Goblin',
      earth: 'earth-90214',
      realName: 'Norman Osborn',
      firstAppearance: 'Spider-Man: Noir #1',
      description: 'A horrific mob boss suffering from a reptilian skin condition.',
      powers: ['Criminal mastermind'],
      tags: ['villain', 'mobster'],
    },
    // --- EARTH-8311 (Spider-Ham) ---
    {
      id: 'mary-jane-waterbuffalo',
      name: 'Mary Jane Waterbuffalo',
      alias: 'Mary Jane Waterbuffalo',
      earth: 'earth-8311',
      realName: 'Mary Jane Waterbuffalo',
      firstAppearance: 'Marvel Tails Starring Peter Porker #1',
      description: 'Peter Porker\'s love interest.',
      powers: [],
      tags: ['ally', 'lover'],
    },
    {
      id: 'green-gobbler-8311',
      name: 'Norman Osburgh',
      alias: 'Green Gobbler',
      earth: 'earth-8311',
      realName: 'Norman Osburgh',
      firstAppearance: 'Peter Porker, The Spectacular Spider-Ham #1',
      description: 'Spider-Ham\'s nemesis, an evil turkey.',
      powers: ['Explosive eggs', 'Glider flight'],
      tags: ['villain', 'animal'],
    },
    // --- EARTH-50101 (Spider-Man India) ---
    {
      id: 'gayatri-singh-50101',
      name: 'Gayatri Singh',
      alias: 'Gayatri Singh',
      earth: 'earth-50101',
      realName: 'Gayatri Singh',
      firstAppearance: 'Spider-Man: India #1',
      description: 'Pavitr Prabhakar\'s love interest.',
      powers: [],
      tags: ['ally', 'lover'],
    },
    {
      id: 'maya-prabhakar-50101',
      name: 'Maya Prabhakar',
      alias: 'Aunt Maya',
      earth: 'earth-50101',
      realName: 'Maya Prabhakar',
      firstAppearance: 'Spider-Man: India #1',
      description: 'Pavitr\'s loving aunt.',
      powers: [],
      tags: ['ally', 'family'],
    },
    {
      id: 'nalin-oberoi-50101',
      name: 'Nalin Oberoi',
      alias: 'Nalin Oberoi',
      earth: 'earth-50101',
      realName: 'Nalin Oberoi',
      firstAppearance: 'Spider-Man: India #1',
      description: 'A ruthless crime lord possessed by a demonic amulet.',
      powers: ['Demonic magic', 'Superhuman strength'],
      tags: ['villain', 'demonic'],
    },
    // --- EARTH-138 (Spider-Punk) ---
    {
      id: 'karl-morgenthau-138',
      name: 'Karl Morgenthau',
      alias: 'Captain Anarchy',
      earth: 'earth-138',
      realName: 'Karl Morgenthau',
      firstAppearance: 'Spider-Gwen (Vol. 2) #7',
      description: 'An anarchist freedom fighter who battles alongside Spider-Punk.',
      powers: ['Superhuman strength', 'Indestructible shield'],
      tags: ['ally', 'anarchist'],
    },
    {
      id: 'osborn-138',
      name: 'Norman Osborn',
      alias: 'President Osborn',
      earth: 'earth-138',
      realName: 'Norman Osborn',
      firstAppearance: 'The Amazing Spider-Man (Vol. 3) #10',
      description: 'The totalitarian president of America, who uses the V.E.N.O.M. symbiote.',
      powers: ['V.E.N.O.M. symbiote', 'Political power'],
      tags: ['villain', 'president'],
    },
    // --- EARTH-616 VILLAINS ---
    {
      id: 'kraven-616',
      name: 'Kraven the Hunter',
      alias: 'Kraven the Hunter',
      earth: 'earth-616',
      realName: 'Sergei Kravinoff',
      firstAppearance: 'The Amazing Spider-Man #15',
      description: 'A maniacal big-game hunter who seeks to prove he is the greatest hunter in the world by defeating Spider-Man.',
      powers: ['Enhanced strength and senses via jungle potions', 'Master tracker'],
      tags: ['villain', 'hunter'],
    },
    {
      id: 'sandman-616',
      name: 'Sandman',
      alias: 'Sandman',
      earth: 'earth-616',
      realName: 'William Baker',
      firstAppearance: 'The Amazing Spider-Man #4',
      description: 'A small-time thug transformed into a shape-shifting being of living sand.',
      powers: ['Sand manipulation', 'Superhuman strength', 'Invulnerability'],
      tags: ['villain', 'elemental'],
    },
    {
      id: 'mysterio-616',
      name: 'Mysterio',
      alias: 'Mysterio',
      earth: 'earth-616',
      realName: 'Quentin Beck',
      firstAppearance: 'The Amazing Spider-Man #13',
      description: 'A disgruntled special effects wizard who uses advanced illusions and technology to commit crimes.',
      powers: ['Master of illusions', 'Advanced robotics', 'Hypnotism'],
      tags: ['villain', 'illusionist'],
    },
    {
      id: 'electro-616',
      name: 'Electro',
      alias: 'Electro',
      earth: 'earth-616',
      realName: 'Maxwell Dillon',
      firstAppearance: 'The Amazing Spider-Man #9',
      description: 'An electrical engineer struck by lightning who gained the ability to control electricity.',
      powers: ['Electro-kinesis', 'Flight via magnetic fields'],
      tags: ['villain', 'elemental'],
    },
    {
      id: 'vulture-616',
      name: 'Vulture',
      alias: 'Vulture',
      earth: 'earth-616',
      realName: 'Adrian Toomes',
      firstAppearance: 'The Amazing Spider-Man #2',
      description: 'An elderly, brilliant engineer who uses a specialized flight harness to commit crimes.',
      powers: ['Flight via electromagnetic harness', 'Enhanced strength'],
      tags: ['villain', 'inventor'],
    },
    {
      id: 'lizard-616',
      name: 'The Lizard',
      alias: 'The Lizard',
      earth: 'earth-616',
      realName: 'Curt Connors',
      firstAppearance: 'The Amazing Spider-Man #6',
      description: 'A brilliant biologist whose attempt to regrow his severed arm using reptilian DNA transformed him into a savage monster.',
      powers: ['Superhuman strength and speed', 'Regenerative healing factor', 'Reptile telepathy'],
      tags: ['villain', 'monster'],
    },
    {
      id: 'kingpin-616',
      name: 'Kingpin',
      alias: 'Kingpin',
      earth: 'earth-616',
      realName: 'Wilson Fisk',
      firstAppearance: 'The Amazing Spider-Man #50',
      description: 'The ruthless overlord of organized crime in New York City.',
      powers: ['Peak human strength', 'Master martial artist', 'Criminal mastermind'],
      tags: ['villain', 'mobster'],
    },
    {
      id: 'carnage-616',
      name: 'Carnage',
      alias: 'Carnage',
      earth: 'earth-616',
      realName: 'Cletus Kasady',
      firstAppearance: 'The Amazing Spider-Man #361',
      description: 'A sadistic serial killer bonded to the offspring of the Venom symbiote.',
      powers: ['Symbiote abilities', 'Shape-shifting weapons', 'Immunity to Spider-Sense'],
      tags: ['villain', 'symbiote', 'serial-killer'],
    },
  ];

  for (const c of characters) {
    await prisma.character.upsert({
      where: { id: c.id },
      update: {
        name: c.name,
        alias: c.alias,
        earthId: c.earth,
        realName: c.realName,
        firstAppearance: c.firstAppearance,
        description: c.description,
        powers: c.powers.join(', '),
        tags: c.tags.join(', '),
      },
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
  console.log('Seeded Characters');

  // 3. Seed Timeline Events
  const events = [
    {
      id: 'amazing-fantasy-15',
      title: 'The First Bite',
      year: 1962,
      dateRange: 'August 1962',
      summary: 'The origin story that anchors the entire franchise. High school outcast Peter Parker attends a public exhibition demonstrating the safe handling of nuclear laboratory waste materials. A spider, accidentally irradiated by a particle beam, bites Peter on the hand before dying. Gaining incredible powers, Peter attempts to monetize them in wrestling and television. In his arrogance, he allows a thief to escape a security guard. Days later, he discovers his beloved Uncle Ben was murdered by the exact same thief. He learns the ultimate lesson: With great power, there must also come great responsibility.',
      branch: 'earth-616',
      crossover: false,
      issues: ['Amazing Fantasy #15'],
      characters: ['peter-parker']
    },
    {
      id: 'the-night-gwen-stacy-died',
      title: 'The Night Gwen Stacy Died',
      year: 1973,
      dateRange: 'June–July 1973',
      summary: 'A watershed moment in comic book history that ended the Silver Age. The Green Goblin (Norman Osborn) discovers Spider-Man\'s identity, kidnaps his girlfriend Gwen Stacy, and throws her off the George Washington Bridge. Spider-Man shoots a web to catch her, but the sudden whiplash snaps her neck. Overcome with grief and rage, Peter nearly beats Osborn to death, but holds back. Osborn accidentally impales himself on his own glider shortly after. This event permanently scarred Peter and redefined comic book storytelling.',
      branch: 'earth-616',
      crossover: false,
      issues: ['The Amazing Spider-Man #121–122'],
      characters: ['peter-parker']
    },
    {
      id: 'secret-wars-symbiote',
      title: 'The Alien Costume Saga',
      year: 1984,
      dateRange: 'May 1984 – April 1985',
      summary: 'During the original Secret Wars event on Battleworld, Spider-Man\'s costume is shredded. He finds an alien machine that produces a sleek black suit. The suit responds to his thoughts and produces its own webbing. Upon returning to Earth, Peter discovers the suit is a living alien symbiote attempting to permanently bond with him. He rejects it using sonic waves from church bells, inadvertently leading the symbiote to bond with Eddie Brock and create Venom.',
      branch: 'earth-616',
      crossover: false,
      issues: ['Marvel Super Heroes Secret Wars #8', 'The Amazing Spider-Man #252-258'],
      characters: ['peter-parker']
    },
    {
      id: 'clone-saga',
      title: 'The Clone Saga',
      year: 1994,
      dateRange: 'October 1994 – December 1996',
      summary: 'One of the most controversial and tangled storylines in Marvel history. The Jackal creates a clone of Peter Parker named Ben Reilly, who returns to New York after five years in exile. Through a series of convoluted deceptions orchestrated by a resurrected Norman Osborn, Peter is led to believe HE is the clone and Ben is the original. Ben takes over as Spider-Man while Peter retires with Mary Jane, until the truth is finally revealed and Ben sacrifices himself to save Peter.',
      branch: 'earth-616',
      crossover: false,
      issues: ['Web of Spider-Man #117', 'The Amazing Spider-Man #394', 'Spider-Man #51', 'Spectacular Spider-Man #217'],
      characters: ['peter-parker', 'ben-reilly', 'kaine-parker']
    },
    {
      id: 'ultimate-line',
      title: 'Ultimate Spider-Man',
      year: 2000,
      dateRange: '2000–2011',
      summary: 'Marvel launches the Ultimate imprint to tell modernized, baggage-free stories. Peter Parker is a teenager again in the year 2000. Brian Michael Bendis writes an incredibly successful run that lasts over a decade, culminating in the "Death of Spider-Man" arc where Peter dies defending his family from the Sinister Six, paving the way for Miles Morales.',
      branch: 'earth-1610',
      crossover: false,
      issues: ['Ultimate Spider-Man #1–160', 'Ultimate Fallout #4'],
      characters: ['miles-morales']
    },
    {
      id: 'superior-spider-man',
      title: 'Superior Spider-Man',
      year: 2012,
      dateRange: 'November 2012 – September 2014',
      summary: 'Doctor Octopus swaps bodies with Peter Parker. Peter\'s consciousness dies in Ock\'s decaying body, but forces Ock to experience his lifetime of memories and moral lessons. Ock becomes the Superior Spider-Man, heavily utilizing brutal force, surveillance Spider-Bots, and private armies. He completes Peter\'s doctorate and dates Anna Maria Marconi, but ultimately realizes his hubris prevents him from saving the city, voluntarily erasing his own mind to bring Peter back.',
      branch: 'earth-616',
      crossover: false,
      issues: ['The Amazing Spider-Man #698-700', 'The Superior Spider-Man #1-31'],
      characters: ['peter-parker', 'doc-ock-superior']
    },
    {
      id: 'edge-of-spider-verse',
      title: 'Edge of Spider-Verse',
      year: 2014,
      dateRange: 'September – October 2014',
      summary: 'A prelude mini-series that introduced massive new fan-favorite alternate universe Spider-heroes. Most notably, issue #2 debuted Spider-Gwen (Gwen Stacy of Earth-65), whose sleek design and punk-rock attitude made her an instant breakout star. Issue #5 introduced Peni Parker and SP//dr.',
      branch: 'crossover',
      crossover: true,
      issues: ['Edge of Spider-Verse #1–5'],
      characters: ['gwen-stacy', 'peni-parker', 'spider-man-noir']
    },
    {
      id: 'spider-verse-2014',
      title: 'Spider-Verse (The Original Event)',
      year: 2014,
      dateRange: 'November 2014 – February 2015',
      summary: 'The massive crossover event that united every Spider-Man ever created (with very few legal exceptions). Morlun and his family of immortal energy vampires, the Inheritors, traverse the multiverse slaughtering Spider-Totems. Peter Parker, Otto Octavius (time-displaced), Miles Morales, and dozens of others team up to fight a desperate war across realities, hiding in the cosmic Safe Zone of Earth-13 and fighting a final battle on Loomworld.',
      branch: 'crossover',
      crossover: true,
      issues: ['The Amazing Spider-Man (Vol. 3) #9–15', 'Spider-Verse #1–2'],
      characters: ['peter-parker', 'miles-morales', 'gwen-stacy', 'miguel-ohara', 'silk', 'spider-woman', 'doc-ock-superior', 'ben-reilly', 'kaine-parker', 'peter-porker']
    },
    {
      id: 'spider-geddon-2018',
      title: 'Spider-Geddon',
      year: 2018,
      dateRange: 'October – December 2018',
      summary: 'The direct sequel to Spider-Verse. The Inheritors escape their radioactive prison planet using cloning technology created by Doctor Octopus. Miles Morales takes a massive leadership role, and the event features the death of Spider-Man Noir and the comic debut of the PlayStation 4 Spider-Man.',
      branch: 'crossover',
      crossover: true,
      issues: ['Spider-Geddon #0–5'],
      characters: ['miles-morales', 'peter-parker', 'gwen-stacy', 'miguel-ohara', 'doc-ock-superior', 'hobie-brown']
    },
    {
      id: 'no-way-home-event',
      title: 'No Way Home - The Multiverse Opens',
      year: 2021,
      dateRange: 'December 2021',
      summary: 'A monumental cinematic event where a botched spell by Doctor Strange pulls villains and Spider-Men from alternate realities (the Raimi and Webb continuities) into the MCU (Earth-199999). It served as an unprecedented live-action crossover that provided closure for past film iterations while establishing the MCU Peter Parker as a truly independent hero.',
      branch: 'live-action',
      crossover: true,
      issues: ['Spider-Man: No Way Home (Film)'],
      characters: ['peter-parker']
    }
  ];

  for (const e of events) {
    await prisma.timelineEvent.upsert({
      where: { id: e.id },
      update: {
        title: e.title,
        year: e.year,
        dateRange: e.dateRange,
        summary: e.summary,
        branch: e.branch,
        crossover: e.crossover ?? false,
        issues: e.issues.join(', '),
      },
      create: {
        id: e.id,
        title: e.title,
        year: e.year,
        dateRange: e.dateRange,
        summary: e.summary,
        branch: e.branch,
        crossover: e.crossover ?? false,
        issues: e.issues.join(', '),
      },
    });

    for (const charId of e.characters) {
      await prisma.characterTimelineEvent.upsert({
        where: {
          characterId_eventId: { characterId: charId, eventId: e.id }
        },
        update: {},
        create: { characterId: charId, eventId: e.id }
      });
    }
  }
  console.log('Seeded Timeline Events');

  // 4. Seed Movies
  const movies = [
    {
      id: 'spider-man-2002',
      title: 'Spider-Man',
      year: 2002,
      type: 'live-action',
      continuity: 'Raimi trilogy',
      watchOrder: 1,
      summary: 'Directed by Sam Raimi. Tobey Maguire stars as Peter Parker. The film revolutionized the modern superhero genre, featuring the iconic upside-down kiss and Willem Dafoe\'s legendary performance as the Green Goblin.',
      characters: ['peter-parker']
    },
    {
      id: 'spider-man-2-2004',
      title: 'Spider-Man 2',
      year: 2004,
      type: 'live-action',
      continuity: 'Raimi trilogy',
      watchOrder: 2,
      summary: 'Widely considered one of the greatest superhero films ever made. Peter struggles to balance his personal life with his responsibilities, temporarily losing his powers. Alfred Molina plays the tragic villain Doctor Octopus.',
      characters: ['peter-parker']
    },
    {
      id: 'spider-man-3-2007',
      title: 'Spider-Man 3',
      year: 2007,
      type: 'live-action',
      continuity: 'Raimi trilogy',
      watchOrder: 3,
      summary: 'A financially successful but critically mixed conclusion to the Raimi trilogy. Peter battles the alien symbiote (Venom), Sandman, and the New Goblin. Famous for the "Bully Maguire" street dance sequence.',
      characters: ['peter-parker']
    },
    {
      id: 'amazing-spider-man-2012',
      title: 'The Amazing Spider-Man',
      year: 2012,
      type: 'live-action',
      continuity: 'Amazing duology',
      watchOrder: 4,
      summary: 'A reboot directed by Marc Webb starring Andrew Garfield and Emma Stone. It focuses heavily on Peter\'s parents\' mysterious disappearance and features a highly praised romantic chemistry between the leads.',
      characters: ['peter-parker']
    },
    {
      id: 'amazing-spider-man-2-2014',
      title: 'The Amazing Spider-Man 2',
      year: 2014,
      type: 'live-action',
      continuity: 'Amazing duology',
      watchOrder: 5,
      summary: 'Peter battles Electro and the Green Goblin. The film is infamous for its cluttered plot intended to set up a cinematic universe, but features a beautifully devastating adaptation of "The Night Gwen Stacy Died".',
      characters: ['peter-parker']
    },
    {
      id: 'civil-war-2016',
      title: 'Captain America: Civil War',
      year: 2016,
      type: 'live-action',
      continuity: 'MCU',
      watchOrder: 6,
      summary: 'Tom Holland\'s debut as the MCU Spider-Man. Recruited by Tony Stark, Peter participates in the massive airport battle in Germany, instantly stealing the show by taking down Giant-Man.',
      characters: ['peter-parker']
    },
    {
      id: 'homecoming-2017',
      title: 'Spider-Man: Homecoming',
      year: 2017,
      type: 'live-action',
      continuity: 'MCU',
      watchOrder: 7,
      summary: 'The first solo MCU Spider-Man film. A John Hughes-style high school comedy where Peter tries to prove himself to Iron Man while fighting the Vulture, terrifyingly played by Michael Keaton.',
      characters: ['peter-parker']
    },
    {
      id: 'itsv-2018',
      title: 'Spider-Man: Into the Spider-Verse',
      year: 2018,
      type: 'animated',
      continuity: 'Spider-Verse',
      watchOrder: 8,
      summary: 'An Academy Award-winning masterpiece that revolutionized 3D animation. It introduces Miles Morales to the mainstream audience, featuring a stunning comic-book art style and a heartfelt story about taking leaps of faith.',
      characters: ['miles-morales', 'peter-b-parker', 'gwen-stacy', 'spider-man-noir', 'peter-porker', 'peni-parker']
    },
    {
      id: 'far-from-home-2019',
      title: 'Spider-Man: Far From Home',
      year: 2019,
      type: 'live-action',
      continuity: 'MCU',
      watchOrder: 9,
      summary: 'Dealing with the grief of losing Tony Stark, Peter goes on a European class trip and is manipulated by Mysterio. The film ends with Mysterio revealing Spider-Man\'s identity to the world.',
      characters: ['peter-parker']
    },
    {
      id: 'no-way-home-2021',
      title: 'Spider-Man: No Way Home',
      year: 2021,
      type: 'live-action',
      continuity: 'MCU',
      watchOrder: 10,
      summary: 'A monumental crossover event where Peter Parker, seeking to make the world forget his identity, accidentally opens the multiverse. Tobey Maguire and Andrew Garfield reprise their roles, leading to a massive, emotional third act.',
      characters: ['peter-parker']
    },
    {
      id: 'atsv-2023',
      title: 'Spider-Man: Across the Spider-Verse',
      year: 2023,
      type: 'animated',
      continuity: 'Spider-Verse',
      watchOrder: 11,
      summary: 'A visually breathtaking sequel that expands the multiverse exponentially. Miles clashes with Miguel O\'Hara and the Spider-Society over the necessity of "Canon Events"—tragic moments deemed essential to a Spider-Man\'s timeline.',
      characters: ['miles-morales', 'gwen-stacy', 'miguel-ohara', 'hobie-brown', 'pavitr-prabhakar', 'peter-b-parker']
    }
  ];

  for (const m of movies) {
    await prisma.movie.upsert({
      where: { id: m.id },
      update: {
        title: m.title,
        year: m.year,
        type: m.type,
        continuity: m.continuity,
        watchOrderRank: m.watchOrder,
      },
      create: {
        id: m.id,
        title: m.title,
        year: m.year,
        type: m.type,
        continuity: m.continuity,
        watchOrderRank: m.watchOrder,
      },
    });

    for (const charId of m.characters) {
      await prisma.characterMovie.upsert({
        where: { characterId_movieId: { characterId: charId, movieId: m.id } },
        update: {},
        create: { characterId: charId, movieId: m.id }
      });
    }
  }
  console.log('Seeded Movies');

  // 5. Seed Actors
  const actors = [
    {
      id: 'tobey-maguire',
      name: 'Tobey Maguire',
      role: 'Peter Parker / Spider-Man',
      movies: ['spider-man-2002', 'spider-man-2-2004', 'spider-man-3-2007', 'no-way-home-2021']
    },
    {
      id: 'andrew-garfield',
      name: 'Andrew Garfield',
      role: 'Peter Parker / Spider-Man',
      movies: ['amazing-spider-man-2012', 'amazing-spider-man-2-2014', 'no-way-home-2021']
    },
    {
      id: 'tom-holland',
      name: 'Tom Holland',
      role: 'Peter Parker / Spider-Man',
      movies: ['civil-war-2016', 'homecoming-2017', 'far-from-home-2019', 'no-way-home-2021']
    },
    {
      id: 'shameik-moore',
      name: 'Shameik Moore',
      role: 'Miles Morales / Spider-Man (Voice)',
      movies: ['itsv-2018', 'atsv-2023']
    },
    {
      id: 'hailee-steinfeld',
      name: 'Hailee Steinfeld',
      role: 'Gwen Stacy / Spider-Woman (Voice)',
      movies: ['itsv-2018', 'atsv-2023']
    },
    {
      id: 'oscar-isaac',
      name: 'Oscar Isaac',
      role: 'Miguel O\'Hara / Spider-Man 2099 (Voice)',
      movies: ['itsv-2018', 'atsv-2023']
    }
  ];

  for (const a of actors) {
    await prisma.actor.upsert({
      where: { id: a.id },
      update: { name: a.name, role: a.role },
      create: { id: a.id, name: a.name, role: a.role },
    });

    for (const movieId of a.movies) {
      await prisma.actorMovie.upsert({
        where: { actorId_movieId: { actorId: a.id, movieId } },
        update: {},
        create: { actorId: a.id, movieId }
      });
    }
  }
  console.log('Seeded Actors');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

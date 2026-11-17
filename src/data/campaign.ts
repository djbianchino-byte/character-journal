/**
 * Campaign data for "The Ashen Crown".
 *
 * Content is adapted from the Figma reference frames
 * (Campaign Detail / Characters / Location screens, 59:2842, 59:2775, 59:2795)
 * and extended so every tab has something to show in the prototype.
 */

export type PlayerCharacter = {
  id: string;
  name: string;
  initial: string;
  meta: string;
  playedBy: string;
  tint: string;
  isYou?: boolean;
};

export type Npc = {
  id: string;
  name: string;
  initial: string;
  role: string;
  tint: string;
};

export type CampaignLocation = {
  id: string;
  name: string;
  initial: string;
  region: string;
  summary: string;
  detail: string;
  known: string[];
  tint: string;
  featured?: boolean;
};

export type CampaignEvent = {
  id: string;
  title: string;
  when: string;
  summary: string;
};

export type CampaignArtifact = {
  id: string;
  name: string;
  initial: string;
  kind: string;
  summary: string;
  detail: string;
};

export type SessionNotes = {
  date: string;
  title: string;
  attendance: string[];
  recap: string[];
  loot: string[];
};

export type Campaign = {
  id: string;
  title: string;
  gameMaster: string;
  playerCount: number;
  description: string;
  nextSession: { month: string; day: string; time: string };
  lastSession: SessionNotes;
  story: { title: string; body: string }[];
  roster: PlayerCharacter[];
  npcs: Npc[];
  locations: CampaignLocation[];
  events: CampaignEvent[];
  artifacts: CampaignArtifact[];
};

export const campaign: Campaign = {
  id: 'ashen-crown',
  title: 'The Ashen Crown',
  gameMaster: 'Ryan',
  playerCount: 5,
  description:
    'A realm guarded by knights stands against a growing threat from the north, where winter fortresses fall silent and refugees speak of shadows moving beyond the frozen passes.',

  nextSession: { month: 'NOV', day: '14', time: 'Saturday, 7:00 PM' },

  lastSession: {
    date: 'October 10',
    title: 'The Silent Watch',
    attendance: ['Ser Garyth', 'Elara', 'Kael', 'Lyra', 'Rowan'],
    recap: [
      'The party reached the Silent Fortress at dusk and found the gate unbarred, the watch-fires cold, and every bell in the tower torn down.',
      'Kael read the ash-marks on the chapel floor as a warding rite — one that had been broken from the inside.',
      'A wounded rider from the Frozen Pass warned that something is moving through the mountain, and that the fortresses along the north road have stopped answering.',
      'The session ended in the Undercroft, where a door of grey iron opened at Ser Garyth’s touch and something on the other side said his name.',
    ],
    loot: [
      'An emberglass lantern, still warm',
      'A captain’s signet ring, cracked through the seal',
      'Three vials of wintermelt tonic',
    ],
  },

  story: [
    {
      title: 'The Long Winter',
      body: 'Nineteen winters ago the sun dimmed over the northern marches and did not fully return. Crops fail early, the passes close sooner each year, and the crown has borrowed against a spring that never arrives. The realm holds — but it holds the way a roof holds under too much snow.',
    },
    {
      title: 'The Oath of Ash',
      body: 'The Knights of the North swear their oaths on a crown of ash, not gold: a reminder that every throne returns to the fire. When a knight breaks faith, the crown is said to remember. Lately the old oath has been spoken again in villages that have no knights left to protect them.',
    },
    {
      title: 'What the North Whispers',
      body: 'Refugees arriving at the Last Hearth describe shadows that keep pace with travellers, fortresses that light no fires, and a voice in the mountain that knows the names of the dead. The crown has sent no riders to investigate. The party has decided to go anyway.',
    },
  ],

  roster: [
    {
      id: 'garyth',
      name: 'Ser Garyth',
      initial: 'G',
      meta: 'Human Paladin 3 · played by You',
      playedBy: 'You',
      tint: '#7a5c1f',
      isYou: true,
    },
    {
      id: 'elara',
      name: 'Elara Moonwhisper',
      initial: 'E',
      meta: 'Half-Elf Ranger 3 · played by Aria',
      playedBy: 'Aria',
      tint: '#5f6b8a',
    },
    {
      id: 'kael',
      name: 'Kael Darkhaven',
      initial: 'K',
      meta: 'Dwarf Cleric 3 · played by Cormac',
      playedBy: 'Cormac',
      tint: '#8a4a5e',
    },
    {
      id: 'lyra',
      name: 'Lyra Frostbite',
      initial: 'L',
      meta: 'Gnome Sorcerer 3 · played by Zephyr',
      playedBy: 'Zephyr',
      tint: '#5c7a3a',
    },
    {
      id: 'rowan',
      name: 'Rowan Blackwood',
      initial: 'R',
      meta: 'Human Rogue 3 · played by Lila',
      playedBy: 'Lila',
      tint: '#8a5f2b',
    },
  ],

  npcs: [
    { id: 'bram', name: 'Bram', initial: 'B', role: 'Innkeeper · The Last Hearth', tint: '#6f512b' },
    { id: 'craden', name: 'Craden', initial: 'C', role: 'Minor Lord of the Vale', tint: '#5f6b8a' },
    {
      id: 'maerin',
      name: 'Sister Maerin',
      initial: 'M',
      role: 'Keeper of the Ashen Chapel',
      tint: '#8a4a5e',
    },
    {
      id: 'hald',
      name: 'Captain Hald',
      initial: 'H',
      role: 'Watch of the Frozen Pass',
      tint: '#5c7a3a',
    },
  ],

  locations: [
    {
      id: 'iron-spire',
      name: 'The Iron Spire',
      initial: 'I',
      region: 'Capital of the Realm',
      summary:
        'Seat of the Ashen Crown, where the Knights of the North convene to defend the realm against the shadows.',
      detail:
        'The Iron Spire rises from the oldest part of the capital, a black needle of iron and basalt that has outlived six dynasties. Its lower halls are open to the city; its upper floors are not. The Knights of the North meet in the Crown Room beneath the spire, where the ash crown is kept under glass and never touched.',
      known: [
        'The Crown Room is warded against scrying, but not against names spoken aloud.',
        'Lord Craden holds the west gate and answers only to the crown.',
        'Sister Maerin keeps the chapel in the spire’s shadow.',
      ],
      tint: '#7a5c1f',
      featured: true,
    },
    {
      id: 'frozen-pass',
      name: 'The Frozen Pass',
      initial: 'F',
      region: 'Northern Border',
      summary:
        'A treacherous mountain path where refugees flee the encroaching darkness, guarded by the silent fortresses.',
      detail:
        'The only road through the northern mountains, the Frozen Pass is a week of switchbacks, ice bridges and wind that never stops. Three fortresses watch it: the Silent Fortress, Greywatch, and the ruined tower at Eldrida’s Peak. All three have gone quiet.',
      known: [
        'Refugee trains take nine days and lose a cart in ten.',
        'The fortresses are meant to signal by bell, not by fire.',
        'The pass closes entirely after the first hard freeze.',
      ],
      tint: '#5f6b8a',
      featured: true,
    },
    {
      id: 'blackwood-forest',
      name: 'Blackwood Forest',
      initial: 'B',
      region: 'Ancient Woods',
      summary:
        'A dense, mist-shrouded forest rumored to be home to the ancient spirits of the land.',
      detail:
        'Blackwood is older than the realm and does not much care for it. The trees grow close enough to swallow sound, and the mist that gathers at dusk has a habit of leading travellers in circles. Rowan grew up on its southern edge and still refuses to sleep beneath its branches.',
      known: [
        'The mist rises at dusk and thins only at true dawn.',
        'Old boundary stones mark a path that no map shows.',
        'Something in the wood answers when a name is called three times.',
      ],
      tint: '#5c7a3a',
    },
    {
      id: 'silent-fortress',
      name: 'The Silent Fortress',
      initial: 'S',
      region: 'Northern Outpost',
      summary:
        'A monolithic structure of black stone that stands watch over the Frozen Pass, its walls unbreachable.',
      detail:
        'Built to hold a thousand soldiers, the Silent Fortress was garrisoned by forty. Its walls are unbreached, its gate unbarred, and its watch-fires cold. Whatever happened here did not come through the gate — Kael is certain of that, and it is the only thing he is certain of.',
      known: [
        'The chapel floor is scored with a broken warding rite.',
        'The bell tower was stripped, not looted.',
        'A grey iron door in the Undercroft opens without a key.',
      ],
      tint: '#8a4a5e',
    },
    {
      id: 'eldridas-peak',
      name: 'Eldrida’s Peak',
      initial: 'E',
      region: 'Sacred Mountain',
      summary:
        'The highest point in the realm, said to hold the ancient artifacts of the First Knights.',
      detail:
        'Pilgrims once climbed Eldrida’s Peak to leave an oath at the summit. The climb takes four days and the last is a knife-edge ridge. The shrine at the top is empty — the artifacts of the First Knights were taken south generations ago, and no one agrees on by whom.',
      known: [
        'The shrine has no door, only an arch of wind-carved stone.',
        'The First Knights’ relics left the peak before the current dynasty.',
        'Elara has seen lights on the ridge at night.',
      ],
      tint: '#8a5f2b',
    },
    {
      id: 'shadowed-vale',
      name: 'The Shadowed Vale',
      initial: 'S',
      region: 'Dark Territory',
      summary:
        'A valley shrouded in perpetual twilight, where the shadows seem to move of their own accord.',
      detail:
        'No road enters the Shadowed Vale on purpose. Shepherds who stray into it come back with the same story: the light never changes, the air is warm, and the shadows lag a half-step behind their owners. The crown has declared it cursed and forbidden, which has not stopped anyone from going.',
      known: [
        'Daylight never fully reaches the valley floor.',
        'Compasses drift toward the centre of the vale.',
        'Kael’s order keeps a sealed account of an expedition that did not return.',
      ],
      tint: '#6f512b',
    },
    {
      id: 'last-hearth',
      name: 'The Last Hearth',
      initial: 'L',
      region: 'Refugee Camp',
      summary:
        'A makeshift settlement for those fleeing the north, the last bastion of warmth before the frozen wastes.',
      detail:
        'The Last Hearth began as one inn and a fire that was never allowed to go out. It is now a sprawl of tents, wagons and salvaged doors, home to several hundred people who have nowhere further south to go. Bram keeps the fire and the ledger, and he remembers everyone who passes through.',
      known: [
        'The fire has not gone out in nineteen years.',
        'Bram trades news before coin.',
        'The camp is the last place south of the pass with a roof for every child.',
      ],
      tint: '#8a5f2b',
    },
    {
      id: 'undercroft',
      name: 'The Undercroft',
      initial: 'U',
      region: 'Ancient Ruins',
      summary:
        'Subterranean tunnels and chambers beneath the capital, rumored to hold ancient secrets.',
      detail:
        'The Undercroft predates the Iron Spire by centuries. Its tunnels are dry, warm and unnervingly regular, and they connect the spire to buildings that no longer exist. The city watch seals a new door every few years; the Undercroft opens another.',
      known: [
        'The tunnels run warmer than the city above them.',
        'Grey iron doors appear where no door was cut.',
        'Ser Garyth’s name was spoken from behind one of them.',
      ],
      tint: '#5f6b8a',
    },
    {
      id: 'wailing-coast',
      name: 'The Wailing Coast',
      initial: 'W',
      region: 'Eastern Shore',
      summary:
        'A rocky shoreline where the wind howls through the cliffs, and the sea meets the frozen tundra.',
      detail:
        'The eastern shore is a hard country of black rock and grey water, where the wind carries sound for miles and the locals name the cliffs after the voices they hear in them. Wrecks are common. Rescue is not.',
      known: [
        'The tide leaves a shelf of rock exposed for two hours a day.',
        'Wrecks are stripped by the cliff-folk before the watch arrives.',
        'The “wailing” stops when the northern lights are strong.',
      ],
      tint: '#8a4a5e',
    },
  ],

  events: [
    {
      id: 'silent-watch',
      title: 'The Silent Watch',
      when: 'Three weeks ago',
      summary:
        'The watchtower at the Frozen Pass stopped sending riders. The party was sent to find out why, and found the Silent Fortress empty.',
    },
    {
      id: 'refugees',
      title: 'Refugees at the Last Hearth',
      when: 'Two weeks ago',
      summary:
        'Sixty refugees arrived in a single night, all from the same village, all unwilling to say what followed them south.',
    },
    {
      id: 'undercroft-door',
      title: 'The Grey Iron Door',
      when: 'Last session',
      summary:
        'In the Undercroft beneath the capital, a door with no keyhole opened at Ser Garyth’s touch — and something behind it said his name.',
    },
    {
      id: 'ash-crown',
      title: 'The Crown Room Convenes',
      when: 'Next session',
      summary:
        'The Knights of the North have called a council. Lady Craden will demand answers the party does not yet have.',
    },
  ],

  artifacts: [
    {
      id: 'ashen-crown',
      name: 'The Ashen Crown',
      initial: 'A',
      kind: 'Relic · The North',
      summary:
        'A circlet of blackened ash, kept under glass in the Crown Room. Every knight swears on it, and no one has worn it in living memory.',
      detail:
        'The crown is cold to the touch and leaves a grey smear on the fingers. Old accounts claim it burns the faithless, but the accounts disagree on what faith means. It is the one object in the realm that both the crown and the chapel agree must never leave the spire.',
    },
    {
      id: 'winters-oath',
      name: 'Winter’s Oath',
      initial: 'W',
      kind: 'Longsword · Ser Garyth',
      summary:
        'A plain longsword with a yew-wood grip, given to Garyth when he took his oath. The blade frosts over in the presence of the blight.',
      detail:
        'There is no inscription, only a notch near the guard where it turned a blade meant for someone else. Garyth has never had it repaired. In the Undercroft the frost along the edge did not melt, even in the warm air.',
    },
    {
      id: 'emberglass',
      name: 'Emberglass Lantern',
      initial: 'E',
      kind: 'Wondrous item · Party',
      summary:
        'A lantern of smoked glass that burns without fuel. Found in the Silent Fortress, still warm after weeks in the cold.',
      detail:
        'The flame inside is the colour of a late sunset and gives no heat. It cannot be extinguished by wind or water, only covered. Kael believes it is a fragment of something larger, and that the fortresses used them to keep watch through the long nights.',
    },
    {
      id: 'grey-ledger',
      name: 'The Grey Ledger',
      initial: 'G',
      kind: 'Tome · Unknown hand',
      summary:
        'A ledger of names, debts and oaths kept in an unknown hand. New entries appear without anyone writing them.',
      detail:
        'The ledger was found in the chapel at the Silent Fortress. It lists every knight who has sworn on the Ashen Crown, along with a debt against each name. Ser Garyth’s entry is written in a hand that is not his own.',
    },
  ],
};

export function getLocation(id: string | undefined): CampaignLocation {
  return campaign.locations.find((location) => location.id === id) ?? campaign.locations[0];
}

export const playerCharacters = campaign.roster;
export const npcCharacters = campaign.npcs;

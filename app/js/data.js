// Trophy data: loads app/data/trophies.json and holds the roadmap stages,
// the six steps to the platinum, built from the official descriptions.
export async function loadTrophies() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error('Could not load data/trophies.json');
  const doc = await response.json();
  return doc;
}

export const ROADMAP_STAGES = [
  {
    n: 1,
    title: 'Play the story',
    text: 'Chapters 1–4, the opening mission and the final mission. The six named-mission trophies (Breakfast Run, The Cartel Heist, Child\u2019s Play, Headliners, VCIA Takedown, Operation Savage Glory) are flagged missable: finish each mission when the story offers it and check the trophy pops.',
    ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  },
  {
    n: 2,
    title: 'Finish every strand',
    text: 'The strangers of Leonida: eight mission strands, including the final missions for Andy, Kenton, Billy, Randy and Tyrone. Do the contact finales before the story finale — they are the missable half of this stage.',
    ids: [22, 23, 24, 25, 26, 27],
  },
  {
    n: 3,
    title: 'Learn Leonida\u2019s activities',
    text: 'Shooting range golds, stunts, races, drone races, fishing against Cal, arcade games, bowling, meditation spots and Bret\u2019s hunt. One session per activity type also earns Master of None.',
    ids: [15, 16, 17, 18, 19, 20, 21, 28, 29, 46],
  },
  {
    n: 4,
    title: 'Collect the state',
    text: 'Cards, WAiNK spots, vehicles, the 52 areas, challenges, garages and Scooter Bros registrations. Sweep region by region and log the running counts in the tracker — these are the long tails.',
    ids: [30, 31, 32, 35, 42, 54, 55],
  },
  {
    n: 5,
    title: 'Crime pays',
    text: 'Robberies and heists with your partner, bank vaults, armored trucks, gang operations — and the money loop behind them: launder $250,000 of marked bills, spend $100,000 in the shops.',
    ids: [33, 34, 36, 37, 38, 39, 40, 41, 43, 52, 53],
  },
  {
    n: 6,
    title: 'Odd moments & 100%',
    text: 'The one-off moments — a cocktail on Ocean Beach, the showroom smash, the strange event — then the last percent: 100% completion, and the platinum lands with it.',
    ids: [1, 14, 44, 45, 47, 48, 49, 50, 51],
  },
];

export const KIND_LABELS = {
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  online: 'Online',
  completion: 'Completion',
};

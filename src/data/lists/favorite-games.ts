export interface ListItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
}

export const favoriteGames: ListItem[] = [
    {
        name: 'Inscryption',
        description: 'Mind-bending card game horror mashup',
        url: 'https://store.steampowered.com/app/1092790/Inscryption/',
        tags: ['card-game', 'horror', 'indie'],
    },
    {
        name: 'Undertale',
        description: 'RPG where you don\'t have to kill anyone',
        url: 'https://store.steampowered.com/app/391540/Undertale/',
        tags: ['rpg', 'indie', 'story'],
    },
    {
        name: 'Dave the Diver',
        description: 'Dive by day, run a sushi restaurant by night',
        url: 'https://store.steampowered.com/app/1868140/DAVE_THE_DIVER/',
        tags: ['adventure', 'simulation', 'indie'],
    },
    {
        name: 'Hades',
        description: 'Rogue-like dungeon crawler with Greek gods',
        url: 'https://store.steampowered.com/app/1145360/Hades/',
        tags: ['rogue-like', 'mythology', 'indie'],
    },
    {
        name: 'Hades II',
        description: 'Sequel to the legendary rogue-like',
        url: 'https://store.steampowered.com/app/1145350/Hades_II/',
        tags: ['rogue-like', 'mythology', 'indie'],
    },
    {
        name: 'Baldur\'s Gate III',
        description: 'Epic D&D RPG adventure',
        url: 'https://store.steampowered.com/app/1086940/Baldurs_Gate_3/',
        tags: ['rpg', 'fantasy', 'story'],
    },
    {
        name: 'Clair Obscur: Expedition 33',
        description: 'Beautiful turn-based RPG',
        url: 'https://store.steampowered.com/app/1903340/Clair_Obscur_Expedition_33/',
        tags: ['rpg', 'turn-based', 'story'],
    },
    {
        name: 'Stardew Valley',
        description: 'Relaxing farming simulation',
        url: 'https://store.steampowered.com/app/413150/Stardew_Valley/',
        tags: ['simulation', 'farming', 'indie'],
    },
    {
        name: '12 Minutes',
        description: 'Time loop thriller',
        url: 'https://store.steampowered.com/app/1097200/Twelve_Minutes/',
        tags: ['puzzle', 'thriller', 'indie'],
    },
    {
        name: 'Outer Wilds',
        description: 'Space exploration mystery',
        url: 'https://store.steampowered.com/app/753640/Outer_Wilds/',
        tags: ['exploration', 'puzzle', 'indie'],
    },
    {
        name: 'Europa Universalis IV',
        description: 'Grand strategy nation building',
        url: 'https://store.steampowered.com/app/236850/Europa_Universalis_IV/',
        tags: ['strategy', 'simulation'],
    },
    {
        name: 'RimWorld',
        description: 'Sci-fi colony simulation',
        url: 'https://store.steampowered.com/app/294100/RimWorld/',
        tags: ['simulation', 'strategy', 'colony'],
    },
    {
        name: 'The Witcher 3',
        description: 'Epic open-world RPG',
        url: 'https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/',
        tags: ['rpg', 'open-world', 'fantasy'],
    },
    {
        name: 'Ori Series',
        description: 'Beautiful platformer adventure',
        url: 'https://store.steampowered.com/app/387290/Ori_and_the_Blind_Forest_Definitive_Edition/',
        tags: ['platformer', 'indie', 'story'],
    },
    {
        name: 'Metal Gear Solid V',
        description: 'Tactical espionage action',
        url: 'https://store.steampowered.com/app/287700/METAL_GEAR_SOLID_V_THE_PHANTOM_PAIN/',
        tags: ['action', 'stealth', 'open-world'],
    },
];

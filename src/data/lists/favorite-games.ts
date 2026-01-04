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
        tags: ['card-game', 'horror', 'indie']
    },
    {
        name: 'Undertale',
        description: 'RPG where you don\'t have to kill anyone',
        tags: ['rpg', 'indie', 'story']
    },
    {
        name: 'Dave the Diver',
        description: 'Dive by day, run a sushi restaurant by night',
        tags: ['adventure', 'simulation', 'indie']
    },
    {
        name: 'Hades',
        description: 'Rogue-like dungeon crawler with Greek gods',
        tags: ['rogue-like', 'mythology', 'indie']
    },
    {
        name: 'Hades II',
        description: 'Sequel to the legendary rogue-like',
        tags: ['rogue-like', 'mythology', 'indie']
    },
    {
        name: 'Baldur\'s Gate III',
        description: 'Epic D&D RPG adventure',
        tags: ['rpg', 'fantasy', 'story']
    },
    {
        name: 'Clair Obscur: Expedition 33',
        description: 'Beautiful turn-based RPG',
        tags: ['rpg', 'turn-based', 'story']
    },
    {
        name: 'Stardew Valley',
        description: 'Relaxing farming simulation',
        tags: ['simulation', 'farming', 'indie']
    },
    {
        name: '12 Minutes',
        description: 'Time loop thriller',
        tags: ['puzzle', 'thriller', 'indie']
    },
    {
        name: 'Outer Wilds',
        description: 'Space exploration mystery',
        tags: ['exploration', 'puzzle', 'indie']
    },
    {
        name: 'Europa Universalis IV',
        description: 'Grand strategy nation building',
        tags: ['strategy', 'simulation']
    },
    {
        name: 'RimWorld',
        description: 'Sci-fi colony simulation',
        tags: ['simulation', 'strategy', 'colony']
    },
    {
        name: 'The Witcher 3',
        description: 'Epic open-world RPG',
        tags: ['rpg', 'open-world', 'fantasy']
    },
    {
        name: 'Ori Series',
        description: 'Beautiful platformer adventure',
        tags: ['platformer', 'indie', 'story']
    },
    {
        name: 'Metal Gear Solid V',
        description: 'Tactical espionage action',
        tags: ['action', 'stealth', 'open-world']
    }
];

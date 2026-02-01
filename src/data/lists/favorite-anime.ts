export interface ListItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
}

export const favoriteAnime: ListItem[] = [
    {
        name: 'Code Geass',
        description: 'Strategic genius leads rebellion with mind control power',
        tags: ['mecha', 'strategy', 'thriller']
    },
    {
        name: 'Death Note',
        description: 'Cat and mouse game with notebook that kills',
        tags: ['psychological', 'thriller', 'mystery']
    },
    {
        name: 'To Your Eternity',
        description: 'Immortal being learns what it means to be human',
        tags: ['drama', 'fantasy', 'emotional']
    },
    {
        name: 'Clannad',
        description: 'Heartwarming and emotional slice of life',
        tags: ['drama', 'romance', 'emotional']
    },
    {
        name: 'Angel Beats',
        description: 'Afterlife high school with mystery and action',
        tags: ['drama', 'action', 'supernatural']
    },
    {
        name: '86',
        description: 'War drama about discrimination and humanity',
        tags: ['mecha', 'war', 'drama']
    },
    {
        name: 'Bakuman',
        description: 'Journey to become manga artists',
        tags: ['slice-of-life', 'creative', 'inspirational']
    },
    {
        name: 'No Game No Life',
        description: 'Siblings conquer world through games',
        tags: ['fantasy', 'strategy', 'comedy']
    },
    {
        name: 'Sword Art Online',
        description: 'Trapped in virtual reality MMORPG',
        tags: ['action', 'isekai', 'romance']
    },
    {
        name: 'Dr. Stone',
        description: 'Rebuild civilization with science after apocalypse',
        tags: ['science', 'adventure', 'comedy']
    },
    {
        name: 'Demon Slayer',
        description: 'Beautiful animation with demon hunting',
        tags: ['action', 'supernatural', 'adventure']
    },
    {
        name: 'Zetsuen No Tempest',
        description: 'Magic, mystery, and Shakespeare references',
        tags: ['mystery', 'magic', 'thriller']
    }
];

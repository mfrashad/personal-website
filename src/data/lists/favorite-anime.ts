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
        url: 'https://www.themoviedb.org/tv/31724',
        tags: ['mecha', 'strategy', 'thriller'],
    },
    {
        name: 'Death Note',
        description: 'Cat and mouse game with notebook that kills',
        url: 'https://www.themoviedb.org/tv/13916',
        tags: ['psychological', 'thriller', 'mystery'],
    },
    {
        name: 'To Your Eternity',
        description: 'Immortal being learns what it means to be human',
        url: 'https://www.themoviedb.org/tv/97525',
        tags: ['drama', 'fantasy', 'emotional'],
    },
    {
        name: 'Clannad',
        description: 'Heartwarming and emotional slice of life',
        url: 'https://www.themoviedb.org/tv/24835',
        tags: ['drama', 'romance', 'emotional'],
    },
    {
        name: 'Angel Beats',
        description: 'Afterlife high school with mystery and action',
        url: 'https://www.themoviedb.org/tv/42942',
        tags: ['drama', 'action', 'supernatural'],
    },
    {
        name: '86',
        description: 'War drama about discrimination and humanity',
        url: 'https://www.themoviedb.org/tv/100565',
        tags: ['mecha', 'war', 'drama'],
    },
    {
        name: 'Bakuman',
        description: 'Journey to become manga artists',
        url: 'https://www.themoviedb.org/tv/36041',
        tags: ['slice-of-life', 'creative', 'inspirational'],
    },
    {
        name: 'No Game No Life',
        description: 'Siblings conquer world through games',
        url: 'https://www.themoviedb.org/tv/60808',
        tags: ['fantasy', 'strategy', 'comedy'],
    },
    {
        name: 'Sword Art Online',
        description: 'Trapped in virtual reality MMORPG',
        url: 'https://www.themoviedb.org/tv/45782',
        tags: ['action', 'isekai', 'romance'],
    },
    {
        name: 'Dr. Stone',
        description: 'Rebuild civilization with science after apocalypse',
        url: 'https://www.themoviedb.org/tv/86031',
        tags: ['science', 'adventure', 'comedy'],
    },
    {
        name: 'Demon Slayer',
        description: 'Beautiful animation with demon hunting',
        url: 'https://www.themoviedb.org/tv/85937',
        tags: ['action', 'supernatural', 'adventure'],
    },
    {
        name: 'Zetsuen No Tempest',
        description: 'Magic, mystery, and Shakespeare references',
        url: 'https://www.themoviedb.org/tv/46283',
        tags: ['mystery', 'magic', 'thriller'],
    },
];

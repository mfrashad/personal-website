export interface ListItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
}

export const favoriteNovels: ListItem[] = [
    {
        name: 'Project Hail Mary',
        description: 'A lone astronaut must save humanity',
        tags: ['sci-fi', 'space', 'adventure']
    },
    {
        name: 'Babel',
        description: 'Dark academia meets colonialism and translation magic',
        tags: ['fantasy', 'historical', 'magic']
    },
    {
        name: 'Red Rising',
        description: 'A dystopian sci-fi saga of rebellion',
        tags: ['sci-fi', 'dystopian', 'action']
    },
    {
        name: 'Dark Matter',
        description: 'Multiverse thriller about choices and identity',
        tags: ['sci-fi', 'thriller', 'multiverse']
    },
    {
        name: 'The Hunger Games',
        description: 'Dystopian survival and rebellion',
        tags: ['dystopian', 'action', 'ya']
    },
    {
        name: 'Mistborn',
        description: 'Epic fantasy with unique magic system',
        tags: ['fantasy', 'magic', 'epic']
    }
];

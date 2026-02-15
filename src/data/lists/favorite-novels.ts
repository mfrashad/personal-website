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
        url: 'https://hardcover.app/books/project-hail-mary',
        description: 'A lone astronaut must save humanity',
        tags: ['sci-fi', 'space', 'adventure']
    },
    {
        name: 'Babel',
        url: 'https://hardcover.app/books/babel',
        description: 'Dark academia meets colonialism and translation magic',
        tags: ['fantasy', 'historical', 'magic']
    },
    {
        name: 'Red Rising',
        url: 'https://hardcover.app/books/red-rising',
        description: 'A dystopian sci-fi saga of rebellion',
        tags: ['sci-fi', 'dystopian', 'action']
    },
    {
        name: 'Dark Matter',
        url: 'https://hardcover.app/books/dark-matter',
        description: 'Multiverse thriller about choices and identity',
        tags: ['sci-fi', 'thriller', 'multiverse']
    },
    {
        name: 'The Hunger Games',
        url: 'https://hardcover.app/books/the-hunger-games',
        description: 'Dystopian survival and rebellion',
        tags: ['dystopian', 'action', 'ya']
    },
    {
        name: 'Mistborn',
        url: 'https://hardcover.app/books/mistborn',
        description: 'Epic fantasy with unique magic system',
        tags: ['fantasy', 'magic', 'epic']
    }
];

export interface ListItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
}

export const favoriteProducts: ListItem[] = [
    {
        name: 'Kindle',
        description: 'Best way to read books anywhere',
        tags: ['reading', 'tech']
    },
    {
        name: 'Canon M50 Mark II',
        description: 'Great camera for content creation and vlogging',
        tags: ['photography', 'video', 'tech']
    },
    {
        name: 'Soundcore Space A40',
        description: 'Excellent noise-cancelling earbuds',
        tags: ['audio', 'tech']
    },
    {
        name: 'Mini Bedroom Projector',
        description: 'Perfect for movie nights',
        tags: ['entertainment', 'tech']
    },
    {
        name: 'Foldable Phone Magnet Tripod',
        description: 'Super portable tripod for phone photography',
        tags: ['photography', 'accessories']
    }
];

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
        url: 'https://www.amazon.com/kindle/',
        tags: ['reading', 'tech'],
    },

    {
        name: 'Canon M50 Mark II',
        description: 'Great camera for content creation and vlogging',
        url: 'https://www.canon.co.uk/cameras/eos-m50-mark-ii/',
        tags: ['photography', 'video', 'tech'],
    },

    {
        name: 'Soundcore Space A40',
        description: 'Excellent noise-cancelling earbuds',
        url: 'https://www.soundcore.com/space-a40',
        tags: ['audio', 'tech'],
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

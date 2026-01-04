export interface MockPostcard {
    id: number;
    author: string;
    body: string;
    date: string;
    country?: string;
    websiteUrl?: string;
    paperColor?: string;
    penColor?: string;
    stampSvg?: string;
}

// Varying shades of yellowish/cream white for paper
const paperColors = [
    '#FAF9F6', // Off-white
    '#FFF8DC', // Cornsilk
    '#FFFEF0', // Ivory
    '#F5F5DC', // Beige
    '#FDF5E6', // Old lace
    '#FAEBD7', // Antique white
    '#FFF8E7', // Cosmic latte
    '#FEFCF3', // Floral white
    '#F9F6EE', // Linen
    '#FAF8F1', // Seashell
];

// Generate unique stamp avatars using DiceBear shapes API
const getStampUrl = (seed: string) => `https://api.dicebear.com/9.x/shapes/svg?seed=${seed}`;

const penColors = [
    '#000000', // Black
    '#1a1a1a', // Near black
    '#0f172a', // Slate 900
    '#1e293b', // Slate 800
];

export const mockPostcards: MockPostcard[] = [
    {
        id: 1,
        author: 'Sarah Chen',
        body: 'Love your blog! Your insights on web development are always so helpful. Keep up the great work!',
        date: '2024-12-15',
        country: 'Singapore',
        websiteUrl: 'https://sarahchen.dev',
        paperColor: paperColors[0],
        penColor: penColors[0],
        stampSvg: getStampUrl('sarah-chen-singapore')
    },
    {
        id: 2,
        author: 'Marcus Johnson',
        body: 'Just discovered your site through your article on React patterns. Fantastic content!',
        date: '2024-12-10',
        country: 'United States',
        paperColor: paperColors[1],
        penColor: penColors[1],
        stampSvg: getStampUrl('marcus-johnson-us')
    },
    {
        id: 3,
        author: 'Elena Rodriguez',
        body: 'Your movie reviews are spot on! We have very similar taste in films.',
        date: '2024-12-05',
        country: 'Spain',
        websiteUrl: 'https://elena-movies.com',
        paperColor: paperColors[2],
        penColor: penColors[0],
        stampSvg: getStampUrl('elena-rodriguez-spain')
    },
    {
        id: 4,
        author: 'Yuki Tanaka',
        body: 'Sending greetings from Tokyo! Your digital garden concept inspired me to start my own.',
        date: '2024-11-28',
        country: 'Japan',
        paperColor: paperColors[3],
        penColor: penColors[2],
        stampSvg: getStampUrl('yuki-tanaka-japan')
    },
    {
        id: 5,
        author: 'Ahmed Hassan',
        body: 'Excellent breakdown of TypeScript best practices. Shared it with my team!',
        date: '2024-11-20',
        country: 'Egypt',
        websiteUrl: 'https://ahmeddev.io',
        paperColor: paperColors[4],
        penColor: penColors[1],
        stampSvg: getStampUrl('ahmed-hassan-egypt')
    },
    {
        id: 6,
        author: 'Lena Schmidt',
        body: 'Your book recommendations are always great. Just finished reading one you mentioned!',
        date: '2024-11-15',
        country: 'Germany',
        paperColor: paperColors[5],
        penColor: penColors[3],
        stampSvg: getStampUrl('lena-schmidt-germany')
    },
    {
        id: 7,
        author: 'Oliver Brown',
        body: 'Found your site while researching Astro. Your setup is impressive!',
        date: '2024-11-10',
        country: 'United Kingdom',
        websiteUrl: 'https://oliverbrown.uk',
        paperColor: paperColors[6],
        penColor: penColors[0],
        stampSvg: getStampUrl('oliver-brown-uk')
    },
    {
        id: 8,
        author: 'Isabella Costa',
        body: 'Hi from Brazil! Your posts about remote work really resonate with me.',
        date: '2024-11-05',
        country: 'Brazil',
        paperColor: paperColors[7],
        penColor: penColors[2],
        stampSvg: getStampUrl('isabella-costa-brazil')
    },
    {
        id: 9,
        author: 'David Kim',
        body: 'Your portfolio design is beautiful. Can\'t wait to see what you build next!',
        date: '2024-10-30',
        country: 'South Korea',
        websiteUrl: 'https://davidkim.design',
        paperColor: paperColors[8],
        penColor: penColors[1],
        stampSvg: getStampUrl('david-kim-korea')
    },
    {
        id: 10,
        author: 'Sophie Dubois',
        body: 'Merci for the amazing content! Your explanations are always so clear.',
        date: '2024-10-25',
        country: 'France',
        paperColor: paperColors[9],
        penColor: penColors[0],
        stampSvg: getStampUrl('sophie-dubois-france')
    }
];

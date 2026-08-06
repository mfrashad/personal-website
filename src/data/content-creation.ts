export type ContentType = 'cafe-hopping' | 'educational' | 'products' | 'experience' | 'personal-brand';

export interface ContentPiece {
    id: string;
    title: string;
    location?: string;
    date: Date;
    type: ContentType;
    platform: 'tiktok' | 'instagram' | 'youtube';
    url?: string;
    metrics: {
        views: number;
        likes: number;
        comments: number;
        saves?: number;
        shares?: number;
        newFollowers?: number;
    };
    description?: string;
    brand?: string;
}

/**
 * What a piece of content paid.
 *
 * Deliberately NOT a field on ContentPiece: /create passes pieces to a React
 * island, and island props are serialized into the delivered HTML, so anything
 * hanging off ContentPiece is published whether or not a component renders it.
 * Keeping this in a sibling map means no spread can reach it.
 *
 * Nothing under src/pages or src/components may import this. scripts/validate-content.ts
 * enforces that.
 */
export interface ContentPayment {
    /** Major units, e.g. 1500 for RM1,500. Never a formatted string — this has to stay summable. */
    amount: number;
    /** ISO 4217, e.g. 'MYR', 'USD'. */
    currency: string;
    /** Distinguishes a genuine zero from missing data, so averages aren't silently dragged down. */
    kind: 'cash' | 'barter' | 'cash+barter' | 'unpaid';
    /** Estimated retail value of gifted product, same currency as `amount`. */
    barterValue?: number;
    /** Payer when it isn't the brand itself — agency, PR firm, platform. */
    paidBy?: string;
    /** 'INV-YYYYMMDD-NN', joins to the invoice skill's records. */
    invoiceId?: string;
    /** 'YYYY-MM-DD'. */
    paidOn?: string;
    note?: string;
}

/** Keyed by ContentPiece.id. */
export const contentPayments: Record<string, ContentPayment> = {
    'soundcore-earphones': {
        amount: 700,
        currency: 'MYR',
        kind: 'cash',
    },
};

export const contentCategories: Record<ContentType, { label: string; description: string }> = {

    'personal-brand': {
        label: 'Personal Brand',
        description: 'Career stories, milestones, and personal journey',
    },
    'cafe-hopping': {
        label: 'Cafe Hopping',
        description: 'Cafe and restaurant reviews across Malaysia',
    },
    experience: {
        label: 'Experience',
        description: 'Adventures, hobbies, and trying new things in my 20s',
    },
    educational: {
        label: 'Education & Advocacy',
        description: 'AI literacy, social causes, and building in public',
    },
    products: {
        label: 'Products',
        description: 'Brand collaborations and product showcases',
    },
};

export const brandLogos = [
    { name: 'Biji Biji', src: '/content-images/brandlogos/bijibiji.png' },
    { name: 'Edifier', src: '/content-images/brandlogos/edifier.png' },
    { name: 'Honor', src: '/content-images/brandlogos/honor.png' },
    { name: 'Hulu Cafe', src: '/content-images/brandlogos/hulucafe.png' },
    { name: 'Microsoft', src: '/content-images/brandlogos/microsoft.png' },
    { name: 'Peaches & Cream', src: '/content-images/brandlogos/peachesandcream.png' },
    { name: 'Samsung', src: '/content-images/brandlogos/samsung.png' },
    { name: 'Schola', src: '/content-images/brandlogos/schola.png' },
    { name: 'Touch \'n Go', src: '/content-images/brandlogos/tounchngo.png' },
    { name: 'Cult Creative', src: '/content-images/brandlogos/cultcreative.png' },
];

export const contentPieces: ContentPiece[] = [
    // === Personal Brand ===
    {
        id: 'uni-at-15',
        title: 'How I Got Into Uni at 15',
        date: new Date('2024-04-04'),
        type: 'personal-brand',
        platform: 'tiktok',
        metrics: {
            views: 894908,
            likes: 71500,
            comments: 910,
            saves: 10000,
            shares: 4730,
            newFollowers: 3121,
        },
    },
    {
        id: 'news-kosmo',
        title: 'Featured on Kosmo Online',
        date: new Date('2025-10-12'),
        type: 'personal-brand',
        platform: 'tiktok',
        description: 'Dahulu pelajar UTP termuda, kini pengasas syarikat AI',
        metrics: {
            views: 627353,
            likes: 45400,
            comments: 245,
            saves: 2999,
            shares: 3039,
            newFollowers: 3799,
        },
    },
    {
        id: 'career-journey',
        title: 'My Career Journey',
        date: new Date('2024-04-03'),
        type: 'personal-brand',
        platform: 'tiktok',
        description: '23 y/o startup founder in Malaysia',
        metrics: {
            views: 503551,
            likes: 38000,
            comments: 630,
            saves: 4378,
            shares: 2544,
            newFollowers: 4568,
        },
    },
    {
        id: '1-year-ai-startup',
        title: '1 Year Building an AI Startup',
        date: new Date('2025-08-04'),
        type: 'personal-brand',
        platform: 'tiktok',
        description: 'From zero to 100K users & 6-figures sales',
        metrics: {
            views: 36885,
            likes: 1879,
            comments: 30,
            saves: 427,
            shares: 148,
            newFollowers: 213,
        },
    },
    {
        id: 'public-speaking-journey',
        title: 'My Public Speaking Journey',
        date: new Date('2024-11-21'),
        type: 'personal-brand',
        platform: 'tiktok',
        metrics: {
            views: 34812,
            likes: 3104,
            comments: 39,
            saves: 557,
            shares: 86,
            newFollowers: 203,
        },
    },

    // === Cafe Hopping ===
    {
        id: 'hulu-cafe',
        title: 'Hulu Cafe',
        location: 'Shah Alam',
        date: new Date('2025-08-16'),
        type: 'cafe-hopping',
        platform: 'tiktok',
        metrics: {
            views: 508052,
            likes: 45000,
            comments: 179,
            saves: 25000,
            shares: 8526,
            newFollowers: 511,
        },
    },
    {
        id: 'ame-soeur',
        title: 'The Ame Soeur',
        location: 'Bukit Jalil',
        date: new Date('2025-08-23'),
        type: 'cafe-hopping',
        platform: 'tiktok',
        metrics: {
            views: 495797,
            likes: 25100,
            comments: 280,
            saves: 18900,
            shares: 12600,
            newFollowers: 225,
        },
    },
    {
        id: 'the-farm-bangsar',
        title: 'The Farm Restaurant',
        location: 'Bangsar',
        date: new Date('2024-11-17'),
        type: 'cafe-hopping',
        platform: 'tiktok',
        metrics: {
            views: 472949,
            likes: 43000,
            comments: 105,
            saves: 15000,
            shares: 7103,
            newFollowers: 535,
        },
    },
    {
        id: 'arte-thomas-chan',
        title: 'Arte by Thomas Chan',
        location: 'Kuala Lumpur',
        date: new Date('2024-11-18'),
        type: 'cafe-hopping',
        platform: 'tiktok',
        metrics: {
            views: 307384,
            likes: 23000,
            comments: 177,
            saves: 7124,
            shares: 3328,
            newFollowers: 458,
        },
    },
    {
        id: 'ouranos-gym',
        title: 'Ouranos Gym',
        location: 'Kota Damansara',
        date: new Date('2024-11-23'),
        type: 'experience',
        platform: 'tiktok',
        metrics: {
            views: 144806,
            likes: 12600,
            comments: 112,
            saves: 2206,
            shares: 1979,
            newFollowers: 361,
        },
    },
    {
        id: 'ginger-bamboo-hills',
        title: 'Ginger Restaurant',
        location: 'Bamboo Hills',
        date: new Date('2025-08-23'),
        type: 'cafe-hopping',
        platform: 'tiktok',
        metrics: {
            views: 139553,
            likes: 3896,
            comments: 10,
            saves: 1328,
            shares: 590,
            newFollowers: 74,
        },
    },
    {
        id: 'peaches-n-cream',
        title: 'Peaches & Cream',
        location: 'Kuala Lumpur',
        date: new Date('2026-01-31'),
        type: 'cafe-hopping',
        platform: 'tiktok',
        metrics: {
            views: 4102,
            likes: 123,
            comments: 3,
            saves: 33,
            shares: 19,
            newFollowers: 1,
        },
    },

    // === Experience ===
    {
        id: 'skydiving',
        title: 'Skydiving',
        location: 'Pattaya, Thailand',
        date: new Date('2024-03-03'),
        type: 'experience',
        platform: 'tiktok',
        description: '20 things to try in your 20s - RM 1125',
        metrics: {
            views: 276878,
            likes: 16000,
            comments: 238,
            saves: 7814,
            shares: 4592,
            newFollowers: 603,
        },
    },
    {
        id: 'fun-hobbies',
        title: 'Fun Hobbies You Can Try',
        date: new Date('2024-08-24'),
        type: 'experience',
        platform: 'tiktok',
        description: 'Fun hobbies with the costs',
        metrics: {
            views: 118676,
            likes: 15300,
            comments: 235,
            saves: 5783,
            shares: 2875,
            newFollowers: 441,
        },
    },
    {
        id: 'sewing-workshop',
        title: 'Sewing Workshop',
        date: new Date('2024-11-13'),
        type: 'experience',
        platform: 'tiktok',
        description: 'Learning how to make your own clothes - RM250 for 3 days',
        metrics: {
            views: 87431,
            likes: 6258,
            comments: 89,
            saves: 1854,
            shares: 525,
            newFollowers: 223,
        },
    },
    {
        id: 'pizza-workshop',
        title: 'Pizza Workshop',
        location: 'The Farm Restaurant, KL',
        date: new Date('2024-11-14'),
        type: 'experience',
        platform: 'tiktok',
        metrics: {
            views: 76133,
            likes: 5294,
            comments: 27,
            saves: 1118,
            shares: 509,
            newFollowers: 137,
        },
    },
    {
        id: 'flying-plane',
        title: 'Flying a Plane',
        location: 'Sultan Abdul Aziz Shah Airport',
        date: new Date('2024-02-29'),
        type: 'experience',
        platform: 'tiktok',
        description: 'POV: You achieved your dream of flying a plane',
        metrics: {
            views: 45792,
            likes: 2354,
            comments: 25,
            saves: 800,
            shares: 200,
            newFollowers: 100,
        },
    },
    {
        id: 'rock-climbing',
        title: 'Rock Climbing',
        location: 'Batu Caves',
        date: new Date('2024-03-02'),
        type: 'experience',
        platform: 'tiktok',
        description: '20 things to try in your 20s - #3',
        metrics: {
            views: 20323,
            likes: 439,
            comments: 4,
            saves: 202,
            shares: 57,
            newFollowers: 62,
        },
    },
    {
        id: 'freediving',
        title: 'Freediving',
        location: 'Pulau Tenggol',
        date: new Date('2024-03-01'),
        type: 'experience',
        platform: 'tiktok',
        metrics: {
            views: 12644,
            likes: 208,
            comments: 4,
            saves: 57,
            shares: 15,
            newFollowers: 36,
        },
    },
    {
        id: 'surfing',
        title: 'Surfing',
        date: new Date('2024-03-02'),
        type: 'experience',
        platform: 'tiktok',
        description: '20 adventures in my 20s - #2',
        metrics: {
            views: 12359,
            likes: 199,
            comments: 7,
            saves: 101,
            shares: 19,
            newFollowers: 40,
        },
    },

    // === Educational ===
    {
        id: 'what-we-use-build-startup',
        title: 'What We Use to Build a Startup',
        date: new Date('2024-05-03'),
        type: 'educational',
        platform: 'tiktok',
        description: 'Our tech stack for building a startup in Malaysia',
        metrics: {
            views: 86599,
            likes: 5258,
            comments: 73,
            saves: 4649,
            shares: 604,
            newFollowers: 412,
        },
    },
    {
        id: 'useful-startup-tools',
        title: 'Useful Tools for Building a Startup',
        date: new Date('2024-04-25'),
        type: 'educational',
        platform: 'tiktok',
        metrics: {
            views: 57291,
            likes: 4453,
            comments: 22,
            saves: 3666,
            shares: 307,
            newFollowers: 299,
        },
    },
    {
        id: 'how-to-get-experience',
        title: 'How to Get Experience',
        date: new Date('2024-04-28'),
        type: 'educational',
        platform: 'tiktok',
        description: 'Tips for fresh grads struggling to find jobs',
        metrics: {
            views: 49704,
            likes: 2063,
            comments: 34,
            saves: 811,
            shares: 133,
            newFollowers: 221,
        },
    },
    {
        id: 'day-in-life-startup-founder',
        title: 'Day in a Life as Startup Founder',
        date: new Date('2024-04-26'),
        type: 'educational',
        platform: 'tiktok',
        metrics: {
            views: 46013,
            likes: 2733,
            comments: 113,
            saves: 660,
            shares: 60,
            newFollowers: 196,
        },
    },
    {
        id: 'how-to-find-cofounders',
        title: 'How to Find Cofounders',
        location: 'Antler, Kuala Lumpur',
        date: new Date('2024-07-15'),
        type: 'educational',
        platform: 'tiktok',
        description: 'Malaysia edition - finding cofounders for your startup',
        metrics: {
            views: 16170,
            likes: 1151,
            comments: 19,
            saves: 604,
            shares: 86,
            newFollowers: 89,
        },
    },
    {
        id: 'ai-water-usage',
        title: 'AI Water Usage',
        date: new Date('2026-02-27'),
        type: 'educational',
        platform: 'tiktok',
        description: 'Researching AI water usage - surprising findings',
        metrics: {
            views: 1769,
            likes: 153,
            comments: 5,
            saves: 14,
            shares: 10,
            newFollowers: 0,
        },
    },
    {
        id: 'ai-divide',
        title: 'The AI Divide',
        date: new Date('2026-02-28'),
        type: 'educational',
        platform: 'tiktok',
        description: '84% of the world has never used AI. Only 0.3% pay for it.',
        metrics: {
            views: 825,
            likes: 71,
            comments: 0,
            saves: 6,
            shares: 0,
            newFollowers: 0,
        },
    },

    // === Products (Brand Collabs) ===
    {
        id: 'tng',
        title: 'Touch \'n Go',
        date: new Date('2025-11-15'),
        type: 'products',
        platform: 'tiktok',
        brand: 'Touch \'n Go',
        description: 'Building a global team - paying them made easy',
        metrics: {
            views: 9639,
            likes: 370,
            comments: 6,
            saves: 43,
            shares: 10,
            newFollowers: 17,
        },
    },
    {
        id: 'edifier',
        title: 'Edifier X3 Pro',
        date: new Date('2025-10-19'),
        type: 'products',
        platform: 'tiktok',
        brand: 'Edifier',
        metrics: {
            views: 4907,
            likes: 140,
            comments: 0,
            saves: 6,
            shares: 2,
            newFollowers: 3,
        },
    },
    {
        id: 'bijibiji-microsoft',
        title: 'AI for Malaysia\'s Future',
        date: new Date('2025-06-24'),
        type: 'products',
        platform: 'tiktok',
        brand: 'Biji Biji x Microsoft',
        description: 'Microsoft initiative to equip 800K Malaysians with AI skills',
        metrics: {
            views: 1671,
            likes: 79,
            comments: 1,
            saves: 11,
            shares: 3,
            newFollowers: 0,
        },
    },
    {
        id: 'honor',
        title: 'Honor 400',
        date: new Date('2025-05-26'),
        type: 'products',
        platform: 'tiktok',
        brand: 'Honor',
        description: '200MP camera, 6000mAh battery',
        metrics: {
            views: 1269,
            likes: 60,
            comments: 1,
            saves: 4,
            shares: 3,
            newFollowers: 0,
        },
    },

    
    {
        id: 'unicef-unhcr-collab',
        title: 'World Refugee Day - Yemeni Baking',
        date: new Date('2026-06-13'),
        type: 'educational',
        platform: 'instagram',
        url: 'https://www.instagram.com/p/DZy7o1wkgsF/?igsh=dHRnbjJoamVtZXk=',
        brand: 'UNICEF',
        description: "Spent last Saturday making Yemeni beehive bread and ma'amoul cookies for World Refugee Day as part of UNHCR campaign, taught by Shaima, a refugee from Yemen. #HopeAwayFromHome #WorldRefugeeDay #KitaPilihdKemanusiaan",
        metrics: {
            views: 6200,
            likes: 210,
            comments: 2,
            saves: 4,
            shares: 1,
        },
    },
    {
        id: 'soundcore-earphones',
        title: 'new soundcore earphone',
        date: new Date('2026-07-14'),
        type: 'products',
        platform: 'tiktok',
        metrics: {
            views: 32000,
            likes: 130,
        },
        brand: 'Soundcore',
    },
];

export function getContentByType(): Record<ContentType, ContentPiece[]> {
    const byType: Record<string, ContentPiece[]> = {};
    for (const piece of contentPieces) {
        if (!byType[piece.type]) byType[piece.type] = [];
        byType[piece.type].push(piece);
    }
    // Sort each type by views descending
    for (const type of Object.keys(byType)) {
        byType[type].sort((a, b) => b.metrics.views - a.metrics.views);
    }
    return byType as Record<ContentType, ContentPiece[]>;
}

export function getTotalMetrics() {
    return contentPieces.reduce(
        (acc, piece) => ({
            views: acc.views + piece.metrics.views,
            likes: acc.likes + piece.metrics.likes,
            followers: acc.followers + (piece.metrics.newFollowers || 0),
        }),
        { views: 0, likes: 0, followers: 0 }
    );
}

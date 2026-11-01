export type ContentType = 'cafe-hopping' | 'educational' | 'advocacy' | 'products' | 'experience' | 'personal-brand';

export type ContentPlatform = 'tiktok' | 'instagram' | 'youtube';

export interface ContentMetrics {
    views: number;
    likes: number;
    comments?: number;
    saves?: number;
    shares?: number;
    newFollowers?: number;
}

/**
 * The same piece posted on another platform. The piece's own platform/url/metrics
 * describe the primary post (the one shown first); /create lets visitors flip to
 * each cross-post. Images live in content-images.json under "<id>@<platform>".
 */
export interface CrossPost {
    platform: ContentPlatform;
    url?: string;
    metrics: ContentMetrics;
}

export interface ContentPiece {
    id: string;
    title: string;
    location?: string;
    date: Date;
    type: ContentType;
    platform: ContentPlatform;
    url?: string;
    metrics: ContentMetrics;
    crossPosts?: CrossPost[];
    description?: string;
    brand?: string;
    /** Topic tags shown on the card, e.g. 'Environmental'. See contentTags. */
    tags?: ContentTag[];
}

/** Topic tags for /create cards (mainly advocacy). */
export const contentTags = ['Environmental', 'AI Safety', 'Online Safety', 'Feminism', 'Human Rights'] as const;
export type ContentTag = (typeof contentTags)[number];

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
    advocacy: {
        label: 'Advocacy',
        description: 'AI safety, haze, online safety, gender-based violence, and the stories behind the headlines',
    },
    educational: {
        label: 'Education',
        description: 'Hackathons, research, startups, and AI literacy',
    },
    products: {
        label: 'Brands',
        description: 'Brand collaborations and product showcases',
    },
};

// Ordered by recognition: UN agencies and global brands first, then advocacy
// partners, then regional brands. `scale` widens a logo's max width in the grid
// (for very wide lockups that would otherwise render tiny).
export const brandLogos: { name: string; src: string; scale?: number }[] = [
    { name: 'UNHCR', src: '/content-images/brandlogos/unhcr.png' },
    { name: 'UNODC', src: '/content-images/brandlogos/unodc.png', scale: 1.6 },
    { name: 'Sony', src: '/content-images/brandlogos/sony.png' },
    { name: 'Microsoft', src: '/content-images/brandlogos/microsoft.png' },
    { name: 'Samsung', src: '/content-images/brandlogos/samsung.png' },
    { name: 'Cadbury', src: '/content-images/brandlogos/cadbury.png' },
    { name: 'Honor', src: '/content-images/brandlogos/honor.png' },
    { name: 'TCL', src: '/content-images/brandlogos/tcl.png' },
    { name: 'Kärcher', src: '/content-images/brandlogos/karcher.png' },
    { name: 'Soundcore', src: '/content-images/brandlogos/soundcore.png' },
    { name: 'Edifier', src: '/content-images/brandlogos/edifier.png' },
    { name: 'Project Liber8', src: '/content-images/brandlogos/projectliber8.png' },
    { name: 'Pocket of Pink', src: '/content-images/brandlogos/pocketofpink-icon.png' },
    { name: 'Biji Biji', src: '/content-images/brandlogos/bijibiji.png' },
    { name: 'Cleve', src: '/content-images/brandlogos/cleve.png' },
    { name: 'ILMUchat', src: '/content-images/brandlogos/ilmu.png' },
    { name: 'Touch \'n Go', src: '/content-images/brandlogos/tounchngo.png' },
    { name: 'BJAK', src: '/content-images/brandlogos/bjak.png' },
    { name: 'Wahed', src: '/content-images/brandlogos/wahed.png' },
    { name: 'OATSIDE', src: '/content-images/brandlogos/oatside.png' },
    { name: 'Cult Creative', src: '/content-images/brandlogos/cultcreative.png' },
    { name: 'Schola', src: '/content-images/brandlogos/schola.png' },
    { name: 'Kita Bina', src: '/content-images/brandlogos/kitabina.png' },
    { name: 'Hulu Cafe', src: '/content-images/brandlogos/hulucafe.png' },
    { name: 'Peaches & Cream', src: '/content-images/brandlogos/peachesandcream.png' },
];

// Current audience size across platforms. Kept as a hand-maintained figure
// because it is a live follower count, not the sum of newFollowers per piece
// (which only covers the pieces tracked below).
export const followerCounts = {
    tiktok: 18100,
    instagram: 8865,
};

export const totalFollowers = followerCounts.tiktok + followerCounts.instagram;

export const contentPieces: ContentPiece[] = [
    // === Personal Brand ===
    {
        id: 'uni-at-15',
        title: 'How I Got Into Uni at 15',
        date: new Date('2024-04-04'),
        type: 'personal-brand',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7353916402857807122',
        metrics: {
            views: 903600,
            likes: 71800,
            comments: 902,
            saves: 10700,
            shares: 4759,
            newFollowers: 3121,
        },
    },
    {
        id: 'news-kosmo',
        title: 'Featured on Kosmo Online',
        date: new Date('2025-10-12'),
        type: 'personal-brand',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7560306969215618322',
        description: 'Dahulu pelajar UTP termuda, kini pengasas syarikat AI',
        metrics: {
            views: 644600,
            likes: 45700,
            comments: 243,
            saves: 2988,
            shares: 3072,
            newFollowers: 3799,
        },
    },
    {
        id: 'career-journey',
        title: 'My Career Journey',
        date: new Date('2024-04-03'),
        type: 'personal-brand',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7353613858801601799',
        description: '23 y/o startup founder in Malaysia',
        metrics: {
            views: 535500,
            likes: 39400,
            comments: 603,
            saves: 4454,
            shares: 2630,
            newFollowers: 4568,
        },
    },
    {
        id: 'least-interesting-thing',
        title: 'The Least Interesting Thing About Me',
        date: new Date('2026-09-10'),
        type: 'personal-brand',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7683722661872061703',
        description: 'Hobbies over looks: a photo dump of everything I do',
        metrics: {
            views: 484000,
            likes: 67800,
            comments: 306,
            saves: 2836,
            shares: 3218,
        },
    },
    {
        id: 'maxxing-my-stats',
        title: 'Maxxing My Stats at 25',
        date: new Date('2026-09-26'),
        type: 'personal-brand',
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/DdvteV8ScVV/',
        description: 'From a low-income home of two immigrant parents to the first engineer in the family',
        metrics: {
            views: 120915,
            likes: 3921,
            comments: 22,
            saves: 3197,
            shares: 1419,
        },
    },
    {
        id: '1-year-ai-startup',
        title: '1 Year Building an AI Startup',
        date: new Date('2025-08-04'),
        type: 'personal-brand',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7534691099667926280',
        description: 'From zero to 100K users & 6-figures sales',
        metrics: {
            views: 56300,
            likes: 2041,
            comments: 29,
            saves: 449,
            shares: 159,
            newFollowers: 213,
        },
        crossPosts: [
            {
                platform: 'instagram',
                url: 'https://www.instagram.com/p/DdIo26NEiLA/',
                metrics: {
                    views: 53973,
                    likes: 1455,
                    comments: 22,
                    saves: 484,
                    shares: 255,
                    newFollowers: 147,
                },
            },
        ],
    },
    {
        id: 'be-the-right-person',
        title: 'Be the Right Person',
        date: new Date('2025-08-17'),
        type: 'personal-brand',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7539431766310882568',
        metrics: {
            views: 87900,
            likes: 11000,
            comments: 44,
            saves: 2127,
            shares: 647,
        },
    },
    {
        id: 'life-i-prayed-for',
        title: 'The Life I Once Prayed For',
        date: new Date('2025-08-24'),
        type: 'personal-brand',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7542134674840177928',
        metrics: {
            views: 47900,
            likes: 4054,
            comments: 26,
            saves: 361,
            shares: 73,
        },
        crossPosts: [
            {
                platform: 'instagram',
                url: 'https://www.instagram.com/p/DdVMpBjkoV3/',
                metrics: {
                    views: 26036,
                    likes: 1702,
                    comments: 15,
                    saves: 554,
                    shares: 484,
                    newFollowers: 71,
                },
            },
        ],
    },
    {
        id: 'maxxing-my-stats-bahasa',
        title: 'Maxxing My Stats (Bahasa)',
        date: new Date('2026-09-30'),
        type: 'personal-brand',
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/Dd7AEbYSiEX/',
        description: 'The stat reel, retold in Bahasa for an Indonesian and Malaysian audience',
        metrics: {
            views: 73260,
            likes: 5125,
            comments: 53,
            saves: 2269,
            shares: 1158,
        },
    },
    {
        id: 'first-hackathon-judge',
        title: 'My First Time Judging a Hackathon',
        date: new Date('2024-03-31'),
        type: 'personal-brand',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7352419571258625288',
        metrics: {
            views: 61700,
            likes: 3315,
            comments: 23,
            saves: 627,
            shares: 107,
        },
    },
    {
        id: 'public-speaking-journey',
        title: 'My Public Speaking Journey',
        date: new Date('2024-11-21'),
        type: 'personal-brand',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7439668392425999623',
        metrics: {
            views: 35700,
            likes: 3135,
            comments: 37,
            saves: 563,
            shares: 86,
            newFollowers: 203,
        },
        crossPosts: [
            {
                platform: 'instagram',
                url: 'https://www.instagram.com/p/DdQ__dQklZu/',
                metrics: {
                    views: 12075,
                    likes: 595,
                    comments: 22,
                    saves: 107,
                    shares: 23,
                    newFollowers: 32,
                },
            },
        ],
    },
    {
        id: 'life-documentary',
        title: 'Treating My Life Like a Documentary',
        date: new Date('2026-04-28'),
        type: 'personal-brand',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7633597625014553876',
        metrics: {
            views: 23700,
            likes: 2585,
            comments: 49,
            saves: 1184,
            shares: 158,
        },
        crossPosts: [
            {
                platform: 'instagram',
                url: 'https://www.instagram.com/p/DdKAA5Dkp8b/',
                metrics: {
                    views: 21625,
                    likes: 1094,
                    comments: 35,
                    saves: 766,
                    shares: 474,
                    newFollowers: 142,
                },
            },
        ],
    },
    {
        id: 'parents-inspired-me',
        title: 'How My Parents Inspired Me',
        date: new Date('2026-09-16'),
        type: 'personal-brand',
        platform: 'instagram',
        url: 'https://www.instagram.com/p/DdVmLH_Elgv/',
        metrics: {
            views: 9400,
            likes: 414,
            comments: 12,
            saves: 58,
            shares: 25,
            newFollowers: 12,
        },
        crossPosts: [
            {
                platform: 'tiktok',
                url: 'https://www.tiktok.com/@rashadventure/photo/7686016081810459912',
                metrics: {
                    views: 8090,
                    likes: 308,
                    comments: 3,
                    saves: 48,
                    shares: 3,
                },
            },
        ],
    },

    // === Advocacy ===
    {
        id: 'haze-22-cigarettes',
        title: 'One Day of Haze = 22 Cigarettes',
        date: new Date('2026-10-16'),
        type: 'advocacy',
        tags: ['Environmental'],
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/DekoHRWSQqG/',
        description: 'Why Sarawak\'s haze keeps coming back, and who pays for it',
        metrics: {
            views: 477288,
            likes: 20446,
            comments: 186,
            saves: 2721,
            shares: 15447,
        },
        crossPosts: [
            {
                platform: 'tiktok',
                url: 'https://www.tiktok.com/@rashadventure/video/7697918542913490183',
                metrics: {
                    views: 207800,
                    likes: 16200,
                    comments: 138,
                    saves: 1300,
                    shares: 4524,
                },
            },
        ],
    },
    {
        id: 'covering-sexual-violence',
        title: 'Covering Never Stopped Sexual Violence',
        date: new Date('2026-10-06'),
        type: 'advocacy',
        tags: ['Feminism', 'Human Rights'],
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/DeJu7OzS0NH/',
        description: '3,000+ child sexual crime cases in Malaysia, and why clothing was never the cause',
        metrics: {
            views: 224929,
            likes: 11997,
            comments: 446,
            saves: 515,
            shares: 1489,
        },
    },
    {
        id: 'cybertroopers',
        title: 'Where Cybertroopers Work Hardest',
        date: new Date('2026-10-18'),
        type: 'advocacy',
        tags: ['AI Safety', 'Online Safety'],
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/Deo92GFyLnM/',
        description: 'Paid opinion and bot networks in Malaysian online debate',
        metrics: {
            views: 67865,
            likes: 4324,
            comments: 71,
            saves: 871,
            shares: 1769,
        },
        crossPosts: [
            {
                platform: 'tiktok',
                url: 'https://www.tiktok.com/@rashadventure/video/7700122794620636423',
                metrics: {
                    views: 59300,
                    likes: 8617,
                    comments: 74,
                    saves: 1122,
                    shares: 1199,
                },
            },
        ],
    },
    {
        id: 'haze-bahasa',
        title: 'How Do We Stop the Haze? (Bahasa)',
        date: new Date('2026-10-18'),
        type: 'advocacy',
        tags: ['Environmental'],
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/video/7698012981875019015',
        metrics: {
            views: 107700,
            likes: 6282,
            comments: 67,
            saves: 417,
            shares: 1568,
        },
        crossPosts: [
            {
                platform: 'instagram',
                url: 'https://www.instagram.com/reel/Deo0MowSlxR/',
                metrics: {
                    views: 13111,
                    likes: 650,
                    comments: 21,
                    saves: 99,
                    shares: 167,
                },
            },
        ],
    },
    {
        id: 'islam-modesty',
        title: 'Islam Teaches Modesty, and More',
        date: new Date('2026-10-06'),
        type: 'advocacy',
        tags: ['Feminism', 'Human Rights'],
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/DeJr4aASEWK/',
        description: 'Lower your gaze, forbid oppression: the rest of the teaching',
        metrics: {
            views: 107893,
            likes: 7833,
            comments: 24,
            saves: 526,
            shares: 936,
        },
    },
    {
        id: 'deepfake-nudes',
        title: 'Deepfake Nudes: What Should the Government Do?',
        date: new Date('2026-10-18'),
        type: 'advocacy',
        tags: ['Online Safety', 'AI Safety', 'Feminism'],
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/video/7698247860378324276',
        brand: 'Pocket of Pink',
        metrics: {
            views: 78300,
            likes: 10400,
            comments: 73,
            saves: 1313,
            shares: 2705,
        },
        crossPosts: [
            {
                platform: 'instagram',
                url: 'https://www.instagram.com/reel/Deo1muZSkPO/',
                metrics: {
                    views: 17340,
                    likes: 782,
                    comments: 12,
                    saves: 182,
                    shares: 308,
                },
            },
        ],
    },
    {
        id: 'eudr-haze',
        title: 'Could the EU Deforestation Law Stop Haze?',
        date: new Date('2026-10-25'),
        type: 'advocacy',
        tags: ['Environmental'],
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/De69l2WSNjp/',
        metrics: {
            views: 31681,
            likes: 1220,
            comments: 42,
            saves: 306,
            shares: 522,
        },
        crossPosts: [
            {
                platform: 'tiktok',
                url: 'https://www.tiktok.com/@rashadventure/video/7700617023600037127',
                metrics: {
                    views: 29700,
                    likes: 1295,
                    comments: 59,
                    saves: 183,
                    shares: 85,
                },
            },
        ],
    },
    {
        id: 'scammer-might-be-a-slave',
        title: 'The Scammer Texting You Might Be a Slave',
        date: new Date('2026-10-06'),
        type: 'advocacy',
        tags: ['Human Rights', 'Online Safety'],
        platform: 'instagram',
        url: 'https://www.instagram.com/p/DeJ2kdjElIo/',
        brand: 'Project Liber8 x UNODC',
        description: 'Scam-compound trafficking, from the Stay Safe in Digital Space forum',
        metrics: {
            views: 43747,
            likes: 1274,
            comments: 11,
            saves: 433,
            shares: 304,
            newFollowers: 40,
        },
        crossPosts: [
            {
                platform: 'tiktok',
                url: 'https://www.tiktok.com/@rashadventure/photo/7693541342420405512',
                metrics: {
                    views: 7130,
                    likes: 297,
                    comments: 0,
                    saves: 70,
                    shares: 37,
                },
            },
        ],
    },
    {
        id: 'stop-victim-blaming',
        title: 'Stop Victim Blaming',
        date: new Date('2026-10-11'),
        type: 'advocacy',
        tags: ['Feminism', 'Human Rights'],
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/DeWqvIuSLmo/',
        brand: 'Pocket of Pink',
        description: 'International Day of the Girl Child: make school a safer place',
        metrics: {
            views: 38726,
            likes: 2469,
            comments: 4,
            saves: 170,
            shares: 267,
        },
    },
    {
        id: 'affiliate-ragebait',
        title: 'Why Is Threads So Full of Rage Bait?',
        date: new Date('2026-10-27'),
        type: 'advocacy',
        tags: ['Online Safety'],
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/De-uM9zSOo3/',
        metrics: {
            views: 15590,
            likes: 800,
            comments: 31,
            saves: 184,
            shares: 488,
        },
        crossPosts: [
            {
                platform: 'tiktok',
                url: 'https://www.tiktok.com/@rashadventure/video/7701271855919009031',
                metrics: {
                    views: 5432,
                    likes: 351,
                    comments: 2,
                    saves: 68,
                    shares: 56,
                },
            },
        ],
    },
    {
        id: 'pontianak-haze',
        title: 'Pontianak\'s Air = 35 Cigarettes a Day',
        date: new Date('2026-10-13'),
        type: 'advocacy',
        tags: ['Environmental'],
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/DebM8z-S9JN/',
        metrics: {
            views: 14520,
            likes: 434,
            comments: 1,
            saves: 48,
            shares: 120,
        },
    },
    {
        id: 'fake-nude-what-to-do',
        title: 'What to Do If Someone Sends You a Fake Nude',
        date: new Date('2026-10-17'),
        type: 'advocacy',
        tags: ['Online Safety', 'AI Safety'],
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/DelUw9NSOkJ/',
        metrics: {
            views: 8112,
            likes: 329,
            comments: 1,
            saves: 297,
            shares: 213,
        },
    },
    {
        id: 'unicef-unhcr-collab',
        title: 'World Refugee Day - Yemeni Baking',
        date: new Date('2026-06-13'),
        type: 'advocacy',
        tags: ['Human Rights'],
        platform: 'instagram',
        url: 'https://www.instagram.com/p/DZy7o1wkgsF/',
        brand: 'UNHCR',
        description: 'Spent last Saturday making Yemeni beehive bread and ma\'amoul cookies for World Refugee Day as part of UNHCR campaign, taught by Shaima, a refugee from Yemen. #HopeAwayFromHome #WorldRefugeeDay #KitaPilihdKemanusiaan',
        metrics: {
            views: 6200,
            likes: 210,
            comments: 2,
            saves: 4,
            shares: 20,
        },
    },

    // === Education ===
    {
        id: 'hackathons-not-hacking',
        title: 'Hackathons Aren\'t About Hacking',
        date: new Date('2026-10-09'),
        type: 'educational',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7694882852067970322',
        description: 'You don\'t need to be a CS student or have a team',
        metrics: {
            views: 355000,
            likes: 30500,
            comments: 86,
            saves: 15200,
            shares: 3039,
        },
        crossPosts: [
            {
                platform: 'instagram',
                url: 'https://www.instagram.com/p/DeSk0ejkq_X/',
                metrics: {
                    views: 95206,
                    likes: 3439,
                    comments: 378,
                    saves: 5208,
                    shares: 4356,
                    newFollowers: 510,
                },
            },
        ],
    },
    {
        id: 'research-email-template',
        title: 'How to Get Research Opportunities',
        date: new Date('2026-10-09'),
        type: 'educational',
        platform: 'instagram',
        url: 'https://www.instagram.com/p/DeRfsAyEsg6/',
        description: 'The cold email template that got me into AI research with MIT',
        metrics: {
            views: 103255,
            likes: 4133,
            comments: 559,
            saves: 4604,
            shares: 2651,
            newFollowers: 688,
        },
        crossPosts: [
            {
                platform: 'tiktok',
                url: 'https://www.tiktok.com/@rashadventure/photo/7694648203446177031',
                metrics: {
                    views: 47400,
                    likes: 4735,
                    comments: 26,
                    saves: 2190,
                    shares: 237,
                },
            },
        ],
    },
    {
        id: 'what-we-use-build-startup',
        title: 'What We Use to Build a Startup',
        date: new Date('2024-05-03'),
        type: 'educational',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7364768285180595464',
        description: 'Our tech stack for building a startup in Malaysia',
        metrics: {
            views: 90700,
            likes: 5380,
            comments: 65,
            saves: 4755,
            shares: 618,
            newFollowers: 412,
        },
    },
    {
        id: 'journal-to-content',
        title: 'Turn Your Journal Into Posts',
        date: new Date('2024-07-17'),
        type: 'educational',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7392444680174062849',
        metrics: {
            views: 63600,
            likes: 7298,
            comments: 43,
            saves: 5964,
            shares: 810,
        },
    },
    {
        id: 'useful-startup-tools',
        title: 'Useful Tools for Building a Startup',
        date: new Date('2024-04-25'),
        type: 'educational',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7361641125154688264',
        metrics: {
            views: 57800,
            likes: 4463,
            comments: 22,
            saves: 3666,
            shares: 309,
            newFollowers: 299,
        },
    },
    {
        id: 'how-to-get-experience',
        title: 'How to Get Experience',
        date: new Date('2024-04-28'),
        type: 'educational',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/video/7362911477914684680',
        description: 'Tips for fresh grads struggling to find jobs',
        metrics: {
            views: 49900,
            likes: 2064,
            comments: 28,
            saves: 812,
            shares: 134,
            newFollowers: 221,
        },
    },
    {
        id: 'day-in-life-startup-founder',
        title: 'Day in a Life as Startup Founder',
        date: new Date('2024-04-26'),
        type: 'educational',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7362113790801874184',
        metrics: {
            views: 49600,
            likes: 2781,
            comments: 112,
            saves: 678,
            shares: 62,
            newFollowers: 196,
        },
    },
    {
        id: 'hackathon-resources',
        title: '6 Free Resources to Win Hackathons',
        date: new Date('2026-09-25'),
        type: 'educational',
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/DdtKDVLSnS3/',
        metrics: {
            views: 27289,
            likes: 666,
            comments: 198,
            saves: 1881,
            shares: 1009,
        },
    },
    {
        id: 'startup-funding-programs',
        title: '7 Legal Ways to Fund Your Startup',
        date: new Date('2026-09-24'),
        type: 'educational',
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/DdqWy2rSv4k/',
        description: 'Grants, credits and programs that give founders up to $500K',
        metrics: {
            views: 18566,
            likes: 413,
            comments: 95,
            saves: 903,
            shares: 540,
        },
    },
    {
        id: 'how-to-find-cofounders',
        title: 'How to Find Cofounders',
        location: 'Antler, Kuala Lumpur',
        date: new Date('2024-07-15'),
        type: 'educational',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7391712427596860673',
        description: 'Malaysia edition - finding cofounders for your startup',
        metrics: {
            views: 16800,
            likes: 1170,
            comments: 18,
            saves: 616,
            shares: 90,
            newFollowers: 89,
        },
    },
    {
        id: 'create-your-own-luck',
        title: 'How to Create Your Own Luck',
        date: new Date('2026-10-17'),
        type: 'educational',
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/DelP47tS6QD/',
        metrics: {
            views: 14458,
            likes: 485,
            comments: 60,
            saves: 629,
            shares: 299,
        },
    },
    {
        id: 'ai-water-usage',
        title: 'AI Water Usage',
        date: new Date('2026-02-27'),
        type: 'advocacy',
        tags: ['AI Safety', 'Environmental'],
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/video/7611490841655381268',
        description: 'Researching AI water usage - surprising findings',
        metrics: {
            views: 5304,
            likes: 211,
            comments: 7,
            saves: 32,
            shares: 19,
            newFollowers: 0,
        },
    },
    {
        id: 'ai-divide',
        title: 'The AI Divide',
        date: new Date('2026-02-28'),
        type: 'advocacy',
        tags: ['AI Safety'],
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/video/7611830161847110933',
        description: '84% of the world has never used AI. Only 0.3% pay for it.',
        metrics: {
            views: 4386,
            likes: 106,
            comments: 0,
            saves: 15,
            shares: 0,
            newFollowers: 0,
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
        url: 'https://www.tiktok.com/@rashadventure/photo/7342031927999876354',
        description: '20 things to try in your 20s - RM 1125',
        metrics: {
            views: 297000,
            likes: 16700,
            comments: 238,
            saves: 8224,
            shares: 4784,
            newFollowers: 603,
        },
    },
    {
        id: 'ouranos-gym',
        title: 'Ouranos Gym',
        location: 'Kota Damansara',
        date: new Date('2024-11-23'),
        type: 'experience',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7440373753332239623',
        metrics: {
            views: 149400,
            likes: 12600,
            comments: 108,
            saves: 2214,
            shares: 1993,
            newFollowers: 361,
        },
    },
    {
        id: 'jack-of-all-trades',
        title: 'Jack of All Trades, Master of None',
        date: new Date('2026-09-15'),
        type: 'experience',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/video/7685727280857091335',
        metrics: {
            views: 120600,
            likes: 12900,
            comments: 92,
            saves: 1460,
            shares: 909,
        },
        crossPosts: [
            {
                platform: 'instagram',
                url: 'https://www.instagram.com/reel/DdS3HJ8y_1b/',
                metrics: {
                    views: 8607,
                    likes: 383,
                    comments: 15,
                    saves: 155,
                    shares: 115,
                },
            },
        ],
    },
    {
        id: 'sidequest-ideas',
        title: 'Sidequest Ideas',
        date: new Date('2026-09-06'),
        type: 'experience',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7682222231409184008',
        metrics: {
            views: 81600,
            likes: 9847,
            comments: 77,
            saves: 3907,
            shares: 851,
        },
        crossPosts: [
            {
                platform: 'instagram',
                url: 'https://www.instagram.com/p/Dc8AljzEurg/',
                metrics: {
                    views: 41927,
                    likes: 2190,
                    comments: 22,
                    saves: 1522,
                    shares: 1246,
                    newFollowers: 108,
                },
            },
        ],
    },
    {
        id: 'fun-hobbies',
        title: 'Fun Hobbies You Can Try',
        date: new Date('2024-08-24'),
        type: 'experience',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/video/7406680640642452737',
        description: 'Fun hobbies with the costs',
        metrics: {
            views: 120300,
            likes: 15300,
            comments: 233,
            saves: 5795,
            shares: 2884,
            newFollowers: 441,
        },
    },
    {
        id: 'doomscroll-and-do-all-this',
        title: 'You Can Still Doomscroll and Do All This',
        date: new Date('2025-08-05'),
        type: 'experience',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7534922282515401991',
        metrics: {
            views: 109400,
            likes: 15900,
            comments: 110,
            saves: 5614,
            shares: 1793,
        },
        crossPosts: [
            {
                platform: 'instagram',
                url: 'https://www.instagram.com/p/DdYBqKXEuuW/',
                metrics: {
                    views: 9425,
                    likes: 394,
                    comments: 8,
                    saves: 141,
                    shares: 88,
                    newFollowers: 12,
                },
            },
        ],
    },
    {
        id: 'sewing-workshop',
        title: 'Sewing Workshop',
        date: new Date('2024-11-13'),
        type: 'experience',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/video/7436702149460987143',
        description: 'Learning how to make your own clothes - RM250 for 3 days',
        metrics: {
            views: 101500,
            likes: 6735,
            comments: 89,
            saves: 2035,
            shares: 571,
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
        url: 'https://www.tiktok.com/@rashadventure/photo/7437074840982457618',
        metrics: {
            views: 76700,
            likes: 5298,
            comments: 27,
            saves: 1115,
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
        url: 'https://www.tiktok.com/@rashadventure/photo/7341011015511264513',
        description: 'POV: You achieved your dream of flying a plane',
        metrics: {
            views: 46300,
            likes: 2365,
            comments: 25,
            saves: 799,
            shares: 201,
            newFollowers: 100,
        },
    },
    {
        id: 'chiang-mai',
        title: 'Places to Visit in Chiang Mai',
        location: 'Chiang Mai, Thailand',
        date: new Date('2025-10-13'),
        type: 'experience',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/video/7560375633520364807',
        metrics: {
            views: 34200,
            likes: 766,
            comments: 8,
            saves: 72,
            shares: 35,
        },
    },
    {
        id: 'rock-climbing',
        title: 'Rock Climbing',
        location: 'Batu Caves',
        date: new Date('2024-03-02'),
        type: 'experience',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7341662268632927489',
        description: '20 things to try in your 20s - #3',
        metrics: {
            views: 21000,
            likes: 449,
            comments: 5,
            saves: 206,
            shares: 58,
            newFollowers: 62,
        },
    },
    {
        id: 'surfing',
        title: 'Surfing',
        date: new Date('2024-03-02'),
        type: 'experience',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7341596396757208321',
        description: '20 adventures in my 20s - #2',
        metrics: {
            views: 13300,
            likes: 213,
            comments: 7,
            saves: 120,
            shares: 19,
            newFollowers: 40,
        },
    },
    {
        id: 'freediving',
        title: 'Freediving',
        location: 'Pulau Tenggol',
        date: new Date('2024-03-01'),
        type: 'experience',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7341420837825678593',
        metrics: {
            views: 12900,
            likes: 210,
            comments: 6,
            saves: 61,
            shares: 15,
            newFollowers: 36,
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
        url: 'https://www.tiktok.com/@rashadventure/photo/7539100373307378962',
        metrics: {
            views: 522100,
            likes: 45300,
            comments: 178,
            saves: 25800,
            shares: 8592,
            newFollowers: 511,
        },
        crossPosts: [
            {
                platform: 'instagram',
                url: 'https://www.instagram.com/p/DdO8N-zktS_/',
                metrics: {
                    views: 41198,
                    likes: 6864,
                    comments: 25,
                    saves: 3975,
                    shares: 5034,
                    newFollowers: 98,
                },
            },
        ],
    },
    {
        id: 'ame-soeur',
        title: 'The Ame Soeur',
        location: 'Bukit Jalil',
        date: new Date('2025-08-23'),
        type: 'cafe-hopping',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7541461065943584007',
        metrics: {
            views: 506700,
            likes: 25200,
            comments: 268,
            saves: 18700,
            shares: 12800,
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
        url: 'https://www.tiktok.com/@rashadventure/photo/7437915081628749063',
        metrics: {
            views: 475100,
            likes: 43800,
            comments: 102,
            saves: 15100,
            shares: 7111,
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
        url: 'https://www.tiktok.com/@rashadventure/photo/7438286355853004039',
        metrics: {
            views: 316300,
            likes: 23700,
            comments: 168,
            saves: 7157,
            shares: 3375,
            newFollowers: 458,
        },
    },
    {
        id: 'ginger-bamboo-hills',
        title: 'Ginger Restaurant',
        location: 'Bamboo Hills',
        date: new Date('2025-08-23'),
        type: 'cafe-hopping',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/photo/7541710189364710664',
        metrics: {
            views: 141900,
            likes: 3903,
            comments: 11,
            saves: 1319,
            shares: 609,
            newFollowers: 74,
        },
    },
    {
        id: 'furrito-haus',
        title: 'Furrito Haus Cafe & Pet Mart',
        location: 'Seri Kembangan',
        date: new Date('2024-08-30'),
        type: 'cafe-hopping',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/video/7408838656460426497',
        metrics: {
            views: 103000,
            likes: 1392,
            comments: 21,
            saves: 930,
            shares: 1385,
        },
    },
    {
        id: 'peaches-n-cream',
        title: 'Peaches & Cream',
        location: 'Kuala Lumpur',
        date: new Date('2026-01-31'),
        type: 'cafe-hopping',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/video/7601550449338223893',
        metrics: {
            views: 7117,
            likes: 144,
            comments: 5,
            saves: 47,
            shares: 23,
            newFollowers: 1,
        },
    },

    // === Products (Brand Collabs) ===
    {
        id: 'soundcore-earphones',
        title: 'new soundcore earphone',
        date: new Date('2026-07-14'),
        type: 'products',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/video/7662298488155147538',
        brand: 'Soundcore',
        metrics: {
            views: 39100,
            likes: 149,
            comments: 8,
            saves: 18,
            shares: 12,
        },
    },
    {
        id: 'kitabina-woodworking',
        title: 'Woodworking a Balance Board',
        date: new Date('2026-09-04'),
        type: 'products',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/video/7681755096123723015',
        brand: 'Kita Bina',
        metrics: {
            views: 16700,
            likes: 353,
            comments: 2,
            saves: 45,
            shares: 21,
        },
        crossPosts: [
            {
                platform: 'instagram',
                url: 'https://www.instagram.com/reel/Dc4CLbWyElP/',
                metrics: {
                    views: 11060,
                    likes: 242,
                    comments: 0,
                    saves: 22,
                    shares: 12,
                },
            },
        ],
    },
    {
        id: 'bjak-car-accident',
        title: 'Car Accident? Here\'s What to Do First',
        date: new Date('2026-10-29'),
        type: 'products',
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/DfERJSLSGaw/',
        brand: 'BJAK',
        metrics: {
            views: 12726,
            likes: 315,
            comments: 2,
            saves: 422,
            shares: 267,
        },
        crossPosts: [
            {
                platform: 'tiktok',
                url: 'https://www.tiktok.com/@rashadventure/video/7701962395123617031',
                metrics: {
                    views: 12600,
                    likes: 35,
                    comments: 1,
                    saves: 13,
                    shares: 4,
                },
            },
        ],
    },
    {
        id: 'karcher-floor',
        title: 'How Clean Is Your Floor, Really?',
        date: new Date('2026-10-02'),
        type: 'products',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/video/7692099255816801544',
        brand: 'Kärcher',
        metrics: {
            views: 18500,
            likes: 94,
            comments: 0,
            saves: 7,
            shares: 9,
        },
    },
    {
        id: 'tng',
        title: 'Touch \'n Go',
        date: new Date('2025-11-15'),
        type: 'products',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/video/7572938779162447122',
        brand: 'Touch \'n Go',
        description: 'Building a global team - paying them made easy',
        metrics: {
            views: 11100,
            likes: 382,
            comments: 6,
            saves: 45,
            shares: 11,
            newFollowers: 17,
        },
    },
    {
        id: 'wahed-rent-or-buy',
        title: 'Rent or Buy a Home?',
        date: new Date('2026-09-11'),
        type: 'products',
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/DdIm7g5yLoa/',
        brand: 'Wahed',
        metrics: {
            views: 10885,
            likes: 172,
            comments: 1,
            saves: 51,
            shares: 41,
        },
    },
    {
        id: 'edifier',
        title: 'Edifier X3 Pro',
        date: new Date('2025-10-19'),
        type: 'products',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/video/7562789353370471688',
        brand: 'Edifier',
        metrics: {
            views: 6190,
            likes: 149,
            comments: 0,
            saves: 8,
            shares: 4,
            newFollowers: 3,
        },
    },
    {
        id: 'oatside-sony-40-days',
        title: '40 Days of Taking Content Seriously',
        date: new Date('2026-10-27'),
        type: 'products',
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/De_dbfPSOkg/',
        brand: 'OATSIDE x Sony',
        description: '80+ posts, 1.8M views on IG, 9 brands reaching out',
        metrics: {
            views: 4462,
            likes: 128,
            comments: 2,
            saves: 8,
            shares: 13,
        },
        crossPosts: [
            {
                platform: 'tiktok',
                url: 'https://www.tiktok.com/@rashadventure/video/7701961160743980289',
                metrics: {
                    views: 1234,
                    likes: 88,
                    comments: 0,
                    saves: 8,
                    shares: 1,
                },
            },
        ],
    },
    {
        id: 'yes-ai',
        title: 'Only 1 in 5 Malaysians Use AI',
        date: new Date('2026-10-19'),
        type: 'products',
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/DeqX8JSy3e4/',
        brand: 'Yes x ILMUchat',
        metrics: {
            views: 3874,
            likes: 72,
            comments: 2,
            saves: 7,
            shares: 5,
        },
        crossPosts: [
            {
                platform: 'tiktok',
                url: 'https://www.tiktok.com/@rashadventure/video/7698244971513613620',
                metrics: {
                    views: 1223,
                    likes: 18,
                    comments: 0,
                    saves: 1,
                    shares: 0,
                },
            },
        ],
    },
    {
        id: 'cadbury-cookies',
        title: 'For Once, I Said Yes to Cookies',
        date: new Date('2026-10-29'),
        type: 'products',
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/DfFL3c5SwFa/',
        brand: 'Cadbury',
        metrics: {
            views: 3459,
            likes: 75,
            comments: 7,
            saves: 2,
            shares: 5,
        },
        crossPosts: [
            {
                platform: 'tiktok',
                url: 'https://www.tiktok.com/@rashadventure/video/7702096282172673288',
                metrics: {
                    views: 1313,
                    likes: 52,
                    comments: 0,
                    saves: 4,
                    shares: 1,
                },
            },
        ],
    },
    {
        id: 'kl20-summit',
        title: 'KL20 Summit',
        date: new Date('2026-10-25'),
        type: 'products',
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/De69_RSyf6u/',
        brand: 'KL20',
        metrics: {
            views: 2526,
            likes: 61,
            comments: 1,
            saves: 6,
            shares: 6,
        },
        crossPosts: [
            {
                platform: 'tiktok',
                url: 'https://www.tiktok.com/@rashadventure/video/7700617464115236114',
                metrics: {
                    views: 620,
                    likes: 38,
                    comments: 0,
                    saves: 5,
                    shares: 2,
                },
            },
        ],
    },
    {
        id: 'samsung-s26-ultra',
        title: 'Galaxy S26 Ultra Privacy Display',
        date: new Date('2026-03-10'),
        type: 'products',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/video/7615627136287788308',
        brand: 'Samsung',
        metrics: {
            views: 3025,
            likes: 31,
            comments: 1,
            saves: 7,
            shares: 5,
        },
    },
    {
        id: 'bijibiji-microsoft',
        title: 'AI for Malaysia\'s Future',
        date: new Date('2025-06-24'),
        type: 'products',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/video/7519545937161637128',
        brand: 'Biji Biji x Microsoft',
        description: 'Microsoft initiative to equip 800K Malaysians with AI skills',
        metrics: {
            views: 1688,
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
        url: 'https://www.tiktok.com/@rashadventure/video/7508749829925768455',
        brand: 'Honor',
        description: '200MP camera, 6000mAh battery',
        metrics: {
            views: 1515,
            likes: 61,
            comments: 1,
            saves: 4,
            shares: 4,
            newFollowers: 0,
        },
    },
    {
        id: 'tcl-mini-led',
        title: '3 Things to Check Before Buying a Mini LED TV',
        date: new Date('2026-10-29'),
        type: 'products',
        platform: 'tiktok',
        url: 'https://www.tiktok.com/@rashadventure/video/7701966072269901063',
        brand: 'TCL',
        metrics: {
            views: 794,
            likes: 48,
            comments: 0,
            saves: 7,
            shares: 0,
        },
    },
];

export function getContentByType(): Record<ContentType, ContentPiece[]> {
    const byType: Record<string, ContentPiece[]> = {};
    for (const piece of contentPieces) {
        if (!byType[piece.type]) byType[piece.type] = [];
        byType[piece.type].push(piece);
    }
    // Best-performing first: views summed across every platform the piece was posted on
    for (const type of Object.keys(byType)) {
        byType[type].sort((a, b) => totalViews(b) - totalViews(a));
    }
    return byType as Record<ContentType, ContentPiece[]>;
}

/** Views across the primary post and every cross-post. */
export function totalViews(piece: ContentPiece): number {
    return piece.metrics.views + (piece.crossPosts ?? []).reduce((sum, c) => sum + c.metrics.views, 0);
}

export function getTotalMetrics() {
    let views = 0;
    let likes = 0;
    for (const piece of contentPieces) {
        for (const m of [piece.metrics, ...(piece.crossPosts ?? []).map((c) => c.metrics)]) {
            views += m.views;
            likes += m.likes;
        }
    }
    return { views, likes, followers: totalFollowers };
}

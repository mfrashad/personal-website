export interface BrandAsset {
    name: string;
    type: 'logo' | 'photo' | 'color' | 'font' | 'template';
    url: string;
    downloadUrl?: string;
    description?: string;
}

export interface TimelineItem {
    text: string;
    icon?: string;
    color?: string;
}

export interface BrandKit {
    bios: {
        tldr: string;
        short: string;
        medium: string;
        long: string;
    };
    timeline: {
        tldr: {
            currently: TimelineItem[];
            previously: TimelineItem[];
        };
        short: {
            currently: TimelineItem[];
            previously: TimelineItem[];
        };
        medium: {
            currently: TimelineItem[];
            previously: TimelineItem[];
        };
        long: {
            currently: TimelineItem[];
            previously: TimelineItem[];
        };
    };
    photos: BrandAsset[];
    topics: string[];
    socialLinks: { platform: string; url: string; username: string }[];
}

export const brandKit: BrandKit = {
    bios: {
        tldr: "ML engineer, co-founder & CTO at Cleve, [speaker](/speaking) on AI/tech/career. 100K users, [20 talks](/speaking), 20K followers. I also [read](/books), [write](/blog), and [watch movies](/movies).",

        short: "Rashad is a co-founder & CTO at Cleve, where he builds AI-powered tools that have reached 100,000+ users. He's also a [speaker](/speaking) on AI, technology, and career development, with [20 talks delivered](/speaking) and a growing audience of 20,000+ followers on social media.\n\nIn his free time, he likes to [try new things](/achievements), do some [reading](/books) and [writing](/blog), and [watch movies](/movies).",

        medium: "Rashad is a machine learning engineer and entrepreneur currently serving as co-founder & CTO at Cleve, building AI-powered products that have impacted over 100,000 users.\n\nHis journey started early - hacking at 11, entering university at 15, publishing his first game at 16, and working at a startup by 17. At 19, he published research with MIT on CreativeGAN. He graduated as valedictorian at 20, founded an AI consulting company at 21, and co-founded his current venture-backed startup at 22.\n\nRashad is passionate about sharing knowledge through [public speaking](/speaking), having [delivered 20+ talks](/speaking) on AI, technology, career development, and startups. He's also a [content creator on TikTok](https://tiktok.com/@rashadventure) with 5M+ views and [judges hackathons](/achievements) to support the next generation of builders.\n\nIn his free time, he likes to [try new things](/achievements), do some [reading](/books) and [writing](/blog), and [watch movies](/movies).",

        long: "Rashad is a machine learning engineer, entrepreneur, and educator who has been building with technology since age 11. He is currently the co-founder & CTO at Cleve, where he leads the development of AI-powered tools that have reached over 100,000 users globally.\n\n**Early Beginnings**\nRashad's unconventional path started with hacking at age 11, followed by entering university at 15 - making him one of the youngest students in his cohort. By 16, he had published his first game, and at 17, secured his first tech internship at a startup.\n\n**Academic Excellence**\nAt 18, he founded a tech club to build community and share knowledge. The following year, at 19, he published research on CreativeGAN in collaboration with MIT, presented at ASME IDETC/CIE 2021. He graduated at 20 as valedictorian, earning four academic awards and recognition as the best graduate of his class.\n\n**Entrepreneurship**\nAt 21, Rashad founded an AI consulting company, helping businesses implement machine learning solutions. A year later, at 22, he co-founded Cleve, a venture-backed startup focused on AI-powered productivity tools.\n\n**Speaking & Community**\nRashad is passionate about education and community building. He has [delivered 20+ talks](/speaking) on AI, technology, career development, and startups at various institutions and events. He regularly [judges hackathons](/achievements) (10+ events) and has [won 5 hackathons](/achievements) himself as a participant.\n\n**Content Creation**\nAs a [content creator on TikTok](https://tiktok.com/@rashadventure), Rashad has built an audience of 20,000+ followers and generated over 5 million views through educational content on AI, tech careers, and productivity.\n\n**Personal Interests**\nWhen he's not building products or creating content, Rashad enjoys [trying new things](/achievements), [reading](/books), [writing](/blog), and [watching movies](/movies).\n\n**Impact**\nThrough his companies, talks, and content, Rashad has directly impacted over 100,000 people - whether through products they use, talks they've attended, or content they've consumed. His mission is to democratize access to AI knowledge and empower the next generation of builders."
    },

    timeline: {
        tldr: {
            currently: [
                { text: 'co-founder & cto at cleve', icon: '💼' }
            ],
            previously: [
                { text: 'entered uni @ 15', icon: '🎓' },
                { text: 'published paper with MIT @ 19', icon: '📄' },
                { text: 'founded AI consulting company @ 21', icon: '💼' }
            ]
        },
        short: {
            currently: [
                { text: 'co-founder & cto at cleve', icon: '💼' },
                { text: 'speaker on ai, tech, career, startup', icon: '🎤' },
                { text: 'content creator on tiktok', icon: '📹' }
            ],
            previously: [
                { text: 'entered uni @ 15', icon: '🎓' },
                { text: 'published paper with MIT @ 19', icon: '📄' },
                { text: 'best graduate (valedictorian) @ 20', icon: '🏆' },
                { text: 'founded AI consulting company @ 21', icon: '💼' },
                { text: 'co-founder at venture backed startup @ 22', icon: '⭐' }
            ]
        },
        medium: {
            currently: [
                { text: 'co-founder & cto at cleve', icon: '💼' },
                { text: 'speaker on ai, tech, career, startup', icon: '🎤' },
                { text: 'content creator on tiktok', icon: '📹' },
                { text: 'occasionally judge hackathons', icon: '⚖️' }
            ],
            previously: [
                { text: 'entered uni @ 15', icon: '🎓' },
                { text: 'published game @ 16', icon: '🎮' },
                { text: 'startup tech intern @ 17', icon: '🚀' },
                { text: 'founded a tech club @ 18', icon: '👥' },
                { text: 'published paper with MIT @ 19', icon: '📄' },
                { text: 'best graduate (valedictorian) @ 20', icon: '🏆' },
                { text: 'founded AI consulting company @ 21', icon: '💼' },
                { text: 'co-founder at venture backed startup @ 22', icon: '⭐' }
            ]
        },
        long: {
            currently: [
                { text: 'co-founder & cto at cleve', icon: '💼' },
                { text: 'speaker on ai, tech, career, startup', icon: '🎤' },
                { text: 'occasionally judge hackathons', icon: '⚖️' },
                { text: 'content creator on tiktok', icon: '📹' },
                { text: 'ai resident at 500 global', icon: '🎓' }
            ],
            previously: [
                { text: 'hacking @ 11', icon: '💻' },
                { text: 'entered uni @ 15', icon: '🎓' },
                { text: 'published game @ 16', icon: '🎮' },
                { text: 'startup tech intern @ 17', icon: '🚀' },
                { text: 'founded a tech club @ 18', icon: '👥' },
                { text: 'published paper with MIT @ 19', icon: '📄' },
                { text: 'best graduate (valedictorian) @ 20', icon: '🏆' },
                { text: 'founded AI consulting company @ 21', icon: '💼' },
                { text: 'co-founder at venture backed startup @ 22', icon: '⭐' }
            ]
        }
    },

    photos: [
        {
            name: 'Professional Headshot',
            type: 'photo',
            url: '/media/profile.JPEG',
            downloadUrl: '/media/profile.JPEG',
            description: 'Professional picture for media use'
        },
        {
            name: 'Speaking Photo 1',
            type: 'photo',
            url: '/media/speaking1.JPEG',
            downloadUrl: '/media/speaking1.JPEG',
            description: 'Photo from a speaking engagement'
        },
        {
            name: 'Speaking Photo 2',
            type: 'photo',
            url: '/media/speaking2.JPEG',
            downloadUrl: '/media/speaking2.JPEG',
            description: 'Photo from a speaking engagement'
        },
        {
            name: 'Speaking Photo 3',
            type: 'photo',
            url: '/media/speaking3.JPEG',
            downloadUrl: '/media/speaking3.JPEG',
            description: 'Photo from a speaking engagement'
        },

    ],

    topics: [
        'AI',
        'Generative AI',
        'AI Safety & Regulations',
        'Startups & Entrepreneurship',
        'Tech Career Development',
        'Content Creation',
        'Public Speaking',
        'Software Engineering'
    ],

    socialLinks: [
        { platform: 'X (Twitter)', url: 'https://twitter.com/rashadventure', username: '@rashadventure' },
        { platform: 'Instagram', url: 'https://instagram.com/rashadventure', username: '@rashadventure' },
        { platform: 'TikTok', url: 'https://tiktok.com/@rashadventure', username: '@rashadventure' },
        { platform: 'Medium', url: 'https://medium.com/@rashadventure', username: '@rashadventure' },
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/mfathyrashad', username: 'mfathyrashad' },
        { platform: 'GitHub', url: 'https://github.com/mfrashad', username: 'mfrashad' }
    ]
};

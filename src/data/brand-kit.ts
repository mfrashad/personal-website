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
    bios: string[]; // Array of 20 bio variations, from minimal to comprehensive
    timeline: {
        currently: TimelineItem[];
        previously: TimelineItem[];
    }[]; // Array of 20 timeline variations
    photos: BrandAsset[];
    topics: string[];
    socialLinks: { platform: string; url: string; username: string }[];
}

export const brandKit: BrandKit = {
    bios: [
        // Level 0: Minimal introduction
        "ML engineer, co-founder at Cleve.",

        // Level 1: Add CTO title
        "ML engineer, co-founder & CTO at Cleve.",

        // Level 2: Add speaking link
        "ML engineer, co-founder & CTO at Cleve. [Speaker](/speaking) on AI and tech.",

        // Level 3: Add user impact
        "ML engineer, co-founder & CTO at Cleve. [Speaker](/speaking) on AI and tech. 100K+ users reached.",

        // Level 4: Add talk count
        "ML engineer, co-founder & CTO at Cleve. [Speaker](/speaking) on AI, tech, and career. 100K+ users, [20+ talks](/speaking).",

        // Level 5: Add social following and interests
        "ML engineer, co-founder & CTO at Cleve. [Speaker](/speaking) on AI, tech, and career. 100K+ users, [20+ talks](/speaking), 20K+ followers. I also [read](/books), [write](/blog), and [watch movies](/movies).",

        // Level 6: Expand to sentence form, add "Rashad is"
        "Rashad is an ML engineer and co-founder & CTO at Cleve, building AI tools for 100K+ users. He's a [speaker](/speaking) on AI and tech with [20+ talks](/speaking) delivered. He also likes to [read](/books), [write](/blog), and [watch movies](/movies).",

        // Level 7: Add more context to role
        "Rashad is a machine learning engineer and co-founder & CTO at Cleve, where he builds AI-powered tools that have reached 100,000+ users. He's a [speaker](/speaking) on AI, technology, and career development, with [20+ talks](/speaking) delivered and 20,000+ followers. He also likes to [read](/books), [write](/blog), and [watch movies](/movies).",

        // Level 8: Add "try new things" link
        "Rashad is a machine learning engineer and co-founder & CTO at Cleve, where he builds AI-powered tools that have reached 100,000+ users. He's a [speaker](/speaking) on AI, technology, and career development, with [20+ talks](/speaking) delivered and a growing audience of 20,000+ followers.\n\nIn his free time, he likes to [try new things](/achievements), [read](/books), [write](/blog), and [watch movies](/movies).",

        // Level 9: Add entrepreneur label and journey intro
        "Rashad is a machine learning engineer and entrepreneur, co-founder & CTO at Cleve, where he builds AI-powered tools that have reached 100,000+ users.\n\nHis journey started early - he began hacking at 11 and entered university at 15. He's passionate about [speaking](/speaking) on AI and tech ([20+ talks](/speaking)) and sharing what he learns.\n\nIn his free time, he likes to [try new things](/achievements), [read](/books), [write](/blog), and [watch movies](/movies).",

        // Level 10: Add more journey milestones
        "Rashad is a machine learning engineer and entrepreneur, co-founder & CTO at Cleve, building AI-powered products that have impacted over 100,000 users.\n\nHis journey started early - hacking at 11, entering university at 15, publishing his first game at 16, and working at a startup by 17. He's passionate about sharing knowledge through [public speaking](/speaking), having delivered [20+ talks](/speaking).\n\nIn his free time, he likes to [try new things](/achievements), [read](/books), [write](/blog), and [watch movies](/movies).",

        // Level 11: Add MIT research and valedictorian
        "Rashad is a machine learning engineer and entrepreneur, co-founder & CTO at Cleve, building AI-powered products that have impacted over 100,000 users.\n\nHis journey started early - hacking at 11, entering university at 15, publishing his first game at 16, and working at a startup by 17. At 19, he published research with MIT. He graduated as valedictorian at 20.\n\nRashad is passionate about sharing knowledge through [public speaking](/speaking), having delivered [20+ talks](/speaking) on AI, technology, and career development.\n\nIn his free time, he likes to [try new things](/achievements), [read](/books), [write](/blog), and [watch movies](/movies).",

        // Level 12: Add founding milestones
        "Rashad is a machine learning engineer and entrepreneur, co-founder & CTO at Cleve, building AI-powered products that have impacted over 100,000 users.\n\nHis journey started early - hacking at 11, entering university at 15, publishing his first game at 16, and working at a startup by 17. At 19, he published research with MIT on CreativeGAN. He graduated as valedictorian at 20, founded an AI consulting company at 21, and co-founded his current venture-backed startup at 22.\n\nRashad is passionate about sharing knowledge through [public speaking](/speaking), having delivered [20+ talks](/speaking) on AI, technology, and career development.\n\nIn his free time, he likes to [try new things](/achievements), [read](/books), [write](/blog), and [watch movies](/movies).",

        // Level 13: Add content creator detail
        "Rashad is a machine learning engineer and entrepreneur, co-founder & CTO at Cleve, building AI-powered products that have impacted over 100,000 users.\n\nHis journey started early - hacking at 11, entering university at 15, publishing his first game at 16, and working at a startup by 17. At 19, he published research with MIT on CreativeGAN. He graduated as valedictorian at 20, founded an AI consulting company at 21, and co-founded his current venture-backed startup at 22.\n\nRashad is passionate about sharing knowledge through [public speaking](/speaking), having delivered [20+ talks](/speaking) on AI, technology, career development, and startups. He's also a [content creator on TikTok](https://tiktok.com/@rashadventure) with 5M+ views.\n\nIn his free time, he likes to [try new things](/achievements), [read](/books), [write](/blog), and [watch movies](/movies).",

        // Level 14: Add hackathon judging
        "Rashad is a machine learning engineer and entrepreneur, co-founder & CTO at Cleve, building AI-powered products that have impacted over 100,000 users.\n\nHis journey started early - hacking at 11, entering university at 15, publishing his first game at 16, and working at a startup by 17. At 19, he published research with MIT on CreativeGAN. He graduated as valedictorian at 20, founded an AI consulting company at 21, and co-founded his current venture-backed startup at 22.\n\nRashad is passionate about sharing knowledge through [public speaking](/speaking), having delivered [20+ talks](/speaking) on AI, technology, career development, and startups. He's also a [content creator on TikTok](https://tiktok.com/@rashadventure) with 5M+ views and [judges hackathons](/achievements) to support the next generation of builders.\n\nIn his free time, he likes to [try new things](/achievements), [read](/books), [write](/blog), and [watch movies](/movies).",

        // Level 15: Add educator label and expand introduction
        "Rashad is a machine learning engineer, entrepreneur, and educator who has been building with technology since age 11. He is currently the co-founder & CTO at Cleve, where he leads the development of AI-powered tools that have reached over 100,000 users.\n\nHis journey started early - hacking at 11, entering university at 15, publishing his first game at 16, and working at a startup by 17. At 19, he published research with MIT on CreativeGAN. He graduated as valedictorian at 20, founded an AI consulting company at 21, and co-founded his current venture-backed startup at 22.\n\nRashad is passionate about sharing knowledge through [public speaking](/speaking), having delivered [20+ talks](/speaking) on AI, technology, career development, and startups. He's also a [content creator on TikTok](https://tiktok.com/@rashadventure) with 5M+ views and [judges hackathons](/achievements) to support the next generation of builders.\n\nIn his free time, he likes to [try new things](/achievements), [read](/books), [write](/blog), and [watch movies](/movies).",

        // Level 16: Add /about link and section headers
        "Rashad is a machine learning engineer, entrepreneur, and educator who has been building with technology since age 11. He is currently the co-founder & CTO at Cleve, where he leads the development of AI-powered tools that have reached over 100,000 users globally. [Learn more about him](/about).\n\n**Early Journey**\nHis unconventional path started with hacking at age 11, followed by entering university at 15. By 16, he had published his first game, and at 17, secured his first tech internship at a startup. At 19, he published research on CreativeGAN with MIT, presented at ASME IDETC/CIE 2021. He graduated at 20 as valedictorian, earning four academic awards.\n\n**Entrepreneurship**\nAt 21, Rashad founded an AI consulting company, helping businesses implement ML solutions. At 22, he co-founded Cleve, a venture-backed startup focused on AI-powered productivity tools.\n\n**Speaking & Community**\nRashad is passionate about education and community building. He has [delivered 20+ talks](/speaking) on AI, technology, and career development. He's also a [content creator on TikTok](https://tiktok.com/@rashadventure) with 20K+ followers and 5M+ views, and regularly [judges hackathons](/achievements).\n\n**Personal**\nHe enjoys [trying new things](/achievements), [reading](/books), [writing](/blog), and [watching movies](/movies).",

        // Level 17: Add more links (/projects, /lists) and expand sections
        "Rashad is a machine learning engineer, entrepreneur, and educator who has been building with technology since age 11. He is currently the co-founder & CTO at Cleve, where he leads the development of [AI-powered tools](/projects) that have reached over 100,000 users globally. [Learn more about him](/about) or check out [what he's up to now](/now).\n\n**Early Journey**\nHis unconventional path started with hacking at age 11, followed by entering university at 15 - making him one of the youngest students in his cohort. By 16, he had published his first game, and at 17, secured his first tech internship at a startup.\n\n**Academic Excellence**\nAt 18, he founded a tech club to build community and share knowledge. At 19, he published research on CreativeGAN in collaboration with MIT, presented at ASME IDETC/CIE 2021. He graduated at 20 as valedictorian, earning four academic awards and recognition as the best graduate of his class.\n\n**Entrepreneurship**\nAt 21, Rashad founded an AI consulting company, helping businesses implement machine learning solutions. A year later, at 22, he co-founded Cleve, a venture-backed startup focused on AI-powered productivity tools.\n\n**Speaking & Community**\nRashad is passionate about education and community building. He has [delivered 20+ talks](/speaking) on AI, technology, career development, and startups. He's also a [content creator on TikTok](https://tiktok.com/@rashadventure) with 20K+ followers and 5M+ views, and regularly [judges hackathons](/achievements) (10+ events).\n\n**Personal**\nWhen he's not building or creating, he enjoys [trying new things](/achievements), [reading](/books), [writing](/blog), and [watching movies](/movies). Check out his [curated lists](/lists) and [bookmarks](/bookmarks).",

        // Level 18: Add hackathon wins and AI resident detail
        "Rashad is a machine learning engineer, entrepreneur, and educator who has been building with technology since age 11. He is currently the co-founder & CTO at Cleve, where he leads the development of [AI-powered tools](/projects) that have reached over 100,000 users globally. He's also an AI Resident at 500 Global. [Learn more about him](/about) or check out [what he's up to now](/now).\n\n**Early Beginnings**\nRashad's unconventional path started with hacking at age 11, followed by entering university at 15 - making him one of the youngest students in his cohort. By 16, he had published his first game, and at 17, secured his first tech internship at a startup.\n\n**Academic Excellence**\nAt 18, he founded a tech club to build community and share knowledge. The following year, at 19, he published research on CreativeGAN in collaboration with MIT, presented at ASME IDETC/CIE 2021. He graduated at 20 as valedictorian, earning four academic awards and recognition as the best graduate of his class.\n\n**Entrepreneurship**\nAt 21, Rashad founded an AI consulting company, helping businesses implement machine learning solutions. A year later, at 22, he co-founded Cleve, a venture-backed startup focused on AI-powered productivity tools.\n\n**Speaking & Community**\nRashad is passionate about education and community building. He has [delivered 20+ talks](/speaking) on AI, technology, career development, and startups at various institutions and events. He regularly [judges hackathons](/achievements) (10+ events) and has [won 5 hackathons](/achievements) himself as a participant.\n\n**Content Creation**\nAs a [content creator on TikTok](https://tiktok.com/@rashadventure), Rashad has built an audience of 20,000+ followers and generated over 5 million views through educational content on AI, tech careers, and productivity.\n\n**Personal Interests**\nWhen he's not building products or creating content, Rashad enjoys [trying new things](/achievements), [reading](/books), [writing](/blog), and [watching movies](/movies). Check out his [curated lists](/lists) and [bookmarks](/bookmarks) for recommendations.",

        // Level 19: Add impact statement and mission
        "Rashad is a machine learning engineer, entrepreneur, and educator who has been building with technology since age 11. He is currently the co-founder & CTO at Cleve, where he leads the development of [AI-powered tools](/projects) that have reached over 100,000 users globally. He's also an AI Resident at 500 Global. [Learn more about him](/about) or check out [what he's up to now](/now).\n\n**Early Beginnings**\nRashad's unconventional path started with hacking at age 11, followed by entering university at 15 - making him one of the youngest students in his cohort. By 16, he had published his first game, and at 17, secured his first tech internship at a startup.\n\n**Academic Excellence**\nAt 18, he founded a tech club to build community and share knowledge. The following year, at 19, he published research on CreativeGAN in collaboration with MIT, presented at ASME IDETC/CIE 2021. He graduated at 20 as valedictorian, earning four academic awards and recognition as the best graduate of his class.\n\n**Entrepreneurship**\nAt 21, Rashad founded an AI consulting company, helping businesses implement machine learning solutions. A year later, at 22, he co-founded Cleve, a venture-backed startup focused on AI-powered productivity tools. See more of his [projects here](/projects).\n\n**Speaking & Community**\nRashad is passionate about education and community building. He has [delivered 20+ talks](/speaking) on AI, technology, career development, and startups at various institutions and events. He regularly [judges hackathons](/achievements) (10+ events) and has [won 5 hackathons](/achievements) himself as a participant.\n\n**Content Creation**\nAs a [content creator on TikTok](https://tiktok.com/@rashadventure), Rashad has built an audience of 20,000+ followers and generated over 5 million views through educational content on AI, tech careers, and productivity.\n\n**Personal Interests**\nWhen he's not building products or creating content, Rashad enjoys [trying new things](/achievements), [reading](/books), [writing](/blog), and [watching movies](/movies). Check out his [curated lists](/lists) and [bookmarks](/bookmarks) for recommendations on books, movies, tools, and more.\n\n**Impact**\nThrough his companies, talks, and content, Rashad has directly impacted over 100,000 people - whether through products they use, talks they've attended, or content they've consumed. His mission is to democratize access to AI knowledge and empower the next generation of builders."
    ],

    timeline: [
        // Level 0-1: Minimal
        { currently: [{ text: 'co-founder & cto at cleve', icon: '💼' }], previously: [] },
        { currently: [{ text: 'co-founder & cto at cleve', icon: '💼' }], previously: [] },

        // Level 2-3: Add speaking
        { currently: [{ text: 'co-founder & cto at cleve', icon: '💼' }, { text: 'speaker on ai and tech', icon: '🎤' }], previously: [] },
        { currently: [{ text: 'co-founder & cto at cleve', icon: '💼' }, { text: 'speaker on ai and tech', icon: '🎤' }], previously: [] },

        // Level 4-5: Add previously items
        { currently: [{ text: 'co-founder & cto at cleve', icon: '💼' }, { text: 'speaker on ai, tech, career', icon: '🎤' }], previously: [{ text: 'entered uni @ 15', icon: '🎓' }] },
        { currently: [{ text: 'co-founder & cto at cleve', icon: '💼' }, { text: 'speaker on ai, tech, career', icon: '🎤' }], previously: [{ text: 'entered uni @ 15', icon: '🎓' }, { text: 'published paper with MIT @ 19', icon: '📄' }] },

        // Level 6-7: Add content creator
        { currently: [{ text: 'co-founder & cto at cleve', icon: '💼' }, { text: 'speaker on ai and tech', icon: '🎤' }, { text: 'content creator on tiktok', icon: '📹' }], previously: [{ text: 'entered uni @ 15', icon: '🎓' }, { text: 'published paper with MIT @ 19', icon: '📄' }] },
        { currently: [{ text: 'co-founder & cto at cleve', icon: '💼' }, { text: 'speaker on ai, tech, career', icon: '🎤' }, { text: 'content creator on tiktok', icon: '📹' }], previously: [{ text: 'entered uni @ 15', icon: '🎓' }, { text: 'published paper with MIT @ 19', icon: '📄' }, { text: 'founded AI consulting company @ 21', icon: '💼' }] },

        // Level 8-9: Expand previously
        { currently: [{ text: 'co-founder & cto at cleve', icon: '💼' }, { text: 'speaker on ai, tech, career', icon: '🎤' }, { text: 'content creator on tiktok', icon: '📹' }], previously: [{ text: 'hacking @ 11', icon: '💻' }, { text: 'entered uni @ 15', icon: '🎓' }, { text: 'published paper with MIT @ 19', icon: '📄' }] },
        { currently: [{ text: 'co-founder & cto at cleve', icon: '💼' }, { text: 'speaker on ai, tech, career', icon: '🎤' }, { text: 'content creator on tiktok', icon: '📹' }], previously: [{ text: 'hacking @ 11', icon: '💻' }, { text: 'entered uni @ 15', icon: '🎓' }, { text: 'published game @ 16', icon: '🎮' }, { text: 'startup tech intern @ 17', icon: '🚀' }] },

        // Level 10-11: More previously items
        { currently: [{ text: 'co-founder & cto at cleve', icon: '💼' }, { text: 'speaker on ai, tech, career', icon: '🎤' }, { text: 'content creator on tiktok', icon: '📹' }], previously: [{ text: 'hacking @ 11', icon: '💻' }, { text: 'entered uni @ 15', icon: '🎓' }, { text: 'published game @ 16', icon: '🎮' }, { text: 'startup tech intern @ 17', icon: '🚀' }, { text: 'published paper with MIT @ 19', icon: '📄' }] },
        { currently: [{ text: 'co-founder & cto at cleve', icon: '💼' }, { text: 'speaker on ai, tech, career', icon: '🎤' }, { text: 'content creator on tiktok', icon: '📹' }], previously: [{ text: 'hacking @ 11', icon: '💻' }, { text: 'entered uni @ 15', icon: '🎓' }, { text: 'published game @ 16', icon: '🎮' }, { text: 'startup tech intern @ 17', icon: '🚀' }, { text: 'published paper with MIT @ 19', icon: '📄' }, { text: 'best graduate (valedictorian) @ 20', icon: '🏆' }] },

        // Level 12-13: Add founding milestones
        { currently: [{ text: 'co-founder & cto at cleve', icon: '💼' }, { text: 'speaker on ai, tech, career, startup', icon: '🎤' }, { text: 'content creator on tiktok', icon: '📹' }], previously: [{ text: 'hacking @ 11', icon: '💻' }, { text: 'entered uni @ 15', icon: '🎓' }, { text: 'published game @ 16', icon: '🎮' }, { text: 'startup tech intern @ 17', icon: '🚀' }, { text: 'published paper with MIT @ 19', icon: '📄' }, { text: 'best graduate (valedictorian) @ 20', icon: '🏆' }, { text: 'founded AI consulting company @ 21', icon: '💼' }] },
        { currently: [{ text: 'co-founder & cto at cleve', icon: '💼' }, { text: 'speaker on ai, tech, career, startup', icon: '🎤' }, { text: 'content creator on tiktok', icon: '📹' }], previously: [{ text: 'hacking @ 11', icon: '💻' }, { text: 'entered uni @ 15', icon: '🎓' }, { text: 'published game @ 16', icon: '🎮' }, { text: 'startup tech intern @ 17', icon: '🚀' }, { text: 'published paper with MIT @ 19', icon: '📄' }, { text: 'best graduate (valedictorian) @ 20', icon: '🏆' }, { text: 'founded AI consulting company @ 21', icon: '💼' }, { text: 'co-founded venture backed startup @ 22', icon: '⭐' }] },

        // Level 14-15: Add hackathon judging
        { currently: [{ text: 'co-founder & cto at cleve', icon: '💼' }, { text: 'speaker on ai, tech, career, startup', icon: '🎤' }, { text: 'content creator on tiktok', icon: '📹' }, { text: 'judge hackathons', icon: '⚖️' }], previously: [{ text: 'hacking @ 11', icon: '💻' }, { text: 'entered uni @ 15', icon: '🎓' }, { text: 'published game @ 16', icon: '🎮' }, { text: 'startup tech intern @ 17', icon: '🚀' }, { text: 'published paper with MIT @ 19', icon: '📄' }, { text: 'best graduate (valedictorian) @ 20', icon: '🏆' }, { text: 'founded AI consulting company @ 21', icon: '💼' }, { text: 'co-founded venture backed startup @ 22', icon: '⭐' }] },
        { currently: [{ text: 'co-founder & cto at cleve', icon: '💼' }, { text: 'speaker on ai, tech, career, startup', icon: '🎤' }, { text: 'content creator on tiktok', icon: '📹' }, { text: 'judge hackathons', icon: '⚖️' }], previously: [{ text: 'hacking @ 11', icon: '💻' }, { text: 'entered uni @ 15', icon: '🎓' }, { text: 'published game @ 16', icon: '🎮' }, { text: 'startup tech intern @ 17', icon: '🚀' }, { text: 'founded a tech club @ 18', icon: '👥' }, { text: 'published paper with MIT @ 19', icon: '📄' }, { text: 'best graduate (valedictorian) @ 20', icon: '🏆' }, { text: 'founded AI consulting company @ 21', icon: '💼' }, { text: 'co-founded venture backed startup @ 22', icon: '⭐' }] },

        // Level 16-17: Full details
        { currently: [{ text: 'co-founder & cto at cleve', icon: '💼' }, { text: 'speaker on ai, tech, career, startup', icon: '🎤' }, { text: 'judge hackathons', icon: '⚖️' }, { text: 'content creator on tiktok', icon: '📹' }], previously: [{ text: 'hacking @ 11', icon: '💻' }, { text: 'entered uni @ 15', icon: '🎓' }, { text: 'published game @ 16', icon: '🎮' }, { text: 'startup tech intern @ 17', icon: '🚀' }, { text: 'founded a tech club @ 18', icon: '👥' }, { text: 'published paper with MIT @ 19', icon: '📄' }, { text: 'best graduate (valedictorian) @ 20', icon: '🏆' }, { text: 'founded AI consulting company @ 21', icon: '💼' }, { text: 'co-founded venture backed startup @ 22', icon: '⭐' }] },
        { currently: [{ text: 'co-founder & cto at cleve', icon: '💼' }, { text: 'speaker on ai, tech, career, startup', icon: '🎤' }, { text: 'judge hackathons', icon: '⚖️' }, { text: 'content creator on tiktok', icon: '📹' }], previously: [{ text: 'hacking @ 11', icon: '💻' }, { text: 'entered uni @ 15', icon: '🎓' }, { text: 'published game @ 16', icon: '🎮' }, { text: 'startup tech intern @ 17', icon: '🚀' }, { text: 'founded a tech club @ 18', icon: '👥' }, { text: 'published paper with MIT @ 19', icon: '📄' }, { text: 'best graduate (valedictorian) @ 20', icon: '🏆' }, { text: 'founded AI consulting company @ 21', icon: '💼' }, { text: 'co-founded venture backed startup @ 22', icon: '⭐' }] },

        // Level 18-19: Add AI resident
        { currently: [{ text: 'co-founder & cto at cleve', icon: '💼' }, { text: 'speaker on ai, tech, career, startup', icon: '🎤' }, { text: 'judge hackathons', icon: '⚖️' }, { text: 'content creator on tiktok', icon: '📹' }, { text: 'ai resident at 500 global', icon: '🎓' }], previously: [{ text: 'hacking @ 11', icon: '💻' }, { text: 'entered uni @ 15', icon: '🎓' }, { text: 'published game @ 16', icon: '🎮' }, { text: 'startup tech intern @ 17', icon: '🚀' }, { text: 'founded a tech club @ 18', icon: '👥' }, { text: 'published paper with MIT @ 19', icon: '📄' }, { text: 'best graduate (valedictorian) @ 20', icon: '🏆' }, { text: 'founded AI consulting company @ 21', icon: '💼' }, { text: 'co-founded venture backed startup @ 22', icon: '⭐' }] },
        { currently: [{ text: 'co-founder & cto at cleve', icon: '💼' }, { text: 'speaker on ai, tech, career, startup', icon: '🎤' }, { text: 'judge hackathons', icon: '⚖️' }, { text: 'content creator on tiktok', icon: '📹' }, { text: 'ai resident at 500 global', icon: '🎓' }], previously: [{ text: 'hacking @ 11', icon: '💻' }, { text: 'entered uni @ 15', icon: '🎓' }, { text: 'published game @ 16', icon: '🎮' }, { text: 'startup tech intern @ 17', icon: '🚀' }, { text: 'founded a tech club @ 18', icon: '👥' }, { text: 'published paper with MIT @ 19', icon: '📄' }, { text: 'best graduate (valedictorian) @ 20', icon: '🏆' }, { text: 'founded AI consulting company @ 21', icon: '💼' }, { text: 'co-founded venture backed startup @ 22', icon: '⭐' }] }
    ],

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

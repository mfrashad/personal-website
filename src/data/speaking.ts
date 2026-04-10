export interface SpeakingEngagement {
    id: string;
    date: Date;
    title: string;
    event: string;
    organizer: string;
    description?: string;
    location?: string;
    audience?: string;
    fee?: string;
    type: 'talk' | 'panel' | 'interview' | 'workshop' | 'fireside';
    topics?: string[];
    images?: string[];
    logos?: string[];
    featured?: boolean;
}

export const speakingEngagements: SpeakingEngagement[] = [
    // 2025
    {
        id: 'future-ready-connect-2025',
        date: new Date('2025-12-13'),
        title: 'NextGen Entrepreneurship and AI',
        event: 'Future Ready Connect',
        organizer: 'Yayasan Peneraju',
        type: 'panel',
        audience: '200-250 tech professionals',
        topics: ['Entrepreneurship', 'AI'],
        logos: ['/speaking-logos/yayasanpeneraju.webp'],
        featured: true,
    },
    {
        id: 'idfr-ai-work-2025',
        date: new Date('2025-11-25'),
        title: 'AI@Work: Innovating Diplomacy',
        event: 'IDFR Talk',
        organizer: 'Foreign Affairs Ministry',
        description: 'Introduction to AI for diplomats',
        type: 'talk',
        audience: '50-100 diplomats',
        topics: ['AI', 'Future of Work'],
        logos: ['/speaking-logos/idfr.webp', '/speaking-logos/ministry-of-foreign-affairs-malaysia.webp'],
    },
    {
        id: 'utp-nexoria-star-2025',
        date: new Date('2025-11-16'),
        title: 'Career in Tech',
        event: 'UTP Nexoria Talk at Secondary School STAR',
        organizer: 'UTP',
        type: 'talk',
        audience: '100-200 students',
        fee: 'RM400',
        topics: ['Career', 'Technology'],
        logos: ['/speaking-logos/utp.webp'],
    },
    {
        id: 'tech-trove-hackathon-2025',
        date: new Date('2025-11-02'),
        title: 'Next steps after Hackathon',
        event: "Tech Trove 2.0 Hackathon",
        organizer: "Taylor's University",
        audience: '50-100 students',
        type: 'talk',
        topics: ['Technology', 'Hackathon'],
        logos: ['/speaking-logos/taylors.svg'],
    },
    {
        id: 'utp-expert-panel-2025',
        date: new Date('2025-10-30'),
        title: 'Expert Panelist',
        event: 'UTP Expert Panel',
        organizer: 'UTP',
        location: 'Ipoh',
        type: 'panel',
        logos: ['/speaking-logos/utp.webp'],
    },
    {
        id: 'rtm-tv1-interview-2025',
        date: new Date('2025-10-28'),
        title: 'RTM TV1 Interview',
        event: 'Cuit Cuit Tak Sentap',
        organizer: 'RTM',
        location: '500 Global office',
        type: 'interview',
        logos: ['/speaking-logos/rtm-tv1.webp'],
    },
    {
        id: 'itrain-nextgen-ai-2025',
        date: new Date('2025-08-16'),
        title: 'Next-Gen AI: How Emerging Founders are Building the Future',
        event: 'iTrain Asia Talk',
        organizer: 'iTrain Asia',
        type: 'talk',
        topics: ['AI', 'Entrepreneurship'],
        logos: ['/speaking-logos/itrainasia.webp'],
    },
    {
        id: 'friends-of-figma-2025',
        date: new Date('2025-07-19'),
        title: 'Entrepreneurship for Next Generation and AI',
        event: 'Friends of Figma Talk',
        organizer: 'Friends of Figma',
        type: 'talk',
        topics: ['Entrepreneurship', 'AI'],
        logos: ['/speaking-logos/figma_malaysia_logo.webp'],
        featured: true,
    },
    {
        id: 'techitorleaveit-podcast-2025',
        date: new Date('2025-07-01'),
        title: 'Tech It or Leave It Podcast',
        event: 'Tech It or Leave It',
        organizer: 'Tech It or Leave It',
        type: 'interview',
        topics: ['Technology', 'Entrepreneurship'],
        logos: ['/speaking-logos/techitorleaveit.webp'],
    },
    {
        id: 'cradle-interview-2025',
        date: new Date('2025-06-11'),
        title: 'Interview Shoot with Cradle',
        event: 'Cradle Interview',
        organizer: 'Cradle',
        type: 'interview',
        logos: ['/speaking-logos/cradle.webp'],
    },
    {
        id: 'um-data-science-2025',
        date: new Date('2025-05-23'),
        title: 'Data Science Talk',
        event: 'UM Data Science Talk',
        organizer: 'University of Malaya',
        type: 'talk',
        topics: ['Data Science'],
        logos: ['/speaking-logos/um.webp'],
    },
    {
        id: 'apu-hiring-tech-2025',
        date: new Date('2025-04-24'),
        title: 'Hiring in Tech',
        event: 'APU Talk',
        organizer: 'Asia Pacific University',
        type: 'talk',
        topics: ['Career', 'Technology'],
        logos: ['/speaking-logos/apu.webp'],
    },
    {
        id: 'ai-tinkerers-paynet-2025',
        date: new Date('2025-03-27'),
        title: 'Rapid Prototyping with AI',
        event: 'AI Tinkerers Talk',
        organizer: 'AI Tinkerers',
        location: 'Paynet',
        type: 'talk',
        topics: ['AI', 'Prototyping'],
        logos: ['/speaking-logos/aitinkererskl-logo.webp'],
        featured: true,
    },
    {
        id: 'bernama-tv-interview-2025',
        date: new Date('2025-01-16'),
        title: 'Bernama TV Interview',
        event: 'Bernama TV',
        organizer: 'Bernama',
        type: 'interview',
        topics: ['AI', 'Technology'],
        logos: ['/speaking-logos/bernama.webp'],
    },

    // 2024
    {
        id: 'ai-semiconductor-forum-2024',
        date: new Date('2024-08-29'),
        title: 'AI Semiconductor Forum: Shaping Your Future',
        event: 'AI Semiconductor Forum',
        organizer: 'Universiti Putra Malaysia',
        type: 'talk',
        topics: ['AI', 'Technology'],
        logos: ['/speaking-logos/upm.webp'],
    },
    {
        id: 'antler-ai-ml-llm-2024',
        date: new Date('2024-06-25'),
        title: 'Lessons Learned from Building LLM App in Production',
        event: 'AI ML Malaysia User Group Meetup',
        organizer: 'Antler / AI ML Malaysia User Group',
        type: 'talk',
        topics: ['AI', 'Machine Learning', 'LLM'],
        logos: ['/speaking-logos/antler.svg'],
    },
    {
        id: 'apac-llm-production-2024',
        date: new Date('2024-08-15'),
        title: 'Lessons Learned in Building LLM App in Production',
        event: 'APAC Tech Talk Episode 2',
        organizer: 'Asia Pacific Analytics Club',
        type: 'talk',
        topics: ['AI', 'Machine Learning', 'LLM'],
        logos: ['/speaking-logos/apu.webp'],
        featured: true,
    },
    {
        id: 'ameu-economics-summit-2024',
        date: new Date('2024-08-10'),
        title: 'Behind The Scene: The Steps of Entrepreneurship',
        event: 'AMEU Economics Summit 2024',
        organizer: 'AMEU',
        type: 'fireside',
        topics: ['Entrepreneurship', 'Startups'],
        logos: ['/speaking-logos/ameu.webp'],
    },
    {
        id: 'leds-studio-exploration-2024',
        date: new Date('2024-06-15'),
        title: 'Industrial Exploration for Post-SPM/SPM Leavers',
        event: 'LEDS Studio Industrial Exploration 2024',
        organizer: 'LEDS Studio',
        type: 'talk',
        topics: ['Career', 'Technology'],
        logos: ['/speaking-logos/leds-studio.webp'],
    },
    {
        id: 'spillthetea-mytech-2024',
        date: new Date('2024-05-15'),
        title: 'Stories from Data Science Frontier',
        event: 'SpillTheTea at MyTech Career Fair',
        organizer: 'UM Data Analytics Club',
        type: 'panel',
        topics: ['Data Science', 'Career'],
        logos: ['/speaking-logos/um.webp'],
    },

    // 2022
    {
        id: 'ieee-ai-creativity-2022',
        date: new Date('2022-10-18'),
        title: 'AI & Creativity',
        event: 'IEEE Webinar',
        organizer: 'Sunway Tech Club',
        type: 'talk',
        topics: ['AI', 'Creativity'],
        logos: ['/speaking-logos/ieee.svg', '/speaking-logos/sunway-uni.webp'],
    },
    {
        id: 'iem-utp-expo-2022',
        date: new Date('2022-05-17'),
        title: 'AI & Creativity',
        event: 'IEM UTP Expo 2022',
        organizer: 'UTP',
        type: 'talk',
        topics: ['AI', 'Creativity'],
        logos: ['/speaking-logos/utp.webp'],
    },

    // 2021
    {
        id: 'dsc-utp-flutter-2021',
        date: new Date('2021-06-15'),
        title: 'Flutter Workshop',
        event: 'DSC UTP Flutter Workshop',
        organizer: 'DSC UTP',
        type: 'workshop',
        topics: ['Flutter', 'Mobile Development'],
        logos: ['/speaking-logos/utp.webp'],
    },
    {
        id: 'dsc-utp-git-workshop-2021',
        date: new Date('2021-04-15'),
        title: 'Git Workshop',
        event: 'DSC UTP Git Workshop',
        organizer: 'DSC UTP',
        type: 'workshop',
        topics: ['Git', 'Developer Tools'],
        logos: ['/speaking-logos/utp.webp'],
    },
    {
        id: 'taces-overcome-fear-2021',
        date: new Date('2021-05-15'),
        title: 'How to Overcome Your Fear',
        event: 'T-ACES Webinar',
        organizer: 'Telkom University',
        type: 'talk',
        topics: ['Personal Development'],
        logos: ['/speaking-logos/telkomuni.webp'],
    },
    {
        id: 'voice-of-intern-2021',
        date: new Date('2021-02-17'),
        title: 'How I Scored A in SIIP',
        event: 'Voice of Intern',
        organizer: 'UTP',
        type: 'panel',
        topics: ['Career', 'Internship'],
        logos: ['/speaking-logos/utp.webp'],
    },
];

// Helper functions
export function getSpeakingByYear(): Record<number, SpeakingEngagement[]> {
    const byYear: Record<number, SpeakingEngagement[]> = {};

    speakingEngagements.forEach(engagement => {
        const year = engagement.date.getFullYear();
        if (!byYear[year]) {
            byYear[year] = [];
        }
        byYear[year].push(engagement);
    });

    // Sort each year's engagements by date (newest first)
    Object.keys(byYear).forEach(year => {
        byYear[parseInt(year)].sort((a, b) => b.date.getTime() - a.date.getTime());
    });

    return byYear;
}

export function getFeaturedSpeaking(): SpeakingEngagement[] {
    return speakingEngagements
        .filter(engagement => engagement.featured)
        .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getLatestSpeaking(count: number = 6): SpeakingEngagement[] {
    return [...speakingEngagements]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, count);
}

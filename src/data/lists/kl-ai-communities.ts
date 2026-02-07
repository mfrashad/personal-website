export interface CommunityItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
}

export const klAiCommunities: CommunityItem[] = [
    {
        name: 'Build Club',
        description: 'A collaborative AI learning community focused on learning through building, with AI-native courses, role tracks, and certifications. It brings together young professionals, AI evangelists, agencies, and solopreneurs who want to grow their skills with a builder community.',
        url: 'https://www.buildclub.ai/',
        image: '/communities/build-club-logo-navbar.webp',
    },
    {
        name: 'Build with AI',
        description: 'A project showcase for the Build With AI Malaysia community, featuring AI projects built by Malaysian builders across many categories. It helps people discover what locals are creating and invites builders to explore projects or join the community.',
        url: 'https://buildwithai.my/',
        image: '/communities/build_with_ai_logo.jpeg',
    },
    {
        name: 'AI Tinkerers',
        description: 'A global community of AI engineers and researchers building real systems and sharing unfinished work. It runs local meetups centered on demos, code, and technical insights while connecting builders through a global network.',
        url: 'https://aitinkerers.org/',
        image: '/communities/ai_tinkerers_logo.png',
    },
    {
        name: 'AI Hackerdorm',
        description: 'A student-first community that hosts regular builder sessions with project showcases, co-building time, and mentorship. It welcomes coders, designers, entrepreneurs, and curious makers who want to build and learn together.',
        url: 'https://aihackerdorm.com/',
        image: '/communities/ai_hackerdorm.webp',
    },
    {
        name: 'AI SEA',
        description: 'A Southeast Asia grassroots builder movement and network for people shipping AI that connects local communities into a coalition. They run hackathons, co-build sessions, and sprints while sharing infrastructure for cross-border collaboration.',
        url: 'https://www.aisea.builders/',
        image: '/communities/aisea_logo.png',
    },
    {
        name: 'Rakan Tutor',
        description: 'An organization providing free, hybrid AI programs for ASEAN youth through hands-on workshops and a digital learning platform. Its mission is to equip secondary school students with the skills and confidence for an AI-powered future.',
        url: 'https://rakantutor.org/',
        image: '/communities/rakan-tutor-logo.png',
    },
];

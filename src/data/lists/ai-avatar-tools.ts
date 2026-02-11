export interface ResourceItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
}

export const aiAvatarTools: ResourceItem[] = [
    {
        name: 'Synthesia',
        description: 'Enterprise AI avatar videos. 90% of Fortune 100. Best for corporate training.',
        url: 'https://www.synthesia.io/',
        tags: ['Enterprise', 'Training'],
    },
    {
        name: 'HeyGen',
        description: 'Realistic avatars in 140 languages. Best for creators and marketers.',
        url: 'https://www.heygen.com/',
        tags: ['Marketing', 'Multilingual'],
    },
    {
        name: 'Higgsfield',
        description: 'AI avatar + video for social content and ads.',
        url: 'https://higgsfield.ai/',
        tags: ['Social Media', 'Ads'],
    },
    {
        name: 'Hedra',
        description: 'Expressive character-driven video with best-in-class lip-sync. Backed by a16z.',
        url: 'https://www.hedra.com/',
        tags: ['Character', 'Lip Sync'],
    },
    {
        name: 'D-ID',
        description: 'Talking avatars from still images. Fast generation, 280K+ developers.',
        url: 'https://www.d-id.com/',
        tags: ['Talking Avatars', 'API'],
    },
    {
        name: 'Colossyan',
        description: 'Professional AI presenters for corporate L&D. SOC 2 compliant.',
        url: 'https://www.colossyan.com/',
        tags: ['Enterprise', 'L&D'],
    },
    {
        name: 'Creatify',
        description: 'AI UGC-style video ads from product URLs. Built for performance marketers.',
        url: 'https://www.creatify.ai/',
        tags: ['Ads', 'UGC'],
    },
    {
        name: 'Jogg AI',
        description: 'AI avatar video ads from URLs. Early-stage, Singapore-based.',
        url: 'https://www.jogg.ai/',
        tags: ['Ads', 'Singapore'],
    },
];

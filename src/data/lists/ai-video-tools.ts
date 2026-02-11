export interface ResourceItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
}

export const aiVideoTools: ResourceItem[] = [
    {
        name: 'CapCut',
        description: 'Video editing with AI features by ByteDance. Free.',
        url: 'https://www.capcut.com/',
        tags: ['Editing', 'Free'],
    },
    {
        name: 'Higgsfield',
        description: 'AI video creation platform for social media and ads. Fastest-growing in category.',
        url: 'https://higgsfield.ai/',
        tags: ['Generation', 'Social Media'],
    },
    {
        name: 'Runway',
        description: 'Professional AI video generation and editing. Pioneer of the space.',
        url: 'https://runwayml.com/',
        tags: ['Generation', 'Editing'],
    },
    {
        name: 'Hailuo AI',
        description: 'AI video with strong physics realism by MiniMax. Free tier available.',
        url: 'https://hailuoai.video/',
        tags: ['Generation', 'Free Tier'],
    },
    {
        name: 'Pika Labs',
        description: 'AI video with creative animation and effects. Free tier available.',
        url: 'https://pika.art/',
        tags: ['Generation', 'Animation', 'Free Tier'],
    },
    {
        name: 'Kling AI',
        description: 'High-quality AI video with lip-sync by Kuaishou. Free tier available.',
        url: 'https://klingai.com/',
        tags: ['Generation', 'Lip Sync', 'Free Tier'],
    },
    {
        name: 'Veo',
        description: 'Google\'s cinematic AI video up to 4K. Available via Google Flow and API.',
        url: 'https://deepmind.google/technologies/veo/',
        tags: ['Generation', 'Google'],
    },
];

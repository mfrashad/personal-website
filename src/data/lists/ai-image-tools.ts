export interface ResourceItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
}

export const aiImageTools: ResourceItem[] = [
    {
        name: 'ChatGPT',
        description: 'Most accessible image generation via DALL-E / GPT-4o. Free tier available.',
        url: 'https://chatgpt.com/',
        tags: ['Generation', 'Free Tier'],
    },
    {
        name: 'Midjourney',
        description: 'Premium artistic AI image generation. Profitable, no VC funding. Paid only.',
        url: 'https://midjourney.com/',
        tags: ['Generation', 'Paid'],
    },
    {
        name: 'Nano Banana',
        description: 'Google\'s native image gen built into Gemini. Free tier available.',
        url: 'https://gemini.google.com/',
        tags: ['Generation', 'Free Tier'],
    },
    {
        name: 'Ideogram',
        description: 'Best text rendering in AI images. Free tier available.',
        url: 'https://ideogram.ai/',
        tags: ['Generation', 'Free Tier'],
    },
    {
        name: 'Flux',
        description: 'Photorealistic image generation by ex-Stability AI team. Open-source.',
        url: 'https://blackforestlabs.ai/',
        tags: ['Generation', 'Open Source'],
    },
    {
        name: 'GenTube',
        description: 'Free AI image generator. Early-stage startup, quality inconsistent.',
        url: 'https://gentube.app/',
        tags: ['Generation', 'Free'],
    },
];

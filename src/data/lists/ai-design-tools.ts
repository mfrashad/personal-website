export interface ResourceItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
}

export const aiDesignTools: ResourceItem[] = [
    {
        name: 'Canva',
        description: 'Easy graphic design with AI Magic Studio. Free tier available.',
        url: 'https://www.canva.com/',
        tags: ['Graphic Design', 'Free Tier'],
    },
    {
        name: 'Figma',
        description: 'Collaborative design with AI assistant. Industry standard for product design. Free tier available.',
        url: 'https://figma.com/',
        tags: ['Product Design', 'Free Tier'],
    },
    {
        name: 'Adobe Firefly',
        description: 'Commercially safe AI image generation and editing. Trained on licensed content.',
        url: 'https://firefly.adobe.com/',
        tags: ['Image Generation', 'Commercial'],
    },
    {
        name: 'Framer',
        description: 'Website builder with design-to-code. Popular with designers. Free tier available.',
        url: 'https://www.framer.com/',
        tags: ['Web Design', 'Free Tier'],
    },
    {
        name: 'Penpot',
        description: 'Open-source design platform. Free and open-source alternative to Figma.',
        url: 'https://penpot.app/',
        tags: ['Product Design', 'Open Source'],
    },
    {
        name: 'Looka',
        description: 'AI logo and brand kit generator. Bootstrapped and profitable.',
        url: 'https://looka.com/',
        tags: ['Logo', 'Branding'],
    },
];

export interface ResourceItem {
    name: string;
    description?: string;
    url?: string;
    tags?: string[];
}

export const myStartupTools: ResourceItem[] = [
    {
        name: 'Linear',
        description: 'Modern project management for software teams. Fast keyboard-first interface, cycles, roadmaps, and Git integrations. The best issue tracker for startups.',
        url: 'https://linear.app/',
        tags: ['Project Management', 'Issues'],
    },
    {
        name: 'Notion',
        description: 'All-in-one workspace for docs, wikis, and databases. Flexible blocks system for notes, knowledge bases, and team collaboration.',
        url: 'https://notion.so/',
        tags: ['Docs', 'Wiki'],
    },
    {
        name: 'Granola',
        description: 'AI notepad for back-to-back meetings. Listens to calls and generates structured notes with action items. No bots joining your calls. Works with Meet, Zoom, and Teams.',
        url: 'https://granola.ai/',
        tags: ['Meetings', 'AI'],
    },
    {
        name: 'Figma',
        description: 'Collaborative design tool for UI/UX. Real-time multiplayer editing, prototyping, and dev mode for handoff. Industry standard for product design.',
        url: 'https://figma.com/',
        tags: ['Design', 'Prototyping'],
    },
    {
        name: 'Discord',
        description: 'Community and team communication platform. Voice, video, and text channels. Great for building community around your product and internal team chat.',
        url: 'https://discord.com/',
        tags: ['Communication', 'Community'],
    },
    {
        name: 'GitHub',
        description: 'Code hosting and version control with Git. Pull requests, actions for CI/CD, and the largest developer community. Essential for any software startup.',
        url: 'https://github.com/',
        tags: ['Code', 'Version Control'],
    },
    {
        name: 'Cleve',
        description: 'AI-powered content workspace for personal branding. Turn ideas into platform-ready content with voice notes, multi-model AI writing, and 50+ language support.',
        url: 'https://cleve.ai/',
        tags: ['Content', 'AI Writing'],
    },
];

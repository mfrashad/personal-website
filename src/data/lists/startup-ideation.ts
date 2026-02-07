export interface ResourceItem {
    name: string;
    description?: string;
    url?: string;
    tags?: string[];
}

export const startupIdeation: ResourceItem[] = [
    {
        name: 'How to Get Startup Ideas (Paul Graham)',
        description: 'Classic essay on finding startup ideas. Key insight: look for problems you personally have, not ideas that sound like startup ideas. Live in the future and build what seems interesting.',
        url: 'https://www.paulgraham.com/startupideas.html',
        tags: ['Essay', 'Paul Graham'],
    },
    {
        name: 'How to Get and Evaluate Startup Ideas (YC)',
        description: 'YC partner video on generating and filtering startup ideas. Covers the 4 most common mistakes, how to evaluate ideas, and finding ideas organically vs deliberately.',
        url: 'https://www.youtube.com/watch?v=Th8JoIan4dg&t=1s',
        tags: ['Video', 'YC'],
    },
    {
        name: 'How to Come Up with Startup Ideas (Founder Institute)',
        description: 'Founder Institute guide on ideation frameworks. Covers problem-first approach, market sizing, and validating ideas before building.',
        url: 'https://lnkd.in/e5mSbwCF',
        tags: ['Guide', 'FI'],
    },
    {
        name: 'r/SomebodyMakeThis',
        description: 'Subreddit where people post product/app ideas they wish existed. Great source of real problems people want solved. Browse for inspiration or validation.',
        url: 'https://www.reddit.com/r/SomebodyMakeThis/',
        tags: ['Reddit', 'Ideas'],
    },
    {
        name: 'YC Requests for Startups',
        description: 'Official list of startup ideas YC wants to fund. Updated periodically with areas YC partners are excited about. Categories include AI, healthcare, climate, and more.',
        url: 'https://www.ycombinator.com/rfs',
        tags: ['YC', 'Ideas list'],
    },
    {
        name: 'Test Your Startup Idea',
        description: 'Guide on validating your startup idea before building. Covers customer interviews, landing page tests, and concierge MVPs.',
        url: 'https://hubstaff.com/blog/test-your-startup-idea/',
        tags: ['Guide', 'Validation'],
    },
    {
        name: 'First Principles Thinking (Elon Musk)',
        description: 'Elon Musk explains first principles reasoning for innovation. Break problems down to fundamental truths and reason up from there, rather than reasoning by analogy.',
        url: 'https://www.youtube.com/watch?v=NV3sBlRgzTI',
        tags: ['Video', 'Framework'],
    },
    {
        name: 'Idea Validation Tactics (First Round Review)',
        description: 'How Linear, Mercury, and other successful startups validated their ideas before building. Practical tactics including customer interviews, landing page tests, and concierge MVPs.',
        url: 'https://review.firstround.com/unconventional-tactics-for-validating-your-startup-idea/',
        tags: ['Article', 'Case studies'],
    },
];

export interface ListItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
}

export const favoriteConcepts: ListItem[] = [
    {
        name: 'Gamification',
        description: 'Apply game design elements to non-game contexts',
        tags: ['productivity', 'motivation', 'design']
    },
    {
        name: 'Quantified Self',
        description: 'Track and measure personal data for self-improvement',
        tags: ['data', 'self-improvement', 'tracking']
    },
    {
        name: 'Surface area of luck',
        description: 'Increase your chances by doing and sharing more',
        tags: ['career', 'networking', 'opportunity']
    },
    {
        name: 'Growth Mindset',
        description: 'Belief that abilities can be developed through dedication',
        tags: ['mindset', 'learning', 'psychology']
    },
    {
        name: 'Be relentlessly resourceful',
        description: 'Paul Graham\'s advice for startup founders',
        tags: ['entrepreneurship', 'persistence', 'problem-solving']
    },
    {
        name: 'Stoicism',
        description: 'Focus on what you can control, accept what you cannot',
        tags: ['philosophy', 'mindset', 'resilience']
    }
];

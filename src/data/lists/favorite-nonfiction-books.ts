export interface ListItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
}

export const favoriteNonfictionBooks: ListItem[] = [
    {
        name: 'Atomic Habits',
        description: 'Build better habits, break bad ones',
        tags: ['self-help', 'productivity', 'habits']
    },
    {
        name: 'Die With Zero',
        description: 'Get the most out of your money and your life',
        tags: ['finance', 'life', 'philosophy']
    },
    {
        name: 'Doing Good Better',
        description: 'Effective altruism and how to make a difference',
        tags: ['philosophy', 'altruism', 'impact']
    },
    {
        name: 'Millionaire Fast Lane',
        description: 'Build wealth through entrepreneurship',
        tags: ['business', 'entrepreneurship', 'wealth']
    },
    {
        name: 'Deep Work by Cal Newport',
        description: 'Focus and productivity in a distracted world',
        tags: ['productivity', 'focus', 'work']
    },
    {
        name: 'Educated by Tara Westover',
        description: 'A memoir about the transformative power of education',
        tags: ['memoir', 'education', 'inspiration']
    },
    {
        name: 'Models by Mark Manson',
        description: 'Attract women through honesty and authenticity',
        tags: ['relationships', 'self-help', 'dating']
    },
    {
        name: 'The Slight Edge',
        description: 'Small daily decisions compound over time',
        tags: ['self-help', 'habits', 'philosophy']
    },
    {
        name: 'Building a Second Brain',
        description: 'Organize your digital life and unlock your creative potential',
        tags: ['productivity', 'knowledge-management', 'creativity']
    },
    {
        name: 'Getting Things Done',
        description: 'The art of stress-free productivity',
        tags: ['productivity', 'organization', 'work']
    },
    {
        name: 'Flow',
        description: 'The psychology of optimal experience',
        tags: ['psychology', 'productivity', 'happiness']
    },
    {
        name: 'Be So Good They Can\'t Ignore You',
        description: 'Skills trump passion in the quest for work you love',
        tags: ['career', 'skills', 'work']
    }
];

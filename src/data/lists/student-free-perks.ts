export interface PerkItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
}

export const studentFreePerks: PerkItem[] = [
    {
        name: 'GitHub Student Developer Pack',
        description: '100+ free dev tools including Copilot Pro, JetBrains IDEs, Azure credits, free domains, and more. The essential starting point for any student developer. Worth $1,000s in total value.',
        url: 'https://education.github.com/pack',
        tags: ['$1,000s value', '100+ tools', 'Essential'],
    },
    {
        name: 'Google Gemini Free for Students',
        description: '12 months of Google AI Pro free — includes Gemini 2.5 Pro, Deep Research, NotebookLM Plus, and 2TB storage. Sign up by April 30, 2026 via SheerID verification. Available in 120+ countries including Malaysia.',
        url: 'https://gemini.google/students/',
        tags: ['~$240 value', '12 months', 'AI Pro'],
    },
    {
        name: 'Cursor Pro Free for Students',
        description: '1 year of Cursor Pro free. 500 fast premium requests/month, access to GPT-4o, Claude, Gemini models, multi-file editing, AI chat. Launched May 2025, available worldwide.',
        url: 'https://cursor.com/students',
        tags: ['$240 value', '1 year', 'AI coding'],
    },
    {
        name: 'Unity Student Plan',
        description: 'Free Unity Pro access (normally $2,040/year). Full game engine, real-time rendering, multiplayer features. 1-year license, renewable annually while a student.',
        url: 'https://unity.com/products/unity-student',
        tags: ['$2,040 value', '1 year', 'Game dev'],
    },
];

export const studentPerksSourceUrl = 'https://jhaxce.github.io/student-perks/';

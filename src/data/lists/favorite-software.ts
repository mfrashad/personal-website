export interface ListItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
}

export const favoriteSoftware: ListItem[] = [
    {
        name: 'Readwise',
        description: 'Sync and review highlights from books and articles',
        url: 'https://readwise.io/',
        tags: ['reading', 'productivity', 'learning']
    },
    {
        name: 'Linear',
        description: 'Best issue tracker for software teams',
        url: 'https://linear.app/',
        tags: ['productivity', 'project-management']
    },
    {
        name: 'Cursor / VS Code',
        description: 'AI-powered code editor',
        url: 'https://cursor.sh/',
        tags: ['development', 'AI', 'productivity']
    },
    {
        name: 'Cleve',
        description: 'Personal knowledge management and writing',
        url: 'https://cleve.ai/',
        tags: ['writing', 'notes', 'productivity']
    },
    {
        name: 'Diarium',
        description: 'Beautiful journaling app',
        tags: ['journaling', 'personal']
    },
    {
        name: 'PostHog',
        description: 'Open-source product analytics',
        url: 'https://posthog.com/',
        tags: ['analytics', 'development']
    },
    {
        name: 'Claude Code',
        description: 'Agentic CLI tool for coding with Claude',
        url: 'https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview',
        tags: ['AI', 'development', 'CLI']
    }
];

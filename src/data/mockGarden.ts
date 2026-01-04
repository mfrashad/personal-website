export interface MockNote {
    id: string;
    title: string;
    path: string;
    category: string;
    excerpt: string;
    created: string;
    updated: string;
    tags: string[];
}

export const mockNotes: MockNote[] = [
    {
        id: '1',
        title: 'Digital Garden',
        path: '/garden/concepts/digital-garden',
        category: 'concepts',
        excerpt: 'A digital garden is a collection of evolving ideas and thoughts, rather than a blog of polished articles. It\'s a place to cultivate knowledge over time.',
        created: '2024-01-15',
        updated: '2024-12-01',
        tags: ['meta', 'knowledge-management', 'learning']
    },
    {
        id: '2',
        title: 'React Server Components',
        path: '/garden/web-dev/react-server-components',
        category: 'web-dev',
        excerpt: 'Understanding React Server Components and how they change the way we think about data fetching and rendering in React applications.',
        created: '2024-03-20',
        updated: '2024-11-28',
        tags: ['react', 'web-development', 'performance']
    },
    {
        id: '3',
        title: 'TypeScript Best Practices',
        path: '/garden/web-dev/typescript-best-practices',
        category: 'web-dev',
        excerpt: 'A collection of TypeScript patterns and practices I\'ve found useful in building type-safe applications.',
        created: '2024-02-10',
        updated: '2024-11-25',
        tags: ['typescript', 'programming', 'best-practices']
    },
    {
        id: '4',
        title: 'The Pragmatic Programmer',
        path: '/garden/books/pragmatic-programmer',
        category: 'books',
        excerpt: 'Notes and insights from "The Pragmatic Programmer" by Andy Hunt and Dave Thomas. Timeless advice for software craftsmen.',
        created: '2024-05-05',
        updated: '2024-11-20',
        tags: ['books', 'programming', 'software-engineering']
    },
    {
        id: '5',
        title: 'Atomic Habits Framework',
        path: '/garden/productivity/atomic-habits',
        category: 'productivity',
        excerpt: 'Key concepts from James Clear\'s Atomic Habits: how tiny changes lead to remarkable results through habit stacking and identity shifts.',
        created: '2024-04-12',
        updated: '2024-11-15',
        tags: ['habits', 'productivity', 'self-improvement']
    },
    {
        id: '6',
        title: 'Web Performance Optimization',
        path: '/garden/web-dev/performance-optimization',
        category: 'web-dev',
        excerpt: 'Techniques and strategies for optimizing web application performance: lazy loading, code splitting, caching, and more.',
        created: '2024-06-08',
        updated: '2024-11-10',
        tags: ['performance', 'web-development', 'optimization']
    },
    {
        id: '7',
        title: 'Design Patterns',
        path: '/garden/programming/design-patterns',
        category: 'programming',
        excerpt: 'Common software design patterns explained with practical examples: Singleton, Factory, Observer, and more.',
        created: '2024-07-22',
        updated: '2024-11-05',
        tags: ['design-patterns', 'programming', 'architecture']
    },
    {
        id: '8',
        title: 'Remote Work Best Practices',
        path: '/garden/productivity/remote-work',
        category: 'productivity',
        excerpt: 'Lessons learned from years of remote work: communication, focus, work-life balance, and team collaboration.',
        created: '2024-08-15',
        updated: '2024-10-30',
        tags: ['remote-work', 'productivity', 'communication']
    },
    {
        id: '9',
        title: 'CSS Grid Layout',
        path: '/garden/web-dev/css-grid',
        category: 'web-dev',
        excerpt: 'Mastering CSS Grid for modern web layouts. Examples and patterns for responsive design.',
        created: '2024-09-01',
        updated: '2024-10-25',
        tags: ['css', 'web-development', 'layout']
    }
];

export const mockCategories = [
    { name: 'concepts', count: 1 },
    { name: 'web-dev', count: 4 },
    { name: 'books', count: 1 },
    { name: 'productivity', count: 2 },
    { name: 'programming', count: 1 }
];

// Helper to get notes by category
export function getNotesByCategory(category: string): MockNote[] {
    return mockNotes.filter(note => note.category === category);
}

// Helper to get latest created notes
export function getLatestCreatedNotes(limit: number = 9): MockNote[] {
    return [...mockNotes]
        .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
        .slice(0, limit);
}

// Helper to get latest updated notes
export function getLatestUpdatedNotes(limit: number = 9): MockNote[] {
    return [...mockNotes]
        .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
        .slice(0, limit);
}

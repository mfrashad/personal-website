/**
 * Sidebar groups for /admin/content-generator, in the order they appear.
 * Every entry in `listFileMap` (src/lib/resource-admin.ts) names one of these.
 *
 * Kept in its own module because resource-admin.ts imports `node:path`, which
 * cannot be pulled into the client-side generator bundle.
 */
export const listGroups = [
    { id: 'favorites', title: 'Favorites', icon: 'ph:star' },
    { id: 'hobbies', title: 'Hobbies', icon: 'ph:confetti' },
    { id: 'websites', title: 'Websites', icon: 'ph:browser' },
    { id: 'ai-tools', title: 'AI Tools', icon: 'ph:sparkle' },
    { id: 'opportunities', title: 'Opportunities', icon: 'ph:door-open' },
    { id: 'learning', title: 'Learning Resources', icon: 'ph:graduation-cap' },
    { id: 'resources', title: 'Resources', icon: 'ph:toolbox' },
    { id: 'communities', title: 'Communities', icon: 'ph:users-three' },
] as const;

export type ListGroupId = (typeof listGroups)[number]['id'];

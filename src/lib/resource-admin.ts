import * as path from 'path';

import type { ListGroupId } from './list-groups';

export { listGroups, type ListGroupId } from './list-groups';

export const listFileMap: Record<string, { file: string; varName: string; title: string; icon: string; group: ListGroupId }> = {
    'products': { file: 'favorite-products.ts', varName: 'favoriteProducts', title: 'Best Purchases', icon: 'ph:shopping-bag', group: 'favorites', },
    'software': { file: 'favorite-software.ts', varName: 'favoriteSoftware', title: 'Favorite Software', icon: 'ph:app-window', group: 'favorites', },
    'games': { file: 'favorite-games.ts', varName: 'favoriteGames', title: 'Favorite Games', icon: 'ph:game-controller', group: 'favorites', },
    'anime': { file: 'favorite-anime.ts', varName: 'favoriteAnime', title: 'Favorite Anime', icon: 'ph:television', group: 'favorites', },
    'nonfiction-books': { file: 'favorite-nonfiction-books.ts', varName: 'favoriteNonfictionBooks', title: 'Favorite Nonfiction Books', icon: 'ph:book-open', group: 'favorites', },
    'novels': { file: 'favorite-novels.ts', varName: 'favoriteNovels', title: 'Favorite Novels', icon: 'ph:book', group: 'favorites', },
    'webnovels': { file: 'favorite-webnovels.ts', varName: 'favoriteWebnovels', title: 'Favorite Web Novels', icon: 'ph:scroll', group: 'favorites', },
    'concepts': { file: 'favorite-concepts.ts', varName: 'favoriteConcepts', title: 'Favorite Concepts', icon: 'ph:lightbulb', group: 'favorites', },
    'speaking-structures': { file: 'speaking-structures.ts', varName: 'speakingStructures', title: 'How to Structure a 1-Minute Talk', icon: 'ph:microphone-stage', group: 'learning', },
    'websites-built-with-fable': { file: 'websites-built-with-fable.ts', varName: 'websitesBuiltWithFable', title: 'Websites Built With Fable', icon: 'ph:cube-focus', group: 'websites', },
    'websites-built-with-astra': { file: 'websites-built-with-astra.ts', varName: 'websitesBuiltWithAstra', title: 'Websites Built With Astra', icon: 'ph:cube-focus', group: 'websites', },
    'websites-built-with-ai': { file: 'websites-built-with-ai.ts', varName: 'websitesBuiltWithAi', title: 'Websites Built With AI Models', icon: 'ph:cube-focus', group: 'websites', },
    'cool-ui-websites': { file: 'cool-ui-websites.ts', varName: 'coolUiWebsites', title: 'Cool UI Websites', icon: 'ph:cube-focus', group: 'websites', },
    'insane-scroll-3d-websites': { file: 'insane-scroll-3d-websites.ts', varName: 'insaneScroll3dWebsites', title: 'Insane Scroll 3D Websites', icon: 'ph:cube-focus', group: 'websites', },
    'kl-ai-communities': { file: 'kl-ai-communities.ts', varName: 'klAiCommunities', title: 'KL AI Communities', icon: 'ph:users-three', group: 'communities', },
    'kl-tech-communities': { file: 'kl-tech-communities.ts', varName: 'klTechCommunities', title: 'KL Tech Communities', icon: 'ph:code', group: 'communities', },
    'student-ambassador-programs': { file: 'student-ambassador-programs.ts', varName: 'studentAmbassadorPrograms', title: 'Student Tech Ambassador Programs', icon: 'ph:student', group: 'opportunities', },
    'developer-ambassador-programs': { file: 'developer-ambassador-programs.ts', varName: 'developerAmbassadorPrograms', title: 'Developer Ambassador Programs', icon: 'ph:trophy', group: 'opportunities', },
    'student-free-perks': { file: 'student-free-perks.ts', varName: 'studentFreePerks', title: 'Student Free Perks', icon: 'ph:gift', group: 'opportunities', },
    'startup-accelerators': { file: 'startup-accelerators.ts', varName: 'startupAccelerators', title: 'Best Startup Accelerators', icon: 'ph:rocket-launch', group: 'opportunities', },
    'malaysia-gov-grants': { file: 'malaysia-gov-grants.ts', varName: 'malaysiaGovGrants', title: 'Malaysia Government Grants', icon: 'ph:bank', group: 'opportunities', },
    'global-student-competitions': { file: 'global-student-competitions.ts', varName: 'globalStudentCompetitions', title: 'Global Student Competitions', icon: 'ph:trophy', group: 'opportunities', },
    'hackathon-resources': { file: 'hackathon-resources.ts', varName: 'hackathonResources', title: 'Hackathon Resources', icon: 'ph:lightning', group: 'resources', },
    'malaysia-student-competitions': { file: 'malaysia-student-competitions.ts', varName: 'malaysiaStudentCompetitions', title: 'Malaysia Student Competitions', icon: 'ph:medal', group: 'opportunities', },
    'malaysia-open-competitions': { file: 'malaysia-open-competitions.ts', varName: 'malaysiaOpenCompetitions', title: 'Malaysia Open Competitions', icon: 'ph:flag-banner', group: 'opportunities', },
    'startup-learning-resources': { file: 'startup-learning-resources.ts', varName: 'startupLearningResources', title: 'Startup Learning Resources', icon: 'ph:graduation-cap', group: 'learning', },
    'startup-ideation': { file: 'startup-ideation.ts', varName: 'startupIdeation', title: 'Startup Ideation', icon: 'ph:lightbulb-filament', group: 'learning', },
    'startup-building-mvp': { file: 'startup-building-mvp.ts', varName: 'startupBuildingMvp', title: 'Building MVPs', icon: 'ph:hammer', group: 'learning', },
    'startup-fundraising': { file: 'startup-fundraising.ts', varName: 'startupFundraising', title: 'Startup Fundraising', icon: 'ph:hand-coins', group: 'learning', },
    'startup-marketing-growth': { file: 'startup-marketing-growth.ts', varName: 'startupMarketingGrowth', title: 'Startup Marketing & Growth', icon: 'ph:chart-line-up', group: 'learning', },
    'startup-ai-tech-stack': { file: 'startup-ai-tech-stack.ts', varName: 'startupAiTechStack', title: 'AI Tech Stack for Startups', icon: 'ph:stack', group: 'resources', },
    'my-startup-tools': { file: 'my-startup-tools.ts', varName: 'myStartupTools', title: 'Tools My Startup Uses', icon: 'ph:toolbox', group: 'resources', },
    'ai-writing-tools': { file: 'ai-writing-tools.ts', varName: 'aiWritingTools', title: 'AI Writing Tools', icon: 'ph:pencil-line', group: 'ai-tools', },
    'ai-image-tools': { file: 'ai-image-tools.ts', varName: 'aiImageTools', title: 'AI Image Tools', icon: 'ph:image', group: 'ai-tools', },
    'ai-audio-tools': { file: 'ai-audio-tools.ts', varName: 'aiAudioTools', title: 'AI Audio Tools', icon: 'ph:waveform', group: 'ai-tools', },
    'ai-video-tools': { file: 'ai-video-tools.ts', varName: 'aiVideoTools', title: 'AI Video Tools', icon: 'ph:film-strip', group: 'ai-tools', },
    'ai-research-tools': { file: 'ai-research-tools.ts', varName: 'aiResearchTools', title: 'AI Research Tools', icon: 'ph:magnifying-glass', group: 'ai-tools', },
    'ai-design-tools': { file: 'ai-design-tools.ts', varName: 'aiDesignTools', title: 'AI Design Tools', icon: 'ph:palette', group: 'ai-tools', },
    'ai-avatar-tools': { file: 'ai-avatar-tools.ts', varName: 'aiAvatarTools', title: 'AI Avatar Tools', icon: 'ph:user-circle', group: 'ai-tools', },
    'learn-programming': { file: 'learn-programming.ts', varName: 'learnProgramming', title: 'Learn Programming', icon: 'ph:code-block', group: 'learning', },
    'paid-open-source-programs': { file: 'paid-open-source-programs.ts', varName: 'paidOpenSourcePrograms', title: 'Paid Open Source Programs', icon: 'ph:currency-dollar', group: 'opportunities', },
    'hobbies': { file: 'hobbies.ts', varName: 'hobbies', title: 'Hobbies', icon: 'ph:confetti', group: 'hobbies' },
};

export function getListFilePath(category: string): string {
    const entry = listFileMap[category];
    if (!entry) throw new Error(`Unknown category: ${category}`);
    return path.join(process.cwd(), 'src/data/lists', entry.file);
}

function escapeTs(val: string): string {
    return val
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
}

export function serializeItem(item: Record<string, any>): string {
    const lines: string[] = [];
    lines.push('    {');

    if (item.name != null) lines.push(`        name: '${escapeTs(item.name)}',`);
    if (item.description) lines.push(`        description: '${escapeTs(item.description)}',`);
    if (item.url) lines.push(`        url: '${escapeTs(item.url)}',`);
    if (item.image != null && item.image !== '') lines.push(`        image: '${escapeTs(item.image)}',`);

    if (item.tags && Array.isArray(item.tags) && item.tags.length > 0) {
        const tagStr = item.tags.map((t: string) => `'${escapeTs(t)}'`).join(', ');
        lines.push(`        tags: [${tagStr}],`);
    }

    // Preserve any extra fields (e.g. category-specific ones like fundingAmount, deadline, etc.)
    const knownFields = new Set(['name', 'description', 'url', 'image', 'tags']);
    for (const [key, val] of Object.entries(item)) {
        if (knownFields.has(key)) continue;
        if (val == null || val === '') continue;
        if (typeof val === 'string') {
            lines.push(`        ${key}: '${escapeTs(val)}',`);
        } else if (typeof val === 'number' || typeof val === 'boolean') {
            lines.push(`        ${key}: ${val},`);
        } else if (Array.isArray(val)) {
            const arrStr = val.map((v: any) => typeof v === 'string' ? `'${escapeTs(v)}'` : String(v)).join(', ');
            lines.push(`        ${key}: [${arrStr}],`);
        }
    }

    lines.push('    },');
    return lines.join('\n');
}

/**
 * Locate one item literal in a list file by its `name` field.
 * Returns the offsets of the whole block, from the start of its opening line through any
 * trailing comma — i.e. exactly the span you can replace or cut out.
 */
export function findItemBounds(fileContent: string, originalName: string): { start: number; end: number } {
    // Find the item block by matching name: 'originalName' or name: "originalName"
    const escapedName = originalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const namePattern = new RegExp(`name:\\s*['"]${escapedName}['"]`);
    const nameMatch = namePattern.exec(fileContent);

    if (!nameMatch) {
        throw new Error(`Could not find item with name: ${originalName}`);
    }

    // Search backwards from the name match to find the opening {
    let braceStart = -1;
    for (let i = nameMatch.index; i >= 0; i--) {
        if (fileContent[i] === '{') {
            braceStart = i;
            break;
        }
    }

    if (braceStart === -1) {
        throw new Error(`Could not find opening brace for item: ${originalName}`);
    }

    // Search forward from braceStart to find matching closing }
    let braceCount = 0;
    let braceEnd = -1;
    for (let i = braceStart; i < fileContent.length; i++) {
        if (fileContent[i] === '{') braceCount++;
        if (fileContent[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
                braceEnd = i;
                break;
            }
        }
    }

    if (braceEnd === -1) {
        throw new Error(`Could not find closing brace for item: ${originalName}`);
    }

    // Include the trailing comma if present
    let endPos = braceEnd + 1;
    if (fileContent[endPos] === ',') endPos++;

    // Find the start of the line containing the opening brace
    let lineStart = braceStart;
    while (lineStart > 0 && fileContent[lineStart - 1] !== '\n') {
        lineStart--;
    }

    return { start: lineStart, end: endPos };
}

export function findAndReplaceItem(fileContent: string, originalName: string, newItemStr: string): string {
    const { start, end } = findItemBounds(fileContent, originalName);
    return fileContent.substring(0, start) + newItemStr + '\n' + fileContent.substring(end);
}

/** Cut an item out of a list file, taking its trailing newline with it. */
export function findAndRemoveItem(fileContent: string, originalName: string): string {
    const { start, end } = findItemBounds(fileContent, originalName);
    let after = end;
    while (after < fileContent.length && (fileContent[after] === ' ' || fileContent[after] === '\t')) after++;
    if (fileContent[after] === '\n') after++;
    return fileContent.substring(0, start) + fileContent.substring(after);
}

/**
 * Append an item to the end of a list file's exported array, i.e. just before the final `];`.
 * Keeps the file's existing contents byte-for-byte otherwise.
 */
export function appendItem(fileContent: string, newItemStr: string): string {
    const closing = fileContent.lastIndexOf('];');
    if (closing === -1) throw new Error('Could not find the end of the exported array (`];`) in the list file');
    return fileContent.substring(0, closing) + newItemStr + '\n' + fileContent.substring(closing);
}

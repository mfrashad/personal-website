import * as path from 'path';

export const listFileMap: Record<string, { file: string; varName: string; title: string; icon: string }> = {
    'products': { file: 'favorite-products.ts', varName: 'favoriteProducts', title: 'Best Purchases', icon: 'ph:shopping-bag' },
    'software': { file: 'favorite-software.ts', varName: 'favoriteSoftware', title: 'Favorite Software', icon: 'ph:app-window' },
    'podcasts': { file: 'favorite-podcasts.ts', varName: 'favoritePodcasts', title: 'Favorite Podcasts', icon: 'ph:microphone' },
    'blogs': { file: 'favorite-blogs.ts', varName: 'favoriteBlogs', title: 'Favorite Blogs', icon: 'ph:article' },
    'games': { file: 'favorite-games.ts', varName: 'favoriteGames', title: 'Favorite Games', icon: 'ph:game-controller' },
    'music': { file: 'favorite-music.ts', varName: 'favoriteMusic', title: 'Favorite Music', icon: 'ph:music-notes' },
    'people': { file: 'favorite-people.ts', varName: 'favoritePeople', title: 'People Who Inspire Me', icon: 'ph:users' },
    'anime': { file: 'favorite-anime.ts', varName: 'favoriteAnime', title: 'Favorite Anime', icon: 'ph:television' },
    'nonfiction-books': { file: 'favorite-nonfiction-books.ts', varName: 'favoriteNonfictionBooks', title: 'Favorite Nonfiction Books', icon: 'ph:book-open' },
    'novels': { file: 'favorite-novels.ts', varName: 'favoriteNovels', title: 'Favorite Novels', icon: 'ph:book' },
    'webnovels': { file: 'favorite-webnovels.ts', varName: 'favoriteWebnovels', title: 'Favorite Web Novels', icon: 'ph:scroll' },
    'concepts': { file: 'favorite-concepts.ts', varName: 'favoriteConcepts', title: 'Favorite Concepts', icon: 'ph:lightbulb' },
    'kl-ai-communities': { file: 'kl-ai-communities.ts', varName: 'klAiCommunities', title: 'KL AI Communities', icon: 'ph:users-three' },
    'kl-tech-communities': { file: 'kl-tech-communities.ts', varName: 'klTechCommunities', title: 'KL Tech Communities', icon: 'ph:code' },
    'student-ambassador-programs': { file: 'student-ambassador-programs.ts', varName: 'studentAmbassadorPrograms', title: 'Student Tech Ambassador Programs', icon: 'ph:student' },
    'developer-ambassador-programs': { file: 'developer-ambassador-programs.ts', varName: 'developerAmbassadorPrograms', title: 'Developer Ambassador Programs', icon: 'ph:trophy' },
    'student-free-perks': { file: 'student-free-perks.ts', varName: 'studentFreePerks', title: 'Student Free Perks', icon: 'ph:gift' },
    'startup-accelerators': { file: 'startup-accelerators.ts', varName: 'startupAccelerators', title: 'Best Startup Accelerators', icon: 'ph:rocket-launch' },
    'malaysia-gov-grants': { file: 'malaysia-gov-grants.ts', varName: 'malaysiaGovGrants', title: 'Malaysia Government Grants', icon: 'ph:bank' },
    'global-student-competitions': { file: 'global-student-competitions.ts', varName: 'globalStudentCompetitions', title: 'Global Student Competitions', icon: 'ph:trophy' },
    'malaysia-student-competitions': { file: 'malaysia-student-competitions.ts', varName: 'malaysiaStudentCompetitions', title: 'Malaysia Student Competitions', icon: 'ph:medal' },
    'malaysia-open-competitions': { file: 'malaysia-open-competitions.ts', varName: 'malaysiaOpenCompetitions', title: 'Malaysia Open Competitions', icon: 'ph:flag-banner' },
    'startup-learning-resources': { file: 'startup-learning-resources.ts', varName: 'startupLearningResources', title: 'Startup Learning Resources', icon: 'ph:graduation-cap' },
    'startup-ideation': { file: 'startup-ideation.ts', varName: 'startupIdeation', title: 'Startup Ideation', icon: 'ph:lightbulb-filament' },
    'startup-building-mvp': { file: 'startup-building-mvp.ts', varName: 'startupBuildingMvp', title: 'Building MVPs', icon: 'ph:hammer' },
    'startup-fundraising': { file: 'startup-fundraising.ts', varName: 'startupFundraising', title: 'Startup Fundraising', icon: 'ph:hand-coins' },
    'startup-marketing-growth': { file: 'startup-marketing-growth.ts', varName: 'startupMarketingGrowth', title: 'Startup Marketing & Growth', icon: 'ph:chart-line-up' },
    'startup-ai-tech-stack': { file: 'startup-ai-tech-stack.ts', varName: 'startupAiTechStack', title: 'AI Tech Stack for Startups', icon: 'ph:stack' },
    'my-startup-tools': { file: 'my-startup-tools.ts', varName: 'myStartupTools', title: 'Tools My Startup Uses', icon: 'ph:toolbox' },
    'ai-writing-tools': { file: 'ai-writing-tools.ts', varName: 'aiWritingTools', title: 'AI Writing Tools', icon: 'ph:pencil-line' },
    'ai-image-tools': { file: 'ai-image-tools.ts', varName: 'aiImageTools', title: 'AI Image Tools', icon: 'ph:image' },
    'ai-audio-tools': { file: 'ai-audio-tools.ts', varName: 'aiAudioTools', title: 'AI Audio Tools', icon: 'ph:waveform' },
    'ai-video-tools': { file: 'ai-video-tools.ts', varName: 'aiVideoTools', title: 'AI Video Tools', icon: 'ph:film-strip' },
    'ai-research-tools': { file: 'ai-research-tools.ts', varName: 'aiResearchTools', title: 'AI Research Tools', icon: 'ph:magnifying-glass' },
    'ai-design-tools': { file: 'ai-design-tools.ts', varName: 'aiDesignTools', title: 'AI Design Tools', icon: 'ph:palette' },
    'ai-avatar-tools': { file: 'ai-avatar-tools.ts', varName: 'aiAvatarTools', title: 'AI Avatar Tools', icon: 'ph:user-circle' },
    'learn-programming': { file: 'learn-programming.ts', varName: 'learnProgramming', title: 'Learn Programming', icon: 'ph:code-block' },
    'paid-open-source-programs': { file: 'paid-open-source-programs.ts', varName: 'paidOpenSourcePrograms', title: 'Paid Open Source Programs', icon: 'ph:currency-dollar' },
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
    if (item.description != null) lines.push(`        description: '${escapeTs(item.description)}',`);
    if (item.url != null) lines.push(`        url: '${escapeTs(item.url)}',`);
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

export function findAndReplaceItem(fileContent: string, originalName: string, newItemStr: string): string {
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

    return fileContent.substring(0, lineStart) + newItemStr + '\n' + fileContent.substring(endPos);
}

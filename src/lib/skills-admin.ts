import * as path from 'path';

function escapeTs(val: string): string {
    return val
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
}

export function getSkillsFilePath(): string {
    return path.join(process.cwd(), 'src/data/skills.ts');
}

export function getAchievementsFilePath(): string {
    return path.join(process.cwd(), 'src/data/achievements.ts');
}

export function serializeSkill(skill: Record<string, any>): string {
    const lines: string[] = [];
    lines.push('    {');

    lines.push(`        id: '${escapeTs(skill.id)}',`);
    lines.push(`        title: '${escapeTs(skill.title)}',`);
    lines.push(`        icon: '${escapeTs(skill.icon)}',`);

    if (skill.tags && Array.isArray(skill.tags) && skill.tags.length > 0) {
        const tagStr = skill.tags.map((t: string) => `'${escapeTs(t)}'`).join(', ');
        lines.push(`        tags: [${tagStr}],`);
    } else {
        lines.push('        tags: [],');
    }

    if (skill.parentId) lines.push(`        parentId: '${escapeTs(skill.parentId)}',`);
    if (skill.duration != null && skill.duration !== '') lines.push(`        duration: ${Number(skill.duration)},`);
    if (skill.xp) lines.push(`        xp: '${escapeTs(skill.xp)}',`);
    if (skill.amount != null && skill.amount !== '') lines.push(`        amount: ${Number(skill.amount)},`);
    if (skill.image) lines.push(`        image: '${escapeTs(skill.image)}',`);
    if (skill.url) lines.push(`        url: '${escapeTs(skill.url)}',`);
    if (skill.description) lines.push(`        description: '${escapeTs(skill.description)}',`);
    if (skill.hidden) lines.push(`        hidden: true,`);

    lines.push('    },');
    return lines.join('\n');
}

export function serializeAchievement(item: Record<string, any>): string {
    const lines: string[] = [];
    lines.push('    {');

    lines.push(`        id: '${escapeTs(item.id)}',`);
    lines.push(`        title: '${escapeTs(item.title)}',`);
    lines.push(`        description: '${escapeTs(item.description)}',`);
    lines.push(`        icon: '${escapeTs(item.icon)}',`);
    lines.push(`        category: '${escapeTs(item.category)}',`);

    if (item.tags && Array.isArray(item.tags) && item.tags.length > 0) {
        const tagStr = item.tags.map((t: string) => `'${escapeTs(t)}'`).join(', ');
        lines.push(`        tags: [${tagStr}],`);
    } else {
        lines.push('        tags: [],');
    }

    if (item.date) lines.push(`        date: '${escapeTs(item.date)}',`);
    lines.push(`        unlocked: ${item.unlocked === true || item.unlocked === 'true'},`);
    if (item.image) lines.push(`        image: '${escapeTs(item.image)}',`);
    if (item.caption) lines.push(`        caption: '${escapeTs(item.caption)}',`);

    if (item.skills && Array.isArray(item.skills) && item.skills.length > 0) {
        const skillStr = item.skills.map((s: string) => `'${escapeTs(s)}'`).join(', ');
        lines.push(`        skills: [${skillStr}],`);
    }

    lines.push('    },');
    return lines.join('\n');
}

export function findAndReplaceById(fileContent: string, id: string, newBlock: string): string {
    const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const idPattern = new RegExp(`["']?id["']?:\\s*['"]${escapedId}['"]`);
    const idMatch = idPattern.exec(fileContent);

    if (!idMatch) {
        throw new Error(`Could not find item with id: ${id}`);
    }

    let braceStart = -1;
    for (let i = idMatch.index; i >= 0; i--) {
        if (fileContent[i] === '{') {
            braceStart = i;
            break;
        }
    }
    if (braceStart === -1) throw new Error(`Could not find opening brace for id: ${id}`);

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
    if (braceEnd === -1) throw new Error(`Could not find closing brace for id: ${id}`);

    let endPos = braceEnd + 1;
    if (fileContent[endPos] === ',') endPos++;

    let lineStart = braceStart;
    while (lineStart > 0 && fileContent[lineStart - 1] !== '\n') {
        lineStart--;
    }

    return fileContent.substring(0, lineStart) + newBlock + '\n' + fileContent.substring(endPos);
}

export function appendToArray(fileContent: string, varName: string, newBlock: string): string {
    const pattern = new RegExp(`export\\s+const\\s+${varName}[^=]*=\\s*\\[`);
    const match = pattern.exec(fileContent);
    if (!match) throw new Error(`Could not find array: ${varName}`);

    // Find the closing ];
    let braceCount = 0;
    let closingPos = -1;
    for (let i = match.index + match[0].length - 1; i < fileContent.length; i++) {
        if (fileContent[i] === '[') braceCount++;
        if (fileContent[i] === ']') {
            braceCount--;
            if (braceCount === 0) {
                closingPos = i;
                break;
            }
        }
    }
    if (closingPos === -1) throw new Error(`Could not find closing ] for array: ${varName}`);

    return fileContent.substring(0, closingPos) + newBlock + '\n' + fileContent.substring(closingPos);
}

export function removeById(fileContent: string, id: string): string {
    const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const idPattern = new RegExp(`["']?id["']?:\\s*['"]${escapedId}['"]`);
    const idMatch = idPattern.exec(fileContent);

    if (!idMatch) throw new Error(`Could not find item with id: ${id}`);

    let braceStart = -1;
    for (let i = idMatch.index; i >= 0; i--) {
        if (fileContent[i] === '{') {
            braceStart = i;
            break;
        }
    }
    if (braceStart === -1) throw new Error(`Could not find opening brace for id: ${id}`);

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
    if (braceEnd === -1) throw new Error(`Could not find closing brace for id: ${id}`);

    let endPos = braceEnd + 1;
    if (fileContent[endPos] === ',') endPos++;

    let lineStart = braceStart;
    while (lineStart > 0 && fileContent[lineStart - 1] !== '\n') {
        lineStart--;
    }

    // Also consume trailing newline
    let lineEnd = endPos;
    while (lineEnd < fileContent.length && fileContent[lineEnd] === '\n') {
        lineEnd++;
        break;
    }

    return fileContent.substring(0, lineStart) + fileContent.substring(lineEnd);
}

export function removeSkillRefFromAchievements(fileContent: string, skillId: string): string {
    // Remove a skill ID from all achievements' skills arrays
    // Match patterns like: skills: ['id1', 'id2'] and remove the specific ID
    const escapedId = skillId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Remove the skill ID entry (with surrounding quotes and optional comma/space)
    let result = fileContent;

    // Pattern: 'skillId', (with trailing comma+space) or , 'skillId' (with leading comma+space) or just 'skillId'
    result = result.replace(new RegExp(`'${escapedId}',\\s*`, 'g'), '');
    result = result.replace(new RegExp(`,\\s*'${escapedId}'`, 'g'), '');
    result = result.replace(new RegExp(`'${escapedId}'`, 'g'), '');

    // Clean up empty skills arrays: skills: [] -> remove the line
    result = result.replace(/\s*skills: \[\],?\n/g, '\n');

    return result;
}

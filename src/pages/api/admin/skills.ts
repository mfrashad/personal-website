import type { APIRoute } from 'astro';
import * as fs from 'fs';
import {
    getSkillsFilePath,
    getAchievementsFilePath,
    serializeSkill,
    serializeAchievement,
    findAndReplaceById,
    appendToArray,
    removeById,
    removeSkillRefFromAchievements,
} from '@lib/skills-admin';

export const prerender = false;

function prodGuard() {
    if (import.meta.env.PROD) {
        return new Response(JSON.stringify({ error: 'Not allowed in production' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    return null;
}

function jsonResponse(data: any, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

function parseSkillsFromFile(content: string): any[] {
    const items: any[] = [];
    const arrayMatch = /export\s+const\s+skills[^=]*=\s*\[/.exec(content);
    if (!arrayMatch) return items;

    // Find all object blocks in the array
    let pos = arrayMatch.index + arrayMatch[0].length;
    while (pos < content.length) {
        // Skip whitespace
        while (pos < content.length && /\s/.test(content[pos])) pos++;
        if (content[pos] === ']') break;
        if (content[pos] !== '{') { pos++; continue; }

        let braceCount = 0;
        let start = pos;
        for (; pos < content.length; pos++) {
            if (content[pos] === '{') braceCount++;
            if (content[pos] === '}') {
                braceCount--;
                if (braceCount === 0) { pos++; break; }
            }
        }

        const block = content.substring(start, pos);
        try {
            // Parse the object block using Function constructor (safe in dev-only context)
            const obj = new Function(`return (${block})`)();
            items.push(obj);
        } catch {
            // Skip unparseable blocks
        }

        // Skip comma
        while (pos < content.length && /[\s,]/.test(content[pos])) pos++;
    }

    return items;
}

function parseAchievementsFromFile(content: string): any[] {
    const items: any[] = [];
    const arrayMatch = /export\s+const\s+achievements[^=]*=\s*\[/.exec(content);
    if (!arrayMatch) return items;

    let pos = arrayMatch.index + arrayMatch[0].length;
    while (pos < content.length) {
        while (pos < content.length && /\s/.test(content[pos])) pos++;
        if (content[pos] === ']') break;
        if (content[pos] !== '{') { pos++; continue; }

        let braceCount = 0;
        let start = pos;
        for (; pos < content.length; pos++) {
            if (content[pos] === '{') braceCount++;
            if (content[pos] === '}') {
                braceCount--;
                if (braceCount === 0) { pos++; break; }
            }
        }

        const block = content.substring(start, pos);
        try {
            const obj = new Function(`return (${block})`)();
            items.push(obj);
        } catch {
            // Skip
        }

        while (pos < content.length && /[\s,]/.test(content[pos])) pos++;
    }

    return items;
}

export const GET: APIRoute = async () => {
    const guard = prodGuard();
    if (guard) return guard;

    try {
        const skillsContent = fs.readFileSync(getSkillsFilePath(), 'utf-8');
        const achievementsContent = fs.readFileSync(getAchievementsFilePath(), 'utf-8');

        const skills = parseSkillsFromFile(skillsContent);
        const achievements = parseAchievementsFromFile(achievementsContent);

        return jsonResponse({ skills, achievements });
    } catch (error) {
        return jsonResponse({ error: String(error) }, 500);
    }
};

export const POST: APIRoute = async ({ request }) => {
    const guard = prodGuard();
    if (guard) return guard;

    try {
        const { skill } = await request.json();
        if (!skill || !skill.id || !skill.title || !skill.icon) {
            return jsonResponse({ error: 'Missing required fields: id, title, icon' }, 400);
        }

        const filePath = getSkillsFilePath();
        let content = fs.readFileSync(filePath, 'utf-8');

        const newBlock = serializeSkill(skill);
        content = appendToArray(content, 'skills', newBlock);

        fs.writeFileSync(filePath, content, 'utf-8');
        return jsonResponse({ success: true });
    } catch (error) {
        return jsonResponse({ error: String(error) }, 500);
    }
};

export const PUT: APIRoute = async ({ request }) => {
    const guard = prodGuard();
    if (guard) return guard;

    try {
        const { type, id, data } = await request.json();
        if (!type || !id || !data) {
            return jsonResponse({ error: 'Missing required fields: type, id, data' }, 400);
        }

        if (type === 'skill') {
            const filePath = getSkillsFilePath();
            let content = fs.readFileSync(filePath, 'utf-8');
            const newBlock = serializeSkill({ ...data, id });
            content = findAndReplaceById(content, id, newBlock);
            fs.writeFileSync(filePath, content, 'utf-8');
        } else if (type === 'achievement') {
            const filePath = getAchievementsFilePath();
            let content = fs.readFileSync(filePath, 'utf-8');
            const newBlock = serializeAchievement({ ...data, id });
            content = findAndReplaceById(content, id, newBlock);
            fs.writeFileSync(filePath, content, 'utf-8');
        } else {
            return jsonResponse({ error: 'Invalid type, must be skill or achievement' }, 400);
        }

        return jsonResponse({ success: true });
    } catch (error) {
        return jsonResponse({ error: String(error) }, 500);
    }
};

export const DELETE: APIRoute = async ({ request }) => {
    const guard = prodGuard();
    if (guard) return guard;

    try {
        const { id, cascade } = await request.json();
        if (!id) return jsonResponse({ error: 'Missing required field: id' }, 400);

        const skillsPath = getSkillsFilePath();
        const achievementsPath = getAchievementsFilePath();
        let skillsContent = fs.readFileSync(skillsPath, 'utf-8');
        let achievementsContent = fs.readFileSync(achievementsPath, 'utf-8');

        const skills = parseSkillsFromFile(skillsContent);
        const idsToDelete = [id];

        if (cascade) {
            // Collect all descendant IDs
            const collectDescendants = (parentId: string) => {
                for (const s of skills) {
                    if (s.parentId === parentId) {
                        idsToDelete.push(s.id);
                        collectDescendants(s.id);
                    }
                }
            };
            collectDescendants(id);
        } else {
            // Promote children to root: remove their parentId
            for (const s of skills) {
                if (s.parentId === id) {
                    const updated = { ...s, parentId: undefined };
                    const newBlock = serializeSkill(updated);
                    skillsContent = findAndReplaceById(skillsContent, s.id, newBlock);
                }
            }
        }

        // Remove skills
        for (const deleteId of idsToDelete) {
            skillsContent = removeById(skillsContent, deleteId);
            achievementsContent = removeSkillRefFromAchievements(achievementsContent, deleteId);
        }

        fs.writeFileSync(skillsPath, skillsContent, 'utf-8');
        fs.writeFileSync(achievementsPath, achievementsContent, 'utf-8');

        return jsonResponse({ success: true, deleted: idsToDelete });
    } catch (error) {
        return jsonResponse({ error: String(error) }, 500);
    }
};

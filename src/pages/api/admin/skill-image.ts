import type { APIRoute } from 'astro';
import * as fs from 'fs';
import * as path from 'path';

export const prerender = false;

const ROOT = path.resolve(process.cwd());
const IMAGE_DIR = 'public/skill-images';

function getExtFromMime(mime: string): string {
    const map: Record<string, string> = {
        'image/png': '.png',
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/webp': '.webp',
        'image/gif': '.gif',
        'image/svg+xml': '.svg',
    };
    return map[mime] || '.png';
}

export const POST: APIRoute = async ({ request }) => {
    if (import.meta.env.PROD) {
        return new Response(JSON.stringify({ error: 'Not allowed in production' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const skillId = formData.get('skillId') as string | null;

        if (!file || !skillId) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: file, skillId' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } },
            );
        }

        const dirPath = path.join(ROOT, IMAGE_DIR);
        fs.mkdirSync(dirPath, { recursive: true });

        const ext = getExtFromMime(file.type);
        const filename = `${skillId}${ext}`;
        const filePath = path.join(dirPath, filename);

        // Remove old file with different extension
        const existingFiles = fs.readdirSync(dirPath).filter((f) => f.startsWith(skillId + '.'));
        for (const old of existingFiles) {
            fs.unlinkSync(path.join(dirPath, old));
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, buffer);

        const relativePath = `/skill-images/${filename}`;

        return new Response(
            JSON.stringify({ path: relativePath }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
    } catch (error) {
        console.error('Error uploading skill image:', error);
        return new Response(JSON.stringify({ error: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

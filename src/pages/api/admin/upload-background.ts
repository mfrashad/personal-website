import type { APIRoute } from 'astro';
import * as fs from 'fs';
import * as path from 'path';

export const prerender = false;

const ROOT = path.resolve(process.cwd());
const BG_DIR = path.join(ROOT, 'public/content-generator/backgrounds');

function getExtFromMime(mime: string): string {
    const map: Record<string, string> = {
        'image/png': '.png',
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/webp': '.webp',
        'image/gif': '.gif',
        'video/mp4': '.mp4',
        'video/webm': '.webm',
        'video/quicktime': '.mov',
        'audio/mpeg': '.mp3',
        'audio/mp3': '.mp3',
        'audio/wav': '.wav',
        'audio/ogg': '.ogg',
        'audio/aac': '.aac',
        'audio/x-m4a': '.m4a',
        'audio/mp4': '.m4a',
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
        const name = (formData.get('name') as string) || `bg-${Date.now()}`;

        if (!file) {
            return new Response(JSON.stringify({ error: 'Missing file' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        fs.mkdirSync(BG_DIR, { recursive: true });

        const ext = getExtFromMime(file.type);
        const filename = `${name}${ext}`;
        const filePath = path.join(BG_DIR, filename);

        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, buffer);

        const relativePath = `/content-generator/backgrounds/${filename}`;

        return new Response(JSON.stringify({ path: relativePath }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error uploading background:', error);
        return new Response(JSON.stringify({ error: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

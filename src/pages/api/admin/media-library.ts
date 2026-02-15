import type { APIRoute } from 'astro';
import * as fs from 'fs';
import * as path from 'path';

export const prerender = false;

const ROOT = path.resolve(process.cwd());
const LIBRARY_DIR = path.join(ROOT, 'public/content-generator/library');

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
const VIDEO_EXTS = new Set(['.mp4', '.webm', '.mov']);
const AUDIO_EXTS = new Set(['.mp3', '.wav', '.ogg', '.aac', '.m4a']);

function getMediaType(ext: string): 'image' | 'video' | 'audio' | null {
    if (IMAGE_EXTS.has(ext)) return 'image';
    if (VIDEO_EXTS.has(ext)) return 'video';
    if (AUDIO_EXTS.has(ext)) return 'audio';
    return null;
}

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
    return map[mime] || '.bin';
}

export interface MediaItem {
    name: string;
    path: string;
    type: 'image' | 'video' | 'audio';
    size: number;
    modified: number;
}

/** GET: List all media grouped by type */
export const GET: APIRoute = async ({ url }) => {
    if (import.meta.env.PROD) {
        return new Response(JSON.stringify({ error: 'Not allowed in production' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const typeFilter = url.searchParams.get('type'); // image | video | audio | null (all)

        // Scan library dir + legacy backgrounds dir
        const dirs = [
            { dir: LIBRARY_DIR, prefix: '/content-generator/library/' },
            { dir: path.join(ROOT, 'public/content-generator/backgrounds'), prefix: '/content-generator/backgrounds/' },
        ];

        const items: MediaItem[] = [];

        for (const { dir, prefix } of dirs) {
            if (!fs.existsSync(dir)) continue;
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const ext = path.extname(file).toLowerCase();
                const mediaType = getMediaType(ext);
                if (!mediaType) continue;
                if (typeFilter && mediaType !== typeFilter) continue;

                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                items.push({
                    name: file,
                    path: `${prefix}${file}`,
                    type: mediaType,
                    size: stat.size,
                    modified: stat.mtimeMs,
                });
            }
        }

        // Sort by most recent first
        items.sort((a, b) => b.modified - a.modified);

        return new Response(JSON.stringify({ items }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

/** POST: Upload new media to library */
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
        const label = (formData.get('name') as string) || `media-${Date.now()}`;

        if (!file) {
            return new Response(JSON.stringify({ error: 'Missing file' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        fs.mkdirSync(LIBRARY_DIR, { recursive: true });

        const ext = getExtFromMime(file.type);
        const filename = `${label}-${Date.now()}${ext}`;
        const filePath = path.join(LIBRARY_DIR, filename);

        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, buffer);

        const relativePath = `/content-generator/library/${filename}`;
        const mediaType = getMediaType(ext);

        return new Response(
            JSON.stringify({
                path: relativePath,
                name: filename,
                type: mediaType,
                size: buffer.length,
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
    } catch (error) {
        return new Response(JSON.stringify({ error: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

/** DELETE: Remove a media file */
export const DELETE: APIRoute = async ({ request }) => {
    if (import.meta.env.PROD) {
        return new Response(JSON.stringify({ error: 'Not allowed in production' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { filePath } = await request.json();
        if (!filePath || typeof filePath !== 'string') {
            return new Response(JSON.stringify({ error: 'Missing filePath' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Only allow deletion within content-generator directories
        const absPath = path.join(ROOT, 'public', filePath);
        const allowed = absPath.startsWith(path.join(ROOT, 'public/content-generator/'));
        if (!allowed) {
            return new Response(JSON.stringify({ error: 'Path not allowed' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (fs.existsSync(absPath)) {
            fs.unlinkSync(absPath);
        }

        return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

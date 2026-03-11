import type { APIRoute } from 'astro';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export const prerender = false;

const ROOT = path.resolve(process.cwd());
const LIBRARY_DIR = path.join(ROOT, 'public/content-generator/library');

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.heic', '.heif']);
const VIDEO_EXTS = new Set(['.mp4', '.webm', '.mov']);
const AUDIO_EXTS = new Set(['.mp3', '.wav', '.ogg', '.aac', '.m4a']);
const HEIC_EXTS = new Set(['.heic', '.heif']);

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
        'image/heic': '.heic',
        'image/heif': '.heif',
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

function isHeic(ext: string): boolean {
    return HEIC_EXTS.has(ext.toLowerCase());
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

        let ext = getExtFromMime(file.type);
        // Also detect HEIC by filename if MIME type is missing/generic
        if (ext === '.bin' && /\.(heic|heif)$/i.test(file.name)) {
            ext = '.' + file.name.split('.').pop()!.toLowerCase();
        }
        const buffer = Buffer.from(await file.arrayBuffer());

        let filename: string;
        let filePath: string;

        // Convert HEIC/HEIF to JPEG since browsers can't render them
        if (isHeic(ext)) {
            const tmpIn = path.join(LIBRARY_DIR, `_tmp_${Date.now()}${ext}`);
            filename = `${label}-${Date.now()}.jpg`;
            filePath = path.join(LIBRARY_DIR, filename);
            fs.writeFileSync(tmpIn, buffer);
            try {
                execSync(`sips -s format jpeg "${tmpIn}" --out "${filePath}"`, { stdio: 'pipe' });
            } finally {
                if (fs.existsSync(tmpIn)) fs.unlinkSync(tmpIn);
            }
            ext = '.jpg';
        } else {
            filename = `${label}-${Date.now()}${ext}`;
            filePath = path.join(LIBRARY_DIR, filename);
            fs.writeFileSync(filePath, buffer);
        }

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

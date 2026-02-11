import type { APIRoute } from 'astro';
import * as fs from 'fs';
import * as path from 'path';

export const prerender = false;

const ROOT = path.resolve(process.cwd());
const MANIFEST_PATH = path.join(ROOT, 'src/data/resource-images.json');

const TYPE_DIRS: Record<string, string> = {
    favicon: 'public/resource-images/favicons',
    ogImage: 'public/resource-images/og',
    screenshot: 'public/resource-images/screenshots',
};

function getExtFromMime(mime: string): string {
    const map: Record<string, string> = {
        'image/png': '.png',
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/webp': '.webp',
        'image/gif': '.gif',
        'image/svg+xml': '.svg',
        'image/x-icon': '.ico',
        'image/vnd.microsoft.icon': '.ico',
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
        const domainKey = formData.get('domainKey') as string | null;
        const imageType = formData.get('imageType') as string | null;

        if (!file || !domainKey || !imageType) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: file, domainKey, imageType' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } },
            );
        }

        if (!TYPE_DIRS[imageType]) {
            return new Response(
                JSON.stringify({ error: `Invalid imageType: ${imageType}. Must be favicon, ogImage, or screenshot` }),
                { status: 400, headers: { 'Content-Type': 'application/json' } },
            );
        }

        const dirPath = path.join(ROOT, TYPE_DIRS[imageType]);
        fs.mkdirSync(dirPath, { recursive: true });

        const ext = getExtFromMime(file.type);
        const filename = `${domainKey}${ext}`;
        const filePath = path.join(dirPath, filename);

        // Remove old file with different extension if exists
        const existingFiles = fs.readdirSync(dirPath).filter((f) => f.startsWith(domainKey + '.'));
        for (const old of existingFiles) {
            fs.unlinkSync(path.join(dirPath, old));
        }

        // Write file
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, buffer);

        // Build relative path for manifest (strip 'public/' prefix)
        const relativePath = `/${TYPE_DIRS[imageType].replace('public/', '')}/${filename}`;

        // Update manifest
        let manifest = { images: {} as Record<string, any> };
        if (fs.existsSync(MANIFEST_PATH)) {
            manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
        }
        if (!manifest.images[domainKey]) {
            manifest.images[domainKey] = {};
        }
        manifest.images[domainKey][imageType] = relativePath;
        fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

        return new Response(
            JSON.stringify({ path: relativePath, imageType, domainKey }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
    } catch (error) {
        console.error('Error uploading image:', error);
        return new Response(JSON.stringify({ error: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

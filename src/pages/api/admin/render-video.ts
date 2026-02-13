import type { APIRoute } from 'astro';
import * as fs from 'fs';
import * as path from 'path';

export const prerender = false;

const ROOT = path.resolve(process.cwd());
const OUTPUT_DIR = path.join(ROOT, 'public/content-generator/output');
const REMOTION_ENTRY = path.join(ROOT, 'remotion/index.ts');

let bundleCache: string | null = null;

export const POST: APIRoute = async ({ request }) => {
    if (import.meta.env.PROD) {
        return new Response(JSON.stringify({ error: 'Not allowed in production' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { bundle } = await import('@remotion/bundler');
        const { renderMedia, selectComposition } = await import('@remotion/renderer');

        const body = await request.json();
        const { backgroundVideo, backgroundImage, hookText, subtitle, brandName, items } = body;

        if (!hookText || !items?.length) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: hookText, items' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } },
            );
        }

        if (!backgroundVideo && !backgroundImage) {
            return new Response(
                JSON.stringify({ error: 'Provide either backgroundVideo or backgroundImage' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } },
            );
        }

        // Bundle Remotion project (cached)
        if (!bundleCache) {
            console.log('[render-video] Bundling Remotion project...');
            bundleCache = await bundle({
                entryPoint: REMOTION_ENTRY,
                publicDir: path.join(ROOT, 'public'),
            });
            console.log('[render-video] Bundle complete.');
        }

        const timestamp = Date.now();
        const outputSubdir = path.join(OUTPUT_DIR, `video-${timestamp}`);
        fs.mkdirSync(outputSubdir, { recursive: true });

        const outputPath = path.join(outputSubdir, 'reel.mp4');

        const inputProps = {
            backgroundVideo: backgroundVideo || undefined,
            backgroundImage: backgroundImage || undefined,
            hookText,
            subtitle: subtitle || undefined,
            brandName: brandName || '@rashad',
            items,
        };

        const composition = await selectComposition({
            serveUrl: bundleCache,
            id: 'VideoReel',
            inputProps,
        });

        console.log(`[render-video] Rendering ${composition.durationInFrames} frames...`);

        await renderMedia({
            serveUrl: bundleCache,
            composition,
            codec: 'h264',
            outputLocation: outputPath,
            inputProps,
        });

        const relativePath = `/content-generator/output/video-${timestamp}/reel.mp4`;

        return new Response(
            JSON.stringify({ path: relativePath }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
    } catch (error) {
        console.error('Error rendering video:', error);
        bundleCache = null;
        return new Response(JSON.stringify({ error: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

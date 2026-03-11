import type { APIRoute } from 'astro';
import * as fs from 'fs';
import * as path from 'path';

export const prerender = false;

const ROOT = path.resolve(process.cwd());
const OUTPUT_DIR = path.join(ROOT, 'public/content-generator/output');
const REMOTION_ENTRY = path.join(ROOT, 'remotion/index.ts');

let bundleCache: string | null = null;

/** Copy the media library into the bundle so newly uploaded files are available */
function syncLibraryToBundle(bundlePath: string) {
    const srcDir = path.join(ROOT, 'public/content-generator/library');
    const destDir = path.join(bundlePath, 'public', 'content-generator', 'library');
    if (!fs.existsSync(srcDir)) return;
    fs.mkdirSync(destDir, { recursive: true });
    for (const file of fs.readdirSync(srcDir)) {
        const src = path.join(srcDir, file);
        const dest = path.join(destDir, file);
        if (!fs.existsSync(dest)) {
            fs.copyFileSync(src, dest);
        }
    }
}

const BROWSER_EXE = path.join(
    ROOT,
    'node_modules/.remotion/chrome-headless-shell/mac-arm64/chrome-headless-shell-mac-arm64/chrome-headless-shell',
);

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
        const { backgroundVideo, backgroundImage, videoBackgroundMode, backgroundFallbackColor, audioSrc, hookDurationFrames, itemDurationFrames, ctaDurationFrames, hookText, subtitle, brandName, items, layoutOverrides, hookLayout, mockupLayout, logoUrls, template, rebundle } = body;

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
        if (rebundle) bundleCache = null;
        if (!bundleCache) {
            console.log('[render-video] Bundling Remotion project...');
            bundleCache = await bundle({
                entryPoint: REMOTION_ENTRY,
                publicDir: path.join(ROOT, 'public'),
            });
            console.log('[render-video] Bundle complete.');
        }

        // Sync newly uploaded media into the bundle's public dir
        syncLibraryToBundle(bundleCache);

        const timestamp = Date.now();
        const outputSubdir = path.join(OUTPUT_DIR, `video-${timestamp}`);
        fs.mkdirSync(outputSubdir, { recursive: true });

        const outputPath = path.join(outputSubdir, 'reel.mp4');

        const inputProps = {
            template: template || 'card',
            backgroundVideo: backgroundVideo || undefined,
            backgroundImage: backgroundImage || undefined,
            videoBackgroundMode: videoBackgroundMode || 'full',
            backgroundFallbackColor: backgroundFallbackColor || '#0f172a',
            audioSrc: audioSrc || undefined,
            hookDurationFrames: hookDurationFrames || undefined,
            itemDurationFrames: itemDurationFrames || undefined,
            ctaDurationFrames: ctaDurationFrames || undefined,
            hookText,
            subtitle: subtitle || undefined,
            brandName: brandName || '@rashadcodes',
            items,
            layoutOverrides: layoutOverrides || undefined,
            hookLayout: hookLayout || undefined,
            mockupLayout: mockupLayout || undefined,
            logoUrls: logoUrls || [],
        };

        const composition = await selectComposition({
            serveUrl: bundleCache,
            id: 'VideoReel',
            inputProps,
            browserExecutable: BROWSER_EXE,
        });

        console.log(`[render-video] Rendering ${composition.durationInFrames} frames...`);

        await renderMedia({
            serveUrl: bundleCache,
            composition,
            codec: 'h264',
            outputLocation: outputPath,
            inputProps,
            browserExecutable: BROWSER_EXE,
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

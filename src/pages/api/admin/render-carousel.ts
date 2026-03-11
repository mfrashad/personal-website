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
        const { renderStill, selectComposition } = await import('@remotion/renderer');

        const body = await request.json();
        const { backgroundImage, hookText, subtitle, brandName, ctaText, ctaSubtitle, ctaImage, logoUrls, items, hookLayout, mockupLayout, itemOverrides, template, rebundle, hookOverlayConfig } = body;

        if (!backgroundImage || !hookText || !items?.length) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: backgroundImage, hookText, items' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } },
            );
        }

        // Bundle Remotion project (cached per server session)
        if (rebundle) bundleCache = null;
        if (!bundleCache) {
            console.log('[render-carousel] Bundling Remotion project...');
            bundleCache = await bundle({
                entryPoint: REMOTION_ENTRY,
                publicDir: path.join(ROOT, 'public'),
            });
            console.log('[render-carousel] Bundle complete:', bundleCache);
        }

        // Sync newly uploaded media into the bundle's public dir
        syncLibraryToBundle(bundleCache);

        // Prepare output directory
        const timestamp = Date.now();
        const outputSubdir = path.join(OUTPUT_DIR, `carousel-${timestamp}`);
        fs.mkdirSync(outputSubdir, { recursive: true });

        const outputPaths: string[] = [];

        // Resolve background image path - Remotion serves public/ at the bundle URL
        // so /content-generator/backgrounds/bg.png is available as a relative path
        const bgUrl = backgroundImage;

        // Select compositions from bundle
        const hookInputProps = {
            backgroundImage: bgUrl,
            hookText,
            subtitle: subtitle || undefined,
            brandName: brandName || '@rashadcodes',
            layout: hookLayout || undefined,
            logoUrls: logoUrls || [],
            overlayConfig: hookOverlayConfig,
        };

        const hookComposition = await selectComposition({
            serveUrl: bundleCache,
            id: 'CarouselHookSlide',
            inputProps: hookInputProps,
            browserExecutable: BROWSER_EXE,
        });

        // Render hook slide
        const hookOutput = path.join(outputSubdir, 'slide-00-hook.png');
        await renderStill({
            serveUrl: bundleCache,
            composition: hookComposition,
            output: hookOutput,
            inputProps: hookInputProps,
            browserExecutable: BROWSER_EXE,
        });
        outputPaths.push(`/content-generator/output/carousel-${timestamp}/slide-00-hook.png`);

        // Render item slides
        const useMockup = template === 'mockup';
        for (let i = 0; i < items.length; i++) {
            const { item, images, mockupImage } = items[i];
            const slideNum = String(i + 1).padStart(2, '0');
            const slideOutput = path.join(outputSubdir, `slide-${slideNum}.png`);

            if (useMockup && mockupImage) {
                const mockupInputProps = {
                    item,
                    mockupImage,
                    slideNumber: i + 1,
                    totalSlides: items.length,
                    brandName: brandName || '@rashadcodes',
                    favicon: images?.favicon || undefined,
                    layout: mockupLayout || undefined,
                    overlayConfig: itemOverrides?.overlayConfig || undefined,
                    showOverlay: itemOverrides?.showOverlay ?? true,
                };

                const mockupComposition = await selectComposition({
                    serveUrl: bundleCache,
                    id: 'CarouselMockupSlide',
                    inputProps: mockupInputProps,
                    browserExecutable: BROWSER_EXE,
                });

                await renderStill({
                    serveUrl: bundleCache,
                    composition: mockupComposition,
                    output: slideOutput,
                    inputProps: mockupInputProps,
                    browserExecutable: BROWSER_EXE,
                });
            } else {
                const itemInputProps = {
                    backgroundImage: bgUrl,
                    item,
                    images: images || undefined,
                    slideNumber: i + 1,
                    totalSlides: items.length,
                    brandName: brandName || '@rashadcodes',
                    overrides: itemOverrides || undefined,
                };

                const itemComposition = await selectComposition({
                    serveUrl: bundleCache,
                    id: 'CarouselItemSlide',
                    inputProps: itemInputProps,
                    browserExecutable: BROWSER_EXE,
                });

                await renderStill({
                    serveUrl: bundleCache,
                    composition: itemComposition,
                    output: slideOutput,
                    inputProps: itemInputProps,
                    browserExecutable: BROWSER_EXE,
                });
            }
            outputPaths.push(`/content-generator/output/carousel-${timestamp}/slide-${slideNum}.png`);
        }

        // Render CTA slide
        if (ctaText) {
            const ctaSlideOutput = path.join(outputSubdir, `slide-${String(items.length + 1).padStart(2, '0')}-cta.png`);
            const ctaInputProps = {
                backgroundImage: bgUrl,
                ctaText,
                ctaSubtitle: ctaSubtitle || undefined,
                ctaImage: ctaImage || undefined,
                brandName: brandName || '@rashadcodes',
            };

            const ctaComposition = await selectComposition({
                serveUrl: bundleCache,
                id: 'CarouselCtaSlide',
                inputProps: ctaInputProps,
                browserExecutable: BROWSER_EXE,
            });

            await renderStill({
                serveUrl: bundleCache,
                composition: ctaComposition,
                output: ctaSlideOutput,
                inputProps: ctaInputProps,
                browserExecutable: BROWSER_EXE,
            });
            outputPaths.push(`/content-generator/output/carousel-${timestamp}/slide-${String(items.length + 1).padStart(2, '0')}-cta.png`);
        }

        return new Response(
            JSON.stringify({
                paths: outputPaths,
                dir: `/content-generator/output/carousel-${timestamp}`,
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
    } catch (error) {
        console.error('Error rendering carousel:', error);
        bundleCache = null; // Reset cache on error
        return new Response(JSON.stringify({ error: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

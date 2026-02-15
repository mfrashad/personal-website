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
        const { renderStill, selectComposition } = await import('@remotion/renderer');

        const body = await request.json();
        const { backgroundImage, hookText, subtitle, brandName, ctaText, logoUrls, items, hookLayout, mockupLayout, itemOverrides, template } = body;

        if (!backgroundImage || !hookText || !items?.length) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: backgroundImage, hookText, items' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } },
            );
        }

        // Bundle Remotion project (cached)
        if (!bundleCache) {
            console.log('[render-carousel] Bundling Remotion project...');
            bundleCache = await bundle({
                entryPoint: REMOTION_ENTRY,
                publicDir: path.join(ROOT, 'public'),
            });
            console.log('[render-carousel] Bundle complete.');
        }

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
        };

        const hookComposition = await selectComposition({
            serveUrl: bundleCache,
            id: 'CarouselHookSlide',
            inputProps: hookInputProps,
        });

        // Render hook slide
        const hookOutput = path.join(outputSubdir, 'slide-00-hook.png');
        await renderStill({
            serveUrl: bundleCache,
            composition: hookComposition,
            output: hookOutput,
            inputProps: hookInputProps,
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
                };

                const mockupComposition = await selectComposition({
                    serveUrl: bundleCache,
                    id: 'CarouselMockupSlide',
                    inputProps: mockupInputProps,
                });

                await renderStill({
                    serveUrl: bundleCache,
                    composition: mockupComposition,
                    output: slideOutput,
                    inputProps: mockupInputProps,
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
                });

                await renderStill({
                    serveUrl: bundleCache,
                    composition: itemComposition,
                    output: slideOutput,
                    inputProps: itemInputProps,
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
                brandName: brandName || '@rashadcodes',
            };

            const ctaComposition = await selectComposition({
                serveUrl: bundleCache,
                id: 'CarouselCtaSlide',
                inputProps: ctaInputProps,
            });

            await renderStill({
                serveUrl: bundleCache,
                composition: ctaComposition,
                output: ctaSlideOutput,
                inputProps: ctaInputProps,
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

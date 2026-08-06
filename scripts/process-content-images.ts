import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SOURCE_DIR = path.join(process.env.HOME!, 'Documents/contentcreation');
const PROJECT_ROOT = process.cwd();
const BRAND_LOGOS_SRC = path.join(SOURCE_DIR, 'brandlogos');
const BRAND_LOGOS_DEST = path.join(PROJECT_ROOT, 'public/content-images/brandlogos');
const CONTENT_DEST = path.join(PROJECT_ROOT, 'public/content-images');
const MANIFEST_PATH = path.join(PROJECT_ROOT, 'src/data/content-images.json');

// Content type folder mappings
const CONTENT_FOLDERS: Record<string, { type: string; items: Record<string, string> }> = {
    cafehopping: {
        type: 'cafe-hopping',
        items: {
            'ame soeur': 'ame-soeur',
            'arte thomas chan': 'arte-thomas-chan',
            'ginger restaurant - bamboo hills': 'ginger-bamboo-hills',
            'hulu cafe': 'hulu-cafe',
            'peaches n cream': 'peaches-n-cream',
            'the farm - bangsar': 'the-farm-bangsar',
        },
    },
    advocacy: {
        type: 'educational',
        items: {
            'ai divide': 'ai-divide',
            'ai water usage': 'ai-water-usage',
        },
    },
    brands: {
        type: 'products',
        items: {
            'bijibiji x microsfot': 'bijibiji-microsoft',
            'edifier': 'edifier',
            'honor': 'honor',
            'tng': 'tng',
        },
    },
    educational: {
        type: 'educational',
        items: {
            'how to find cofounders': 'how-to-find-cofounders',
            'how to get experience': 'how-to-get-experience',
            'my day in a life as startup founder': 'day-in-life-startup-founder',
            'useful tools i found while building my startup': 'useful-startup-tools',
            'what we use to build a startup': 'what-we-use-build-startup',
        },
    },
    experiences: {
        type: 'experience',
        items: {
            'climbing': 'rock-climbing',
            'flying': 'flying-plane',
            'freediving': 'freediving',
            'hobby': 'fun-hobbies',
            'pizza': 'pizza-workshop',
            'sewing': 'sewing-workshop',
            'skydiving': 'skydiving',
            'surfing': 'surfing',
        },
    },
    'personal brand': {
        type: 'personal-brand',
        items: {
            '1 year of building a startup': '1-year-ai-startup',
            'how i got into uni at 15 yo': 'uni-at-15',
            'my career journey': 'career-journey',
            'my public speaking journey': 'public-speaking-journey',
            'news': 'news-kosmo',
        },
    },
};

async function processImage(inputPath: string, outputPath: string, maxWidth: number) {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    await sharp(inputPath)
        .resize(maxWidth, undefined, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(outputPath);
}

async function processBrandLogos() {
    if (!fs.existsSync(BRAND_LOGOS_SRC)) {
        console.log('No brand logos directory found, skipping');
        return;
    }

    if (!fs.existsSync(BRAND_LOGOS_DEST)) fs.mkdirSync(BRAND_LOGOS_DEST, { recursive: true });

    const files = fs.readdirSync(BRAND_LOGOS_SRC).filter(f => !f.startsWith('.'));
    for (const file of files) {
        const src = path.join(BRAND_LOGOS_SRC, file);
        const ext = path.extname(file);
        const name = path.basename(file, ext);
        const dest = path.join(BRAND_LOGOS_DEST, `${name}.png`);

        // Keep logos as PNG for transparency, just resize
        await sharp(src)
            .resize(400, undefined, { fit: 'inside', withoutEnlargement: true })
            .png()
            .toFile(dest);

        console.log(`  Logo: ${file} -> ${path.relative(PROJECT_ROOT, dest)}`);
    }
}

async function processContentFolders() {
    // Seed from the existing manifest rather than starting empty — see the same
    // note in process-speaking-images.ts. Starting from {} meant a run here
    // silently dropped every entry added by scripts/site/images.ts.
    const manifest: Record<string, { content: string; analytics: string }> = fs.existsSync(MANIFEST_PATH)
        ? JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
        : {};

    for (const [folderName, config] of Object.entries(CONTENT_FOLDERS)) {
        const srcDir = path.join(SOURCE_DIR, folderName);
        if (!fs.existsSync(srcDir)) {
            console.log(`Skipping ${folderName} - directory not found`);
            continue;
        }

        console.log(`\nProcessing ${folderName}...`);

        for (const [itemFolder, itemId] of Object.entries(config.items)) {
            const itemSrc = path.join(srcDir, itemFolder);
            if (!fs.existsSync(itemSrc)) {
                console.log(`  Skipping ${itemFolder} - not found`);
                continue;
            }

            const files = fs.readdirSync(itemSrc).filter(f => !f.startsWith('.'));
            const destDir = path.join(CONTENT_DEST, config.type, itemId);

            // Find content and analytics files
            // Priority: files named 'content', then 'analytics'/'analytic'
            // Fallback: first non-analytics image is content, second or analytics-named is analytics
            const isImage = (f: string) => /\.(png|jpg|jpeg|webp)$/i.test(f);
            const imageFiles = files.filter(isImage);
            const analyticsFile = imageFiles.find(f =>
                f.toLowerCase().includes('analytics') || f.toLowerCase().includes('analytic')
            );
            const contentFile = imageFiles.find(f =>
                f.toLowerCase().includes('content')
            ) || imageFiles.find(f => f !== analyticsFile);

            if (contentFile) {
                const contentDest = path.join(destDir, 'content.jpg');
                await processImage(path.join(itemSrc, contentFile), contentDest, 800);
                console.log(`  ${itemId}/content.jpg`);
            }

            if (analyticsFile) {
                const analyticsDest = path.join(destDir, 'analytics.jpg');
                await processImage(path.join(itemSrc, analyticsFile), analyticsDest, 800);
                console.log(`  ${itemId}/analytics.jpg`);
            }

            // Also create a smaller thumbnail for the phone mockup
            if (contentFile) {
                const thumbDest = path.join(destDir, 'thumb.jpg');
                await processImage(path.join(itemSrc, contentFile), thumbDest, 400);
            }

            manifest[itemId] = {
                content: `/content-images/${config.type}/${itemId}/content.jpg`,
                analytics: `/content-images/${config.type}/${itemId}/analytics.jpg`,
            };
        }
    }

    // Write manifest
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log(`\nManifest written to ${path.relative(PROJECT_ROOT, MANIFEST_PATH)}`);
}

async function main() {
    console.log('Processing brand logos...');
    await processBrandLogos();

    console.log('\nProcessing content images...');
    await processContentFolders();

    console.log('\nDone!');
}

main().catch(console.error);

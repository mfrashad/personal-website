import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

// Import all list files
import { favoriteProducts } from '../src/data/lists/favorite-products';
import { favoriteSoftware } from '../src/data/lists/favorite-software';
import { favoritePodcasts } from '../src/data/lists/favorite-podcasts';
import { favoriteBlogs } from '../src/data/lists/favorite-blogs';
import { favoriteGames } from '../src/data/lists/favorite-games';
import { favoriteMusic } from '../src/data/lists/favorite-music';
import { favoritePeople } from '../src/data/lists/favorite-people';
import { favoriteAnime } from '../src/data/lists/favorite-anime';
import { favoriteNonfictionBooks } from '../src/data/lists/favorite-nonfiction-books';
import { favoriteNovels } from '../src/data/lists/favorite-novels';
import { favoriteWebnovels } from '../src/data/lists/favorite-webnovels';
import { favoriteConcepts } from '../src/data/lists/favorite-concepts';
import { klAiCommunities } from '../src/data/lists/kl-ai-communities';
import { klTechCommunities } from '../src/data/lists/kl-tech-communities';
import { studentAmbassadorPrograms } from '../src/data/lists/student-ambassador-programs';
import { developerAmbassadorPrograms } from '../src/data/lists/developer-ambassador-programs';
import { studentFreePerks } from '../src/data/lists/student-free-perks';
import { startupAccelerators } from '../src/data/lists/startup-accelerators';
import { malaysiaGovGrants } from '../src/data/lists/malaysia-gov-grants';
import { globalStudentCompetitions } from '../src/data/lists/global-student-competitions';
import { malaysiaStudentCompetitions } from '../src/data/lists/malaysia-student-competitions';
import { malaysiaOpenCompetitions } from '../src/data/lists/malaysia-open-competitions';
import { startupLearningResources } from '../src/data/lists/startup-learning-resources';
import { startupIdeation } from '../src/data/lists/startup-ideation';
import { startupBuildingMvp } from '../src/data/lists/startup-building-mvp';
import { startupFundraising } from '../src/data/lists/startup-fundraising';
import { startupMarketingGrowth } from '../src/data/lists/startup-marketing-growth';
import { startupAiTechStack } from '../src/data/lists/startup-ai-tech-stack';
import { myStartupTools } from '../src/data/lists/my-startup-tools';
import { aiWritingTools } from '../src/data/lists/ai-writing-tools';
import { aiImageTools } from '../src/data/lists/ai-image-tools';
import { aiAudioTools } from '../src/data/lists/ai-audio-tools';
import { aiVideoTools } from '../src/data/lists/ai-video-tools';
import { aiResearchTools } from '../src/data/lists/ai-research-tools';
import { aiDesignTools } from '../src/data/lists/ai-design-tools';
import { aiAvatarTools } from '../src/data/lists/ai-avatar-tools';
import { learnProgramming } from '../src/data/lists/learn-programming';

const ROOT = path.resolve(import.meta.dirname, '..');
const SCREENSHOTS_DIR = path.join(ROOT, 'public/resource-images/screenshots');
const MANIFEST_PATH = path.join(ROOT, 'src/data/resource-images.json');
const VIEWPORT = { width: 1280, height: 800 };
const NAV_TIMEOUT = 15_000;
const CONCURRENCY = 3;

interface ImageManifest {
    images: Record<string, { favicon?: string; ogImage?: string; screenshot?: string }>;
}

function domainKey(url: string): string {
    try {
        const hostname = new URL(url).hostname.replace(/^www\./, '');
        return hostname.replace(/\./g, '-');
    } catch {
        return '';
    }
}

function collectItems(): { name: string; url: string }[] {
    const allLists = [
        favoriteProducts, favoriteSoftware, favoritePodcasts, favoriteBlogs,
        favoriteGames, favoriteMusic, favoritePeople, favoriteAnime,
        favoriteNonfictionBooks, favoriteNovels, favoriteWebnovels, favoriteConcepts,
        klAiCommunities, klTechCommunities,
        studentAmbassadorPrograms, developerAmbassadorPrograms, studentFreePerks,
        startupAccelerators, malaysiaGovGrants,
        globalStudentCompetitions, malaysiaStudentCompetitions, malaysiaOpenCompetitions,
        startupLearningResources, startupIdeation, startupBuildingMvp,
        startupFundraising, startupMarketingGrowth, startupAiTechStack, myStartupTools,
        aiWritingTools, aiImageTools, aiAudioTools, aiVideoTools,
        aiResearchTools, aiDesignTools, aiAvatarTools,
        learnProgramming,
    ];

    const items: { name: string; url: string }[] = [];
    for (const list of allLists) {
        for (const item of list) {
            if ((item as any).url) {
                items.push({ name: (item as any).name, url: (item as any).url });
            }
        }
    }
    return items;
}

async function screenshotUrl(
    browser: puppeteer.Browser,
    key: string,
    url: string,
    name: string,
): Promise<string | null> {
    const page = await browser.newPage();
    try {
        await page.setViewport(VIEWPORT);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: NAV_TIMEOUT });
        // Small delay for JS rendering
        await new Promise((r) => setTimeout(r, 1500));

        const filename = `${key}.png`;
        const destPath = path.join(SCREENSHOTS_DIR, filename);
        await page.screenshot({ path: destPath, type: 'png' });

        const relativePath = `/resource-images/screenshots/${filename}`;
        console.log(`  ✓ Screenshot: ${relativePath}`);
        return relativePath;
    } catch (err: any) {
        console.log(`  ✗ Error: ${err.message?.slice(0, 80) || err}`);
        return null;
    } finally {
        await page.close();
    }
}

async function processChunk(
    browser: puppeteer.Browser,
    chunk: [string, { name: string; url: string }][],
    manifest: ImageManifest,
): Promise<number> {
    const results = await Promise.allSettled(
        chunk.map(async ([key, item]) => {
            const screenshotPath = await screenshotUrl(browser, key, item.url, item.name);
            if (screenshotPath) {
                manifest.images[key] = { ...manifest.images[key], screenshot: screenshotPath };
                return true;
            }
            return false;
        }),
    );
    return results.filter((r) => r.status === 'fulfilled' && r.value).length;
}

async function main() {
    const forceAll = process.argv.includes('--force');

    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

    let manifest: ImageManifest = { images: {} };
    if (fs.existsSync(MANIFEST_PATH)) {
        manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
    }

    const items = collectItems();

    // Deduplicate by domain
    const domainMap = new Map<string, { name: string; url: string }>();
    for (const item of items) {
        const key = domainKey(item.url);
        if (key && !domainMap.has(key)) {
            domainMap.set(key, item);
        }
    }

    // Filter out already-screenshotted domains unless --force
    const toProcess: [string, { name: string; url: string }][] = [];
    let skipped = 0;
    for (const [key, item] of domainMap) {
        const existing = manifest.images[key]?.screenshot;
        if (!forceAll && existing && fs.existsSync(path.join(ROOT, 'public', existing))) {
            skipped++;
            continue;
        }
        toProcess.push([key, item]);
    }

    console.log(`Found ${domainMap.size} unique domains, ${skipped} already screenshotted, ${toProcess.length} to process`);

    if (toProcess.length === 0) {
        console.log('Nothing to do. Use --force to re-screenshot all.');
        return;
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    let fetched = 0;
    let failed = 0;

    // Process in chunks for controlled concurrency
    for (let i = 0; i < toProcess.length; i += CONCURRENCY) {
        const chunk = toProcess.slice(i, i + CONCURRENCY);
        const chunkNames = chunk.map(([, item]) => item.name).join(', ');
        console.log(`\n[${i + 1}-${Math.min(i + CONCURRENCY, toProcess.length)}/${toProcess.length}] ${chunkNames}`);

        const count = await processChunk(browser, chunk, manifest);
        fetched += count;
        failed += chunk.length - count;

        // Save manifest periodically
        if ((i + CONCURRENCY) % 15 === 0 || i + CONCURRENCY >= toProcess.length) {
            fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
        }
    }

    await browser.close();

    // Final manifest write
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

    console.log('\n--- Summary ---');
    console.log(`Total domains: ${domainMap.size}`);
    console.log(`Skipped (cached): ${skipped}`);
    console.log(`Screenshotted: ${fetched}`);
    console.log(`Failed: ${failed}`);
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});

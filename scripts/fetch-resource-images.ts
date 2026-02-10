import * as fs from 'fs';
import * as path from 'path';
import {
    domainKey,
    fetchWithTimeout,
    extractFaviconUrl,
    extractOgImageUrl,
    downloadImage,
    loadManifest,
    saveManifest,
    type ImageManifest,
} from '../src/lib/fetch-resource-image';

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

const ROOT = path.resolve(import.meta.dirname, '..');
const FAVICONS_DIR = path.join(ROOT, 'public/resource-images/favicons');
const OG_DIR = path.join(ROOT, 'public/resource-images/og');
const RATE_LIMIT_MS = 500;

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

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
    fs.mkdirSync(FAVICONS_DIR, { recursive: true });
    fs.mkdirSync(OG_DIR, { recursive: true });

    const manifest = loadManifest();
    const items = collectItems();

    // Deduplicate by domain
    const domainMap = new Map<string, { name: string; url: string }>();
    for (const item of items) {
        const key = domainKey(item.url);
        if (key && !domainMap.has(key)) {
            domainMap.set(key, item);
        }
    }

    console.log(`Found ${domainMap.size} unique domains from ${items.length} items`);

    let processed = 0;
    let skipped = 0;
    let fetched = 0;
    let failed = 0;

    for (const [key, item] of domainMap) {
        processed++;

        // Skip if already in manifest and files exist
        const existing = manifest.images[key];
        if (existing) {
            const faviconExists = existing.favicon && fs.existsSync(path.join(ROOT, 'public', existing.favicon));
            const ogExists = existing.ogImage && fs.existsSync(path.join(ROOT, 'public', existing.ogImage));
            if (faviconExists || ogExists) {
                skipped++;
                continue;
            }
        }

        console.log(`[${processed}/${domainMap.size}] Fetching ${item.name} (${key})...`);

        try {
            const res = await fetchWithTimeout(item.url);
            if (!res.ok) {
                console.log(`  ✗ HTTP ${res.status}`);
                failed++;
                await sleep(RATE_LIMIT_MS);
                continue;
            }

            const html = await res.text();
            const finalUrl = res.url || item.url;

            const faviconUrl = extractFaviconUrl(html, finalUrl);
            let faviconPath: string | null = null;
            if (faviconUrl) {
                faviconPath = await downloadImage(faviconUrl, FAVICONS_DIR, key);
                if (faviconPath) {
                    console.log(`  ✓ Favicon: ${faviconPath}`);
                }
            }

            const ogImageUrl = extractOgImageUrl(html, finalUrl);
            let ogImagePath: string | null = null;
            if (ogImageUrl) {
                ogImagePath = await downloadImage(ogImageUrl, OG_DIR, key);
                if (ogImagePath) {
                    console.log(`  ✓ OG Image: ${ogImagePath}`);
                }
            }

            if (faviconPath || ogImagePath) {
                manifest.images[key] = {};
                if (faviconPath) manifest.images[key].favicon = faviconPath;
                if (ogImagePath) manifest.images[key].ogImage = ogImagePath;
                fetched++;
            } else {
                console.log(`  ✗ No images found`);
                failed++;
            }
        } catch (err: any) {
            console.log(`  ✗ Error: ${err.message || err}`);
            failed++;
        }

        await sleep(RATE_LIMIT_MS);

        if (processed % 10 === 0) {
            saveManifest(manifest);
        }
    }

    saveManifest(manifest);

    console.log('\n--- Summary ---');
    console.log(`Total domains: ${domainMap.size}`);
    console.log(`Skipped (cached): ${skipped}`);
    console.log(`Fetched: ${fetched}`);
    console.log(`Failed: ${failed}`);
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});

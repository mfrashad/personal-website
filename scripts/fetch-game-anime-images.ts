/**
 * Fetch cover images for games (Steam) and anime (TMDB) and update the resource-images manifest.
 *
 * - Steam: Uses the Steam store API to get header images and icons
 * - TMDB: Uses the TMDB API to get poster images
 *
 * Usage: npx tsx scripts/fetch-game-anime-images.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { resourceKey, loadManifest, saveManifest, type ImageManifest } from '../src/lib/fetch-resource-image';

const ROOT = path.resolve(process.cwd());
const FAVICONS_DIR = path.join(ROOT, 'public/resource-images/favicons');
const OG_DIR = path.join(ROOT, 'public/resource-images/og');
const SCREENSHOTS_DIR = path.join(ROOT, 'public/resource-images/screenshots');
const TMDB_API_KEY = process.env.TMDB_API_KEY || '';

fs.mkdirSync(FAVICONS_DIR, { recursive: true });
fs.mkdirSync(OG_DIR, { recursive: true });
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

async function downloadFile(url: string, destPath: string): Promise<boolean> {
    try {
        const res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        if (!res.ok) return false;
        const buffer = Buffer.from(await res.arrayBuffer());
        if (buffer.length === 0) return false;
        fs.writeFileSync(destPath, buffer);
        return true;
    } catch {
        return false;
    }
}

function getExtFromContentOrUrl(url: string): string {
    try {
        const ext = path.extname(new URL(url).pathname).toLowerCase();
        if (['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)) {
            return ext === '.jpeg' ? '.jpg' : ext;
        }
    } catch {}
    return '.jpg';
}

/**
 * Fetch Steam game images using the Steam API.
 * - OG image: Steam header image (460x215 capsule)
 * - Favicon: Steam icon (small app icon)
 */
async function fetchSteamImages(name: string, url: string, key: string, manifest: ImageManifest): Promise<void> {
    // Extract app ID from Steam URL
    const match = url.match(/\/app\/(\d+)/);
    if (!match) {
        console.log(`  SKIP - Can't parse Steam app ID from ${url}`);
        return;
    }
    const appId = match[1];

    // Check if already exists in manifest
    const existing = manifest.images[key];
    if (existing?.favicon && existing?.ogImage) {
        console.log(`  SKIP (already has images)`);
        return;
    }

    // Steam API for app details
    const detailsUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}`;
    try {
        const res = await fetch(detailsUrl);
        const data = await res.json();
        const appData = data[appId];
        if (!appData?.success) {
            console.log(`  FAIL - Steam API returned no data`);
            return;
        }

        const details = appData.data;

        // OG Image: header_image (460x215 capsule)
        if (!existing?.ogImage && details.header_image) {
            const ext = getExtFromContentOrUrl(details.header_image);
            const ogPath = path.join(OG_DIR, `${key}${ext}`);
            if (await downloadFile(details.header_image, ogPath)) {
                const relativePath = `/resource-images/og/${key}${ext}`;
                manifest.images[key] = { ...manifest.images[key], ogImage: relativePath };
                console.log(`  OG: ${relativePath}`);
            }
        }

        // Favicon: capsule_image (small) or construct icon URL
        // Steam icon URL pattern: https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/{appid}/{icon}.jpg
        if (!existing?.favicon) {
            // Try capsule_imagev5 first (smaller, good for favicon)
            const iconUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/capsule_184x69.jpg`;
            const capsuleUrl = details.capsule_imagev5 || details.capsule_image;

            // Use the small capsule as favicon
            const ext = '.jpg';
            const favPath = path.join(FAVICONS_DIR, `${key}${ext}`);
            const sourceUrl = capsuleUrl || iconUrl;
            if (await downloadFile(sourceUrl, favPath)) {
                const relativePath = `/resource-images/favicons/${key}${ext}`;
                manifest.images[key] = { ...manifest.images[key], favicon: relativePath };
                console.log(`  Favicon: ${relativePath}`);
            }
        }
    } catch (err: any) {
        console.log(`  FAIL - ${err.message?.slice(0, 80)}`);
    }
}

/**
 * Fetch TMDB anime images using the TMDB API.
 * - OG image: Backdrop image (wide shot)
 * - Favicon: Poster image (portrait cover art)
 */
async function fetchTMDBImages(name: string, url: string, key: string, manifest: ImageManifest): Promise<void> {
    // Extract TMDB ID from URL
    const match = url.match(/\/tv\/(\d+)/);
    if (!match) {
        console.log(`  SKIP - Can't parse TMDB ID from ${url}`);
        return;
    }
    const tmdbId = match[1];

    // Check if already exists in manifest
    const existing = manifest.images[key];
    if (existing?.favicon && existing?.ogImage && existing?.screenshot) {
        console.log(`  SKIP (already has images)`);
        return;
    }

    // TMDB API for TV details
    const detailsUrl = `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_API_KEY}`;
    try {
        const res = await fetch(detailsUrl);
        const data = await res.json();

        // OG Image: backdrop (wide, cinematic)
        if (!existing?.ogImage && data.backdrop_path) {
            const imageUrl = `https://image.tmdb.org/t/p/w780${data.backdrop_path}`;
            const ext = '.jpg';
            const ogPath = path.join(OG_DIR, `${key}${ext}`);
            if (await downloadFile(imageUrl, ogPath)) {
                const relativePath = `/resource-images/og/${key}${ext}`;
                manifest.images[key] = { ...manifest.images[key], ogImage: relativePath };
                console.log(`  OG: ${relativePath}`);
            }
        }

        // Favicon: poster (portrait, cover art, small)
        if (!existing?.favicon && data.poster_path) {
            const imageUrl = `https://image.tmdb.org/t/p/w342${data.poster_path}`;
            const ext = '.jpg';
            const favPath = path.join(FAVICONS_DIR, `${key}${ext}`);
            if (await downloadFile(imageUrl, favPath)) {
                const relativePath = `/resource-images/favicons/${key}${ext}`;
                manifest.images[key] = { ...manifest.images[key], favicon: relativePath };
                console.log(`  Favicon: ${relativePath}`);
            }
        }

        // Screenshot: poster (portrait, cover art, larger)
        if (!existing?.screenshot && data.poster_path) {
            const imageUrl = `https://image.tmdb.org/t/p/w780${data.poster_path}`;
            const ext = '.jpg';
            const ssPath = path.join(SCREENSHOTS_DIR, `${key}${ext}`);
            if (await downloadFile(imageUrl, ssPath)) {
                const relativePath = `/resource-images/screenshots/${key}${ext}`;
                manifest.images[key] = { ...manifest.images[key], screenshot: relativePath };
                console.log(`  Screenshot: ${relativePath}`);
            }
        }
    } catch (err: any) {
        console.log(`  FAIL - ${err.message?.slice(0, 80)}`);
    }
}

async function main() {
    // Import lists
    const { favoriteGames } = await import('../src/data/lists/favorite-games');
    const { favoriteAnime } = await import('../src/data/lists/favorite-anime');

    const manifest = loadManifest();
    let fetched = 0;
    let skipped = 0;

    console.log('\n=== Fetching Steam game images ===\n');
    for (const game of favoriteGames) {
        if (!game.url) continue;
        const key = resourceKey(game.url);
        if (!key) continue;
        console.log(`[${game.name}] key=${key}`);
        const before = JSON.stringify(manifest.images[key] || {});
        await fetchSteamImages(game.name, game.url, key, manifest);
        const after = JSON.stringify(manifest.images[key] || {});
        if (before !== after) fetched++;
        else skipped++;

        // Rate limit
        await new Promise((r) => setTimeout(r, 500));
    }

    console.log('\n=== Fetching TMDB anime images ===\n');
    for (const anime of favoriteAnime) {
        if (!anime.url) continue;
        const key = resourceKey(anime.url);
        if (!key) continue;
        console.log(`[${anime.name}] key=${key}`);
        const before = JSON.stringify(manifest.images[key] || {});
        await fetchTMDBImages(anime.name, anime.url, key, manifest);
        const after = JSON.stringify(manifest.images[key] || {});
        if (before !== after) fetched++;
        else skipped++;

        // Rate limit
        await new Promise((r) => setTimeout(r, 300));
    }

    saveManifest(manifest);
    console.log(`\nDone! Fetched: ${fetched}, Skipped: ${skipped}`);
}

main().catch(console.error);

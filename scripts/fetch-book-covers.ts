import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import {
    resourceKey,
    loadManifest,
    saveManifest,
    type ImageManifest,
} from '../src/lib/fetch-resource-image';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

const HARDCOVER_API_KEY = process.env.HARDCOVER_API_KEY;
const API_URL = 'https://api.hardcover.app/v1/graphql';
const OG_DIR = path.resolve(process.cwd(), 'public/resource-images/og');
const FAVICONS_DIR = path.resolve(process.cwd(), 'public/resource-images/favicons');
const SCREENSHOTS_DIR = path.resolve(process.cwd(), 'public/resource-images/screenshots');

interface BookResult {
    title: string;
    slug: string;
    description: string | null;
    coverUrl: string | null;
}

// All books from the 3 lists
const allBooks = [
    // Nonfiction
    { name: 'Atomic Habits', list: 'nonfiction' },
    { name: 'Die With Zero', list: 'nonfiction' },
    { name: 'Doing Good Better', list: 'nonfiction' },
    { name: 'Millionaire Fast Lane', list: 'nonfiction', searchQuery: 'The Millionaire Fastlane' },
    { name: 'Deep Work', list: 'nonfiction', searchQuery: 'Deep Work Rules for Focused Success' },
    { name: 'Educated', list: 'nonfiction', searchQuery: 'Educated A Memoir' },
    { name: 'Models', list: 'nonfiction', searchQuery: 'Models Attract Women Through Honesty' },
    { name: 'The Slight Edge', list: 'nonfiction' },
    { name: 'Building a Second Brain', list: 'nonfiction' },
    { name: 'Getting Things Done', list: 'nonfiction', searchQuery: 'Getting Things Done Art of Stress-Free Productivity' },
    { name: 'Flow', list: 'nonfiction', searchQuery: 'Flow Psychology Optimal Experience Csikszentmihalyi' },
    { name: "Be So Good They Can't Ignore You", list: 'nonfiction', searchQuery: "So Good They Can't Ignore You" },
    // Novels
    { name: 'Project Hail Mary', list: 'novels' },
    { name: 'Babel', list: 'novels', searchQuery: 'Babel R.F. Kuang' },
    { name: 'Red Rising', list: 'novels' },
    { name: 'Dark Matter', list: 'novels', searchQuery: 'Dark Matter Blake Crouch' },
    { name: 'The Hunger Games', list: 'novels' },
    { name: 'Mistborn', list: 'novels', searchQuery: 'Mistborn The Final Empire' },
    // Web novels (may not be on Hardcover)
    { name: "Omniscient Reader's Viewpoint", list: 'webnovels' },
    { name: 'Mother of Learning', list: 'webnovels' },
    { name: 'Perfect Run', list: 'webnovels', searchQuery: 'The Perfect Run' },
    { name: 'Shadow Slave', list: 'webnovels' },
    { name: "The Novel's Extra", list: 'webnovels' },
    { name: 'Regression Instruction Manual', list: 'webnovels', searchQuery: 'Regression Instruction Manual novel' },
    { name: 'Everyone Else is a Returnee', list: 'webnovels' },
    { name: 'The Tutorial is Too Hard', list: 'webnovels' },
    { name: 'Primal Hunter', list: 'webnovels' },
    { name: 'Mushoku Tensei', list: 'webnovels' },
    { name: 'Coiling Dragon', list: 'webnovels' },
];

function titleMatches(resultTitle: string, searchName: string): boolean {
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const resultNorm = normalize(resultTitle);
    const searchWords = normalize(searchName).split(/\s+/).filter(w => w.length > 2);
    const matchCount = searchWords.filter(w => resultNorm.includes(w)).length;
    return matchCount >= Math.ceil(searchWords.length / 2);
}

async function searchBook(query: string, originalName: string): Promise<BookResult | null> {
    if (!HARDCOVER_API_KEY) {
        console.error('HARDCOVER_API_KEY not found in environment');
        process.exit(1);
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${HARDCOVER_API_KEY}`,
            },
            body: JSON.stringify({
                query: `
                    query SearchBooks($query: String!) {
                        search(
                            query: $query,
                            query_type: "Book",
                            per_page: 5
                        ) {
                            results
                        }
                    }
                `,
                variables: { query },
            }),
        });

        if (!response.ok) {
            console.error(`  API error: ${response.status}`);
            return null;
        }

        const data = await response.json();

        if (data.errors) {
            console.error(`  GraphQL errors:`, data.errors[0]?.message);
            return null;
        }

        const hits = data?.data?.search?.results?.hits;
        if (!hits || hits.length === 0) {
            return null;
        }

        // Filter to results that actually match the book we're looking for
        const validHits = hits.filter((h: any) => titleMatches(h.document.title, originalName));
        if (validHits.length === 0) {
            return null;
        }

        // Prefer results that have cover images and aren't summaries
        const preferred = validHits.find((h: any) => {
            const d = h.document;
            const title = (d.title || '').toLowerCase();
            const isSummary = title.includes('summary') || title.includes('study guide') || title.includes('guide to the book');
            return d.image?.url && !isSummary;
        });

        // Fall back to first non-summary result, then first result overall
        const nonSummary = validHits.find((h: any) => {
            const title = (h.document.title || '').toLowerCase();
            return !title.includes('summary') && !title.includes('study guide') && !title.includes('guide to the book');
        });
        const best = preferred || nonSummary || validHits[0];
        const doc = best.document;

        return {
            title: doc.title,
            slug: doc.slug,
            description: doc.description || null,
            coverUrl: doc.image?.url || null,
        };
    } catch (error) {
        console.error(`  Error searching for "${query}":`, error);
        return null;
    }
}

async function downloadCover(url: string, key: string, destDir: string): Promise<string | null> {
    try {
        const response = await fetch(url);
        if (!response.ok) return null;

        const buffer = Buffer.from(await response.arrayBuffer());

        // Determine extension from content-type or URL
        const contentType = response.headers.get('content-type') || '';
        let ext = '.jpg';
        if (contentType.includes('png')) ext = '.png';
        else if (contentType.includes('webp')) ext = '.webp';
        else if (url.includes('.png')) ext = '.png';
        else if (url.includes('.webp')) ext = '.webp';

        const filePath = path.join(destDir, `${key}${ext}`);
        fs.writeFileSync(filePath, buffer);

        const dirName = path.basename(destDir);
        return `/resource-images/${dirName}/${key}${ext}`;
    } catch (error) {
        console.error(`  Failed to download cover: ${error}`);
        return null;
    }
}

async function main() {
    console.log('Fetching book covers from Hardcover API...\n');

    // Ensure directories exist
    fs.mkdirSync(OG_DIR, { recursive: true });
    fs.mkdirSync(FAVICONS_DIR, { recursive: true });
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

    const manifest = loadManifest();
    let found = 0;
    let notFound = 0;
    let skipped = 0;

    for (const book of allBooks) {
        const query = book.searchQuery || book.name;
        process.stdout.write(`[${book.list}] "${book.name}" → `);

        const result = await searchBook(query, book.name);

        if (!result) {
            console.log('NOT FOUND');
            notFound++;
            continue;
        }

        const hardcoverUrl = result.slug
            ? `https://hardcover.app/books/${result.slug}`
            : null;

        if (!hardcoverUrl) {
            console.log('NO URL');
            notFound++;
            continue;
        }

        const key = resourceKey(hardcoverUrl);

        // Skip if all images already exist in the manifest
        const existing = manifest.images[key];
        if (existing?.favicon && existing?.ogImage && existing?.screenshot) {
            console.log(`SKIPPED (already has images) [${key}]`);
            skipped++;
            found++;
            continue;
        }

        let ogPath: string | null = null;
        let faviconPath: string | null = null;
        let screenshotPath: string | null = null;

        if (result.coverUrl) {
            // Only download what's missing
            if (!existing?.ogImage) {
                ogPath = await downloadCover(result.coverUrl, key, OG_DIR);
            }
            if (!existing?.favicon) {
                faviconPath = await downloadCover(result.coverUrl, key, FAVICONS_DIR);
            }
            if (!existing?.screenshot) {
                screenshotPath = await downloadCover(result.coverUrl, key, SCREENSHOTS_DIR);
            }
        }

        if (ogPath || faviconPath || screenshotPath) {
            const entry: { favicon?: string; ogImage?: string; screenshot?: string } = {};
            if (faviconPath) entry.favicon = faviconPath;
            if (ogPath) entry.ogImage = ogPath;
            if (screenshotPath) entry.screenshot = screenshotPath;
            manifest.images[key] = { ...manifest.images[key], ...entry };
        }

        console.log(`✓ "${result.title}" [${key}] ${ogPath ? '(cover saved)' : '(no cover)'}`);
        found++;

        // Small delay to be respectful to the API
        await new Promise((r) => setTimeout(r, 300));
    }

    // Save updated manifest
    saveManifest(manifest);

    console.log(`\nDone! Found: ${found}, Skipped: ${skipped}, Not found: ${notFound}`);
    console.log('Manifest updated: src/data/resource-images.json');
}

main().catch(console.error);

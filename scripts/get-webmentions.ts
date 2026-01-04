#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';

/**
 * Fetches webmentions from webmention.io API
 * Uses incremental fetching to avoid rate limits
 */

const OUTPUT_FILE = path.join(process.cwd(), 'src/data/webmentions.json');
const CACHE_DIR = path.join(process.cwd(), '.cache');
const LAST_FETCH_FILE = path.join(CACHE_DIR, 'webmentions-last-fetch.txt');

const WEBMENTION_IO_TOKEN = process.env.WEBMENTION_IO_TOKEN;
const DOMAIN = process.env.PUBLIC_WEBMENTION_IO_DOMAIN || 'www.mfrashad.com';

interface Webmention {
    type: string;
    author: {
        name: string;
        photo?: string;
        url?: string;
    };
    url: string;
    published?: string;
    'wm-received': string;
    'wm-id': number;
    'wm-source': string;
    'wm-target': string;
    content?: {
        html?: string;
        text?: string;
    };
    'mention-of'?: string;
    'wm-property': string;
    'wm-private': boolean;
}

interface WebmentionsCache {
    lastFetched: string;
    mentions: Webmention[];
}

/**
 * Fetch webmentions from API
 */
async function fetchWebmentions(since?: string): Promise<Webmention[]> {
    if (!WEBMENTION_IO_TOKEN) {
        console.log('⚠️  WEBMENTION_IO_TOKEN not set, skipping fetch\n');
        return [];
    }

    const baseUrl = `https://webmention.io/api/mentions.jf2`;
    const params = new URLSearchParams({
        token: WEBMENTION_IO_TOKEN,
        domain: DOMAIN,
        'per-page': '1000'
    });

    if (since) {
        params.append('since', since);
    }

    const url = `${baseUrl}?${params.toString()}`;

    console.log(`📡 Fetching webmentions from webmention.io...`);
    console.log(`   Domain: ${DOMAIN}`);
    if (since) {
        console.log(`   Since: ${since} (incremental update)`);
    } else {
        console.log(`   Fetching all webmentions (initial fetch)`);
    }
    console.log('');

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const mentions = data.children || [];

        console.log(`✅ Fetched ${mentions.length} webmentions\n`);

        return mentions;
    } catch (error) {
        console.error('❌ Error fetching webmentions:', error);
        return [];
    }
}

/**
 * Load existing webmentions cache
 */
function loadCache(): WebmentionsCache {
    if (!fs.existsSync(OUTPUT_FILE)) {
        return {
            lastFetched: '',
            mentions: []
        };
    }

    try {
        const content = fs.readFileSync(OUTPUT_FILE, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        console.log('⚠️  Error reading cache, starting fresh');
        return {
            lastFetched: '',
            mentions: []
        };
    }
}

/**
 * Save webmentions cache
 */
function saveCache(cache: WebmentionsCache) {
    // Ensure directories exist
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    // Write cache file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cache, null, 2), 'utf-8');

    // Write last fetch timestamp
    fs.writeFileSync(LAST_FETCH_FILE, cache.lastFetched, 'utf-8');

    console.log(`✅ Webmentions saved to: ${path.relative(process.cwd(), OUTPUT_FILE)}\n`);
}

/**
 * Merge new mentions with existing cache
 */
function mergeMentions(existing: Webmention[], newMentions: Webmention[]): Webmention[] {
    const mentionMap = new Map<number, Webmention>();

    // Add existing mentions
    existing.forEach((mention) => {
        mentionMap.set(mention['wm-id'], mention);
    });

    // Add/overwrite with new mentions
    newMentions.forEach((mention) => {
        mentionMap.set(mention['wm-id'], mention);
    });

    // Convert back to array and sort by received date
    return Array.from(mentionMap.values()).sort((a, b) => {
        return new Date(b['wm-received']).getTime() - new Date(a['wm-received']).getTime();
    });
}

/**
 * Filter out spam/low-quality mentions
 */
function filterMentions(mentions: Webmention[]): Webmention[] {
    return mentions.filter((mention) => {
        // Filter out private mentions
        if (mention['wm-private']) return false;

        // Filter out mentions without author name
        if (!mention.author?.name) return false;

        // Add more spam filters as needed
        // e.g., check for suspicious URLs, content patterns, etc.

        return true;
    });
}

async function getWebmentions() {
    console.log('💬 Fetching webmentions...\n');

    // Load existing cache
    const cache = loadCache();
    console.log(`📦 Loaded cache: ${cache.mentions.length} existing mentions\n`);

    // Fetch new mentions (incremental if we have a last fetch time)
    const since = cache.lastFetched || undefined;
    const newMentions = await fetchWebmentions(since);

    // Merge with existing
    const allMentions = mergeMentions(cache.mentions, newMentions);

    // Filter spam
    const filteredMentions = filterMentions(allMentions);
    const spamCount = allMentions.length - filteredMentions.length;

    if (spamCount > 0) {
        console.log(`🗑️  Filtered out ${spamCount} spam/private mentions\n`);
    }

    // Update cache
    const updatedCache: WebmentionsCache = {
        lastFetched: new Date().toISOString(),
        mentions: filteredMentions
    };

    // Save cache
    saveCache(updatedCache);

    console.log('─'.repeat(50));
    console.log(`\n📊 Summary:`);
    console.log(`   Total webmentions: ${filteredMentions.length}`);
    console.log(`   New this fetch: ${newMentions.length}`);
    console.log(`   Filtered: ${spamCount}`);
    console.log(`   Last updated: ${updatedCache.lastFetched}\n`);

    // Show breakdown by type
    const typeCount = new Map<string, number>();
    filteredMentions.forEach((mention) => {
        const type = mention['wm-property'] || 'unknown';
        typeCount.set(type, (typeCount.get(type) || 0) + 1);
    });

    if (typeCount.size > 0) {
        console.log('📈 By type:');
        Array.from(typeCount.entries())
            .sort((a, b) => b[1] - a[1])
            .forEach(([type, count]) => {
                console.log(`   ${type}: ${count}`);
            });
        console.log('');
    }
}

// Run fetcher
getWebmentions().catch((error) => {
    console.error('Fatal error fetching webmentions:', error);
    process.exit(1);
});

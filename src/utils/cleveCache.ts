import { fetchCleveWritings, type CleveWriting } from '../api/cleve';
import { withCache } from './cache';
import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'src/data/cleve-cache.json');
const CACHE_TTL = 60; // 60 seconds in-memory cache

export interface CachedCleveData {
    updated_at: string;
    count: number;
    writings: CleveWriting[];
}

/**
 * Fetches fresh Cleve writings and saves them to cache
 */
export async function fetchAndCacheCleveWritings(): Promise<CachedCleveData> {
    console.log('Fetching fresh Cleve writings...');
    const writings = await fetchCleveWritings();

    const data: CachedCleveData = {
        updated_at: new Date().toISOString(),
        count: writings.length,
        writings
    };

    // Ensure directory exists
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Save to cache
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
    console.log(`Cleve writings cached successfully! (${data.count} writings)`);

    return data;
}

/**
 * Gets Cleve writings from cache if available, otherwise fetches fresh data
 * Uses in-memory cache (60s TTL) for fast access, with file cache as fallback
 */
export async function getCleveWritings(): Promise<CachedCleveData> {
    return withCache('cleve-writings', async () => {
        // Try file cache first
        if (fs.existsSync(CACHE_FILE)) {
            console.log('Using file-cached Cleve writings');
            const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
            return cached;
        }

        // No file cache, fetch fresh data
        console.log('No file cache found, fetching fresh Cleve writings...');
        return fetchAndCacheCleveWritings();
    }, CACHE_TTL);
}

/**
 * Clears the Cleve writings cache
 */
export function clearCleveCache() {
    if (fs.existsSync(CACHE_FILE)) {
        fs.unlinkSync(CACHE_FILE);
        console.log('Cleve writings cache cleared');
    }
}

import { fetchCleveWritings, type CleveWriting } from '../api/cleve';
import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'src/data/cleve-cache.json');

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
 */
export async function getCleveWritings(): Promise<CachedCleveData> {
    // Check if cache exists
    if (fs.existsSync(CACHE_FILE)) {
        console.log('Using cached Cleve writings');
        const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
        return cached;
    }

    // No cache, fetch fresh data
    console.log('No cache found, fetching fresh Cleve writings...');
    return fetchAndCacheCleveWritings();
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

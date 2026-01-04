import { scrapeLetterboxdFilms, type LetterboxdData } from './letterboxd';
import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'src/data/letterboxd-cache.json');

/**
 * Fetches fresh Letterboxd data and saves it to cache
 */
export async function fetchAndCacheLetterboxdData(username: string, maxPages: number = 5): Promise<LetterboxdData> {
    console.log('Fetching fresh Letterboxd data...');
    const data = await scrapeLetterboxdFilms(username, maxPages);

    // Ensure directory exists
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Save to cache
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
    console.log(`Letterboxd data cached successfully! (${data.films.length} films)`);

    return data;
}

/**
 * Gets Letterboxd data from cache if available, otherwise fetches fresh data
 */
export async function getLetterboxdData(username: string, maxPages: number = 5): Promise<LetterboxdData> {
    // Check if cache exists
    if (fs.existsSync(CACHE_FILE)) {
        console.log('Using cached Letterboxd data');
        const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
        return cached;
    }

    // No cache, fetch fresh data
    console.log('No cache found, fetching fresh data...');
    return fetchAndCacheLetterboxdData(username, maxPages);
}

/**
 * Clears the Letterboxd cache
 */
export function clearLetterboxdCache() {
    if (fs.existsSync(CACHE_FILE)) {
        fs.unlinkSync(CACHE_FILE);
        console.log('Letterboxd cache cleared');
    }
}

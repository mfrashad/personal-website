import { scrapeLetterboxdFilms, type LetterboxdData } from './letterboxd';
import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'src/data/letterboxd-cache.json');

// Check if running in a serverless/read-only environment
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

/**
 * Fetches fresh Letterboxd data and saves it to cache
 * Only writes to cache in local development
 */
export async function fetchAndCacheLetterboxdData(username: string, maxPages: number = 5): Promise<LetterboxdData> {
    console.log('Fetching fresh Letterboxd data...');
    const data = await scrapeLetterboxdFilms(username, maxPages);

    // Only write to cache in local development (not serverless)
    if (!isServerless) {
        try {
            // Ensure directory exists
            const dir = path.dirname(CACHE_FILE);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // Save to cache
            fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
            console.log(`Letterboxd data cached successfully! (${data.films.length} films)`);
        } catch (error) {
            console.warn('Could not write cache file:', error);
        }
    }

    return data;
}

/**
 * Gets Letterboxd data from cache if available, otherwise fetches fresh data
 */
export async function getLetterboxdData(username: string, maxPages: number = 5): Promise<LetterboxdData> {
    // Check if cache exists
    try {
        if (fs.existsSync(CACHE_FILE)) {
            console.log('Using cached Letterboxd data');
            const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
            return cached;
        }
    } catch (error) {
        console.warn('Could not read cache file:', error);
    }

    // In serverless without cache, return empty data
    // (cache should be pre-populated during build via npm run fetch:movies)
    if (isServerless) {
        console.log('No cache available in serverless environment');
        return {
            updated_at: new Date().toISOString(),
            count: 0,
            films: []
        };
    }

    // No cache in local dev, fetch fresh data
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

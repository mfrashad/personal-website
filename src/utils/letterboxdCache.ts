import { scrapeLetterboxdFilms, type LetterboxdData } from './letterboxd';
import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'src/data/letterboxd-cache.json');

// Only skip cache writes in the serverless runtime (not build step).
// Vercel sets VERCEL=1 during both build and runtime, but during runtime
// the filesystem is read-only. AWS_LAMBDA_FUNCTION_NAME is runtime-only.
const isServerlessRuntime = !!process.env.AWS_LAMBDA_FUNCTION_NAME;

/**
 * Fetches fresh Letterboxd data and saves it to cache
 * Writes cache locally and during Vercel build; skips at serverless runtime.
 */
export async function fetchAndCacheLetterboxdData(username: string, maxPages: number = 5): Promise<LetterboxdData> {
    console.log('Fetching fresh Letterboxd data...');
    const freshData = await scrapeLetterboxdFilms(username, maxPages);

    if (!isServerlessRuntime) {
        try {
            // Ensure directory exists
            const dir = path.dirname(CACHE_FILE);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // Merge with existing cache to preserve older films
            let existingFilms: LetterboxdFilm[] = [];
            if (fs.existsSync(CACHE_FILE)) {
                try {
                    const cached: LetterboxdData = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
                    existingFilms = cached.films || [];
                    console.log(`Existing cache has ${existingFilms.length} films`);
                } catch {
                    console.warn('Could not parse existing cache, starting fresh');
                }
            }

            // Use fresh films as primary, add older films that aren't duplicates
            const freshKeys = new Set(freshData.films.map(f => `${f.title}::${f.watched_on}`));
            const mergedFilms = [
                ...freshData.films,
                ...existingFilms.filter(f => !freshKeys.has(`${f.title}::${f.watched_on}`))
            ];

            const mergedData: LetterboxdData = {
                updated_at: new Date().toISOString(),
                count: mergedFilms.length,
                films: mergedFilms,
            };

            // Save merged data to cache
            fs.writeFileSync(CACHE_FILE, JSON.stringify(mergedData, null, 2));
            console.log(`Letterboxd data cached successfully! (${mergedFilms.length} films total, ${freshData.films.length} from RSS, ${mergedFilms.length - freshData.films.length} preserved from cache)`);

            return mergedData;
        } catch (error) {
            console.warn('Could not write cache file:', error);
        }
    }

    return freshData;
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

    // In serverless runtime without cache, return empty data
    // (cache should be pre-populated during build via npm run fetch:movies)
    if (isServerlessRuntime) {
        console.log('No cache available in serverless runtime');
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

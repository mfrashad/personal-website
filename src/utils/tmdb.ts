const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Get API key from environment (support both Node.js and Astro)
function getTMDBApiKey(): string | undefined {
    // Try process.env first (Node.js/scripts)
    if (typeof process !== 'undefined' && process.env?.TMDB_API_KEY) {
        return process.env.TMDB_API_KEY;
    }
    // Try import.meta.env (Astro)
    if (typeof import.meta !== 'undefined' && (import.meta as any).env?.TMDB_API_KEY) {
        return (import.meta as any).env.TMDB_API_KEY;
    }
    return undefined;
}

export interface TMDBMovie {
    id: number;
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
    release_date: string;
    vote_average: number;
}

/**
 * Search for a movie on TMDB by title
 */
export async function searchMovie(title: string, year?: number): Promise<TMDBMovie | null> {
    const apiKey = getTMDBApiKey();

    if (!apiKey) {
        console.warn('TMDB_API_KEY not set');
        return null;
    }

    try {
        const params = new URLSearchParams({
            api_key: apiKey,
            query: title,
            include_adult: 'false'
        });

        if (year) {
            params.append('year', year.toString());
        }

        const response = await fetch(`${TMDB_BASE_URL}/search/movie?${params}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            return data.results[0];
        }

        return null;
    } catch (error) {
        console.error(`Failed to search TMDB for "${title}":`, error);
        return null;
    }
}

/**
 * Get poster URL for a movie
 * @param posterPath - The poster_path from TMDB
 * @param size - w92, w154, w185, w342, w500, w780, original
 */
export function getPosterUrl(posterPath: string | null, size: string = 'w500'): string | null {
    if (!posterPath) return null;
    return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
}

/**
 * Get backdrop URL for a movie
 * @param backdropPath - The backdrop_path from TMDB
 * @param size - w300, w780, w1280, original
 */
export function getBackdropUrl(backdropPath: string | null, size: string = 'w1280'): string | null {
    if (!backdropPath) return null;
    return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`;
}

/**
 * Extract year from movie title (handles formats like "Movie Title (2023)")
 */
export function extractYearFromTitle(title: string): { cleanTitle: string; year: number | undefined } {
    const yearMatch = title.match(/\((\d{4})\)/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : undefined;
    const cleanTitle = title.replace(/\s*\(\d{4}\)\s*$/, '').trim();
    return { cleanTitle, year };
}

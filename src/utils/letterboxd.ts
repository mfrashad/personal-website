import { parse } from 'node-html-parser';
import { searchMovie, getPosterUrl, extractYearFromTitle } from './tmdb';

export interface LetterboxdFilm {
    watched_on: string;
    title: string;
    rating: number;
    rewatched: boolean;
    permalink: string;
    liked: boolean;
    posterUrl?: string;
}

export interface LetterboxdData {
    updated_at: string;
    count: number;
    films: LetterboxdFilm[];
}

const LETTERBOXD_BASE_URL = 'https://letterboxd.com';

async function fetchPage(pageNumber: number, username: string): Promise<any> {
    const url = `${LETTERBOXD_BASE_URL}/${username}/films/diary/page/${pageNumber}`;
    const response = await fetch(url);
    const text = await response.text();
    return parse(text);
}

async function getTotalPages(root: any): Promise<number> {
    const pagination = root.querySelector('.paginate-pages');
    if (!pagination) return 1;

    const pageLinks = pagination.querySelectorAll('li a');
    if (pageLinks.length === 0) return 1;

    const lastPageLink = pageLinks[pageLinks.length - 1];
    return lastPageLink ? parseInt(lastPageLink.text.trim(), 10) : 1;
}

async function fetchFilmsPage(pageNumber: number, username: string): Promise<any> {
    const url = `${LETTERBOXD_BASE_URL}/${username}/films/page/${pageNumber}`;
    const response = await fetch(url);
    const text = await response.text();
    return parse(text);
}

async function scrapeFilmsList(username: string, maxPages: number = 10): Promise<Map<string, LetterboxdFilm>> {
    console.log(`Scraping films list for user: ${username}`);

    const root = await fetchFilmsPage(1, username);
    const totalPages = Math.min(await getTotalPages(root), maxPages);
    const filmsMap = new Map<string, LetterboxdFilm>();

    for (let i = 1; i <= totalPages; i++) {
        console.log(`Scraping films list page ${i}...`);
        const pageRoot = await fetchFilmsPage(i, username);
        const filmPosters = pageRoot.querySelectorAll('li.griditem');

        console.log(`Found ${filmPosters.length} films on page ${i}`);

        for (const gridItem of filmPosters) {
            // Find the react-component div with film data
            const reactComponent = gridItem.querySelector('.react-component[data-film-id]');
            if (!reactComponent) continue;

            const filmSlug = reactComponent.getAttribute('data-item-slug');
            const filmId = reactComponent.getAttribute('data-film-id');
            const filmName = reactComponent.getAttribute('data-item-name');
            const itemLink = reactComponent.getAttribute('data-item-link');

            if (!filmSlug || !filmId || !filmName || !itemLink) continue;

            // Get rating from the viewingdata section
            const viewingData = gridItem.querySelector('.poster-viewingdata');
            let rating = 0;
            if (viewingData) {
                const ratingSpan = viewingData.querySelector('.rating');
                if (ratingSpan) {
                    const ratingClass = ratingSpan.getAttribute('class') || ratingSpan.className || '';
                    const match = ratingClass.match(/rated-(\d+)/);
                    if (match) {
                        rating = parseInt(match[1], 10) / 2; // Convert from 0-10 to 0-5
                    }
                }
            }

            // Check if liked
            const liked = !!gridItem.querySelector('.like.liked-micro.icon-liked, .like.liked');

            // Construct permalink (item-link already includes /film/slug/)
            const permalink = itemLink.startsWith('/') ? itemLink.slice(1) : itemLink;

            // Get poster from TMDB
            let posterUrl: string | undefined;
            const { cleanTitle, year } = extractYearFromTitle(filmName);

            try {
                const tmdbMovie = await searchMovie(cleanTitle, year);
                if (tmdbMovie && tmdbMovie.poster_path) {
                    posterUrl = getPosterUrl(tmdbMovie.poster_path, 'w500') || undefined;
                }
            } catch (error) {
                console.error(`Failed to fetch TMDB poster for "${filmName}":`, error);
            }

            // Fallback to Letterboxd poster if TMDB fails
            if (!posterUrl) {
                const posterUrlPath = reactComponent.getAttribute('data-poster-url');
                if (posterUrlPath) {
                    posterUrl = `https://letterboxd.com${posterUrlPath}`;
                }
            }

            // Use a placeholder date for films without diary entries
            const film: LetterboxdFilm = {
                title: filmName,
                permalink,
                watched_on: '', // No date from films list
                rating,
                rewatched: false,
                liked,
                posterUrl
            };

            filmsMap.set(permalink, film);
        }

        // Add delay
        if (i < totalPages) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    return filmsMap;
}

export async function scrapeLetterboxdFilms(
    username: string,
    maxPages: number = 10
): Promise<LetterboxdData> {
    console.log(`Starting to scrape Letterboxd data for user: ${username}`);

    // First, get all films from the films list (no dates)
    const filmsMap = await scrapeFilmsList(username, maxPages);

    // Then, get diary entries (with dates) and update/add to the map
    const root = await fetchPage(1, username);
    const totalPages = Math.min(await getTotalPages(root), maxPages);
    const films: any[] = [];

    // Scrape diary entries (if any)
    console.log(`Scraping diary entries...`);
    for (let i = 1; i <= totalPages; i++) {
        console.log(`Scraping diary page ${i}...`);

        const pageRoot = await fetchPage(i, username);
        const filmEntries = pageRoot.querySelectorAll('.diary-entry-row');

        console.log(`Found ${filmEntries.length} diary entries on page ${i}`);

        for (const entry of filmEntries) {
            const titleEl = entry.querySelector('.inline-production-masthead h2 a');
            const title = titleEl.innerHTML;
            const permalinkWithProfile = titleEl.getAttribute('href');
            let permalink = permalinkWithProfile.split('/').slice(2).join('/');
            // Remove trailing number (e.g., /1/, /2/) for rewatches
            permalink = permalink.replace(/\/\d+\/$/, '/');
            const dateLink = entry.querySelector('.daydate')?.getAttribute('href');
            const dateParts = dateLink.split('/').filter(Boolean);
            const date = dateParts.slice(-3).join('-');
            const rewatched = !entry.querySelector('.col-rewatch.icon-status-off');
            const liked = !!entry.querySelector('.col-like .icon-liked');

            // Get rating from the hidden input field that contains the actual value
            const ratingInput = entry.querySelector('.col-rating input.rateit-field');

            let rating = 0;
            if (ratingInput) {
                const ratingValue = ratingInput.getAttribute('value');
                if (ratingValue) {
                    rating = parseInt(ratingValue, 10) / 2; // Convert from 0-10 to 0-5 scale
                }
            }

            // Extract poster URL by constructing it from film ID and slug with fallbacks
            let posterUrl: string | undefined;
            const reactComponent = entry.querySelector('.react-component.figure');
            if (reactComponent) {
                const filmId = reactComponent.getAttribute('data-film-id');
                const filmSlug = reactComponent.getAttribute('data-item-slug');
                const itemName = reactComponent.getAttribute('data-item-name');

                if (filmId && filmSlug) {
                    // Convert film ID to path by splitting digits with slashes
                    const idPath = filmId.split('').join('/');

                    // Create multiple slug candidates
                    const slugCandidates = [
                        filmSlug, // Full slug (e.g., "perfect-days-2023")
                        filmSlug.replace(/-\d{4}$/, '') // Remove year suffix (e.g., "perfect-days")
                    ];

                    // If we have item name, also try converting it to a slug
                    if (itemName) {
                        const nameSlug = itemName
                            .toLowerCase()
                            .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
                            .replace(/\s+/g, '-') // Replace spaces with hyphens
                            .replace(/-+/g, '-'); // Remove multiple hyphens
                        slugCandidates.push(nameSlug);
                    }

                    // Size candidates (width x height)
                    const sizeCandidates = [
                        '0-300-0-450', // Preferred large size
                        '0-230-0-345', // Medium size
                        '0-150-0-225' // Smaller fallback
                    ];

                    // Try different combinations and validate URLs
                    outerLoop: for (const slug of slugCandidates) {
                        for (const size of sizeCandidates) {
                            const candidateUrl = `https://a.ltrbxd.com/resized/film-poster/${idPath}/${filmId}-${slug}-${size}-crop.jpg`;

                            try {
                                // Quick HEAD request to check if the image exists
                                const response = await fetch(candidateUrl, { method: 'HEAD' });
                                if (response.ok) {
                                    posterUrl = candidateUrl;
                                    break outerLoop;
                                }
                            } catch (error) {
                                // Continue to next candidate if this one fails
                                continue;
                            }
                        }
                    }

                    if (!posterUrl) {
                        console.log(
                            `✗ No working poster found for film ID ${filmId}, slug: ${filmSlug}`
                        );
                    }
                }
            }

            // Update the film in the map with diary data (overrides films list data)
            filmsMap.set(permalink, {
                title,
                permalink,
                watched_on: date,
                rating,
                rewatched,
                liked,
                posterUrl
            });
        }

        // Add a small delay to be respectful to Letterboxd servers
        if (i < totalPages) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    // Convert map to array
    const allFilms = Array.from(filmsMap.values());

    console.log(`Total films: ${allFilms.length} (${allFilms.filter(f => f.watched_on).length} with dates, ${allFilms.filter(f => !f.watched_on).length} without dates)`);

    return {
        updated_at: new Date().toISOString(),
        count: allFilms.length,
        films: allFilms
    };
}

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

/**
 * Fetch a Letterboxd page using Puppeteer stealth to bypass Cloudflare.
 */
async function fetchPageWithStealth(url: string, browser: any): Promise<string> {
    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        return await page.content();
    } finally {
        await page.close();
    }
}

function getTotalPages(root: any): number {
    const pagination = root.querySelector('.paginate-pages');
    if (!pagination) return 1;

    const pageLinks = pagination.querySelectorAll('li a');
    if (pageLinks.length === 0) return 1;

    const lastPageLink = pageLinks[pageLinks.length - 1];
    return lastPageLink ? parseInt(lastPageLink.text.trim(), 10) : 1;
}

/**
 * Scrape films from the /films/ list pages (no dates, but has all films).
 */
async function scrapeFilmsList(
    username: string,
    browser: any,
    maxPages: number = 50
): Promise<Map<string, LetterboxdFilm>> {
    console.log(`Scraping films list for user: ${username}`);

    const html = await fetchPageWithStealth(
        `${LETTERBOXD_BASE_URL}/${username}/films/page/1`,
        browser
    );
    const root = parse(html);
    const totalPages = Math.min(getTotalPages(root), maxPages);
    console.log(`Found ${totalPages} pages of films`);

    const filmsMap = new Map<string, LetterboxdFilm>();

    async function processPage(pageRoot: any) {
        const filmPosters = pageRoot.querySelectorAll('li.griditem');

        for (const gridItem of filmPosters) {
            const reactComponent = gridItem.querySelector('.react-component[data-film-id]');
            if (!reactComponent) continue;

            const filmSlug = reactComponent.getAttribute('data-item-slug');
            const filmId = reactComponent.getAttribute('data-film-id');
            const filmName = reactComponent.getAttribute('data-item-name');
            const itemLink = reactComponent.getAttribute('data-item-link');

            if (!filmSlug || !filmId || !filmName || !itemLink) continue;

            // Get rating
            const viewingData = gridItem.querySelector('.poster-viewingdata');
            let rating = 0;
            if (viewingData) {
                const ratingSpan = viewingData.querySelector('.rating');
                if (ratingSpan) {
                    const ratingClass = ratingSpan.getAttribute('class') || '';
                    const match = ratingClass.match(/rated-(\d+)/);
                    if (match) {
                        rating = parseInt(match[1], 10) / 2;
                    }
                }
            }

            const liked = !!gridItem.querySelector('.like.liked-micro.icon-liked, .like.liked');
            const permalink = itemLink.startsWith('/') ? itemLink.slice(1) : itemLink;

            // Get poster from TMDB
            let posterUrl: string | undefined;
            const { cleanTitle, year } = extractYearFromTitle(filmName);
            try {
                const tmdbMovie = await searchMovie(cleanTitle, year);
                if (tmdbMovie?.poster_path) {
                    posterUrl = getPosterUrl(tmdbMovie.poster_path, 'w500') || undefined;
                }
            } catch (error) {
                console.error(`Failed to fetch TMDB poster for "${filmName}":`, error);
            }

            // Fallback to Letterboxd poster
            if (!posterUrl) {
                const idPath = filmId.split('').join('/');
                const sizeCandidates = ['0-300-0-450', '0-230-0-345', '0-150-0-225'];
                const slugCandidates = [filmSlug, filmSlug.replace(/-\d{4}$/, '')];
                for (const slug of slugCandidates) {
                    for (const size of sizeCandidates) {
                        const candidateUrl = `https://a.ltrbxd.com/resized/film-poster/${idPath}/${filmId}-${slug}-${size}-crop.jpg`;
                        try {
                            const res = await fetch(candidateUrl, { method: 'HEAD' });
                            if (res.ok) {
                                posterUrl = candidateUrl;
                                break;
                            }
                        } catch { continue; }
                    }
                    if (posterUrl) break;
                }
            }

            filmsMap.set(permalink, {
                title: filmName,
                permalink,
                watched_on: '',
                rating,
                rewatched: false,
                liked,
                posterUrl
            });
        }
    }

    // Process first page we already fetched
    await processPage(root);

    // Process remaining pages
    for (let i = 2; i <= totalPages; i++) {
        console.log(`Scraping films page ${i}/${totalPages}...`);
        const pageHtml = await fetchPageWithStealth(
            `${LETTERBOXD_BASE_URL}/${username}/films/page/${i}`,
            browser
        );
        await processPage(parse(pageHtml));
        // Be respectful
        await new Promise(r => setTimeout(r, 1000));
    }

    return filmsMap;
}

/**
 * Scrape diary entries (has dates, ratings, rewatch info).
 */
async function scrapeDiaryEntries(
    username: string,
    browser: any,
    filmsMap: Map<string, LetterboxdFilm>,
    maxPages: number = 50
): Promise<void> {
    console.log('Scraping diary entries...');

    const html = await fetchPageWithStealth(
        `${LETTERBOXD_BASE_URL}/${username}/films/diary/page/1`,
        browser
    );
    const root = parse(html);
    const totalPages = Math.min(getTotalPages(root), maxPages);
    console.log(`Found ${totalPages} diary pages`);

    async function processDiaryPage(pageRoot: any) {
        const entries = pageRoot.querySelectorAll('.diary-entry-row');

        for (const entry of entries) {
            const titleEl = entry.querySelector('.inline-production-masthead h2 a');
            if (!titleEl) continue;

            const title = titleEl.innerHTML;
            const permalinkWithProfile = titleEl.getAttribute('href');
            let permalink = permalinkWithProfile.split('/').slice(2).join('/');
            permalink = permalink.replace(/\/\d+\/$/, '/');

            const dateLink = entry.querySelector('.daydate')?.getAttribute('href');
            const dateParts = dateLink?.split('/').filter(Boolean) || [];
            const date = dateParts.slice(-3).join('-');

            const rewatched = !entry.querySelector('.col-rewatch.icon-status-off');
            const liked = !!entry.querySelector('.col-like .icon-liked');

            let rating = 0;
            const ratingInput = entry.querySelector('.col-rating input.rateit-field');
            if (ratingInput) {
                const ratingValue = ratingInput.getAttribute('value');
                if (ratingValue) {
                    rating = parseInt(ratingValue, 10) / 2;
                }
            }

            // Get existing film data (may have poster from films list scrape)
            const existing = filmsMap.get(permalink);

            filmsMap.set(permalink, {
                title,
                permalink,
                watched_on: date,
                rating,
                rewatched,
                liked,
                posterUrl: existing?.posterUrl
            });
        }
    }

    await processDiaryPage(root);

    for (let i = 2; i <= totalPages; i++) {
        console.log(`Scraping diary page ${i}/${totalPages}...`);
        const pageHtml = await fetchPageWithStealth(
            `${LETTERBOXD_BASE_URL}/${username}/films/diary/page/${i}`,
            browser
        );
        await processDiaryPage(parse(pageHtml));
        await new Promise(r => setTimeout(r, 1000));
    }
}

/**
 * Main scraper: uses Puppeteer stealth to scrape all films + diary entries.
 */
export async function scrapeLetterboxdFilms(
    username: string,
    maxPages: number = 50
): Promise<LetterboxdData> {
    console.log(`Starting to scrape Letterboxd data for user: ${username}`);

    // Dynamic import puppeteer-extra (ESM/CJS compat)
    const puppeteer = (await import('puppeteer-extra')).default;
    const StealthPlugin = (await import('puppeteer-extra-plugin-stealth')).default;
    puppeteer.use(StealthPlugin());

    const browser = await puppeteer.launch({ headless: true });

    try {
        // Scrape films list (all films, no dates)
        const filmsMap = await scrapeFilmsList(username, browser, maxPages);
        console.log(`Films list: ${filmsMap.size} films`);

        // Scrape diary (adds dates to films)
        await scrapeDiaryEntries(username, browser, filmsMap, maxPages);

        const allFilms = Array.from(filmsMap.values());
        const withDates = allFilms.filter(f => f.watched_on).length;
        console.log(`Total: ${allFilms.length} films (${withDates} with dates, ${allFilms.length - withDates} without)`);

        return {
            updated_at: new Date().toISOString(),
            count: allFilms.length,
            films: allFilms
        };
    } finally {
        await browser.close();
    }
}

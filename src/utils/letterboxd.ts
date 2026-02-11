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
 * Extract text content of an XML tag from raw XML string.
 */
function getTagContent(xml: string, tag: string): string {
    const regex = new RegExp(`<${tag}>([^<]*)</${tag}>`);
    const match = xml.match(regex);
    return match ? match[1].trim() : '';
}

/**
 * Fetches and parses the Letterboxd RSS feed for a user.
 * Uses the RSS feed instead of HTML scraping to avoid Cloudflare blocking.
 */
export async function scrapeLetterboxdFilms(
    username: string,
    _maxPages: number = 10
): Promise<LetterboxdData> {
    console.log(`Fetching Letterboxd RSS feed for user: ${username}`);

    const rssUrl = `${LETTERBOXD_BASE_URL}/${username}/rss/`;
    const response = await fetch(rssUrl);

    if (!response.ok) {
        throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`);
    }

    const xml = await response.text();

    // Split XML into individual <item> blocks
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const items: string[] = [];
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
        items.push(match[1]);
    }

    console.log(`Found ${items.length} entries in RSS feed`);

    const films: LetterboxdFilm[] = [];

    for (const itemXml of items) {
        const filmTitle = getTagContent(itemXml, 'letterboxd:filmTitle');
        const watchedDate = getTagContent(itemXml, 'letterboxd:watchedDate');
        const memberRating = getTagContent(itemXml, 'letterboxd:memberRating');
        const rewatch = getTagContent(itemXml, 'letterboxd:rewatch');
        const memberLike = getTagContent(itemXml, 'letterboxd:memberLike');
        const link = getTagContent(itemXml, 'link');

        // Extract poster URL from the description CDATA
        let posterUrl: string | undefined;
        const imgMatch = itemXml.match(/src="(https:\/\/a\.ltrbxd\.com[^"]+)"/);
        if (imgMatch) {
            posterUrl = imgMatch[1];
        }

        // Build permalink from the link URL
        // e.g., https://letterboxd.com/mfrashad/film/pompo-the-cinephile/ -> film/pompo-the-cinephile/
        let permalink = '';
        try {
            const url = new URL(link);
            const pathParts = url.pathname.split('/').filter(Boolean);
            // Remove username prefix, keep "film/slug/"
            if (pathParts.length >= 2) {
                permalink = pathParts.slice(1).join('/') + '/';
            }
        } catch {
            permalink = link;
        }

        const rating = memberRating ? parseFloat(memberRating) : 0;

        const film: LetterboxdFilm = {
            title: filmTitle || 'Unknown',
            permalink,
            watched_on: watchedDate || '',
            rating,
            rewatched: rewatch === 'Yes',
            liked: memberLike === 'Yes',
            posterUrl
        };

        films.push(film);
    }

    console.log(`Total films: ${films.length}`);

    return {
        updated_at: new Date().toISOString(),
        count: films.length,
        films
    };
}

import type { Bookmark } from '@components/bookmarks/BookmarkItem.astro';
import { withCache } from '@utils/cache';

const PER_PAGE = 10;
const RAINDROP_COLLECTION = 0;

/**
 * Internal function that does the actual fetching (without cache)
 */
const fetchBookmarksInternal = async (page: number = 0): Promise<Bookmark[]> => {
    const bookmarks: Bookmark[] = [];

    try {
        // Fetch all bookmarks (remove heart emoji search filter)
        // To show only favorited bookmarks, add &important=true to the URL
        const req = await fetch(
            `https://api.raindrop.io/rest/v1/raindrops/${RAINDROP_COLLECTION}?perpage=${PER_PAGE}&page=${page}`,
            {
                headers: {
                    Authorization: `Bearer ${import.meta.env.RAINDROP_TOKEN}`
                }
            }
        );

        // Check if the request was successful
        if (!req.ok) {
            const errorText = await req.text();
            console.error(`Failed to fetch bookmarks: ${req.status} ${req.statusText}`);
            console.error(`Response: ${errorText}`);
            console.error('Check your RAINDROP_TOKEN in .env file');
            // Return an empty array to stop the recursion
            return bookmarks;
        }

        const data = await req.json();

    if (data.items) {
        bookmarks.push(
            ...data.items.map(({ cover, title, link, tags, created, type }: Bookmark) => ({
                link,
                title,
                cover,
                tags,
                created,
                type
            }))
        );
    }

    // Base case: Stop recursion if there are no more items to fetch
    if (data.items?.length < PER_PAGE) {
        bookmarks.sort((a, b) => {
            const dateA = new Date(a.created).getTime();
            const dateB = new Date(b.created).getTime();
            return dateB - dateA;
        });

        return bookmarks;
    }

    // Recursive case: Fetch the next page of items
    const nextPageBookmarks = await fetchBookmarksInternal(page + 1);
    bookmarks.push(...nextPageBookmarks);

    bookmarks.sort((a, b) => {
        const dateA = new Date(a.created).getTime();
        const dateB = new Date(b.created).getTime();
        return dateB - dateA;
    });

    return bookmarks;
    } catch (error) {
        console.error('Error fetching bookmarks from Raindrop:', error);
        return [];
    }
};

/**
 * Fetch bookmarks with caching (60 second TTL)
 * This is the public API - use this instead of fetchBookmarksInternal
 */
export const fetchBookmarks = async (page: number = 0): Promise<Bookmark[]> => {
    return withCache(
        `raindrop-bookmarks-${page}`,
        () => fetchBookmarksInternal(page),
        60 // Cache for 60 seconds
    );
};

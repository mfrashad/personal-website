export interface HardcoverBook {
    id: string;
    title: string;
    slug: string;
    pages: number;
    description?: string | null;
    cached_tags?: any;
    cached_contributors?: any[];
    contributions?: {
        author: {
            name: string;
        };
    }[];
}

/**
 * Hardcover's `cached_tags` field can come back in several shapes
 * (string[], { tag: string }[], { name: string }[], or an object keyed by category).
 * Normalize to a flat string[] of unique tag names.
 */
const normalizeTags = (raw: any): string[] => {
    if (!raw) return [];
    const collect = (arr: any[]): string[] =>
        arr
            .map((t) => {
                if (typeof t === 'string') return t;
                if (t && typeof t === 'object') return t.tag || t.name || '';
                return '';
            })
            .filter(Boolean);

    let tags: string[] = [];
    if (Array.isArray(raw)) {
        tags = collect(raw);
    } else if (typeof raw === 'object') {
        // e.g. { Genre: [...], Tag: [...] } — prefer Genre if present
        const preferred = raw.Genre || raw.genres;
        if (Array.isArray(preferred)) {
            tags = collect(preferred);
        } else {
            tags = Object.values(raw)
                .filter(Array.isArray)
                .flatMap((arr) => collect(arr as any[]));
        }
    }
    // dedupe, limit
    return Array.from(new Set(tags)).slice(0, 8);
};

export interface HardcoverUserBook {
    rating: number | null;
    review_raw: string | null;
    reviewed_at: string | null;
    date_added: string;
    book: HardcoverBook;
    user_book_reads: {
        finished_at: string | null;
        edition: {
            image: {
                url: string;
            } | null;
            cached_contributors: any[];
        } | null;
    }[];
}

/**
 * Fetches all books marked as "read" (status_id: 3) from Hardcover
 * Groups them by year based on date_added or reviewed_at
 */
export const getReadBooks = async () => {
    try {
        const response = await fetch('https://api.hardcover.app/v1/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.HARDCOVER_API_KEY}`
            },
            body: JSON.stringify({
                query: `
                    query {
                        me {
                            user_books(
                                where: { status_id: { _eq: 3 } }
                                order_by: [{ date_added: desc }]
                            ) {
                                rating
                                review_raw
                                reviewed_at
                                date_added
                                book {
                                    id
                                    title
                                    slug
                                    pages
                                    description
                                    cached_tags
                                    cached_contributors
                                    contributions {
                                        author {
                                            name
                                        }
                                    }
                                }
                                user_book_reads {
                                    finished_at
                                    edition {
                                        image {
                                            url
                                        }
                                        cached_contributors
                                    }
                                }
                            }
                        }
                    }
                `
            })
        });

        if (!response.ok) {
            console.error(`Hardcover API error: ${response.status} ${response.statusText}`);
            return [];
        }

        const data = await response.json();

        if (data.errors) {
            console.error('Hardcover API returned errors:', JSON.stringify(data.errors));
            return [];
        }

        if (!data?.data?.me || !Array.isArray(data.data.me) || data.data.me.length === 0) {
            console.error('Failed to fetch books from Hardcover. Check your HARDCOVER_API_KEY');
            console.error('Response data:', JSON.stringify(data));
            return [];
        }

        // Note: Hardcover's API returns `me` as an array with one object
        const userBooks: HardcoverUserBook[] = data.data.me[0]?.user_books || [];

        // Group books by year
        const booksByYear = new Map<string, any[]>();

        userBooks.forEach((userBook) => {
            // Use finished_at first, then reviewed_at, then date_added
            const finishedAt = userBook.user_book_reads?.[0]?.finished_at;
            const dateString = finishedAt || userBook.reviewed_at || userBook.date_added;
            const year = new Date(dateString).getFullYear().toString();

            // Transform to match our existing Book interface
            const transformedBook = {
                id: userBook.book.id,
                title: userBook.book.title,
                slug: `https://hardcover.app/books/${userBook.book.slug}`,
                pageCount: userBook.book.pages || 0,
                cover: userBook.user_book_reads?.[0]?.edition?.image?.url || '',
                description: userBook.book.description || '',
                tags: normalizeTags(userBook.book.cached_tags),
                authors: userBook.book.contributions?.map((c: any) => ({
                    name: c.author.name
                })) || (userBook.book.cached_contributors ?
                    userBook.book.cached_contributors.map((c: any) => ({ name: c })) :
                    [{ name: 'Unknown Author' }]
                ),
                review: userBook.rating || userBook.review_raw ? {
                    id: `${userBook.book.id}-review`,
                    rating: userBook.rating || 0,
                    spoiler: false,
                    text: userBook.review_raw || '',
                    createdAt: userBook.reviewed_at || userBook.date_added,
                    updatedAt: userBook.reviewed_at || userBook.date_added,
                    tags: []
                } : null
            };

            if (!booksByYear.has(year)) {
                booksByYear.set(year, []);
            }

            booksByYear.get(year)!.push(transformedBook);
        });

        // Convert to shelf format (matching Literal.club structure)
        const shelves = Array.from(booksByYear.entries())
            .map(([year, books]) => ({
                title: year,
                books: books
            }))
            .sort((a, b) => b.title.localeCompare(a.title)); // Sort years descending

        return shelves;
    } catch (error) {
        console.error('Error fetching books from Hardcover:', error);
        return [];
    }
};

/**
 * Fetches books marked as "currently reading" (status_id: 2) from Hardcover
 */
export const getCurrentlyReading = async () => {
    try {
        const response = await fetch('https://api.hardcover.app/v1/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.HARDCOVER_API_KEY}`
            },
            body: JSON.stringify({
                query: `
                    query {
                        me {
                            user_books(
                                where: { status_id: { _eq: 2 } }
                                order_by: [{ date_added: desc }]
                            ) {
                                book {
                                    id
                                    title
                                    slug
                                    pages
                                    description
                                    cached_tags
                                    cached_contributors
                                    contributions {
                                        author {
                                            name
                                        }
                                    }
                                }
                                user_book_reads {
                                    started_at
                                    progress
                                    edition {
                                        image {
                                            url
                                        }
                                        cached_contributors
                                    }
                                }
                            }
                        }
                    }
                `
            })
        });

        if (!response.ok) {
            console.error(`Hardcover API error (currently reading): ${response.status} ${response.statusText}`);
            return [];
        }

        const data = await response.json();

        if (data.errors) {
            console.error('Hardcover API returned errors (currently reading):', JSON.stringify(data.errors));
            return [];
        }

        if (!data?.data?.me || !Array.isArray(data.data.me) || data.data.me.length === 0) {
            console.error('Failed to fetch currently reading books from Hardcover');
            console.error('Response data:', JSON.stringify(data));
            return [];
        }

        // Note: Hardcover's API returns `me` as an array with one object
        const userBooks: HardcoverUserBook[] = data.data.me[0]?.user_books || [];

        // Transform to match our existing Book interface
        const transformedBooks = userBooks.map((userBook) => ({
            id: userBook.book.id,
            title: userBook.book.title,
            slug: `https://hardcover.app/books/${userBook.book.slug}`,
            pageCount: userBook.book.pages || 0,
            cover: userBook.user_book_reads?.[0]?.edition?.image?.url || '',
            description: userBook.book.description || '',
            tags: normalizeTags(userBook.book.cached_tags),
            authors: userBook.book.contributions?.map((c: any) => ({
                name: c.author.name
            })) || (userBook.book.cached_contributors ?
                userBook.book.cached_contributors.map((c: any) => ({ name: c })) :
                [{ name: 'Unknown Author' }]
            ),
            currentlyReading: true
        }));

        return transformedBooks;
    } catch (error) {
        console.error('Error fetching currently reading books from Hardcover:', error);
        return [];
    }
};

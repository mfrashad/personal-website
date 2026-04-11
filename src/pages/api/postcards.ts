import type { APIRoute } from 'astro';
import { createPostcard, getPostcards, deletePostcard, updateModeration, initDb } from '@lib/postcards-db';
import { sendPostcardNotification } from '@utils/email';

let dbInitialized = false;
async function ensureDb() {
    if (!dbInitialized) {
        await initDb();
        dbInitialized = true;
    }
}

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
    try {
        await ensureDb();
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
        const offset = (page - 1) * limit;

        const postcards = await getPostcards(offset, limit);
        return new Response(JSON.stringify(postcards), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Failed to fetch postcards:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch postcards' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

export const POST: APIRoute = async ({ request }) => {
    try {
        await ensureDb();
        const data = await request.json();
        const { author, body, drawingDataUrl, cardDrawingDataUrl, country: clientCountry, websiteUrl, email, notecardId, stampX, stampY } = data;

        // Auto-detect country from Vercel geo headers if not provided
        let country = clientCountry;
        if (!country) {
            const countryCode = request.headers.get('x-vercel-ip-country');
            if (countryCode && countryCode !== 'XX') {
                try {
                    const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
                    country = displayNames.of(countryCode) || countryCode;
                } catch {
                    country = countryCode;
                }
            }
        }

        // Validate required fields
        if (!author || typeof author !== 'string' || author.trim().length === 0) {
            return new Response(JSON.stringify({ error: 'Author name is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!body || typeof body !== 'string' || body.trim().length === 0) {
            return new Response(JSON.stringify({ error: 'Message is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!drawingDataUrl || typeof drawingDataUrl !== 'string' || !drawingDataUrl.startsWith('data:image/')) {
            return new Response(JSON.stringify({ error: 'Drawing is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Size check: reject if drawing > 500KB
        if (drawingDataUrl.length > 500_000) {
            return new Response(JSON.stringify({ error: 'Drawing is too large' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Sanitize inputs
        // Validate card drawing if provided
        if (cardDrawingDataUrl && (typeof cardDrawingDataUrl !== 'string' || !cardDrawingDataUrl.startsWith('data:image/') || cardDrawingDataUrl.length > 1_000_000)) {
            return new Response(JSON.stringify({ error: 'Card drawing is too large or invalid' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const postcard = await createPostcard({
            author: author.trim().slice(0, 100),
            body: body.trim().slice(0, 500),
            drawingDataUrl,
            cardDrawingDataUrl: cardDrawingDataUrl || undefined,
            country: country?.trim().slice(0, 100) || undefined,
            websiteUrl: websiteUrl?.trim().slice(0, 200) || undefined,
            email: email?.trim().slice(0, 200) || undefined,
            notecardId: typeof notecardId === 'number' ? notecardId : undefined,
            stampX: typeof stampX === 'number' ? stampX : undefined,
            stampY: typeof stampY === 'number' ? stampY : undefined,
        });

        // Send email notification (non-blocking)
        sendPostcardNotification({
            author: postcard.author,
            body: postcard.body,
            country: postcard.country,
            websiteUrl: postcard.websiteUrl,
            date: new Date(postcard.createdAt),
        }).catch(() => {});

        return new Response(JSON.stringify({ success: true, id: postcard.id }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Failed to create postcard:', error);
        return new Response(JSON.stringify({ error: 'Failed to create postcard' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

export const PATCH: APIRoute = async ({ request }) => {
    // Dev-only: moderate postcards
    if (import.meta.env.PROD) {
        return new Response(JSON.stringify({ error: 'Not allowed in production' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        await ensureDb();
        const data = await request.json();
        const { id, moderation } = data;

        if (!id || typeof id !== 'string') {
            return new Response(JSON.stringify({ error: 'Missing id' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await updateModeration(id, moderation || {});
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Failed to update moderation:', error);
        return new Response(JSON.stringify({ error: 'Failed to update moderation' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

export const DELETE: APIRoute = async ({ url }) => {
    // Only allow in development
    if (import.meta.env.PROD) {
        return new Response(JSON.stringify({ error: 'Not allowed in production' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        await ensureDb();
        const id = url.searchParams.get('id');
        if (!id) {
            return new Response(JSON.stringify({ error: 'Missing id parameter' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await deletePostcard(id);
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Failed to delete postcard:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete postcard' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

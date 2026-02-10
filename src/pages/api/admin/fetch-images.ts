import type { APIRoute } from 'astro';
import { fetchImagesForUrl } from '@lib/fetch-resource-image';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    if (import.meta.env.PROD) {
        return new Response(JSON.stringify({ error: 'Not allowed in production' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { url } = await request.json();

        if (!url) {
            return new Response(JSON.stringify({ error: 'Missing required field: url' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const result = await fetchImagesForUrl(url);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching images:', error);
        return new Response(JSON.stringify({ error: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

import type { APIRoute } from 'astro';

export const prerender = false;

const CLEVE_API_KEY = import.meta.env.CLEVE_API_KEY || process.env.CLEVE_API_KEY;
const CLEVE_API_URL = 'https://hkqfndytgnnwadrfsfvp.supabase.co/functions/v1/preview-public-api/v1/writings';

export const GET: APIRoute = async () => {
    if (!CLEVE_API_KEY) {
        return new Response(JSON.stringify({
            error: 'API key not configured',
            writings: []
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
    }

    try {
        const response = await fetch(
            `${CLEVE_API_URL}?format=markdown&category=notes&per_page=100`,
            {
                headers: {
                    'Authorization': `Bearer ${CLEVE_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            console.error(`Cleve API error: ${response.status} ${response.statusText}`);
            return new Response(JSON.stringify({
                error: `API error: ${response.status}`,
                writings: []
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = await response.json();
        const writings = data.data || [];

        return new Response(JSON.stringify({
            writings,
            fetched_at: new Date().toISOString(),
            count: writings.length
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        });
    } catch (error) {
        console.error('Error fetching Cleve writings:', error);
        return new Response(JSON.stringify({
            error: String(error),
            writings: []
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

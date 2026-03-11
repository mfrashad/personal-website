import type { APIRoute } from 'astro';
import { fetchCleveWritings } from '@/api/cleve';

export const prerender = false;

export const GET: APIRoute = async () => {
    try {
        const { writings } = await fetchCleveWritings();

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

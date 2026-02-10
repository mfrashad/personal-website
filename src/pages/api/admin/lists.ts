import type { APIRoute } from 'astro';
import { listFileMap } from '@lib/resource-admin';

export const prerender = false;

export const GET: APIRoute = async () => {
    if (import.meta.env.PROD) {
        return new Response(JSON.stringify({ error: 'Not allowed in production' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const categories = [];

        for (const [category, meta] of Object.entries(listFileMap)) {
            try {
                const mod = await import(/* @vite-ignore */ `../../../data/lists/${meta.file}`);
                const items = mod[meta.varName] || [];

                categories.push({
                    category,
                    title: meta.title,
                    icon: meta.icon,
                    items: items.map((item: any) => ({ ...item })),
                });
            } catch (err) {
                console.error(`Error loading category ${category}:`, err);
                categories.push({
                    category,
                    title: meta.title,
                    icon: meta.icon,
                    items: [],
                });
            }
        }

        return new Response(JSON.stringify(categories), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

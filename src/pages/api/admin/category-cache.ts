import type { APIRoute } from 'astro';
import * as fs from 'fs';
import * as path from 'path';

export const prerender = false;

const CACHE_FILE = path.resolve(process.cwd(), 'public/content-generator/category-cache.json');
const ACTIVE_FILE = path.resolve(process.cwd(), 'public/content-generator/active-category.json');

function readCache(): Record<string, any> {
    try {
        if (fs.existsSync(CACHE_FILE)) return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    } catch {}
    return {};
}

function writeCache(data: Record<string, any>) {
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
}

function readActive(): string | null {
    try {
        if (fs.existsSync(ACTIVE_FILE)) {
            const data = JSON.parse(fs.readFileSync(ACTIVE_FILE, 'utf-8'));
            return data.category || null;
        }
    } catch {}
    return null;
}

function writeActive(category: string | null) {
    fs.mkdirSync(path.dirname(ACTIVE_FILE), { recursive: true });
    fs.writeFileSync(ACTIVE_FILE, JSON.stringify({ category }, null, 2));
}

/** GET: ?category=foo returns cache for one category, ?active=1 returns active category */
export const GET: APIRoute = async ({ url }) => {
    if (import.meta.env.PROD) {
        return new Response(JSON.stringify({ error: 'Not allowed in production' }), {
            status: 403, headers: { 'Content-Type': 'application/json' },
        });
    }

    const active = url.searchParams.get('active');
    if (active) {
        return new Response(JSON.stringify({ category: readActive() }), {
            status: 200, headers: { 'Content-Type': 'application/json' },
        });
    }

    const category = url.searchParams.get('category');
    if (category) {
        const data = readCache();
        return new Response(JSON.stringify(data[category] ?? null), {
            status: 200, headers: { 'Content-Type': 'application/json' },
        });
    }

    // No params — return all
    return new Response(JSON.stringify(readCache()), {
        status: 200, headers: { 'Content-Type': 'application/json' },
    });
};

/** POST: { category, cache } saves cache for a category, { activeCategory } saves active category */
export const POST: APIRoute = async ({ request }) => {
    if (import.meta.env.PROD) {
        return new Response(JSON.stringify({ error: 'Not allowed in production' }), {
            status: 403, headers: { 'Content-Type': 'application/json' },
        });
    }
    try {
        const body = await request.json();

        // Save active category
        if ('activeCategory' in body) {
            writeActive(body.activeCategory);
            return new Response(JSON.stringify({ ok: true }), {
                status: 200, headers: { 'Content-Type': 'application/json' },
            });
        }

        // Save/delete category cache
        const { category, cache } = body;
        if (!category || typeof category !== 'string') {
            return new Response(JSON.stringify({ error: 'Missing category' }), {
                status: 400, headers: { 'Content-Type': 'application/json' },
            });
        }
        const data = readCache();
        if (cache) {
            data[category] = cache;
        } else {
            delete data[category];
        }
        writeCache(data);
        return new Response(JSON.stringify({ ok: true }), {
            status: 200, headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: String(error) }), {
            status: 500, headers: { 'Content-Type': 'application/json' },
        });
    }
};

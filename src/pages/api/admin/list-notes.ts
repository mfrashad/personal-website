import type { APIRoute } from 'astro';
import * as fs from 'fs';
import * as path from 'path';

export const prerender = false;

const FILE = path.resolve(process.cwd(), 'public/content-generator/list-notes.json');

function read(): Record<string, string> {
    try {
        if (fs.existsSync(FILE)) return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
    } catch {}
    return {};
}

function write(data: Record<string, string>) {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

/** GET: Read all list notes */
export const GET: APIRoute = async () => {
    if (import.meta.env.PROD) {
        return new Response(JSON.stringify({ error: 'Not allowed in production' }), {
            status: 403, headers: { 'Content-Type': 'application/json' },
        });
    }
    return new Response(JSON.stringify(read()), {
        status: 200, headers: { 'Content-Type': 'application/json' },
    });
};

/** POST: Save a list note. Body: { category: string, note: string | null } */
export const POST: APIRoute = async ({ request }) => {
    if (import.meta.env.PROD) {
        return new Response(JSON.stringify({ error: 'Not allowed in production' }), {
            status: 403, headers: { 'Content-Type': 'application/json' },
        });
    }
    try {
        const { category, note } = await request.json();
        if (!category || typeof category !== 'string') {
            return new Response(JSON.stringify({ error: 'Missing category' }), {
                status: 400, headers: { 'Content-Type': 'application/json' },
            });
        }
        const data = read();
        if (note) {
            data[category] = note;
        } else {
            delete data[category];
        }
        write(data);
        return new Response(JSON.stringify({ ok: true }), {
            status: 200, headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: String(error) }), {
            status: 500, headers: { 'Content-Type': 'application/json' },
        });
    }
};

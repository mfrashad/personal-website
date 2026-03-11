import type { APIRoute } from 'astro';
import * as fs from 'fs';
import * as path from 'path';

export const prerender = false;

const DEFAULTS_FILE = path.resolve(process.cwd(), 'public/content-generator/media-defaults.json');

function readDefaults(): Record<string, string> {
    try {
        if (fs.existsSync(DEFAULTS_FILE)) {
            return JSON.parse(fs.readFileSync(DEFAULTS_FILE, 'utf-8'));
        }
    } catch {}
    return {};
}

function writeDefaults(defaults: Record<string, string>) {
    fs.mkdirSync(path.dirname(DEFAULTS_FILE), { recursive: true });
    fs.writeFileSync(DEFAULTS_FILE, JSON.stringify(defaults, null, 2));
}

/** GET: Read all defaults */
export const GET: APIRoute = async () => {
    if (import.meta.env.PROD) {
        return new Response(JSON.stringify({ error: 'Not allowed in production' }), {
            status: 403, headers: { 'Content-Type': 'application/json' },
        });
    }
    return new Response(JSON.stringify(readDefaults()), {
        status: 200, headers: { 'Content-Type': 'application/json' },
    });
};

/** POST: Set a default. Body: { key: string, path: string } or { key: string, path: null } to clear */
export const POST: APIRoute = async ({ request }) => {
    if (import.meta.env.PROD) {
        return new Response(JSON.stringify({ error: 'Not allowed in production' }), {
            status: 403, headers: { 'Content-Type': 'application/json' },
        });
    }
    try {
        const { key, path: mediaPath } = await request.json();
        if (!key || typeof key !== 'string') {
            return new Response(JSON.stringify({ error: 'Missing key' }), {
                status: 400, headers: { 'Content-Type': 'application/json' },
            });
        }
        const defaults = readDefaults();
        if (mediaPath) {
            defaults[key] = mediaPath;
        } else {
            delete defaults[key];
        }
        writeDefaults(defaults);
        return new Response(JSON.stringify({ ok: true, defaults }), {
            status: 200, headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: String(error) }), {
            status: 500, headers: { 'Content-Type': 'application/json' },
        });
    }
};

// Dev-only endpoint backing the on-page review tool.
// Comments are written to .dev-comments.json at the repo root so they can be
// read straight off disk. Returns 404 in any non-dev build.
import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

export const prerender = false;

const FILE = path.join(process.cwd(), '.dev-comments.json');

const notFound = () => new Response('Not found', { status: 404 });
const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data, null, 2), {
        status,
        headers: { 'Content-Type': 'application/json' }
    });

type Comment = {
    id: string;
    path: string;
    heading: string;
    tag: string;
    nth: number;
    snippet: string;
    selection: string;
    note: string;
    createdAt: string;
    done?: boolean;
};

async function readAll(): Promise<Comment[]> {
    try {
        return JSON.parse(await fs.readFile(FILE, 'utf-8'));
    } catch {
        return [];
    }
}

async function writeAll(list: Comment[]) {
    await fs.writeFile(FILE, JSON.stringify(list, null, 2) + '\n', 'utf-8');
}

export const GET: APIRoute = async ({ url }) => {
    if (!import.meta.env.DEV) return notFound();
    const all = await readAll();
    const forPath = url.searchParams.get('path');
    return json(forPath ? all.filter((c) => c.path === forPath) : all);
};

export const POST: APIRoute = async ({ request }) => {
    if (!import.meta.env.DEV) return notFound();
    const body = (await request.json()) as Partial<Comment>;
    if (!body.note || !body.path) return json({ error: 'note and path required' }, 400);

    const all = await readAll();
    const comment: Comment = {
        id: crypto.randomUUID(),
        path: body.path,
        heading: body.heading ?? '',
        tag: body.tag ?? '',
        nth: body.nth ?? -1,
        snippet: body.snippet ?? '',
        selection: body.selection ?? '',
        note: body.note,
        createdAt: new Date().toISOString()
    };
    all.push(comment);
    await writeAll(all);
    return json(comment, 201);
};

export const DELETE: APIRoute = async ({ url }) => {
    if (!import.meta.env.DEV) return notFound();
    const id = url.searchParams.get('id');
    const all = await readAll();
    if (id === 'all') {
        const forPath = url.searchParams.get('path');
        await writeAll(forPath ? all.filter((c) => c.path !== forPath) : []);
        return json({ ok: true });
    }
    await writeAll(all.filter((c) => c.id !== id));
    return json({ ok: true });
};

import { createClient } from '@libsql/client';

export interface Postcard {
    id: string;
    author: string;
    body: string;
    drawingDataUrl: string;
    country?: string;
    websiteUrl?: string;
    createdAt: number;
    paperColor: string;
    penColor: string;
    email?: string; // private, never exposed in API responses
    notecardId?: number;
    stampX?: number;
    stampY?: number;
}

const PAPER_COLORS = [
    '#FAF9F6', '#FFF8DC', '#FFFEF0', '#F5F5DC', '#FDF5E6',
    '#FAEBD7', '#FFF8E7', '#FEFCF3', '#F9F6EE', '#FAF8F1',
];

const PEN_COLORS = ['#000000', '#1a1a1a', '#0f172a', '#1e293b'];

function getDb() {
    const url = import.meta.env.TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL;
    const authToken = import.meta.env.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;

    if (!url) throw new Error('TURSO_DATABASE_URL is not set');

    return createClient({ url, authToken });
}

export async function initDb() {
    const db = getDb();
    await db.execute(`
        CREATE TABLE IF NOT EXISTS postcards (
            id TEXT PRIMARY KEY,
            author TEXT NOT NULL,
            body TEXT NOT NULL,
            drawing_data_url TEXT NOT NULL,
            country TEXT,
            website_url TEXT,
            created_at INTEGER NOT NULL,
            paper_color TEXT NOT NULL,
            pen_color TEXT NOT NULL,
            email TEXT,
            notecard_id INTEGER,
            stamp_x REAL,
            stamp_y REAL
        )
    `);
}

export async function createPostcard(data: {
    author: string;
    body: string;
    drawingDataUrl: string;
    country?: string;
    websiteUrl?: string;
    email?: string;
    notecardId?: number;
    stampX?: number;
    stampY?: number;
}): Promise<Postcard> {
    const db = getDb();
    const id = crypto.randomUUID();
    const createdAt = Date.now();
    const paperColor = PAPER_COLORS[Math.floor(Math.random() * PAPER_COLORS.length)];
    const penColor = PEN_COLORS[Math.floor(Math.random() * PEN_COLORS.length)];

    await db.execute({
        sql: `INSERT INTO postcards (id, author, body, drawing_data_url, country, website_url, email, created_at, paper_color, pen_color, notecard_id, stamp_x, stamp_y)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [id, data.author, data.body, data.drawingDataUrl, data.country || null, data.websiteUrl || null, data.email || null, createdAt, paperColor, penColor, data.notecardId ?? null, data.stampX ?? null, data.stampY ?? null],
    });

    return {
        id,
        author: data.author,
        body: data.body,
        drawingDataUrl: data.drawingDataUrl,
        country: data.country,
        websiteUrl: data.websiteUrl,
        createdAt,
        paperColor,
        penColor,
        notecardId: data.notecardId,
        stampX: data.stampX,
        stampY: data.stampY,
    };
}

export async function getPostcards(offset = 0, limit = 50): Promise<Postcard[]> {
    const db = getDb();
    const result = await db.execute({
        sql: 'SELECT * FROM postcards ORDER BY created_at DESC LIMIT ? OFFSET ?',
        args: [limit, offset],
    });

    return result.rows.map((row) => ({
        id: row.id as string,
        author: row.author as string,
        body: row.body as string,
        drawingDataUrl: row.drawing_data_url as string,
        country: (row.country as string) || undefined,
        websiteUrl: (row.website_url as string) || undefined,
        createdAt: row.created_at as number,
        paperColor: row.paper_color as string,
        penColor: row.pen_color as string,
        notecardId: (row.notecard_id as number) ?? undefined,
        stampX: (row.stamp_x as number) ?? undefined,
        stampY: (row.stamp_y as number) ?? undefined,
    }));
}

export async function getPostcard(id: string): Promise<Postcard | null> {
    const db = getDb();
    const result = await db.execute({
        sql: 'SELECT * FROM postcards WHERE id = ?',
        args: [id],
    });

    if (result.rows.length === 0) return null;
    const row = result.rows[0];

    return {
        id: row.id as string,
        author: row.author as string,
        body: row.body as string,
        drawingDataUrl: row.drawing_data_url as string,
        country: (row.country as string) || undefined,
        websiteUrl: (row.website_url as string) || undefined,
        createdAt: row.created_at as number,
        paperColor: row.paper_color as string,
        penColor: row.pen_color as string,
    };
}

export async function getPostcardCount(): Promise<number> {
    const db = getDb();
    const result = await db.execute('SELECT COUNT(*) as count FROM postcards');
    return result.rows[0].count as number;
}

export async function deletePostcard(id: string): Promise<boolean> {
    const db = getDb();
    await db.execute({ sql: 'DELETE FROM postcards WHERE id = ?', args: [id] });
    return true;
}

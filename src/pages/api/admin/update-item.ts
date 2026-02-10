import type { APIRoute } from 'astro';
import * as fs from 'fs';
import { getListFilePath, serializeItem, findAndReplaceItem } from '@lib/resource-admin';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    if (import.meta.env.PROD) {
        return new Response(JSON.stringify({ error: 'Not allowed in production' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { category, originalName, item } = await request.json();

        if (!category || !originalName || !item) {
            return new Response(JSON.stringify({ error: 'Missing required fields: category, originalName, item' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const filePath = getListFilePath(category);
        let fileContent = fs.readFileSync(filePath, 'utf-8');

        const newItemStr = serializeItem(item);
        fileContent = findAndReplaceItem(fileContent, originalName, newItemStr);

        fs.writeFileSync(filePath, fileContent, 'utf-8');
        console.log(`Updated item "${originalName}" in ${category}`);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error updating item:', error);
        return new Response(JSON.stringify({ error: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

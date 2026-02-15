import type { APIRoute } from 'astro';
import * as fs from 'fs';
import * as path from 'path';

export const prerender = false;

const ROOT = path.resolve(process.cwd());
const MOCKUP_DIR = path.join(ROOT, 'public/content-generator/mockups');
const GREENSCREEN_URL = process.env.GREENSCREEN_URL || 'http://localhost:8000';

export const POST: APIRoute = async ({ request }) => {
    if (import.meta.env.PROD) {
        return jsonResponse({ error: 'Not allowed in production' }, 403);
    }

    let body: any;
    try {
        body = await request.json();
    } catch {
        return jsonResponse({ error: 'Invalid JSON body' }, 400);
    }

    const { action } = body;

    try {
        switch (action) {
            case 'health':
                return await handleHealth();
            case 'list-templates':
                return await handleListTemplates();
            case 'detect':
                return await handleDetect(body);
            case 'composite-one':
                return await handleCompositeOne(body);
            case 'composite-batch':
                return await handleCompositeBatch(body);
            default:
                return jsonResponse({ error: `Unknown action: ${action}` }, 400);
        }
    } catch (error) {
        console.error('[greenscreen] Error:', error);
        return jsonResponse({ error: String(error) }, 500);
    }
};

function jsonResponse(data: any, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

/** Ping Python server via /api/templates (lightweight JSON endpoint) */
async function handleHealth() {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(`${GREENSCREEN_URL}/api/templates`, {
            method: 'GET',
            signal: controller.signal,
        });
        clearTimeout(timeout);
        return jsonResponse({ connected: res.ok, url: GREENSCREEN_URL });
    } catch {
        return jsonResponse({ connected: false, url: GREENSCREEN_URL });
    }
}

/** Fetch available templates from Python server */
async function handleListTemplates() {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(`${GREENSCREEN_URL}/api/templates`, {
            method: 'GET',
            signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!res.ok) {
            return jsonResponse({ error: 'Failed to fetch templates from greenscreen server' }, 502);
        }

        const data = await res.json();
        // data.templates is an array of { id, filename, width, height, corners }
        // Add thumb and full image URLs pointing to the Python server's static files
        const templates = (data.templates || []).map((t: any) => ({
            ...t,
            thumbUrl: `${GREENSCREEN_URL}/static/templates/thumbs/${t.filename}`,
            fullUrl: `${GREENSCREEN_URL}/static/templates/${t.filename}`,
        }));

        return jsonResponse({ templates });
    } catch {
        return jsonResponse({ error: 'Greenscreen server not reachable' }, 502);
    }
}

/** Send base image to Python /api/detect → returns corners + preview */
async function handleDetect(body: { baseImagePath?: string; templateUrl?: string }) {
    const { baseImagePath, templateUrl } = body;

    let imageBlob: Blob;
    let filename: string;

    if (templateUrl) {
        // Fetch template image from greenscreen server
        const res = await fetch(templateUrl);
        if (!res.ok) return jsonResponse({ error: `Failed to fetch template: ${templateUrl}` }, 502);
        const buffer = await res.arrayBuffer();
        imageBlob = new Blob([buffer], { type: 'image/jpeg' });
        filename = templateUrl.split('/').pop() || 'template.jpg';
    } else if (baseImagePath) {
        const absPath = path.join(ROOT, 'public', baseImagePath.replace(/^\//, ''));
        if (!fs.existsSync(absPath)) {
            return jsonResponse({ error: `File not found: ${baseImagePath}` }, 404);
        }
        const imageBuffer = fs.readFileSync(absPath);
        imageBlob = new Blob([imageBuffer], { type: 'image/png' });
        filename = path.basename(absPath);
    } else {
        return jsonResponse({ error: 'Missing baseImagePath or templateUrl' }, 400);
    }

    const formData = new FormData();
    formData.append('base', imageBlob, filename);

    const res = await fetch(`${GREENSCREEN_URL}/api/detect`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        const text = await res.text();
        return jsonResponse({ error: `Python server error: ${text}` }, res.status);
    }

    const data = await res.json();
    return jsonResponse(data);
}

/** Composite one screenshot into the base image */
async function handleCompositeOne(body: {
    baseImagePath?: string;
    templateUrl?: string;
    screenshotPath: string;
    corners?: number[][];
    domainKey: string;
    adjustments?: Record<string, number>;
}) {
    const { baseImagePath, templateUrl, screenshotPath, corners, domainKey, adjustments } = body;
    if (!screenshotPath || !domainKey) {
        return jsonResponse({ error: 'Missing screenshotPath or domainKey' }, 400);
    }
    if (!baseImagePath && !templateUrl) {
        return jsonResponse({ error: 'Missing baseImagePath or templateUrl' }, 400);
    }

    // Resolve base image
    let baseBlob: Blob;
    let baseFilename: string;
    if (templateUrl) {
        const res = await fetch(templateUrl);
        if (!res.ok) return jsonResponse({ error: `Failed to fetch template` }, 502);
        baseBlob = new Blob([await res.arrayBuffer()], { type: 'image/jpeg' });
        baseFilename = templateUrl.split('/').pop() || 'template.jpg';
    } else {
        const baseAbs = path.join(ROOT, 'public', baseImagePath!.replace(/^\//, ''));
        if (!fs.existsSync(baseAbs)) return jsonResponse({ error: `Base image not found: ${baseImagePath}` }, 404);
        baseBlob = new Blob([fs.readFileSync(baseAbs)], { type: 'image/png' });
        baseFilename = path.basename(baseAbs);
    }

    // Resolve screenshot
    const ssAbs = path.join(ROOT, 'public', screenshotPath.replace(/^\//, ''));
    if (!fs.existsSync(ssAbs)) return jsonResponse({ error: `Screenshot not found: ${screenshotPath}` }, 404);

    // corners is required by Python API - auto-detect if not provided
    let resolvedCorners = corners;
    if (!resolvedCorners) {
        const detectForm = new FormData();
        detectForm.append('base', baseBlob, baseFilename);
        const detectRes = await fetch(`${GREENSCREEN_URL}/api/detect`, { method: 'POST', body: detectForm });
        if (!detectRes.ok) {
            return jsonResponse({ error: 'Failed to auto-detect corners and none were provided' }, 400);
        }
        const detectData = await detectRes.json();
        resolvedCorners = detectData.corners;
        // Re-create base blob since detect consumed it
        if (templateUrl) {
            const res2 = await fetch(templateUrl);
            baseBlob = new Blob([await res2.arrayBuffer()], { type: 'image/jpeg' });
        } else {
            baseBlob = new Blob([fs.readFileSync(path.join(ROOT, 'public', baseImagePath!.replace(/^\//, '')))], { type: 'image/png' });
        }
    }

    const formData = new FormData();
    formData.append('base', baseBlob, baseFilename);
    formData.append('screenshot', new Blob([fs.readFileSync(ssAbs)], { type: 'image/png' }), path.basename(ssAbs));
    formData.append('corners', JSON.stringify(resolvedCorners));

    if (adjustments) {
        for (const [key, value] of Object.entries(adjustments)) {
            formData.append(key, String(value));
        }
    }

    const res = await fetch(`${GREENSCREEN_URL}/api/process-one`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        const text = await res.text();
        return jsonResponse({ error: `Python server error: ${text}` }, res.status);
    }

    // Save result PNG
    fs.mkdirSync(MOCKUP_DIR, { recursive: true });
    const outputName = `${domainKey}_mockup.png`;
    const outputPath = path.join(MOCKUP_DIR, outputName);
    const resultBuffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(outputPath, resultBuffer);

    const publicPath = `/content-generator/mockups/${outputName}`;
    return jsonResponse({ path: publicPath, domainKey });
}

/** Composite all items in batch */
async function handleCompositeBatch(body: {
    baseImagePath?: string;
    templateUrl?: string;
    corners?: number[][];
    adjustments?: Record<string, number>;
    items: Array<{ domainKey: string; screenshotPath: string; itemName: string }>;
}) {
    const { baseImagePath, templateUrl, corners, adjustments, items } = body;
    if ((!baseImagePath && !templateUrl) || !items?.length) {
        return jsonResponse({ error: 'Missing base image source or items' }, 400);
    }

    const results: Record<string, string> = {};
    const errors: string[] = [];

    for (const { domainKey, screenshotPath, itemName } of items) {
        try {
            const res = await handleCompositeOne({
                baseImagePath,
                templateUrl,
                screenshotPath,
                corners,
                domainKey,
                adjustments,
            });
            const data = await res.json();
            if (res.status === 200 && data.path) {
                results[itemName] = data.path;
            } else {
                errors.push(`${itemName}: ${data.error}`);
            }
        } catch (err) {
            errors.push(`${itemName}: ${String(err)}`);
        }
    }

    return jsonResponse({
        mockupImages: results,
        total: items.length,
        success: Object.keys(results).length,
        errors,
    });
}

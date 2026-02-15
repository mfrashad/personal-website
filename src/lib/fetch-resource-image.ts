import { parse } from 'node-html-parser';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(process.cwd());
const FAVICONS_DIR = path.join(ROOT, 'public/resource-images/favicons');
const OG_DIR = path.join(ROOT, 'public/resource-images/og');
const SCREENSHOTS_DIR = path.join(ROOT, 'public/resource-images/screenshots');
const MANIFEST_PATH = path.join(ROOT, 'src/data/resource-images.json');
const MAX_IMAGE_SIZE = 500 * 1024;
const FETCH_TIMEOUT = 10_000;

export interface ImageManifest {
    images: Record<string, { favicon?: string; ogImage?: string; screenshot?: string }>;
}

export function domainKey(url: string): string {
    try {
        const hostname = new URL(url).hostname.replace(/^www\./, '');
        return hostname.replace(/\./g, '-');
    } catch {
        return '';
    }
}

/**
 * Generate a unique resource key from a URL.
 * For most URLs, this is just the domain (e.g., "readwise-io").
 * For URLs with meaningful path segments (like hardcover.app/books/slug),
 * includes the path to distinguish between items on the same domain.
 */
export function resourceKey(url: string): string {
    try {
        const parsed = new URL(url);
        const hostname = parsed.hostname.replace(/^www\./, '');
        const domain = hostname.replace(/\./g, '-');

        // For URLs with path segments beyond just "/" , include the path
        const pathSegments = parsed.pathname.split('/').filter(Boolean);
        if (pathSegments.length >= 2) {
            // e.g., hardcover.app/books/atomic-habits → hardcover-app-books-atomic-habits
            const pathPart = pathSegments.join('-');
            return `${domain}-${pathPart}`;
        }

        return domain;
    } catch {
        return '';
    }
}

export function resolveUrl(base: string, relative: string): string {
    try {
        return new URL(relative, base).href;
    } catch {
        return '';
    }
}

export async function fetchWithTimeout(url: string, timeoutMs = FETCH_TIMEOUT): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, {
            signal: controller.signal,
            redirect: 'follow',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            },
        });
        return res;
    } finally {
        clearTimeout(timer);
    }
}

export function extractFaviconUrl(html: string, baseUrl: string): string | null {
    const root = parse(html);
    const selectors = [
        'link[rel="apple-touch-icon"]',
        'link[rel="apple-touch-icon-precomposed"]',
        'link[rel="icon"][sizes]',
        'link[rel="shortcut icon"]',
        'link[rel="icon"]',
    ];

    for (const selector of selectors) {
        const el = root.querySelector(selector);
        if (el) {
            const href = el.getAttribute('href');
            if (href) {
                const resolved = resolveUrl(baseUrl, href);
                if (resolved) return resolved;
            }
        }
    }

    return resolveUrl(baseUrl, '/favicon.ico');
}

export function extractOgImageUrl(html: string, baseUrl: string): string | null {
    const root = parse(html);

    const ogImage = root.querySelector('meta[property="og:image"]');
    if (ogImage) {
        const content = ogImage.getAttribute('content');
        if (content) return resolveUrl(baseUrl, content);
    }

    const twitterImage = root.querySelector('meta[name="twitter:image"]');
    if (twitterImage) {
        const content = twitterImage.getAttribute('content');
        if (content) return resolveUrl(baseUrl, content);
    }

    return null;
}

export function getExtension(url: string, contentType?: string): string {
    if (contentType) {
        const typeMap: Record<string, string> = {
            'image/png': '.png',
            'image/jpeg': '.jpg',
            'image/jpg': '.jpg',
            'image/gif': '.gif',
            'image/webp': '.webp',
            'image/svg+xml': '.svg',
            'image/x-icon': '.ico',
            'image/vnd.microsoft.icon': '.ico',
        };
        const ext = typeMap[contentType.split(';')[0].trim()];
        if (ext) return ext;
    }

    try {
        const pathname = new URL(url).pathname;
        const ext = path.extname(pathname).toLowerCase();
        if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico'].includes(ext)) {
            return ext === '.jpeg' ? '.jpg' : ext;
        }
    } catch {}

    return '.png';
}

export async function downloadImage(
    imageUrl: string,
    destDir: string,
    key: string,
): Promise<string | null> {
    try {
        const res = await fetchWithTimeout(imageUrl);
        if (!res.ok) return null;

        const contentType = res.headers.get('content-type') || '';
        if (!contentType.startsWith('image/') && !imageUrl.endsWith('.ico')) {
            return null;
        }

        const buffer = Buffer.from(await res.arrayBuffer());
        if (buffer.length === 0 || buffer.length > MAX_IMAGE_SIZE) return null;

        const ext = getExtension(imageUrl, contentType);
        const filename = `${key}${ext}`;
        const destPath = path.join(destDir, filename);
        fs.writeFileSync(destPath, buffer);

        const relativePath = `/resource-images/${path.basename(destDir)}/${filename}`;
        return relativePath;
    } catch {
        return null;
    }
}

export function loadManifest(): ImageManifest {
    if (fs.existsSync(MANIFEST_PATH)) {
        return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
    }
    return { images: {} };
}

export function saveManifest(manifest: ImageManifest): void {
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

let stealthInitialized = false;

async function launchStealthBrowser() {
    const puppeteer = await import('puppeteer-extra');
    if (!stealthInitialized) {
        const StealthPlugin = (await import('puppeteer-extra-plugin-stealth')).default;
        puppeteer.default.use(StealthPlugin());
        stealthInitialized = true;
    }
    return puppeteer.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
}

export async function fetchImagesForUrl(url: string): Promise<{ favicon?: string; ogImage?: string; screenshot?: string }> {
    fs.mkdirSync(FAVICONS_DIR, { recursive: true });
    fs.mkdirSync(OG_DIR, { recursive: true });
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

    const key = domainKey(url);
    if (!key) throw new Error(`Invalid URL: ${url}`);

    // Use stealth Puppeteer for everything — avoids 403s from Cloudflare
    const browser = await launchStealthBrowser();
    let html = '';
    let finalUrl = url;
    let screenshotPath: string | null = null;

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 20_000 });
        // Wait for JS rendering and lazy-loaded elements
        await new Promise((r) => setTimeout(r, 3000));

        finalUrl = page.url();
        html = await page.content();

        // Take screenshot
        const screenshotFilename = `${key}.png`;
        const screenshotDest = path.join(SCREENSHOTS_DIR, screenshotFilename);
        await page.screenshot({ path: screenshotDest, type: 'png' });
        screenshotPath = `/resource-images/screenshots/${screenshotFilename}`;

        await page.close();
    } catch (err: any) {
        console.error(`Puppeteer failed for ${url}:`, err.message?.slice(0, 100));
    } finally {
        await browser.close();
    }

    // Parse HTML for favicon and OG image URLs
    let faviconPath: string | null = null;
    let ogImagePath: string | null = null;

    if (html) {
        const faviconUrl = extractFaviconUrl(html, finalUrl);
        if (faviconUrl) {
            faviconPath = await downloadImage(faviconUrl, FAVICONS_DIR, key);
        }

        const ogImageUrl = extractOgImageUrl(html, finalUrl);
        if (ogImageUrl) {
            ogImagePath = await downloadImage(ogImageUrl, OG_DIR, key);
        }
    }

    // Update manifest
    const manifest = loadManifest();
    const entry: { favicon?: string; ogImage?: string; screenshot?: string } = {};
    if (faviconPath) entry.favicon = faviconPath;
    if (ogImagePath) entry.ogImage = ogImagePath;
    if (screenshotPath) entry.screenshot = screenshotPath;

    if (faviconPath || ogImagePath || screenshotPath) {
        manifest.images[key] = { ...manifest.images[key], ...entry };
        saveManifest(manifest);
    }

    return {
        favicon: faviconPath || undefined,
        ogImage: ogImagePath || undefined,
        screenshot: screenshotPath || undefined,
    };
}

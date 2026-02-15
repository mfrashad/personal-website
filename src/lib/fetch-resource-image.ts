import { parse } from 'node-html-parser';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { chromium, type BrowserContext } from 'playwright';
import sharp from 'sharp';

const ROOT = path.resolve(process.cwd());
const FAVICONS_DIR = path.join(ROOT, 'public/resource-images/favicons');
const OG_DIR = path.join(ROOT, 'public/resource-images/og');
const SCREENSHOTS_DIR = path.join(ROOT, 'public/resource-images/screenshots');
const MANIFEST_PATH = path.join(ROOT, 'src/data/resource-images.json');
const MAX_IMAGE_SIZE = 500 * 1024;
const FETCH_TIMEOUT = 10_000;

/**
 * Domains where the generic favicon (e.g. Instagram logo) is useless —
 * we want the OG image (profile picture / page banner) as the favicon instead.
 */
const USE_OG_AS_FAVICON_DOMAINS = [
    'instagram.com',
    'facebook.com',
    'youtube.com',
    'meetup.com',
    'steampowered.com',
    'store.steampowered.com',
    'themoviedb.org',
];

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
        if (pathSegments.length >= 1) {
            // e.g., hardcover.app/books/atomic-habits → hardcover-app-books-atomic-habits
            // e.g., youtube.com/@ycombinator → youtube-com-@ycombinator
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

/**
 * Download an image using Playwright's browser context request API.
 * Shares cookies/session with the browser, so it works on sites that
 * block plain fetch (e.g., favicon endpoints behind auth/CDN).
 * Falls back to plain downloadImage if the browser request fails.
 */
export async function downloadImageViaContext(
    context: BrowserContext,
    imageUrl: string,
    destDir: string,
    key: string,
): Promise<string | null> {
    try {
        const res = await context.request.get(imageUrl, { timeout: FETCH_TIMEOUT });
        if (!res.ok()) return await downloadImage(imageUrl, destDir, key);

        const contentType = res.headers()['content-type'] || '';
        if (!contentType.startsWith('image/') && !imageUrl.endsWith('.ico')) {
            return await downloadImage(imageUrl, destDir, key);
        }

        const buffer = await res.body();
        if (buffer.length === 0 || buffer.length > MAX_IMAGE_SIZE) return null;

        const ext = getExtension(imageUrl, contentType);
        const filename = `${key}${ext}`;
        const destPath = path.join(destDir, filename);
        fs.writeFileSync(destPath, buffer);

        return `/resource-images/${path.basename(destDir)}/${filename}`;
    } catch {
        // Fall back to plain fetch
        return await downloadImage(imageUrl, destDir, key);
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

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const CHROME_USER_DATA = path.join(
    process.env.HOME || '',
    'Library/Application Support/Google/Chrome',
);

/**
 * Copy essential Chrome Default profile data to a temp directory.
 * This gives Chrome a "non-default" user-data-dir (required for --remote-debugging-port)
 * while preserving cookies, sessions, and localStorage.
 * Chrome decrypts cookies via the macOS Keychain, so they work in the copy.
 *
 * Only copies what's needed for authenticated browsing (~15MB), not the full
 * profile (~4GB of extensions, service workers, file system, etc.).
 */
function copyFullProfileToTmp(): string | null {
    try {
        if (!fs.existsSync(CHROME_PATH) || !fs.existsSync(CHROME_USER_DATA)) return null;

        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-cdp-'));
        const defaultSrc = path.join(CHROME_USER_DATA, 'Default');
        const defaultDest = path.join(tmpDir, 'Default');

        // Copy Local State (profile metadata, encryption config)
        const localStateSrc = path.join(CHROME_USER_DATA, 'Local State');
        if (fs.existsSync(localStateSrc)) {
            fs.cpSync(localStateSrc, path.join(tmpDir, 'Local State'));
        }

        // Directories/files essential for authenticated sessions
        const essentialItems = [
            'Cookies',
            'Cookies-journal',
            'Network',           // Network/Cookies for newer Chrome
            'Local Storage',     // localStorage data
            'Session Storage',   // sessionStorage data
            'Sessions',          // Tab session data
            'Preferences',       // Profile preferences
            'Secure Preferences',
            'Login Data',        // Saved passwords (encrypted, needs Keychain)
            'Login Data-journal',
            'Web Data',          // Autofill, payment methods
            'Web Data-journal',
        ];

        fs.mkdirSync(defaultDest, { recursive: true });
        for (const item of essentialItems) {
            const src = path.join(defaultSrc, item);
            const dest = path.join(defaultDest, item);
            if (fs.existsSync(src)) {
                const stat = fs.statSync(src);
                if (stat.isDirectory()) {
                    fs.cpSync(src, dest, { recursive: true });
                } else {
                    fs.cpSync(src, dest);
                }
            }
        }

        return tmpDir;
    } catch (err: any) {
        console.log('Failed to copy Chrome profile:', err.message?.slice(0, 100));
        return null;
    }
}

export async function launchStealthBrowser() {
    const puppeteer = await import('puppeteer-extra');
    if (!stealthInitialized) {
        const StealthPlugin = (await import('puppeteer-extra-plugin-stealth')).default;
        puppeteer.default.use(StealthPlugin());
        stealthInitialized = true;
    }

    // Copy Chrome profile to temp dir so we get cookies even while Chrome is running
    const tmpProfile = copyFullProfileToTmp();
    if (tmpProfile) {
        try {
            const browser = await puppeteer.default.launch({
                headless: true,
                executablePath: CHROME_PATH,
                userDataDir: tmpProfile,
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions'],
            });
            console.log('Launched Puppeteer stealth with copied Chrome profile (cookies available)');

            // Clean up temp dir when browser closes
            const origClose = browser.close.bind(browser);
            browser.close = async () => {
                await origClose();
                fs.rmSync(tmpProfile, { recursive: true, force: true });
            };

            return browser;
        } catch (err: any) {
            console.log('Failed to launch with Chrome profile:', err.message?.slice(0, 80));
            fs.rmSync(tmpProfile, { recursive: true, force: true });
        }
    }

    return puppeteer.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
}

export interface PlaywrightSession {
    context: BrowserContext;
    cleanup: () => Promise<void>;
}

/**
 * Get a Playwright browser context with the user's Chrome cookies/session.
 *
 * Strategy order:
 * 1. CDP — if Chrome is already running with --remote-debugging-port=9222
 * 2. CDP via temp profile — copy full Chrome profile to temp dir, launch Chrome
 *    with --remote-debugging-port=9222, connect via CDP. Chrome decrypts cookies
 *    via the macOS Keychain, so all login sessions are preserved.
 * 3. Plain Playwright launch — no cookies, clean browser
 */
export async function getPlaywrightContext(): Promise<PlaywrightSession | null> {
    // Strategy 1: Try existing CDP (if user manually started Chrome with debug port)
    try {
        const browser = await chromium.connectOverCDP('http://localhost:9222');
        const contexts = browser.contexts();
        const context = contexts.length > 0 ? contexts[0] : await browser.newContext();
        console.log('✓ Connected to Chrome via CDP (localhost:9222)');
        return { context, cleanup: async () => { /* Don't close user's Chrome */ } };
    } catch {
        // CDP not available
    }

    // Strategy 2: Copy profile → launch Chrome with debug port → connect via CDP
    const tmpProfile = copyFullProfileToTmp();
    if (tmpProfile) {
        try {
            const { spawn, execSync } = await import('child_process');

            // Launch Chrome with the copied profile and debug port
            const chromeProc = spawn(CHROME_PATH, [
                '--remote-debugging-port=9222',
                '--user-data-dir=' + tmpProfile,
                '--headless=new',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-extensions',
                '--disable-gpu',
            ], {
                detached: true,
                stdio: 'ignore',
            });
            chromeProc.unref();

            // Wait for debug port to become available
            let browser;
            for (let i = 0; i < 30; i++) {
                await new Promise(r => setTimeout(r, 1000));
                try {
                    browser = await chromium.connectOverCDP('http://localhost:9222');
                    break;
                } catch {
                    // Not ready yet
                }
            }

            if (browser) {
                const contexts = browser.contexts();
                const context = contexts.length > 0 ? contexts[0] : await browser.newContext();
                console.log('✓ Launched Chrome with CDP + full profile (cookies/sessions available)');
                return {
                    context,
                    cleanup: async () => {
                        // Disconnect Playwright, then kill the Chrome process and clean up
                        try { await browser.close(); } catch {}
                        try { process.kill(-chromeProc.pid!, 'SIGTERM'); } catch {}
                        // Wait a moment for Chrome to exit, then clean up
                        await new Promise(r => setTimeout(r, 2000));
                        fs.rmSync(tmpProfile, { recursive: true, force: true });
                    },
                };
            } else {
                console.log('Chrome started but CDP port not available');
                try { process.kill(-chromeProc.pid!, 'SIGTERM'); } catch {}
                fs.rmSync(tmpProfile, { recursive: true, force: true });
            }
        } catch (err: any) {
            console.log('Failed to launch Chrome with CDP:', err.message?.slice(0, 100));
            fs.rmSync(tmpProfile, { recursive: true, force: true });
        }
    }

    // Strategy 3: Launch plain Playwright (no cookies)
    try {
        const browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
        console.log('✓ Launched Playwright (clean browser, no profile)');
        return {
            context,
            cleanup: async () => {
                await context.close();
                await browser.close();
            },
        };
    } catch (err: any) {
        console.log('Failed to launch Playwright:', err.message?.slice(0, 100));
        return null;
    }
}

/**
 * Take a screenshot and extract HTML using a Playwright BrowserContext.
 * Opens a new page, navigates, screenshots, extracts HTML, then closes the page only.
 */
export async function screenshotWithPlaywright(
    context: BrowserContext,
    key: string,
    url: string,
): Promise<{ html: string; finalUrl: string; screenshotPath: string | null }> {
    const page = await context.newPage();
    try {
        await page.setViewportSize({ width: 1280, height: 800 });

        // Try networkidle first, but don't fail if it times out — the page may still be usable
        try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
        } catch {
            // Timeout on networkidle — try again with just 'load' which is less strict
            try {
                await page.goto(url, { waitUntil: 'load', timeout: 15_000 });
            } catch {
                // Even 'load' timed out — continue anyway, page may have partial content
                console.log(`  Navigation timeout for ${url}, attempting screenshot of partial page`);
            }
        }
        await page.waitForTimeout(3000);

        const finalUrl = page.url();
        const html = await page.content();

        const screenshotFilename = `${key}.png`;
        const screenshotDest = path.join(SCREENSHOTS_DIR, screenshotFilename);
        await page.screenshot({ path: screenshotDest, type: 'png' });
        const screenshotPath = `/resource-images/screenshots/${screenshotFilename}`;

        return { html, finalUrl, screenshotPath };
    } catch (err: any) {
        console.error(`Playwright failed for ${url}:`, err.message?.slice(0, 100));
        const html = await page.content().catch(() => '');
        return { html, finalUrl: url, screenshotPath: null };
    } finally {
        await page.close();
    }
}

/**
 * Check if a URL belongs to a domain where we should use the OG image
 * (center-cropped to square) as the favicon instead of the generic site icon.
 */
function shouldUseOgAsFavicon(url: string): boolean {
    try {
        const hostname = new URL(url).hostname.replace(/^www\./, '');
        return USE_OG_AS_FAVICON_DOMAINS.some(d => hostname === d || hostname.endsWith('.' + d));
    } catch {
        return false;
    }
}

/**
 * Resize an OG image to fit within a 256x256 square (contain, no crop)
 * and save as PNG favicon.
 */
async function ogToFavicon(ogImagePath: string, destDir: string, key: string): Promise<string | null> {
    try {
        const srcPath = path.join(ROOT, 'public', ogImagePath);
        if (!fs.existsSync(srcPath)) return null;

        const filename = `${key}.png`;
        const destPath = path.join(destDir, filename);
        await sharp(srcPath)
            .resize(256, 256, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .png()
            .toFile(destPath);

        return `/resource-images/${path.basename(destDir)}/${filename}`;
    } catch (err: any) {
        console.log(`Failed to convert OG image to favicon:`, err.message?.slice(0, 80));
        return null;
    }
}

export async function fetchImagesForUrl(url: string): Promise<{ favicon?: string; ogImage?: string; screenshot?: string }> {
    fs.mkdirSync(FAVICONS_DIR, { recursive: true });
    fs.mkdirSync(OG_DIR, { recursive: true });
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

    const key = resourceKey(url);
    if (!key) throw new Error(`Invalid URL: ${url}`);

    let html = '';
    let finalUrl = url;
    let screenshotPath: string | null = null;

    // Try Playwright first (CDP → profile copy → clean), fall back to Puppeteer stealth
    const session = await getPlaywrightContext();
    if (session) {
        console.log(`Using Playwright for ${url}`);
        const result = await screenshotWithPlaywright(session.context, key, url);
        html = result.html;
        finalUrl = result.finalUrl;
        screenshotPath = result.screenshotPath;
    } else {
        // Fallback to Puppeteer stealth
        console.log(`Falling back to Puppeteer stealth for ${url}`);
        const browser = await launchStealthBrowser();
        try {
            const page = await browser.newPage();
            await page.setViewport({ width: 1280, height: 800 });
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30_000 });
            await new Promise((r) => setTimeout(r, 3000));

            finalUrl = page.url();
            html = await page.content();

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
    }

    // Parse HTML for favicon and OG image URLs
    // Use browser context for downloads when Playwright is available (has cookies/session)
    const download = session
        ? (imgUrl: string, dir: string, k: string) => downloadImageViaContext(session.context, imgUrl, dir, k)
        : downloadImage;

    let faviconPath: string | null = null;
    let ogImagePath: string | null = null;
    const useOgAsFavicon = shouldUseOgAsFavicon(url);

    if (html) {
        // Always fetch OG image first (needed for both OG and possibly favicon)
        const ogImageUrl = extractOgImageUrl(html, finalUrl);
        if (ogImageUrl) {
            ogImagePath = await download(ogImageUrl, OG_DIR, key);
        }

        if (useOgAsFavicon && ogImagePath) {
            // For Instagram/Facebook/YouTube/Meetup: center-crop OG image as favicon
            faviconPath = await ogToFavicon(ogImagePath, FAVICONS_DIR, key);
            if (faviconPath) {
                console.log(`  Used OG image as favicon for ${new URL(url).hostname}`);
            }
        }

        if (!faviconPath) {
            // Normal favicon extraction
            const faviconUrl = extractFaviconUrl(html, finalUrl);
            if (faviconUrl) {
                faviconPath = await download(faviconUrl, FAVICONS_DIR, key);
            }
        }
    }

    // Clean up the browser session
    if (session) {
        await session.cleanup();
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

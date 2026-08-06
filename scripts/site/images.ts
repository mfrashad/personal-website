/**
 * Additive image processing for site content.
 *
 * Replaces the add-path of scripts/process-speaking-images.ts and
 * scripts/process-content-images.ts. Those two rebuild their manifest from an
 * empty object and read a hardcoded macOS source tree, so they can only ever be
 * run as a full re-import from ~/Documents. This module instead takes explicit
 * file paths (so it works straight from the Telegram image cache) and MERGES
 * into the manifests, never replacing them.
 *
 * Layouts:
 *   speaking   public/speaking-images/<id>/NN.webp   + thumbs/NN.webp
 *   hackathon  public/hackathon-images/<id>/NN.webp  + thumbs/NN.webp
 *              ^ both index into the SAME manifest, src/data/speaking-images.json
 *   content    public/content-images/<type>/<id>/{content,analytics}.jpg
 *   brandlogo  public/content-images/brandlogos/<slug>.png
 */

import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';

export const REPO_ROOT = path.resolve(import.meta.dirname, '..', '..');

const SPEAKING_MANIFEST = path.join(REPO_ROOT, 'src', 'data', 'speaking-images.json');
const CONTENT_MANIFEST = path.join(REPO_ROOT, 'src', 'data', 'content-images.json');

// Matches the existing assets on disk: full images cap at 1600px, thumbs at 400px.
const FULL_MAX_WIDTH = 1600;
const THUMB_MAX_WIDTH = 400;
// Content screenshots are portrait phone captures, already capped at 800px.
const CONTENT_MAX_WIDTH = 800;
const LOGO_MAX_WIDTH = 400;

export type EngagementKind = 'speaking' | 'hackathon';

/** Directories that live inside public/speaking-images but are not engagements. */
const NON_ENGAGEMENT_DIRS = new Set(['dist', 'node_modules', '.DS_Store']);

// ---------------------------------------------------------------------------
// decode
// ---------------------------------------------------------------------------

/**
 * Read an image into a buffer sharp can handle.
 *
 * sharp's prebuilt libvips has no HEIC decoder (HEIF was dropped from the
 * prebuilds over patent licensing), and Telegram delivers HEIC untouched when a
 * photo is sent as a *file* rather than a *photo*. Fall back to an external
 * converter: heif-convert on Linux, sips on macOS.
 */
export async function readImage(inputPath: string): Promise<Buffer> {
    const buf = fs.readFileSync(inputPath);
    try {
        await sharp(buf).metadata();
        return buf;
    } catch (err) {
        const converted = tryExternalDecode(inputPath);
        if (converted) return converted;
        throw new Error(
            `Cannot decode ${path.basename(inputPath)} (${(err as Error).message}). ` +
                `If this is a HEIC file, install libheif-examples (heif-convert).`
        );
    }
}

function tryExternalDecode(inputPath: string): Buffer | null {
    const tmp = `${inputPath}.decoded.jpg`;
    for (const [bin, args] of [
        ['heif-convert', ['-q', '92', inputPath, tmp]],
        ['sips', ['-s', 'format', 'jpeg', inputPath, '--out', tmp]],
    ] as [string, string[]][]) {
        try {
            execFileSync(bin, args, { stdio: 'pipe' });
            const out = fs.readFileSync(tmp);
            fs.unlinkSync(tmp);
            return out;
        } catch {
            if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
        }
    }
    return null;
}

// ---------------------------------------------------------------------------
// manifests — always read-modify-write
// ---------------------------------------------------------------------------

function readManifest<T>(file: string): T {
    if (!fs.existsSync(file)) return {} as T;
    return JSON.parse(fs.readFileSync(file, 'utf8')) as T;
}

/** Preserves the file's existing trailing-newline convention so a content
 *  change never shows up as a whole-file diff. */
function writeManifest(file: string, data: unknown): void {
    const hadTrailingNewline = fs.existsSync(file) && fs.readFileSync(file, 'utf8').endsWith('\n');
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + (hadTrailingNewline ? '\n' : ''));
}

// ---------------------------------------------------------------------------
// engagements (speaking + hackathon)
// ---------------------------------------------------------------------------

/**
 * Highest existing NN prefix in a directory, so numbering continues rather than
 * restarting. Deliberately not `files.length` — those diverge the moment a photo
 * is deleted by hand, and length+1 would then silently overwrite an existing file.
 */
function nextIndex(dir: string): number {
    if (!fs.existsSync(dir)) return 1;
    let max = 0;
    for (const f of fs.readdirSync(dir)) {
        const m = /^(\d+)\./.exec(f);
        if (m) max = Math.max(max, parseInt(m[1], 10));
    }
    return max + 1;
}

export interface AddEngagementResult {
    added: string[];
    skipped: { file: string; reason: string }[];
    total: number;
}

export async function addEngagementImages(
    id: string,
    kind: EngagementKind,
    inputPaths: string[]
): Promise<AddEngagementResult> {
    const baseDir = kind === 'speaking' ? 'speaking-images' : 'hackathon-images';
    const outDir = path.join(REPO_ROOT, 'public', baseDir, id);
    const thumbDir = path.join(outDir, 'thumbs');
    fs.mkdirSync(thumbDir, { recursive: true });

    let idx = nextIndex(outDir);
    const added: string[] = [];
    const skipped: { file: string; reason: string }[] = [];

    for (const input of inputPaths) {
        try {
            const buf = await readImage(input);
            const name = `${String(idx).padStart(2, '0')}.webp`;
            // .rotate() with no argument applies the EXIF orientation tag, which
            // phone cameras rely on. It must come before resize.
            await sharp(buf)
                .rotate()
                .resize({ width: FULL_MAX_WIDTH, withoutEnlargement: true })
                .webp({ quality: 82 })
                .toFile(path.join(outDir, name));
            await sharp(buf)
                .rotate()
                .resize({ width: THUMB_MAX_WIDTH, withoutEnlargement: true })
                .webp({ quality: 80 })
                .toFile(path.join(thumbDir, name));
            added.push(`/${baseDir}/${id}/${name}`);
            idx++;
        } catch (err) {
            // One unreadable photo must not abort a six-photo batch.
            skipped.push({ file: path.basename(input), reason: (err as Error).message });
        }
    }

    if (added.length) {
        const manifest = readManifest<Record<string, string[]>>(SPEAKING_MANIFEST);
        manifest[id] = [...(manifest[id] ?? []), ...added];
        writeManifest(SPEAKING_MANIFEST, manifest);
    }

    return { added, skipped, total: (readManifest<Record<string, string[]>>(SPEAKING_MANIFEST)[id] ?? []).length };
}

export function removeEngagementImages(id: string, kind: EngagementKind): number {
    const baseDir = kind === 'speaking' ? 'speaking-images' : 'hackathon-images';
    const outDir = path.join(REPO_ROOT, 'public', baseDir, id);
    if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true, force: true });
    const manifest = readManifest<Record<string, string[]>>(SPEAKING_MANIFEST);
    const had = manifest[id]?.length ?? 0;
    delete manifest[id];
    writeManifest(SPEAKING_MANIFEST, manifest);
    return had;
}

export function listEngagementDirs(kind: EngagementKind): string[] {
    const dir = path.join(REPO_ROOT, 'public', kind === 'speaking' ? 'speaking-images' : 'hackathon-images');
    if (!fs.existsSync(dir)) return [];
    return fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((e) => e.isDirectory() && !NON_ENGAGEMENT_DIRS.has(e.name))
        .map((e) => e.name);
}

// ---------------------------------------------------------------------------
// content pieces (thumbnail + analytics screenshots)
// ---------------------------------------------------------------------------

export interface ContentImageInput {
    /** The video thumbnail / cover screenshot. */
    content?: string;
    /** The platform insights / analytics screenshot. */
    analytics?: string;
}

export async function addContentImages(
    id: string,
    type: string,
    inputs: ContentImageInput
): Promise<Record<string, string>> {
    const outDir = path.join(REPO_ROOT, 'public', 'content-images', type, id);
    fs.mkdirSync(outDir, { recursive: true });

    const manifest = readManifest<Record<string, Record<string, string>>>(CONTENT_MANIFEST);
    const entry = { ...(manifest[id] ?? {}) };

    for (const slot of ['content', 'analytics'] as const) {
        const input = inputs[slot];
        if (!input) continue;
        const buf = await readImage(input);
        const name = `${slot}.jpg`;
        await sharp(buf)
            .rotate()
            .resize({ width: CONTENT_MAX_WIDTH, withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toFile(path.join(outDir, name));
        entry[slot] = `/content-images/${type}/${id}/${name}`;
    }

    manifest[id] = entry;
    writeManifest(CONTENT_MANIFEST, manifest);
    return entry;
}

export function removeContentImages(id: string, type: string): boolean {
    const outDir = path.join(REPO_ROOT, 'public', 'content-images', type, id);
    if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true, force: true });
    const manifest = readManifest<Record<string, Record<string, string>>>(CONTENT_MANIFEST);
    const had = id in manifest;
    delete manifest[id];
    writeManifest(CONTENT_MANIFEST, manifest);
    return had;
}

// ---------------------------------------------------------------------------
// brand logos
// ---------------------------------------------------------------------------

/**
 * Existing logo filenames are a lowercase run of alphanumerics with separators
 * stripped entirely — "Peaches & Cream" -> peachesandcream.
 */
export function logoSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]/g, '');
}

/**
 * PNG, not webp — these are logos and several rely on transparency.
 *
 * Refuses to clobber an existing logo unless `overwrite` is set: slugs collide
 * readily ("Honor" and "HONOR" produce the same filename), and silently
 * replacing a good logo with a worse one is not something a diff makes obvious.
 */
export async function addBrandLogo(
    name: string,
    inputPath: string,
    overwrite = false
): Promise<string> {
    const outDir = path.join(REPO_ROOT, 'public', 'content-images', 'brandlogos');
    fs.mkdirSync(outDir, { recursive: true });
    const file = `${logoSlug(name)}.png`;
    if (!overwrite && fs.existsSync(path.join(outDir, file))) {
        throw new Error(
            `A logo already exists at /content-images/brandlogos/${file} (slug for "${name}"). ` +
                `Pass overwrite to replace it.`
        );
    }
    const buf = await readImage(inputPath);
    await sharp(buf)
        .rotate()
        .resize(LOGO_MAX_WIDTH, undefined, { fit: 'inside', withoutEnlargement: true })
        .png()
        .toFile(path.join(outDir, file));
    return `/content-images/brandlogos/${file}`;
}

export function removeBrandLogo(src: string): boolean {
    const abs = path.join(REPO_ROOT, 'public', src.replace(/^\//, ''));
    if (!fs.existsSync(abs)) return false;
    fs.unlinkSync(abs);
    return true;
}

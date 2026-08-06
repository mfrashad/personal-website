/**
 * Structural checks on the site's content data files.
 *
 * This is the pre-commit gate for automated edits (see the Hermes website/*
 * skills). It deliberately does NOT use `astro check`: that reports 87
 * pre-existing type errors on a clean tree, so a bot could never tell its own
 * mistake from the baseline, and it catches none of the failures that actually
 * matter here — an Invalid Date, a duplicate id, a manifest entry pointing at a
 * file that isn't there.
 *
 * Run: npx tsx scripts/validate-content.ts
 * Exits non-zero with a list of problems.
 */

import * as fs from 'fs';
import * as path from 'path';

import { speakingEngagements } from '../src/data/speaking.ts';
import { hackathonEngagements } from '../src/data/hackathons.ts';
import { mediaMentions } from '../src/data/media-mentions.ts';
import { contentPieces, brandLogos, contentPayments, contentCategories } from '../src/data/content-creation.ts';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');
const PUBLIC = path.join(REPO_ROOT, 'public');

const problems: string[] = [];
const fail = (msg: string) => problems.push(msg);

// --- identity -------------------------------------------------------------

function checkDuplicates<T>(rows: T[], key: (r: T) => string, label: string) {
    const seen = new Map<string, number>();
    for (const r of rows) {
        const k = key(r);
        seen.set(k, (seen.get(k) ?? 0) + 1);
    }
    for (const [k, n] of seen) {
        if (n > 1) {
            // The realistic cause: the same entry added on two machines, merged
            // cleanly by git because the lines don't overlap. Detail pages then
            // resolve via .find() and silently show only the first.
            fail(`${label}: duplicate identity ${JSON.stringify(k)} appears ${n} times`);
        }
    }
}

checkDuplicates(speakingEngagements, (e) => e.id, 'speaking.ts');
checkDuplicates(hackathonEngagements, (e) => e.id, 'hackathons.ts');
checkDuplicates(contentPieces, (p) => p.id, 'content-creation.ts contentPieces');
// media-mentions has no id field; url is the only identity it has.
checkDuplicates(mediaMentions, (m) => m.url, 'media-mentions.ts');

// --- dates ----------------------------------------------------------------

for (const e of speakingEngagements) {
    if (!(e.date instanceof Date) || isNaN(e.date.getTime())) fail(`speaking.ts: ${e.id} has an invalid date`);
}
for (const e of hackathonEngagements) {
    if (!(e.date instanceof Date) || isNaN(e.date.getTime())) fail(`hackathons.ts: ${e.id} has an invalid date`);
}
for (const p of contentPieces) {
    if (!(p.date instanceof Date) || isNaN(p.date.getTime())) fail(`content-creation.ts: ${p.id} has an invalid date`);
}
for (const m of mediaMentions) {
    // These are plain strings, not Date objects — different shape, same failure mode.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(m.date) || isNaN(Date.parse(m.date))) {
        fail(`media-mentions.ts: ${JSON.stringify(m.title)} has an invalid date ${JSON.stringify(m.date)}`);
    }
}

// --- enums ----------------------------------------------------------------

const SPEAKING_TYPES = new Set(['talk', 'panel', 'interview', 'workshop', 'fireside']);
const HACKATHON_ROLES = new Set(['judge', 'mentor', 'participant', 'sponsor']);
const MENTION_TYPES = new Set(['article', 'newspaper', 'radio', 'tv', 'podcast', 'video', 'interview']);
const PLATFORMS = new Set(['tiktok', 'instagram', 'youtube']);
const PAYMENT_KINDS = new Set(['cash', 'barter', 'cash+barter', 'unpaid']);
const CONTENT_TYPES = new Set(Object.keys(contentCategories));

for (const e of speakingEngagements) {
    if (!SPEAKING_TYPES.has(e.type)) fail(`speaking.ts: ${e.id} has unknown type ${JSON.stringify(e.type)}`);
}
for (const e of hackathonEngagements) {
    if (!HACKATHON_ROLES.has(e.role)) fail(`hackathons.ts: ${e.id} has unknown role ${JSON.stringify(e.role)}`);
}
for (const m of mediaMentions) {
    if (!MENTION_TYPES.has(m.type)) fail(`media-mentions.ts: ${JSON.stringify(m.title)} has unknown type ${JSON.stringify(m.type)}`);
}
for (const p of contentPieces) {
    if (!PLATFORMS.has(p.platform)) fail(`content-creation.ts: ${p.id} has unknown platform ${JSON.stringify(p.platform)}`);
    if (!CONTENT_TYPES.has(p.type)) fail(`content-creation.ts: ${p.id} has unknown type ${JSON.stringify(p.type)}`);
}

// --- images referenced actually exist -------------------------------------

function assetExists(rootRelative: string): boolean {
    return fs.existsSync(path.join(PUBLIC, rootRelative.replace(/^\//, '')));
}

const speakingImages: Record<string, string[]> = JSON.parse(
    fs.readFileSync(path.join(REPO_ROOT, 'src', 'data', 'speaking-images.json'), 'utf8')
);
const contentImages: Record<string, { content?: string; analytics?: string }> = JSON.parse(
    fs.readFileSync(path.join(REPO_ROOT, 'src', 'data', 'content-images.json'), 'utf8')
);

const engagementIds = new Set([...speakingEngagements.map((e) => e.id), ...hackathonEngagements.map((e) => e.id)]);
for (const [id, paths] of Object.entries(speakingImages)) {
    if (!engagementIds.has(id)) fail(`speaking-images.json: "${id}" has photos but no matching entry in speaking.ts or hackathons.ts`);
    for (const p of paths) if (!assetExists(p)) fail(`speaking-images.json: ${id} references missing file ${p}`);
}

const pieceIds = new Set(contentPieces.map((p) => p.id));
for (const [id, slots] of Object.entries(contentImages)) {
    if (!pieceIds.has(id)) fail(`content-images.json: "${id}" has images but no matching entry in contentPieces`);
    for (const [slot, p] of Object.entries(slots)) {
        if (p && !assetExists(p)) fail(`content-images.json: ${id}.${slot} references missing file ${p}`);
    }
}

for (const logo of brandLogos) {
    if (!assetExists(logo.src)) fail(`brandLogos: ${JSON.stringify(logo.name)} references missing file ${logo.src}`);
}
for (const e of [...speakingEngagements, ...hackathonEngagements]) {
    for (const l of e.logos ?? []) if (!assetExists(l)) fail(`${e.id}: references missing logo ${l}`);
}

// --- payments -------------------------------------------------------------

for (const [id, pay] of Object.entries(contentPayments)) {
    if (!pieceIds.has(id)) fail(`contentPayments: "${id}" does not match any contentPieces entry`);
    if (!Number.isFinite(pay.amount)) fail(`contentPayments: ${id} amount must be a finite number, got ${JSON.stringify(pay.amount)}`);
    if (!/^[A-Z]{3}$/.test(pay.currency)) fail(`contentPayments: ${id} currency should be a 3-letter ISO code, got ${JSON.stringify(pay.currency)}`);
    if (!PAYMENT_KINDS.has(pay.kind)) fail(`contentPayments: ${id} has unknown kind ${JSON.stringify(pay.kind)}`);
    if (pay.barterValue !== undefined && !Number.isFinite(pay.barterValue)) fail(`contentPayments: ${id} barterValue must be a finite number`);
}

// --- payments must not reach the front end --------------------------------

/**
 * contentPayments is kept out of ContentPiece precisely so it cannot ride along
 * in island props. Enforce that nothing under src/pages or src/components pulls
 * it in — that would put rates into the delivered HTML of /create.
 */
function walk(dir: string, out: string[] = []): string[] {
    if (!fs.existsSync(dir)) return out;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full, out);
        else if (/\.(astro|tsx?|jsx?|vue|svelte)$/.test(e.name)) out.push(full);
    }
    return out;
}

for (const file of [...walk(path.join(REPO_ROOT, 'src', 'pages')), ...walk(path.join(REPO_ROOT, 'src', 'components'))]) {
    const src = fs.readFileSync(file, 'utf8');
    // Ignore the explanatory comment in create.astro that names the export.
    const code = src.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
    if (/\bcontentPayments\b|\bContentPayment\b/.test(code)) {
        fail(`${path.relative(REPO_ROOT, file)}: references contentPayments — payment data must never reach the front end`);
    }
}

// --- report ---------------------------------------------------------------

/**
 * Problems that already existed before automated editing was introduced. They
 * are reported as warnings so the gate stays usable, but they are NOT hidden —
 * fix them and delete the corresponding line from the baseline.
 *
 * Anything not listed here fails the run.
 */
const BASELINE_FILE = path.join(REPO_ROOT, 'scripts', 'content-baseline.json');
const baseline: string[] = fs.existsSync(BASELINE_FILE)
    ? JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8'))
    : [];

const known = problems.filter((p) => baseline.includes(p));
const fresh = problems.filter((p) => !baseline.includes(p));
const staleBaseline = baseline.filter((b) => !problems.includes(b));

const counts = [
    `speaking ${speakingEngagements.length}`,
    `hackathons ${hackathonEngagements.length}`,
    `mentions ${mediaMentions.length}`,
    `content ${contentPieces.length}`,
    `logos ${brandLogos.length}`,
    `payments ${Object.keys(contentPayments).length}`,
].join('  ');

if (known.length) {
    console.warn(`! ${known.length} pre-existing issue${known.length === 1 ? '' : 's'} (baselined, not blocking):`);
    for (const p of known) console.warn(`    ${p}`);
    console.warn('');
}

if (staleBaseline.length) {
    console.warn(`! ${staleBaseline.length} baseline entr${staleBaseline.length === 1 ? 'y is' : 'ies are'} no longer needed — remove from ${path.relative(REPO_ROOT, BASELINE_FILE)}:`);
    for (const p of staleBaseline) console.warn(`    ${p}`);
    console.warn('');
}

if (fresh.length) {
    console.error(`✗ ${fresh.length} problem${fresh.length === 1 ? '' : 's'}\n`);
    for (const p of fresh) console.error(`  - ${p}`);
    console.error(`\n${counts}`);
    process.exit(1);
}

console.log(`✓ content valid   ${counts}`);

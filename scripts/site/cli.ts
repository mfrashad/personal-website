#!/usr/bin/env -S npx tsx
/**
 * `site` — the only thing that edits site content.
 *
 * The agent driving this emits JSON and never TypeScript: the four data schemas
 * differ in precisely the ways a model conflates (Date literal vs date string,
 * id vs url identity), and terminal-only editing of strings containing quotes,
 * apostrophes and CJK text is a recipe for a corrupted public data file.
 *
 * Every command prints a JSON object on stdout and exits non-zero with a
 * structured reason on failure. Read that output; never paraphrase values from
 * memory.
 *
 * Publishing is two steps on purpose. `stage` writes the fully-resolved change
 * to a token file and prints a draft; `publish --token` re-reads that file and
 * ships exactly what was shown. A restart, a compaction, or a "yes" arriving an
 * hour later therefore cannot publish something other than what was approved.
 */

import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { createHash } from 'crypto';

import { KINDS, PAYMENTS_EXPORT, PAYMENTS_FILE, PAYMENT_FIELDS, type KindName } from './kinds.ts';
import {
    REPO_ROOT,
    renderEntry,
    findEntrySpan,
    insertDateOrdered,
    appendToArray,
    upsertRecordEntry,
    editFile,
    restoreFile,
} from './splice.ts';
import {
    addEngagementImages,
    addContentImages,
    addBrandLogo,
    removeEngagementImages,
    removeContentImages,
    removeBrandLogo,
} from './images.ts';

const PENDING_DIR = process.env.SITE_PENDING_DIR ?? path.join(process.env.HOME ?? '/tmp', '.hermes', 'website', 'pending');
const PUBLISH_BRANCH = process.env.PUBLISH_BRANCH ?? 'main';
const TOKEN_TTL_HOURS = 24;

/** Only these paths may ever be staged for commit. Never `git add -A`: a stray
 *  `npm run build` rewrites four tracked data caches via its prebuild hook. */
const COMMIT_ALLOWLIST = [
    'src/data/speaking.ts',
    'src/data/hackathons.ts',
    'src/data/media-mentions.ts',
    'src/data/content-creation.ts',
    'src/data/speaking-images.json',
    'src/data/content-images.json',
    'public/speaking-images',
    'public/hackathon-images',
    'public/content-images',
];

// ---------------------------------------------------------------------------

function out(obj: unknown): never {
    console.log(JSON.stringify(obj, null, 2));
    process.exit(0);
}

function die(reason: string, detail?: unknown): never {
    console.log(JSON.stringify({ ok: false, error: reason, detail }, null, 2));
    process.exit(1);
}

function git(args: string[], opts: { allowFail?: boolean } = {}): string {
    try {
        return execFileSync('git', args, { cwd: REPO_ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    } catch (err: any) {
        if (opts.allowFail) return '';
        throw new Error(`git ${args.join(' ')} failed: ${(err.stderr || err.message || '').toString().trim()}`);
    }
}

function arg(flag: string): string | undefined {
    const i = process.argv.indexOf(flag);
    return i === -1 ? undefined : process.argv[i + 1];
}

function flag(name: string): boolean {
    return process.argv.includes(name);
}

function requireKind(): KindName {
    const k = arg('--kind') as KindName | undefined;
    if (!k || !(k in KINDS)) die(`--kind must be one of: ${Object.keys(KINDS).join(', ')}`);
    return k;
}

function parseJsonArg(flagName: string): Record<string, unknown> {
    const raw = arg(flagName);
    if (!raw) die(`${flagName} is required`);
    try {
        return JSON.parse(raw);
    } catch (e) {
        die(`${flagName} is not valid JSON`, (e as Error).message);
    }
}

function readData(kind: KindName): string {
    return fs.readFileSync(path.join(REPO_ROOT, KINDS[kind].file), 'utf8');
}

function runValidator(): { ok: boolean; output: string } {
    try {
        const output = execFileSync('npx', ['tsx', 'scripts/validate-content.ts'], {
            cwd: REPO_ROOT,
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'pipe'],
        });
        return { ok: true, output: output.trim() };
    } catch (err: any) {
        return { ok: false, output: `${err.stdout ?? ''}${err.stderr ?? ''}`.trim() };
    }
}

// ---------------------------------------------------------------------------
// commands
// ---------------------------------------------------------------------------

function cmdDescribe(): never {
    const kind = requireKind();
    const spec = KINDS[kind];
    out({
        ok: true,
        kind,
        file: spec.file,
        identity: spec.anchor,
        notes: spec.notes,
        images: spec.images ?? null,
        fields: spec.fields,
        payments: kind === 'content' ? PAYMENT_FIELDS : undefined,
    });
}

async function cmdShow(): Promise<never> {
    const kind = requireKind();
    const spec = KINDS[kind];
    const id = arg('--id');
    const mod = await import(path.join(REPO_ROOT, spec.file));
    const rows: any[] = mod[spec.exportName];
    if (!id) {
        out({ ok: true, kind, count: rows.length, entries: rows.map((r) => ({ [spec.anchor]: r[spec.anchor], title: r.title ?? r.name })) });
    }
    const hit = rows.find((r) => String(r[spec.anchor]) === id);
    if (!hit) die(`no ${kind} entry with ${spec.anchor}=${JSON.stringify(id)}`);
    const payments = kind === 'content' ? (mod[PAYMENTS_EXPORT] ?? {})[id] : undefined;
    out({ ok: true, kind, entry: hit, payment: payments ?? null });
}

async function cmdAdd(): Promise<never> {
    const kind = requireKind();
    const spec = KINDS[kind];
    const data = parseJsonArg('--json');

    for (const f of spec.fields) {
        if (f.required && f.name !== 'src' && data[f.name] === undefined) {
            die(`missing required field "${f.name}" for kind ${kind}`, { help: f.help });
        }
        if (f.enum && data[f.name] !== undefined && !f.enum.includes(String(data[f.name]))) {
            die(`field "${f.name}" must be one of ${f.enum.join(', ')}`, { got: data[f.name] });
        }
    }

    const identity = String(data[spec.anchor] ?? '');
    const source = readData(kind);
    if (findEntrySpan(source, spec.anchor, identity)) {
        die(`a ${kind} entry with ${spec.anchor}=${JSON.stringify(identity)} already exists — use edit`);
    }

    const backups: Record<string, string> = {};
    const imagesAdded: unknown[] = [];

    try {
        // Images first, so `src` can be filled in before the entry is rendered.
        if (spec.images === 'logo') {
            const img = arg('--image');
            if (!img) die('--image is required for brandlogo');
            data.src = await addBrandLogo(String(data.name), img, flag('--overwrite'));
            imagesAdded.push(data.src);
        }

        backups[spec.file] = fs.readFileSync(path.join(REPO_ROOT, spec.file), 'utf8');
        const entryText = renderEntry(data, spec.fieldOrder);
        editFile(spec.file, (src) =>
            spec.ordered
                ? insertDateOrdered(src, spec.exportName, entryText, String(data.date), { dividers: spec.dividers })
                : appendToArray(src, spec.exportName, entryText)
        );

        if (spec.images === 'engagement') {
            const files = imageArgs();
            if (files.length) {
                const r = await addEngagementImages(identity, kind === 'speaking' ? 'speaking' : 'hackathon', files);
                imagesAdded.push(...r.added);
                if (r.skipped.length) console.error(JSON.stringify({ warning: 'some images skipped', skipped: r.skipped }));
            }
        }
        if (spec.images === 'content') {
            const content = arg('--content-image');
            const analytics = arg('--analytics-image');
            if (content || analytics) {
                const r = await addContentImages(identity, String(data.type), { content, analytics });
                imagesAdded.push(r);
            }
            const pay = arg('--payment');
            if (pay) {
                const parsed = JSON.parse(pay);
                editFile(PAYMENTS_FILE, (src) => upsertRecordEntry(src, PAYMENTS_EXPORT, identity, parsed));
            }
        }

        const v = runValidator();
        if (!v.ok) throw new Error(`validation failed after edit:\n${v.output}`);
        out({ ok: true, action: 'add', kind, identity, images: imagesAdded, validator: v.output });
    } catch (err) {
        for (const [rel, contents] of Object.entries(backups)) restoreFile(rel, contents);
        die(`add failed and was rolled back`, (err as Error).message);
    }
}

function imageArgs(): string[] {
    const i = process.argv.indexOf('--images');
    if (i === -1) return [];
    const files: string[] = [];
    for (let j = i + 1; j < process.argv.length && !process.argv[j].startsWith('--'); j++) files.push(process.argv[j]);
    return files;
}

async function cmdEdit(): Promise<never> {
    const kind = requireKind();
    const spec = KINDS[kind];
    const id = arg('--id');
    if (!id) die('--id is required');
    const patch = parseJsonArg('--json');

    const mod = await import(path.join(REPO_ROOT, spec.file) + `?t=${Date.now()}`);
    const rows: any[] = mod[spec.exportName];
    const current = rows.find((r) => String(r[spec.anchor]) === id);
    if (!current) die(`no ${kind} entry with ${spec.anchor}=${JSON.stringify(id)}`);

    // Deep-merge `metrics` rather than replacing it: updating a view count is a
    // routine operation, and a shallow replace would silently drop likes,
    // saves, shares and newFollowers.
    const merged: Record<string, unknown> = { ...current };
    for (const [k, v] of Object.entries(patch)) {
        if (k === 'metrics' && typeof v === 'object' && v !== null) {
            merged.metrics = { ...(current.metrics ?? {}), ...(v as object) };
        } else {
            merged[k] = v;
        }
    }
    if (merged.date instanceof Date) merged.date = (merged.date as Date).toISOString().slice(0, 10);

    const backup = fs.readFileSync(path.join(REPO_ROOT, spec.file), 'utf8');
    try {
        const entryText = renderEntry(merged, spec.fieldOrder);
        editFile(spec.file, (src) => {
            const span = findEntrySpan(src, spec.anchor, id);
            if (!span) throw new Error(`could not locate ${spec.anchor}=${id} in ${spec.file}`);
            return src.slice(0, span.start) + entryText + '\n' + src.slice(span.end);
        });
        const v = runValidator();
        if (!v.ok) throw new Error(`validation failed after edit:\n${v.output}`);
        out({ ok: true, action: 'edit', kind, identity: id, entry: merged, validator: v.output });
    } catch (err) {
        restoreFile(spec.file, backup);
        die('edit failed and was rolled back', (err as Error).message);
    }
}

async function cmdDelete(): Promise<never> {
    const kind = requireKind();
    const spec = KINDS[kind];
    const id = arg('--id');
    if (!id) die('--id is required');

    const mod = await import(path.join(REPO_ROOT, spec.file) + `?t=${Date.now()}`);
    const rows: any[] = mod[spec.exportName];
    const current = rows.find((r) => String(r[spec.anchor]) === id);
    if (!current) die(`no ${kind} entry with ${spec.anchor}=${JSON.stringify(id)}`);

    const backup = fs.readFileSync(path.join(REPO_ROOT, spec.file), 'utf8');
    try {
        editFile(spec.file, (src) => {
            const span = findEntrySpan(src, spec.anchor, id);
            if (!span) throw new Error(`could not locate ${spec.anchor}=${id}`);
            return src.slice(0, span.start) + src.slice(span.end);
        });

        let removedImages: unknown = null;
        if (spec.images === 'engagement') removedImages = removeEngagementImages(id, kind === 'speaking' ? 'speaking' : 'hackathon');
        if (spec.images === 'content') {
            removedImages = removeContentImages(id, String(current.type));
            editFile(PAYMENTS_FILE, (src) => upsertRecordEntry(src, PAYMENTS_EXPORT, id, null));
        }
        if (spec.images === 'logo') removedImages = removeBrandLogo(String(current.src));

        const v = runValidator();
        if (!v.ok) throw new Error(`validation failed after delete:\n${v.output}`);
        out({
            ok: true,
            action: 'delete',
            kind,
            identity: id,
            removedImages,
            warning: spec.images === 'engagement' ? `Any existing link to /${kind === 'speaking' ? 'speaking' : 'hackathons'}/${id} will now 404.` : undefined,
            validator: v.output,
        });
    } catch (err) {
        restoreFile(spec.file, backup);
        die('delete failed and was rolled back', (err as Error).message);
    }
}

// ---------------------------------------------------------------------------
// staging / publishing
// ---------------------------------------------------------------------------

/**
 * Modified/deleted tracked files plus untracked ones, restricted to the
 * allowlist. Deliberately not `git status --porcelain`: its status column is
 * space-padded, and any trimming of the output corrupts the first path.
 */
function changedFiles(): string[] {
    const tracked = git(['diff', '--name-only', '--', ...COMMIT_ALLOWLIST]);
    const staged = git(['diff', '--cached', '--name-only', '--', ...COMMIT_ALLOWLIST], { allowFail: true });
    const untracked = git(['ls-files', '--others', '--exclude-standard', '--', ...COMMIT_ALLOWLIST], { allowFail: true });
    const all = [tracked, staged, untracked].flatMap((s) => (s ? s.split('\n') : []));
    return [...new Set(all.map((s) => s.trim()).filter(Boolean))].sort();
}

function cmdStage(): never {
    const message = arg('--message') ?? 'Update site content';
    const summary = arg('--summary') ?? message;

    const files = changedFiles();
    if (!files.length) die('nothing to stage — no changes under the allowlisted paths');

    const diff = git(['diff', '--stat', '--', ...COMMIT_ALLOWLIST]);
    const diffFull = git(['diff', '--', ...COMMIT_ALLOWLIST]);
    const untracked = git(['ls-files', '--others', '--exclude-standard', '--', ...COMMIT_ALLOWLIST], { allowFail: true });

    const photoCount = [...files, ...untracked.split('\n')].filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(f)).length;

    fs.mkdirSync(PENDING_DIR, { recursive: true });
    const token = createHash('sha256').update(diffFull + untracked + Date.now()).digest('hex').slice(0, 8);
    const record = {
        token,
        createdAt: new Date().toISOString(),
        branch: PUBLISH_BRANCH,
        baseCommit: git(['rev-parse', 'HEAD']),
        message,
        summary,
        files,
        untracked: untracked ? untracked.split('\n') : [],
        photoCount,
        contentHash: createHash('sha256').update(diffFull + untracked).digest('hex'),
    };
    fs.writeFileSync(path.join(PENDING_DIR, `${token}.json`), JSON.stringify(record, null, 2));

    out({
        ok: true,
        action: 'stage',
        token,
        branch: PUBLISH_BRANCH,
        diffstat: diff,
        files: record.files,
        untracked: record.untracked,
        consequences: [
            `Commits to ${PUBLISH_BRANCH} of a PUBLIC repo.`,
            photoCount ? `${photoCount} image file(s) become part of public git history permanently — reverting removes them from the site but not from history.` : null,
        ].filter(Boolean),
        next: `site publish --token ${token}`,
    });
}

function cmdPublish(): never {
    const token = arg('--token');
    if (!token) die('--token is required');
    const file = path.join(PENDING_DIR, `${token}.json`);
    if (!fs.existsSync(file)) die(`no pending change with token ${token}`);
    const rec = JSON.parse(fs.readFileSync(file, 'utf8'));

    const ageHours = (Date.now() - Date.parse(rec.createdAt)) / 3_600_000;
    if (ageHours > TOKEN_TTL_HOURS) die(`token ${token} is ${ageHours.toFixed(1)}h old (max ${TOKEN_TTL_HOURS}h) — re-stage and confirm again`);

    const diffFull = git(['diff', '--', ...COMMIT_ALLOWLIST]);
    const untracked = git(['ls-files', '--others', '--exclude-standard', '--', ...COMMIT_ALLOWLIST], { allowFail: true });
    const nowHash = createHash('sha256').update(diffFull + untracked).digest('hex');
    if (nowHash !== rec.contentHash) {
        die('the working tree changed since this was staged — discard the token, re-stage, and confirm the new draft');
    }

    const v = runValidator();
    if (!v.ok) die('validation failed; nothing was pushed', v.output);

    if (flag('--dry-run')) {
        out({ ok: true, action: 'publish', dryRun: true, wouldCommit: rec.files, message: rec.message, branch: rec.branch });
    }

    git(['fetch', 'origin', rec.branch]);
    const remoteHead = git(['rev-parse', `origin/${rec.branch}`]);
    if (remoteHead !== rec.baseCommit) {
        // Someone pushed since staging. Rebase onto it rather than merging, so
        // HEAD^..HEAD stays exactly this change — Vercel's ignoreCommand
        // compares only that range.
        git(['stash', 'push', '--include-untracked', '--', ...COMMIT_ALLOWLIST]);
        git(['rebase', `origin/${rec.branch}`]);
        git(['stash', 'pop']);
    }

    git(['add', '--', ...COMMIT_ALLOWLIST]);
    const staged = git(['diff', '--cached', '--name-only']);
    if (!staged) die('nothing staged after add — refusing to create an empty commit (Vercel would skip the build and nothing would go live)');

    git(['commit', '-m', `${rec.message}\n\nVia: hermes-telegram`]);
    const sha = git(['rev-parse', '--short', 'HEAD']);
    git(['push', 'origin', `HEAD:${rec.branch}`]);
    fs.unlinkSync(file);

    out({ ok: true, action: 'publish', commit: sha, branch: rec.branch, files: rec.files, revert: `git revert ${sha}` });
}

function cmdDiscard(): never {
    const token = arg('--token');
    if (!token) die('--token is required');
    const file = path.join(PENDING_DIR, `${token}.json`);
    if (fs.existsSync(file)) fs.unlinkSync(file);
    if (flag('--revert-files')) {
        git(['checkout', '--', ...COMMIT_ALLOWLIST], { allowFail: true });
        git(['clean', '-fd', '--', ...COMMIT_ALLOWLIST], { allowFail: true });
    }
    out({ ok: true, action: 'discard', token });
}

function cmdStatus(): never {
    out({
        ok: true,
        branch: git(['rev-parse', '--abbrev-ref', 'HEAD']),
        publishBranch: PUBLISH_BRANCH,
        head: git(['rev-parse', '--short', 'HEAD']),
        pendingChanges: changedFiles(),
        pendingTokens: fs.existsSync(PENDING_DIR) ? fs.readdirSync(PENDING_DIR).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', '')) : [],
    });
}

function cmdSync(): never {
    // The bot's checkout is disposable; never let it accumulate state.
    git(['fetch', 'origin', PUBLISH_BRANCH]);
    git(['checkout', PUBLISH_BRANCH], { allowFail: true });
    git(['reset', '--hard', `origin/${PUBLISH_BRANCH}`]);
    git(['clean', '-fd', '--', ...COMMIT_ALLOWLIST], { allowFail: true });
    out({ ok: true, action: 'sync', branch: PUBLISH_BRANCH, head: git(['rev-parse', '--short', 'HEAD']) });
}

// ---------------------------------------------------------------------------

const USAGE = `site <command>

  describe --kind <k>                      field spec for a kind
  show     --kind <k> [--id <id>]          list entries, or show one
  add      --kind <k> --json '<obj>'       [--images a.jpg …]
                                           [--content-image f --analytics-image f]
                                           [--payment '<obj>'] [--image f] [--overwrite]
  edit     --kind <k> --id <id> --json '<partial>'   (metrics deep-merge)
  delete   --kind <k> --id <id>
  stage    --message '<msg>' [--summary '<text>']    → prints a token
  publish  --token <t> [--dry-run]
  discard  --token <t> [--revert-files]
  status                                   working tree + pending tokens
  sync                                     hard-reset checkout to origin

kinds: ${Object.keys(KINDS).join(', ')}`;

async function main() {
    const cmd = process.argv[2];
    switch (cmd) {
        case 'describe': return cmdDescribe();
        case 'show': return cmdShow();
        case 'add': return cmdAdd();
        case 'edit': return cmdEdit();
        case 'delete': return cmdDelete();
        case 'stage': return cmdStage();
        case 'publish': return cmdPublish();
        case 'discard': return cmdDiscard();
        case 'status': return cmdStatus();
        case 'sync': return cmdSync();
        default:
            console.log(USAGE);
            process.exit(cmd ? 1 : 0);
    }
}

main().catch((err) => die('unhandled error', err?.stack ?? String(err)));

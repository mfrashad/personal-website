/**
 * Surgical editing of the object literals in src/data/*.ts.
 *
 * These files are hand-maintained: 4-space indent, `// YYYY` dividers,
 * `new Date('…')` literals, single quotes except where the content contains an
 * apostrophe. Importing the module, mutating, and pretty-printing the array back
 * out would erase all of that and turn a twelve-line addition into a
 * three-hundred-line diff nobody can review on a phone.
 *
 * So: locate the entry by its anchor (`id: '…'`, or `url: '…'` for mentions),
 * brace-match outward to the enclosing object literal, and replace that span.
 * Everything else in the file is left byte-identical.
 */

import * as fs from 'fs';
import * as path from 'path';

export const REPO_ROOT = path.resolve(import.meta.dirname, '..', '..');

// ---------------------------------------------------------------------------
// value rendering — must match the surrounding hand-written style
// ---------------------------------------------------------------------------

/**
 * Quote a string the way the data files already do: single quotes normally,
 * double quotes when the value contains an apostrophe and no double quote
 * (matching e.g. "Taylor's University" in speaking.ts), otherwise single quotes
 * with the apostrophe escaped (matching 'Touch \'n Go' in content-creation.ts).
 */
export function quote(s: string): string {
    if (!s.includes("'")) return `'${s.replace(/\\/g, '\\\\')}'`;
    if (!s.includes('"')) return `"${s.replace(/\\/g, '\\\\')}"`;
    return `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function renderValue(v: unknown, indent: string, key?: string): string {
    if (v === null || v === undefined) return 'undefined';
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    if (typeof v === 'string') {
        // `date` on everything except media-mentions is a Date object in source.
        if (key === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(v)) return `new Date('${v}')`;
        return quote(v);
    }
    if (Array.isArray(v)) {
        if (v.length === 0) return '[]';
        const items = v.map((x) => renderValue(x, indent));
        const oneLine = `[${items.join(', ')}]`;
        // The data files keep short arrays inline; only wrap when genuinely long.
        if (oneLine.length + indent.length <= 110) return oneLine;
        return `[\n${items.map((i) => `${indent}    ${i}`).join(',\n')},\n${indent}]`;
    }
    if (typeof v === 'object') {
        const entries = Object.entries(v as Record<string, unknown>).filter(([, x]) => x !== undefined);
        if (!entries.length) return '{}';
        const body = entries
            .map(([k, x]) => `${indent}    ${renderKey(k)}: ${renderValue(x, `${indent}    `, k)},`)
            .join('\n');
        return `{\n${body}\n${indent}}`;
    }
    return String(v);
}

/** Quote a key only when it isn't a plain identifier (e.g. 'cafe-hopping'). */
function renderKey(k: string): string {
    return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : quote(k);
}

/**
 * Render one entry as it would be hand-written inside the array: 4-space base
 * indent for the braces, 8 for the fields, trailing comma on every line.
 * `fieldOrder` keeps output field order stable and matching the interface.
 */
export function renderEntry(obj: Record<string, unknown>, fieldOrder: string[]): string {
    const ordered: [string, unknown][] = [];
    for (const k of fieldOrder) if (obj[k] !== undefined) ordered.push([k, obj[k]]);
    for (const k of Object.keys(obj)) if (!fieldOrder.includes(k) && obj[k] !== undefined) ordered.push([k, obj[k]]);

    const body = ordered.map(([k, v]) => `        ${renderKey(k)}: ${renderValue(v, '        ', k)},`).join('\n');
    return `    {\n${body}\n    },`;
}

// ---------------------------------------------------------------------------
// locating entries
// ---------------------------------------------------------------------------

export interface Span {
    /** Index of the `{` that opens the entry (at line start incl. indent). */
    start: number;
    /** Index just past the entry's trailing `},` including the newline. */
    end: number;
    text: string;
}

/**
 * Find the object literal containing `anchorKey: anchorValue`.
 *
 * Scans for the anchor, walks backwards to the opening brace, then brace-matches
 * forward while skipping over string literals so a `{` inside a title can't
 * throw off the count.
 */
export function findEntrySpan(source: string, anchorKey: string, anchorValue: string): Span | null {
    const anchorRe = new RegExp(`${anchorKey}:\\s*(?:'${escapeRe(anchorValue)}'|"${escapeRe(anchorValue)}")`, 'g');
    const m = anchorRe.exec(source);
    if (!m) return null;

    let open = source.lastIndexOf('{', m.index);
    if (open === -1) return null;
    // Include the leading indentation on that line.
    const lineStart = source.lastIndexOf('\n', open) + 1;
    if (source.slice(lineStart, open).trim() === '') open = lineStart;

    const close = matchBrace(source, source.indexOf('{', open));
    if (close === -1) return null;

    let end = close + 1;
    if (source[end] === ',') end++;
    if (source[end] === '\n') end++;

    return { start: open, end, text: source.slice(open, end) };
}

function matchBrace(source: string, openIdx: number): number {
    let depth = 0;
    let i = openIdx;
    while (i < source.length) {
        const c = source[i];
        if (c === "'" || c === '"' || c === '`') {
            i = skipString(source, i);
            continue;
        }
        if (c === '/' && source[i + 1] === '/') {
            i = source.indexOf('\n', i);
            if (i === -1) return -1;
            continue;
        }
        if (c === '{') depth++;
        else if (c === '}') {
            depth--;
            if (depth === 0) return i;
        }
        i++;
    }
    return -1;
}

function skipString(source: string, start: number): number {
    const q = source[start];
    let i = start + 1;
    while (i < source.length) {
        if (source[i] === '\\') {
            i += 2;
            continue;
        }
        if (source[i] === q) return i + 1;
        i++;
    }
    return i;
}

function escapeRe(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ---------------------------------------------------------------------------
// array bounds
// ---------------------------------------------------------------------------

/** Span of the `[ … ]` body for `export const <name> … = [`. */
export function findArrayBody(source: string, exportName: string): { start: number; end: number } {
    const declRe = new RegExp(`export const ${escapeRe(exportName)}[^=]*=\\s*\\[`);
    const m = declRe.exec(source);
    if (!m) throw new Error(`Could not find "export const ${exportName} = ["`);
    // The bracket the regex matched — NOT indexOf('[', m.index), which would find
    // the one inside a type annotation like `: SpeakingEngagement[] =`.
    const open = m.index + m[0].length - 1;
    let depth = 0;
    let i = open;
    while (i < source.length) {
        const c = source[i];
        if (c === "'" || c === '"' || c === '`') {
            i = skipString(source, i);
            continue;
        }
        if (c === '/' && source[i + 1] === '/') {
            i = source.indexOf('\n', i);
            continue;
        }
        if (c === '[') depth++;
        else if (c === ']') {
            depth--;
            if (depth === 0) return { start: open + 1, end: i };
        }
        i++;
    }
    throw new Error(`Unterminated array literal for ${exportName}`);
}

// ---------------------------------------------------------------------------
// insertion
// ---------------------------------------------------------------------------

/**
 * Insert `entryText` before the first existing entry whose date is older,
 * keeping the newest-first ordering the files already use, and adding a
 * `// YYYY` divider when the year is new.
 *
 * Ordering is cosmetic for speaking/hackathons (the pages call sorting helpers)
 * but load-bearing for media-mentions, which index.astro renders raw and slices
 * to six. Doing it properly everywhere is cheaper than remembering which is which.
 */
export function insertDateOrdered(
    source: string,
    exportName: string,
    entryText: string,
    newDate: string,
    opts: { dividers: boolean }
): string {
    const body = findArrayBody(source, exportName);
    const region = source.slice(body.start, body.end);

    // Walk entries in document order and stop at the first one older than ours.
    const dateRe = /date:\s*(?:new Date\(\s*['"](\d{4}-\d{2}-\d{2})['"]\s*\)|['"](\d{4}-\d{2}-\d{2})['"])/g;
    let insertAt = -1;
    let mm: RegExpExecArray | null;
    while ((mm = dateRe.exec(region))) {
        const d = mm[1] ?? mm[2];
        if (d < newDate) {
            // start of the object literal containing this date
            const objOpen = region.lastIndexOf('{', mm.index);
            let lineStart = region.lastIndexOf('\n', objOpen) + 1;
            // Step back over any `// YYYY` divider (or other comment) sitting
            // directly above that entry, so a new divider goes above the old one
            // rather than stranding it over the wrong year's entries.
            for (;;) {
                const prevEnd = lineStart - 1;
                if (prevEnd <= 0) break;
                const prevStart = region.lastIndexOf('\n', prevEnd - 1) + 1;
                const prevLine = region.slice(prevStart, prevEnd).trim();
                if (prevLine.startsWith('//') || prevLine === '') lineStart = prevStart;
                else break;
            }
            insertAt = lineStart;
            break;
        }
    }

    const year = newDate.slice(0, 4);
    let block = entryText;

    if (opts.dividers) {
        const hasDivider = new RegExp(`^\\s*//\\s*${year}\\s*$`, 'm').test(region);
        if (!hasDivider) block = `    // ${year}\n${entryText}`;
    }

    if (insertAt === -1) {
        // Oldest entry — append at the end of the array.
        const trimmed = region.replace(/\s*$/, '');
        return source.slice(0, body.start) + trimmed + '\n' + block + '\n' + source.slice(body.end);
    }

    return (
        source.slice(0, body.start) +
        region.slice(0, insertAt) +
        block +
        '\n' +
        region.slice(insertAt) +
        source.slice(body.end)
    );
}

/** Append to the end of an array that has no meaningful ordering. */
export function appendToArray(source: string, exportName: string, entryText: string): string {
    const body = findArrayBody(source, exportName);
    const region = source.slice(body.start, body.end).replace(/\s*$/, '');
    return source.slice(0, body.start) + region + '\n' + entryText + '\n' + source.slice(body.end);
}

// ---------------------------------------------------------------------------
// record maps (contentPayments)
// ---------------------------------------------------------------------------

export function upsertRecordEntry(
    source: string,
    exportName: string,
    key: string,
    value: Record<string, unknown> | null
): string {
    const declRe = new RegExp(`(export const ${escapeRe(exportName)}[^=]*=\\s*)\\{`);
    const m = declRe.exec(source);
    if (!m) throw new Error(`Could not find "export const ${exportName} = {"`);
    // Same reasoning as findArrayBody: take the brace the regex matched.
    const open = m.index + m[0].length - 1;
    const close = matchBrace(source, open);
    const inner = source.slice(open + 1, close);

    const existing = findEntrySpanInRecord(inner, key);
    let next: string;
    if (value === null) {
        if (!existing) return source;
        next = inner.slice(0, existing.start) + inner.slice(existing.end);
    } else {
        const rendered = `    ${quote(key)}: ${renderValue(value, '    ')},`;
        next = existing
            ? inner.slice(0, existing.start) + rendered + '\n' + inner.slice(existing.end)
            : inner.replace(/\s*$/, '') + (inner.trim() ? '\n' : '\n') + rendered + '\n';
    }
    if (!next.trim()) next = '';
    return source.slice(0, open + 1) + next + source.slice(close);
}

function findEntrySpanInRecord(inner: string, key: string): Span | null {
    const re = new RegExp(`^\\s*(?:'${escapeRe(key)}'|"${escapeRe(key)}"|${escapeRe(key)}):`, 'm');
    const m = re.exec(inner);
    if (!m) return null;
    const start = inner.lastIndexOf('\n', m.index) + 1;
    const braceOpen = inner.indexOf('{', m.index);
    const close = matchBrace(inner, braceOpen);
    let end = close + 1;
    if (inner[end] === ',') end++;
    if (inner[end] === '\n') end++;
    return { start, end, text: inner.slice(start, end) };
}

// ---------------------------------------------------------------------------
// safe file mutation
// ---------------------------------------------------------------------------

/**
 * Apply a transform to a file, restoring the original if anything downstream
 * throws. A half-applied edit that the agent then tries to repair by hand is
 * how a corrupted data file reaches a public site.
 */
export function editFile(relPath: string, fn: (src: string) => string): { before: string; after: string } {
    const abs = path.join(REPO_ROOT, relPath);
    const before = fs.readFileSync(abs, 'utf8');
    const after = fn(before);
    fs.writeFileSync(abs, after);
    return { before, after };
}

export function restoreFile(relPath: string, contents: string): void {
    fs.writeFileSync(path.join(REPO_ROOT, relPath), contents);
}

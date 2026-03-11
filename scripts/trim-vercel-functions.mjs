/**
 * Post-build script to remove large static-only directories from Vercel serverless functions.
 * These assets are already served from the CDN via .vercel/output/static/ and don't need
 * to be duplicated inside the function bundles.
 */
import { rm } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const OUTPUT = join(process.cwd(), '.vercel', 'output', 'functions');

// Directories to remove from each function (static-only assets)
const STRIP_DIRS = ['public/content-generator', 'public/resource-images'];

// Find all .func directories
const funcDirs = ['_render.func', '_isr.func'];

let removed = 0;
for (const func of funcDirs) {
    for (const dir of STRIP_DIRS) {
        const target = join(OUTPUT, func, dir);
        if (existsSync(target)) {
            await rm(target, { recursive: true, force: true });
            console.log(`Removed ${func}/${dir}`);
            removed++;
        }
    }
}

if (removed > 0) {
    console.log(`Trimmed ${removed} directories from serverless functions.`);
} else {
    console.log('No directories to trim (not a Vercel build?).');
}

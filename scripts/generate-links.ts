#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import glob from 'fast-glob';
import { slug as slugger } from 'github-slugger';

/**
 * Generates a link graph from wiki-style [[links]] in content files
 * Outputs nodes (pages) and edges (connections) for backlinks feature
 */

const CONTENT_DIR = path.join(process.cwd(), 'src/content');
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/link-graph.json');

interface Node {
    slug: string;
    title: string;
    path: string;
    collection: string;
}

interface Edge {
    source: string; // slug of source page
    target: string; // slug of target page
}

interface LinkGraph {
    nodes: Node[];
    edges: Edge[];
    backlinks: Record<string, string[]>; // reverse index: slug -> array of slugs that link to it
}

/**
 * Extract wiki links from markdown content
 * Matches [[Page Title]] or [[Page Title|Display Text]]
 */
function extractWikiLinks(content: string): string[] {
    const wikiLinkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
    const matches: string[] = [];
    let match;

    while ((match = wikiLinkRegex.exec(content)) !== null) {
        matches.push(match[1].trim());
    }

    return matches;
}

/**
 * Extract frontmatter from markdown content
 */
function extractFrontmatter(content: string): Record<string, any> | null {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) return null;

    const frontmatter: Record<string, any> = {};
    const lines = frontmatterMatch[1].split('\n');

    for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) continue;

        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();

        // Remove quotes
        value = value.replace(/^['"]|['"]$/g, '');

        frontmatter[key] = value;
    }

    return frontmatter;
}

/**
 * Convert page title to slug (same logic as remark-wiki-link)
 */
function titleToSlug(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-');
}

async function generateLinkGraph() {
    console.log('🔗 Generating link graph...\n');

    // Find all content files
    const contentFiles = await glob('**/*.{md,mdx}', {
        cwd: CONTENT_DIR,
        absolute: true
    });

    console.log(`Found ${contentFiles.length} content files\n`);

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const backlinks: Record<string, string[]> = {};

    // First pass: Build nodes
    for (const filePath of contentFiles) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const frontmatter = extractFrontmatter(content);

        if (!frontmatter || !frontmatter.title) {
            console.log(`⚠️  Skipping ${path.basename(filePath)} - no title in frontmatter`);
            continue;
        }

        const relativePath = path.relative(CONTENT_DIR, filePath);
        const [collection, ...rest] = relativePath.split(path.sep);
        const fileName = path.basename(filePath, path.extname(filePath));
        const pageSlug = titleToSlug(frontmatter.title);

        const node: Node = {
            slug: pageSlug,
            title: frontmatter.title,
            path: `/${collection}/${fileName}`,
            collection
        };

        nodes.push(node);
        backlinks[pageSlug] = []; // Initialize backlinks array
    }

    console.log(`Created ${nodes.length} nodes\n`);

    // Second pass: Build edges from wiki links
    for (const filePath of contentFiles) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const frontmatter = extractFrontmatter(content);

        if (!frontmatter || !frontmatter.title) continue;

        const sourceSlug = titleToSlug(frontmatter.title);
        const wikiLinks = extractWikiLinks(content);

        for (const linkTitle of wikiLinks) {
            const targetSlug = titleToSlug(linkTitle);

            // Check if target exists in nodes
            const targetNode = nodes.find((n) => n.slug === targetSlug);

            if (targetNode) {
                edges.push({
                    source: sourceSlug,
                    target: targetSlug
                });

                // Add to backlinks (reverse index)
                if (!backlinks[targetSlug]) {
                    backlinks[targetSlug] = [];
                }
                if (!backlinks[targetSlug].includes(sourceSlug)) {
                    backlinks[targetSlug].push(sourceSlug);
                }
            } else {
                console.log(`⚠️  Broken link: [[${linkTitle}]] in ${frontmatter.title}`);
            }
        }
    }

    console.log(`Created ${edges.length} edges\n`);

    // Count backlinks
    const pagesWithBacklinks = Object.values(backlinks).filter((links) => links.length > 0).length;
    console.log(`${pagesWithBacklinks} pages have backlinks\n`);

    // Build final graph
    const linkGraph: LinkGraph = {
        nodes,
        edges,
        backlinks
    };

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(linkGraph, null, 2), 'utf-8');

    console.log(`✅ Link graph saved to: ${path.relative(process.cwd(), OUTPUT_FILE)}\n`);
    console.log('─'.repeat(50));
    console.log(`\n📊 Summary:`);
    console.log(`   Nodes: ${nodes.length}`);
    console.log(`   Edges: ${edges.length}`);
    console.log(`   Pages with backlinks: ${pagesWithBacklinks}\n`);
}

// Run generator
generateLinkGraph().catch((error) => {
    console.error('Fatal error generating link graph:', error);
    process.exit(1);
});

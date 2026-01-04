#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import glob from 'fast-glob';

/**
 * Generates topic index from content frontmatter
 * Extracts topics, tags, and categories to build searchable index
 */

const CONTENT_DIR = path.join(process.cwd(), 'src/content');
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/topics.json');

interface PostReference {
    slug: string;
    title: string;
    collection: string;
    date: string;
}

interface TopicData {
    name: string;
    count: number;
    posts: PostReference[];
}

interface TopicsIndex {
    topics: TopicData[];
    totalPosts: number;
    lastUpdated: string;
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

        // Handle arrays (topics, tags)
        if (value.startsWith('[') && value.endsWith(']')) {
            try {
                frontmatter[key] = JSON.parse(value);
            } catch {
                frontmatter[key] = [];
            }
        } else {
            // Remove quotes
            value = value.replace(/^['"]|['"]$/g, '');
            frontmatter[key] = value;
        }
    }

    return frontmatter;
}

/**
 * Convert title to slug
 */
function titleToSlug(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-');
}

async function generateTopics() {
    console.log('🏷️  Generating topics index...\n');

    // Find all content files
    const contentFiles = await glob('**/*.{md,mdx}', {
        cwd: CONTENT_DIR,
        absolute: true
    });

    console.log(`Found ${contentFiles.length} content files\n`);

    // Map to store topic -> posts
    const topicMap = new Map<string, PostReference[]>();
    let processedCount = 0;

    for (const filePath of contentFiles) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const frontmatter = extractFrontmatter(content);

        if (!frontmatter || !frontmatter.title) {
            console.log(`⚠️  Skipping ${path.basename(filePath)} - no title in frontmatter`);
            continue;
        }

        const relativePath = path.relative(CONTENT_DIR, filePath);
        const [collection, ...rest] = relativePath.split(path.sep);
        const slug = titleToSlug(frontmatter.title);

        const postRef: PostReference = {
            slug,
            title: frontmatter.title,
            collection,
            date: frontmatter.date || new Date().toISOString()
        };

        // Collect all topic sources
        const allTopics = new Set<string>();

        // Add from topics array
        if (frontmatter.topics && Array.isArray(frontmatter.topics)) {
            frontmatter.topics.forEach((topic: string) => allTopics.add(topic));
        }

        // Add from tags array
        if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
            frontmatter.tags.forEach((tag: string) => allTopics.add(tag));
        }

        // Add from category (legacy support)
        if (frontmatter.category && typeof frontmatter.category === 'string') {
            allTopics.add(frontmatter.category);
        }

        // Add post to each topic
        allTopics.forEach((topic) => {
            if (!topicMap.has(topic)) {
                topicMap.set(topic, []);
            }
            topicMap.get(topic)!.push(postRef);
        });

        processedCount++;
    }

    console.log(`Processed ${processedCount} posts\n`);
    console.log(`Found ${topicMap.size} unique topics\n`);

    // Convert map to sorted array
    const topics: TopicData[] = Array.from(topicMap.entries())
        .map(([name, posts]) => ({
            name,
            count: posts.length,
            posts: posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        }))
        .sort((a, b) => b.count - a.count); // Sort by count descending

    // Build index
    const topicsIndex: TopicsIndex = {
        topics,
        totalPosts: processedCount,
        lastUpdated: new Date().toISOString()
    };

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(topicsIndex, null, 2), 'utf-8');

    console.log(`✅ Topics index saved to: ${path.relative(process.cwd(), OUTPUT_FILE)}\n`);
    console.log('─'.repeat(50));
    console.log(`\n📊 Summary:`);
    console.log(`   Total topics: ${topics.length}`);
    console.log(`   Total posts: ${processedCount}`);
    console.log(`\n🔝 Top 10 topics:`);
    topics.slice(0, 10).forEach((topic, i) => {
        console.log(`   ${i + 1}. ${topic.name} (${topic.count} posts)`);
    });
    console.log('');
}

// Run generator
generateTopics().catch((error) => {
    console.error('Fatal error generating topics:', error);
    process.exit(1);
});

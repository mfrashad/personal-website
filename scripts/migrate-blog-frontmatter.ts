#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import glob from 'fast-glob';

/**
 * Migration script to add growth stage and digital garden fields
 * to existing blog post frontmatter
 */

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

interface FrontmatterUpdate {
    growthStage?: string;
    topics?: string[];
    tags?: string[];
    aliases?: string[];
    enableWebmentions?: boolean;
}

async function migrateBlogPosts() {
    console.log('🔄 Starting blog post migration...\n');

    // Find all markdown files in blog directory
    const blogPosts = await glob('*.md', {
        cwd: BLOG_DIR,
        absolute: true
    });

    console.log(`Found ${blogPosts.length} blog posts to migrate\n`);

    let successCount = 0;
    let skipCount = 0;

    for (const postPath of blogPosts) {
        const fileName = path.basename(postPath);
        console.log(`Processing: ${fileName}`);

        try {
            const content = fs.readFileSync(postPath, 'utf-8');

            // Check if already has growth stage
            if (content.includes('growthStage:')) {
                console.log(`  ⏭️  Already migrated, skipping\n`);
                skipCount++;
                continue;
            }

            // Split frontmatter and content
            const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

            if (!frontmatterMatch) {
                console.log(`  ⚠️  No frontmatter found, skipping\n`);
                skipCount++;
                continue;
            }

            const [, frontmatter, bodyContent] = frontmatterMatch;

            // Extract category from frontmatter to populate tags
            const categoryMatch = frontmatter.match(/category:\s*['"]?([^'"\n]+)['"]?/);
            const category = categoryMatch ? categoryMatch[1].trim() : '';

            // Build new frontmatter fields
            const newFields: FrontmatterUpdate = {
                growthStage: 'budding',
                topics: [],
                tags: category ? [category] : [],
                aliases: [],
                enableWebmentions: true
            };

            // Construct updated frontmatter
            const updatedFrontmatter = `---
${frontmatter}
growthStage: '${newFields.growthStage}'
topics: ${JSON.stringify(newFields.topics)}
tags: ${JSON.stringify(newFields.tags)}
aliases: ${JSON.stringify(newFields.aliases)}
enableWebmentions: ${newFields.enableWebmentions}
---
${bodyContent}`;

            // Write back to file
            fs.writeFileSync(postPath, updatedFrontmatter, 'utf-8');

            console.log(`  ✅ Migrated successfully`);
            console.log(`     Growth Stage: ${newFields.growthStage}`);
            console.log(`     Tags: ${JSON.stringify(newFields.tags)}\n`);

            successCount++;
        } catch (error) {
            console.error(`  ❌ Error migrating ${fileName}:`, error);
            console.log('');
        }
    }

    console.log('─'.repeat(50));
    console.log(`\n✨ Migration complete!`);
    console.log(`   Successfully migrated: ${successCount}`);
    console.log(`   Skipped: ${skipCount}`);
    console.log(`   Total: ${blogPosts.length}\n`);
}

// Run migration
migrateBlogPosts().catch((error) => {
    console.error('Fatal error during migration:', error);
    process.exit(1);
});

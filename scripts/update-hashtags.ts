import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { extractHashtags } from '../src/utils/hashtags';

/**
 * Script to scan markdown files and update their frontmatter with detected hashtags
 * Usage: node --loader tsx scripts/update-hashtags.ts
 */

const CONTENT_DIRS = [
    'src/content/blog',
    'src/content/essays',
    'src/content/notes'
];

interface UpdateOptions {
    merge: boolean; // If true, merge with existing tags. If false, replace
    dryRun: boolean; // If true, don't actually write files
}

async function getAllMarkdownFiles(dir: string): Promise<string[]> {
    const files: string[] = [];

    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                const subFiles = await getAllMarkdownFiles(fullPath);
                files.push(...subFiles);
            } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
                files.push(fullPath);
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
    }

    return files;
}

async function updateFileHashtags(
    filePath: string,
    options: UpdateOptions
): Promise<{ updated: boolean; hashtags: string[]; existing: string[] }> {
    const content = await fs.readFile(filePath, 'utf-8');
    const { data: frontmatter, content: markdownContent } = matter(content);

    // Extract hashtags from content
    const detectedHashtags = await extractHashtags(markdownContent);

    if (detectedHashtags.length === 0) {
        return { updated: false, hashtags: [], existing: frontmatter.tags || [] };
    }

    const existingTags = frontmatter.tags || [];
    let newTags: string[];

    if (options.merge) {
        // Merge detected hashtags with existing tags
        const allTags = new Set([...existingTags, ...detectedHashtags]);
        newTags = Array.from(allTags).sort();
    } else {
        // Replace with detected hashtags only
        newTags = detectedHashtags;
    }

    // Check if tags actually changed
    const tagsChanged = JSON.stringify(existingTags.sort()) !== JSON.stringify(newTags);

    if (!tagsChanged) {
        return { updated: false, hashtags: newTags, existing: existingTags };
    }

    // Update frontmatter
    frontmatter.tags = newTags;

    if (!options.dryRun) {
        // Write updated content back to file
        const updatedContent = matter.stringify(markdownContent, frontmatter);
        await fs.writeFile(filePath, updatedContent, 'utf-8');
    }

    return { updated: true, hashtags: newTags, existing: existingTags };
}

async function main() {
    const args = process.argv.slice(2);
    const options: UpdateOptions = {
        merge: !args.includes('--replace'),
        dryRun: args.includes('--dry-run')
    };

    console.log('🔍 Scanning for hashtags in markdown files...\n');
    console.log(`Mode: ${options.merge ? 'MERGE' : 'REPLACE'} tags`);
    console.log(`Dry run: ${options.dryRun ? 'YES (no files will be modified)' : 'NO (files will be updated)'}\n`);

    let totalFiles = 0;
    let updatedFiles = 0;

    for (const dir of CONTENT_DIRS) {
        const dirPath = path.join(process.cwd(), dir);

        try {
            await fs.access(dirPath);
        } catch {
            console.log(`⚠️  Directory not found: ${dir}`);
            continue;
        }

        const files = await getAllMarkdownFiles(dirPath);
        console.log(`📁 Processing ${files.length} files in ${dir}...`);

        for (const file of files) {
            totalFiles++;
            const relativePath = path.relative(process.cwd(), file);

            try {
                const result = await updateFileHashtags(file, options);

                if (result.updated) {
                    updatedFiles++;
                    console.log(`  ✅ ${relativePath}`);
                    console.log(`     Before: [${result.existing.join(', ')}]`);
                    console.log(`     After:  [${result.hashtags.join(', ')}]`);
                } else if (result.hashtags.length > 0) {
                    console.log(`  ⏭️  ${relativePath} (no changes needed)`);
                }
            } catch (error) {
                console.error(`  ❌ Error processing ${relativePath}:`, error);
            }
        }

        console.log('');
    }

    console.log('━'.repeat(60));
    console.log(`\n📊 Summary:`);
    console.log(`   Total files scanned: ${totalFiles}`);
    console.log(`   Files ${options.dryRun ? 'that would be' : ''} updated: ${updatedFiles}`);

    if (options.dryRun) {
        console.log('\n💡 Run without --dry-run to actually update the files');
    }

    console.log('\n✨ Done!\n');
}

main().catch(console.error);

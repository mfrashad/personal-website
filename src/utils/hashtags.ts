import { remark } from 'remark';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';

/**
 * Extract hashtags from markdown content
 * Finds all instances of #word (but not ##heading or ###heading)
 */
export async function extractHashtags(markdown: string): Promise<string[]> {
    const hashtags = new Set<string>();

    const processor = remark()
        .use(remarkParse)
        .use(() => (tree) => {
            visit(tree, 'text', (node: any) => {
                // Match hashtags: # followed by word characters
                // Negative lookbehind to exclude headings (## or ###)
                const regex = /(?:^|[^#\w])#([\w-]+)(?:[^#\w]|$)/g;
                let match;

                while ((match = regex.exec(node.value)) !== null) {
                    const tag = match[1].toLowerCase();
                    hashtags.add(tag);
                }
            });
        });

    await processor.process(markdown);

    return Array.from(hashtags).sort();
}

/**
 * Merge manually defined tags with auto-detected hashtags from content
 */
export async function mergeTagsWithHashtags(
    manualTags: string[] = [],
    content: string
): Promise<string[]> {
    const autoTags = await extractHashtags(content);
    const allTags = new Set([...manualTags, ...autoTags]);
    return Array.from(allTags).sort();
}

/**
 * Extract hashtags from plain text (for non-markdown content)
 */
export function extractHashtagsFromText(text: string): string[] {
    const hashtags = new Set<string>();
    const regex = /(?:^|[^#\w])#([\w-]+)(?:[^#\w]|$)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
        const tag = match[1].toLowerCase();
        hashtags.add(tag);
    }

    return Array.from(hashtags).sort();
}

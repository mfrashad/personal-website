import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root } from 'mdast';

/**
 * Remark plugin to extract hashtags from markdown content
 * Stores extracted hashtags in vfile.data.hashtags
 */
export const remarkExtractHashtags: Plugin<[], Root> = () => {
    return (tree, file) => {
        const hashtags = new Set<string>();

        visit(tree, 'text', (node) => {
            // Match hashtags: # followed by word characters
            // This regex avoids matching headings (## or ###)
            const regex = /(?:^|[^#\w])#([\w-]+)(?:[^#\w]|$)/g;
            let match;

            while ((match = regex.exec(node.value)) !== null) {
                const tag = match[1].toLowerCase();
                hashtags.add(tag);
            }
        });

        // Also check in links and emphasis
        visit(tree, ['link', 'emphasis', 'strong'], (node: any) => {
            if (node.children) {
                node.children.forEach((child: any) => {
                    if (child.type === 'text') {
                        const regex = /(?:^|[^#\w])#([\w-]+)(?:[^#\w]|$)/g;
                        let match;
                        while ((match = regex.exec(child.value)) !== null) {
                            hashtags.add(match[1].toLowerCase());
                        }
                    }
                });
            }
        });

        // Store hashtags in file data for later use
        file.data.hashtags = Array.from(hashtags).sort();
    };
};

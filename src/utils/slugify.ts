/**
 * Creates a URL-friendly slug from a title
 */
export function slugify(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Removes the first H1 heading from markdown content
 */
export function removeFirstH1(markdown: string): string {
    const lines = markdown.split('\n');
    if (lines[0]?.trim().startsWith('# ')) {
        return lines.slice(1).join('\n').trim();
    }
    return markdown;
}

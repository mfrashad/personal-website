const CLEVE_API_KEY = import.meta.env.CLEVE_API_KEY || process.env.CLEVE_API_KEY;
const CLEVE_API_URL = 'https://hkqfndytgnnwadrfsfvp.supabase.co/functions/v1/preview-public-api/v1/writings';

export interface CleveWriting {
    id: string;
    title: string;
    category: string;
    created_at: string;
    updated_at: string;
    content_markdown: string;
}

export interface CleveResponse {
    data: CleveWriting[];
    pagination: {
        page: number;
        per_page: number;
        total: number;
        total_pages: number;
    };
}

/**
 * Extract an excerpt from markdown content
 * Takes the first paragraph after the title
 */
function extractExcerpt(markdown: string, maxLength: number = 200): string {
    // Remove title (first line starting with #)
    const lines = markdown.split('\n');
    const contentLines = lines.filter(line => !line.trim().startsWith('#') && line.trim() !== '');

    // Get first non-empty paragraph
    const firstParagraph = contentLines.find(line => line.trim().length > 0) || '';

    // Truncate to maxLength
    if (firstParagraph.length > maxLength) {
        return firstParagraph.substring(0, maxLength).trim() + '...';
    }

    return firstParagraph.trim();
}

/**
 * Infer a category/topic from the title or content
 * Maps to one of our existing categories
 */
function inferCategory(title: string, content: string): string {
    const titleLower = title.toLowerCase();
    const contentLower = content.toLowerCase();

    // Check for programming/tech keywords
    if (titleLower.includes('code') || titleLower.includes('tech') || titleLower.includes('ai') ||
        contentLower.includes('programming') || contentLower.includes('software')) {
        return 'technology';
    }

    // Check for career/productivity keywords
    if (titleLower.includes('career') || titleLower.includes('success') || titleLower.includes('productivity') ||
        contentLower.includes('growth mindset') || contentLower.includes('bias for action')) {
        return 'productivity';
    }

    // Check for social/society keywords
    if (titleLower.includes('social') || titleLower.includes('society') || titleLower.includes('media') ||
        contentLower.includes('government') || contentLower.includes('policy')) {
        return 'society';
    }

    // Check for psychology/mindset keywords
    if (titleLower.includes('mindset') || titleLower.includes('inspire') || titleLower.includes('bragging') ||
        contentLower.includes('psychology') || contentLower.includes('mental')) {
        return 'psychology';
    }

    // Default to concepts for general writings
    return 'concepts';
}

/**
 * Fetch writings from Cleve API
 */
export async function fetchCleveWritings(): Promise<CleveWriting[]> {
    if (!CLEVE_API_KEY) {
        console.warn('CLEVE_API_KEY not set, using empty data');
        return [];
    }

    try {
        const response = await fetch(
            `${CLEVE_API_URL}?format=markdown&category=notes&per_page=100`,
            {
                headers: {
                    'Authorization': `Bearer ${CLEVE_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            console.error(`Cleve API error: ${response.status} ${response.statusText}`);
            return [];
        }

        const data: CleveResponse = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching Cleve writings:', error);
        return [];
    }
}

/**
 * Transform Cleve writings to garden note format
 */
export function transformCleveWritings(writings: CleveWriting[]) {
    return writings.map(writing => {
        const excerpt = extractExcerpt(writing.content_markdown);
        const category = inferCategory(writing.title, writing.content_markdown);

        return {
            name: `${writing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`,
            path: category,
            body: writing.content_markdown,
            frontmatter: {
                description: excerpt,
                created: writing.created_at,
                edited: writing.updated_at
            },
            // Keep original data for reference
            _original: {
                id: writing.id,
                title: writing.title,
                category: writing.category
            }
        };
    });
}

/**
 * Get categorized writings
 */
export async function getCategorizedWritings() {
    const writings = await fetchCleveWritings();
    const transformed = transformCleveWritings(writings);

    // Group by category and count
    const categoryCounts: Record<string, number> = {};
    transformed.forEach(note => {
        categoryCounts[note.path] = (categoryCounts[note.path] || 0) + 1;
    });

    const categories = Object.entries(categoryCounts).map(([name, count]) => ({
        name,
        type: 'tree',
        path: `/garden/${name}`,
        object: {
            text: '',
            byteSize: 0,
            entries: Array(count).fill(null).map((_, i) => ({ name: `note-${i}.md` }))
        }
    }));

    return {
        notes: transformed,
        categories
    };
}

/**
 * Get latest created notes
 */
export function getLatestCreated(notes: any[], limit: number = 9) {
    return [...notes]
        .sort((a, b) => new Date(b.frontmatter.created).getTime() - new Date(a.frontmatter.created).getTime())
        .slice(0, limit);
}

/**
 * Get latest updated notes
 */
export function getLatestUpdated(notes: any[], limit: number = 9) {
    return [...notes]
        .sort((a, b) => new Date(b.frontmatter.edited).getTime() - new Date(a.frontmatter.edited).getTime())
        .slice(0, limit);
}

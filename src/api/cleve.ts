import { ConvexHttpClient } from 'convex/browser';
import { anyApi } from 'convex/server';

const CONVEX_URL = import.meta.env.PUBLIC_CONVEX_URL || process.env.PUBLIC_CONVEX_URL || '';
const CLEVE_PROFILE_SLUG = (typeof import.meta !== 'undefined' && import.meta.env?.CLEVE_PROFILE_SLUG) || process.env.CLEVE_PROFILE_SLUG || 'mfrashad';

export interface CleveWriting {
    id: string;
    title: string;
    category: string;
    tags: string[];
    publishedAt: number;
    updatedAt: number;
    markdown: string;
}

interface PublishedNoteSummary {
    _id: string;
    title?: string;
    publishedAt?: number;
    updatedAt: number;
}

interface PublishedNoteDetail {
    _id: string;
    _creationTime: number;
    title?: string;
    content: string;
    updatedAt: number;
    publishedAt?: number;
    owner: { _id: string; name?: string; slug: string };
    snapshot: { content: string; version: number } | null;
}

// Original creation dates from legacy Supabase DB, keyed by title.
// Used because the Convex import lost original dates and bulk-publish set publishedAt to the publish time.
const ORIGINAL_DATES: Record<string, number> = {
    '10/2 - February Week #1 Review': 1770692785181,
    '8/2 - Content Planning': 1770557190513,
    '4/2 - Refactored Cleve onboarding & Sofea': 1770266300054,
    'Ideas I want to share/remind': 1770149048383,
    'Improving eloquency with rehearsed thoughts': 1770046107929,
    'How to write a a review': 1770041428134,
    'The 80/20 rule lists': 1770040413503,
    'Movie Review: Hamilton (Broadway)': 1770040301967,
    '2/2 - Reading Empire of AI': 1770039720693,
    'Books Reviews': 1769954090209,
    '1/2 - Reading Empire of AI': 1769923243787,
    'Book Review: Stubborn Skill Grinder in a Timeloop': 1769922905699,
    'Book Review: The Art and Business of Online Writing': 1769922613566,
    'Polished Version': 1769921791806,
    'On the Moltbook, AI social media trend': 1769921510644,
    '31/1 - Reading and submitted brand content': 1769831804000,
    '30/1': 1769750237062,
    '30/1 - Reading and applied to Mozilla Fellowship': 1769745235000,
    '29/1 - Hospital Review: UMSC - Stroke Treatment': 1769698883829,
    '29/1': 1769663571000,
    'Movie review: Pompo The Cinephile': 1769619071534,
    '28/1': 1769583403366,
    '27/1': 1769513257715,
    'The Will of Many Book Review': 1769372225564,
    'Weekly Reviews': 1769364533342,
    'January Review': 1769364304386,
    'How to overcome 80/20 rule': 1769328416812,
    '25/1 - Finished Hamilton and work': 1769327828262,
    '24/1 - Work': 1769258745439,
    '23/1 - Updated Cleve app': 1769144410146,
    'My dad medical history': 1769054996567,
    'Dopamine Detox': 1769054297371,
    'Cleve Authentication Bug and losing note': 1769051703356,
    'Things to do:': 1768984564405,
    '21/1 - Tiny Bookshop Game Review - Book Recommendation Gameplay': 1768983994917,
    'Emotion Regulation': 1768879313166,
    'Narrative angle (WIP)': 1768801756653,
    'My High and Lows': 1768801490687,
    'List of Fellowship': 1768714937460,
    '17/1 - Peach & Cream Content Dinner': 1768637904287,
    '16/1 - MRI Scan': 1768562100524,
    '15/1 - Cleve Chrome Extension': 1768475685711,
    '14/1 - Cleve Chrome Extension for syncing saved posts': 1768393703819,
    '13/1 - Cleve Transcriber, edit mode': 1768290731534,
    '12/1 - AI edit mode': 1768188433706,
    '11/1 - File Tree System': 1768143390728,
    '10/1- Subscription Experience': 1768143382630,
    '9/1 - Claude Code with Linear MCP is great': 1768017144636,
    '9/1 - Best hospitals to visit for stroke?': 1768017008169,
    'Notes vs blog (this writings are notes not blog)': 1767920785543,
    '8/1 First day in office after new year and meeting Sofea': 1767919999888,
    'We got into 500 Global AI residency': 1767916114969,
    '8/1 - On health and working harder': 1767862274910,
    '7/1 - GTD, Obsidian': 1767811775526,
    'Getting Things Done': 1767811256309,
    'Breakout Escape Room Spy Game review': 1767711935796,
    'Features I want in Cleve': 1767624995531,
    "It's okay to do cool features instead of what your customer want for your own motivation": 1767624475336,
    'Lists of bugs of this personal website': 1767623746374,
    'My Goals 2026': 1767621829575,
    'Lists of my favorites': 1767542839109,
    'I will start journaling from Cleve now': 1767535125137,
    'My Unconventional Career Path': 1767395028837,
    'Toastmaster Speech Structure': 1767394229426,
    'What Differentiate Bragging and Inspiring': 1767394108852,
    'Keys to Success are Growth Mindset & Bias for Action': 1767394048081,
    'Fake it till you make vs being amateur openly': 1767393944938,
    'on social media ban and e-kyc': 1767393379212,
};

const HASHTAG_REGEX = /(?<=\s|^)#([a-zA-Z][\w-]*)/g;

function extractHashtags(text: string): { tags: string[]; cleaned: string } {
    const tags = new Set<string>();
    const cleaned = text.replace(HASHTAG_REGEX, (_match, tag) => {
        tags.add(tag.toLowerCase());
        return '';
    });
    return { tags: [...tags], cleaned: cleaned.replace(/\n{3,}/g, '\n\n').trim() };
}

export async function fetchCleveWritings(): Promise<{
    writings: CleveWriting[];
    folders: never[];
}> {
    if (!CONVEX_URL) return { writings: [], folders: [] };
    try {
        const client = new ConvexHttpClient(CONVEX_URL);
        const slug = CLEVE_PROFILE_SLUG;

        // 1. Get list of published notes (lightweight — no content)
        const summaries: PublishedNoteSummary[] = await client.query(
            anyApi.notes.api.publishing.getPublishedNotes,
            { slug }
        );

        if (summaries.length === 0) {
            return { writings: [], folders: [] };
        }

        // 2. Fetch full content for each note in parallel
        const details = await Promise.all(
            summaries.map(async (summary) => {
                try {
                    const detail: PublishedNoteDetail | null = await client.query(
                        anyApi.notes.api.publishing.getPublishedNote,
                        { slug, noteId: summary._id }
                    );
                    return detail;
                } catch {
                    return null;
                }
            })
        );

        const writings: CleveWriting[] = details
            .filter((d): d is PublishedNoteDetail => d != null)
            .map((note) => {
                // content is plain text extracted from ProseMirror
                const { tags, cleaned } = extractHashtags(note.content || '');
                const title = note.title || 'Untitled';
                return {
                    id: note._id,
                    title,
                    category: 'notes',
                    tags,
                    publishedAt: ORIGINAL_DATES[title] || note._creationTime || note.publishedAt || note.updatedAt,
                    updatedAt: note.updatedAt,
                    markdown: cleaned,
                };
            });

        return { writings, folders: [] };
    } catch (error) {
        console.error('Error fetching Cleve writings:', error);
        return { writings: [], folders: [] };
    }
}

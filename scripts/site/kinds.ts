/**
 * The five editable content kinds, and everything that differs between them.
 *
 * Keeping this as data rather than prose is the point: the four schemas differ
 * in exactly the ways that are easiest to confuse — `date` is a `new Date(...)`
 * literal everywhere except media-mentions, where it is a plain string; only
 * media-mentions lacks an `id`; only speaking/hackathons carry photo galleries.
 * A model reading a SKILL.md will mix those up. A table will not.
 */

export type KindName = 'speaking' | 'hackathon' | 'mention' | 'content' | 'brandlogo';

export interface FieldSpec {
    name: string;
    required?: boolean;
    /** One of these values, or free text if absent. */
    enum?: string[];
    type?: 'string' | 'number' | 'boolean' | 'date' | 'string[]' | 'object';
    help: string;
}

export interface KindSpec {
    file: string;
    exportName: string;
    /** Field used to identify an entry uniquely. */
    anchor: string;
    /** Insert newest-first with `// YYYY` dividers, vs plain append. */
    ordered: boolean;
    dividers: boolean;
    fieldOrder: string[];
    fields: FieldSpec[];
    /** Photo handling, if any. */
    images?: 'engagement' | 'content' | 'logo';
    notes: string;
}

export const KINDS: Record<KindName, KindSpec> = {
    speaking: {
        file: 'src/data/speaking.ts',
        exportName: 'speakingEngagements',
        anchor: 'id',
        ordered: true,
        dividers: true,
        fieldOrder: ['id', 'date', 'title', 'event', 'organizer', 'description', 'location', 'audience', 'fee', 'type', 'topics', 'logos', 'featured'],
        images: 'engagement',
        notes: 'Talks, panels, interviews, workshops. Detail page at /speaking/<id>.',
        fields: [
            { name: 'id', required: true, help: "Slug plus year, e.g. 'friends-of-figma-2025'. Must be unique." },
            { name: 'date', required: true, type: 'date', help: "YYYY-MM-DD. Written to source as new Date('…')." },
            { name: 'title', required: true, help: 'The talk title, not the event name.' },
            { name: 'event', required: true, help: "The event, e.g. 'Friends of Figma Talk'." },
            { name: 'organizer', required: true, help: 'Who ran it.' },
            { name: 'type', required: true, enum: ['talk', 'panel', 'interview', 'workshop', 'fireside'], help: 'Format of the appearance.' },
            { name: 'description', help: 'One or two sentences. Optional.' },
            { name: 'location', help: "e.g. 'Kuala Lumpur'. Optional." },
            { name: 'audience', help: "e.g. '200-250 tech professionals'. Optional." },
            { name: 'fee', help: 'Legacy free-text field, still public in this repo. Prefer leaving unset.' },
            { name: 'topics', type: 'string[]', help: "e.g. ['AI', 'Entrepreneurship']. Optional." },
            { name: 'logos', type: 'string[]', help: 'Root-relative paths under /speaking-logos/. Optional.' },
            { name: 'featured', type: 'boolean', help: 'Surfaces it on the homepage. Optional.' },
        ],
    },
    hackathon: {
        file: 'src/data/hackathons.ts',
        exportName: 'hackathonEngagements',
        anchor: 'id',
        ordered: true,
        dividers: true,
        fieldOrder: ['id', 'date', 'title', 'event', 'organizer', 'description', 'location', 'role', 'result', 'topics', 'logos', 'featured'],
        images: 'engagement',
        notes: 'Judging, mentoring, participating, sponsoring. Detail page at /hackathons/<id>.',
        fields: [
            { name: 'id', required: true, help: "Slug plus year, e.g. 'national-ai-competition-2026'. Must be unique." },
            { name: 'date', required: true, type: 'date', help: "YYYY-MM-DD. Written to source as new Date('…')." },
            { name: 'title', required: true, help: 'Competition or event title.' },
            { name: 'event', required: true, help: 'Event name.' },
            { name: 'organizer', required: true, help: 'Host organisation.' },
            { name: 'role', required: true, enum: ['judge', 'mentor', 'participant', 'sponsor'], help: 'Rashad\'s role.' },
            { name: 'description', help: 'One or two sentences. Optional.' },
            { name: 'location', help: 'Optional.' },
            { name: 'result', help: "Only for role=participant, e.g. 'Winner - $2,000'. Optional." },
            { name: 'topics', type: 'string[]', help: 'Optional.' },
            { name: 'logos', type: 'string[]', help: 'Paths under /speaking-logos/ (shared with talks). Optional.' },
            { name: 'featured', type: 'boolean', help: 'Optional.' },
        ],
    },
    mention: {
        file: 'src/data/media-mentions.ts',
        exportName: 'mediaMentions',
        anchor: 'url',
        ordered: true,
        dividers: false,
        fieldOrder: ['title', 'publication', 'date', 'url', 'excerpt', 'type', 'image'],
        notes:
            'Press coverage. NOTE: no id field — url is the identity. Array order is load-bearing: ' +
            'index.astro renders this list raw and slices the first six onto the homepage.',
        fields: [
            { name: 'title', required: true, help: 'Headline of the piece.' },
            { name: 'publication', required: true, help: "Outlet, e.g. 'The Star'." },
            { name: 'date', required: true, type: 'date', help: "YYYY-MM-DD. Stored as a plain STRING here, not new Date()." },
            { name: 'url', required: true, help: 'Link to the article. This is the unique identity.' },
            { name: 'type', required: true, enum: ['article', 'newspaper', 'radio', 'tv', 'podcast', 'video', 'interview'], help: 'Medium.' },
            { name: 'excerpt', help: 'Short pull quote. Optional.' },
            { name: 'image', help: 'Path under /media/. Optional.' },
        ],
    },
    content: {
        file: 'src/data/content-creation.ts',
        exportName: 'contentPieces',
        anchor: 'id',
        ordered: false,
        dividers: false,
        fieldOrder: ['id', 'title', 'location', 'date', 'type', 'platform', 'url', 'metrics', 'description', 'brand'],
        images: 'content',
        notes:
            'Videos on the /create portfolio. Array order is irrelevant — getContentByType() ' +
            're-sorts each category by views at build time.',
        fields: [
            { name: 'id', required: true, help: "Slug, e.g. 'hulu-cafe'. Must be unique. Used as the image directory name." },
            { name: 'title', required: true, help: 'Video title.' },
            { name: 'date', required: true, type: 'date', help: "YYYY-MM-DD. Written as new Date('…')." },
            { name: 'type', required: true, enum: ['cafe-hopping', 'educational', 'products', 'experience', 'personal-brand'], help: 'Category section.' },
            { name: 'platform', required: true, enum: ['tiktok', 'instagram', 'youtube'], help: 'Where it was posted.' },
            { name: 'metrics', required: true, type: 'object', help: 'views and likes required; comments, saves, shares, newFollowers optional.' },
            { name: 'location', help: 'Optional.' },
            { name: 'url', help: 'Optional; not currently rendered.' },
            { name: 'description', help: 'Optional.' },
            { name: 'brand', help: 'Collaborating brand, if any. Optional.' },
        ],
    },
    brandlogo: {
        file: 'src/data/content-creation.ts',
        exportName: 'brandLogos',
        anchor: 'name',
        ordered: false,
        dividers: false,
        fieldOrder: ['name', 'src'],
        images: 'logo',
        notes: 'Logos in the /create marquee. Filename slug is lowercase with all separators stripped.',
        fields: [
            { name: 'name', required: true, help: "Display name, e.g. 'Touch \\'n Go'. This is the identity." },
            { name: 'src', required: true, help: 'Set automatically from the uploaded image; do not pass by hand.' },
        ],
    },
};

/** Payments live in a sibling map, not on ContentPiece — see content-creation.ts. */
export const PAYMENTS_EXPORT = 'contentPayments';
export const PAYMENTS_FILE = 'src/data/content-creation.ts';
export const PAYMENT_FIELDS: FieldSpec[] = [
    { name: 'amount', required: true, type: 'number', help: 'Major units, e.g. 1500. A number, never a formatted string.' },
    { name: 'currency', required: true, help: "ISO 4217, e.g. 'MYR'." },
    { name: 'kind', required: true, enum: ['cash', 'barter', 'cash+barter', 'unpaid'], help: 'Distinguishes a real zero from missing data.' },
    { name: 'barterValue', type: 'number', help: 'Retail value of gifted product, same currency. Optional.' },
    { name: 'paidBy', help: 'Payer if not the brand itself. Optional.' },
    { name: 'invoiceId', help: "'INV-YYYYMMDD-NN'. Optional." },
    { name: 'paidOn', type: 'date', help: 'YYYY-MM-DD. Optional.' },
    { name: 'note', help: 'Optional.' },
];

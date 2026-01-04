import { defineCollection, z } from 'astro:content';

// Growth stage enum for digital garden notes
const growthStageEnum = z.enum(['seedling', 'budding', 'evergreen']).default('budding');

const blogCollection = defineCollection({
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            subtitle: z.string().optional(),
            image: image().optional(),
            description: z.string().optional(),
            date: z.date(),
            category: z.string().optional(),
            mastodonId: z.string().optional(),
            ogImageName: z.string().optional(),
            // New fields for digital garden features
            growthStage: growthStageEnum,
            topics: z.array(z.string()).optional().default([]),
            tags: z.array(z.string()).optional().default([]),
            aliases: z.array(z.string()).optional().default([]),
            enableWebmentions: z.boolean().optional().default(true),
            featured: z.boolean().optional().default(false),
            updated: z.date().optional()
        })
});

const essaysCollection = defineCollection({
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            subtitle: z.string().optional(),
            image: image().optional(),
            description: z.string().optional(),
            date: z.date(),
            updated: z.date().optional(),
            growthStage: growthStageEnum,
            topics: z.array(z.string()).optional().default([]),
            tags: z.array(z.string()).optional().default([]),
            aliases: z.array(z.string()).optional().default([]),
            enableWebmentions: z.boolean().optional().default(true),
            featured: z.boolean().optional().default(false),
            ogImageName: z.string().optional()
        })
});

const notesCollection = defineCollection({
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string().optional(),
            date: z.date(),
            updated: z.date().optional(),
            growthStage: growthStageEnum,
            topics: z.array(z.string()).optional().default([]),
            tags: z.array(z.string()).optional().default([]),
            aliases: z.array(z.string()).optional().default([]),
            enableWebmentions: z.boolean().optional().default(true),
            image: image().optional()
        })
});

// Talks are now managed in src/data/speaking.ts instead of content collections
// const talksCollection = defineCollection({
//     schema: ({ image }) =>
//         z.object({
//             title: z.string(),
//             description: z.string().optional(),
//             date: z.date(),
//             event: z.string().optional(),
//             location: z.string().optional(),
//             slidesUrl: z.string().optional(),
//             videoUrl: z.string().optional(),
//             recordingUrl: z.string().optional(),
//             image: image().optional(),
//             topics: z.array(z.string()).optional().default([]),
//             featured: z.boolean().optional().default(false)
//         })
// });

export const collections = {
    blog: blogCollection,
    essays: essaysCollection,
    notes: notesCollection,
    // talks: talksCollection // Now using data file approach
};

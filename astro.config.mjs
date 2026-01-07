import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import remarkGfm from 'remark-gfm';
import remarkWikiLink from 'remark-wiki-link';
import remarkUnwrapImages from 'remark-unwrap-images';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import vercel from '@astrojs/vercel';
import { fileURLToPath } from 'url';

// https://astro.build/config
export default defineConfig({
    site: 'https://www.mfrashad.com',
    output: 'hybrid',
    adapter: vercel({
        runtime: 'nodejs20.x'
    }),
    redirects: {
        '/brand': '/media',
        '/brand-kit': '/media'
    },
    vite: {
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
    },
    integrations: [
        tailwind(),
        icon(),
        react(),
        mdx()
    ],
    markdown: {
        remarkPlugins: [
            remarkGfm,
            [remarkWikiLink, {
                pageResolver: (name) => [name.toLowerCase().replace(/\s/g, '-')],
                hrefTemplate: (permalink) => `/${permalink}`,
                wikiLinkClassName: 'wiki-link',
                newClassName: 'wiki-link-new'
            }],
            remarkUnwrapImages
        ],
        rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, {
                behavior: 'wrap',
                properties: {
                    className: ['anchor-link']
                }
            }],
            [rehypeExternalLinks, {
                target: '_blank',
                rel: ['noopener', 'noreferrer']
            }]
        ],
        shikiConfig: {
            theme: 'github-dark',
            wrap: true
        }
    }
});

# Runtime Hashtag Integration Example

This document shows how to integrate hashtag extraction at runtime in your Astro pages.

## Display Auto-Detected Tags on Blog Post Page

You can extract and display hashtags dynamically without updating frontmatter:

```astro
---
// src/pages/blog/[slug].astro
import { getCollection } from 'astro:content';
import { mergeTagsWithHashtags } from '@/utils/hashtags';

const { slug } = Astro.params;
const entry = await getCollection('blog').find(e => e.slug === slug);

// Get tags from frontmatter
const manualTags = entry.data.tags || [];

// Extract hashtags from content and merge with manual tags
const allTags = await mergeTagsWithHashtags(manualTags, entry.body);
---

<article>
  <h1>{entry.data.title}</h1>

  <!-- Display all tags (manual + auto-detected) -->
  <div class="tags">
    {allTags.map(tag => (
      <a href={`/topics/${tag}`} class="tag">
        #{tag}
      </a>
    ))}
  </div>

  <Content />
</article>
```

## Display Only Auto-Detected Hashtags

```astro
---
import { extractHashtags } from '@/utils/hashtags';

const { slug } = Astro.params;
const entry = await getCollection('blog').find(e => e.slug === slug);

// Only extract hashtags from content
const autoTags = await extractHashtags(entry.body);
---

<article>
  <h1>{entry.data.title}</h1>

  {autoTags.length > 0 && (
    <div class="auto-tags">
      <span>Auto-detected topics:</span>
      {autoTags.map(tag => (
        <span class="tag">#{tag}</span>
      ))}
    </div>
  )}

  <Content />
</article>
```

## Show Manual vs Auto-Detected Tags Separately

```astro
---
import { extractHashtags } from '@/utils/hashtags';

const { slug } = Astro.params;
const entry = await getCollection('blog').find(e => e.slug === slug);

const manualTags = entry.data.tags || [];
const autoTags = await extractHashtags(entry.body);

// Find tags that are auto-detected but not manually added
const onlyAutoTags = autoTags.filter(tag => !manualTags.includes(tag));
---

<article>
  <h1>{entry.data.title}</h1>

  {manualTags.length > 0 && (
    <div class="manual-tags">
      <span>Tags:</span>
      {manualTags.map(tag => (
        <a href={`/topics/${tag}`} class="tag tag-manual">#{tag}</a>
      ))}
    </div>
  )}

  {onlyAutoTags.length > 0 && (
    <div class="auto-tags">
      <span>Also mentioned:</span>
      {onlyAutoTags.map(tag => (
        <a href={`/topics/${tag}`} class="tag tag-auto">#{tag}</a>
      ))}
    </div>
  )}

  <Content />
</article>
```

## Use in Blog List Page

```astro
---
// src/pages/blog/index.astro
import { getCollection } from 'astro:content';
import { extractHashtags } from '@/utils/hashtags';

const posts = await getCollection('blog');

// Extract hashtags for each post
const postsWithTags = await Promise.all(
  posts.map(async (post) => ({
    ...post,
    allTags: await extractHashtags(post.body)
  }))
);
---

<div class="blog-list">
  {postsWithTags.map(post => (
    <article>
      <h2><a href={`/blog/${post.slug}`}>{post.data.title}</a></h2>
      <div class="tags">
        {post.allTags.map(tag => (
          <span class="tag">#{tag}</span>
        ))}
      </div>
    </article>
  ))}
</div>
```

## Performance Considerations

### Caching Results

For better performance, especially on list pages, consider caching the extracted hashtags:

```typescript
// src/utils/hashtagCache.ts
const hashtagCache = new Map<string, string[]>();

export async function getCachedHashtags(slug: string, content: string): Promise<string[]> {
  if (hashtagCache.has(slug)) {
    return hashtagCache.get(slug)!;
  }

  const hashtags = await extractHashtags(content);
  hashtagCache.set(slug, hashtags);
  return hashtags;
}
```

### Pre-computing During Build

Instead of extracting at runtime, you can pre-compute hashtags and update frontmatter:

1. Run `npm run update:hashtags` before building
2. Add it to your build pipeline:

```json
// package.json
{
  "scripts": {
    "prebuild": "npm run update:hashtags && npm run build:all-data",
    "build": "astro check && astro build"
  }
}
```

This way, hashtags are stored in frontmatter and no runtime extraction is needed.

## Styling Examples

```css
/* Basic tag styles */
.tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  margin: 0.25rem;
  background: #f0f0f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  text-decoration: none;
  color: #333;
}

.tag:hover {
  background: #e0e0e0;
}

/* Differentiate manual vs auto tags */
.tag-manual {
  background: #e3f2fd;
  color: #1976d2;
}

.tag-auto {
  background: #f3e5f5;
  color: #7b1fa2;
  opacity: 0.8;
}
```

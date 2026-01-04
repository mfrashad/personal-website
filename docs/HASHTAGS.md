# Hashtag Auto-Detection Feature

This feature automatically detects hashtags (e.g., `#productivity`, `#javascript`) in your blog posts and converts them into tags.

## How It Works

The system scans your markdown content for hashtags and can:
1. Extract hashtags from content
2. Merge them with manually defined tags in frontmatter
3. Update frontmatter automatically with detected hashtags

## Usage

### Writing Hashtags in Your Content

Simply include hashtags anywhere in your markdown content:

```markdown
---
title: "My Post About Productivity"
date: 2024-01-01
tags: ["manually-added"]
---

This is a post about #productivity and #habits.

I love using #javascript for web development!

## Section About #design

More content here with #ux and #ui tags.
```

### Extracting Hashtags Programmatically

You can use the utility functions in your code:

```typescript
import { extractHashtags, mergeTagsWithHashtags } from '@/utils/hashtags';

// Extract hashtags from markdown content
const content = "This is about #productivity and #habits";
const hashtags = await extractHashtags(content);
// Result: ["habits", "productivity"]

// Merge with existing tags
const manualTags = ["journal", "personal"];
const allTags = await mergeTagsWithHashtags(manualTags, content);
// Result: ["habits", "journal", "personal", "productivity"]
```

### Automatically Update Frontmatter

Run the hashtag updater script to scan all your markdown files and update their frontmatter:

#### Dry Run (Preview Changes)

```bash
npm run update:hashtags:dry
```

This will show you what would change without actually modifying any files.

#### Update Files (Merge Mode - Default)

```bash
npm run update:hashtags
```

This will:
- Scan all markdown files in `src/content/blog`, `src/content/essays`, and `src/content/notes`
- Extract hashtags from content
- **Merge** detected hashtags with existing tags in frontmatter
- Update the files

#### Update Files (Replace Mode)

```bash
npm run update:hashtags -- --replace
```

This will **replace** existing tags with detected hashtags (use with caution).

## Examples

### Before

```markdown
---
title: "My Productivity System"
tags: ["journal"]
---

I've been working on my #productivity system using #notion and #timeblocking.
```

### After (Merge Mode)

```markdown
---
title: "My Productivity System"
tags: ["journal", "notion", "productivity", "timeblocking"]
---

I've been working on my #productivity system using #notion and #timeblocking.
```

## Important Notes

### Hashtag Detection Rules

- Hashtags must start with `#` followed by word characters (letters, numbers, underscores, hyphens)
- Hashtags are case-insensitive (converted to lowercase)
- Markdown headings (`## Heading`) are NOT detected as hashtags
- Hashtags in code blocks are currently detected (you may want to avoid using # in code examples)

### Best Practices

1. **Use meaningful hashtags**: Choose hashtags that represent the key topics of your post
2. **Be consistent**: Use the same hashtag format across your posts (e.g., always use `#javascript` not `#js`)
3. **Run dry-run first**: Always check what will change before running the actual update
4. **Commit before updating**: Make sure to commit your changes before running the script so you can revert if needed
5. **Use merge mode**: Unless you have a specific reason, use merge mode to preserve manually added tags

## Integration with Astro

### Remark Plugin

A remark plugin is available at `src/plugins/remark-extract-hashtags.ts` that can be integrated into your Astro config for build-time extraction:

```javascript
// astro.config.mjs
import { remarkExtractHashtags } from './src/plugins/remark-extract-hashtags';

export default defineConfig({
  markdown: {
    remarkPlugins: [
      // ... other plugins
      remarkExtractHashtags
    ]
  }
});
```

This plugin stores extracted hashtags in `vfile.data.hashtags` for use in your templates.

## Troubleshooting

### Script not detecting hashtags?

1. Make sure hashtags are properly formatted (e.g., `#tag` not `# tag`)
2. Check that hashtags are in the markdown content, not in frontmatter
3. Verify the file is in one of the scanned directories

### Tags not showing on the site?

1. Check your content schema supports the `tags` field
2. Verify your templates are rendering tags
3. Rebuild your site after updating frontmatter

## Files

- `src/utils/hashtags.ts` - Core hashtag extraction utilities
- `src/plugins/remark-extract-hashtags.ts` - Remark plugin for build-time extraction
- `scripts/update-hashtags.ts` - CLI script to update frontmatter

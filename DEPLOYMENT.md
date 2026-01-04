# Deployment Guide

## Vercel Environment Variables

When deploying to Vercel, configure the following environment variables in your project settings:

### Required Variables

**PUBLIC_SITE_URL**
- Value: `https://www.mfrashad.com` (or your custom domain)
- Description: The full URL of your website, used for generating absolute URLs for webmentions and SEO

### Optional API Integrations

Configure only the features you want to use:

#### Webmentions (Social Interactions)
- **WEBMENTION_IO_TOKEN**: Your webmention.io API token
  - Get from: https://webmention.io
  - Required for webmentions feature
- **PUBLIC_WEBMENTION_IO_DOMAIN**: `www.mfrashad.com`
  - Your verified domain on webmention.io

#### Movies (Letterboxd + TMDB)
- **TMDB_API_KEY**: Your TMDB API key
  - Get from: https://www.themoviedb.org/settings/api
  - Required for movie posters

#### Books (Hardcover)
- **HARDCOVER_API_KEY**: Your Hardcover API key
  - Get from: https://hardcover.app/account/api
  - Required for book tracking

#### Digital Garden (Cleve API - Primary)
- **CLEVE_API_KEY**: Your Cleve API key (clv_...)
  - Your personal writings API from Cleve
  - Primary source for digital garden notes

#### Digital Garden (GitHub - Alternative)
- **GITHUB_TOKEN**: GitHub personal access token
  - Get from: https://github.com/settings/tokens
  - Alternative to Cleve API for digital garden

#### Bookmarks (Raindrop.io)
- **RAINDROP_TOKEN**: Your Raindrop.io API token
  - Get from: https://app.raindrop.io/settings/integrations
  - Required for bookmarks feature

#### Email (Optional)
- **RESEND_API_KEY**: Resend API key for contact forms
  - Get from: https://resend.com
  - Optional: Only needed if you add contact forms

#### Music (Spotify + Last.fm - Optional)
- **SPOTIFY_CLIENT_ID**: Spotify application client ID
- **SPOTIFY_CLIENT_SECRET**: Spotify application secret
- **SPOTIFY_REFRESH_TOKEN**: Spotify refresh token
  - Get from: https://developer.spotify.com/dashboard
- **LAST_FM_API_KEY**: Last.fm API key
- **LAST_FM_USER_NAME**: Your Last.fm username
  - Get from: https://www.last.fm/api/account/create

## Build Configuration

### Build Commands
The project uses a `prebuild` hook that automatically runs data generation scripts before each build:

```bash
npm run prebuild  # Runs build:all-data
npm run build:all-data  # Generates link-graph, topics, and fetches webmentions
npm run build  # Standard Astro build
```

### Build Scripts (Auto-run via prebuild)
1. **generate-links.ts** - Scans content for [[wiki links]] and builds link graph
2. **generate-topics.ts** - Extracts topics/tags from frontmatter for search
3. **get-webmentions.ts** - Fetches webmentions incrementally (skips if no token)

### Vercel Settings
- **Framework Preset**: Astro
- **Build Command**: `npm run build` (prebuild runs automatically)
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node Version**: 20.x (specified in engines field)

## Post-Deployment Setup

### 1. Webmentions Setup (Optional)
If using webmentions:
1. Sign up at https://webmention.io
2. Add your domain and verify ownership
3. Create an API token
4. Add token to Vercel environment variables
5. Set up Brid.gy for social media bridging:
   - Visit https://brid.gy
   - Connect your Bluesky/Twitter accounts
   - Enable webmention sending

### 2. Content Migration
All 6 existing blog posts have been migrated with:
- `growthStage: 'budding'`
- `tags: ["journal"]`
- `enableWebmentions: true`

### 3. Test Deployment
After deployment, verify:
- All pages load: /blog, /garden, /talks, /about, /now, /colophon, /topics
- Build scripts ran successfully (check build logs)
- Growth stage indicators appear on blog posts
- Navigation includes new pages
- Static assets load correctly

## Features Status

### ✅ Fully Integrated
- Growth stages (🌱 seedling, 🌿 budding, 🌳 evergreen)
- 17 MDX components
- Wiki links and backlinks
- Webmentions support
- Topics/tags indexing
- Build-time data generation
- New pages: /talks, /now, /about, /colophon, /topics

### ✅ Preserved Existing Features
- Movies (Letterboxd + TMDB)
- Bookmarks (Raindrop)
- Books (Hardcover)
- Postcards
- Photos
- Digital Garden (Cleve API)

## Troubleshooting

### Build Fails
- Check Node version is 20.x or higher
- Verify all required environment variables are set
- Check build logs for specific errors

### Webmentions Not Showing
- Verify `WEBMENTION_IO_TOKEN` is set
- Check `PUBLIC_WEBMENTION_IO_DOMAIN` matches your site
- Build logs should show "Fetching webmentions..." not "⚠️ TOKEN not set"

### Missing Content
- Essays, notes, talks collections are empty by default
- Only blog collection has migrated posts
- Create content in respective `/src/content/` directories

## Updating Content

### Adding New Blog Posts
Create `.md` or `.mdx` files in `/src/content/blog/` with frontmatter:
```yaml
---
title: "Your Post Title"
description: "Post description"
date: 2026-01-03
growthStage: 'budding'  # seedling | budding | evergreen
topics: ['web development', 'astro']
tags: ['tutorial']
enableWebmentions: true
---
```

### Adding Wiki Links
Use `[[Page Title]]` syntax in markdown to create internal links. The link graph regenerates automatically on each build.

### Adding Talks
Create `.md` files in `/src/content/talks/` with:
```yaml
---
title: "Talk Title"
description: "Talk description"
date: 2026-06-15
event: "Conference Name"
location: "City, Country"
slidesUrl: "https://..."
videoUrl: "https://..."
---
```

## Support

For issues or questions:
- Check `/colophon` page for technical details
- Review `/.env.example` for configuration reference
- See implementation plan at `/.claude/plans/wiggly-toasting-robin.md`

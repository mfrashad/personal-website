# iamrobin - Personal Website

A modern, feature-rich personal website built with Astro 5, featuring blog posts, digital garden (powered by Cleve API), bookmarks, postcards, movies, and integrations with multiple external services. This is the personal website of Muhammad Rashad (@mfrashad).

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Content Management](#content-management)
  - [Blog Posts](#blog-posts)
  - [Projects](#projects)
  - [Photos](#photos)
  - [Digital Garden](#digital-garden)
  - [Postcards](#postcards)
- [Data Sources](#data-sources)
- [Customization Guide](#customization-guide)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

This is a personal portfolio and blog website that aggregates content from multiple sources:

- **Local Content**: Blog posts (markdown), projects, photos
- **External APIs**:
  - Digital garden (Cleve API - personal knowledge management)
  - Bookmarks (Raindrop.io)
  - Books (Hardcover)
  - Movies (Letterboxd RSS + TMDB API for posters)
  - Music (Spotify, Last.fm)
- **Interactive Features**: Postcards with handwriting aesthetic, photo galleries, project showcases

The site is fully statically generated at build time and deployed to Vercel.

---

## Tech Stack

### Core Framework
- **Astro 5.4.1** - Static site generator with island architecture
- **TypeScript** - Type-safe development with path aliases (@api, @data)
- **Node.js 20+** - Required runtime

### Integrations
- **@astrojs/vercel** - Vercel deployment adapter (Node.js 20.x runtime)
- **@astrojs/react** - React component support for interactive components
- **@astrojs/tailwind** - Tailwind CSS integration
- **astro-icon** - Icon system integration

### UI & Styling
- **Tailwind CSS 3.3.5** - Utility-first CSS framework
- **@tailwindcss/typography** - Beautiful prose styling
- **Phosphor Icons** - Icon library
- **Custom fonts**: Apercu (sans), Fira Mono (mono), LiebeHeide (script)

### Content Processing
- **Astro Content Collections** - Type-safe content management
- **gray-matter** - Frontmatter parsing
- **remark-gfm** - GitHub Flavored Markdown
- **sanitize-html** - XSS protection

### Creative Features
- **p5.js** - Generative art
- **@zachleat/carouscroll** - Carousel component

### External Services
- **Resend** - Email sending
- **Plausible Analytics** - Privacy-focused analytics (proxied)

---

## Quick Start

### Prerequisites
- Node.js 20 or higher
- npm or your preferred package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (see [Environment Variables](#environment-variables))
   ```bash
   # Create a .env file in the root directory
   touch .env
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:4321`

5. **Build for production**
   ```bash
   npm run build
   ```

---

## Environment Variables

Create a `.env` file in the root directory with the following variables. **Not all are required** - the site will work with partial configuration, but some features will be disabled.

### Required for Core Features

```env
# Site Configuration
PUBLIC_SITE_URL=https://www.mfrashad.com
```

### Email Service (Optional - for Contact Forms)

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

**How to get it:**
1. Sign up at [resend.com](https://resend.com)
2. Create an API key in your dashboard
3. Verify your domain to send emails

**To disable:** Remove email-sending functionality from contact forms

---

### Digital Garden (Cleve API)

**Primary Source:**
```env
CLEVE_API_KEY=clv_xxxxxxxxxxxxx
```

**How to get it:**
1. The Cleve API is a personal knowledge management system
2. Sign up for Cleve or use your own API endpoint
3. Get your API key from your Cleve account settings
4. The API fetches published writings and transforms them into garden notes

**Alternative Source (GitHub):**
```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
```

The codebase includes both Cleve API (`/src/api/cleve.ts`) and GitHub API (`/src/api/github.ts`) integrations. You can switch between them or use your own data source by modifying `/src/pages/garden/index.astro`.

**Features:**
- Automatic categorization of notes (technology, psychology, society, productivity, etc.)
- Latest created and updated notes
- Category browsing
- Full-text search support

**To disable:** Remove `/src/pages/garden/` directory

---

### Bookmarks (Raindrop.io)

```env
RAINDROP_TOKEN=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**How to get it:**
1. Sign up at [raindrop.io](https://raindrop.io)
2. Go to Settings → Integrations → For Developers
3. Create a test token

**To disable:** Remove `/src/pages/bookmarks/` directory

---

### Books (Hardcover)

```env
HARDCOVER_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**How to get it:**
1. Sign up at [hardcover.app](https://hardcover.app)
2. Go to Settings → API
3. Generate an API key
4. The API fetches your reading activity, currently reading, and favorite books

**To disable:** Remove book-related components from pages

---

### Music (Spotify)

```env
SPOTIFY_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SPOTIFY_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SPOTIFY_REFRESH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**How to get it:**
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create an app to get Client ID and Secret
3. Follow [Spotify OAuth guide](https://developer.spotify.com/documentation/web-api/tutorials/code-flow) to get refresh token
4. Use a tool like [this](https://github.com/aleccool213/spotify-refresh-token) to simplify the process

**To disable:** Remove Spotify components from `/src/components/MusicSection.astro`

---

### Music (Last.fm)

```env
LAST_FM_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LAST_FM_USER_NAME=your_username
```

**How to get it:**
1. Sign up at [last.fm](https://www.last.fm)
2. Get API key at [last.fm/api/account/create](https://www.last.fm/api/account/create)
3. Use your Last.fm username for `LAST_FM_USER_NAME`

**To disable:** Remove Last.fm sections from `/src/components/MusicSection.astro`

---

### Movies (Letterboxd + TMDB)

```env
TMDB_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**How to get it:**
1. Sign up at [themoviedb.org](https://www.themoviedb.org/)
2. Go to Settings → API → Request API Key
3. The TMDB API is used to fetch high-quality movie posters
4. Movie data is scraped from your public Letterboxd profile

**How it works:**
- The site scrapes your public Letterboxd RSS feed for watched movies
- TMDB API enriches the data with high-quality posters and metadata
- Run `npm run fetch:movies` to update the movie data
- Movie data is cached and included in the build

**To update your Letterboxd username:**
- Edit the username in `/src/pages/movies.astro` or the fetch script
- Run `npm run fetch:movies` to re-fetch the data

**To disable:** Remove `/src/pages/movies.astro`

---

## Content Management

### Blog Posts

Blog posts are markdown files located in `/src/content/blog/`.

**📂 Location:** `/src/content/blog/`

**📝 File naming convention:** `YYYY_MM_DD-slug.md`

**Example:** `2025_03_07-my-first-post.md`

**Frontmatter structure:**

```markdown
---
title: 'Your Blog Post Title'
subtitle: 'Optional Subtitle'
description: 'SEO meta description'
date: 2025-03-07
category: 'software'  # Optional: software, design, personal, etc.
image: 'src/assets/blog/your-image.png'  # Optional header image
ogImageName: 'custom-og-image.jpg'  # Optional custom OG image
mastodonId: '114318493649820702#'  # Optional: for social stats
---

Your markdown content here...

## Headings

- Lists
- **Bold** and *italic*
- [Links](https://example.com)

```javascript
// Code blocks with syntax highlighting
console.log('Hello, world!');
```
```

**✨ To add a new blog post:**

1. Create a new `.md` file in `/src/content/blog/`
2. Add frontmatter at the top (see example above)
3. Write your content in markdown below the frontmatter
4. Add images to `/src/assets/blog/` if needed
5. The post will automatically appear on the `/blog` page

**📁 Categories:**
- Categories are auto-generated from your posts
- Visit `/blog/category/[category-name]` to see filtered posts
- Common categories: `software`, `design`, `personal`, `photography`

**🖼️ Adding images to blog posts:**

```markdown
# In frontmatter for header image:
image: 'src/assets/blog/my-image.jpg'

# In markdown content:
![Alt text](../../assets/blog/my-image.jpg)
```

---

### Projects

Projects are defined in `/src/content/projects.ts` as a TypeScript array.

**📂 Location:** `/src/content/projects.ts`

**Structure:**

```typescript
{
    bgColor: '#64b89d',           // Hex color for project card background
    title: 'Project Name',
    description: 'Brief description of the project',
    labels: ['Tech', 'Stack'],    // Technology tags
    logo: ProjectLogo,            // Import from /src/assets/projects/
    logoWidth: '5rem',            // CSS width value
    year: '2023',                 // Year or range like '2020 - now'
    href: 'https://...',          // Optional: external link
    customOpenString: 'Open Website',  // Optional: custom link text
    comingSoon: true              // Optional: shows "Coming Soon" badge
}
```

**✨ To add a new project:**

1. Add your project logo to `/src/assets/projects/` (SVG or PNG recommended)
2. Open `/src/content/projects.ts`
3. Import your logo at the top:
   ```typescript
   import MyProjectLogo from '../assets/projects/my-project.png';
   ```
4. Add your project object to the `projects` array:
   ```typescript
   {
       bgColor: '#3662e3',
       title: 'My Awesome Project',
       description: 'A cool project I built',
       labels: ['React', 'TypeScript'],
       logo: MyProjectLogo,
       logoWidth: '5rem',
       year: '2024',
       href: 'https://myproject.com'
   }
   ```
5. The project will appear on the homepage

**🗑️ To remove a project:**
- Comment out or delete the project object from the array
- Remove the logo import if not used elsewhere

---

### Photos

Photos are stored in the `/src/assets/` directory structure.

**📂 Photo Directories:**

| Directory | Purpose | Usage |
|-----------|---------|-------|
| `/src/assets/landingpage-photos/` | Homepage photos | Auto-displayed on landing page |
| `/src/assets/365/photos/` | Daily photo project | Organized by date (YYYY-MM-DD.jpg) |
| `/src/assets/blog/` | Blog post images | Referenced in blog frontmatter/content |
| `/src/assets/projects/` | Project logos | Imported in projects.ts |

**🖼️ Supported formats:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`

**✨ To add photos:**

**For landing page:**
1. Drop images into `/src/assets/landingpage-photos/`
2. They'll automatically appear on the homepage
3. Recommended: High-quality images (1200px+ width)

**For blog posts:**
```markdown
# In frontmatter:
image: 'src/assets/blog/my-photo.jpg'

# In content:
![Description](../../assets/blog/my-photo.jpg)
```

**For 365 project:**
1. Name file: `YYYY-MM-DD.jpg` (e.g., `2025-03-15.jpg`)
2. Place in `/src/assets/365/photos/`

**For projects:**
1. Add logo to `/src/assets/projects/`
2. Import and reference in `/src/content/projects.ts`

---

### Digital Garden

The digital garden is powered by the **Cleve API**, a personal knowledge management system that stores and organizes your writings.

**🌐 Primary source:** Cleve API (personal knowledge base)

**How it works:**
1. Garden notes are stored in Cleve (a personal knowledge management system)
2. At build time, `/src/api/cleve.ts` fetches published writings via API
3. Notes are automatically categorized by content (technology, psychology, society, productivity, etc.)
4. The API transforms writings into a garden note format with metadata

**Key Features:**
- **Automatic Categorization:** Notes are intelligently categorized based on title and content
- **Dynamic Organization:** Latest created and updated notes are highlighted
- **Category Browsing:** Browse notes by category with dedicated pages
- **Markdown Support:** Full markdown rendering with GitHub Flavored Markdown
- **Visual Effects:** Handwriting-like distortion filters for authentic feel

**✨ To use your own garden:**

**Option 1: Use Cleve API (Current Implementation)**

1. Sign up for Cleve or deploy your own instance
2. Get your API key from account settings
3. Add to `.env`:
   ```env
   CLEVE_API_KEY=clv_your_api_key_here
   ```
4. The API endpoint is configured in `/src/api/cleve.ts`

**Option 2: Use GitHub repository (Alternative)**

The codebase includes GitHub API support (`/src/api/github.ts`):

1. Create a GitHub repository with markdown files organized in category folders
2. Set `GITHUB_TOKEN` in `.env`
3. Update `/src/pages/garden/index.astro` to use GitHub API instead of Cleve
4. Example folder structure:
   ```
   your-garden-repo/
   ├── technology/
   ├── psychology/
   ├── society/
   ├── productivity/
   └── concepts/
   ```

**Option 3: Use your own data source**

Implement your own API integration by:
1. Creating a new file in `/src/api/your-source.ts`
2. Following the same interface as `cleve.ts` or `github.ts`
3. Updating `/src/pages/garden/index.astro` to use your API

**Option 4: Disable the garden**
1. Delete `/src/pages/garden/` directory
2. Remove garden navigation links from components

**📝 Garden note format:**
```typescript
{
  name: 'note-slug.md',
  path: 'category-name',
  body: 'Markdown content...',
  frontmatter: {
    description: 'Brief excerpt...',
    created: '2024-01-15',
    edited: '2024-03-20'
  }
}
```

**🗂️ Supported Categories:**
- `technology` - Tech, programming, AI, software
- `psychology` - Mental models, mindset, psychology
- `society` - Social topics, media, government
- `productivity` - Career, success, growth
- `concepts` - General ideas and thoughts
- `art` - Art and creativity
- `design` - Design principles
- `books` - Book notes
- `photography` - Photography
- `poems` - Poetry and prose

---

### Postcards

Postcards are messages displayed with a handwritten, authentic aesthetic using advanced CSS and SVG filters.

**🎨 Visual Features:**
- **Handwriting Effect:** Custom distortion filters create realistic handwritten appearance
- **Random Variations:** Each postcard has unique rotation, positioning, and styling
- **Paper Textures:** Vintage paper colors and textures
- **Stamps:** Country stamps and post office marks
- **Wavy Lines:** Decorative postal elements

**How it works:**
1. Postcard data is stored (currently using mock data in `/src/data/mockPostcards.ts`)
2. Each postcard has styling properties: rotations, offsets, colors, fonts
3. Rendered with SVG distortion filters for authentic handwriting look
4. Displayed in a scattered layout on `/postcards` page

**Postcard Properties:**
- `author` - Name of sender
- `body` - Message content
- `date` - Submission date
- `country` - Sender's country (optional)
- `websiteUrl` - Optional website link
- `stampSvg` - Country stamp SVG (optional)
- **Styling properties:**
  - `rotation`, `marginBottom`, `marginRight` - Card positioning
  - `penColor`, `paperColor` - Color scheme
  - `fontSizeFactor`, `lineHeight` - Typography
  - Offsets and rotations for author, date, and body text
  - Stamp positioning and rotation

**🔧 Managing postcards:**

**Current Implementation (Mock Data):**
- Postcards are defined in `/src/data/mockPostcards.ts`
- Edit this file to add/remove postcards
- Each postcard includes all styling properties

**To add dynamic postcards:**
You can integrate with:
1. **Astro DB** - Add back database support for user submissions
2. **CMS** - Use a headless CMS like Contentful or Sanity
3. **API** - Fetch from your own API endpoint
4. **Forms** - Add a submission form (reference implementation exists)

**Component:**
- `/src/components/PostcardItem.astro` - Main postcard component
- Includes XSS protection with `isomorphic-dompurify`
- SVG filters defined inline for distortion effects

**🚫 To disable postcards:**
1. Delete `/src/pages/postcards/` directory
2. Remove postcard navigation links from components

---

## Data Sources

Understanding where content comes from:

### 📝 Local Data (Build Time)
These are files you manage directly in the repository:

| Content | Location | Format |
|---------|----------|--------|
| **Blog posts** | `/src/content/blog/` | Markdown (.md) |
| **Projects** | `/src/content/projects.ts` | TypeScript array |
| **Photos** | `/src/assets/` | Image files |

### 🌐 External APIs (Build Time)
These fetch from external services during the build:

| Content | Service | Env Variables Required | Can Disable? |
|---------|---------|----------------------|--------------|
| **Digital Garden** | Cleve API (primary) or GitHub API | `CLEVE_API_KEY` or `GITHUB_TOKEN` | ✅ Yes |
| **Bookmarks** | Raindrop.io | `RAINDROP_TOKEN` | ✅ Yes |
| **Books** | Hardcover | `HARDCOVER_API_KEY` | ✅ Yes |
| **Movies** | Letterboxd RSS + TMDB | `TMDB_API_KEY` | ✅ Yes |
| **Music** | Spotify API | `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` | ✅ Yes |
| **Music** | Last.fm API | `LAST_FM_API_KEY`, `LAST_FM_USER_NAME` | ✅ Yes |
| **Social Stats** | Mastodon API | Optional | ✅ Yes |

### 📦 Static Data (Included in Repository)
| Content | Location | Format |
|---------|----------|--------|
| **Postcards** | `/src/data/mockPostcards.ts` | TypeScript array (can be replaced with DB/API) |

**⚠️ Important:** External data is fetched at **build time** only. The site is fully static, so content updates require a rebuild/redeploy.

---

## Customization Guide

### 🎨 Changing Site Information

**1. Update site URL and metadata**

Edit `/astro.config.mjs`:
```javascript
export default defineConfig({
    site: 'https://yourdomain.com',  // ← Change this to your domain
    // ...
});
```

**2. Update navigation and branding**

Look for these components in `/src/components/`:
- `Header.astro` - Main navigation menu
- `Footer.astro` - Footer links and info
- `Hero.astro` or similar - Homepage hero section

**3. Update personal information**

Key files to edit:
- **Homepage:** `/src/pages/index.astro`
- **About sections:** Various components in `/src/components/`
- **Legal/Privacy:** `/src/pages/legal.astro`
- **Changelog:** `/src/pages/changelog.astro`

**4. Update colors and theme**

Edit `/tailwind.config.mjs`:
```javascript
theme: {
    extend: {
        colors: {
            'red': '#ff6f52',      // ← Change to your brand colors
            'green': '#6da57a',
            'blue': '#5e9dd8',
            'yellow': '#f7cd54',
            'lilac': '#c17edb',
            'dark': '#1a1818',
            'light': '#fcf7f2'
        }
    }
}
```

These colors are used throughout the site via Tailwind classes like `bg-red`, `text-blue`, etc.

**5. Update fonts**

The site uses custom fonts stored in `/public/fonts/`:
- **Apercu** (sans-serif) - Commercial font (requires license)
- **Fira Mono** (monospace) - Open source
- **LiebeHeide** (script/handwriting) - Check license

To change fonts:
1. Add your font files to `/public/fonts/`
2. Update `@font-face` declarations in `/src/styles/global.css`
3. Update Tailwind config in `/tailwind.config.mjs`:
   ```javascript
   fontFamily: {
       sans: ['YourFont', 'sans-serif'],
       mono: ['YourMonoFont', 'monospace'],
   }
   ```

**⚠️ Note:** The Apercu font requires a commercial license. You'll need to replace it with a free alternative or purchase a license.

**6. Remove unwanted features**

Not using certain features? Simply delete the pages:

| Feature | To Remove | What to Delete |
|---------|-----------|----------------|
| **Digital Garden** | Markdown notes from GitHub | `/src/pages/garden/` |
| **Bookmarks** | Raindrop.io links | `/src/pages/bookmarks/` |
| **Postcards** | User postcards | `/src/pages/postcards/` |
| **Blog** | Blog posts | `/src/pages/blog/` + `/src/content/blog/` |
| **Movies** | Letterboxd movies | `/src/pages/movies.astro` |
| **365 Photos** | Daily photos | Remove from relevant pages |
| **Music** | Spotify/Last.fm | Remove components from pages |

After removing pages, update navigation components to remove dead links.

---

### 📊 Changing Analytics

**Default setup:** Plausible Analytics (privacy-focused, GDPR compliant)

**Current configuration:** `/vercel.json`
```json
{
    "rewrites": [
        {
            "source": "/iamrobin/js/script.js",
            "destination": "https://plausible.io/js/script.js"
        }
    ]
}
```

**To use your own Plausible:**
1. Sign up at [plausible.io](https://plausible.io)
2. Add your domain
3. Update `/vercel.json` source path
4. Update script tag in layout files

**To switch to Google Analytics:**
1. Remove Plausible scripts from `/src/layouts/Layout.astro`
2. Add GA4 script in the `<head>`
3. Remove Plausible rewrites from `/vercel.json`

**To remove analytics:**
1. Remove analytics scripts from layouts
2. Remove rewrites from `/vercel.json`

---

## Project Structure

```
/
├── public/                 # Static assets (not processed by Astro)
│   ├── fonts/             # Custom web fonts (Apercu, Fira Mono, etc.)
│   ├── opengraph/         # Open Graph social media images
│   └── favicon.svg        # Site favicon
│
├── src/
│   ├── api/               # External API integrations
│   │   ├── cleve.ts       # Fetch digital garden from Cleve API (primary)
│   │   ├── github.ts      # Alternative: Fetch garden from GitHub
│   │   ├── raindrop.ts    # Fetch bookmarks from Raindrop.io
│   │   ├── hardcover.ts   # Fetch books from Hardcover (replaced Literal)
│   │   ├── spotify.ts     # Fetch music from Spotify
│   │   └── mastodon.ts    # Fetch social stats from Mastodon
│   │
│   ├── data/              # Static data files
│   │   ├── mockPostcards.ts  # Postcard data (handwriting aesthetic)
│   │   └── ...            # Other static data
│   │
│   ├── assets/            # Images and media (processed by Astro)
│   │   ├── blog/          # Blog post header images
│   │   ├── projects/      # Project logos and screenshots
│   │   ├── landingpage-photos/  # Homepage photo carousel
│   │   └── 365/photos/    # Daily photography project
│   │
│   ├── components/        # Reusable Astro/React components
│   │   ├── Header.astro   # Main navigation
│   │   ├── Footer.astro   # Site footer
│   │   ├── BlogPost.astro # Blog post card
│   │   ├── ProjectItem.astro  # Project showcase card
│   │   └── ...            # Many more components
│   │
│   ├── content/           # Content collections (type-safe)
│   │   ├── blog/          # Blog post markdown files
│   │   │   ├── 2025_03_07-what-I-use.md
│   │   │   └── ...
│   │   ├── config.ts      # Zod schemas for content validation
│   │   └── projects.ts    # Projects data array
│   │
│   ├── layouts/           # Page layout templates
│   │   ├── Layout.astro   # Base layout (used by most pages)
│   │   └── GardenLayout.astro  # Layout for garden notes
│   │
│   ├── pages/             # File-based routing (becomes URLs)
│   │   ├── index.astro    # Homepage → /
│   │   ├── blog/          # Blog section → /blog/*
│   │   │   ├── index.astro           # Blog list → /blog
│   │   │   ├── [slug].astro          # Blog post → /blog/:slug
│   │   │   └── category/[category].astro  # Category → /blog/category/:category
│   │   ├── garden/        # Digital garden (Cleve API) → /garden/*
│   │   │   ├── index.astro                    # Garden home → /garden
│   │   │   └── [category]/[slug].astro        # Note → /garden/:category/:slug
│   │   ├── bookmarks/     # Bookmarks → /bookmarks/*
│   │   ├── postcards/     # Postcards with handwriting aesthetic → /postcards/*
│   │   ├── movies.astro   # Movies from Letterboxd + TMDB → /movies
│   │   ├── media.astro    # Media aggregation page → /media
│   │   ├── legal.astro    # Legal/privacy → /legal
│   │   └── ...
│   │
│   ├── scripts/           # Client-side JavaScript
│   │   ├── sidenotes.ts   # Sidenote interactions
│   │   └── ...
│   │
│   ├── styles/            # Global styles
│   │   └── global.css     # Global CSS, font-face, custom styles
│   │
│   ├── utils/             # Utility functions
│   │   ├── email.ts       # Email sending with Resend
│   │   ├── markdown.ts    # Markdown processing utilities
│   │   ├── letterboxd.ts  # Letterboxd RSS parsing
│   │   └── ...
│   │
│   └── types/             # TypeScript type definitions
│       ├── lastfm.ts      # Last.fm API types
│       └── ...
│
├── scripts/               # Build scripts
│   └── fetch-letterboxd.ts  # Fetch movie data from Letterboxd
│
├── .env                   # Environment variables (CREATE THIS - not in repo)
├── .env.example           # Example environment variables
├── .gitignore             # Git ignore rules
├── astro.config.mjs       # Astro configuration (site, adapters, integrations)
├── tailwind.config.mjs    # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration (includes @api, @data aliases)
├── vercel.json            # Vercel deployment settings (analytics proxy)
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

### Key Configuration Files

**`astro.config.mjs`:**
- Site URL: `https://www.mfrashad.com`
- Output: Static site generation
- Adapter: Vercel with Node.js 20.x runtime
- Integrations: Tailwind, React, Icon
- Markdown: GitHub Flavored Markdown support

**`tsconfig.json`:**
- Path aliases configured:
  - `@api/*` → `/src/api/*`
  - `@data/*` → `/src/data/*`
  - Plus Astro defaults for `@components`, `@layouts`, etc.

**`vercel.json`:**
- Plausible Analytics proxy for privacy-focused tracking
- Custom rewrites for analytics script

---

## Development

### Commands

All commands run from the project root:

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` (includes type checking) |
| `npm run preview` | Preview production build locally |
| `npm run fetch:movies` | Fetch and cache movie data from Letterboxd + TMDB |
| `astro check` | Check TypeScript types |

### Development Workflow

**1. Start the dev server**
```bash
npm run dev
```
Visit `http://localhost:4321`

**2. Make changes**
- Edit components, pages, or content
- Changes hot-reload automatically
- TypeScript errors show in terminal

**3. Add content**
- Blog posts: Create `.md` file in `/src/content/blog/`
- Projects: Edit `/src/content/projects.ts`
- Photos: Drop images in `/src/assets/`

**4. Test the build**
```bash
npm run build
```
This tests:
- TypeScript compilation
- External API calls
- Image optimization
- Production build

**5. Preview before deploy**
```bash
npm run preview
```

### Tips & Tricks

**🔥 Hot Module Replacement (HMR)**
- Astro dev server supports instant updates
- Component changes reflect immediately
- Markdown content updates automatically

**✅ Type Safety**
- Run `astro check` to verify TypeScript
- Content collections use Zod for runtime validation
- Type errors show in editor and terminal

**🌐 Testing External APIs**
- External APIs only run during build
- Use `npm run build` to test API integrations
- Check terminal output for API errors
- Missing tokens will show warnings

**💾 Database Development**
- Astro DB runs automatically in dev mode
- Database file: `.astro/content.db` (SQLite)
- Seed data from `/db/seed.ts` on first run
- Reset DB: Delete `.astro/` folder

**🖼️ Image Optimization**
- Images in `/src/assets/` are auto-optimized
- Use imports for best performance:
  ```astro
  ---
  import heroImage from '../assets/hero.jpg';
  ---
  <img src={heroImage.src} alt="Hero" />
  ```
- Images in `/public/` are served as-is (no optimization)

**🐛 Debugging**
- Check browser console for client-side errors
- Check terminal for build-time errors
- Use `console.log()` in component frontmatter (shows in terminal)
- Enable verbose logging: `astro dev --verbose`

---

## Deployment

### Vercel (Recommended)

This site is optimized for Vercel deployment with zero configuration.

#### Automatic Deployment

**1. Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

**2. Import to Vercel**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects Astro framework
4. Click "Deploy"

**3. Add environment variables**
1. Go to your project in Vercel dashboard
2. Settings → Environment Variables
3. Add each variable from your `.env` file
4. Redeploy (or they'll apply on next push)

**4. Configure domain (optional)**
1. Settings → Domains
2. Add your custom domain
3. Update DNS records as shown
4. Update `site` in `astro.config.mjs` to match

#### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
npm run build
vercel --prod
```

#### Vercel Configuration

The `/vercel.json` file includes:
- Plausible Analytics proxy (privacy-friendly tracking)
- Correct routing rules

#### Astro DB on Vercel

For postcards feature (Astro DB):

**Option 1: Use Astro Studio (recommended for production)**
```bash
# Login to Astro Studio
npx astro db login

# Link your project
npx astro db link

# Push database schema
npx astro db push --remote
```

Then in Vercel:
- Your build command already includes `--remote` flag
- Database is hosted on Astro Studio
- Free tier available

**Option 2: Disable database**
- Remove postcards pages
- Remove `db()` from `astro.config.mjs` integrations
- Remove `--remote` flag from build script

---

### Other Platforms

#### Netlify

```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables
# Add in Netlify dashboard → Site settings → Environment variables
```

Deploy via:
1. Netlify dashboard → New site from Git
2. Or use Netlify CLI: `netlify deploy --prod`

#### Cloudflare Pages

```bash
# Build command
npm run build

# Build output directory
dist

# Node version
20
```

Deploy via:
1. Cloudflare dashboard → Pages → Create project
2. Connect your Git repository
3. Configure build settings

#### GitHub Pages

Not recommended due to external API requirements and database, but possible:

```bash
# Update astro.config.mjs
export default defineConfig({
    site: 'https://yourusername.github.io',
    base: '/repository-name',
    // ...
});

# Build
npm run build

# Deploy dist/ folder to gh-pages branch
```

---

## Troubleshooting

### Build Errors

**❌ "Missing environment variable"**
- Check `.env` file exists in project root
- Verify variable names match exactly (case-sensitive)
- For Vercel: Add in dashboard → Settings → Environment Variables
- Remember to redeploy after adding variables

**❌ "Failed to fetch from GitHub API"**
- Verify `GITHUB_TOKEN` is set and valid
- Check token has `repo` or `public_repo` scope
- Ensure repository exists and is accessible
- Check GitHub API rate limits (60/hour without token, 5000/hour with token)

**❌ "API fetch errors"**
- Check that API keys are set correctly in `.env`
- Verify API keys have not expired
- Check API service status (Cleve, Hardcover, TMDB, etc.)
- External APIs are only called during build, not in dev mode (run `npm run build` to test)

**❌ "Module not found" errors**
- Run `npm install` again
- Delete `node_modules/` and reinstall: `rm -rf node_modules && npm install`
- Clear Astro cache: `rm -rf .astro`

### Content Not Showing

**❌ Blog posts not appearing**
- Check file is in `/src/content/blog/`
- Verify frontmatter has required fields: `title`, `date`
- Check date format: `2025-03-07` (ISO format, not `03/07/2025`)
- Ensure date is in the past (future posts may not show)
- Check for YAML syntax errors in frontmatter

**❌ Images not loading**
- For blog: Use path from `src/`: `image: 'src/assets/blog/image.jpg'`
- For components: Import the image: `import img from '../assets/img.jpg'`
- Check file extension matches (case-sensitive on Linux)
- Verify image file actually exists

**❌ External content missing (garden, bookmarks, etc.)**
- Check API tokens are set correctly in `.env`
- Look at build logs for specific API errors
- Remember: External content only loads at **build time**, not in dev server
- Run `npm run build` to test API integrations
- Check API service status (GitHub, Raindrop, etc.)

### Performance Issues

**🐌 Slow build times**
- External API calls add time (each service = +2-5 seconds)
- Large image assets slow optimization
- Consider: Reduce image sizes, disable unused API integrations

**🐌 Large bundle size**
- Check bundle analysis: `npm run build` shows sizes
- Remove unused integrations
- Optimize images before adding to project

### Local Development Issues

**❌ Port 4321 already in use**
```bash
# Kill the process using port 4321
lsof -ti:4321 | xargs kill

# Or use a different port
npm run dev -- --port 3000
```

**❌ Changes not reflecting**
- Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Restart dev server
- Clear `.astro/` cache folder

---

## FAQ

**Q: Do I need all the API tokens to use this website?**

A: No! The site works with partial configuration. Missing APIs simply won't show that content. You can start with just blog posts and projects.

**Q: How do I update content after deployment?**

A:
- **Local content** (blog, projects): Edit files, commit, push to GitHub → auto-deploys on Vercel
- **External content** (garden, bookmarks): Updates on next build (Vercel rebuilds on every push)
- Vercel redeploys automatically on every git push to main branch

**Q: Can I use this for my own website?**

A: Yes! The code is MIT licensed. However:
- Replace all personal information (name, domain, API keys)
- Use your own content (blog posts, projects, photos)
- Consider creating your own design variations to make it unique
- Remove or replace the Cleve API integration with your own data source

**Q: How do I add a contact form?**

A: There are form examples in `/src/pages/postcards/new.astro`. You can adapt the form handling for a contact page.

**Q: Where is analytics data stored?**

A:
- **Plausible** (default): Data in Plausible dashboard, GDPR compliant
- **No cookies required** for Plausible
- Completely privacy-focused

**Q: How do I change the domain?**

A:
1. Update `site` in `/astro.config.mjs` to your domain
2. Configure domain in Vercel dashboard
3. Update DNS records as Vercel instructs

**Q: What if I don't want the digital garden?**

A: Simply delete `/src/pages/garden/` and remove navigation links. The build will work fine without it.

**Q: Can I use a CMS instead of markdown files?**

A: Yes! Astro supports:
- Headless CMS (Contentful, Strapi, Sanity)
- Git-based CMS (Decap CMS, Tina CMS)
- You'll need to modify data fetching in page components

**Q: How do I get EXIF data from photos?**

A: The project includes `exifreader` package. Example usage:
```typescript
import ExifReader from 'exifreader';
const tags = ExifReader.load(imageFile);
```

---

## License

### Code License

The code is licensed under [MIT License](MIT.md)

You can use parts of the code for any purpose, but not the website as a whole. Copying the entire design is not permitted as it belongs to the original creator.

### Content License

The content is licensed under [CC BY-NC-SA 4.0](CC.md)

You can use the content for non-commercial purposes with:
- Attribution to the original source
- Share-alike (same license)
- Non-commercial use only

### Fonts

Some fonts require licenses:

**✅ Free to use (Open Font License):**
- [Fira Mono](https://mozilla.github.io/Fira/) - Mozilla

**⚠️ Requires commercial license:**
- [Apercu](https://www.colophon-foundry.org/typefaces/apercu) - Colophon Foundry

If you use this template, replace Apercu with a free alternative like:
- Inter
- IBM Plex Sans
- Space Grotesk
- Work Sans

---

## Additional Resources

### Astro Documentation
- [Astro Docs](https://docs.astro.build) - Official documentation
- [Content Collections](https://docs.astro.build/en/guides/content-collections/) - Type-safe content
- [Astro DB](https://docs.astro.build/en/guides/astro-db/) - Built-in database
- [Deployment](https://docs.astro.build/en/guides/deploy/) - Deploy guides

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs) - Framework documentation
- [Typography Plugin](https://tailwindcss.com/docs/typography-plugin) - Prose styling

### External Services
- [Resend Docs](https://resend.com/docs) - Email API
- [GitHub API](https://docs.github.com/en/rest) - REST API docs
- [Raindrop API](https://developer.raindrop.io) - Bookmark service

### Learning Resources
- [Astro Blog Tutorial](https://docs.astro.build/en/tutorial/0-introduction/) - Official tutorial
- [Astro Discord](https://astro.build/chat) - Community support

---

## Support & Contributing

### Getting Help

If you encounter issues:

1. **Check this README** - Most common issues covered
2. **Check build logs** - Errors show specific problems
3. **Verify environment variables** - Common source of issues
4. **Clear cache**: `rm -rf node_modules .astro && npm install`
5. **Check Node version**: Must be 20 or higher

### Reporting Issues

Found a bug? Please include:
- Node.js version (`node -v`)
- npm version (`npm -v`)
- Operating system
- Error messages (full output)
- Steps to reproduce

---

**🎉 You're all set!** Start by customizing the content in `/src/content/`, update your personal information, and deploy to Vercel. Happy building!

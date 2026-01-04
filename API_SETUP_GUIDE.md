# API Setup Guide

This guide will help you set up the external API integrations for your personal website.

## 📚 Hardcover (Books) - ⚠️ NEEDS VERIFICATION

**Status:** You have added the HARDCOVER_API_KEY to your .env file.

**What it does:** Fetches your reading list and reviews from Hardcover for the `/media` page.

**How to get your API key:**

1. Go to https://hardcover.app/account/api
2. Log in to your account
3. Your API token will be displayed at the top of the page
4. Copy the token and update your .env:

```env
HARDCOVER_API_KEY=your_api_key_here
```

**Troubleshooting:** If books aren't showing:
1. Make sure you have books added to your Hardcover library
2. Mark books as "Read" or "Currently Reading" to see them on the site
3. Check that your API token hasn't expired (tokens reset on January 1st each year)
4. Visit https://hardcover.app to verify your reading list

---

## 🔖 Raindrop.io (Bookmarks) - ⚠️ NEEDS FIX

**Current Status:** Token appears to be invalid (getting "Unauthorized" error)

**How to get a valid token:**

1. Go to https://app.raindrop.io
2. Log in to your account
3. Go to **Settings** → **Integrations** → **For Developers**
4. Click **"Create new app"**
5. Give it a name (e.g., "Personal Website")
6. Click **"Create"**
7. Click **"Create test token"**
8. Copy the token and update your .env:

```env
RAINDROP_TOKEN=paste_your_new_token_here
```

**Important:** The token format should look like: `a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6`

**What it does:**
- Displays your favorited bookmarks (marked with ❤️) on `/bookmarks` page
- Shows latest bookmarks on the homepage

---

## 📖 GitHub (Optional - for book notes)

**Current Status:** NOT configured (causing warnings during build)

**Do you need this?** Only if you want to link books to your notes/reviews in a GitHub repository.

**How to set it up:**

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: "Personal Website"
4. Select scope: **`public_repo`** (or `repo` if you want access to private repos)
5. Click **"Generate token"**
6. Copy the token (it starts with `ghp_`)
7. Add to your .env:

```env
GITHUB_TOKEN=ghp_your_token_here
```

**Skip this if:** You don't have a GitHub repository with book notes. The books page will work fine without it.

---

## 🎬 Letterboxd (Movies) - ✅ NO TOKEN NEEDED!

**Current Status:** Working! Uses RSS feed scraping.

**How to configure:**

1. Make sure you have a Letterboxd account
2. Add movies to your diary
3. Update your username in `/src/pages/movies.astro`:

```typescript
const username = 'mfrashad'; // Change to YOUR Letterboxd username
```

4. That's it! No API token needed.

**What it does:** Fetches your watched movies from your public Letterboxd diary (movies watched since 2024).

---

## 🎵 Spotify (Optional - currently not used)

**Status:** NOT configured

These variables are in the .env.example but not currently used on your site. You can add this feature later if you want.

---

## ✅ Quick Fix Checklist

To get everything working:

1. **Raindrop.io - REQUIRED FIX:**
   - Get a new test token from Raindrop.io
   - Update your .env file

2. **Letterboxd:**
   - Update username in `/src/pages/movies.astro` to your username

3. **GitHub (optional):**
   - Either add GITHUB_TOKEN to link books to notes
   - Or ignore the warnings (books will still work)

---

## 🧪 Testing Your Setup

After updating your .env file:

```bash
# Restart dev server
npm run dev

# Test the build
npm run build
```

Visit these pages to verify:
- http://localhost:4321/media (books)
- http://localhost:4321/bookmarks (bookmarks)
- http://localhost:4321/movies (movies)

---

## 🔒 Security Reminders

- ✅ `.env` is in `.gitignore` - your tokens are safe
- ⚠️ Never commit your `.env` file to git
- ⚠️ Never share your API tokens publicly
- ✅ When deploying to Vercel, add these as environment variables in the dashboard

---

## 📧 Need Help?

If you're still having issues:
1. Check the console/terminal for error messages
2. Verify tokens are copied correctly (no extra spaces)
3. Make sure your accounts are public or tokens have proper permissions
4. Try regenerating the tokens

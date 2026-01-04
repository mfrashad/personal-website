/**
 * Script to fetch and cache Letterboxd data
 * Run with: npm run fetch:movies
 */

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import { fetchAndCacheLetterboxdData } from '../src/utils/letterboxdCache';

const username = 'mfrashad'; // Update this to your Letterboxd username
const maxPages = 5; // Number of pages to scrape

async function main() {
    try {
        console.log(`Fetching Letterboxd data for user: ${username}`);
        await fetchAndCacheLetterboxdData(username, maxPages);
        console.log('✓ Done! Movie data has been cached.');
        console.log('  You can now run npm run dev or npm run build to use this data.');
    } catch (error) {
        console.error('Failed to fetch Letterboxd data:', error);
        process.exit(1);
    }
}

main();

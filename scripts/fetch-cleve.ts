// Load environment variables from .env file BEFORE any other imports
import dotenv from 'dotenv';
dotenv.config();

async function main() {
    try {
        // Dynamic import after dotenv is loaded
        const { fetchAndCacheCleveWritings } = await import('../src/utils/cleveCache');

        console.log('Starting Cleve writings fetch...');
        const data = await fetchAndCacheCleveWritings();
        console.log(`✓ Successfully cached ${data.count} writings`);
        console.log(`  Last updated: ${data.updated_at}`);
    } catch (error) {
        console.error('✗ Error fetching Cleve writings:', error);
        process.exit(1);
    }
}

main();

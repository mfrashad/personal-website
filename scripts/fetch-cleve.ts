import { fetchAndCacheCleveWritings } from '../src/utils/cleveCache';

async function main() {
    try {
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

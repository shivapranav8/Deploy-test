/**
 * Script to import your existing PRDs into the vector database
 * 
 * Usage:
 * 1. Put your 40 PRDs in: /Users/shiva-21912/Downloads/My APM/data/prd-examples/
 * 2. PRDs can be .txt or .md format
 * 3. Run: npm run import-prds
 */

import { importPRDsFromDirectory } from '../utils/vectorDB';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PRD_DIRECTORY = path.join(__dirname, '../../data/prd-examples');

async function main() {
    console.log('🚀 Starting PRD import...');
    console.log(`📁 Looking for PRDs in: ${PRD_DIRECTORY}`);

    await importPRDsFromDirectory(PRD_DIRECTORY);

    console.log('✅ Import complete!');
    process.exit(0);
}

main().catch((error) => {
    console.error('❌ Import failed:', error);
    process.exit(1);
});

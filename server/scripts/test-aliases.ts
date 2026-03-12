/**
 * Test alias expansion with Sandbox -> Linked Workspace mapping
 */

import { expandQueryWithAliases } from '../utils/featureAliases';
import { findSimilarPRDs } from '../utils/vectorDB';

async function testAliases() {
    console.log('🧪 Testing Alias Expansion\n');

    const testCases = [
        'Sandbox',
        'Zoho Analytics Sandbox',
        'Linked Workspace',
        'Ask Zia',
        'Conversational Analytics',
        'Live Connection'
    ];

    for (const testQuery of testCases) {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`Original: "${testQuery}"`);
        const expanded = expandQueryWithAliases(testQuery);
        console.log(`Expanded: "${expanded}"`);
        console.log('='.repeat(80));

        // Test actual retrieval
        const results = await findSimilarPRDs(expanded, 3);
        console.log(`\nTop 3 Results:`);
        results.forEach((prd, idx) => {
            console.log(`  ${idx + 1}. ${prd.metadata.filename} (sim: ${(1 - prd.distance).toFixed(3)})`);
        });
    }
}

testAliases().catch(console.error);

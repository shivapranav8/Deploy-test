/**
 * Test script to debug RAG similarity search - Test 2
 */

import { findSimilarPRDs } from '../utils/vectorDB';

async function testRAG() {
    console.log('🔍 Testing RAG with different queries...\n');

    const queries = [
        'Linked Workspace',
        'Sandbox',
        'workspace sharing collaboration',
        'Zoho Analytics workspace feature'
    ];

    for (const query of queries) {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`Query: "${query}"`);
        console.log('='.repeat(80));

        const similarPRDs = await findSimilarPRDs(query, 3);

        similarPRDs.forEach((prd, idx) => {
            console.log(`\n${idx + 1}. Similarity: ${(1 - prd.distance).toFixed(4)} | Distance: ${prd.distance.toFixed(4)}`);
            console.log(`   File: ${prd.metadata.filename}`);
            console.log(`   ID: ${prd.metadata.filepath.split('/prd-examples/')[1]}`);
        });
    }
}

testRAG().catch(console.error);

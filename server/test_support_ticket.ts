// Test the support ticket agent directly
import * as dotenv from 'dotenv';
dotenv.config();

import { generateSupportTicketResponse } from './agents/supportTicket.js';


async function testSupportTicket() {
    console.log('🎫 Testing Support Ticket Writer...\n');

    const input = {
        communityLink: 'https://help.zoho.com/portal/en/community/topic/quick-copy-column-name',
        developerNotes: `We can currently double-click the table column name / QT table column name and then press Ctrl+C to copy it`,
        problemStatement: 'User requesting quick copy feature for column names in Table or Query Views',
        prdContent: 'User wants to copy column names via right-click menu or Ctrl+C shortcut'
    };

    try {
        const result = await generateSupportTicketResponse(input);

        console.log('✅ Generated Response:\n');
        console.log('═'.repeat(80));
        console.log(result.response);
        console.log('═'.repeat(80));

        console.log('\n📚 Similar Responses Used:');
        result.similarResponses.forEach((sr, idx) => {
            console.log(`\n${idx + 1}. ${sr.url}`);
            console.log(`   Similarity: ${(sr.similarity * 100).toFixed(1)}%`);
            console.log(`   Excerpt: ${sr.excerpt.substring(0, 150)}...`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testSupportTicket();

import { generateMeetingMoM } from './agents/meetingMoM.js';

// Test with your example MoM
const testTranscript = `
Meeting Discussion:

UI Team:
- We need to rename "Create Sandbox" to "Create Environment"
- The Stage option should only be required for the last stage, not all stages
- First stage should allow only one organization (current organization)
- Subsequent stages can have the option to create a new workspace
- Validation screen should be different from the existing Linked Workspace Validation screen
- For Duplicate Environment: Prompt the user to enter a new environment name and handle Workspace Assigning case
- Create new Environment is missing in Environment Listing Page
- For Delete Environment: Show an alert stating that only the environment will be deleted, not the workspace
- Environment Listing: Proceed with the first option (scroll layout), as the second option may resemble tags
- Version History will not be available in the first stage and should be renamed to Deployment History
- Connection Management and User Management should redirect via hyperlinks to the respective Data Source and Workspace User Management pages
- Remove the Status column from History and replace "View Modified" with "Deployed"
- Deleted changesets will not be supported in Phase 1
- Add Stage option should be available only in the last stage
- Update the Workspace label and ensure it is not available in the Production workspace

PM Team:
- Handle deployment error cases explicitly

Engineering Team:
- Modified Entries: Consider both rename, query and Code Studio scenarios
`;

async function testMeetingMoM() {
    console.log('🧪 Testing Meeting MoM Generator...\n');

    try {
        const result = await generateMeetingMoM({
            transcript: testTranscript,
            meetingTitle: 'Environment Management Feature Discussion',
            meetingDate: '2026-01-29',
        });

        console.log('\n📄 Generated Markdown:');
        console.log('='.repeat(80));
        console.log(result.markdown);
        console.log('='.repeat(80));

        console.log('\n📊 Summary:', result.summary);
        console.log('\n✅ Decisions:', result.decisions);
        console.log('\n📋 Action Items by Category:');
        result.actionItems.forEach(category => {
            console.log(`\n  ${category.category}:`);
            category.items.forEach(item => {
                console.log(`    - ${item}`);
            });
        });

        console.log('\n✅ Test completed successfully!');
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testMeetingMoM();

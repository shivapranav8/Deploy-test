import { competitorAgent } from './agents/competitor.ts';
import dotenv from 'dotenv';

dotenv.config();

async function test() {
    console.log("Testing competitorAgent standalone...");
    try {
        const result = await competitorAgent(
            "Real-time Collaboration",
            "https://analytics.zoho.com"
        );
        console.log("✅ Result:", JSON.stringify(result, null, 2));

        if (result.featureDefinition && result.capabilityDimensions && result.competitors && result.insights) {
            console.log("\n✅ Schema Validation Passed!");
            console.log("Feature:", result.featureDefinition);
            console.log("Dimensions:", result.capabilityDimensions.map((d: any) => d.name).join(", "));
            console.log("Insights:", Object.keys(result.insights).join(", "));
        } else {
            console.error("\n❌ Schema Validation Failed!");
        }
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

test();

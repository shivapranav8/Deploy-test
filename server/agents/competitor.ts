import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";
import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";
import dotenv from 'dotenv';

dotenv.config();

// Define schema
// Define schema for Feature-Level Deep Dive
const competitorSchema = z.object({
    featureDefinition: z.string().describe("Clear definition of the specific feature being analyzed"),
    capabilityDimensions: z.array(z.object({
        name: z.string(),
        description: z.string()
    })).describe("Breakdown of the feature into granular capability dimensions (columns for the matrix)"),
    competitors: z.array(z.object({
        name: z.string(),
        capabilities: z.record(z.string()).describe("Map of dimension names to values/assessments for this competitor"),
        strengths: z.array(z.string()).describe("Specific feature-level strengths"),
        gaps: z.array(z.string()).describe("Specific feature-level gaps"),
        marketPosition: z.string(),
        videoUrl: z.string().optional().describe("Link to a demo video if found, or empty"),
    })).describe("List of 3-4 real competitors"),
    insights: z.object({
        marketPatterns: z.array(z.string()).describe("Common patterns or trends in how this feature is implemented"),
        designTradeoffs: z.array(z.string()).describe("Trade-offs competitors make (e.g., ease vs power)"),
        whiteSpace: z.array(z.string()).describe("Unaddressed needs or gaps in the current market"),
    }),
    opportunityZones: z.array(z.string()).describe("Specific areas where we can differentiate"),
});

export const competitorAgent = async (topic: string, productUrl: string) => {
    console.log(`🔎 [Researcher] Deep Dive Search for: ${topic} (Context: ${productUrl})`);

    // 1. Perform Search
    const retriever = new TavilySearchAPIRetriever({
        k: 3, // Increased k for deeper context
    });

    console.log('🔎 [Researcher] Starting Tavily search...');
    // Refined search query for implementation details
    const searchResults = await retriever.invoke(`how competitors implement "${topic}" feature comparison ${productUrl ? `vs ${productUrl}` : ''} user docs api`);
    console.log('✅ [Researcher] Search complete. Found results:', searchResults.length);
    console.log('📦 [Researcher] Search data length:', JSON.stringify(searchResults).length);

    // 2. Synthesize with LLM
    const model = new ChatOpenAI({
        modelName: "gpt-4o-mini",
        temperature: 0.5,
        modelKwargs: { response_format: { type: "json_object" } },
    });

    const prompt = PromptTemplate.fromTemplate(`
    You are a Competitive Intelligence Product Agent.
    OBJECTIVE: Perform a "Feature-Level Deep Dive" analysis on the feature: "{topic}".
    CONTEXT: The user's product is at: "{productUrl}".

    ONE-LINE RULE: Competitive analysis must decompose features into capabilities, NOT compare products at a surface level.
    
    1. BREAKDOWN: Decompose the feature into 4-6 specific "Capability Dimensions" (e.g., if "Real-time Collaboration", dimensions might be "Cursor Tracking", "Conflict Resolution", "Version History").
    2. MATRIX: For each competitor, evaluate them against these EXACT dimensions.
    3. INSIGHTS: Identify market patterns, design trade-offs, and white space opportunities.

    RAW SEARCH DATA:
    {search_data}

    Strictly valid JSON output matching this schema:
    {{
        "featureDefinition": "string",
        "capabilityDimensions": [
            {{ "name": "string", "description": "string" }}
        ],
        "competitors": [
            {{
                "name": "string (Real company name)",
                "capabilities": {{
                    "Dimension Name 1": "Value/Assessment (e.g., 'Manual only', 'Auto-save')",
                    "Dimension Name 2": "Value"
                }},
                "strengths": ["string (Feature specific)"],
                "gaps": ["string (Feature specific)"],
                "marketPosition": "string",
                "videoUrl": "string (optional)"
            }}
        ],
        "insights": {{
            "marketPatterns": ["string"],
            "designTradeoffs": ["string"],
            "whiteSpace": ["string"]
        }},
        "opportunityZones": ["string"]
    }}
  `);

    const chain = prompt.pipe(model);

    console.log('🤖 [Researcher] Starting LLM synthesis...');
    const result = await chain.invoke({
        topic,
        productUrl,
        search_data: JSON.stringify(searchResults)
    });
    console.log('✅ [Researcher] LLM synthesis complete.');

    try {
        const parsed = JSON.parse(result.content as string);
        return parsed;
    } catch (e) {
        console.error("Failed to parse JSON", e);
        return { error: "Failed to generate competitor data" };
    }
};

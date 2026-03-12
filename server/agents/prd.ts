import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";
import dotenv from 'dotenv';
import { findSimilarPRDs } from '../utils/vectorDB';
import { expandQueryWithAliases } from '../utils/featureAliases';

dotenv.config();

// Define Schema for Table-Based PRD
const prdRowSchema = z.object({
    feature: z.string().describe("Top-level capability group"),
    subFeature: z.string().describe("Specific UI element or user-facing functionality under the feature"),
    description: z.string().describe("Clear, concise explanation of what the sub-feature does and how it behaves"),
    pmNotes: z.string().describe("Implementation notes, edge cases, or follow-ups from a PM perspective")
});

const prdTableSchema = z.object({
    featureName: z.string().describe("Name of the feature being documented"),
    rows: z.array(prdRowSchema).describe("Array of functional requirements rows"),
    generatedAt: z.string().describe("Timestamp of generation")
});

export const prdAgent = async (
    topic: string,
    mrdData?: any,
    competitorData?: any,
    images?: string[] // Base64 encoded images or URLs
) => {
    const model = new ChatOpenAI({
        modelName: images && images.length > 0 ? "gpt-4o" : "gpt-4o", // Use vision model if images present
        temperature: 0.2, // Lower temperature for more structured/precise document
    });

    const structuredModel = model.withStructuredOutput(prdTableSchema);

    const imageContext = images && images.length > 0
        ? `\nMockup Images Provided: ${images.length} screenshot(s) - analyze UI elements and flows to extract granular sub-features.`
        : "";

    // RAG: Retrieve similar PRDs from vector DB with improved query
    // Focus on the topic/feature name first, then add relevant context from MRD
    let ragQuery = topic;

    // Extract key terms from MRD if available (avoid full JSON dump)
    if (mrdData) {
        const mrdText = typeof mrdData === 'string' ? mrdData : JSON.stringify(mrdData);
        // Extract first 500 chars of relevant MRD context
        const mrdSnippet = mrdText.substring(0, 500);
        ragQuery += `\n${mrdSnippet}`;
    }

    // Expand query with known Zoho Analytics aliases
    const expandedQuery = expandQueryWithAliases(ragQuery);

    console.log(`🔍 Original Query: ${ragQuery.substring(0, 100)}...`);
    console.log(`🔍 Expanded Query: ${expandedQuery.substring(0, 200)}...`);

    const similarPRDs = await findSimilarPRDs(expandedQuery, 10); // Use expanded query with 10 results

    console.log(`📚 Retrieved ${similarPRDs.length} similar PRDs:`);
    similarPRDs.forEach((prd, idx) => {
        console.log(`   ${idx + 1}. ${prd.metadata.filename} (similarity: ${(1 - prd.distance).toFixed(2)})`);
    });

    let examplesContext = "";
    if (similarPRDs.length > 0) {
        examplesContext = "\n\nYour Company's PRD Style Examples (follow this format and tone):\n" +
            similarPRDs.map((prd, idx) =>
                `\n--- Example ${idx + 1} (Similarity: ${(1 - (prd.distance || 0)).toFixed(2)}) ---\n${prd.content}\n`
            ).join("\n");
    }

    const prompt = PromptTemplate.fromTemplate(`
    You are a Senior Product Manager creating a Functional Requirements Document (PRD/FRD).

    Input Context:
    - Feature/Topic: "{topic}"
    - MRD Data: {mrd_context}
    - Competitor Insights: {competitor_context}${imageContext}${examplesContext}
    
    Create a functional requirements table with these 4 columns:
    1. **Feature** – top-level capability group (e.g., "User Authentication", "Dashboard", "Settings")
    2. **Sub-feature** – specific UI element or user-facing functionality (e.g., "Login Form", "Password Reset Link")
    3. **Description** – clear explanation of what it does and how it behaves (user perspective, not implementation)
    4. **PM Notes** – implementation notes, edge cases, follow-ups, dependencies
    
    Requirements:
    - Go as GRANULAR as possible - every button, field, interaction should be a row
    - Group related sub-features under their parent features
    - Cover the FULL LIFECYCLE for each feature: Create, Read/View, Edit/Update, Delete operations
    - Only include UI/backend behaviors DIRECTLY RELEVANT to the user experience
    - Do NOT explain third-party tools unless they are integrated into the feature
    - Avoid low-level implementation details (e.g., database schema, API endpoints) unless CRITICAL to behavior
    - For each sub-feature, ask: "What does the user see/do?" and "What happens when they interact with it?"
    
    Examples:
    
    | Feature | Sub-feature | Description | PM Notes |
    |---------|-------------|-------------|----------|
    | User Authentication | Sign Up Form | Email, password, confirm password fields with real-time validation. Submit button triggers account creation. | Validate email uniqueness on backend. Password strength: min 8 chars, 1 uppercase, 1 number |
    | User Authentication | Login Form | Email and password fields. "Remember Me" checkbox. Submit redirects to dashboard on success. | Session timeout: 30 days if "Remember Me", else 1 day |
    | User Authentication | Forgot Password Link | Link below login form opens password reset modal with email input. | Send reset email with 1-hour expiry token |
    | Dashboard | Welcome Banner | Displays "Welcome back, [Name]!" with user's first name and last login timestamp | Fetch from user profile API on page load |
    | Dashboard | Quick Stats Cards | 3 cards showing: Total Projects, Active Tasks, Overdue Items. Click to navigate to filtered views. | Real-time data sync every 30s. Red badge on overdue count |
    
    Return as a JSON object with the structure: {{ featureName, rows: [{{ feature, subFeature, description, pmNotes }}], generatedAt }}
  `);

    const chain = prompt.pipe(structuredModel);

    const result = await chain.invoke({
        topic,
        mrd_context: JSON.stringify(mrdData || {}),
        competitor_context: JSON.stringify(competitorData || {})
    });

    return result;
};

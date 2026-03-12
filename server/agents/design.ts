import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";
import dotenv from 'dotenv';
import { competitorAgent } from "./competitor";
import { discoveryAgent } from "./discovery";

dotenv.config();

// Define Schema
const designSchema = z.object({
    goal: z.string().describe("High level design goal"),
    persona: z.string().describe("Target persona for the UI (e.g., 'Busy Exec')"),
    tone: z.string().describe("Visual tone (e.g., 'Clean, Enterprise, Friendly')"),
    constraints: z.array(z.string()).describe("Technical or brand constraints"),
    screens: z.array(z.object({
        name: z.string(),
        description: z.string(),
        states: z.array(z.string()).describe("List of states like Empty, Loading, Error, etc.")
    })),
    accessibility: z.array(z.string()).describe("WCAG compliance notes"),
});

export const designAgent = async (topic: string, mrdData?: any) => {
    const model = new ChatOpenAI({
        modelName: "gpt-4o",
        temperature: 0.7,
    });

    const structuredModel = model.withStructuredOutput(designSchema);

    const prompt = PromptTemplate.fromTemplate(`
    You are a Senior Product Designer. 
    Create a 'Design Prompt' for an AI UI generator (like Figma AI) based on this feature: "{topic}".
    
    Context from Discovery (MRD):
    {mrd_context}
    
    Output strictly in the requested JSON format.
  `);

    const chain = prompt.pipe(structuredModel);

    const result = await chain.invoke({
        topic,
        mrd_context: JSON.stringify(mrdData || {})
    });

    return result;
};

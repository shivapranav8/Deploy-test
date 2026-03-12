
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";
import dotenv from 'dotenv';

dotenv.config();

// Define the Schema
const mrdSchema = z.object({
    featureName: z.string().describe("Name of the feature"),
    problemStatement: z.string().describe("Clear, concise problem statement"),
    personas: z.array(z.object({
        name: z.string(),
        description: z.string()
    })).describe("2-3 target user personas"),
    painPoints: z.array(z.string()).describe("3-5 key user pain points"),
    currentJourney: z.array(z.string()).describe("5-7 steps of the current 'As-Is' user journey"),
    priority: z.enum(['Must Have', 'Should Have', 'Could Have', "Won't Have"]).describe("MoSCoW priority"),
});

export const discoveryAgent = async (topic: string) => {
    const model = new ChatOpenAI({
        modelName: "gpt-4o",
        temperature: 0.7,
    });

    const structuredModel = model.withStructuredOutput(mrdSchema);

    const prompt = PromptTemplate.fromTemplate(`
    You are an expert Product Manager defined as a "Discovery Agent".
    Your goal is to define the boundaries of a new feature idea.
    
    Topic: {topic}
    
    Think step-by-step:
    1. Who is this for?
    2. What really hurts right now? (The Problem)
    3. How do they do it today? (The Journey)
    
    Output strictly in the requested JSON format.
  `);

    const chain = prompt.pipe(structuredModel);
    const result = await chain.invoke({ topic });

    // Add backend-only fields or defaults and return
    return {
        ...result,
        version: 1,
        status: 'draft'
    };
};

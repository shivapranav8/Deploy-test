import { ChatOpenAI } from "@langchain/openai";
import dotenv from 'dotenv';

dotenv.config();

async function test() {
    console.log("Testing OpenAI connection...");
    if (!process.env.OPENAI_API_KEY) {
        console.error("❌ OPENAI_API_KEY is missing");
        return;
    }
    console.log("Key found (length):", process.env.OPENAI_API_KEY.length);

    try {
        const model = new ChatOpenAI({
            modelName: "gpt-4o-mini",
            temperature: 0.5,
        });

        console.log("Invoking model...");
        const response = await model.invoke("Say hello");
        console.log("✅ Response:", response.content);
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

test();

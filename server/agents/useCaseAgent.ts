import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';

const preambleSchema = z.object({
    whatItIs: z.string().describe('What is this feature? 2–3 sentence overview of its purpose and value'),
    triggeredFrom: z.string().describe('Where in the product this feature is accessed (navigation path)'),
    whoCanTrigger: z.string().describe('User roles or personas who can access/trigger this feature'),
    successMetrics: z.string().describe('Key success metrics (comma-separated) to measure adoption and impact'),
});

const useCaseRowSchema = z.object({
    sNo: z.string().describe('Sequential number like "1", "2", etc.'),
    useCase: z.string().describe('Short title of the use case (e.g. "Creating a Report", "Editing Filters")'),
    description: z.string().describe('Detailed description of the use case including steps, UI behavior, and outcomes. Be thorough.'),
    pmNotes: z.string().describe('PM perspective: edge cases, business rules, dependencies, follow-ups, phasing'),
    developerNotes: z.string().describe('Developer perspective: API considerations, performance, technical constraints, data handling'),
    qaNotes: z.string().describe('QA perspective: test scenarios, boundary conditions, regression areas, validation checks'),
});

const useCaseOutputSchema = z.object({
    featureName: z.string().describe('Full name of the feature being documented'),
    preamble: preambleSchema,
    useCases: z.array(useCaseRowSchema).describe('Array of use cases covering all major user journeys for this feature'),
});

export type UseCaseOutput = z.infer<typeof useCaseOutputSchema>;

const model = new ChatOpenAI({
    modelName: 'gpt-4o',
    temperature: 0.3,
});

const structuredModel = model.withStructuredOutput(useCaseOutputSchema);

export async function generateUseCases(
    topic: string,
    mrdData?: any,
    prdData?: any,
): Promise<UseCaseOutput> {
    console.log(`\n📋 [Use Case Agent] Generating use cases for: ${topic}`);

    const mrdContext = mrdData ? JSON.stringify(mrdData, null, 2).substring(0, 2000) : 'Not provided';
    const prdContext = prdData
        ? (Array.isArray(prdData.rows)
            ? prdData.rows.map((r: any) => `${r.feature} > ${r.subFeature}: ${r.description}`).join('\n')
            : JSON.stringify(prdData, null, 2).substring(0, 2000))
        : 'Not provided';

    const result = await structuredModel.invoke(`
You are a Senior Product Manager writing a Use Cases sheet for a PRD.

Feature / Topic: "${topic}"

MRD Context:
${mrdContext}

PRD Functional Requirements (already generated):
${prdContext}

---

Your task: Generate a comprehensive Use Cases document that captures every significant user journey for this feature.

**Preamble**: Write a clear overview of the feature — what it is, where it lives, who uses it, and how success is measured.

**Use Cases**: Cover the FULL lifecycle:
- Creation / Setup flows
- Viewing / Reading / Listing
- Editing / Updating
- Deletion / Removal
- Permissions / Access control
- Error / edge case flows
- Any secondary flows (e.g., sharing, exporting, notifications)

For each use case:
- **Use Case**: Short action-oriented title
- **Description**: Step-by-step user flow with what they see and what happens at each step
- **PM Notes**: Business rules, edge cases, phasing decisions, dependencies
- **Developer Notes**: API design considerations, performance concerns, data models, technical constraints
- **QA Notes**: Test scenarios, boundary conditions, validation rules, regression areas

Aim for 8–15 use cases minimum. Be thorough and specific to "${topic}" in the context of Zoho Analytics.
`);

    console.log(`✅ [Use Case Agent] Generated ${result.useCases.length} use cases`);
    return result;
}

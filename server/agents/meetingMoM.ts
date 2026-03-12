import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';

// Input schema for meeting MoM generator
const MeetingMoMInputSchema = z.object({
    meetingLink: z.string().optional().describe('Link to meeting recording'),
    transcript: z.string().optional().describe('Meeting transcript or notes'),
    meetingTitle: z.string().optional().describe('Title of the meeting'),
    visualContext: z.string().optional().describe('Visual context from screen sharing/slides analysis'),
    detailed: z.boolean().optional().describe('Generate detailed report with term validation'),
});

// Output schema matching frontend MeetingMoMData interface
const MeetingMoMOutputSchema = z.object({
    meetingTitle: z.string(),
    date: z.string(),
    duration: z.string(),
    attendees: z.array(z.string()),
    summary: z.string(),
    keyDiscussions: z.array(z.string()),
    decisions: z.array(z.string()),
    actionItems: z.array(z.object({
        id: z.string(),
        task: z.string(),
        assignee: z.string(),
        dueDate: z.string(),
        priority: z.enum(['High', 'Medium', 'Low']),
        status: z.enum(['Pending', 'In Progress', 'Completed']),
    })),
    termDefinitions: z.array(z.object({
        term: z.string(),
        definition: z.string(),
        status: z.enum(['Verified', 'Needs Review']),
    })).optional(),
    nextMeeting: z.string().optional(),
});

export type MeetingMoMInput = z.infer<typeof MeetingMoMInputSchema>;
export type MeetingMoMOutput = z.infer<typeof MeetingMoMOutputSchema>;

// Initialize the model
const model = new ChatOpenAI({
    modelName: 'gpt-4o',
    temperature: 0.3,
});

export async function generateMeetingMoM(
    input: MeetingMoMInput
): Promise<MeetingMoMOutput> {
    console.log('\n📝 Generating Meeting MoM...');

    // For now, we need a transcript. Meeting link fetching is not yet implemented
    if (!input.transcript) {
        if (input.meetingLink) {
            console.warn('⚠️  Meeting link provided but transcript fetching not yet implemented');
            // Return helpful fallback
            return {
                meetingTitle: input.meetingTitle || 'Team Meeting',
                date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                duration: '1h',
                attendees: ['Team Member'],
                summary: 'To generate meeting minutes, please provide the meeting transcript. Meeting link processing is coming soon!',
                keyDiscussions: ['Transcript required for processing'],
                decisions: [],
                actionItems: [],
            };
        }
        throw new Error('Either transcript or meeting link is required');
    }

    const transcript = input.transcript;
    console.log('📄 Transcript length:', transcript.length, 'characters');

    if (input.visualContext) {
        console.log('👁️  Visual context available:', input.visualContext.length, 'characters');
    }


    const systemPrompt = input.detailed ?
        `You are an expert BI (Business Intelligence) Technical Writer and Meeting Analyst. Analyze the meeting transcript${input.visualContext ? ' and visual context' : ''} to generate a DEEP DIVE, HIGH-FIDELITY meeting record.

**Meeting Transcript**:
${transcript}
${input.visualContext ? `\n**Visual Context**:\n${input.visualContext}\n` : ''}

**Your Task**:
Generate an extensive JSON report. Focus on capturing technical nuances, specific data points, and verifying BI terminology (e.g., PII, ETL, KPI, etc.).

1. **Meeting Title**: Specific and descriptive.
2. **Attendees**: Full list with inferred roles.
3. **Summary**: Comprehensive 5-8 sentence paragraph capturing the core narrative and business value.
4. **Key Discussions**: DETAILED list. For each point, include 2-3 sentences of context. Quote heavily.
5. **Decisions Made**: Precise decisions.
6. **Action Items**: Detailed tasks. Use strict timestamps if inferable.
7. **Term Validation** (CRITICAL):
   - Identify ALL acronyms, technical parameters, and BI-specific jargon (e.g., "PAU", "MAU", "Churn", "Cohort").
   - Define them based on context.
   - If a term is ambiguous or used loosely, mark status as "Needs Review". If standard/clear, "Verified".

**Output Format**:
Return ONLY valid JSON:
{
  "meetingTitle": "string",
  "date": "Month DD, YYYY",
  "duration": "string",
  "attendees": ["string"],
  "summary": "string",
  "keyDiscussions": ["string"],
  "decisions": ["string"],
  "actionItems": [{ "id": "1", "task": "string", "assignee": "Name", "dueDate": "Date", "priority": "High|Medium|Low", "status": "Pending" }],
  "nextMeeting": "string",
  "termDefinitions": [
    { "term": "PII", "definition": "Personally Identifiable Information - Context: discussed regarding masking in export", "status": "Verified" },
    { "term": "PAU", "definition": "Unknown acronym used in context of user stats", "status": "Needs Review" }
  ]
}
`
        :
        `You are an expert meeting minutes assistant. Analyze the meeting transcript${input.visualContext ? ' and visual context from screen sharing' : ''} and generate comprehensive, structured meeting minutes.

**Meeting Transcript**:
${transcript}
${input.visualContext ? `\n**Visual Context from Screen Sharing/Slides**:\n${input.visualContext}\n` : ''}

**Your Task**:
Generate structured meeting minutes with the following information:

1. **Meeting Title**: Infer from the transcript or use "${input.meetingTitle || 'Team Meeting'}"
2. **Attendees**: List all participants mentioned (with roles if mentioned, e.g., "Sarah Chen (PM)")
3. **Summary**: 2-3 sentence overview of the meeting${input.visualContext ? ' (incorporate visual information if relevant)' : ''}
4. **Key Discussions**: Main topics discussed (bullet points)${input.visualContext ? ' - include information from slides/diagrams if shown' : ''}
5. **Decisions Made**: Clear decisions that were agreed upon
6. **Action Items**: Tasks with assignees, due dates, and priorities
   - Extract owner/assignee from transcript
   - Infer reasonable due dates (within next 1-2 weeks)
   - Assign priority based on urgency mentioned (High/Medium/Low)
   - Default status to "Pending" unless mentioned as in-progress
7. **Next Meeting**: If mentioned, include date/time

**Output Format**:
Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "meetingTitle": "string",
  "date": "Month DD, YYYY",
  "duration": "Xh XXmin",
  "attendees": ["Name (Role)", ...],
  "summary": "string",
  "keyDiscussions": ["string", ...],
  "decisions": ["string", ...],
  "actionItems": [
    {
      "id": "1",
      "task": "string",
      "assignee": "Name",
      "dueDate": "Mon DD, YYYY",
      "priority": "High|Medium|Low",
      "status": "Pending|In Progress|Completed"
    }
  ],
  "nextMeeting": "Day, Month DD, YYYY at HH:MM AM/PM - Topic" (optional)
}
`;

    const prompt = `${systemPrompt}

**Important**:
- Use today's date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
- Estimate duration based on transcript length (short: 30min, medium: 1h, long: 1h 30min+)
- Assign sequential IDs to action items ("1", "2", "3", ...)
- Be specific and actionable in action items
${input.visualContext ? '- Incorporate information from slides, diagrams, or screen shares when relevant\n' : ''}- Return ONLY the JSON object, no other text
`;

    const response = await model.invoke(prompt);

    try {
        const content = response.content.toString();

        // Remove markdown code blocks if present
        const cleanContent = content
            .replace(/```json\n ?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        const parsed = JSON.parse(cleanContent);

        console.log('✅ Generated MoM successfully');
        console.log(`📊 Found ${parsed.decisions?.length || 0} decisions`);
        console.log(`📋 Found ${parsed.actionItems?.length || 0} action items`);

        return parsed;
    } catch (e) {
        console.error('Error parsing MoM response:', e);
        console.error('Raw response:', response.content.toString().substring(0, 500));

        // Return fallback structure
        return {
            meetingTitle: input.meetingTitle || 'Team Meeting',
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            duration: '1h',
            attendees: ['Team Member'],
            summary: 'Meeting minutes could not be fully generated. Please try again.',
            keyDiscussions: [],
            decisions: [],
            actionItems: [],
            termDefinitions: [],
        };
    }
}

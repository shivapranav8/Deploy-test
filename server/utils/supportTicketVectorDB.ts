import * as fs from 'fs/promises';
import * as path from 'path';

interface SupportResponse {
    topic_title: string;
    topic_url: string;
    reply_text: string;
    timestamp: string;
    reply_id: string | null;
    chunk_index: number;
    total_chunks: number;
    embedding: number[];
    embedding_model: string;
    embedding_dim: number;
}

interface SimilarResponse {
    response: SupportResponse;
    similarity: number;
}

let embedder: any = null;
let combinedResponses: SupportResponse[] = [];

// Initialize the embedding model (lazy dynamic import to avoid Vercel bundle issues)
async function getEmbedder() {
    if (!embedder) {
        const { pipeline } = await import('@xenova/transformers');
        embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return embedder;
}

// Generate embedding for a query
export async function generateEmbedding(text: string): Promise<number[]> {
    const model = await getEmbedder();
    const output = await model(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
}

// Calculate cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Load combined embeddings from JSON file (Anitha + Naresh responses)
export async function loadCombinedEmbeddings(): Promise<void> {
    if (combinedResponses.length > 0) {
        console.log('📚 Combined embeddings already loaded:', combinedResponses.length, 'responses');
        return;
    }

    try {
        const embeddingsPath = path.join(process.cwd(), 'combined_embeddings.json');
        const data = await fs.readFile(embeddingsPath, 'utf-8');
        combinedResponses = JSON.parse(data);
        console.log('✅ Loaded combined embeddings:', combinedResponses.length, 'community responses (Anitha + Naresh)');
    } catch (error) {
        console.error('❌ Error loading combined embeddings:', error);
        throw error;
    }
}

// Expand query with support-related terminology
export function expandQueryWithSupportTerms(query: string): string {
    const expansions: Record<string, string[]> = {
        'dashboard': ['report', 'widget', 'visualization', 'chart'],
        'workspace': ['project', 'folder', 'organization'],
        'sync': ['refresh', 'update', 'real-time', 'live connect'],
        'export': ['download', 'save', 'extract'],
        'import': ['upload', 'load', 'bring data'],
        'permission': ['access', 'sharing', 'role', 'privileges'],
        'api': ['integration', 'connector', 'webhook'],
        'schedule': ['automation', 'recurring', 'periodic'],
        'error': ['issue', 'problem', 'bug', 'not working'],
        'slow': ['performance', 'loading', 'lag', 'timeout'],
    };

    let expandedQuery = query;
    const lowerQuery = query.toLowerCase();

    for (const [term, synonyms] of Object.entries(expansions)) {
        if (lowerQuery.includes(term)) {
            expandedQuery += ' ' + synonyms.join(' ');
        }
    }

    return expandedQuery;
}

// Find similar support responses
export async function findSimilarResponses(
    query: string,
    topK: number = 5
): Promise<SimilarResponse[]> {
    // Ensure embeddings are loaded
    if (combinedResponses.length === 0) {
        await loadCombinedEmbeddings();
    }

    // Expand query with support terminology
    const expandedQuery = expandQueryWithSupportTerms(query);
    console.log('🔍 Original Query:', query);
    console.log('🔍 Expanded Query:', expandedQuery);

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(expandedQuery);

    // Calculate similarities
    const similarities: SimilarResponse[] = combinedResponses.map(response => ({
        response,
        similarity: cosineSimilarity(queryEmbedding, response.embedding)
    }));

    // Sort by similarity (descending) and take top K
    similarities.sort((a, b) => b.similarity - a.similarity);
    const topResults = similarities.slice(0, topK);

    console.log(`📚 Found ${topResults.length} similar responses:`);
    topResults.forEach((result, idx) => {
        console.log(`   ${idx + 1}. Topic: "${result.response.topic_title || 'Untitled'}" (similarity: ${(result.similarity * 100).toFixed(1)}%)`);
    });

    return topResults;
}

// Extract clean text from Charanya's reply (remove HTML/formatting)
export function extractCleanReply(replyText: string): string {
    // Remove common footers
    let clean = replyText
        .replace(/Regards,[\s\S]*?Zoho Cares[\s\S]*?$/i, '')
        .replace(/Register for[\s\S]*?$/i, '')
        .replace(/www\.zoho\.com\/analytics[\s\S]*?$/i, '')
        .replace(/Blogs Forums Help$/i, '');

    // Remove timestamps and "Answered by" headers
    clean = clean
        .replace(/\d+\s+(years?|months?|weeks?|days?|hours?)\s+ago/gi, '')
        .replace(/Answered by[\s\S]*?\n/gi, '');

    // Trim whitespace
    clean = clean.trim();

    return clean;
}

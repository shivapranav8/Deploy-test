import { pipeline } from '@xenova/transformers';
import mammoth from 'mammoth';
import XLSX from 'xlsx';
import fs from 'fs/promises';
import path from 'path';

// Simple file-based storage (no server needed)
const STORAGE_PATH = path.join(process.cwd(), 'data', 'prd_vectors.json');

interface PRDVector {
    id: string;
    content: string;
    embedding: number[];
    metadata: any;
}

// Initialize embedding model (runs locally)
let embedder: any = null;

async function getEmbedder() {
    if (!embedder) {
        console.log('📥 Downloading embedding model (first time only, ~90MB)...');
        embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        console.log('✅ Model loaded!');
    }
    return embedder;
}

// Generate embeddings locally
export async function generateEmbedding(text: string): Promise<number[]> {
    const model = await getEmbedder();
    const output = await model(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
}

// Load existing vectors from file
async function loadVectors(): Promise<PRDVector[]> {
    try {
        const data = await fs.readFile(STORAGE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Save vectors to file
async function saveVectors(vectors: PRDVector[]) {
    await fs.mkdir(path.dirname(STORAGE_PATH), { recursive: true });
    await fs.writeFile(STORAGE_PATH, JSON.stringify(vectors, null, 2));
}

// Cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

// Store PRD example
export async function storePRDExample(prdId: string, content: string, metadata: any = {}) {
    const vectors = await loadVectors();

    // Check if already exists
    const existingIndex = vectors.findIndex(v => v.id === prdId);

    const embedding = await generateEmbedding(content);
    const newVector: PRDVector = {
        id: prdId,
        content,
        embedding,
        metadata
    };

    if (existingIndex >= 0) {
        vectors[existingIndex] = newVector;
    } else {
        vectors.push(newVector);
    }

    await saveVectors(vectors);
}

// Find similar PRDs
export async function findSimilarPRDs(query: string, topK: number = 3) {
    try {
        const vectors = await loadVectors();

        if (vectors.length === 0) {
            console.warn('No PRD examples found yet');
            return [];
        }

        const queryEmbedding = await generateEmbedding(query);

        // Calculate similarities
        const results = vectors.map(vector => ({
            content: vector.content,
            metadata: vector.metadata,
            distance: 1 - cosineSimilarity(queryEmbedding, vector.embedding) // Convert similarity to distance
        }));

        // Sort by distance (ascending) and take top K
        results.sort((a, b) => a.distance - b.distance);
        return results.slice(0, topK);
    } catch (error) {
        console.warn('Error finding similar PRDs:', error);
        return [];
    }
}

// Extract text from .docx files
async function extractFromDocx(filePath: string): Promise<string> {
    const buffer = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
}

// Extract text from .xlsx files
async function extractFromXlsx(filePath: string): Promise<string> {
    const workbook = XLSX.readFile(filePath);
    let text = '';

    workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        text += `\n=== ${sheetName} ===\n`;
        text += sheetData.map((row: any) => row.join(' | ')).join('\n');
    });

    return text;
}

// Bulk import PRDs from directory
export async function importPRDsFromDirectory(dirPath: string) {
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    async function processDirectory(currentPath: string) {
        try {
            const entries = await fs.readdir(currentPath, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(currentPath, entry.name);

                if (entry.isDirectory()) {
                    // Recursively process subdirectories
                    await processDirectory(fullPath);
                } else if (entry.isFile()) {
                    let content = '';
                    const ext = path.extname(entry.name).toLowerCase();

                    try {
                        // Extract text based on file type
                        if (ext === '.txt' || ext === '.md') {
                            content = await fs.readFile(fullPath, 'utf-8');
                        } else if (ext === '.docx') {
                            content = await extractFromDocx(fullPath);
                        } else if (ext === '.xlsx') {
                            content = await extractFromXlsx(fullPath);
                        } else {
                            continue; // Skip unsupported file types
                        }

                        if (content.trim().length === 0) {
                            console.log(`⚠️  Skipped empty file: ${entry.name}`);
                            skippedCount++;
                            continue;
                        }

                        const prdId = path.relative(dirPath, fullPath).replace(/\.(txt|md|docx|xlsx)$/, '');

                        await storePRDExample(prdId, content, {
                            filename: entry.name,
                            filepath: fullPath,
                            filetype: ext,
                            imported_at: new Date().toISOString()
                        });

                        importedCount++;
                        console.log(`✅ Imported (${importedCount}): ${prdId}`);
                    } catch (error) {
                        errorCount++;
                        console.error(`❌ Error processing ${entry.name}:`, error.message);
                    }
                }
            }
        } catch (error) {
            console.error(`Error reading directory ${currentPath}:`, error);
        }
    }

    await processDirectory(dirPath);
    console.log(`\n📊 Import Summary:`);
    console.log(`   ✅ Imported: ${importedCount}`);
    console.log(`   ⚠️  Skipped: ${skippedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`\n✅ Import complete! Data saved to: ${STORAGE_PATH}`);
}

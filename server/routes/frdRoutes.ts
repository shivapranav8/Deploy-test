import { Router } from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import * as fs from 'fs';
import { runFRDReview } from '../agents/frdReviewer';

export const frdRouter = Router();

const upload = multer({
    dest: '/tmp/frd-uploads/',
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
});

/**
 * Extract readable text from various file formats.
 */
function extractFileContent(filePath: string, originalName: string): string {
    const ext = originalName.split('.').pop()?.toLowerCase() || '';

    if (ext === 'xlsx' || ext === 'xls') {
        const workbook = XLSX.readFile(filePath);
        const lines: string[] = [];
        for (const sheetName of workbook.SheetNames) {
            lines.push(`\n=== Sheet: ${sheetName} ===\n`);
            const sheet = workbook.Sheets[sheetName];
            const csv = XLSX.utils.sheet_to_csv(sheet);
            lines.push(csv);
        }
        return lines.join('\n');
    }

    if (ext === 'csv' || ext === 'md' || ext === 'txt') {
        return fs.readFileSync(filePath, 'utf-8');
    }

    throw new Error(`Unsupported file type: .${ext}. Please upload .xlsx, .xls, .csv, .md, or .txt`);
}

/**
 * POST /api/frd/review
 * Accepts a file upload, extracts its content, runs it through the Claude FRD Reviewer agent.
 */
frdRouter.post('/review', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded. Include a file field named "file".' });
    }

    const { originalname, path: filePath } = req.file;
    console.log(`📄 [FRD] Received file: ${originalname} (${req.file.size} bytes)`);

    try {
        const content = extractFileContent(filePath, originalname);
        console.log(`📄 [FRD] Extracted ${content.length} characters from ${originalname}`);

        const auditData = await runFRDReview(content, originalname);

        res.json(auditData);
    } catch (error) {
        console.error('❌ [FRD] Review failed:', error);
        res.status(500).json({
            error: 'FRD review failed',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    } finally {
        // Clean up temp file
        fs.unlink(filePath, () => {});
    }
});

import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';
import { UseCaseOutput } from '../agents/useCaseAgent';

const TEMPLATE_PATH = path.resolve(process.cwd(), 'PRD Template.xlsx');

// Column indices for the Use Cases sheet
const COL_SNO = 0;
const COL_USECASE = 1;
const COL_DESCRIPTION = 2;
const COL_PM_NOTES = 3;
const COL_DEV_NOTES = 4;
const COL_QA_NOTES = 5;
const COL_DEV_TESTING_STATUS = 6;

// Preamble row indices (rows 1-4 in 0-indexed)
const PREAMBLE_START_ROW = 1;

// Use case rows start after the second header row (row 5 = header, row 6+ = data)
const USECASE_DATA_START_ROW = 6;

function setCellValue(ws: XLSX.WorkSheet, row: number, col: number, value: string) {
    const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
    ws[cellRef] = { t: 's', v: value };
}

export function fillUseCasesSheet(data: UseCaseOutput): Buffer {
    if (!fs.existsSync(TEMPLATE_PATH)) {
        throw new Error(`PRD Template not found at: ${TEMPLATE_PATH}`);
    }

    const wb = XLSX.readFile(TEMPLATE_PATH);
    const ws = wb.Sheets['Use Cases'];

    if (!ws) {
        throw new Error('Could not find "Use Cases" sheet in the template');
    }

    // ── Preamble section (rows 1–4, columns 0–5) ─────────────────────────────
    // Row 0 already has headers: [SNo, Preamble, Description, PM Notes, Developer Notes, QA Notes]
    // We fill rows 1–4 with preamble content

    const preambleRows = [
        { sno: '1', preamble: 'What is it?', content: data.preamble.whatItIs },
        { sno: '2', preamble: 'Triggered From', content: data.preamble.triggeredFrom },
        { sno: '3', preamble: 'Who can trigger?', content: data.preamble.whoCanTrigger },
        { sno: '4', preamble: 'Success Metrics', content: data.preamble.successMetrics },
    ];

    preambleRows.forEach(({ sno, preamble, content }, i) => {
        const row = PREAMBLE_START_ROW + i;
        setCellValue(ws, row, COL_SNO, sno);
        setCellValue(ws, row, COL_USECASE, preamble);
        setCellValue(ws, row, COL_DESCRIPTION, content);
    });

    // ── Use Cases section (row 5 = header, row 6+ = data) ────────────────────
    // Row 5 headers are already in the template: [S.No, Use Case, Description, PM Notes, Developer Notes, QA Notes, Developer Testing Status]

    data.useCases.forEach((uc, i) => {
        const row = USECASE_DATA_START_ROW + i;
        setCellValue(ws, row, COL_SNO, uc.sNo);
        setCellValue(ws, row, COL_USECASE, uc.useCase);
        setCellValue(ws, row, COL_DESCRIPTION, uc.description);
        setCellValue(ws, row, COL_PM_NOTES, uc.pmNotes);
        setCellValue(ws, row, COL_DEV_NOTES, uc.developerNotes);
        setCellValue(ws, row, COL_QA_NOTES, uc.qaNotes);
        setCellValue(ws, row, COL_DEV_TESTING_STATUS, '');
    });

    // Update the sheet's reference range so Excel knows about the new rows
    const lastRow = USECASE_DATA_START_ROW + data.useCases.length - 1;
    ws['!ref'] = XLSX.utils.encode_range({ r: 0, c: 0 }, { r: lastRow, c: COL_DEV_TESTING_STATUS });

    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

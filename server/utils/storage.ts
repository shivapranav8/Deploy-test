import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MeetingMoMOutput } from '../agents/meetingMoM';

const DATA_DIR = path.join(process.cwd(), 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'mom_history.json');

// Best-effort init — may fail on read-only filesystems (e.g. Vercel)
try {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(HISTORY_FILE)) {
        fs.writeFileSync(HISTORY_FILE, JSON.stringify([]));
    }
} catch (_) {
    // Filesystem unavailable — history will not persist
}

export interface StoredMoM extends MeetingMoMOutput {
    id: string;
    createdAt: string;
    transcript?: string;
}

/**
 * Save a new MoM to history
 */
export async function saveMoM(momData: MeetingMoMOutput, transcript?: string): Promise<StoredMoM> {
    const newRecord: StoredMoM = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        ...momData,
        ...(transcript ? { transcript } : {}),
    };

    try {
        const history = await getMoMHistory();
        history.unshift(newRecord);
        await fs.promises.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
        console.log(`💾 Saved MoM to history. ID: ${newRecord.id}`);
    } catch (error) {
        console.warn('⚠️ Failed to save MoM history (filesystem unavailable):', error);
    }

    return newRecord;
}

/**
 * Get full MoM history
 */
export async function getMoMHistory(): Promise<StoredMoM[]> {
    try {
        if (!fs.existsSync(HISTORY_FILE)) {
            return [];
        }

        const data = await fs.promises.readFile(HISTORY_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('❌ Failed to read MoM history:', error);
        return [];
    }
}

/**
 * Get single MoM by ID
 */
export async function getMoMById(id: string): Promise<StoredMoM | undefined> {
    const history = await getMoMHistory();
    return history.find(m => m.id === id);
}

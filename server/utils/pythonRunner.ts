import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export interface AnalysisProgress {
    timestamp: string;
    message: string;
    type: 'log' | 'error' | 'success';
}

export const runPythonAnalysis = (
    topic: string,
    competitors: any[],
    onProgress: (progress: AnalysisProgress) => void
): Promise<any> => {
    return new Promise((resolve, reject) => {
        const pythonDir = path.join(process.cwd(), 'competitor-analysis-agent');
        const pythonPath = path.join(pythonDir, 'venv', 'bin', 'python3');

        // We'll create a temporary trigger script to run the graph with specific inputs
        const triggerScriptPath = path.join(pythonDir, 'run_bridge.py');
        const triggerScriptContent = `
import sys
import json
from graph import run_pipeline

def progress_callback(msg):
    # Emit progress in a format we can parse
    print(f"PROGRESS:{msg}", flush=True)

if __name__ == "__main__":
    topic = sys.argv[1]
    competitors = json.loads(sys.argv[2])
    
    try:
        state = run_pipeline(topic, competitors, progress_callback=progress_callback)
        if state.report:
            print("RESULT:" + json.dumps(state.report.model_dump()))
        else:
            print("ERROR:Report generation failed")
    except Exception as e:
        print(f"ERROR:{str(e)}")
`;

        fs.writeFileSync(triggerScriptPath, triggerScriptContent);

        const child = spawn(pythonPath, [
            'run_bridge.py',
            topic,
            JSON.stringify(competitors)
        ], {
            cwd: pythonDir,
            env: { ...process.env, PYTHONPATH: pythonDir }
        });

        let result: any = null;

        child.stdout.on('data', (data) => {
            const lines = data.toString().split('\n');
            for (const line of lines) {
                if (line.startsWith('PROGRESS:')) {
                    onProgress({
                        timestamp: new Date().toISOString(),
                        message: line.replace('PROGRESS:', ''),
                        type: 'log'
                    });
                } else if (line.startsWith('RESULT:')) {
                    try {
                        result = JSON.parse(line.replace('RESULT:', ''));
                    } catch (e) {
                        console.error('Failed to parse result JSON', e);
                    }
                }
            }
        });

        child.stderr.on('data', (data) => {
            onProgress({
                timestamp: new Date().toISOString(),
                message: data.toString(),
                type: 'error'
            });
        });

        child.on('close', (code) => {
            if (code === 0 && result) {
                resolve(result);
            } else {
                reject(new Error(`Python process exited with code ${code}`));
            }
            // Cleanup
            if (fs.existsSync(triggerScriptPath)) {
                fs.unlinkSync(triggerScriptPath);
            }
        });
    });
};

export const askPythonQuestion = (
    topic: string,
    question: string
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const pythonDir = path.join(process.cwd(), 'competitor-analysis-agent');
        const pythonPath = path.join(pythonDir, 'venv', 'bin', 'python3');

        const triggerScriptPath = path.join(pythonDir, 'ask_bridge.py');
        const triggerScriptContent = `
import sys
import json
from agents.qa_agent import qa_agent_node
from agents.state import GraphState

if __name__ == "__main__":
    topic = sys.argv[1]
    question = sys.argv[2]
    
    # We need a dummy state to trigger the QA agent
    # In a real app, we might want to persist the FAISS index
    # For now, the QA agent will rebuild the index from the local report files
    state = GraphState(topic=topic)
    try:
        updated_state = qa_agent_node(state, question=question)
        print("ANSWER:" + updated_state.qa_answer)
    except Exception as e:
        print(f"ERROR:{str(e)}")
`;

        fs.writeFileSync(triggerScriptPath, triggerScriptContent);

        const child = spawn(pythonPath, [
            'ask_bridge.py',
            topic,
            question
        ], {
            cwd: pythonDir,
            env: { ...process.env, PYTHONPATH: pythonDir }
        });

        let answer = '';

        child.stdout.on('data', (data) => {
            const lines = data.toString().split('\n');
            for (const line of lines) {
                if (line.startsWith('ANSWER:')) {
                    answer = line.replace('ANSWER:', '');
                }
            }
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve(answer);
            } else {
                reject(new Error(`Python question process exited with code ${code}`));
            }
            if (fs.existsSync(triggerScriptPath)) {
                fs.unlinkSync(triggerScriptPath);
            }
        });
    });
};

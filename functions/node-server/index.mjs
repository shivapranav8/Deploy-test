// Catalyst Advanced I/O entry point
// Starts the Express server using tsx (TypeScript runner)
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, '../../');

const proc = spawn(
  path.join(serverRoot, 'node_modules/.bin/tsx'),
  [path.join(serverRoot, 'server/index.ts')],
  {
    cwd: serverRoot,
    env: { ...process.env, NODE_ENV: 'production' },
    stdio: 'inherit',
  }
);

proc.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

proc.on('exit', (code) => {
  process.exit(code ?? 1);
});

// Catalyst Advanced I/O entry point
// Runs the pre-built server bundle (dist/server/index.cjs)
// NODE_PATH is set so CJS require() finds packages from this function's node_modules
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, '../../');

const proc = spawn(
  process.execPath,
  [path.join(serverRoot, 'dist/server/index.cjs')],
  {
    cwd: serverRoot,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      // CJS require() respects NODE_PATH — lets the bundle find its deps
      // in the function's own node_modules (the only ones Catalyst installs)
      NODE_PATH: path.join(__dirname, 'node_modules'),
    },
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

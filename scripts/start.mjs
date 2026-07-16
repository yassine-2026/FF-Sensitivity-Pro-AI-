import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';

const candidates = [
  'dist/server.cjs',
  'dist/server.js',
  'dist/index.js',
  'server.cjs',
  'server.js'
];

let target = null;
for (const file of candidates) {
  if (fs.existsSync(path.resolve(file))) {
    target = file;
    break;
  }
}

if (!target) {
  console.error('Error: Server executable not found. Did you run the build step?');
  process.exit(1);
}

console.log(`Starting production server using ${target}...`);
const child = spawn('node', [target], { 
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production' }
});

child.on('close', (code) => {
  process.exit(code);
});

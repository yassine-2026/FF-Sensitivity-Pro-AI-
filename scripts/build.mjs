import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Starting production build...');

try {
  // 1. Build frontend
  console.log('Building frontend (Vite)...');
  execSync('npx vite build', { stdio: 'inherit' });

  // 2. Build backend
  console.log('Building backend (esbuild)...');
  execSync('npx esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs', { stdio: 'inherit' });

  // 3. Validation
  console.log('Validating build output...');
  const required = ['dist/index.html', 'dist/server.cjs'];
  for (const file of required) {
    if (!fs.existsSync(path.resolve(file))) {
      throw new Error(`Validation failed: ${file} was not created.`);
    }
  }
  console.log('Build completed successfully.');
} catch (err) {
  console.error('Build process failed:', err);
  process.exit(1);
}

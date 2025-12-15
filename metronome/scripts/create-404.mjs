import { copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = resolve(fileURLToPath(new URL('..', import.meta.url)), 'dist');
const source = resolve(distDir, 'index.html');
const destination = resolve(distDir, '404.html');

async function main() {
  try {
    await copyFile(source, destination);
    console.log(`Copied ${source} to ${destination} for SPA fallback.`);
  } catch (error) {
    console.error('Failed to create 404.html fallback:', error);
    process.exitCode = 1;
  }
}

main();

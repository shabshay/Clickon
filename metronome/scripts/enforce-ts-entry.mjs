import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(projectRoot, 'src');

const checks = [
  { base: 'main', disallowedExtensions: ['.js'] },
  { base: 'types', disallowedExtensions: ['.js', '.d.ts'] }
];

const errors = [];

for (const { base, disallowedExtensions } of checks) {
  const tsPath = path.join(srcDir, `${base}.ts`);
  if (!fs.existsSync(tsPath)) {
    continue;
  }

  for (const ext of disallowedExtensions) {
    const candidate = path.join(srcDir, `${base}${ext}`);
    if (fs.existsSync(candidate)) {
      errors.push(`Found duplicate entry file: ${path.relative(projectRoot, candidate)} (authoritative source is src/${base}.ts)`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('TypeScript entry files are authoritative; no duplicate JS/definition files detected.');
}

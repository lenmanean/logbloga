/**
 * Audit Package Content
 *
 * For each package slug, compares allowlist (getAllowedFilenamesForPackage)
 * to flat files in the package content directory. Reports missing and extra files.
 * Exit code 1 if any allowlisted file is missing; 0 otherwise.
 *
 * Usage: npx tsx scripts/audit-package-content.ts
 */

import { readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import { getAllowedFilenamesForPackage } from '../lib/data/package-level-content';

const ROOT = process.cwd();
const PACKAGES = ['web-apps', 'social-media', 'agency', 'freelancing'] as const;

function getFlatFilesInDir(dirPath: string): Set<string> {
  if (!existsSync(dirPath)) return new Set();
  const files = new Set<string>();
  const entries = readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile()) {
      files.add(entry.name);
    }
  }
  return files;
}

function main() {
  console.log('Auditing package content (allowlist vs content dir)...\n');
  let hasMissing = false;

  for (const slug of PACKAGES) {
    const contentDir = join(ROOT, `${slug}-content`);
    const allowed = getAllowedFilenamesForPackage(slug);
    const onDisk = getFlatFilesInDir(contentDir);

    const missing: string[] = [];
    allowed.forEach((file) => {
      if (!onDisk.has(file)) missing.push(file);
    });

    const extra: string[] = [];
    onDisk.forEach((file) => {
      if (allowed.has(file)) return;
      if (file === 'README.md' || file.endsWith('-content.md') || file.endsWith('-spec.md')) return;
      extra.push(file);
    });

    console.log(`## ${slug} (${allowed.size} allowlisted, ${onDisk.size} flat files in dir)`);
    if (missing.length > 0) {
      hasMissing = true;
      console.log('  MISSING (in allowlist, not in dir):');
      missing.forEach((f) => console.log(`    - ${f}`));
    } else {
      console.log('  OK (all allowlisted files present in dir)');
    }
    if (extra.length > 0) {
      const trulyExtra = extra.filter((f) => !f.endsWith('-content.md') && !f.endsWith('-spec.md') && f !== 'README.md');
      if (trulyExtra.length > 0) {
        console.log('  EXTRA (in dir, not in allowlist; excluding *-content.md, *-spec.md, README):');
        trulyExtra.forEach((f) => console.log(`    + ${f}`));
      }
    }
    console.log('');
  }

  if (hasMissing) {
    console.log('FAIL: One or more allowlisted files are missing. Run build scripts and re-audit.');
    process.exit(1);
  }
  console.log('PASS: All allowlisted files are present.');
}

main();

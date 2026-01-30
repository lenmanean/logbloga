/**
 * Build Agency Package ZIPs
 *
 * Zips each template/source directory under agency-content/ and writes
 * <name>.zip to agency-content/ so the upload script can push them.
 * Run before upload to refresh ZIPs from source directories.
 *
 * Usage: npx tsx scripts/build-agency-zips.ts
 */

import { createWriteStream, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import archiver from 'archiver';

const ROOT = process.cwd();
const AGENCY_CONTENT = join(ROOT, 'agency-content');

const ZIP_DIRS = [
  'client-onboarding-template',
  'agency-operations-templates',
  'enterprise-templates',
];

function addDirToArchive(archive: archiver.Archiver, dirPath: string, archiveName: string) {
  const entries = readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    const entryName = `${archiveName}/${entry.name}`;
    if (entry.isDirectory()) {
      addDirToArchive(archive, fullPath, entryName);
    } else {
      archive.file(fullPath, { name: entryName });
    }
  }
}

async function zipDirectory(sourceDir: string, outPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(outPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve());
    archive.on('error', (err) => reject(err));

    archive.pipe(output);

    const dirName = sourceDir.split(/[/\\]/).pop() ?? '';
    addDirToArchive(archive, sourceDir, dirName);

    archive.finalize();
  });
}

async function main() {
  console.log('Building Agency ZIPs...\n');

  for (const name of ZIP_DIRS) {
    const sourceDir = join(AGENCY_CONTENT, name);
    const outPath = join(AGENCY_CONTENT, `${name}.zip`);

    if (!existsSync(sourceDir)) {
      console.error(`Missing source dir: agency-content/${name}`);
      process.exit(1);
    }

    if (!statSync(sourceDir).isDirectory()) {
      console.error(`Not a directory: agency-content/${name}`);
      process.exit(1);
    }

    try {
      await zipDirectory(sourceDir, outPath);
      console.log(`  ${name}.zip`);
    } catch (err) {
      console.error(`  ${name}.zip FAILED:`, err);
      process.exit(1);
    }
  }

  console.log('\nDone.');
}

main();

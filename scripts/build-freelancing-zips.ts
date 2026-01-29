/**
 * Build Freelancing Package ZIPs
 *
 * Zips each template/source directory under freelancing-content/ and writes
 * <name>.zip to freelancing-content/ so the upload script can push them.
 * Run before upload to refresh ZIPs from source directories.
 *
 * Usage: npx tsx scripts/build-freelancing-zips.ts
 */

import { createWriteStream, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import archiver from 'archiver';

const FREELANCING_CONTENT = join(process.cwd(), 'freelancing-content');

const ZIP_DIRS = [
  'proposal-templates',
  'contract-templates',
  'business-systems-templates',
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
  console.log('Building Freelancing ZIPs...\n');

  for (const name of ZIP_DIRS) {
    const sourceDir = join(FREELANCING_CONTENT, name);
    const outPath = join(FREELANCING_CONTENT, `${name}.zip`);

    if (!existsSync(sourceDir)) {
      console.warn(`Skipping ${name}: source dir not found`);
      continue;
    }

    if (!statSync(sourceDir).isDirectory()) {
      console.warn(`Skipping ${name}: not a directory`);
      continue;
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

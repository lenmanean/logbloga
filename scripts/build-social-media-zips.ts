/**
 * Build Social Media Package ZIPs
 *
 * Zips the team-management-templates source directory under social-media-content/
 * and writes team-management-templates.zip so the upload script can push it.
 * Run before upload to refresh the ZIP from source.
 *
 * Usage: npx tsx scripts/build-social-media-zips.ts
 */

import { createWriteStream, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import archiver from 'archiver';

const ROOT = process.cwd();
const SOCIAL_MEDIA_CONTENT = join(ROOT, 'social-media-content');

const ZIP_DIRS = ['team-management-templates'];

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
  console.log('Building Social Media ZIPs...\n');

  for (const name of ZIP_DIRS) {
    const sourceDir = join(SOCIAL_MEDIA_CONTENT, name);
    const outPath = join(SOCIAL_MEDIA_CONTENT, `${name}.zip`);

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

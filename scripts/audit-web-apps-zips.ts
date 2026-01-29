/**
 * Web Apps ZIP Audit — Inventory Script
 *
 * Reads package-level-content for the Web Apps package, collects the 4 ZIP
 * template entries, and lists files in each corresponding source directory
 * under web-apps-content/. Outputs a machine-readable (JSON) inventory for
 * use in the ZIP audit.
 *
 * Run: npx tsx scripts/audit-web-apps-zips.ts
 */

import { readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import { packageLevelContent } from '../lib/data/package-level-content';

const WEB_APPS_CONTENT = join(process.cwd(), 'web-apps-content');

interface ZipEntry {
  filename: string;
  level: 1 | 2 | 3;
  name: string;
  description: string;
  section: string;
}

function getWebAppsZipEntries(): ZipEntry[] {
  const pkg = packageLevelContent['web-apps'];
  if (!pkg) return [];

  const entries: ZipEntry[] = [];
  const levels = [
    { key: 1 as const, level: pkg.level1 },
    { key: 2 as const, level: pkg.level2 },
    { key: 3 as const, level: pkg.level3 },
  ];

  for (const { key, level } of levels) {
    for (const t of level.templates ?? []) {
      if (t.type === 'zip' && t.file.endsWith('.zip')) {
        entries.push({
          filename: t.file,
          level: key,
          name: t.name ?? t.file,
          description: t.description ?? '',
          section: 'templates',
        });
      }
    }
  }

  return entries;
}

function listDirRecursive(dir: string, base = ''): string[] {
  const results: string[] = [];
  if (!existsSync(dir)) return results;

  const items = readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const rel = base ? `${base}/${item.name}` : item.name;
    if (item.isDirectory()) {
      results.push(rel + '/');
      results.push(...listDirRecursive(join(dir, item.name), rel));
    } else {
      results.push(rel);
    }
  }
  return results.sort();
}

interface InventoryItem {
  filename: string;
  level: number;
  name: string;
  description: string;
  section: string;
  sourceDir: string;
  sourceDirExists: boolean;
  paths: string[];
  hasReadme: boolean;
  hasPackageJson: boolean;
  keyFiles: Record<string, boolean>;
}

function keyFilesForZip(entry: ZipEntry): Record<string, boolean> {
  const base: Record<string, boolean> = {};
  if (entry.filename === 'basic-starter-template.zip') {
    base['README'] = false;
    base['package.json'] = false;
    base['.env.example'] = false;
    base['app/api/create-payment-intent/route.ts'] = false;
    base['components/CheckoutForm.tsx'] = false;
    base['app/payment/page.tsx'] = false;
  } else if (entry.filename === 'saas-starter-template.zip') {
    base['README'] = false;
    base['package.json'] = false;
    base['.env.example'] = false;
    base['Supabase auth/config'] = false;
    base['Stripe subscription route or config'] = false;
  } else if (entry.filename === 'advanced-saas-template.zip') {
    base['README'] = false;
    base['package.json'] = false;
    base['AI integration'] = false;
    base['Multi-tenant pattern'] = false;
  } else if (entry.filename === 'ai-integration-examples.zip') {
    base['README'] = false;
    base['OpenAI example'] = false;
    base['Anthropic example'] = false;
    base['Prompts/code patterns'] = false;
  }
  return base;
}

function main(): void {
  const entries = getWebAppsZipEntries();
  const output: InventoryItem[] = [];

  for (const entry of entries) {
    const sourceDirName = entry.filename.replace(/\.zip$/, '');
    const sourceDir = join(WEB_APPS_CONTENT, sourceDirName);
    const sourceDirExists = existsSync(sourceDir);
    const paths = sourceDirExists ? listDirRecursive(sourceDir) : [];
    const pathSet = new Set(paths);

    const hasReadme =
      pathSet.has('README.md') ||
      paths.some((p) => p.toLowerCase() === 'readme.md' || p.toLowerCase().endsWith('/readme.md'));
    const hasPackageJson =
      pathSet.has('package.json') || paths.some((p) => p.toLowerCase().endsWith('package.json'));

    const keyFiles = keyFilesForZip(entry);
    if ('README' in keyFiles) keyFiles['README'] = hasReadme;
    if ('package.json' in keyFiles) keyFiles['package.json'] = hasPackageJson;
    if ('.env.example' in keyFiles)
      keyFiles['.env.example'] = paths.some((p) => p.includes('.env.example'));
    if ('app/api/create-payment-intent/route.ts' in keyFiles)
      keyFiles['app/api/create-payment-intent/route.ts'] = pathSet.has('app/api/create-payment-intent/route.ts');
    if ('components/CheckoutForm.tsx' in keyFiles)
      keyFiles['components/CheckoutForm.tsx'] = pathSet.has('components/CheckoutForm.tsx');
    if ('app/payment/page.tsx' in keyFiles)
      keyFiles['app/payment/page.tsx'] = pathSet.has('app/payment/page.tsx');
    if ('OpenAI example' in keyFiles)
      keyFiles['OpenAI example'] = paths.some((p) => /openai|basic-service/i.test(p));
    if ('Anthropic example' in keyFiles)
      keyFiles['Anthropic example'] = paths.some((p) => /anthropic|basic-service/i.test(p));
    if ('Prompts/code patterns' in keyFiles)
      keyFiles['Prompts/code patterns'] = paths.some((p) => /prompt|\.ts|\.tsx/i.test(p));

    output.push({
      filename: entry.filename,
      level: entry.level,
      name: entry.name,
      description: entry.description,
      section: entry.section,
      sourceDir: sourceDirName,
      sourceDirExists,
      paths,
      hasReadme,
      hasPackageJson,
      keyFiles,
    });
  }

  const out = process.argv.includes('--json') ? JSON.stringify(output, null, 2) : toMarkdown(output);
  console.log(out);
}

function toMarkdown(items: InventoryItem[]): string {
  const lines: string[] = [
    '# Web Apps ZIP Inventory',
    '',
    'Generated by `npx tsx scripts/audit-web-apps-zips.ts`',
    '',
  ];

  for (const item of items) {
    lines.push(`## ${item.name} (Level ${item.level})`);
    lines.push('');
    lines.push(`- **ZIP:** \`${item.filename}\``);
    lines.push(`- **Description:** ${item.description}`);
    lines.push(`- **Source dir:** \`web-apps-content/${item.sourceDir}\` (exists: ${item.sourceDirExists})`);
    lines.push(`- **README:** ${item.hasReadme ? 'yes' : 'no'}`);
    lines.push(`- **package.json:** ${item.hasPackageJson ? 'yes' : 'no'}`);
    lines.push('');
    lines.push('### Paths');
    lines.push('');
    if (item.paths.length === 0) {
      lines.push('*(none)*');
    } else {
      for (const p of item.paths) {
        lines.push(`- ${p}`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

main();

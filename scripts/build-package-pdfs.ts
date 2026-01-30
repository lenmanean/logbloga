/**
 * Build Package PDFs from *-content.md
 *
 * Reads each *-content.md, strips spec preamble (Content Specification title,
 * authoring paragraphs, Level context, authoring-only Notes), runs markdownToPDF(),
 * and writes the corresponding allowlist PDF filename into the package content folder.
 * Output PDFs contain user-facing content only. No placeholders.
 * Run before upload for Social Media, Agency, and Freelancing packages.
 *
 * Usage: npx tsx scripts/build-package-pdfs.ts
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { markdownToPDF } from '../lib/utils/markdown-to-pdf';
import { stripContentSpecPreamble } from '../lib/utils/strip-content-spec-preamble';

const ROOT = process.cwd();

const MAPPINGS: { contentDir: string; pairs: [string, string][] }[] = [
  {
    contentDir: 'social-media-content',
    pairs: [
      ['social-media-level-1-monetization-budget-worksheet-content.md', 'social-media-level-1-monetization-budget-worksheet.pdf'],
      ['daily-posting-checklist-content.md', 'daily-posting-checklist.pdf'],
      ['social-media-level-2-smm-budget-planner-content.md', 'social-media-level-2-smm-budget-planner.pdf'],
      ['social-media-level-3-agency-budget-planning-content.md', 'social-media-level-3-agency-budget-planning.pdf'],
      ['client-onboarding-checklist-content.md', 'client-onboarding-checklist.pdf'],
    ],
  },
  {
    contentDir: 'agency-content',
    pairs: [
      ['agency-level-1-solo-budget-worksheet-content.md', 'agency-level-1-solo-budget-worksheet.pdf'],
      ['agency-level-2-team-budget-planner-content.md', 'agency-level-2-team-budget-planner.pdf'],
      ['agency-level-3-enterprise-budget-planning-content.md', 'agency-level-3-enterprise-budget-planning.pdf'],
    ],
  },
  {
    contentDir: 'freelancing-content',
    pairs: [
      ['freelancing-level-1-side-hustle-budget-planner-content.md', 'freelancing-level-1-side-hustle-budget-planner.pdf'],
      ['freelancing-level-1-pricing-calculator-worksheet-content.md', 'freelancing-level-1-pricing-calculator-worksheet.pdf'],
      ['freelancing-level-2-full-time-budget-planner-content.md', 'freelancing-level-2-full-time-budget-planner.pdf'],
      ['freelancing-level-3-business-financial-planning-content.md', 'freelancing-level-3-business-financial-planning.pdf'],
    ],
  },
];

async function main() {
  console.log('Building package PDFs from *-content.md...\n');
  let failed = false;

  for (const { contentDir, pairs } of MAPPINGS) {
    const dirPath = join(ROOT, contentDir);
    if (!existsSync(dirPath)) {
      console.error(`Content dir not found: ${contentDir}`);
      failed = true;
      continue;
    }

    for (const [contentFile, pdfFile] of pairs) {
      const contentPath = join(dirPath, contentFile);
      const pdfPath = join(dirPath, pdfFile);

      if (!existsSync(contentPath)) {
        console.error(`  Missing input: ${contentDir}/${contentFile}`);
        failed = true;
        continue;
      }

      try {
        let md = readFileSync(contentPath, 'utf-8');
        md = stripContentSpecPreamble(md);
        // pdf-lib WinAnsi cannot encode U+2212 (minus); normalize to ASCII hyphen
        md = md.replace(/\u2212/g, '-');
        const buffer = await markdownToPDF(md);
        writeFileSync(pdfPath, buffer);
        console.log(`  ${contentDir}/${pdfFile}`);
      } catch (err) {
        console.error(`  FAILED ${contentDir}/${pdfFile}:`, err);
        failed = true;
      }
    }
  }

  if (failed) {
    process.exit(1);
  }
  console.log('\nDone.');
}

main();

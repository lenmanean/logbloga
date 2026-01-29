/**
 * Create minimal valid PDF placeholders for Freelancing package planning worksheets.
 * Run from repo root. Outputs to freelancing-content/*.pdf
 *
 * Usage: npx tsx scripts/create-freelancing-pdf-placeholders.ts
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const FREELANCING_CONTENT = join(process.cwd(), 'freelancing-content');

// Minimal valid PDF (single empty page) — ASCII-safe
const MINIMAL_PDF = `%PDF-1.0
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj
xref
0 4
0000000000 65535 f 
0000000009 00000 n 
0000000052 00000 n 
0000000101 00000 n 
trailer<</Size 4/Root 1 0 R>>
startxref
178
%%EOF
`;

const PDF_FILES = [
  'freelancing-level-1-side-hustle-budget-planner.pdf',
  'freelancing-level-1-pricing-calculator-worksheet.pdf',
  'freelancing-level-2-full-time-budget-planner.pdf',
  'freelancing-level-3-business-financial-planning.pdf',
];

function main() {
  if (!existsSync(FREELANCING_CONTENT)) {
    mkdirSync(FREELANCING_CONTENT, { recursive: true });
  }

  console.log('Creating Freelancing PDF placeholders...\n');

  for (const name of PDF_FILES) {
    const outPath = join(FREELANCING_CONTENT, name);
    writeFileSync(outPath, MINIMAL_PDF, 'utf8');
    console.log(`  ${name}`);
  }

  console.log('\nDone. Replace with final PDFs when ready.');
}

main();

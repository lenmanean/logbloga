/**
 * Build Social Media XLSX templates from specs.
 *
 * Creates content-strategy-template.xlsx and content-calendar-template.xlsx
 * with headers and example rows per spec. No placeholders.
 *
 * Usage: npx tsx scripts/build-social-media-xlsx.ts
 */

import ExcelJS from 'exceljs';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const SOCIAL_MEDIA_CONTENT = join(ROOT, 'social-media-content');

async function buildContentStrategyTemplate(): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Content Strategy', { views: [{ state: 'frozen', ySplit: 1 }] });
  // Columns per content-strategy-template-spec.md: Date, Platform, Content type, Pillar, Copy idea, Link, Status
  sheet.columns = [
    { header: 'Date', key: 'date', width: 12 },
    { header: 'Platform', key: 'platform', width: 14 },
    { header: 'Content type', key: 'contentType', width: 14 },
    { header: 'Pillar', key: 'pillar', width: 20 },
    { header: 'Copy idea', key: 'copyIdea', width: 32 },
    { header: 'Link', key: 'link', width: 12 },
    { header: 'Status', key: 'status', width: 12 },
  ];
  sheet.addRow({
    date: '2025-02-15',
    platform: 'Instagram',
    contentType: 'Reel',
    pillar: 'Productivity tips',
    copyIdea: '3 time-blocking mistakes',
    link: '—',
    status: 'Draft',
  });
  const outPath = join(SOCIAL_MEDIA_CONTENT, 'content-strategy-template.xlsx');
  await workbook.xlsx.writeFile(outPath);
  console.log('  social-media-content/content-strategy-template.xlsx');
}

async function buildContentCalendarTemplate(): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Content Calendar', { views: [{ state: 'frozen', ySplit: 1 }] });
  // Columns per content-calendar-template-spec.md: Client, Date, Platform, Content type, Copy, Status
  sheet.columns = [
    { header: 'Client', key: 'client', width: 14 },
    { header: 'Date', key: 'date', width: 12 },
    { header: 'Platform', key: 'platform', width: 14 },
    { header: 'Content type', key: 'contentType', width: 14 },
    { header: 'Copy', key: 'copy', width: 28 },
    { header: 'Status', key: 'status', width: 12 },
  ];
  sheet.addRow({
    client: 'Acme Co',
    date: '2025-02-15',
    platform: 'Instagram',
    contentType: 'Reel',
    copy: '3 productivity tips',
    status: 'Scheduled',
  });
  const outPath = join(SOCIAL_MEDIA_CONTENT, 'content-calendar-template.xlsx');
  await workbook.xlsx.writeFile(outPath);
  console.log('  social-media-content/content-calendar-template.xlsx');
}

async function main() {
  console.log('Building Social Media XLSX templates...\n');
  if (!existsSync(SOCIAL_MEDIA_CONTENT)) {
    console.error('social-media-content/ not found');
    process.exit(1);
  }
  try {
    await buildContentStrategyTemplate();
    await buildContentCalendarTemplate();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('\nDone.');
}

main();

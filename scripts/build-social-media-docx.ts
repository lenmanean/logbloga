/**
 * Build Social Media DOCX template from spec.
 *
 * Creates client-reporting-template.docx with Section 1–4 (Summary, Metrics,
 * Top Posts, Recommendations) per client-reporting-template-spec.md. No placeholders.
 *
 * Usage: npx tsx scripts/build-social-media-docx.ts
 */

import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from 'docx';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const SOCIAL_MEDIA_CONTENT = join(ROOT, 'social-media-content');

function buildClientReportingDoc(): Document {
  const children: (Paragraph | Table)[] = [
    new Paragraph({
      text: 'Section 1: Summary',
      heading: HeadingLevel.HEADING_2,
    }),
    new Paragraph({
      text:
        'One short paragraph (2–4 sentences) summarizing the reporting period. Include: time period, main wins (e.g. reach up, engagement up), one highlight (e.g. top post or campaign). Tone: professional, outcome-focused. Avoid jargon unless the client uses it.',
    }),
    new Paragraph({ text: '' }),
    new Paragraph({
      text: 'Section 2: Metrics',
      heading: HeadingLevel.HEADING_2,
    }),
    new Paragraph({
      text:
        'Key numbers in a simple table or bullet list. Suggested: reach, impressions, engagement rate, followers (net change), clicks (if tracked), other KPIs agreed in onboarding. Compare period-over-period (e.g. vs. last month) where possible. Pull from Metricool or native platform exports; cite data source in a footnote if needed.',
    }),
    new Paragraph({ text: '' }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph('Metric')], width: { size: 25, type: WidthType.PERCENTAGE } }),
            new TableCell({ children: [new Paragraph('This period')], width: { size: 25, type: WidthType.PERCENTAGE } }),
            new TableCell({ children: [new Paragraph('Last period')], width: { size: 25, type: WidthType.PERCENTAGE } }),
            new TableCell({ children: [new Paragraph('Notes')], width: { size: 25, type: WidthType.PERCENTAGE } }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph('Reach')] }),
            new TableCell({ children: [new Paragraph({ text: '' })] }),
            new TableCell({ children: [new Paragraph({ text: '' })] }),
            new TableCell({ children: [new Paragraph({ text: '' })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph('Impressions')] }),
            new TableCell({ children: [new Paragraph({ text: '' })] }),
            new TableCell({ children: [new Paragraph({ text: '' })] }),
            new TableCell({ children: [new Paragraph({ text: '' })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph('Engagement rate')] }),
            new TableCell({ children: [new Paragraph({ text: '' })] }),
            new TableCell({ children: [new Paragraph({ text: '' })] }),
            new TableCell({ children: [new Paragraph({ text: '' })] }),
          ],
        }),
      ],
    }),
    new Paragraph({ text: '' }),
    new Paragraph({
      text: 'Section 3: Top Posts',
      heading: HeadingLevel.HEADING_2,
    }),
    new Paragraph({
      text:
        'Showcase 3–5 top-performing posts from the period. Include: platform, date, content type, brief description or caption snippet, and 1–2 metrics (e.g. reach, likes, comments). Purpose: demonstrate what\'s working and inform future content.',
    }),
    new Paragraph({ text: '' }),
    new Paragraph({
      text: 'Section 4: Recommendations',
      heading: HeadingLevel.HEADING_2,
    }),
    new Paragraph({
      text:
        '2–4 actionable next steps. Include: what to do next (e.g. double down on reels, test a new format, adjust posting times), and why (tied to metrics or goals). Optional: link to Content Calendar Template or next month\'s focus.',
    }),
  ];

  return new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });
}

async function main() {
  console.log('Building Social Media DOCX template...\n');
  if (!existsSync(SOCIAL_MEDIA_CONTENT)) {
    console.error('social-media-content/ not found');
    process.exit(1);
  }
  try {
    const doc = buildClientReportingDoc();
    const buffer = await Packer.toBuffer(doc);
    const outPath = join(SOCIAL_MEDIA_CONTENT, 'client-reporting-template.docx');
    writeFileSync(outPath, buffer);
    console.log('  social-media-content/client-reporting-template.docx');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('\nDone.');
}

main();

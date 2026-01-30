/**
 * Strip Content Specification preamble and authoring-only Notes from *-content.md
 * so the result is user-facing only for PDF generation.
 *
 * Removes:
 * - First H1 (e.g. "# Daily Posting Checklist — Content Specification")
 * - Paragraph "This file is the **content specification**..."
 * - "**Level X context:**" line
 * - Final "## Notes" block if it contains authoring phrases (README, actual PDF, spec is for authoring)
 *
 * Inserts a clean user-facing H1 derived from the original title.
 */
export function stripContentSpecPreamble(raw: string): string {
  let md = raw.trim();
  if (!md) return '';

  // 1. Extract user-facing title from first H1 (remove " — Content Specification" etc.)
  const firstH1Match = md.match(/^#\s+(.+)$/m);
  let userFacingTitle = 'Document';
  if (firstH1Match) {
    userFacingTitle = firstH1Match[1]
      .replace(/\s*[—–-]\s*Content Specification\s*$/i, '')
      .trim();
  }

  // 2. Remove first H1 line
  md = md.replace(/^#\s+.+$/m, '').trim();

  // 3. Remove the paragraph "This file is the **content specification**..." and "**Level X context:**" line
  md = md.replace(
    /\n*\s*This file is the \*\*content specification\*\*[^\n]*\n+\s*\*\*Level \d+ context:\*\*[^\n]*\n*/,
    ''
  );
  // Fallback: remove spec paragraph alone if Level line absent
  md = md.replace(/\n*\s*This file is the \*\*content specification\*\*[^\n]*\n*/g, '');
  // Remove any remaining **Level X context:** line
  md = md.replace(/\n*\s*\*\*Level \d+ context:\*\*[^\n]*\n*/g, '');
  md = md.trim();

  // 4. Remove leading --- and extra blank lines before body
  md = md.replace(/^\s*---\s*\n+/, '').trim();

  // 6. Remove final ## Notes block if it contains authoring phrases
  const notesBlockMatch = md.match(/\n\n## Notes\n([\s\S]*)$/);
  if (notesBlockMatch) {
    const notesContent = notesBlockMatch[1];
    if (
      /README\.md|actual (PDF|XLSX|DOCX|ZIP)|spec is for authoring|Document in \[README/i.test(
        notesContent
      )
    ) {
      md = md.replace(/\n\n## Notes\n[\s\S]*$/, '').trim();
    }
  }

  // 7. Prepend user-facing H1
  return `# ${userFacingTitle}\n\n---\n\n${md}`.trim();
}

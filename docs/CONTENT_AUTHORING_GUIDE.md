# Content Authoring Guide for Packages

## Expanded Document View

Hosted markdown can be opened in an **expanded view** (overlay with table of contents and search). Use clear headings in MD so the TOC and search work well; cross-references and “see Templates section” remain as today.

## Cross-References Between Files

### Current Implementation

When referencing other files in markdown content, use this pattern:

```markdown
For ready-to-use prompts, download the [AI Prompts file](web-apps-level-1-ai-prompts.md)
from the Templates section below.
```

**How it works:** The markdown-viewer component (`components/library/markdown-viewer.tsx`) detects relative markdown links and scrolls to the appropriate section (templates, planning).

### Best Practices

1. Always mention where to find the file: "from the Templates section"
2. Use descriptive link text: "AI Prompts file" not just "here"
3. Provide alternative instruction: "or scroll to Templates section below"

### Example Patterns

**Good:**

```markdown
Download the [Web Apps Level 1 AI Prompts file](web-apps-level-1-ai-prompts.md)
from the Templates section below for copy-paste ready prompts.
```

**Better:**

```markdown
See the Templates section below to download the AI Prompts file with
copy-paste ready prompts for each implementation step.
```

## File Naming Conventions

- Implementation plans: `{package}-level-{n}-plan.md`
- Platform guides: `{platform}-{feature}-setup-guide.md`
- Package-specific: `{package}-level-{n}-{content-type}.md`
- AI prompts: `{package}-level-{n}-ai-prompts.md`

## Content Specification Files

Two types of spec files serve as authoring sources (not uploaded; not in allowlist):

- **\*-content.md** (PDF specs): Describe the structure and copy of planning PDFs (budget worksheets, checklists). Run `npx tsx scripts/build-package-pdfs.ts` to generate user-facing PDFs. The build strips the spec preamble (Content Specification title, authoring paragraphs, Level context, authoring-only Notes) so delivered PDFs contain only real content.
- **\*-spec.md** (template specs): Describe XLSX, DOCX, or ZIP structure. Build scripts (e.g. `build-social-media-xlsx.ts`, `build-agency-zips.ts`) produce the binaries from structure defined in code; specs document the intended layout.

Always maintain package, level, and section context in spec files. See package READMEs (social-media-content, agency-content, freelancing-content) for per-package spec lists.

## Templates (ZIP)

For Web Apps, ZIPs are built from source dirs under `web-apps-content/<name>/`. Run `npm run content:build-zips` before upload. Each template dir should include README and `.env.example`; see [WEB_APPS_ZIP_AUDIT.md](WEB_APPS_ZIP_AUDIT.md) and [TERMINOLOGY_STYLE_GUIDE.md](TERMINOLOGY_STYLE_GUIDE.md) for structure and terminology.

Freelancing (and other packages) may have their own template ZIPs and source dirs; structure and README conventions follow the same principles as Web Apps. See [PACKAGE_CONTENT_INFRASTRUCTURE.md](PACKAGE_CONTENT_INFRASTRUCTURE.md) Section 7.7 for the Freelancing upload workflow.

## Terminology

Use the terms defined in [TERMINOLOGY_STYLE_GUIDE.md](TERMINOLOGY_STYLE_GUIDE.md) for consistency across all package content.

# Content Authoring Guide for Packages

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

## Terminology

Use the terms defined in [TERMINOLOGY_STYLE_GUIDE.md](TERMINOLOGY_STYLE_GUIDE.md) for consistency across all package content.

# Social Media Package Content

This folder contains all **39 files** for the Social Media package (Level 1, 2, and 3). Files are uploaded to Supabase Storage under `digital-products/{productId}/` via the script `scripts/upload-social-media-files.ts`. See [PACKAGE_CONTENT_INFRASTRUCTURE.md](../docs/PACKAGE_CONTENT_INFRASTRUCTURE.md) Section 4 for the Social Media package and upload workflow.

## Level 1 Files (14 files) — Personal Brand / Content Creator

- **Implementation plan:** `social-media-level-1-plan.md`
- **Platform setup:** `buffer-setup-guide.md`, `canva-setup-guide.md`, `google-analytics-setup-guide.md`
- **Creative frameworks:** `niche-selection-worksheet.md`, `brand-identity-framework.md`, `content-direction-framework.md`
- **Templates:** `content-strategy-template.xlsx`, `daily-posting-checklist.pdf`
- **Launch & marketing:** `social-media-level-1-first-monetization-guide.md`, `social-media-level-1-content-growth-checklist.md`
- **Troubleshooting:** `social-media-level-1-common-creator-issues.md`
- **Planning:** `social-media-level-1-creator-income-planning.md`, `social-media-level-1-monetization-budget-worksheet.pdf`

## Level 2 Files (14 files) — Social Media Management Service

- **Implementation plan:** `social-media-level-2-plan.md`
- **Platform setup:** `later-setup-guide.md`, `metricool-setup-guide.md`, `buffer-paid-setup-guide.md`
- **Creative frameworks:** `client-onboarding-framework.md`, `service-pricing-framework.md`
- **Templates:** `content-calendar-template.xlsx`, `client-reporting-template.docx`, `client-onboarding-checklist.pdf`
- **Launch & marketing:** `social-media-level-2-first-smm-clients-guide.md`, `social-media-level-2-service-portfolio-checklist.md`
- **Troubleshooting:** `social-media-level-2-client-service-issues.md`
- **Planning:** `social-media-level-2-service-pricing-strategy.md`, `social-media-level-2-smm-budget-planner.pdf`

## Level 3 Files (11 files) — Full-Service Social Media Agency

- **Implementation plan:** `social-media-level-3-plan.md`
- **Platform setup:** `hootsuite-setup-guide.md`, `advanced-analytics-setup.md`
- **Creative frameworks:** `agency-operations-framework.md`, `service-suite-development.md`
- **Templates:** `team-management-templates.zip`
- **Launch & marketing:** `social-media-level-3-agency-positioning-guide.md`, `social-media-level-3-partnership-outreach-strategies.md`
- **Troubleshooting:** `social-media-level-3-agency-operations-issues.md`
- **Planning:** `social-media-level-3-agency-revenue-strategy.md`, `social-media-level-3-agency-budget-planning.pdf`

## PDF Content Specifications

The three planning PDFs are **downloadable**. Their **content structure and wording** are specified in markdown so the PDFs can be regenerated or updated consistently:

- **Level 1 — Monetization Budget Worksheet:** Content spec in `social-media-level-1-monetization-budget-worksheet-content.md`. Sections: (1) Revenue goal ($300–$1,000 band), (2) Platform costs ($0–30 L1 range), (3) Income tracking table, (4) Expense categories, (5) Net and notes. Use terminology from `docs/TERMINOLOGY_STYLE_GUIDE.md`.
- **Level 2 — SMM Budget Planner:** Content spec in `social-media-level-2-smm-budget-planner-content.md`. Sections: (1) Revenue goal ($1k–$3k band), (2) Platform costs ($30–100 L2 range), (3) Income/expense tracking, (4) Net. Use terminology from `docs/TERMINOLOGY_STYLE_GUIDE.md`.
- **Level 3 — Agency Budget Planning:** Content spec in `social-media-level-3-agency-budget-planning-content.md`. Sections: (1) Revenue target ($3k–$10k+ band), (2) Platform costs ($100–300 L3 range), (3) P&L-style summary, (4) Cash flow, (5) Team and contractors. Use terminology from `docs/TERMINOLOGY_STYLE_GUIDE.md`.

To **regenerate or update** the PDFs, use the corresponding `*-content.md` file as the source for layout and copy.

## Template Specs (non-PDF)

- **Content Strategy Template (XLSX):** Spec in `content-strategy-template-spec.md` (pillars, dates, platforms, copy, links). Document structure in README.
- **Daily Posting Checklist (PDF):** Spec in `daily-posting-checklist-content.md` (morning check, content batch, scheduling, engagement, end-of-day).
- **Content Calendar Template (XLSX):** Spec in `content-calendar-template-spec.md` (client, date, platform, content type, copy, status).
- **Client Reporting Template (DOCX):** Spec in `client-reporting-template-spec.md` (summary, metrics, top posts, recommendations).
- **Client Onboarding Checklist (PDF):** Spec in `client-onboarding-checklist-content.md` (access, brand, calendar, first report date).
- **Team Management Templates (ZIP):** Level 3; document in README. Optional source folder `team-management-templates/` if building ZIP from repo.

## Build PDFs and Upload

Run `npx tsx scripts/build-package-pdfs.ts` to regenerate PDFs from *-content.md before upload. Run `npx tsx scripts/upload-social-media-files.ts` to upload all 39 files to storage. Ensure XLSX, DOCX, PDF, and ZIP binaries exist in this folder (generate via build scripts or add real files) before upload.

## Terminology and Cross-References

- Use [TERMINOLOGY_STYLE_GUIDE.md](../docs/TERMINOLOGY_STYLE_GUIDE.md) for consistent terms (Level 1/2/3, package, platform costs, expected revenue, time investment, AI leverage).
- Use relative markdown links and "See the X section" / "from the Templates section" per [CONTENT_AUTHORING_GUIDE.md](../docs/CONTENT_AUTHORING_GUIDE.md).

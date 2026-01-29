# Freelancing Package Content

This folder contains all **41 files** for the Freelancing package (Level 1, 2, and 3). Files are uploaded to Supabase Storage under `digital-products/{productId}/` via the script `scripts/upload-freelancing-files.ts`. See [PACKAGE_CONTENT_INFRASTRUCTURE.md](../docs/PACKAGE_CONTENT_INFRASTRUCTURE.md) Section 7.7 for the upload workflow.

## Level 1 Files (14 files)

- **Implementation plan:** `freelancing-level-1-plan.md`
- **Platform setup:** `fiverr-profile-setup-guide.md`, `hello-bonsai-setup-guide.md`, `paypal-setup-guide.md`
- **Creative frameworks:** `service-definition-framework.md`, `portfolio-creation-framework.md`, `pricing-strategy-worksheet.md`
- **Templates:** `gig-listing-template.md`, `portfolio-showcase-template.md`
- **Launch & marketing:** `freelancing-level-1-first-client-acquisition-guide.md`, `freelancing-level-1-profile-optimization-checklist.md`
- **Troubleshooting:** `freelancing-level-1-common-freelancing-issues.md`
- **Planning (PDFs):** `freelancing-level-1-side-hustle-budget-planner.pdf`, `freelancing-level-1-pricing-calculator-worksheet.pdf`

## PDF Content Specifications (Level 1)

The two Level 1 planning PDFs are **downloadable** files. Their **content structure and wording** are specified in markdown so the PDFs can be regenerated or updated consistently:

- **Side Hustle Budget Planner:** Content spec in `freelancing-level-1-side-hustle-budget-planner-content.md`. Sections: (1) Monthly revenue goal ($500–$1,500 band, checkboxes), (2) Platform costs ($0–20 L1 range), (3) Income tracking table, (4) Expense categories, (5) Net and notes. Use terminology from `docs/TERMINOLOGY_STYLE_GUIDE.md` (e.g. "platform costs," "expected revenue").
- **Pricing Calculator Worksheet:** Content spec in `freelancing-level-1-pricing-calculator-worksheet-content.md`. Sections: (1) Cost inputs, (2) Minimum price calculation, (3) Market check, (4) Package builder (Basic/Standard/Premium), (5) Add-ons and notes. Align with the markdown [pricing-strategy-worksheet.md](pricing-strategy-worksheet.md).

To **regenerate or update the PDFs:** use the content in the `*-content.md` files above as the source for layout and copy. The repo does not include scripted PDF generation by default; a human or custom script can produce the PDFs from these specs.

## PDF Content Specifications (Level 2)

The Level 2 planning PDF is **downloadable**. Its **content structure and wording** are specified in markdown:

- **Full-Time Budget Planner:** Content spec in `freelancing-level-2-full-time-budget-planner-content.md`. Sections: (1) Monthly revenue goal ($1,500–$4,000 band, checkboxes), (2) Platform costs ($20–50 L2 range), (3) Income tracking table, (4) Expense categories, (5) Net and notes. Use terminology from `docs/TERMINOLOGY_STYLE_GUIDE.md`.

## PDF Content Specifications (Level 3)

The Level 3 planning PDF is **downloadable**. Its **content structure and wording** are specified in markdown:

- **Business Financial Planning:** Content spec in `freelancing-level-3-business-financial-planning-content.md`. Sections: (1) Revenue target ($4k–$10k+ band), (2) Platform costs ($50–150 L3 range), (3) P&L-style summary, (4) Cash flow, (5) Tax and retirement. Use terminology from `docs/TERMINOLOGY_STYLE_GUIDE.md`.

To **regenerate or update** Level 2 or Level 3 PDFs, use the corresponding `*-content.md` file as the source for layout and copy.

## ZIP Sources (Level 2 and Level 3)

Level 2 and Level 3 template ZIPs are built from source directories in this folder:

- `proposal-templates/` → `proposal-templates.zip`
- `contract-templates/` → `contract-templates.zip`
- `business-systems-templates/` → `business-systems-templates.zip`

Run `npx tsx scripts/build-freelancing-zips.ts` to build the ZIPs, then `npx tsx scripts/upload-freelancing-files.ts` to upload all 41 files to storage.

## Terminology and Cross-References

- Use [TERMINOLOGY_STYLE_GUIDE.md](../docs/TERMINOLOGY_STYLE_GUIDE.md) for consistent terms (Level 1, package, platform costs, expected revenue, time investment, AI leverage).
- Use relative markdown links and "See the X section" / "from the Templates section" per [CONTENT_AUTHORING_GUIDE.md](../docs/CONTENT_AUTHORING_GUIDE.md).

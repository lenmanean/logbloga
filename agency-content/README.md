# Agency Package Content

This folder contains all **40 files** for the Agency package (Level 1, 2, and 3). Files are uploaded to Supabase Storage under `digital-products/{productId}/` via the script `scripts/upload-agency-files.ts`. See [PACKAGE_CONTENT_INFRASTRUCTURE.md](../docs/PACKAGE_CONTENT_INFRASTRUCTURE.md) Section 5 for the Agency package and upload workflow.

## Option A vs Option B (Level 1 and Level 2)

**Level 1:** Users choose one path. **Option A (All-in-One):** Systeme.io — single platform for CRM, funnels, email, calendar, contracts. **Option B (Best-of-Breed):** HubSpot free + ClickUp free + Hello Bonsai — separate tools for CRM, tasks, and contracts. All four platform guide files are included; follow one path.

**Level 2:** Users choose one path. **Option A (recommended):** GoHighLevel — all-in-one for CRM, pipelines, automation, calendar, campaigns. **Option B:** HubSpot paid + ClickUp paid + Zite — best-of-breed stack. All four platform guides are included.

**Level 3:** Single path — GoHighLevel enterprise and enterprise platform stack.

## Level 1 Files (14 files) — Solo Agency / Freelance+

- **Implementation plan:** `agency-level-1-plan.md`
- **Platform setup (Option A):** `systeme-io-setup-guide.md`
- **Platform setup (Option B):** `hubspot-free-setup.md`, `clickup-free-setup.md`, `hello-bonsai-setup.md`
- **Creative frameworks:** `agency-niche-framework.md`, `service-package-framework.md`, `target-client-framework.md`
- **Templates:** `client-onboarding-template.zip`
- **Launch & marketing:** `agency-level-1-first-clients-guide.md`, `agency-level-1-solo-launch-checklist.md`
- **Troubleshooting:** `agency-level-1-solo-operations-issues.md`
- **Planning:** `agency-level-1-solo-revenue-strategy.md`, `agency-level-1-solo-budget-worksheet.pdf`

## Level 2 Files (14 files) — Small Team Agency

- **Implementation plan:** `agency-level-2-plan.md`
- **Platform setup (Option A):** `gohighlevel-setup-guide.md`
- **Platform setup (Option B):** `hubspot-paid-setup.md`, `clickup-paid-setup.md`, `zite-setup-guide.md`
- **Creative frameworks:** `team-management-framework.md`, `service-suite-development.md`, `client-retention-strategies.md`
- **Templates:** `agency-operations-templates.zip`
- **Launch & marketing:** `agency-level-2-client-acquisition-scaling-guide.md`, `agency-level-2-team-portfolio-checklist.md`
- **Troubleshooting:** `agency-level-2-team-client-issues.md`
- **Planning:** `agency-level-2-team-pricing-revenue-strategy.md`, `agency-level-2-team-budget-planner.pdf`

## Level 3 Files (12 files) — Established Multi-Service Agency

- **Implementation plan:** `agency-level-3-plan.md`
- **Platform setup:** `gohighlevel-enterprise-setup.md`, `enterprise-platform-setup.md`
- **Creative frameworks:** `enterprise-operations-framework.md`, `team-scaling-guide.md`, `enterprise-service-development.md`
- **Templates:** `enterprise-templates.zip`
- **Launch & marketing:** `agency-level-3-enterprise-outreach-guide.md`, `agency-level-3-partnership-strategies.md`
- **Troubleshooting:** `agency-level-3-enterprise-operations-issues.md`
- **Planning:** `agency-level-3-scaling-revenue-strategy.md`, `agency-level-3-enterprise-budget-planning.pdf`

## PDF Content Specifications

The three planning PDFs are **downloadable**. Their **content structure and wording** are specified in markdown so the PDFs can be regenerated or updated consistently:

- **Level 1 — Solo Agency Budget Worksheet:** Content spec in `agency-level-1-solo-budget-worksheet-content.md`. Sections: (1) Revenue goal ($2,000–$5,000 band), (2) Platform costs ($100–300 L1 range), (3) Income tracking table, (4) Expense categories (tools, marketing, contract help), (5) Net and notes. Use terminology from `docs/TERMINOLOGY_STYLE_GUIDE.md`.
- **Level 2 — Team Budget Planner:** Content spec in `agency-level-2-team-budget-planner-content.md`. Sections: (1) Revenue goal ($5k–$15k band), (2) Platform costs ($300–800 L2 range), (3) Income/expense tracking, (4) Team and contractor costs, (5) Net. Use terminology from `docs/TERMINOLOGY_STYLE_GUIDE.md`.
- **Level 3 — Enterprise Budget Planning:** Content spec in `agency-level-3-enterprise-budget-planning-content.md`. Sections: (1) Revenue target ($15k–$50k+ band), (2) Platform costs ($800–2,000 L3 range), (3) P&L-style summary, (4) Cash flow, (5) Team and contractor costs, (6) Reserve and growth. Use terminology from `docs/TERMINOLOGY_STYLE_GUIDE.md`.

To **regenerate or update** the PDFs, run `npx tsx scripts/build-package-pdfs.ts` (reads *-content.md and writes the corresponding PDF into this folder). Use the corresponding `*-content.md` file as the source for layout and copy.

## Template / ZIP Content Specifications

- **Client Onboarding Template (ZIP):** Spec in `client-onboarding-template-spec.md`. Intended contents: welcome email template, discovery questionnaire, kickoff agenda, checklist; file list and purpose; alignment with Target Client Framework and First Agency Clients Guide. Optional source folder `client-onboarding-template/` if building ZIP from repo.
- **Agency Operations Templates (ZIP):** Spec in `agency-operations-templates-spec.md`. Intended contents: project kickoff template, status report template, client review agenda, handoff checklist; alignment with Team Management Framework and Service Suite Development. Optional source folder `agency-operations-templates/`.
- **Enterprise Templates (ZIP):** Spec in `enterprise-templates-spec.md`. Intended contents: enterprise proposal template, multi-service SOW, partnership agreement outline, board-style report; alignment with Enterprise Operations Framework and Enterprise Service Development. Optional source folder `enterprise-templates/`.

## Upload

Run `npx tsx scripts/upload-agency-files.ts` to upload all 40 files to storage. Ensure PDF and ZIP binaries exist in this folder (generate via `npx tsx scripts/build-package-pdfs.ts` and `npx tsx scripts/build-agency-zips.ts`, or add real files) before upload.

## Terminology and Cross-References

- Use [TERMINOLOGY_STYLE_GUIDE.md](../docs/TERMINOLOGY_STYLE_GUIDE.md) for consistent terms (Level 1/2/3, package, platform costs, expected revenue, time investment, AI leverage).
- Use relative markdown links and "See the X section" / "from the Templates section" per [CONTENT_AUTHORING_GUIDE.md](../docs/CONTENT_AUTHORING_GUIDE.md).

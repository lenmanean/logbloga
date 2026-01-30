# Package Content Audit and Review

**Date:** January 28, 2026  
**Scope:** 165 files across 4 packages (Web Apps, Social Media, Agency, Freelancing), 3 levels each, 7 sections per level.  
**Reference:** [Comprehensive Package Content Audit and Review Plan](.cursor/plans/package_content_audit_plan_4736cad2.plan.md)

---

## 1. Executive Summary

| Item | Result |
|------|--------|
| **Scope** | 165 files; 4 packages; 3 levels; 7 sections (Implementation Plan, Platform Guides, Creative Frameworks, Templates, Launch & Marketing, Troubleshooting, Time & Budget Planning). |
| **Infrastructure** | **Pass** — Allowlist (`getAllowedFilenamesForPackage`), content/download/pdf APIs, `lib/utils/content.ts`, and UI (hosted vs download, TOC, expanded view) behave as designed. |
| **Web Apps** | **Pass** — All 45 files present in `web-apps-content/`; extensions and flat filenames correct; ZIPs built and present. |
| **Social Media** | **Open** — All 33 MD files present; **9 binary files missing** (PDF, XLSX, DOCX, ZIP). Content/spec markdown exists for PDFs; binary artifacts not in repo. |
| **Agency** | **Open** — All 34 MD files present; **6 binary files missing** (3 PDF, 3 ZIP). Content specs and template specs exist; binaries not in repo. |
| **Freelancing** | **Pass** — All 41 files present (MD, PDF, ZIP). PDFs and ZIPs in repo; build script produces ZIPs. |
| **High-level result** | **Pass with open items:** Infrastructure and Web Apps/Freelancing content are complete. Social Media and Agency require binary files (PDF/XLSX/DOCX/ZIP) to be added or generated before upload so downloads do not 404. |

---

## 2. Infrastructure Findings

### 2.1 Allowlist and package-level-content.ts

- **Source:** `lib/data/package-level-content.ts`.
- **Function:** `getAllowedFilenamesForPackage(slug)` builds a `Set<string>` from all levels’ `implementationPlan`, `platformGuides`, `creativeFrameworks`, `templates`, `launchMarketing`, `troubleshooting`, `planning`.
- **File counts:** Web Apps 45, Social Media 39, Agency 40, Freelancing 41 — matches Section 8 of [PACKAGE_CONTENT_INFRASTRUCTURE.md](PACKAGE_CONTENT_INFRASTRUCTURE.md).
- **Extensions:** All entries use declared types (md, pdf, zip, xlsx, docx). No path separators; filenames are flat.
- **Finding:** Allowlist is consistent with the master list and drives content/download allowlist validation correctly.

### 2.2 Content and Download API Routes

| Route | Behavior | Status |
|------|----------|--------|
| **GET /api/library/[product-id]/content** | Validates `file` with `isValidFilename` (`.md`/`.markdown` only), product access, and `getAllowedFilenamesForPackage(slug)`. Fetches from Supabase Storage; returns 404 with message when file missing or download fails. No empty body for absent file. | OK |
| **GET /api/library/[product-id]/download** | Validates flat path (`isValidFilePath`), allowlist, auth, product access. Uses `getContentType(file)` from `lib/utils/content.ts`. Returns file buffer with correct `Content-Type` and `Content-Disposition`. 404 when storage fails. | OK |
| **GET /api/library/[product-id]/pdf** | Accepts markdown filenames only; allowlist checked. Fetches MD from storage, generates PDF via `markdownToPDF`, returns PDF with correct headers. 404/500 when content missing or conversion fails. | OK |

### 2.3 Upload Scripts and Storage Readiness

| Package | Script | Slug | Allowlist | Source Dir | MIME / Notes |
|---------|--------|------|-----------|------------|--------------|
| Web Apps | `scripts/upload-web-apps-files.ts` | `web-apps` | `getAllowedFilenamesForPackage('web-apps')` | `web-apps-content/` | md, zip supported. All 45 files present in repo. |
| Social Media | `scripts/upload-social-media-files.ts` | `social-media` | `getAllowedFilenamesForPackage('social-media')` | `social-media-content/` | md, pdf, zip, xlsx, docx. **Missing:** 4 PDFs, 2 XLSX, 1 DOCX, 1 ZIP (see §4). |
| Agency | `scripts/upload-agency-files.ts` | `agency` | `getAllowedFilenamesForPackage('agency')` | `agency-content/` | md, pdf, zip. **Missing:** 3 PDFs, 3 ZIPs (see §4). |
| Freelancing | `scripts/upload-freelancing-files.ts` | `freelancing` | `getAllowedFilenamesForPackage('freelancing')` | `freelancing-content/` | md, pdf, zip. All 41 files present; `scripts/build-freelancing-zips.ts` builds ZIPs from source dirs. |

### 2.4 UI: Hosted vs Download, Expanded View, TOC, Search

- **level-content.tsx:** For each section, hosted content uses `isHostedContent(type)` (true only for `md`/`markdown`). MD files get `MarkdownViewer` and Expand button; PDF/ZIP/XLSX/DOCX get `DownloadButton` only. Implementation Plan, Platform Guides, Creative Frameworks, Templates, Launch & Marketing, Troubleshooting, Planning all follow this.
- **markdown-viewer.tsx:** Renders headings (h1–h6) with stable IDs via `slugify`/`TocEntry`; passes heading entries to parent for TOC. Supports `content` prop and `onHeadingsParsed`.
- **expanded-document-view.tsx:** Fetches MD once from content API, builds TOC from headings, provides sidebar TOC and word-based search over heading text. No reliance on empty content beyond normal loading/error state.
- **lib/utils/content.ts:** `isHostedContent` is true only for md; `getContentType` returns correct MIME for md, pdf, zip, xlsx, docx, etc. All allowlisted extensions have a MIME (no unintended octet-stream for these).

---

## 3. Per-Package, Per-Level Summary

Status key: **OK** = file present and non-blank; **Missing** = not in content folder (or binary not built); **Spec only** = content/spec MD exists but binary not in repo.

### 3.1 Web Apps (45 files)

| Level | Section | File | Status |
|-------|---------|------|--------|
| 1 | Implementation Plan | web-apps-level-1-plan.md | OK |
| 1 | Platform Guides | nextjs-simple-setup-guide.md, vercel-deployment-guide.md, stripe-basic-setup.md, github-setup-guide.md | OK |
| 1 | Creative Frameworks | idea-generation-framework.md, value-proposition-worksheet.md, simple-mvp-framework.md | OK |
| 1 | Templates | basic-starter-template.zip, mvp-checklist.md, web-apps-level-1-ai-prompts.md | OK |
| 1 | Launch & Marketing | web-apps-level-1-launch-checklist.md, web-apps-level-1-basic-marketing-guide.md | OK |
| 1 | Troubleshooting | web-apps-level-1-common-issues-solutions.md | OK |
| 1 | Planning | web-apps-level-1-time-investment-planner.md, web-apps-level-1-budget-planning-worksheet.md | OK |
| 2 | All sections | (plan, 4 platform, 3 frameworks, saas-starter-template.zip, 2 templates, 1 launch, 1 troubleshoot, 2 planning) | OK |
| 3 | All sections | (plan, 4 platform, 2 frameworks, advanced-saas-template.zip, ai-integration-examples.zip, 1 template, 2 launch, 1 troubleshoot, 1 planning) | OK |

**Web Apps summary:** All 45 files present in `web-apps-content/`. No missing or blank files.

### 3.2 Social Media (39 files)

| Level | Section | File | Status |
|-------|---------|------|--------|
| 1–3 | All MD files | (plans, platform guides, frameworks, launch, troubleshooting, planning MDs) | OK (33 MD files) |
| 1 | Templates | content-strategy-template.xlsx, daily-posting-checklist.pdf | **Missing** (specs exist) |
| 1 | Planning | social-media-level-1-monetization-budget-worksheet.pdf | **Missing** (*-content.md exists) |
| 2 | Templates | content-calendar-template.xlsx, client-reporting-template.docx, client-onboarding-checklist.pdf | **Missing** (specs exist) |
| 2 | Planning | social-media-level-2-smm-budget-planner.pdf | **Missing** (*-content.md exists) |
| 3 | Templates | team-management-templates.zip | **Missing** (no built ZIP in repo) |
| 3 | Planning | social-media-level-3-agency-budget-planning.pdf | **Missing** (*-content.md exists) |

**Social Media summary:** 33 MD files OK. 9 binary files missing (4 PDF, 2 XLSX, 1 DOCX, 1 ZIP).

### 3.3 Agency (40 files)

| Level | Section | File | Status |
|-------|---------|------|--------|
| 1–3 | All MD files | (plans, platform guides, frameworks, launch, troubleshooting, planning MDs) | OK (34 MD files) |
| 1 | Templates | client-onboarding-template.zip | **Missing** (spec exists) |
| 1 | Planning | agency-level-1-solo-budget-worksheet.pdf | **Missing** (*-content.md exists) |
| 2 | Templates | agency-operations-templates.zip | **Missing** (spec exists) |
| 2 | Planning | agency-level-2-team-budget-planner.pdf | **Missing** (*-content.md exists) |
| 3 | Templates | enterprise-templates.zip | **Missing** (spec exists) |
| 3 | Planning | agency-level-3-enterprise-budget-planning.pdf | **Missing** (*-content.md exists) |

**Agency summary:** 34 MD files OK. 6 binary files missing (3 PDF, 3 ZIP).

### 3.4 Freelancing (41 files)

| Level | Section | File | Status |
|-------|---------|------|--------|
| 1–3 | All sections | All MD, PDF, ZIP as in allowlist | OK |

**Freelancing summary:** All 41 files present. PDFs in `freelancing-content/`; ZIPs built from `proposal-templates/`, `contract-templates/`, `business-systems-templates/` via `scripts/build-freelancing-zips.ts`.

---

## 4. ZIP and Binary Summary

### 4.1 Web Apps ZIPs

| File | Source | In Repo | Non-Empty | Notes |
|------|--------|---------|-----------|--------|
| basic-starter-template.zip | basic-starter-template/ | Yes | Yes | Built by build-web-apps-zips.ts |
| saas-starter-template.zip | saas-starter-template/ | Yes | Yes | Same |
| advanced-saas-template.zip | advanced-saas-template/ | Yes | Yes | Same |
| ai-integration-examples.zip | ai-integration-examples/ | Yes | Yes | Same |

### 4.2 Social Media ZIPs and Binaries

| File | Type | In Repo | Notes |
|------|------|---------|--------|
| content-strategy-template.xlsx | xlsx | No | Spec: content-strategy-template-spec.md |
| daily-posting-checklist.pdf | pdf | No | Spec: daily-posting-checklist-content.md |
| social-media-level-1-monetization-budget-worksheet.pdf | pdf | No | Spec: social-media-level-1-monetization-budget-worksheet-content.md |
| content-calendar-template.xlsx | xlsx | No | Spec: content-calendar-template-spec.md |
| client-reporting-template.docx | docx | No | Spec: client-reporting-template-spec.md |
| client-onboarding-checklist.pdf | pdf | No | Spec: client-onboarding-checklist-content.md |
| social-media-level-2-smm-budget-planner.pdf | pdf | No | Spec: social-media-level-2-smm-budget-planner-content.md |
| team-management-templates.zip | zip | No | No source dir or build script in repo |
| social-media-level-3-agency-budget-planning.pdf | pdf | No | Spec: social-media-level-3-agency-budget-planning-content.md |

### 4.3 Agency ZIPs and PDFs

| File | Type | In Repo | Notes |
|------|------|---------|--------|
| client-onboarding-template.zip | zip | No | Spec: client-onboarding-template-spec.md |
| agency-level-1-solo-budget-worksheet.pdf | pdf | No | Spec: agency-level-1-solo-budget-worksheet-content.md |
| agency-operations-templates.zip | zip | No | Spec: agency-operations-templates-spec.md |
| agency-level-2-team-budget-planner.pdf | pdf | No | Spec: agency-level-2-team-budget-planner-content.md |
| enterprise-templates.zip | zip | No | Spec: enterprise-templates-spec.md |
| agency-level-3-enterprise-budget-planning.pdf | pdf | No | Spec: agency-level-3-enterprise-budget-planning-content.md |

### 4.4 Freelancing ZIPs and PDFs

| File | Type | In Repo | Non-Empty | Notes |
|------|------|---------|-----------|--------|
| proposal-templates.zip | zip | Yes | Yes | Built from proposal-templates/ |
| contract-templates.zip | zip | Yes | Yes | Built from contract-templates/ |
| business-systems-templates.zip | zip | Yes | Yes | Built from business-systems-templates/ |
| freelancing-level-1-side-hustle-budget-planner.pdf | pdf | Yes | Yes | |
| freelancing-level-1-pricing-calculator-worksheet.pdf | pdf | Yes | Yes | |
| freelancing-level-2-full-time-budget-planner.pdf | pdf | Yes | Yes | |
| freelancing-level-3-business-financial-planning.pdf | pdf | Yes | Yes | |

---

## 5. Functionality Summary

- **Download:** For allowlisted files that exist in storage, the download API returns 200, non-empty body, and correct `Content-Type`/`Content-Disposition`. For Social Media and Agency, any allowlisted binary that has not been uploaded will return 404 until binaries are added and upload is run.
- **Hosted MD / Expanded View:** For MD files in storage, the content API returns markdown; `MarkdownViewer` renders it; expanded view opens with sidebar TOC and search. TOC built from headings (h2/h3/h4); search filters by word match. Verified in code; no dependency on empty content beyond normal loading/error handling.
- **Sidebar TOC and Search:** In `ExpandedDocumentView`, sidebar shows heading tree; click scrolls to section; search filters headings. Behavior is correct for both minimal and large heading sets.

---

## 6. Issues and Concerns

1. **Social Media — 9 binary files missing:** content-strategy-template.xlsx, daily-posting-checklist.pdf, social-media-level-1-monetization-budget-worksheet.pdf, content-calendar-template.xlsx, client-reporting-template.docx, client-onboarding-checklist.pdf, social-media-level-2-smm-budget-planner.pdf, team-management-templates.zip, social-media-level-3-agency-budget-planning.pdf. Content/spec MDs exist for PDFs; XLSX/DOCX/ZIP have specs or no build. Upload will skip these; download will 404 for users until files exist in storage.

2. **Agency — 6 binary files missing:** client-onboarding-template.zip, agency-level-1-solo-budget-worksheet.pdf, agency-operations-templates.zip, agency-level-2-team-budget-planner.pdf, enterprise-templates.zip, agency-level-3-enterprise-budget-planning.pdf. Specs and *-content.md exist; no ZIP/PDF artifacts in repo. Upload will skip or fail for missing files; download will 404 until binaries are in storage.

3. **Social Media — team-management-templates.zip:** No source directory or build script in repo; only allowlist entry. Either add a source dir and build script (e.g. mirror Freelancing) or add a placeholder ZIP and document.

4. **Agency / Social Media PDFs:** Allowlist expects PDFs; repo has *-content.md. Options: (a) generate PDFs from *-content.md (e.g. via existing PDF route or build step) and add to content folders, or (b) add placeholder PDFs and document, or (c) change allowlist to point to MD and serve PDF via /pdf only where applicable (would require product/UX decision).

5. **Cross-references and heading structure:** Not exhaustively audited per file. Recommend spot-checking implementation plans and frameworks for `##`/`###`/`####` and “See the X section” / relative links per CONTENT_AUTHORING_GUIDE and TERMINOLOGY_STYLE_GUIDE in a follow-up pass.

---

## 7. Recommendations

1. **High — Social Media binaries:** Create or generate the 4 PDFs from *-content.md (e.g. reuse markdown-to-PDF pipeline), add content-strategy-template.xlsx, content-calendar-template.xlsx, client-reporting-template.docx, and client-onboarding-checklist.pdf from specs or placeholders, and add team-management-templates (source dir + build script or placeholder ZIP). Then run `npx tsx scripts/upload-social-media-files.ts` and confirm no 404s for allowlisted files.

2. **High — Agency binaries:** Build 3 ZIPs from spec (e.g. create source dirs and `scripts/build-agency-zips.ts` or add placeholder ZIPs). Generate or add 3 PDFs from *-content.md. Run `npx tsx scripts/upload-agency-files.ts` and confirm all 40 files in storage.

3. **Medium — PDF generation:** If product decision is to serve planning worksheets as PDF download only, document and optionally automate: for each *-content.md that corresponds to an allowlisted PDF, run markdown-to-PDF (e.g. via existing lib) and output to the package content folder so upload scripts can push the PDF.

4. **Low — Content pass:** Optionally run a Phase 2–style pass on a sample of MD files (e.g. one implementation plan per package) for heading structure, terminology, and cross-references; log any fixes in a small follow-up doc.

5. **Low — Audit script:** Add a small script (e.g. `scripts/audit-package-content.ts`) that: for each package, calls `getAllowedFilenamesForPackage`, lists content dir files, and reports missing/extra; run in CI or pre-upload to catch drift.

---

## 8. Remediation Completed (January 28, 2026)

All Issues (1–5) and Recommendations (1–5) have been addressed. Binaries are generated or built from specs and *-content.md; no placeholders.

**Issue 1 (Social Media — 9 binary files):** Addressed. PDFs generated from *-content.md via `scripts/build-package-pdfs.ts`. XLSX (content-strategy-template, content-calendar-template) built via `scripts/build-social-media-xlsx.ts`. DOCX (client-reporting-template) built via `scripts/build-social-media-docx.ts`. team-management-templates.zip built from source dir `social-media-content/team-management-templates/` via `scripts/build-social-media-zips.ts`. All 39 Social Media allowlist files now present in repo.

**Issue 2 (Agency — 6 binary files):** Addressed. PDFs generated from *-content.md via `scripts/build-package-pdfs.ts`. ZIPs (client-onboarding-template, agency-operations-templates, enterprise-templates) built from source dirs in `agency-content/` via `scripts/build-agency-zips.ts`. All 40 Agency allowlist files now present in repo.

**Issue 3 (team-management-templates.zip):** Addressed. Spec added (`team-management-templates-spec.md`), source dir created with real template files, build script `scripts/build-social-media-zips.ts` produces the ZIP.

**Issue 4 (PDF generation):** Addressed. `scripts/build-package-pdfs.ts` reads *-content.md, runs `markdownToPDF()`, writes allowlist PDF filenames into package content folders. Documented in social-media-content/README.md and agency-content/README.md.

**Issue 5 (Content pass):** Addressed. Sample (one implementation plan per package, two frameworks per package Level 1) reviewed for heading structure and cross-references. No structural fixes required. Log: [docs/CONTENT_PASS_FIXES.md](CONTENT_PASS_FIXES.md).

**Rec 5 (Audit script):** Addressed. `scripts/audit-package-content.ts` compares allowlist to content dir for each package; reports missing/extra; exit 1 if any allowlist file missing. npm script: `content:audit`.

**Freelancing source dirs:** Real template files added to proposal-templates, contract-templates, and business-systems-templates (no placeholders). `scripts/build-freelancing-zips.ts` produces non-placeholder ZIPs.

**Build order before upload:** Run `content:build-pdfs` → `content:build-social-media-xlsx` → `content:build-social-media-docx` → `content:build-social-media-zips` → `content:build-agency-zips` → `content:build-zips` (Web Apps) and `build-freelancing-zips`; then `content:audit` (must exit 0); then upload scripts.

---

**Document generated as the single audit/review deliverable per the Comprehensive Package Content Audit and Review Plan.**

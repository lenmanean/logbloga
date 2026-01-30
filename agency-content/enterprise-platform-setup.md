# Enterprise Platform Setup

Step-by-step setup for the enterprise platform stack (CRM, delivery, reporting, integrations) so you can run 10+ clients and multi-service delivery—supporting $15,000–$50,000+/month at Level 3. **Most comprehensive** in package: when to use, how this supports $15k–$50k+; deep substeps, time estimates, integration notes.

## Overview

**Level 3 (Enterprise).** The enterprise platform stack is the set of tools (CRM, delivery, reporting, integrations) that support a 5+ person team and 10+ clients. For Level 3 established multi-service agency ($15,000–$50,000+/month, 12–16 weeks, $800–2,000 platform costs), this guide covers when to use an enterprise stack, how it supports $15k–$50k+ revenue, and deep substeps for CRM, delivery tools, reporting, and integrations. Use with [GoHighLevel Enterprise Setup](gohighlevel-enterprise-setup.md) for CRM; this guide covers the full stack and integration notes.

## When to Use This Guide

Use this guide when:
- You have or are scaling to a **5+ person team** and **10+ clients**
- You need **multi-service delivery** (multiple service lines, playbooks, SLAs) and **enterprise reporting**
- You're targeting **$15,000–$50,000+/month** and **$800–2,000 platform costs**
- You want a single reference for **how the stack fits together** (CRM, delivery, reporting, integrations)

If you're at Level 2 (2–5 person team, 5–10 clients), use the [GoHighLevel Setup Guide](gohighlevel-setup-guide.md) and Option B guides instead.

## Prerequisites

- [Level 2 complete or equivalent](agency-level-2-plan.md) (GoHighLevel or Option B stack in use)
- [GoHighLevel Enterprise Setup](gohighlevel-enterprise-setup.md) completed or in progress (CRM in place)
- [Enterprise Operations Framework](enterprise-operations-framework.md) in progress (governance, SLAs, multi-service delivery)
- [Enterprise Service Development](enterprise-service-development.md) in progress (service lines, playbooks)

**Time:** About 3–4 hours total (CRM alignment ~30 min; delivery tools ~1 hr; reporting ~1 hr; integrations ~1 hr).

---

## Step 1: CRM Alignment (GoHighLevel Enterprise or Equivalent)

**Time estimate:** 20–30 minutes  
**Purpose:** Ensure your CRM (GoHighLevel enterprise or equivalent) is aligned with enterprise operations: multi-pipeline, custom fields, team roles, and reporting.

### Sub-steps

1. **Review [GoHighLevel Enterprise Setup](gohighlevel-enterprise-setup.md).** Confirm: multiple pipelines (or one pipeline with Service line field); deal stages and custom fields (Contract value, Service line, Decision-maker); team roles and permissions; dashboards for pipeline and revenue. If you use a different CRM (e.g. HubSpot Enterprise, Salesforce), apply the same logic: pipelines or equivalent, custom fields, roles, reporting.
2. **Map pipelines to service lines.** Document which pipeline (or which Service line value) corresponds to which service line from [Enterprise Service Development](enterprise-service-development.md). Use for reporting and capacity (see [Team Scaling Guide](team-scaling-guide.md)).
3. **Map deal stages to handoffs.** Document which stage triggers which handoff (e.g. "Closed won" → create kickoff task for Account manager). Use [Enterprise Operations Framework](enterprise-operations-framework.md) for governance. Ensure automation or tasks are in place so handoffs don't slip.
4. **Verify:** Run a test deal through one pipeline from Lead to Closed won. Confirm contact and deal are created, assigned, and visible in reports. Confirm handoff task or notification fires when expected.

**Testing checklist:** [ ] CRM aligned with service lines and stages; [ ] Custom fields and roles set; [ ] Handoff automation or tasks in place; [ ] Test deal and reporting verified

---

## Step 2: Delivery Tools (Tasks, Client Workspaces, Approvals)

**Time estimate:** 45–60 minutes  
**Purpose:** Set up delivery tools (task/project management, client workspaces, approvals) so multi-service delivery is consistent and SLAs are trackable.

### Sub-steps

1. **Task or project management.** Use ClickUp (paid/enterprise), Asana, Monday, or equivalent. Create **spaces or workspaces** per service line (e.g. "Content & SEO," "Paid Media") and **folders or projects** per client. Use [Enterprise Service Development](enterprise-service-development.md) playbooks for phase names and task templates. Ensure 5+ users have access and permissions match [Team Scaling Guide](team-scaling-guide.md) (Delivery lead, Specialist, etc.).
2. **Client workspaces or approval tool.** Use Zite, Notion, or equivalent for client-facing deliverables and approvals. Create **projects per client** (or per engagement). Set approval workflow (e.g. client approves in 5 business days; team notified on approval). Align with [Enterprise Operations Framework](enterprise-operations-framework.md) SLAs (response time, revision limits). Document where deliverables are sent and how feedback is collected.
3. **Templates.** Create **delivery templates** (e.g. kickoff checklist, status report, client review) per service line. Use [Enterprise Templates](enterprise-templates.zip) (ZIP) for structure. Store in task tool or shared drive so the team can duplicate for new clients.
4. **Time estimates.** Document time per phase or deliverable (from Enterprise Service Development playbooks) so you can track capacity and revenue-per-head. Use in [Scaling & Revenue Strategy](agency-level-3-scaling-revenue-strategy.md) and [Enterprise Budget Planning](agency-level-3-enterprise-budget-planning.pdf) (PDF).
5. **Integration note:** If task tool or approval tool integrates with CRM (e.g. "When deal moves to Closed won, create project in ClickUp"), set it up. Document in Step 4 (Integrations).

**Testing checklist:** [ ] Delivery tool(s) set up with spaces per service line and folders per client; [ ] Client workspace or approval tool in use; [ ] Templates and SLAs documented; [ ] Time estimates and capacity logic clear; [ ] Integration (if any) documented

---

## Step 3: Reporting and Dashboards

**Time estimate:** 45–60 minutes  
**Purpose:** Set up reporting and dashboards for pipeline, revenue, delivery, and (optional) board-style metrics so you can run monthly reviews and board/investor reporting.

### Sub-steps

1. **Pipeline and revenue.** Use CRM dashboards (from [GoHighLevel Enterprise Setup](gohighlevel-enterprise-setup.md)) for pipeline value by stage, deal count by stage, won/lost value, average deal size. Filter by service line or pipeline. Use for monthly review (see [Level 3 Implementation Plan](agency-level-3-plan.md) Phase 4). Align with [Scaling & Revenue Strategy](agency-level-3-scaling-revenue-strategy.md) and [Enterprise Budget Planning](agency-level-3-enterprise-budget-planning.pdf) (PDF).
2. **Delivery and capacity.** Use task tool reports (e.g. tasks completed per user, tasks overdue, capacity per client) or a simple spreadsheet. Track revenue-per-head (revenue ÷ FTE) and capacity (clients per Delivery lead, hours per service line). Use for [Team Scaling Guide](team-scaling-guide.md) and when to hire.
3. **Board-style or investor-style report (optional).** Create a one-page or two-page summary: revenue by month, revenue by service line, pipeline value, team count, key wins, risks. Use [Enterprise Templates](enterprise-templates.zip) (ZIP) board-style report template. Update monthly or quarterly. Store in shared drive or send to board/investors.
4. **Export and share.** Ensure Owner or Manager can export pipeline and revenue data (CSV or PDF). Document where to find dashboards and how to export in Enterprise Operations Framework or internal playbook.
5. **Integration note:** If you use a BI tool (e.g. Looker, Tableau, Google Data Studio) or spreadsheet for P&L, document how data flows from CRM and delivery tools (API, export, manual). See Step 4.

**Testing checklist:** [ ] Pipeline and revenue dashboards in use; [ ] Delivery/capacity metrics (if applicable) in use; [ ] Board-style report (if applicable) template in use; [ ] Export and share configured; [ ] Integration (if any) documented

---

## Step 4: Integrations (CRM ↔ Delivery ↔ Reporting)

**Time estimate:** 45–60 minutes  
**Purpose:** Document and (where possible) automate data flow between CRM, delivery tools, and reporting so you don't double-enter and so reports stay current.

### Sub-steps

1. **CRM → Delivery.** When a deal moves to "Closed won," create a project or folder in the delivery tool (e.g. ClickUp) and assign Account manager or Delivery lead. Use Zapier, Make, or native integration if available. Document: trigger (deal stage), action (create project, assign owner), and who owns the handoff if automation fails.
2. **Delivery → CRM (optional).** When a deliverable is approved or a phase is complete, update the deal or contact in CRM (e.g. add tag "Phase 1 complete"). Use for reporting and renewal triggers. Document trigger and action.
3. **CRM → Reporting.** Pipeline and revenue data in CRM should feed dashboards (native) or export to spreadsheet/BI tool. Document: how often you export or refresh; who owns updating the board-style report.
4. **Calendar and booking.** If you use GoHighLevel for booking, ensure calendar events sync to team calendars (Google, Outlook). Document any sync issues and workarounds.
5. **Integration notes.** Create a short doc or section in [Enterprise Operations Framework](enterprise-operations-framework.md): list each integration (CRM ↔ Delivery, Delivery → CRM, CRM → Reporting, Calendar); trigger and action; owner; fallback if integration breaks. Update when you add or change tools.

**Testing checklist:** [ ] CRM → Delivery handoff (automated or manual) documented and tested; [ ] Delivery → CRM (if any) documented and tested; [ ] CRM → Reporting flow documented; [ ] Integration notes in Enterprise Operations Framework or playbook; [ ] Fallback and owner clear

---

## What You'll Have When Done

- CRM aligned with service lines, deal stages, custom fields, team roles, and reporting
- Delivery tools (task/project, client workspaces, approvals) set up for multi-service delivery with templates and SLAs
- Reporting and dashboards for pipeline, revenue, delivery, and (optional) board-style metrics
- Integrations (CRM ↔ Delivery ↔ Reporting) documented and (where possible) automated; fallback and owner clear

**Time estimate summary:** Step 1 ~20–30 min; Step 2 ~45–60 min; Step 3 ~45–60 min; Step 4 ~45–60 min. **Total: ~3–4 hours.**

## See Also

- [Level 3 Implementation Plan](agency-level-3-plan.md) — Full roadmap
- [GoHighLevel Enterprise Setup](gohighlevel-enterprise-setup.md) — Enterprise CRM
- [Enterprise Operations Framework](enterprise-operations-framework.md) — Governance, SLAs, multi-service delivery
- [Team Scaling Guide](team-scaling-guide.md) — Roles, capacity, revenue-per-head
- [Enterprise Service Development](enterprise-service-development.md) — Service lines, playbooks
- [Enterprise Templates](enterprise-templates.zip) (ZIP) — Enterprise proposal, SOW, board-style report
- [Scaling & Revenue Strategy](agency-level-3-scaling-revenue-strategy.md) — Revenue by service line, when to scale
- [Enterprise Operations Issues](agency-level-3-enterprise-operations-issues.md) — Troubleshooting

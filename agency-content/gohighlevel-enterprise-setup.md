# GoHighLevel Enterprise Setup

Step-by-step setup for GoHighLevel at enterprise scale so you can run 10+ clients with a 5+ person team—supporting $15,000–$50,000+/month at Level 3. **Most comprehensive** platform guide in the Agency package: when to use, how this supports $15k–$50k+; deep substeps, time estimates, integration notes.

## Overview

**Level 3 (Enterprise).** GoHighLevel enterprise gives you one platform for CRM, pipelines, automation, calendar, campaigns, and reporting at scale so a 5+ person team can run 10+ clients and multiple service lines. For Level 3 established multi-service agency ($15,000–$50,000+/month, 12–16 weeks, $800–2,000 platform costs), GoHighLevel enterprise (or equivalent agency/white-label tier) supports multi-pipeline, advanced automation, team roles, and reporting. This guide walks you through when to use enterprise vs Level 2, account and sub-account structure, multi-pipeline and deal stages, team and permissions at scale, calendar and booking at scale, campaigns and automation for enterprise leads, reporting and dashboards, and integration notes.

## When to Use This Guide

Use this guide when:
- You have or are scaling to a **5+ person team** and **10+ clients**
- You need **multi-pipeline** (e.g. by service line or by segment) and **advanced automation**
- You're targeting **$15,000–$50,000+/month** and **$800–2,000 platform costs**
- Level 2 GoHighLevel (or Option B stack) is at capacity or you need enterprise-tier features (white-label, agency structure, advanced reporting)

If you're at Level 2 (2–5 person team, 5–10 clients), use the [GoHighLevel Setup Guide](gohighlevel-setup-guide.md) instead.

## Prerequisites

- [Level 2 complete or equivalent](agency-level-2-plan.md) (GoHighLevel or Option B stack, Team Management, Service Suite, 5–10 clients)
- [Enterprise Operations Framework](enterprise-operations-framework.md) in progress (governance, SLAs, multi-service delivery)
- [Team Scaling Guide](team-scaling-guide.md) in progress (roles, capacity, revenue-per-head)
- [Enterprise Service Development](enterprise-service-development.md) in progress (service lines, pricing, playbooks)

**Time:** About 4–6 hours total (account and structure ~1 hr; multi-pipeline ~1.5 hr; team and calendar ~1 hr; campaigns and reporting ~1.5 hr; integrations ~30 min).

---

## Step 1: Account and Sub-Account (Agency) Structure

**Time estimate:** 45–60 minutes  
**Purpose:** Set up an enterprise or agency-tier account and sub-account structure so you can run multiple pipelines, teams, or white-label instances.

### Sub-steps

1. **Upgrade or create** a GoHighLevel **agency** or **enterprise** account. Compare Agency vs Unlimited vs white-label tiers. For Level 3 (5+ users, 10+ clients, $15k–$50k+/month), Agency or enterprise tier typically includes multiple sub-accounts (locations), white-label options, and higher limits. Check user limits, pipeline limits, and contact limits.
2. **Create sub-accounts (locations)** if you need separate instances (e.g. one per service line or one per brand). For many agencies, one main sub-account for "Agency" is enough; use pipelines and tags to separate service lines. Document your structure in [Enterprise Operations Framework](enterprise-operations-framework.md).
3. **Billing and ownership.** Ensure billing is set for enterprise tier; assign one owner (super admin) per sub-account. Verify access: owner can see all sub-accounts; team members see only their assigned sub-account(s).
4. **Verify:** You see the main dashboard with menu items for Pipeline, Contacts, Calendar, Campaigns, Automation, Reports, and (if applicable) Agency or Locations. You can create multiple pipelines and invite 5+ users.

**Testing checklist:** [ ] Enterprise or agency account active; [ ] Sub-account structure (if any) set; [ ] 5+ user capacity; [ ] Dashboard and menu accessible

---

## Step 2: Multi-Pipeline and Deal Stages

**Time estimate:** 60–90 minutes  
**Purpose:** Set up multiple pipelines (e.g. by service line or by segment) with deal stages so the team can track enterprise and multi-service deals.

### Sub-steps

1. In GoHighLevel, go to **Pipeline** (or **Sales**). Create **multiple pipelines** if you have multiple service lines (e.g. "Content & SEO," "Paid Media," "Strategy"). Or use one pipeline with a **custom field** (e.g. "Service line") so you can filter and report by line. Use [Enterprise Service Development](enterprise-service-development.md) for service line names and stages.
2. **Deal stages per pipeline.** Define stages that match your process. Example: Lead → Qualified → Proposal sent → Negotiation → Closed won → Onboarded → In delivery → Renewal. Add stages for enterprise (e.g. "RFP submitted," "Legal review") if you run RFPs. Use [Enterprise Operations Framework](enterprise-operations-framework.md) for governance (who moves deals, when).
3. **Stage actions and automation.** Configure actions when a deal moves (e.g. task for account owner when "Proposal sent"; notify Owner when "Closed won" above $X). Use for handoff from sales to delivery (see [Team Scaling Guide](team-scaling-guide.md)).
4. **Custom fields.** Add deal custom fields: Service line, Contract value, Contract term, Primary contact, Decision-maker. Use for reporting and filtering. Document in [Enterprise Templates](enterprise-templates.zip) (ZIP) proposal and SOW alignment.
5. **Add test deals.** Create 2–3 test deals across pipelines (or with different Service line values). Move them through stages. Confirm visibility and permissions for the right team members.
6. **Integration note:** If you use an external CRM or ERP, check GoHighLevel's API or Zapier/Make for syncing deals. Document in [Enterprise Platform Setup](enterprise-platform-setup.md).

**Testing checklist:** [ ] Multiple pipelines or one pipeline with Service line field; [ ] Deal stages and custom fields set; [ ] Stage actions or automation in place; [ ] Test deals visible and movable; [ ] Integration (if any) documented

---

## Step 3: Team Roles and Permissions at Scale

**Time estimate:** 45–60 minutes  
**Purpose:** Add 5+ team members and set roles and permissions so everyone has the right access (pipelines, contacts, calendar, campaigns, reports) without exposing sensitive data.

### Sub-steps

1. In GoHighLevel, go to **Settings** → **Team** (or **Users**). Invite all team members by email. Assign a **role** per [Team Scaling Guide](team-scaling-guide.md) and [Enterprise Operations Framework](enterprise-operations-framework.md): e.g. Super Admin, Admin, Manager, Agent. Use custom roles if your plan supports it (e.g. "Delivery lead," "Account manager," "Specialist").
2. **Permissions.** Restrict or allow access to Pipelines, Contacts, Calendar, Campaigns, Reports, and Billing. For Level 3: Owner/Super Admin sees all; Managers see their pipelines or teams; Agents see assigned deals and contacts only. Document who can create pipelines, edit automation, and view financials.
3. **Pipeline ownership and assignment.** Set default deal ownership (e.g. round-robin for new leads, or by territory/service line). Use **teams** if your plan supports it (e.g. "Content team," "Paid media team") so reporting and assignment stay clear. Document in Team Scaling Guide.
4. **Verify:** Each invited user can log in and sees only what they should. Run a quick test: Agent creates a deal; Manager sees it; Super Admin sees all. Confirm no one can access Billing or other sensitive settings unless assigned.
5. **Integration note:** If you use SSO or directory sync (e.g. Google Workspace), configure in Settings. Document in Enterprise Platform Setup.

**Testing checklist:** [ ] 5+ users invited and roles set; [ ] Permissions match enterprise structure; [ ] Pipeline ownership or teams in use; [ ] Sensitive areas restricted; [ ] SSO/sync (if any) documented

---

## Step 4: Calendar and Booking at Scale

**Time estimate:** 45–60 minutes  
**Purpose:** Set up shared or team calendars and booking links so enterprise leads and clients can book calls with the right team member or team.

### Sub-steps

1. In GoHighLevel, go to **Calendar** (or **Scheduling**). Connect **calendars** for each team member (Google Calendar, Outlook, or GoHighLevel native). Ensure busy times are blocked across the team.
2. **Booking types.** Create booking types for enterprise: e.g. "Discovery call (30 min)," "Strategy call (45 min)," "Enterprise consultation (60 min)," "Client review (30 min)." Assign to the appropriate role(s) or use round-robin for discovery. Set duration, buffer, and availability. Use [Enterprise Outreach Guide](agency-level-3-enterprise-outreach-guide.md) for positioning and follow-up.
3. **Pre-booking form.** Collect name, email, company, role, source, and (optional) service line interest so you can route and create the right contact and deal. Set form to create contact and deal (with correct pipeline and stage) on submit.
4. **Publish and test.** Add booking links to website, email signature, sequences, and partnership collateral. Test: book from an incognito window; confirm contact and deal are created and assigned correctly.
5. **Integration note:** If you use Calendly or another scheduler, check GoHighLevel's native calendar first to avoid duplicate no-shows; or document a single source of truth in Enterprise Platform Setup.

**Testing checklist:** [ ] All team calendars connected; [ ] Booking types for enterprise calls set; [ ] Pre-booking form creates contact and deal; [ ] Links live and tested; [ ] Integration (if any) documented

---

## Step 5: Campaigns and Automation for Enterprise Leads

**Time estimate:** 60–90 minutes  
**Purpose:** Build campaigns and automation for enterprise leads (nurture, ABM-style touches, RFP follow-up) so the team spends less time on manual follow-up and more on closing.

### Sub-steps

1. In GoHighLevel, go to **Campaigns** (or **Automation**). Create **campaigns** for enterprise: e.g. "Enterprise lead nurture," "RFP follow-up," "Partnership outreach." Use [Enterprise Outreach Guide](agency-level-3-enterprise-outreach-guide.md) for messaging and [Partnership Strategies](agency-level-3-partnership-strategies.md) for partner sequences.
2. **Triggers.** Set triggers: contact added to pipeline, deal entered stage (e.g. "Lead," "RFP submitted"), or tag applied (e.g. "Enterprise," "Partner"). Use custom fields (Service line, Company size) to segment.
3. **Workflow steps.** Add 5–7 steps per campaign: e.g. send email 1 (welcome), wait 3 days, send email 2 (case study or offer), wait 3 days, send email 3 ("Book a call" or "Reply"), create task for account owner if no reply, wait 5 days, send email 4 (final touch). Use merge fields (first name, company, service line). Keep tone professional and enterprise-appropriate.
4. **RFP or enterprise-specific automation.** If you run RFPs, add a workflow: trigger when deal stage = "RFP submitted"; create tasks for Owner and delivery lead; send internal notification; optionally send confirmation email to prospect. Document in Enterprise Operations Framework.
5. **Test.** Add a test contact or deal that meets the trigger; confirm emails send (or tasks create) as expected. Disable or remove test after verification.
6. **Integration note:** If you use external email (e.g. SendGrid, Mailchimp) for high volume, check GoHighLevel's sending limits and document in Enterprise Platform Setup. For most Level 3 agencies, native campaigns are enough.

**Testing checklist:** [ ] At least 2 campaigns created (e.g. nurture, RFP); [ ] Triggers and segmentation set; [ ] 5+ steps per campaign; [ ] Test run successful; [ ] Integration (if any) documented

---

## Step 6: Reporting and Dashboards

**Time estimate:** 45–60 minutes  
**Purpose:** Set up dashboards for pipeline value by pipeline/service line, deal count by stage, revenue, and (if available) activity so you can run monthly reviews and board-style reporting.

### Sub-steps

1. In GoHighLevel, go to **Reports** or **Dashboard**. Create **dashboards** for: (1) Pipeline overview (value by stage, count by stage, won/lost); (2) By service line or pipeline (if multi-pipeline); (3) Activity (calls, emails, tasks) if available. Use [Scaling & Revenue Strategy](agency-level-3-scaling-revenue-strategy.md) and [Enterprise Budget Planning](agency-level-3-enterprise-budget-planning.pdf) (PDF) for revenue and P&L alignment.
2. **Pipeline and revenue metrics.** Add reports for: pipeline value by stage; number of deals by stage; won value (and optionally lost value); average deal size. Filter by service line or pipeline if you use multi-pipeline. Use for monthly review (see Level 3 Implementation Plan Phase 4).
3. **Activity and team metrics.** If available, add widgets for: calls completed, emails sent, tasks completed; by user or by team. Use for capacity and follow-up consistency (see Team Scaling Guide).
4. **Export and share.** Ensure Owner or Manager can export or share dashboards with the team and (if applicable) board or investors. Document where to find them in [Enterprise Templates](enterprise-templates.zip) (ZIP) board-style report template.
5. **Integration note:** If you use a BI tool (e.g. Looker, Tableau) or spreadsheet for P&L, document how pipeline and revenue data flow from GoHighLevel (API, export, or manual) in Enterprise Platform Setup.

**Testing checklist:** [ ] Dashboards created for pipeline, service line, activity; [ ] Pipeline and revenue metrics visible; [ ] Export/share configured; [ ] Board-style report (if any) aligned; [ ] Integration (if any) documented

---

## What You'll Have When Done

- GoHighLevel enterprise (or agency) account with sub-account structure (if needed) and 5+ user capacity
- Multi-pipeline (or one pipeline with service line field) with deal stages and custom fields
- Team roles and permissions set for 5+ users; pipeline ownership or teams in use
- Calendar and booking at scale for enterprise discovery, strategy, and client calls
- Campaigns and automation for enterprise lead nurture and (optional) RFP follow-up
- Dashboards for pipeline, revenue, and (optional) activity; aligned with Scaling & Revenue Strategy and Enterprise Budget Planning

**Time estimate summary:** Step 1 ~45–60 min; Step 2 ~60–90 min; Step 3 ~45–60 min; Step 4 ~45–60 min; Step 5 ~60–90 min; Step 6 ~45–60 min. **Total: ~4–6 hours.**

## See Also

- [Level 3 Implementation Plan](agency-level-3-plan.md) — Full roadmap
- [Enterprise Platform Setup](enterprise-platform-setup.md) — Enterprise stack, integrations, reporting
- [Enterprise Operations Framework](enterprise-operations-framework.md) — Governance, SLAs, multi-service delivery
- [Team Scaling Guide](team-scaling-guide.md) — Roles, capacity, revenue-per-head
- [Enterprise Service Development](enterprise-service-development.md) — Service lines, pricing, playbooks
- [Enterprise Outreach Guide](agency-level-3-enterprise-outreach-guide.md) — Enterprise buyers, ABM, RFP
- [Partnership Strategies](agency-level-3-partnership-strategies.md) — Partner types, deal structure
- [Enterprise Operations Issues](agency-level-3-enterprise-operations-issues.md) — Troubleshooting

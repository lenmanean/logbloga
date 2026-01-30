# Google Analytics Setup Guide

Step-by-step instructions for setting up Google Analytics so you can track traffic, goals, and social referral—supporting $300–$1,000/month as a personal brand or content creator.

## Overview

Google Analytics (GA4) helps you see how people find and use your website (or linked pages). For Level 1 personal brand monetization, tracking traffic, goals (e.g. link clicks, sign-ups), and social referral helps you know what content drives results. This guide walks you through creating a property, linking to your site or social links (where supported), setting goals or events, and using social tracking—within Level 1 time investment (2–3 weeks) and platform costs ($0–30/month). Google Analytics is free.

## Prerequisites

- Google account (Gmail or Google Workspace)
- A website, blog, or link-in-bio page that you can add a tracking code to (e.g. WordPress, Linktree, Carrd, or a custom site)
- Optional: If you don't have a site yet, you can still create a GA4 property and add it when ready; some social platforms (e.g. Instagram link in bio) send traffic to a URL you control—that URL can be on a page with GA4

**Time:** About 25–35 minutes total (property and link ~15 min; goals/events ~10–15 min).

---

## Step 1: Create a GA4 Property

**Time:** ~10–15 minutes  
**Purpose:** Create a Google Analytics 4 property so you can collect data from your website or app.

### Sub-steps

1. Go to [analytics.google.com](https://analytics.google.com) and sign in with your Google account.
2. Click **Admin** (gear icon). Under **Account**, select your account or create one (e.g. "Personal" or your brand name).
3. Under **Property**, click **Create Property**. Enter **Property name** (e.g. "My Brand" or your site name), **Reporting time zone**, and **Currency**. Click **Next**.
4. **Industry** and **Business size:** Choose options that fit (e.g. "Content creation," "Small"). Click **Next**.
5. **Business objectives:** Select what you care about (e.g. "Generate leads," "Drive online sales," "Get baseline reports"). Click **Create**.
6. Accept the **Terms of Service** if prompted. Choose a **Data stream** type: **Web** (for a website), **iOS app**, or **Android app**. For most creators, select **Web**.

**Testing checklist:** [ ] GA4 property created; [ ] Web (or app) data stream selected

---

## Step 2: Link Your Site or Link-in-Bio

**Time:** ~10–15 minutes  
**Purpose:** Add the GA4 measurement code to your website or link-in-bio page so traffic is tracked.

### Sub-step 2.1: Get your Measurement ID

1. In GA4 Admin, under **Property**, click **Data streams**. Click your **Web** stream (or create one: enter your site URL and stream name).
2. Copy your **Measurement ID** (format: G-XXXXXXXXXX). You'll add this to your site or use it in a tag manager.

### Sub-step 2.2: Install the tag

1. **Option A — Site with HTML access:** Add the gtag.js snippet to the `<head>` of every page (or use a plugin if your platform has one, e.g. "Site Kit by Google" for WordPress). Instructions are shown in the Data stream setup screen under "Tagging instructions."
2. **Option B — Link-in-bio or no code access:** Some link-in-bio tools (e.g. Linktree Pro, Carrd) let you add a custom script or pixel; paste your GA4 gtag snippet there if available. If not, GA4 won't track that page—you can still use platform-native analytics (Instagram Insights, TikTok Analytics) and add GA4 when you have a site.
3. **Verify:** After adding the tag, open your site in a browser and check GA4 **Reports** > **Realtime**; you should see your visit within a few minutes.

**Testing checklist:** [ ] Measurement ID copied; [ ] Tag added to site or link-in-bio (if supported); [ ] Realtime shows at least one visit

---

## Step 3: Set Up Goals or Events

**Time:** ~10–15 minutes  
**Purpose:** Track actions that matter for monetization (e.g. link clicks, sign-ups, product page visits).

### Sub-steps

1. **Events:** GA4 tracks some events by default (e.g. page_view, scroll, first_visit). In **Admin** > **Events**, you can enable or add **Recommended events** (e.g. "generate_lead" if you have a sign-up form).
2. **Conversions:** Mark key events as **Conversions** (Admin > **Conversions**). For example: "form_submit," "click" on your affiliate link, or "purchase" if you have a shop. This lets you see conversion counts in reports.
3. **Goals (GA4):** In GA4, "Goals" are often set via **Conversions** or **Explorations**. For Level 1, having 1–2 conversions (e.g. "link_click" to your product or "sign_up") is enough. Use the [First Monetization Guide](social-media-level-1-first-monetization-guide.md) to decide which action to track first.

**Testing checklist:** [ ] At least one event or conversion configured; [ ] Test action (e.g. click link) and confirm it appears in Realtime or Conversions

---

## Step 4: Use Social Referral and Reports

**Time:** Ongoing  
**Purpose:** See how much traffic comes from social and which content drives results.

### Sub-steps

1. **Acquisition:** In **Reports** > **Acquisition** > **User acquisition** or **Traffic acquisition**, you can see where users come from (e.g. "Organic Search," "Referral," "Social"). Social referral may show as "Referral" with source domain (e.g. instagram.com, tiktok.com) depending on how links are tagged.
2. **UTM parameters:** When you post links on social, add UTM parameters so GA4 groups them (e.g. `?utm_source=instagram&utm_medium=social&utm_campaign=product_launch`). Use a UTM builder (Google has one) or the [Creator Income Planning](social-media-level-1-creator-income-planning.md) to plan campaigns.
3. **Review regularly:** Use the [Content Growth Checklist](social-media-level-1-content-growth-checklist.md) and set a weekly 15-min block to review GA4: top pages, top sources, and conversions. Tie this to your [Content Direction Framework](content-direction-framework.md) metrics (what matters for your niche).

**What you'll have when done:** A GA4 property linked to your site (or link-in-bio where supported), at least one goal or conversion, and a habit of reviewing acquisition and conversions. Use the [First Monetization Guide](social-media-level-1-first-monetization-guide.md) and [Creator Income Planning](social-media-level-1-creator-income-planning.md) to align tracking with revenue goals.

---

## See Also

- [First Monetization Guide](social-media-level-1-first-monetization-guide.md) — Affiliate, sponsored, product; track the right actions  
- [Creator Income Planning](social-media-level-1-creator-income-planning.md) — Goals, streams, timeline; use GA4 for baseline  
- [Content Growth Checklist](social-media-level-1-content-growth-checklist.md) — Weekly analytics review  
- If you run into tracking or compliance issues: [Common Creator Issues](social-media-level-1-common-creator-issues.md)

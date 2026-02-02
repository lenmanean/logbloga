# Free Piracy Detection Setup Guide

## Overview

This is a **100% free** solution for automated piracy detection with minimal manual labor. It uses:

- ✅ Google Custom Search API (100 queries/day free tier)
- ✅ GitHub API (free, 5,000 requests/hour)
- ✅ Reddit API (free, 60 requests/minute)
- ✅ Vercel Cron (free tier included)
- ✅ Email notifications (using existing Resend setup)

## Cost: $0/month

---

## Setup Instructions

### Step 1: Google Custom Search (Optional but Recommended)

**Time: 10 minutes**

1. Go to https://programmablesearchengine.google.com/
2. Click "Add" to create a new search engine
3. Configure:
   - **Sites to search:** Leave blank (search entire web)
   - **Name:** "Logbloga Piracy Monitor"
4. Click "Create"
5. Go to "Control Panel" → "Setup" → "Basics"
6. Copy your **Search Engine ID** (looks like: `017576662512468239146:omuauf_lfve`)
7. Go to https://console.cloud.google.com/apis/credentials
8. Click "Create Credentials" → "API Key"
9. Copy your **API Key**

**Add to environment variables:**
```env
GOOGLE_SEARCH_API_KEY=your_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_engine_id_here
```

**Note:** Without this, you'll still get GitHub and Reddit searches (which are free), but Google search won't work.

### Step 2: Set Up Cron Secret

**Time: 2 minutes**

Add to Vercel environment variables:
```env
CRON_SECRET=your_random_secret_string_here
```

**Important:** Do not include leading or trailing whitespace (e.g. no newline when pasting). Vercel rejects values with whitespace for cron HTTP headers.

Generate a random string (no newline when using CLI):
```bash
openssl rand -hex 32
```
Or with Node and pipe to Vercel: `node -e "process.stdout.write(require('crypto').randomBytes(32).toString('hex'))" | vercel env add CRON_SECRET production`

### Step 3: Configure Admin Email (Optional)

**Time: 1 minute**

Add to Vercel environment variables:
```env
ADMIN_EMAIL=your-email@example.com
```

If not set, uses `RESEND_FROM_EMAIL` (which you likely already have configured).

### Step 4: Deploy

**Time: 5 minutes**

```bash
git add .
git commit -m "Add free piracy detection automation"
git push
```

Vercel will automatically:
- Deploy the cron job
- Start daily monitoring at 2 AM UTC

---

## How It Works

### Daily Automation (2 AM UTC)

1. **Smart Product Rotation**
   - Searches 3-4 products per day (stays within Google's 100 queries/day limit)
   - Rotates through all products so each gets searched regularly

2. **Multi-Platform Search**
   - **GitHub:** Searches code repositories and gists (free, 5k requests/hour)
   - **Reddit:** Searches posts and comments (free, 60 requests/minute)
   - **Google:** Searches entire web (free, 100 queries/day)

3. **Automatic Detection**
   - Extracts watermarks from found content
   - Identifies source users
   - Creates piracy reports

4. **Email Notifications**
   - Sends email when new piracy is detected
   - Includes confidence score and one-click review link
   - Daily summary email with statistics

### Manual Work Required

**Minimal - Just Review & Click:**

1. **Check Email Daily** (2 minutes)
   - Review new piracy reports
   - Check confidence scores

2. **One-Click DMCA** (30 seconds per report)
   - Click "Review & Submit DMCA" link in email
   - Review the report
   - Click "Submit DMCA" button
   - Done!

**Total Time:** ~5-10 minutes per day (if piracy is found)

---

## What You Get

### Free Tier Limits

| Service | Free Limit | Our Usage |
|---------|------------|-----------|
| Google Custom Search | 100 queries/day | 3-4 products/day = ~12 queries/day |
| GitHub API | 5,000 requests/hour | ~10 requests/day |
| Reddit API | 60 requests/minute | ~10 requests/day |
| Vercel Cron | Unlimited | 1 execution/day |
| Email (Resend) | 3,000/month (free tier) | ~30-60 emails/month |

**All well within free limits!**

### Coverage

- ✅ GitHub repositories and gists
- ✅ Reddit posts and comments
- ✅ Google-indexed sites (if API configured)
- ✅ Automatic watermark extraction
- ✅ User identification
- ✅ Email notifications

---

## Email Notifications

### New Piracy Detected

You'll receive an email with:
- Platform and URL
- Confidence score (HIGH/MEDIUM/LOW)
- Watermark evidence (if found)
- Source user ID (if identified)
- One-click review link

### Daily Summary

Every morning you'll get:
- Number of new reports found
- Pending reports count
- DMCA requests submitted yesterday

---

## One-Click DMCA Workflow

1. **Email arrives** → Click "Review & Submit DMCA"
2. **Review page opens** → See all details
3. **Click "Submit DMCA"** → System generates and submits
4. **Done!** → Status tracked automatically

**Time per takedown:** ~30 seconds

---

## Admin Dashboard (Future Enhancement)

You can build a simple admin page at `/admin/piracy` to:
- View all reports
- Filter by status
- One-click DMCA submission
- See statistics

---

## Troubleshooting

### Google Search Not Working

**Symptom:** No Google results in reports

**Solution:**
1. Check API key and Engine ID are set
2. Verify API is enabled in Google Cloud Console
3. Check rate limits (100 queries/day)

### No Email Notifications

**Symptom:** Reports created but no emails

**Solution:**
1. Check `RESEND_API_KEY` is set
2. Check `ADMIN_EMAIL` or `RESEND_FROM_EMAIL` is set
3. Check Resend free tier limits (3,000/month)

### Cron Not Running

**Symptom:** No daily monitoring happening

**Solution:**
1. Check `vercel.json` is committed
2. Verify cron is configured in Vercel dashboard
3. Check `CRON_SECRET` is set
4. Manually trigger: `GET /api/cron/piracy-monitor` with Authorization header

---

## Advanced: Add More Free Platforms

### Google Alerts (Free)

1. Go to https://www.google.com/alerts
2. Create alerts for each product name
3. Set delivery to email
4. You'll get emails when Google finds new content

**Cost:** Free
**Manual Labor:** Just review emails

### RSS Feeds (Free)

Monitor RSS feeds from:
- Reddit subreddits
- GitHub releases
- Pastebin (if available)

**Cost:** Free
**Implementation:** Add RSS parser

---

## Success Metrics

**What to Expect:**
- ✅ Daily automated scans
- ✅ Email notifications within minutes of detection
- ✅ 5-10 minutes manual work per day (if piracy found)
- ✅ $0 monthly cost
- ✅ Coverage: GitHub, Reddit, Google-indexed sites

---

## Next Steps

1. **Set up Google Custom Search** (10 min) - Optional but recommended
2. **Set CRON_SECRET** in Vercel (2 min)
3. **Set ADMIN_EMAIL** in Vercel (1 min) - Optional
4. **Deploy** (5 min)
5. **Wait for first scan** (runs at 2 AM UTC daily)

**Total Setup Time:** ~20 minutes

---

**Last Updated:** January 27, 2026
**Status:** Ready to Deploy - 100% Free Solution

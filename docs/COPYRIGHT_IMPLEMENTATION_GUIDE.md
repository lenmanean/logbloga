# Copyright Protection Implementation Guide

## Quick Start

This guide explains how to use the copyright protection system that has been implemented.

## What's Been Implemented

### 1. ✅ Download Tracking
- Every file download is logged with:
  - User ID
  - IP address
  - User agent
  - Download token (unique per download)
  - Timestamp
  - Watermark data

**Location**: `lib/db/download-tracking.ts`

### 2. ✅ User-Specific Watermarking
- Markdown files: Hidden HTML comments with encoded watermark data
- Copyright notices added to all files
- Unique download tokens for tracking

**Location**: `lib/security/watermarking.ts`

### 3. ✅ Piracy Detection
- Watermark extraction from content
- Source user identification
- Suspicious activity detection

**Location**: `lib/piracy/monitoring.ts`

### 4. ✅ DMCA Takedown Automation
- Automated DMCA request generation
- Platform-specific handlers
- Request tracking

**Location**: `lib/piracy/dmca.ts`

### 5. ✅ Database Schema
- `download_logs` table for tracking
- `piracy_reports` table for infringement tracking
- `dmca_takedown_requests` table for takedown management

**Location**: `supabase/migrations/000040_download_tracking_and_watermarking.sql`

## How It Works

### Download Flow

1. User requests file download
2. System checks access (existing)
3. **NEW**: Generates unique download token
4. **NEW**: Creates watermark data (user ID, order ID, token)
5. **NEW**: Logs download to `download_logs` table
6. **NEW**: Applies watermark to Markdown files
7. File is served with tracking headers

### Watermarking

**Markdown Files**:
- Hidden HTML comment: `<!-- WATERMARK:[base64-encoded-data] -->`
- Copyright notice footer
- Invisible zero-width character encoding (optional)

**Binary Files** (PDF, ZIP):
- Metadata tracking in download logs
- Future: PDF watermarking with pdf-lib
- Future: ZIP file metadata

### Piracy Detection

**Automatic Detection**:
1. Monitor web platforms (when implemented)
2. Extract watermarks from found content
3. Identify source user from watermark
4. Create piracy report

**Manual Detection**:
1. Admin finds infringing content
2. Uses `identifyPiracySource()` to extract watermark
3. Creates piracy report via API

### DMCA Takedown

**Process**:
1. Piracy report created
2. Admin reviews and approves
3. DMCA request generated automatically
4. Submitted to platform (manual for now, automation coming)
5. Status tracked in database

## API Endpoints

### Admin: Monitor Piracy
```
POST /api/admin/piracy/monitor
```
Triggers automated monitoring scan.

**Response**:
```json
{
  "success": true,
  "reportsFound": 5,
  "reports": [...]
}
```

### Admin: Get Pending Reports
```
GET /api/admin/piracy/monitor
```
Returns all pending piracy reports.

### Admin: Submit DMCA Takedown
```
POST /api/admin/piracy/takedown
Body: { "reportId": "uuid" }
```
Submits DMCA takedown request for a piracy report.

## Database Queries

### Check Suspicious Activity
```typescript
import { detectSuspiciousActivity } from '@/lib/db/download-tracking';

const result = await detectSuspiciousActivity(userId);
// Returns: { isSuspicious: boolean, reasons: string[] }
```

### Get Download Stats
```typescript
import { getProductDownloadStats } from '@/lib/db/download-tracking';

const stats = await getProductDownloadStats(productId);
// Returns download statistics and suspicious count
```

### Identify Piracy Source
```typescript
import { identifyPiracySource } from '@/lib/piracy/monitoring';

const source = await identifyPiracySource(content);
// Returns user ID, order ID, download token if watermark found
```

## Next Steps

### Immediate Actions

1. **Run Migration**:
   ```bash
   # Apply the new migration
   supabase migration up
   ```

2. **Update Company Info**:
   - Edit `lib/piracy/dmca.ts`
   - Update `COMPANY_INFO` object with your details

3. **Test Download Tracking**:
   - Download a file
   - Check `download_logs` table
   - Verify watermark in Markdown files

### Short-term Enhancements

1. **PDF Watermarking**:
   - Install `pdf-lib`: `npm install pdf-lib`
   - Add PDF watermarking to download route

2. **Automated Monitoring**:
   - Set up Google Custom Search API
   - Configure web scraping (respect robots.txt)
   - Schedule daily monitoring scans

3. **DMCA Automation**:
   - Implement platform-specific APIs
   - Google DMCA API integration
   - GitHub DMCA API integration

4. **Admin Dashboard**:
   - Create UI for viewing piracy reports
   - DMCA request management interface
   - Download analytics dashboard

### Long-term Enhancements

1. **Advanced Watermarking**:
   - Steganography for images
   - PDF text watermarking
   - ZIP file metadata

2. **Legal Registration**:
   - Register copyrights with US Copyright Office
   - Store registration certificates
   - Link to DMCA requests

3. **Automated Follow-up**:
   - Track DMCA response deadlines
   - Automated follow-up emails
   - Counter-notification handling

## Monitoring Setup

### Scheduled Monitoring

Create a cron job or scheduled function:

```typescript
// Example: Vercel Cron Job
// vercel.json
{
  "crons": [{
    "path": "/api/admin/piracy/monitor",
    "schedule": "0 2 * * *" // Daily at 2 AM
  }]
}
```

### Manual Monitoring

Use the admin API endpoint:
```bash
curl -X POST https://your-domain.com/api/admin/piracy/monitor \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Legal Considerations

1. **Copyright Notice**: Already added to files
2. **Terms of Service**: Update to include anti-piracy clauses
3. **DMCA Agent**: Register with US Copyright Office
4. **Privacy**: Watermark data contains user info - handle carefully

## Cost Estimates

- **Copyright Registration**: $65-125 per work (one-time)
- **Google Custom Search API**: $5 per 1,000 queries
- **Monitoring Service**: $50-500/month (optional)
- **Legal Consultation**: As needed

## Support

For questions or issues:
- Review `docs/COPYRIGHT_PROTECTION.md` for strategy
- Check code comments in implementation files
- Consult legal counsel for DMCA questions

---

**Last Updated**: January 27, 2026

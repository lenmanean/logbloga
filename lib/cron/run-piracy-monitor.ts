/**
 * Shared logic for piracy monitoring cron.
 * Used by /api/cron/piracy-monitor and /api/cron/daily.
 */

import { monitorPiracyPlatforms, getPendingPiracyReports } from '@/lib/piracy/monitoring';
import { createServiceRoleClient } from '@/lib/supabase/server';

export type PiracyMonitorResult = {
  newReports: number;
  pendingReports: number;
  submittedToday: number;
};

export async function runPiracyMonitor(): Promise<PiracyMonitorResult> {
  const newReports = await monitorPiracyPlatforms();
  const pendingReports = await getPendingPiracyReports();
  const pendingCount = pendingReports.length;

  const supabase = await createServiceRoleClient();
  const today = new Date().toISOString().split('T')[0];
  const { count: submittedToday } = await supabase
    .from('dmca_takedown_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'submitted')
    .gte('submitted_at', `${today}T00:00:00Z`);

  // Auto-piracy email disabled for now
  // await notifyDailySummary(newReports.length, pendingCount, submittedToday || 0);

  return {
    newReports: newReports.length,
    pendingReports: pendingCount,
    submittedToday: submittedToday || 0,
  };
}

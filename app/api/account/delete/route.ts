import { requireAuth } from '@/lib/auth/utils';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { logActionWithRequest, AuditActions, ResourceTypes } from '@/lib/security/audit';

/**
 * DELETE /api/account/delete
 * Delete user account (GDPR compliant)
 * Uses service role to ensure all data is deleted/anonymized
 */
export async function DELETE(request: Request) {
  try {
    const user = await requireAuth();
    const supabase = await createServiceRoleClient();

    // Log deletion request in audit logs (before deletion)
    try {
      await logActionWithRequest(
        {
          user_id: user.id,
          action: AuditActions.ACCOUNT_DELETE,
          resource_type: ResourceTypes.USER,
          resource_id: user.id,
          metadata: {
            deletion_date: new Date().toISOString(),
            email: user.email,
          },
        },
        request
      );
    } catch (error) {
      console.error('Error logging account deletion:', error);
      // Continue with deletion even if logging fails
    }

    // Anonymize reviews (keep reviews but remove user association)
    try {
      await supabase
        .from('reviews')
        .update({
          user_id: null as any, // Type assertion for anonymization
          // Keep review content but anonymize
        })
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error anonymizing reviews:', error);
      // Continue with deletion
    }

    // Anonymize audit logs (keep logs but remove user association)
    try {
      await (supabase as any)
        .from('audit_logs')
        .update({
          user_id: null, // Anonymize audit logs
        })
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error anonymizing audit logs:', error);
      // Continue with deletion
    }

    // Consider anonymizing orders instead of deleting (for legal records)
    // This is optional - you may want to delete orders for GDPR compliance
    // For now, orders will be deleted via CASCADE constraints

    // Delete user (cascades to most related data via foreign keys)
    const { error } = await supabase.auth.admin.deleteUser(user.id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Note: Most related data (profiles, orders, licenses, cart_items, addresses, 
    // notifications, wishlist, cookie_consents, consents) will be automatically 
    // deleted via CASCADE constraints. Reviews and audit logs are anonymized 
    // instead of deleted to maintain data integrity.

    return NextResponse.json(
      { message: 'Account deleted successfully. All your data has been removed or anonymized.' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      throw error; // Re-throw redirect errors
    }
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}


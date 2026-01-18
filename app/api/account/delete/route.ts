import { requireAuth } from '@/lib/auth/utils';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * DELETE /api/account/delete
 * Delete user account (GDPR compliant)
 * Uses service role to ensure all data is deleted
 */
export async function DELETE() {
  try {
    const user = await requireAuth();
    const supabase = await createServiceRoleClient();

    // Delete user (cascades to all related data via foreign keys)
    const { error } = await supabase.auth.admin.deleteUser(user.id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Note: All related data (profiles, orders, licenses, etc.) 
    // will be automatically deleted via CASCADE constraints

    return NextResponse.json(
      { message: 'Account deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      throw error; // Re-throw redirect errors
    }
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}


/**
 * Contact submission database operations
 * Provides type-safe functions for managing contact form submissions in Supabase
 */

import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import type { ContactSubmission, ContactSubmissionInsert, ContactSubmissionUpdate } from '@/lib/types/database';

type ContactSubmissionStatus = ContactSubmission['status'];

/**
 * Create a new contact submission
 * Uses regular client for public inserts (RLS allows public inserts)
 */
export async function createContactSubmission(
  data: ContactSubmissionInsert
): Promise<ContactSubmission> {
  const supabase = await createClient();

  const { data: submission, error } = await supabase
    .from('contact_submissions')
    .insert({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      ip_address: data.ip_address || null,
      user_agent: data.user_agent || null,
      status: data.status || 'pending',
      spam_score: data.spam_score || 0,
      metadata: data.metadata || {},
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating contact submission:', error);
    throw new Error(`Failed to create contact submission: ${error.message}`);
  }

  return submission;
}

/**
 * Get a contact submission by ID
 * Uses service role client for admin access
 */
export async function getContactSubmission(id: string): Promise<ContactSubmission | null> {
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching contact submission:', error);
    throw new Error(`Failed to fetch contact submission: ${error.message}`);
  }

  return data;
}

/**
 * Get all contact submissions with optional filtering
 * Uses service role client for admin access
 */
export interface ContactSubmissionQueryOptions {
  status?: ContactSubmissionStatus;
  email?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'created_at' | 'updated_at' | 'status';
  orderDirection?: 'asc' | 'desc';
}

export async function getContactSubmissions(
  options?: ContactSubmissionQueryOptions
): Promise<ContactSubmission[]> {
  const supabase = await createServiceRoleClient();

  let query = supabase
    .from('contact_submissions')
    .select('*');

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.email) {
    query = query.eq('email', options.email);
  }

  if (options?.orderBy) {
    query = query.order(options.orderBy, {
      ascending: options.orderDirection !== 'desc',
    });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset !== undefined) {
    const limit = options.limit || 10;
    query = query.range(options.offset, options.offset + limit - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching contact submissions:', error);
    throw new Error(`Failed to fetch contact submissions: ${error.message}`);
  }

  return data || [];
}

/**
 * Update contact submission status
 * Uses service role client for admin access
 */
export async function updateContactSubmissionStatus(
  id: string,
  status: ContactSubmissionStatus
): Promise<void> {
  const supabase = await createServiceRoleClient();

  const { error } = await supabase
    .from('contact_submissions')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating contact submission status:', error);
    throw new Error(`Failed to update contact submission status: ${error.message}`);
  }
}

/**
 * Update contact submission (general update function)
 * Uses service role client for admin access
 */
export async function updateContactSubmission(
  id: string,
  updates: ContactSubmissionUpdate
): Promise<ContactSubmission> {
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase
    .from('contact_submissions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating contact submission:', error);
    throw new Error(`Failed to update contact submission: ${error.message}`);
  }

  return data;
}

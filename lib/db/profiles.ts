/**
 * Profile database operations
 * Provides type-safe functions for querying and updating user profiles
 */

import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/lib/types/database';

/**
 * Get user profile by user ID
 */
export async function getUserProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching profile:', error);
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }

  return data;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<Profile | null> {
  const supabase = await createClient();

  // Ensure we're only updating the current user's profile
  if (updates.id && updates.id !== userId) {
    throw new Error('Cannot update another user\'s profile');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  return data;
}

/**
 * Upload avatar to Supabase Storage
 * Returns the public URL of the uploaded avatar
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const supabase = await createClient();

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
  }

  // Validate file size (2MB limit)
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    throw new Error('File size too large. Please upload an image smaller than 2MB.');
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  // Upload file to avatars bucket
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Error uploading avatar:', uploadError);
    throw new Error(`Failed to upload avatar: ${uploadError.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  // Update profile with new avatar URL
  await updateUserProfile(userId, {
    avatar_url: publicUrl,
  });

  return publicUrl;
}

/**
 * Delete avatar from Supabase Storage
 */
export async function deleteAvatar(userId: string): Promise<void> {
  const supabase = await createClient();

  // Get current profile to find avatar URL
  const profile = await getUserProfile(userId);

  if (!profile?.avatar_url) {
    return; // No avatar to delete
  }

  // Extract file path from URL
  const url = new URL(profile.avatar_url);
  const pathParts = url.pathname.split('/');
  const fileName = pathParts[pathParts.length - 2] + '/' + pathParts[pathParts.length - 1];

  // Delete file from storage
  const { error: deleteError } = await supabase.storage
    .from('avatars')
    .remove([fileName]);

  if (deleteError) {
    console.error('Error deleting avatar:', deleteError);
    // Don't throw - we can still update the profile
  }

  // Update profile to remove avatar URL
  await updateUserProfile(userId, {
    avatar_url: null,
  });
}


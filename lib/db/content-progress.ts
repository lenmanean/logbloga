/**
 * Content progress database operations
 * Tracks user progress through package level components (manual completion)
 */

import { createServiceRoleClient } from '@/lib/supabase/server';
import type { LevelComponent } from '@/lib/utils/content';

export interface ContentProgress {
  id: string;
  user_id: string;
  product_id: string;
  level: 1 | 2 | 3;
  component: LevelComponent;
  completed_at: string;
  created_at: string;
}

export interface ProgressMap {
  level1: {
    implementation_plan: boolean;
    platform_guides: boolean;
    creative_frameworks: boolean;
    templates: boolean;
    launch_marketing: boolean;
    troubleshooting: boolean;
    planning: boolean;
  };
  level2: {
    implementation_plan: boolean;
    platform_guides: boolean;
    creative_frameworks: boolean;
    templates: boolean;
    launch_marketing: boolean;
    troubleshooting: boolean;
    planning: boolean;
  };
  level3: {
    implementation_plan: boolean;
    platform_guides: boolean;
    creative_frameworks: boolean;
    templates: boolean;
    launch_marketing: boolean;
    troubleshooting: boolean;
    planning: boolean;
  };
}

/**
 * Get all progress for a user and product
 * Returns a structured map of level -> component -> completed status
 */
export async function getProgress(
  userId: string,
  productId: string
): Promise<ProgressMap> {
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase
    .from('content_progress')
    .select('level, component')
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) {
    console.error('Error fetching content progress:', error);
    throw new Error(`Failed to fetch content progress: ${error.message}`);
  }

  const progress: ProgressMap = {
    level1: {
      implementation_plan: false,
      platform_guides: false,
      creative_frameworks: false,
      templates: false,
      launch_marketing: false,
      troubleshooting: false,
      planning: false,
    },
    level2: {
      implementation_plan: false,
      platform_guides: false,
      creative_frameworks: false,
      templates: false,
      launch_marketing: false,
      troubleshooting: false,
      planning: false,
    },
    level3: {
      implementation_plan: false,
      platform_guides: false,
      creative_frameworks: false,
      templates: false,
      launch_marketing: false,
      troubleshooting: false,
      planning: false,
    },
  };

  if (data) {
    for (const entry of data) {
      const levelKey = `level${entry.level}` as keyof ProgressMap;
      const component = entry.component as LevelComponent;
      if (progress[levelKey] && component in progress[levelKey]) {
        progress[levelKey][component] = true;
      }
    }
  }

  return progress;
}

/**
 * Upsert progress for a specific level and component
 * Creates a new entry or updates completed_at if already exists
 */
export async function upsertProgress(
  userId: string,
  productId: string,
  level: 1 | 2 | 3,
  component: LevelComponent
): Promise<ContentProgress> {
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase
    .from('content_progress')
    .upsert(
      {
        user_id: userId,
        product_id: productId,
        level,
        component,
        completed_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,product_id,level,component',
        ignoreDuplicates: false,
      }
    )
    .select()
    .single();

  if (error) {
    console.error('Error upserting content progress:', error);
    throw new Error(`Failed to record progress: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to record progress: no data returned');
  }

  return {
    ...data,
    level: data.level as 1 | 2 | 3,
    component: data.component as LevelComponent,
  };
}

/**
 * Delete progress for a specific level and component
 * Removes the completion entry for the user
 */
export async function deleteProgress(
  userId: string,
  productId: string,
  level: 1 | 2 | 3,
  component: LevelComponent
): Promise<void> {
  const supabase = await createServiceRoleClient();

  const { error } = await supabase
    .from('content_progress')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)
    .eq('level', level)
    .eq('component', component);

  if (error) {
    console.error('Error deleting content progress:', error);
    throw new Error(`Failed to delete progress: ${error.message}`);
  }
}

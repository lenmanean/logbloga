import type { User } from '@supabase/supabase-js';

/**
 * Create a test user
 */
export function createTestUser(overrides?: Partial<User>): User {
  return {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'test@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {
      full_name: 'Test User',
    },
    aud: 'authenticated',
    confirmation_sent_at: null,
    recovery_sent_at: null,
    email_confirmed_at: new Date().toISOString(),
    invited_at: null,
    action_link: null,
    email_change_sent_at: null,
    new_email: null,
    new_phone: null,
    phone: null,
    phone_confirmed_at: null,
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    is_anonymous: false,
    ...overrides,
  } as User;
}

/**
 * Create a test admin user
 */
export function createTestAdminUser(overrides?: Partial<User>): User {
  return createTestUser({
    id: '00000000-0000-0000-0000-000000000002',
    email: 'admin@example.com',
    user_metadata: {
      full_name: 'Admin User',
      role: 'admin',
    },
    ...overrides,
  });
}

/**
 * Create a test session
 */
export function createTestSession(user?: User) {
  const testUser = user || createTestUser();
  return {
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user: testUser,
  };
}

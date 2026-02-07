import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '@/app/api/chat/route';
import { createMockSupabaseClient } from '@/__tests__/utils/mocks/supabase';

const mockGetUser = vi.fn();
const mockClient = createMockSupabaseClient();
(mockClient as any).auth = {
  ...(mockClient as any).auth,
  getUser: mockGetUser,
};

vi.mock('@/lib/supabase/server', async () => {
  const actual = await vi.importActual('@/lib/supabase/server');
  return {
    ...actual,
    createClient: vi.fn(() => mockClient),
    createServiceRoleClient: vi.fn(() => createMockSupabaseClient()),
  };
});

const mockUserHasAnyPackageAccess = vi.fn();
vi.mock('@/lib/db/access', () => ({
  userHasAnyPackageAccess: mockUserHasAnyPackageAccess,
  getOwnedPackageSlugs: vi.fn().mockResolvedValue([]),
}));

vi.mock('@/lib/chat/knowledge-retrieval', () => ({
  retrieveKnowledgeContext: vi.fn().mockResolvedValue(''),
}));

vi.mock('@/lib/chat/system-prompt', () => ({
  buildSystemPrompt: vi.fn().mockReturnValue(''),
}));

vi.mock('@/lib/chat/openai-client', () => ({
  createChatCompletion: vi.fn().mockResolvedValue('Hi'),
}));

vi.mock('@/lib/security/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((_req: Request, _opts: unknown, handler: () => Promise<Response>) => handler()),
}));

describe('POST /api/chat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when user is not signed in', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'What packages do you have?' }],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.code).toBe('UNAUTHORIZED');
    expect(data.error).toContain('Sign in');
    expect(mockUserHasAnyPackageAccess).not.toHaveBeenCalled();
  });

  it('returns 403 when user is signed in but has no package purchase', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    });
    mockUserHasAnyPackageAccess.mockResolvedValue(false);

    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'What packages do you have?' }],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.code).toBe('FORBIDDEN');
    expect(data.error).toContain('Purchase a package');
    expect(mockUserHasAnyPackageAccess).toHaveBeenCalledWith('user-123');
  });
});

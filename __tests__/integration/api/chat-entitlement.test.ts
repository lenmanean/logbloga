import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET } from '@/app/api/chat/entitlement/route';
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
  };
});

const mockUserHasAnyPackageAccess = vi.fn();
vi.mock('@/lib/db/access', () => ({
  userHasAnyPackageAccess: mockUserHasAnyPackageAccess,
}));

describe('GET /api/chat/entitlement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when user is not signed in', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.code).toBe('UNAUTHORIZED');
    expect(mockUserHasAnyPackageAccess).not.toHaveBeenCalled();
  });

  it('returns canUse: true when user has package access', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    });
    mockUserHasAnyPackageAccess.mockResolvedValue(true);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.canUse).toBe(true);
    expect(mockUserHasAnyPackageAccess).toHaveBeenCalledWith('user-123');
  });

  it('returns canUse: false when user has no package access', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-456' } },
      error: null,
    });
    mockUserHasAnyPackageAccess.mockResolvedValue(false);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.canUse).toBe(false);
  });
});

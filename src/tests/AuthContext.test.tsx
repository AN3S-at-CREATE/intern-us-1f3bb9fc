import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock Supabase client
const mockSupabase = {
  auth: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  },
  from: vi.fn(),
};

// Mock the module
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(),
  },
}));

// We need to retrieve the mock to spy on it in tests
import { supabase } from '@/integrations/supabase/client';
// Cast to any for easy mocking access
const mockSupabaseClient = supabase as any;

const TestComponent = () => {
  const { loading, user, profile } = useAuth();
  return (
    <div>
      <div data-testid="loading">Loading: {loading.toString()}</div>
      <div data-testid="user">{user ? 'User' : 'No User'}</div>
      <div data-testid="profile">{profile ? 'Profile' : 'No Profile'}</div>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('waits for profile fetch before setting loading to false', async () => {
    // mock getSession
    const mockSession = { user: { id: 'user1' } };
    mockSupabaseClient.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    // mock fetchProfile with delay
    let resolveProfile: any;
    const profilePromise = new Promise(resolve => { resolveProfile = resolve; });

    mockSupabaseClient.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue(profilePromise), // returning promise that we control
        }),
      }),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initial state
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading: true');

    // getSession resolves immediately, but fetchProfile is pending.
    // We wait for getSession promise to be handled.
    await waitFor(() => expect(mockSupabaseClient.auth.getSession).toHaveBeenCalled());

    // Wait a bit more to ensure the .then() block has started executing and blocked on await fetchProfile
    await new Promise(r => setTimeout(r, 10));

    // Should STILL be loading because profile is pending
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading: true');

    // Now resolve profile
    resolveProfile({ data: { id: 'p1', role: 'student' }, error: null });

    // Now loading should become false
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('Loading: false'));
    expect(screen.getByTestId('profile')).toHaveTextContent('Profile');
  });

  it('sets loading to false if no session', async () => {
    mockSupabaseClient.auth.getSession.mockResolvedValue({ data: { session: null } });
    mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('Loading: false'));
    expect(screen.getByTestId('user')).toHaveTextContent('No User');
  });
});

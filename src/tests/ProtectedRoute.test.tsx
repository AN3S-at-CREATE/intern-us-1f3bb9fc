import { render, screen, waitFor } from '@testing-library/react';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AuthProvider } from '../contexts/AuthContext';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';

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
// Cast to a loosely typed mock object for easy mocking access
const mockSupabaseClient = supabase as unknown as {
  auth: { getSession: Mock; onAuthStateChange: Mock };
  from: Mock;
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to signin if user is not authenticated', async () => {
    // Mock no user
    mockSupabaseClient.auth.getSession.mockResolvedValue({ data: { session: null } });
    mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/signin" element={<div>Sign In Page</div>} />
            <Route path="/protected" element={<ProtectedRoute><div>Protected Content</div></ProtectedRoute>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    expect(screen.getByText('Sign In Page')).toBeInTheDocument();
  });

  it('renders children if user is authenticated and no roles required', async () => {
    // Mock authenticated user
    const mockUser = { id: 'user1', email: 'test@example.com' };
    const mockSession = { user: mockUser };

    mockSupabaseClient.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    // Mock profile fetch
    mockSupabaseClient.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { role: 'student' }, error: null }),
        }),
      }),
    });

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/protected" element={<ProtectedRoute><div>Protected Content</div></ProtectedRoute>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText('Protected Content')).toBeInTheDocument());
  });

  it('redirects if user has wrong role', async () => {
    // Mock authenticated user with student role
    const mockUser = { id: 'user1', email: 'test@example.com' };
    const mockSession = { user: mockUser };

    mockSupabaseClient.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    // Mock profile fetch
    mockSupabaseClient.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { role: 'student' }, error: null }),
        }),
      }),
    });

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/employer/dashboard']}>
          <Routes>
            <Route path="/dashboard" element={<div>Student Dashboard</div>} />
            <Route path="/employer/dashboard" element={
              <ProtectedRoute allowedRoles={['employer']}>
                <div>Employer Dashboard</div>
              </ProtectedRoute>
            } />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText('Student Dashboard')).toBeInTheDocument());
  });

  // Reproduction of the bug: Profile missing but loading is false
  it('prevents access if profile is missing even if user is authenticated', async () => {
    // Mock authenticated user
    const mockUser = { id: 'user1', email: 'test@example.com' };
    const mockSession = { user: mockUser };

    mockSupabaseClient.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    // Mock profile fetch returning null (e.g., error or not found)
    mockSupabaseClient.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
        }),
      }),
    });

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/employer/dashboard']}>
          <Routes>
            <Route path="/signin" element={<div>Sign In Page</div>} />
             <Route path="/dashboard" element={<div>Student Dashboard</div>} />
            <Route path="/employer/dashboard" element={
              <ProtectedRoute allowedRoles={['employer']}>
                <div>Employer Dashboard</div>
              </ProtectedRoute>
            } />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    // CURRENT BEHAVIOR (Bug): It renders Employer Dashboard because profile is null, so check is skipped
    // EXPECTED BEHAVIOR: It should redirect or show error

    // With current buggy code:
    // if (allowedRoles && profile && !allowedRoles.includes(profile.role))
    // allowedRoles=['employer'], profile=null. Condition is false.
    // Returns children -> Employer Dashboard.

    await waitFor(() => {
        expect(screen.queryByText('Employer Dashboard')).not.toBeInTheDocument();
        // It shows "Profile Not Found" error state
        expect(screen.getByText('Profile Not Found')).toBeInTheDocument();
    });
  });
});

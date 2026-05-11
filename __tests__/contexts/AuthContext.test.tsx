import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import * as authApi from '@/lib/api/auth';
import { vi } from 'vitest';

vi.mock('@/lib/api/auth', () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
}));

const TestComponent = () => {
  const { user, login, register, logout, isAuthenticated } = useAuth();
  
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'logged-in' : 'logged-out'}</div>
      <div data-testid="user-email">{user?.email}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={() => register('testuser', 'test@example.com', 'password')}>Register</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('provides default logged out state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-out');
  });

  it('logs in successfully and updates state', async () => {
    const mockUser = { user_id: 1, email: 'test@example.com', username: 'testuser', role: 'user', reputation_score: 0 };
    vi.mocked(authApi.signIn).mockResolvedValueOnce({ access_token: 'fake-token', user: mockUser });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText('Login').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-in');
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
      expect(localStorage.getItem('access_token')).toBe('fake-token');
      expect(localStorage.getItem('user')).toEqual(JSON.stringify(mockUser));
    });
  });

  it('logs out successfully, clears state and reloads page', async () => {
    // Set initial state
    const mockUser = { user_id: 1, email: 'test@example.com', username: 'testuser', role: 'user', reputation_score: 0 };
    localStorage.setItem('access_token', 'fake-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    vi.mocked(authApi.signOut).mockResolvedValueOnce(true);

    const originalLocation = window.location;
    // @ts-ignore
    delete window.location;
    window.location = { ...originalLocation, reload: vi.fn() };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-in');

    act(() => {
      screen.getByText('Logout').click();
    });

    await waitFor(() => {
      // We expect the UI state to *not* change to logged-out to prevent flicker before reload
      expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-in');
      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(window.location.reload).toHaveBeenCalled();
    });

    window.location = originalLocation;
  });
  
  it('loads state from local storage on mount', () => {
    const mockUser = { user_id: 1, email: 'test@example.com', username: 'testuser', role: 'user', reputation_score: 0 };
    localStorage.setItem('access_token', 'fake-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-in');
    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
  });
});

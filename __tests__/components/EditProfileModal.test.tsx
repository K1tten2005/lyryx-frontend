import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EditProfileModal from '@/components/EditProfileModal';
import { updateUserProfile, updateUserAvatar } from '@/lib/api/user';
import { useAuth } from '@/contexts/AuthContext';

vi.mock('@/lib/api/user', () => ({
  updateUserProfile: vi.fn(),
  updateUserAvatar: vi.fn(),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    token: 'test-token',
    user: { user_id: 1, username: 'testuser', email: 'test@example.com', bio: 'old bio' },
    updateUser: vi.fn(),
    refreshAuth: vi.fn(),
  })),
}));

describe('EditProfileModal', () => {
  const mockOnClose = vi.fn();
  const initialUser = { user_id: 1, username: 'testuser', email: 'test@example.com', bio: 'old bio' } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      token: 'test-token',
      user: initialUser,
      updateUser: vi.fn(),
      refreshAuth: vi.fn(),
    } as any);
  });

  it('renders correctly with initial values', () => {
    render(<EditProfileModal isOpen={true} onClose={mockOnClose} user={initialUser} />);
    
    expect(screen.getByLabelText(/name/i)).toHaveValue(initialUser.username);
    expect(screen.getByLabelText(/email/i)).toHaveValue(initialUser.email);
    expect(screen.getByLabelText(/bio/i)).toHaveValue(initialUser.bio);
  });

  it('calls updateUserProfile and onClose on successful submission', async () => {
    (updateUserProfile as any).mockResolvedValue({ ...initialUser, username: 'newname' });
    
    render(<EditProfileModal isOpen={true} onClose={mockOnClose} user={initialUser} />);
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'newname' } });
    fireEvent.submit(screen.getByRole('button', { name: /save changes/i }));
    
    await waitFor(() => {
      expect(updateUserProfile).toHaveBeenCalledWith('test-token', expect.objectContaining({
        username: 'newname',
      }));
    });
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows error message on submission failure', async () => {
    (updateUserProfile as any).mockRejectedValue(new Error('Update failed'));
    
    render(<EditProfileModal isOpen={true} onClose={mockOnClose} user={initialUser} />);
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'newname' } });
    fireEvent.submit(screen.getByRole('button', { name: /save changes/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/update failed/i)).toBeInTheDocument();
    });
  });

  it('validates inputs client-side', async () => {
    render(<EditProfileModal isOpen={true} onClose={mockOnClose} user={initialUser} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.submit(screen.getByRole('button', { name: /save changes/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
    
    expect(updateUserProfile).not.toHaveBeenCalled();
  });

  it('retries update with new token if original token is expired', async () => {
    const mockRefreshAuth = vi.fn().mockResolvedValue('new-token');
    vi.mocked(useAuth).mockReturnValue({
      token: 'old-token',
      user: initialUser,
      updateUser: vi.fn(),
      refreshAuth: mockRefreshAuth,
    } as any);

    (updateUserProfile as any)
      .mockRejectedValueOnce(new Error('invalid or expired jwt'))
      .mockResolvedValueOnce({ ...initialUser, username: 'newname' });

    render(<EditProfileModal isOpen={true} onClose={mockOnClose} user={initialUser} />);
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'newname' } });
    fireEvent.submit(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(mockRefreshAuth).toHaveBeenCalled();
      expect(updateUserProfile).toHaveBeenCalledTimes(2);
      expect(updateUserProfile).toHaveBeenLastCalledWith('new-token', expect.any(Object));
    });
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles avatar file selection and upload', async () => {
    (updateUserAvatar as any).mockResolvedValue({ avatar_url: 'http://example.com/new-avatar.jpg' });
    
    render(<EditProfileModal isOpen={true} onClose={mockOnClose} user={initialUser} />);
    
    const file = new File(['hello'], 'avatar.png', { type: 'image/png' });
    const input = screen.getByLabelText(/change avatar/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.submit(screen.getByRole('button', { name: /save changes/i }));
    
    await waitFor(() => {
      expect(updateUserAvatar).toHaveBeenCalledWith('test-token', file);
    });
  });
});

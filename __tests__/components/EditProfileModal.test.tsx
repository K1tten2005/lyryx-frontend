import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EditProfileModal from '@/components/EditProfileModal';
import { updateUserProfile } from '@/lib/api/user';

vi.mock('@/lib/api/user', () => ({
  updateUserProfile: vi.fn(),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    token: 'test-token',
    user: { user_id: 1, username: 'testuser', email: 'test@example.com', bio: 'old bio' },
    updateUser: vi.fn(),
  }),
}));

describe('EditProfileModal', () => {
  const mockOnClose = vi.fn();
  const initialUser = { user_id: 1, username: 'testuser', email: 'test@example.com', bio: 'old bio' } as any;

  beforeEach(() => {
    vi.clearAllMocks();
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
});

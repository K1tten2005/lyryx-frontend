import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserDropdown from '@/components/UserDropdown';
import { useAuth } from '@/contexts/AuthContext';
import { vi } from 'vitest';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('UserDropdown', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user without avatar correctly (shows fallback icon)', () => {
    (useAuth as any).mockReturnValue({
      user: { username: 'testuser', reputation_score: 42 },
      logout: mockLogout,
    });

    render(<UserDropdown />);
    
    expect(screen.getByText('42 RS')).toBeInTheDocument();
    // Assuming fallback icon has a generic testid or we can check by image absence
    const img = screen.queryByRole('img');
    expect(img).not.toBeInTheDocument();
  });

  it('renders user with avatar correctly', () => {
    (useAuth as any).mockReturnValue({
      user: { username: 'testuser', reputation_score: 100, avatar_url: 'http://example.com/avatar.png' },
      logout: mockLogout,
    });

    render(<UserDropdown />);
    
    expect(screen.getByText('100 RS')).toBeInTheDocument();
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src');
    // next/image might rewrite src, so we just check it exists and has alt
    expect(img).toHaveAttribute('alt', 'testuser avatar');
  });

  it('toggles dropdown on click', () => {
    (useAuth as any).mockReturnValue({
      user: { username: 'testuser', reputation_score: 10 },
      logout: mockLogout,
    });

    render(<UserDropdown />);
    
    // Initially menu is not visible
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    // Click to open
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Menu should be visible
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();

    // Click to close
    fireEvent.click(button);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', () => {
    (useAuth as any).mockReturnValue({
      user: { username: 'testuser', reputation_score: 10 },
      logout: mockLogout,
    });

    render(
      <div>
        <div data-testid="outside">Outside</div>
        <UserDropdown />
      </div>
    );
    
    // Open menu
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('calls logout when logout button is clicked', () => {
    (useAuth as any).mockReturnValue({
      user: { username: 'testuser', reputation_score: 10 },
      logout: mockLogout,
    });

    render(<UserDropdown />);
    
    // Open menu
    fireEvent.click(screen.getByRole('button'));
    
    // Click logout
    fireEvent.click(screen.getByText('Logout'));
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('renders Profile button as a link to user profile', () => {
    (useAuth as any).mockReturnValue({
      user: { user_id: 123, username: 'testuser', reputation_score: 10 },
      logout: mockLogout,
    });

    render(<UserDropdown />);
    
    // Open menu
    fireEvent.click(screen.getByRole('button'));
    
    const profileLink = screen.getByRole('menuitem', { name: /profile/i });
    expect(profileLink).toHaveAttribute('href', '/user/123');
    expect(profileLink.tagName).toBe('A');
  });
});

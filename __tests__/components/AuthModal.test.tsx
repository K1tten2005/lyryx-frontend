import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthModal from '@/components/AuthModal';

import { vi } from 'vitest';

// Mock the child forms so we don't need to deal with their complexity here
vi.mock('@/components/LoginForm', () => {
  return {
    default: function MockLoginForm({ onSuccess }: { onSuccess: () => void }) {
      return <div data-testid="login-form"><button onClick={onSuccess}>Login Success</button></div>;
    }
  };
});

vi.mock('@/components/RegisterForm', () => {
  return {
    default: function MockRegisterForm({ onSuccess }: { onSuccess: () => void }) {
      return <div data-testid="register-form"><button onClick={onSuccess}>Register Success</button></div>;
    }
  };
});

describe('AuthModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders login form by default', () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByText(/Вход/i)).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(<AuthModal isOpen={false} onClose={mockOnClose} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('toggles to register form when "Sign up" is clicked', () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Зарегистрироваться/i }));
    
    expect(screen.getByTestId('register-form')).toBeInTheDocument();
    expect(screen.getByText(/Регистрация/i)).toBeInTheDocument();
  });

  it('toggles back to login form when "Sign in" is clicked', () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} />);
    
    // switch to register
    fireEvent.click(screen.getByRole('button', { name: /Зарегистрироваться/i }));
    // switch back
    fireEvent.click(screen.getByRole('button', { name: /Войти/i }));
    
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('calls onClose when form indicates success', () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByText('Login Success'));
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

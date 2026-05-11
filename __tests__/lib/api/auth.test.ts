import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signIn, signUp, signOut } from '@/lib/api/auth';

describe('Auth API client', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('signIn', () => {
    it('should call sign-in endpoint and return data on success', async () => {
      const mockResponse = { access_token: 'test-token', user: { id: 1, email: 'test@example.com' } };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await signIn('test@example.com', 'password123');
      
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/v1/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
        credentials: 'include',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error on API failure', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid credentials' }),
      });

      await expect(signIn('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('signUp', () => {
    it('should call sign-up endpoint and return data on success', async () => {
      const mockResponse = { access_token: 'test-token', user: { id: 1, email: 'test@example.com' } };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await signUp('testuser', 'test@example.com', 'password123');
      
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/v1/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'testuser', email: 'test@example.com', password: 'password123' }),
        credentials: 'include',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('signOut', () => {
    it('should call sign-out endpoint successfully', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
      });

      await signOut('test-token');
      
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/v1/auth/sign-out', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        credentials: 'include',
      });
    });
  });
});

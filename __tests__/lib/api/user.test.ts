import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserProfile, getUserAnnotations } from '@/lib/api/user';

describe('User API client', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getUserProfile', () => {
    it('should fetch user profile by ID', async () => {
      const mockUser = { user_id: 1, username: 'testuser', email: 'test@example.com', role: 'user', reputation_score: 100 };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockUser),
      });

      const result = await getUserProfile(1);
      
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/v1/user/1', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw error when user not found', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: 'User not found' }),
      });

      await expect(getUserProfile(999)).rejects.toThrow('User not found');
    });
  });

  describe('getUserAnnotations', () => {
    it('should fetch user annotations by user ID', async () => {
      const mockAnnotations = {
        user_id: 1,
        annotations: [
          { id: 101, content: 'Nice song', song: { title: 'Song 1' } }
        ],
        total: 1,
        has_more: false
      };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockAnnotations),
      });

      const result = await getUserAnnotations(1);
      
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/v1/user/1/annotations?limit=20&offset=0', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(mockAnnotations);
    });

    it('should support pagination', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ annotations: [], total: 0, has_more: false }),
      });

      await getUserAnnotations(1, 10, 20);
      
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/v1/user/1/annotations?limit=10&offset=20', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
    });
  });
});

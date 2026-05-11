import { describe, it, expect } from 'vitest';
import { profileEditSchema } from '@/lib/validation/profile';

describe('profileEditSchema', () => {
  it('should validate valid data', () => {
    const validData = {
      username: 'newname',
      bio: 'This is a new bio',
      email: 'new@example.com',
    };
    const result = profileEditSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should allow optional password', () => {
    const validData = {
      username: 'newname',
      password: 'newpassword123',
    };
    const result = profileEditSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail on invalid email', () => {
    const invalidData = {
      email: 'not-an-email',
    };
    const result = profileEditSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should fail on too short password', () => {
    const invalidData = {
      password: '123',
    };
    const result = profileEditSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should fail on too long bio', () => {
    const invalidData = {
      bio: 'a'.repeat(501),
    };
    const result = profileEditSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should require at least one field or allow empty object if it is partial', () => {
    // Actually, usually we allow empty if it's for partial updates, 
    // but the schema should at least validate what's there.
    const result = profileEditSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

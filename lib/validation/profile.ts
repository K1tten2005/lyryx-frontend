import { z } from 'zod';

export const profileEditSchema = z.object({
  username: z.string().min(2, 'Name must be at least 2 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').or(z.literal('')).optional(),
  confirmPassword: z.string().or(z.literal('')).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type ProfileEditInput = z.infer<typeof profileEditSchema>;

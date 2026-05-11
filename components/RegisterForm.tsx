'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_.]{3,30}$/, 'Username can only contain letters, numbers, underscores, and dots'),
  email: z.string().email('Invalid email address').max(254, 'Email too long'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72, 'Password must be less than 72 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register: registerAuth } = useAuth();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setGlobalError(null);
    try {
      await registerAuth(data.username, data.email, data.password);
      toast.success('Account created successfully!');
      onSuccess();
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setGlobalError('Unable to connect to the server. Please try again later.');
      } else {
        setGlobalError(err.message || 'An error occurred during registration.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {globalError && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {globalError}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-bold text-foreground mb-1 uppercase tracking-wider">
          Username
        </label>
        <input
          type="text"
          placeholder="yourusername"
          {...register('username')}
          className="input-primary"
        />
        {errors.username && (
          <p className="mt-1 text-sm font-bold text-red-500">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-bold text-foreground mb-1 uppercase tracking-wider">
          Email
        </label>
        <input
          type="email"
          placeholder="your@email.com"
          {...register('email')}
          className="input-primary"
        />
        {errors.email && (
          <p className="mt-1 text-sm font-bold text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-bold text-foreground mb-1 uppercase tracking-wider">
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          {...register('password')}
          className="input-primary"
        />
        {errors.password && (
          <p className="mt-1 text-sm font-bold text-red-500">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary"
      >
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address').max(254, 'Email too long'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72, 'Password must be less than 72 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setGlobalError(null);
    try {
      await login(data.email, data.password);
      toast.success('Successfully logged in!');
      onSuccess();
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setGlobalError('Unable to connect to the server. Please try again later.');
      } else {
        setGlobalError(err.message || 'An error occurred during login.');
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
          Пароль
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
        className="w-full flex items-center justify-center py-2.5 px-8 bg-accent text-white font-bold rounded-full shadow-md border border-white/20 hover:bg-accent-hover active:scale-95 transition-all disabled:opacity-50"
      >
        {isSubmitting ? 'Вход...' : 'Войти'}
      </button>
    </form>
  );
}

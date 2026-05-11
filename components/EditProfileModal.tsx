'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileEditSchema, ProfileEditInput } from '@/lib/validation/profile';
import { updateUserProfile, updateUserAvatar, UserProfile } from '@/lib/api/user';
import { useAuth } from '@/contexts/AuthContext';
import { X, Loader2, User, Mail, FileText, Lock, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export default function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
  const { token, updateUser, refreshAuth } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileEditInput>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      bio: user.bio || '',
    },
  });

  if (!isOpen) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileEditInput) => {
    if (!token) return;

    setIsSubmitting(true);
    setError(null);

    const performUpdate = async (authToken: string) => {
      // 1. Handle Profile Info Update
      const submitData: any = {};
      if (data.username && data.username !== user.username) submitData.username = data.username;
      if (data.email && data.email !== user.email) submitData.email = data.email;
      if (data.bio !== undefined && data.bio !== (user.bio || '')) submitData.bio = data.bio;
      if (data.password) submitData.password = data.password;

      let latestUser = user;
      if (Object.keys(submitData).length > 0) {
        latestUser = await updateUserProfile(authToken, submitData);
      }

      // 2. Handle Avatar Update
      if (avatarFile) {
        const { avatar_url } = await updateUserAvatar(authToken, avatarFile);
        latestUser = { ...latestUser, avatar_url };
      }

      return latestUser;
    };

    try {
      try {
        const updatedUser = await performUpdate(token);
        updateUser(updatedUser as any);
        toast.success('Profile updated successfully');
        onClose();
      } catch (err: any) {
        // If expired/unauthorized, try refreshing once
        if (err.message.toLowerCase().includes('expired') || err.message.toLowerCase().includes('invalid')) {
          const newToken = await refreshAuth();
          if (newToken) {
            const updatedUser = await performUpdate(newToken);
            updateUser(updatedUser as any);
            toast.success('Profile updated successfully');
            onClose();
            return;
          }
        }
        throw err;
      }
    } catch (err: any) {
      const msg = err.message || 'Failed to update profile';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-surface bg-glass-panel backdrop-blur-md rounded-3xl border border-white/50 shadow-glass overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/40">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight drop-shadow-sm">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/50 text-slate-500 transition-all shadow-inner-glow"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-100 border-2 border-zinc-200">
                  {avatarPreview || user.avatar_url ? (
                    <img
                      src={avatarPreview || user.avatar_url}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                      <User className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity rounded-full"
                >
                  <Camera className="w-6 h-6" />
                  <span className="sr-only">Change avatar</span>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <p className="mt-2 text-xs text-zinc-500 text-center">
                Click photo to change avatar
              </p>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-zinc-700 mb-1">
                Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  {...register('username')}
                  id="username"
                  type="text"
                  className="input-primary pl-10"
                  placeholder="Your name"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  className="input-primary pl-10"
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-zinc-700 mb-1">
                Bio
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none text-zinc-400">
                  <FileText className="w-4 h-4" />
                </div>
                <textarea
                  {...register('bio')}
                  id="bio"
                  rows={3}
                  className="input-primary pl-10 resize-none"
                  placeholder="Tell us about yourself"
                />
              </div>
              {errors.bio && (
                <p className="mt-1 text-xs text-red-500">{errors.bio.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  {...register('password')}
                  id="password"
                  type="password"
                  className="input-primary pl-10"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  {...register('confirmPassword')}
                  id="confirmPassword"
                  type="password"
                  className="input-primary pl-10"
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center py-2.5 px-8 bg-accent text-white font-bold rounded-full shadow-md border border-white/20 hover:bg-accent-hover active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

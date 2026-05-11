'use client';

import { useState } from 'react';
import { UserProfile } from '@/lib/api/user';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Settings } from 'lucide-react';
import EditProfileModal from './EditProfileModal';

interface UserProfileHeaderProps {
  user: UserProfile;
}

export default function UserProfileHeader({ user: initialUser }: UserProfileHeaderProps) {
  const { user: currentUser, token } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isOwner = !!token && currentUser?.user_id === initialUser.user_id;
  const user = isOwner ? (currentUser as UserProfile) || initialUser : initialUser;

  return (
    <>
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-indigo-50 mb-8 overflow-hidden relative group transition-all hover:shadow-xl hover:border-indigo-100">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          <div className="relative group/avatar">
            <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-md border-4 border-white transition-transform duration-300 group-hover/avatar:scale-105 bg-indigo-600 flex items-center justify-center">
              {user.avatar_url ? (
                <Image 
                  src={user.avatar_url} 
                  alt={user.username} 
                  width={128} 
                  height={128} 
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-white text-5xl font-black italic tracking-tighter">
                  {user.username[0].toUpperCase()}
                </span>
              )}
            </div>
          </div>

          <div className="flex-grow text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-4 mb-1">
                  <h1 className="text-4xl font-black text-zinc-900 tracking-tight">{user.username}</h1>
                  {isOwner && (
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="p-2 bg-zinc-100 text-zinc-600 rounded-full hover:bg-zinc-200 hover:text-zinc-900 transition-colors shadow-sm"
                      title="Edit Profile"
                      aria-label="Edit Profile"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-indigo-100">
                  {user.role}
                </span>
              </div>
              
              <div className="flex flex-col items-center md:items-end bg-zinc-50 px-4 py-2 rounded-xl border border-zinc-100">
                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Reputation</div>
                <div className="text-3xl font-black text-indigo-600 leading-none tabular-nums">
                  {user.reputation_score.toLocaleString()}
                </div>
              </div>
            </div>

            {user.bio ? (
              <div className="bg-zinc-50/50 p-4 rounded-xl border border-zinc-100/50">
                <p className="text-zinc-600 leading-relaxed">
                  {user.bio}
                </p>
              </div>
            ) : (
              <p className="text-zinc-400 italic">No bio provided yet.</p>
            )}
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
      />
    </>
  );
}

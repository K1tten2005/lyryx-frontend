'use client';

import { useEffect, useState } from 'react';
import { getUserProfile, getUserAnnotations, UserProfile, GetUserAnnotationsOut } from '@/lib/api/user';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [annotations, setAnnotations] = useState<GetUserAnnotationsOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userData, annotationsData] = await Promise.all([
          getUserProfile(parseInt(params.id)),
          getUserAnnotations(parseInt(params.id))
        ]);
        setUser(userData);
        setAnnotations(annotationsData);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {user && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
              <div className="flex items-start gap-6">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.username} className="w-24 h-24 rounded-full object-cover border-2 border-purple-100" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-3xl font-bold">
                    {user.username[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Reputation</span>
                      <span className="text-lg font-bold text-purple-600">{user.reputation_score}</span>
                    </div>
                  </div>
                  <p className="text-sm text-purple-600 font-medium mb-4 uppercase tracking-widest">{user.role}</p>
                  {user.bio && <p className="text-gray-600 leading-relaxed">{user.bio}</p>}
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex gap-8">
                <button className="border-b-2 border-purple-600 py-4 px-1 text-sm font-medium text-purple-600">
                  Annotations ({annotations?.total || 0})
                </button>
              </nav>
            </div>

            <div className="grid gap-6">
              {annotations?.annotations.map((annotation) => (
                <div key={annotation.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  {/* Annotation item placeholder */}
                  <p>{annotation.content}</p>
                </div>
              ))}
              {annotations?.annotations.length === 0 && (
                <p className="text-gray-500 italic text-center py-12">No annotations yet.</p>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

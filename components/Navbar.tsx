import { User } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="w-1/3">
        {/* Placeholder for left-side navigation if needed */}
      </div>

      <div className="w-1/3 flex justify-center">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-zinc-900 hover:text-indigo-800 transition-colors">
          LYRYX
        </Link>
      </div>

      <div className="w-1/3 flex justify-end">
        <button className="flex items-center justify-center p-2 rounded-full text-zinc-600 hover:text-indigo-900 hover:bg-indigo-50 transition-colors">
          <User className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}
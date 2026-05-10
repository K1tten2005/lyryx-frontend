import { User } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-b border-zinc-100">
      <div className="w-1/3">
        {/* Placeholder for left-side navigation if needed */}
      </div>

      <div className="w-1/3 flex justify-center">
        <Link href="/" className="text-2xl font-black tracking-tighter text-indigo-950 hover:text-indigo-700 transition-colors">
          LYRYX
        </Link>
      </div>

      <div className="w-1/3 flex justify-end">
        <button className="flex items-center justify-center p-2.5 rounded-full bg-zinc-50 text-zinc-600 hover:text-indigo-700 hover:bg-indigo-50 transition-all border border-zinc-200 hover:border-indigo-200">
          <User className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}
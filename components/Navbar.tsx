import { User } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-indigo-950 sticky top-0 z-50 shadow-md border-b border-indigo-900">
      <div className="w-1/3">
        {/* Placeholder for left-side navigation if needed */}
      </div>

      <div className="w-1/3 flex justify-center">
        <Link href="/" className="text-2xl font-black tracking-tighter text-white hover:text-indigo-200 transition-colors">
          LYRYX
        </Link>
      </div>

      <div className="w-1/3 flex justify-end">
        <button className="flex items-center justify-center p-2.5 rounded-full bg-indigo-900/50 text-zinc-300 hover:text-white hover:bg-indigo-800 transition-all border border-indigo-800/50 hover:border-indigo-700">
          <User className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}
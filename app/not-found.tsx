import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center relative overflow-hidden px-6">
        {/* Frutiger Aero Orbs */}
        <div className="absolute top-10 right-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl mix-blend-multiply pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-accent-light/30 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>

        <div className="bg-surface bg-glass-panel backdrop-blur-md rounded-3xl border border-white/50 shadow-glass p-12 text-center max-w-lg w-full relative z-10">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-accent to-accent-light rounded-full shadow-inner-glow border-4 border-white/50 flex items-center justify-center mb-6">
            <span className="text-4xl font-black text-white drop-shadow-md">404</span>
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight drop-shadow-md mb-4">
            Page Not Found
          </h2>
          <p className="text-slate-600 font-bold mb-8 drop-shadow-sm">
            The lyrics or page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          <Link 
            href="/" 
            className="inline-flex items-center justify-center py-3 px-8 bg-accent text-white font-bold uppercase tracking-widest rounded-full shadow-md border border-white/20 hover:bg-accent-hover active:scale-95 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
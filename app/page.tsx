import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center relative overflow-hidden">
        {/* Frutiger Aero Orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl mix-blend-multiply pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent-light/30 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>

        <div className="z-10 w-full text-center px-6 mt-16 relative">
          <div className="absolute inset-0 bg-white/20 backdrop-blur-xl rounded-[3rem] border border-white/50 shadow-glass -z-10 max-w-4xl mx-auto h-[120%] -top-[10%]"></div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-slate-800 drop-shadow-md">
            Understand the Music.
          </h1>
          <p className="text-xl text-slate-700 mb-12 max-w-2xl mx-auto font-bold bg-white/50 py-2 px-6 rounded-full shadow-inner-glow inline-block border border-white/60">
            Search for lyrics, read annotations, and explore the meaning behind your favorite songs with AI.
          </p>
          
          <SearchBar />
        </div>
      </main>

      <Footer />
    </div>
  );
}
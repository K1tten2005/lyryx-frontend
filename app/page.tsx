import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center relative">
        <div className="z-10 w-full text-center px-6 mt-16">
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter text-slate-800 drop-shadow-md">
            Understand the Music.
          </h1>
          <p className="text-xl text-zinc-600 mb-10 max-w-2xl mx-auto font-medium">
            Search for lyrics, read annotations, and explore the meaning behind your favorite songs with AI.
          </p>
          
          <SearchBar />
        </div>
      </main>

      <Footer />
    </div>
  );
}
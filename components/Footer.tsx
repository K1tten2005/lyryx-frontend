export default function Footer() {
  return (
    <footer className="w-full py-8 mt-auto bg-gradient-to-b from-indigo-900 to-indigo-950 flex flex-col items-center justify-center text-white text-sm shadow-inner-glow border-t border-indigo-800">
      <p className="font-bold tracking-widest uppercase">© {new Date().getFullYear()} Lyryx. All rights reserved.</p>
    </footer>
  );
}
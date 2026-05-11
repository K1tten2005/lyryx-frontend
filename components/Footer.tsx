export default function Footer() {
  return (
    <footer className="w-full py-8 mt-auto bg-indigo-950 flex flex-col items-center justify-center text-zinc-300 text-sm">
      <p className="font-medium">© {new Date().getFullYear()} Lyryx. All rights reserved.</p>
    </footer>
  );
}
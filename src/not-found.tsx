import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl md:text-8xl font-black text-[#ccff00] mb-4">404</div>
      <h2 className="text-xl md:text-2xl font-bold uppercase mb-2">This page could not be found.</h2>
      <p className="text-gray-400 text-xs md:text-sm mb-8">The page you are looking for might have been removed or is temporarily unavailable.</p>
      <Link 
        href="/"
        className="bg-[#ccff00] text-black font-black text-xs px-6 py-3.5 rounded-xl hover:bg-[#b3e600] transition"
      >
        Return Home
      </Link>
    </main>
  );
}
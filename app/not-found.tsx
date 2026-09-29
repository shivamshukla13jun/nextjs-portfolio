import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col items-center justify-center space-y-4 font-mono text-sm">
      <span className="text-5xl font-extrabold text-blue-500">404</span>
      <p className="text-slate-400">Page not found.</p>
      <Link href="/" className="text-blue-400 underline text-xs">
        Back to home
      </Link>
    </div>
  );
}

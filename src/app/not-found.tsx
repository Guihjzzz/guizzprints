import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#07090D] px-6 py-24 text-center text-[#F8FAFC]">
      <div className="mx-auto max-w-xl rounded-3xl border border-[#1D2433] bg-[#111318] p-10 shadow-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">GuizzMods</p>
        <h1 className="text-5xl font-black tracking-tight">404</h1>
        <p className="mt-4 text-zinc-300">This page could not be found. Explore the catalog from one of these entrances.</p>
        <nav aria-label="404 navigation" className="mt-8 flex flex-wrap justify-center gap-3">
          {[
            ['English home', '/en'],
            ['Página inicial', '/pt'],
            ['Inicio', '/es'],
            ['Search', '/en/search'],
          ].map(([label, href]) => <Link key={href} href={href} className="rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-blue-200 transition hover:bg-blue-500/20">{label}</Link>)}
        </nav>
      </div>
    </main>
  );
}

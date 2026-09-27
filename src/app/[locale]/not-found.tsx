import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#07090D] px-6 py-24 text-center text-[#F8FAFC]">
      <div className="mx-auto max-w-xl rounded-3xl border border-[#1D2433] bg-[#111318] p-10 shadow-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Guizzprints</p>
        <h1 className="text-5xl font-black tracking-tight">404</h1>
        <p className="mt-4 text-zinc-300">Esta página não foi encontrada. Volte ao catálogo para continuar.</p>
        <nav aria-label="Navegação da página 404" className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/pt" className="rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-blue-200 transition hover:bg-blue-500/20">Página inicial</Link>
          <Link href="/pt/search" className="rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-blue-200 transition hover:bg-blue-500/20">Buscar</Link>
        </nav>
      </div>
    </main>
  );
}

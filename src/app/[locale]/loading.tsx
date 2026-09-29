export default function LocaleLoading() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[1800px] space-y-6 p-3 sm:p-6 lg:p-8" aria-busy="true" aria-label="Carregando conteúdo">
      <div className="h-9 w-48 rounded-lg bg-[#111318] motion-safe:animate-pulse" />
      <div className="h-12 w-full max-w-2xl rounded-xl bg-[#111318] motion-safe:animate-pulse" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-5">
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-[#1D2433] bg-[#111318]">
            <div className="aspect-square bg-[#0A0D14] motion-safe:animate-pulse" />
            <div className="space-y-2 p-3">
              <div className="h-3 w-4/5 rounded bg-zinc-800 motion-safe:animate-pulse" />
              <div className="h-2.5 w-2/5 rounded bg-zinc-800/70 motion-safe:animate-pulse" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Carregando catálogo</span>
    </div>
  );
}

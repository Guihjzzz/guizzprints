export default function ModLoading() {
  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-6 p-3 sm:p-6 lg:p-8" aria-busy="true" aria-label="Carregando construção">
      <div className="h-4 w-56 rounded bg-[#111318] motion-safe:animate-pulse" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8"><div className="aspect-square w-full rounded-2xl border border-[#1D2433] bg-[#111318] motion-safe:animate-pulse" /></div>
        <div className="space-y-4 lg:col-span-4">
          <div className="mx-auto h-9 w-4/5 rounded bg-[#111318] motion-safe:animate-pulse" />
          <div className="h-36 rounded-2xl border border-[#1D2433] bg-[#111318] motion-safe:animate-pulse" />
          <div className="h-48 rounded-2xl border border-[#1D2433] bg-[#111318] motion-safe:animate-pulse" />
        </div>
      </div>
    </div>
  );
}

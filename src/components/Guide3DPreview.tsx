'use client';

export function Guide3DPreview({ schemUrl, title }: { schemUrl: string; title: string }) {
  const src = `/guide3d/embed.html?model=${encodeURIComponent(schemUrl)}&title=${encodeURIComponent(title)}`;

  return (
    <div className="absolute inset-0 bg-[#050608]">
      <iframe
        title={`Guia 3D de ${title}`}
        src={src}
        className="h-full w-full border-0"
        allow="fullscreen"
      />
      <a
        href="/guide3d/studio/index.html"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 left-3 z-10 rounded-lg border border-red-400/40 bg-black/80 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-red-100 shadow-lg backdrop-blur transition hover:border-red-300 hover:bg-red-950/90"
      >
        Abrir conversor e estúdio completo
      </a>
    </div>
  );
}

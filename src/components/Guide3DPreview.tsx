'use client';

import { Box, Layers3, MousePointer2 } from 'lucide-react';

export function Guide3DPreview({ schemUrl, title }: { schemUrl: string; title: string }) {
  const src = `/guide3d/embed.html?model=${encodeURIComponent(schemUrl)}&title=${encodeURIComponent(title)}`;

  return (
    <div className="absolute inset-0 flex flex-col bg-[#050608]">
      <iframe
        title={`Guia 3D de ${title}`}
        src={src}
        className="min-h-0 flex-1 border-0"
        allow="fullscreen"
      />
      <div className="flex shrink-0 flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-white/10 bg-black px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
        <span className="flex items-center gap-1.5"><MousePointer2 size={13} className="text-red-400" /> Arraste para girar</span>
        <span className="flex items-center gap-1.5"><Box size={13} className="text-red-400" /> Role para zoom</span>
        <span className="flex items-center gap-1.5"><Layers3 size={13} className="text-red-400" /> Barra inferior: camadas</span>
      </div>
    </div>
  );
}

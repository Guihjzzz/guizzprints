'use client';

import { Box, Eye, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export function Guide3DPreview({
  modelUrl,
  schemUrl,
  title,
}: {
  modelUrl: string;
  schemUrl?: string | null;
  title: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(0);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // The Guide carries the 3D engine and block textures. Do not create it until
  // a visitor explicitly opens it; blanking/removing the frame releases WebGL,
  // its memory and any hologram work when it closes or the route changes.
  const releaseViewer = useCallback(() => {
    const frame = frameRef.current;
    if (frame) frame.src = 'about:blank';
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const closeForNavigation = () => releaseViewer();
    window.addEventListener('pagehide', closeForNavigation);
    return () => {
      window.removeEventListener('pagehide', closeForNavigation);
      const frame = frameRef.current;
      if (frame) frame.src = 'about:blank';
    };
  }, [releaseViewer]);

  const openViewer = () => {
    setSession((value) => value + 1);
    setIsOpen(true);
  };

  if (!isOpen) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center gap-5 bg-[radial-gradient(circle_at_50%_24%,rgba(37,99,235,.22),transparent_38%),#080a0f] px-5 py-10 text-center sm:min-h-96">
        <span className="rounded-2xl border border-blue-400/30 bg-blue-500/10 p-4 text-blue-300">
          <Box size={30} aria-hidden="true" />
        </span>
        <div className="max-w-md">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-400">Guia 3D Guizz</p>
          <h3 className="mt-2 text-lg font-black text-white sm:text-xl">Veja a construção por camadas</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">O visualizador 3D carrega somente quando você pedir para abrir.</p>
        </div>
        <button
          type="button"
          onClick={openViewer}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-blue-400/50 bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-[0_10px_28px_-16px_rgba(37,99,235,.95)] transition hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Eye size={18} aria-hidden="true" />
          Abrir visualizador 3D
        </button>
      </div>
    );
  }

  // Reuse the publisher-generated .schem whenever available, avoiding a
  // conversion in the visitor's browser. A new session creates a fresh,
  // disposable viewer after each close.
  const previewFile = schemUrl || modelUrl;
  const src = `/guide3d/guia-preview.html?model=${encodeURIComponent(previewFile)}&title=${encodeURIComponent(title)}&session=${session}`;

  return (
    <div className="relative h-[min(72vh,680px)] min-h-96 bg-[#050608] sm:h-[min(76vh,760px)]">
      <iframe
        ref={frameRef}
        title={`Guia 3D de ${title}`}
        src={src}
        className="h-full w-full border-0"
        allow="fullscreen"
      />
      <button
        type="button"
        onClick={releaseViewer}
        className="absolute right-3 top-3 inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/20 bg-[#07090d]/90 px-3 text-xs font-black text-white shadow-lg backdrop-blur transition hover:border-blue-400/70 hover:bg-blue-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <X size={16} aria-hidden="true" />
        Fechar
      </button>
    </div>
  );
}

'use client';

import { Box, Eye, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const GUIDE_WARMUP_ASSETS = [
  '/guide3d/guia-preview.html',
  '/guide3d/publisher.html',
  '/guide3d/engine/viewer.html',
  '/guide3d/engine/default-pack-qbd56b31a39.js',
  '/guide3d/engine/original-block-textures.js?v=2',
  '/guide3d/cdn/cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  '/guide3d/cdn/cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js',
  '/guide3d/cdn/cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
];

function guideSourceUrl(source: string) {
  if (!source || typeof window === 'undefined') return '';

  try {
    const url = new URL(source, window.location.origin);
    if (url.origin === window.location.origin && url.pathname.startsWith('/demo/')) {
      return `${url.pathname}${url.search}`;
    }
    if (
      url.protocol === 'https:'
      && url.hostname === 'github.com'
      && url.pathname.startsWith('/Guizzhjz/guizzprints-assets/releases/download/')
    ) {
      return `/api/guide3d/source?url=${encodeURIComponent(url.toString())}`;
    }
  } catch {
    // The visible viewer will report an unavailable construction when needed.
  }

  return '';
}

function addPrefetch(url: string) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  link.dataset.guizzGuideWarmup = 'true';
  document.head.appendChild(link);
  return link;
}

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
  const shellRef = useRef<HTMLDivElement>(null);
  const warmedRef = useRef(false);

  // Publications created with the original converter already have their .schem
  // ready.  Loading it directly avoids opening the converter for every reader.
  // Older publications without it continue with their source .mcstructure.
  const previewFile = schemUrl || modelUrl || '';
  const sourceUrl = guideSourceUrl(previewFile);

  const warmGuide = useCallback(() => {
    if (warmedRef.current || !sourceUrl) return;
    warmedRef.current = true;

    // Prefetch only downloads same-site assets; it never mounts WebGL, opens an
    // iframe, or starts rendering the hologram before the visitor chooses it.
    GUIDE_WARMUP_ASSETS.forEach(addPrefetch);
    const sourceLink = addPrefetch(sourceUrl);

    // The model itself can be large. Keep this work off the initial route and
    // start it with low urgency once the Guide is near the viewport or intent is
    // shown. force-cache lets the click reuse the bytes when the browser permits.
    const controller = new AbortController();
    window.setTimeout(() => {
      void fetch(sourceUrl, {
        cache: 'force-cache',
        credentials: 'same-origin',
        signal: controller.signal,
      }).catch(() => undefined);
    }, 300);

    return () => {
      controller.abort();
      sourceLink.remove();
    };
  }, [sourceUrl]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || !sourceUrl || isOpen) return;

    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        warmGuide();
        observer.disconnect();
      },
      { rootMargin: '800px 0px' },
    );
    observer.observe(shell);
    return () => observer.disconnect();
  }, [isOpen, sourceUrl, warmGuide]);

  // The Guide carries the 3D engine and block textures. Do not create it until
  // a visitor explicitly opens it; blanking/removing the frame releases WebGL,
  // its memory and any hologram work when it closes or the route changes.
  const releaseViewer = useCallback(() => {
    const frame = frameRef.current;
    if (frame) frame.src = 'about:blank';
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const frame = frameRef.current;
    const closeForNavigation = () => releaseViewer();
    window.addEventListener('pagehide', closeForNavigation);
    return () => {
      window.removeEventListener('pagehide', closeForNavigation);
      if (frame) frame.src = 'about:blank';
    };
  }, [isOpen, releaseViewer]);

  const openViewer = () => {
    warmGuide();
    setSession((value) => value + 1);
    setIsOpen(true);
  };

  if (!isOpen) {
    return (
      <div ref={shellRef} className="flex min-h-72 flex-col items-center justify-center gap-5 bg-[radial-gradient(circle_at_50%_24%,rgba(37,99,235,.22),transparent_38%),#080a0f] px-5 py-10 text-center sm:min-h-96">
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
          onPointerEnter={warmGuide}
          onFocus={warmGuide}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-blue-400/50 bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-[0_10px_28px_-16px_rgba(37,99,235,.95)] transition hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Eye size={18} aria-hidden="true" />
          Abrir visualizador 3D
        </button>
      </div>
    );
  }

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

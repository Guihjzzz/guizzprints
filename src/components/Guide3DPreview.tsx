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
    </div>
  );
}

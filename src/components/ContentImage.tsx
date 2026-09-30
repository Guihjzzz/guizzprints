'use client';

import { useEffect, useState } from 'react';
import type { ImageProps } from 'next/image';
import { OptimizedImage } from '@/components/OptimizedImage';

type ContentImageProps = {
  src?: string | null;
  alt: string;
  optimizeWidth: number;
  optimizeHeight?: number;
  optimizeQuality?: number;
  sizes: string;
  className?: string;
  loading?: ImageProps['loading'];
  priority?: boolean;
  fetchPriority?: ImageProps['fetchPriority'];
};

/**
 * A stable media frame for catalogue art. The image is always mounted so the
 * browser can begin loading immediately; the small shimmer is removed only
 * after the final, optimized image is ready. This prevents an empty card on
 * slower mobile connections without blocking the rest of the interface.
 */
export function ContentImage({
  src,
  alt,
  optimizeWidth,
  optimizeHeight,
  optimizeQuality,
  sizes,
  className,
  loading = 'lazy',
  priority,
  fetchPriority,
}: ContentImageProps) {
  const resolvedSource = src?.trim() || '/guizz-cover.jpg';
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(false), [resolvedSource]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0f18]">
      <OptimizedImage
        src={resolvedSource}
        optimizeWidth={optimizeWidth}
        optimizeHeight={optimizeHeight}
        optimizeQuality={optimizeQuality}
        alt={alt}
        fill
        sizes={sizes}
        loading={loading}
        priority={priority}
        fetchPriority={fetchPriority}
        onLoad={() => setReady(true)}
        className={className}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-[1] grid place-items-center bg-[linear-gradient(115deg,rgba(10,15,24,.96),rgba(37,99,235,.16),rgba(10,15,24,.96))] bg-[length:200%_100%] transition-opacity duration-300 motion-safe:animate-[guizz-image-shimmer_1.25s_ease-in-out_infinite] ${ready ? 'opacity-0' : 'opacity-100'}`}
      >
        <span className="size-7 rounded-full border-2 border-blue-200/30 border-t-blue-300 motion-safe:animate-spin" />
      </div>
    </div>
  );
}

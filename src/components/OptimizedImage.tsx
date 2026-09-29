'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { optimizedImageSrcSet, optimizedImageUrl } from '@/lib/media-image';

type OptimizedImageProps = Omit<ImageProps, 'src'> & {
  src: string;
  optimizeWidth: number;
  optimizeHeight?: number;
  optimizeQuality?: number;
};

/**
 * Uses our bounded WebP route for remote media and falls back to the original
 * source if a third-party host is unavailable. This keeps catalog cards
 * reliable while making the common path substantially smaller.
 */
export function OptimizedImage({
  src,
  optimizeWidth,
  optimizeHeight,
  optimizeQuality,
  alt,
  sizes,
  onError,
  ...props
}: OptimizedImageProps) {
  const originalSrc = src || '/guizz-cover.jpg';
  const transformedSrc = useMemo(
    () => optimizedImageUrl(originalSrc, optimizeWidth, optimizeHeight, optimizeQuality),
    [originalSrc, optimizeHeight, optimizeQuality, optimizeWidth],
  );
  const transformedSrcSet = useMemo(
    () => optimizedImageSrcSet(originalSrc, optimizeWidth, optimizeHeight, optimizeQuality),
    [originalSrc, optimizeHeight, optimizeQuality, optimizeWidth],
  );
  const [sourceStage, setSourceStage] = useState<'optimized' | 'original' | 'fallback'>('optimized');
  const useOriginal = sourceStage === 'original';
  const useFallback = sourceStage === 'fallback';
  const usesFill = Boolean(props.fill);

  // A card can be reused for a different construction during client-side
  // navigation. Reset the fallback ladder as soon as its source changes.
  useEffect(() => setSourceStage('optimized'), [originalSrc, transformedSrc]);

  const renderedSrc = useFallback ? '/guizz-cover.jpg' : useOriginal ? originalSrc : transformedSrc;

  const image = (
    <Image
      {...props}
      alt={alt || ''}
      sizes={sizes}
      src={renderedSrc}
      onError={(event) => {
        if (sourceStage === 'optimized' && transformedSrc !== originalSrc) setSourceStage('original');
        else if (!useFallback && originalSrc !== '/guizz-cover.jpg') setSourceStage('fallback');
        onError?.(event);
      }}
    />
  );

  // Next's fill implementation requires its immediate parent to establish the
  // positioning context. A `<picture>` would become that parent, so for fill
  // images keep the optimized source and let the caller's positioned wrapper
  // remain the direct parent.
  return transformedSrcSet && sourceStage === 'optimized' && !usesFill ? (
    <picture className="relative block h-full w-full">
      <source srcSet={transformedSrcSet} sizes={sizes} />
      {image}
    </picture>
  ) : image;
}

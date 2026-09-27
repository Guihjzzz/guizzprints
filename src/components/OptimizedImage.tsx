'use client';

import Image, { type ImageProps } from 'next/image';
import { useMemo, useState } from 'react';
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
  const originalSrc = src || '/logo.jpg';
  const transformedSrc = useMemo(
    () => optimizedImageUrl(originalSrc, optimizeWidth, optimizeHeight, optimizeQuality),
    [originalSrc, optimizeHeight, optimizeQuality, optimizeWidth],
  );
  const transformedSrcSet = useMemo(
    () => optimizedImageSrcSet(originalSrc, optimizeWidth, optimizeHeight, optimizeQuality),
    [originalSrc, optimizeHeight, optimizeQuality, optimizeWidth],
  );
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const useOriginal = failedSource === transformedSrc;

  const image = (
    <Image
      {...props}
      alt={alt || ''}
      sizes={sizes}
      src={useOriginal ? originalSrc : transformedSrc}
      onError={(event) => {
        if (!useOriginal && transformedSrc !== originalSrc) setFailedSource(transformedSrc);
        onError?.(event);
      }}
    />
  );

  return transformedSrcSet && !useOriginal ? (
    <picture>
      <source srcSet={transformedSrcSet} sizes={sizes} />
      {image}
    </picture>
  ) : image;
}

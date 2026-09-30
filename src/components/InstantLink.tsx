'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';
import type { ComponentProps } from 'react';

type InstantLinkProps = ComponentProps<typeof Link>;

/**
 * Starts an internal route fetch at the first sign of intent. Next still
 * handles viewport prefetching, while hover, focus and touch warm pages that
 * are about to be opened without starting work for the entire catalog.
 */
export function InstantLink({
  href,
  onFocus,
  onPointerEnter,
  onTouchStart,
  prefetch,
  ...props
}: InstantLinkProps) {
  const router = useRouter();
  const wasWarmed = useRef(false);

  const warm = useCallback(() => {
    if (wasWarmed.current || typeof href !== 'string') return;
    wasWarmed.current = true;
    router.prefetch(href);
  }, [href, router]);

  return (
    <Link
      {...props}
      href={href}
      prefetch={prefetch ?? true}
      onPointerEnter={(event) => {
        warm();
        onPointerEnter?.(event);
      }}
      onFocus={(event) => {
        warm();
        onFocus?.(event);
      }}
      onTouchStart={(event) => {
        warm();
        onTouchStart?.(event);
      }}
    />
  );
}

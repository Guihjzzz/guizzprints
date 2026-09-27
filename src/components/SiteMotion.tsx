'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/** Progressive enhancement: content remains visible before hydration and without WAAPI. */
export function SiteMotion() {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    const isNavigation = previousPath.current !== null && previousPath.current !== pathname;
    previousPath.current = pathname;
    const main = document.querySelector<HTMLElement>('[data-site-content]');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!isNavigation || !main || preference.matches || typeof main.animate !== 'function') return;

    // Opacity only: never create a transformed containing block for fixed dialogs.
    const animation = main.animate([{ opacity: 0.96 }, { opacity: 1 }], {
      duration: 220,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    });
    const cancelWhenReduced = () => { if (preference.matches) animation.cancel(); };
    preference.addEventListener('change', cancelWhenReduced);
    return () => {
      animation.cancel();
      preference.removeEventListener('change', cancelWhenReduced);
    };
  }, [pathname]);

  return null;
}

import type { ElementType, ReactNode } from 'react';
import { AdsterraSidebar, AdsterraInlineBanner, type AdPlacement } from './AdsterraSidebar';
import { VipAdGate } from './VipAdGate';
import AdblockGuard from './AdblockGuard';

type AdPlaceholderProps = {
  as?: 'div' | 'aside';
  children: ReactNode;
  className: string;
  format: AdPlacement;
  refreshKey?: number;
};

export function AdPlaceholder({ as = 'div', children, className, format, refreshKey = 0 }: AdPlaceholderProps) {
  const Component = as as ElementType;

  if (process.env.NODE_ENV === 'production') {
    const sidebar = format === 'sidebar' || format === 'sidebar-stack';
    const ad = sidebar
      ? <AdsterraSidebar />
      : <AdsterraInlineBanner format={format} refreshKey={refreshKey} />;
    // Side rails must be the sticky item in the page flex row. An extra shell
    // with the same height as the rail would become its containing block and
    // prevent CSS sticky from following the document scroll.
    if (sidebar) return <VipAdGate><AdblockGuard>{ad}</AdblockGuard></VipAdGate>;

    // Inline placements keep one neutral layout shell. The provider owns the
    // creative dimensions; callers should not add bordered/fixed-height boxes.
    const reservedHeight = format === 'rectangle' ? 284
      : format === 'leaderboard' ? 124
      : format === 'download-banner' ? 94
      : 92;
    return (
      <Component
        className={`${className} ad-slot-shell`}
        data-ad-slot={format}
        style={{ minHeight: reservedHeight }}
      >
        <VipAdGate><AdblockGuard>{ad}</AdblockGuard></VipAdGate>
      </Component>
    );
  }

  return (
    <Component className={className} data-development-ad-placeholder>
      {children}
    </Component>
  );
}
